import mongoose from "mongoose";
import PlacementCompany from "../models/PlacementCompany.js";
import PlacementQuestion from "../models/PlacementQuestion.js";
import PlacementProgress from "../models/PlacementProgress.js";
import axios from "axios";
import vm from "vm";
import { callAiApi } from "./assistant.controller.js";

// ─────────────────────────────────────────────────────────────────────────────
// Language mapping for sandboxed code execution
// ─────────────────────────────────────────────────────────────────────────────
const LANG_MAP = {
  javascript: "javascript",
  js: "javascript",
  python: "python",
  python3: "python",
  cpp: "cpp",
  "c++": "cpp",
  c: "c",
  java: "java",
};

/**
 * Helper to ensure a user has a PlacementProgress document
 */
const getOrCreateProgress = async (userId) => {
  let progress = await PlacementProgress.findOne({ userId });
  if (!progress) {
    progress = await PlacementProgress.create({
      userId,
      solvedQuestions: [],
      bookmarkedQuestions: [],
      mockTestHistory: [],
    });
  }
  return progress;
};

/**
 * 1. GET /api/placement/companies
 * Returns list of companies with user readiness percentage and total stats
 */
export const getCompanies = async (req, res) => {
  try {
    const userId = req.user?._id;

    const [companies, progress, allQuestions] = await Promise.all([
      PlacementCompany.find({ active: true }).sort({ order: 1, name: 1 }).lean(),
      userId
        ? PlacementProgress.findOne({ userId }).select("solvedQuestions").lean()
        : Promise.resolve(null),
      PlacementQuestion.find({}).select("_id category companies difficulty").lean(),
    ]);

    const solvedSet = new Set(
      (progress?.solvedQuestions || [])
        .filter((q) => q?.isCorrect)
        .map((q) => q?.questionId?.toString())
    );

    const enrichedCompanies = companies.map((comp) => {
      const compQuestions = allQuestions.filter((q) => (q.companies || []).includes(comp.slug));
      const totalCount = compQuestions.length;
      const totalCoding = compQuestions.filter((q) => q.category === "coding").length;

      const solvedCount = compQuestions.filter((q) => solvedSet.has(q._id.toString())).length;
      const readinessPercent = totalCount > 0 ? Math.min(100, Math.round((solvedCount / totalCount) * 100)) : 0;

      return {
        ...comp,
        stats: {
          ...comp.stats,
          totalQuestions: totalCount,
          totalCoding: totalCoding,
        },
        userProgress: {
          solvedCount,
          totalCount,
          readinessPercent,
        },
      };
    });

    res.status(200).json({
      success: true,
      companies: enrichedCompanies,
    });
  } catch (error) {
    console.error("Error in getCompanies:", error);
    res.status(500).json({ success: false, message: "Failed to fetch placement companies." });
  }
};

/**
 * 2. GET /api/placement/companies/:slug
 * Returns detailed company profile, hiring rounds, and category-wise readiness
 */
export const getCompanyDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?._id;
    const compSlug = slug.toLowerCase();

    const [company, progress, questions] = await Promise.all([
      PlacementCompany.findOne({ slug: compSlug }).lean(),
      userId
        ? PlacementProgress.findOne({ userId }).select("solvedQuestions").lean()
        : Promise.resolve(null),
      PlacementQuestion.find({ companies: compSlug }).select("_id category topics").lean(),
    ]);

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found." });
    }

    const solvedMap = new Map();
    (progress?.solvedQuestions || []).forEach((item) => {
      if (item?.questionId) {
        solvedMap.set(item.questionId.toString(), item);
      }
    });

    const categories = ["aptitude", "english", "technical", "coding", "interview"];
    const categoryStats = {};

    let totalCompanyQuestions = 0;
    let totalSolved = 0;
    const weakTopicsMap = {};

    categories.forEach((cat) => {
      const catQuestions = questions.filter((q) => q.category === cat);
      const catTotal = catQuestions.length;
      const catSolved = catQuestions.filter((q) => {
        const attempt = solvedMap.get(q._id.toString());
        return attempt && attempt.isCorrect;
      }).length;

      // Track weak topics for incorrect answers
      catQuestions.forEach((q) => {
        const attempt = solvedMap.get(q._id.toString());
        if (attempt && !attempt.isCorrect) {
          (q.topics || []).forEach((topic) => {
            weakTopicsMap[topic] = (weakTopicsMap[topic] || 0) + 1;
          });
        }
      });

      const percent = catTotal > 0 ? Math.round((catSolved / catTotal) * 100) : 0;

      categoryStats[cat] = {
        total: catTotal,
        solved: catSolved,
        percent,
      };

      totalCompanyQuestions += catTotal;
      totalSolved += catSolved;
    });

    const overallReadiness = totalCompanyQuestions > 0
      ? Math.min(100, Math.round((totalSolved / totalCompanyQuestions) * 100))
      : 0;

    // Identify top weak topics
    const weakTopics = Object.entries(weakTopicsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);

    // Formulate actionable recommendations
    const recommendations = [];
    if (categoryStats.coding.percent < 60) {
      recommendations.push(`Solve ${Math.max(2, categoryStats.coding.total - categoryStats.coding.solved)} more coding problems for ${company.name}`);
    }
    if (categoryStats.aptitude.percent < 70) {
      recommendations.push("Practice 10 Quantitative Aptitude & Speed/Time questions");
    }
    if (weakTopics.length > 0) {
      recommendations.push(`Strengthen weak topic: ${weakTopics[0]}`);
    }
    if (categoryStats.interview.percent < 50) {
      recommendations.push("Review Technical & STAR-method HR interview questions");
    }
    if (recommendations.length === 0) {
      recommendations.push("Take a full-length Mock OA Assessment to test your peak readiness!");
    }

    res.status(200).json({
      success: true,
      company,
      readiness: {
        overall: overallReadiness,
        categories: categoryStats,
        weakTopics,
        recommendations,
        totalSolved,
        totalQuestions: totalCompanyQuestions,
      },
    });
  } catch (error) {
    console.error("Error in getCompanyDetails:", error);
    res.status(500).json({ success: false, message: "Failed to fetch company details." });
  }
};

/**
 * 3. GET /api/placement/questions
 * Returns paginated questions with filtering
 */
export const getQuestions = async (req, res) => {
  try {
    const {
      company,
      category,
      topic,
      difficulty,
      frequency,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const userId = req.user?._id;
    const filter = {};

    if (company && company !== "all") {
      filter.companies = company.toLowerCase();
    }

    if (category && category !== "all") {
      filter.category = category.toLowerCase();
    }

    if (topic && topic !== "all") {
      filter.topics = topic;
    }

    if (difficulty && difficulty !== "all") {
      filter.difficulty = difficulty;
    }

    if (frequency && frequency !== "all") {
      filter.frequency = frequency;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { topics: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const numLimit = Number(limit);

    const distinctTopicFilter = {
      ...(company && company !== "all" ? { companies: company.toLowerCase() } : {}),
      ...(category && category !== "all" ? { category: category.toLowerCase() } : {}),
    };

    // Execute all database queries in parallel with .lean() for maximum performance
    const [total, questions, userProgress, topics] = await Promise.all([
      PlacementQuestion.countDocuments(filter),
      PlacementQuestion.find(filter)
        .sort({ frequency: 1, createdAt: -1 })
        .skip(skip)
        .limit(numLimit)
        .lean(),
      userId
        ? PlacementProgress.findOne({ userId })
            .select("solvedQuestions bookmarkedQuestions")
            .lean()
        : Promise.resolve(null),
      PlacementQuestion.distinct("topics", distinctTopicFilter),
    ]);

    const solvedMap = new Map();
    (userProgress?.solvedQuestions || []).forEach((item) => {
      if (item?.questionId) {
        solvedMap.set(item.questionId.toString(), item);
      }
    });

    const bookmarkedSet = new Set(
      (userProgress?.bookmarkedQuestions || []).map((id) => (id?._id || id).toString())
    );

    const enrichedQuestions = questions.map((q) => {
      const qIdStr = q._id.toString();
      const attempt = solvedMap.get(qIdStr);
      return {
        ...q,
        isSolved: attempt ? attempt.isCorrect : false,
        userAttempt: attempt || null,
        isBookmarked: bookmarkedSet.has(qIdStr),
      };
    });

    res.status(200).json({
      success: true,
      questions: enrichedQuestions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / numLimit) || 1,
      },
      availableTopics: topics,
    });
  } catch (error) {
    console.error("Error in getQuestions:", error);
    res.status(500).json({ success: false, message: "Failed to fetch questions." });
  }
};

/**
 * 4. GET /api/placement/questions/:id
 * Fetches single question with full details (hints, testcases, solution)
 */
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const [question, progress] = await Promise.all([
      PlacementQuestion.findById(id).lean(),
      userId
        ? PlacementProgress.findOne({ userId })
            .select("solvedQuestions bookmarkedQuestions")
            .lean()
        : Promise.resolve(null),
    ]);

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    let isSolved = false;
    let isBookmarked = false;
    let userAttempt = null;

    if (progress) {
      const attempt = (progress.solvedQuestions || []).find(
        (item) => item?.questionId?.toString() === id
      );
      if (attempt) {
        isSolved = attempt.isCorrect;
        userAttempt = attempt;
      }
      isBookmarked = (progress.bookmarkedQuestions || []).some(
        (bId) => (bId?._id || bId).toString() === id
      );
    }

    res.status(200).json({
      success: true,
      question: {
        ...question,
        isSolved,
        isBookmarked,
        userAttempt,
      },
    });
  } catch (error) {
    console.error("Error in getQuestionById:", error);
    res.status(500).json({ success: false, message: "Failed to fetch question." });
  }
};

/**
 * 5. POST /api/placement/submit-answer
 * Submits an answer for MCQ (Aptitude, English, Technical) with instant response
 */
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, userChoice } = req.body;
    const userId = req.user?._id;

    if (!questionId || userChoice === undefined) {
      return res.status(400).json({ success: false, message: "questionId and userChoice are required." });
    }

    const question = await PlacementQuestion.findById(questionId)
      .select("correctAnswer explanation formula category")
      .lean();

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    const isCorrect = Number(userChoice) === Number(question.correctAnswer);

    // Fast atomic progress persistence
    if (userId) {
      const attemptEntry = {
        questionId: question._id,
        category: question.category,
        isCorrect,
        userChoice,
        attemptedAt: new Date(),
      };

      await PlacementProgress.updateOne(
        { userId },
        {
          $pull: { solvedQuestions: { questionId: question._id } },
        },
        { upsert: true }
      );

      await PlacementProgress.updateOne(
        { userId },
        {
          $push: { solvedQuestions: attemptEntry },
        }
      );
    }

    // Return instant validation result
    res.status(200).json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      formula: question.formula,
    });
  } catch (error) {
    console.error("Error in submitAnswer:", error);
    res.status(500).json({ success: false, message: "Failed to submit answer." });
  }
};

/**
 * Normalizes output strings for robust comparison across languages
 */
const normalizeOutput = (val) => {
  if (val === undefined || val === null) return "";
  let s = String(val)
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .replace(/\[\s+/g, "[")
    .replace(/\s+\]/g, "]")
    .replace(/,\s+/g, ",")
    .replace(/\\"/g, '"')
    .toLowerCase()
    .trim();

  // Strip enclosing quotes for strings (e.g. '"fl"' -> 'fl', '""' -> '')
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    if (s.length >= 2 && !s.includes('[') && !s.includes(']')) {
      s = s.substring(1, s.length - 1).trim();
    }
  }
  return s;
};

/**
 * Production-Grade Sandboxed Execution Engine
 */
const executeSandboxedCode = async (code, language, stdin = "") => {
  const lang = language?.toLowerCase() || "javascript";
  const oneCompilerLang = LANG_MAP[lang] || "javascript";

  // Tier 1: Instant Native JavaScript Sandboxing via Node VM
  if (lang === "javascript" || lang === "js") {
    try {
      const startTime = Date.now();
      const logs = [];
      const lines = stdin.split("\n").map((l) => l.trim()).filter(Boolean);
      const parsedArgs = lines.map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return line;
        }
      });

      const sandbox = {
        console: {
          log: (...args) => logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
          error: (...args) => logs.push("[ERROR] " + args.join(" ")),
        },
        args: parsedArgs,
        result: undefined,
        input: stdin,
      };

      // Detect solution function name
      const fnMatch = code.match(
        /(?:function\s+([a-zA-Z0-9_$]+)|(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:function|\([^)]*\)\s*=>|[a-zA-Z0-9_$]+\s*=>))/
      );
      const fnName = fnMatch ? fnMatch[1] || fnMatch[2] : null;

      const harness = `
        function ListNode(val, next) {
          this.val = (val === undefined ? 0 : val);
          this.next = (next === undefined ? null : next);
        }

        function __buildLinkedList(arr, pos = -1) {
          if (!Array.isArray(arr) || arr.length === 0) return null;
          const nodes = arr.map(v => new ListNode(v));
          for (let i = 0; i < nodes.length - 1; i++) {
            nodes[i].next = nodes[i + 1];
          }
          if (typeof pos === 'number' && pos >= 0 && pos < nodes.length) {
            nodes[nodes.length - 1].next = nodes[pos];
          }
          return nodes[0];
        }

        ${code}

        let __callArgs = [...args];
        if (__callArgs.length > 0 && Array.isArray(__callArgs[0]) && (${fnName === "hasCycle" || fnName === "detectCycle" || code.includes("ListNode")})) {
          const arr = __callArgs[0];
          const pos = typeof __callArgs[1] === 'number' ? __callArgs[1] : -1;
          __callArgs = [__buildLinkedList(arr, pos)];
        }

        if (typeof ${fnName || "solve"} === 'function') {
          result = (${fnName || "solve"})(...__callArgs);
        } else if (typeof solve === 'function') {
          result = solve(...__callArgs);
        }
      `;

      const context = vm.createContext(sandbox);
      const script = new vm.Script(harness);
      script.runInContext(context, { timeout: 3000 });

      let stdout = "";
      if (sandbox.result !== undefined) {
        stdout = JSON.stringify(sandbox.result);
      } else if (logs.length > 0) {
        stdout = logs.join("\n");
      }

      return {
        stdout: stdout || "",
        stderr: "",
        executionTime: Date.now() - startTime,
      };
    } catch (vmErr) {
      return {
        stdout: "",
        stderr: `JavaScript Error: ${vmErr.message}`,
        executionTime: 10,
      };
    }
  }

  // Tier 2: Python / Java / C++ Wrapped Harnesses
  let executableCode = code;

  if (lang === "python" || lang === "python3") {
    executableCode = `import sys, json

class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

def __build_linked_list__(arr, pos=-1):
    if not arr: return None
    nodes = [ListNode(v) for v in arr]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if isinstance(pos, int) and 0 <= pos < len(nodes):
        nodes[-1].next = nodes[pos]
    return nodes[0]

${code}

def __harness__():
    raw = sys.stdin.read().strip()
    if not raw:
        return
    lines = [l.strip() for l in raw.splitlines() if l.strip()]
    args = []
    for l in lines:
        try:
            args.append(json.loads(l))
        except:
            args.append(l)
    
    if args and isinstance(args[0], list) and ('hasCycle' in '${code}' or 'ListNode' in '${code}'):
        pos = args[1] if len(args) > 1 and isinstance(args[1], int) else -1
        args = [__build_linked_list__(args[0], pos)]
    
    if 'Solution' in globals():
        sol = Solution()
        methods = [m for m in dir(sol) if not m.startswith('_') and callable(getattr(sol, m))]
        if methods:
            fn = getattr(sol, methods[0])
            res = fn(*args)
            if res is not None:
                print(json.dumps(res, separators=(',', ':')) if isinstance(res, (list, dict, bool, int, float)) else str(res))
    else:
        for name in list(globals().keys()):
            if not name.startswith('_') and callable(globals()[name]):
                res = globals()[name](*args)
                if res is not None:
                    print(json.dumps(res, separators=(',', ':')) if isinstance(res, (list, dict, bool, int, float)) else str(res))
                break

if __name__ == '__main__':
    try:
        __harness__()
    except Exception as e:
        import traceback
        sys.stderr.write(traceback.format_exc())
`;
  } else if (lang === "java") {
    executableCode = `import java.util.*;
import java.io.*;
import java.util.regex.*;

class ListNode {
    public int val;
    public ListNode next;
    public ListNode(int x) {
        val = x;
        next = null;
    }
}

${code}

public class Main {
    public static void main(String[] args) {
        try {
            Scanner sc = new Scanner(System.in);
            StringBuilder sb = new StringBuilder();
            while (sc.hasNextLine()) {
                sb.append(sc.nextLine()).append("\\n");
            }
            String input = sb.toString().trim();
            if (input.isEmpty()) return;
            
            String[] lines = input.split("\\n");
            Solution sol = new Solution();
            
            java.lang.reflect.Method target = null;
            for (java.lang.reflect.Method m : Solution.class.getDeclaredMethods()) {
                if (java.lang.reflect.Modifier.isPublic(m.getModifiers()) && !m.getName().contains("$") && !m.getName().equals("main")) {
                    target = m;
                    if (m.getReturnType() != void.class) {
                        break;
                    }
                }
            }
            if (target == null) return;
            
            Class<?>[] paramTypes = target.getParameterTypes();
            Object[] invokeArgs = new Object[paramTypes.length];
            
            for (int i = 0; i < paramTypes.length && i < lines.length; i++) {
                String line = lines[i].trim();
                Class<?> pt = paramTypes[i];
                if (pt.getSimpleName().equals("ListNode")) {
                    String clean = line.replace("[", "").replace("]", "").replace(" ", "").trim();
                    if (!clean.isEmpty()) {
                        String[] parts = clean.split(",");
                        List<ListNode> nodes = new ArrayList<>();
                        for (String p : parts) {
                            nodes.add(new ListNode(Integer.parseInt(p.trim())));
                        }
                        for (int k = 0; k < nodes.size() - 1; k++) {
                            nodes.get(k).next = nodes.get(k + 1);
                        }
                        int pos = -1;
                        if (lines.length > i + 1) {
                            try {
                                pos = Integer.parseInt(lines[i + 1].replaceAll("[^0-9-]", ""));
                            } catch (Exception ignored) {}
                        }
                        if (pos >= 0 && pos < nodes.size()) {
                            nodes.get(nodes.size() - 1).next = nodes.get(pos);
                        }
                        invokeArgs[i] = nodes.get(0);
                    } else {
                        invokeArgs[i] = null;
                    }
                } else if (pt == int.class || pt == Integer.class) {
                    invokeArgs[i] = Integer.parseInt(line.replaceAll("[^0-9-]", ""));
                } else if (pt == long.class || pt == Long.class) {
                    invokeArgs[i] = Long.parseLong(line.replaceAll("[^0-9-]", ""));
                } else if (pt == double.class || pt == Double.class) {
                    invokeArgs[i] = Double.parseDouble(line.trim());
                } else if (pt == float.class || pt == Float.class) {
                    invokeArgs[i] = Float.parseFloat(line.trim());
                } else if (pt == boolean.class || pt == Boolean.class) {
                    invokeArgs[i] = Boolean.parseBoolean(line.trim());
                } else if (pt == char.class || pt == Character.class) {
                    String clean = line.replace("\\\"", "").replace("'", "").trim();
                    invokeArgs[i] = clean.isEmpty() ? ' ' : clean.charAt(0);
                } else if (pt == String.class) {
                    String clean = line.trim();
                    if (clean.startsWith("\\\"") && clean.endsWith("\\\"") && clean.length() >= 2) {
                        clean = clean.substring(1, clean.length() - 1);
                    }
                    invokeArgs[i] = clean;
                } else if (pt == int[].class) {
                    String clean = line.replace("[", "").replace("]", "").replace(" ", "").trim();
                    if (clean.isEmpty()) {
                        invokeArgs[i] = new int[0];
                    } else {
                        String[] parts = clean.split(",");
                        int[] arr = new int[parts.length];
                        for (int k = 0; k < parts.length; k++) {
                            if (!parts[k].trim().isEmpty()) {
                                arr[k] = Integer.parseInt(parts[k].trim());
                            }
                        }
                        invokeArgs[i] = arr;
                    }
                } else if (pt == String[].class) {
                    String clean = line.trim();
                    if (clean.startsWith("[") && clean.endsWith("]")) {
                        clean = clean.substring(1, clean.length() - 1).trim();
                    }
                    if (clean.isEmpty()) {
                        invokeArgs[i] = new String[0];
                    } else {
                        List<String> list = new ArrayList<>();
                        Matcher m = Pattern.compile("\\\"([^\\\"]*)\\\"|'([^']*)'|([^,]+)").matcher(clean);
                        while (m.find()) {
                            if (m.group(1) != null) list.add(m.group(1));
                            else if (m.group(2) != null) list.add(m.group(2));
                            else list.add(m.group(3).trim());
                        }
                        invokeArgs[i] = list.toArray(new String[0]);
                    }
                } else if (pt == char[].class) {
                    String clean = line.replace("[", "").replace("]", "").replace("\\\"", "").replace("'", "").replace(" ", "").trim();
                    if (clean.isEmpty()) {
                        invokeArgs[i] = new char[0];
                    } else {
                        String[] parts = clean.split(",");
                        char[] arr = new char[parts.length];
                        for (int k = 0; k < parts.length; k++) {
                            arr[k] = parts[k].length() > 0 ? parts[k].charAt(0) : ' ';
                        }
                        invokeArgs[i] = arr;
                    }
                } else if (pt == int[][].class) {
                    String clean = line.trim();
                    if (clean.startsWith("[[") && clean.endsWith("]]")) {
                        clean = clean.substring(1, clean.length() - 1);
                    }
                    String[] rows = clean.split("\\\\],\\\\s*\\\\[");
                    List<int[]> matrix = new ArrayList<>();
                    for (String row : rows) {
                        String rClean = row.replace("[", "").replace("]", "").trim();
                        if (!rClean.isEmpty()) {
                            String[] parts = rClean.split(",");
                            int[] arr = new int[parts.length];
                            for (int k = 0; k < parts.length; k++) {
                                if (!parts[k].trim().isEmpty()) arr[k] = Integer.parseInt(parts[k].trim());
                            }
                            matrix.add(arr);
                        }
                    }
                    invokeArgs[i] = matrix.toArray(new int[0][]);
                } else if (List.class.isAssignableFrom(pt)) {
                    String clean = line.trim();
                    if (clean.startsWith("[") && clean.endsWith("]")) {
                        clean = clean.substring(1, clean.length() - 1).trim();
                    }
                    List<Object> list = new ArrayList<>();
                    if (!clean.isEmpty()) {
                        String[] parts = clean.split(",");
                        for (String p : parts) {
                            String item = p.replace("\\\"", "").replace("'", "").trim();
                            try {
                                list.add(Integer.parseInt(item));
                            } catch (Exception e) {
                                list.add(item);
                            }
                        }
                    }
                    invokeArgs[i] = list;
                } else {
                    invokeArgs[i] = line.trim();
                }
            }
            
            Object ret = target.invoke(sol, invokeArgs);
            if (ret != null) {
                if (ret instanceof int[]) {
                    System.out.println(Arrays.toString((int[]) ret).replace(" ", ""));
                } else if (ret instanceof char[]) {
                    System.out.println(new String((char[]) ret));
                } else if (ret instanceof Object[]) {
                    System.out.println(Arrays.toString((Object[]) ret));
                } else if (ret instanceof int[][]) {
                    System.out.println(Arrays.deepToString((int[][]) ret).replace(" ", ""));
                } else {
                    System.out.println(ret.toString());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`;
  }

  try {
    // 1. OneCompiler RapidAPI (Primary)
    if (process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_HOST) {
      const options = {
        method: "POST",
        url: "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
        headers: {
          "x-rapidapi-host": process.env.RAPIDAPI_HOST,
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "Content-Type": "application/json",
        },
        data: {
          language: oneCompilerLang,
          stdin: stdin || "",
          files: [
            {
              name: `Main.${lang === "javascript" ? "js" : lang === "python" ? "py" : lang === "cpp" ? "cpp" : "java"}`,
              content: executableCode,
            },
          ],
        },
        timeout: 10000,
      };

      const response = await axios.request(options);
      const data = response.data;
      return {
        stdout: (data.stdout || "").trim(),
        stderr: (data.stderr || "") + (data.exception ? `\n${data.exception}` : ""),
        executionTime: data.executionTime || 45,
      };
    }

    // 2. Piston Sandbox (Fallback)
    const pistonLang = lang === "cpp" ? "c++" : lang === "python" ? "python" : "java";
    const pistonRes = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: pistonLang,
        version: "*",
        files: [
          {
            name: lang === "java" ? "Main.java" : undefined,
            content: executableCode,
          },
        ],
        stdin: stdin || "",
      },
      { timeout: 8000 }
    );

    const run = pistonRes.data?.run || {};
    const compile = pistonRes.data?.compile || {};

    let rawStderr = [compile.stderr, compile.output, run.stderr].filter(Boolean).join("\n").trim();
    const combinedStdout = (run.stdout || "").trim();

    // Map compiler line numbers to editor line numbers for high developer clarity
    if (rawStderr) {
      if (lang === "java") {
        rawStderr = rawStderr.replace(/Main\.java:(\d+)/g, (match, p1) => {
          const lineNum = Math.max(1, parseInt(p1, 10) - 12);
          return `Solution.java:Line ${lineNum}`;
        });
      } else if (lang === "python" || lang === "python3") {
        rawStderr = rawStderr.replace(/File "<string>", line (\d+)/g, (match, p1) => {
          const lineNum = Math.max(1, parseInt(p1, 10) - 16);
          return `Solution.py:Line ${lineNum}`;
        });
      }
    }

    return {
      stdout: combinedStdout,
      stderr: rawStderr,
      executionTime: run.time || compile.time || 50,
    };
  } catch (err) {
    return {
      stdout: "",
      stderr: `Execution Engine: ${err.response?.data?.message || err.message}`,
      executionTime: 0,
    };
  }
};

/**
 * 6. POST /api/placement/run-code
 * Runs code against visible sample test cases or custom input
 */
export const runCodingTest = async (req, res) => {
  try {
    const { questionId, code, language, customInput, runOnlyCustom } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Code cannot be empty." });
    }

    const question = await PlacementQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    const sampleInput = question.testCases?.[0]?.input;
    const isCustomRun =
      runOnlyCustom === true &&
      customInput !== undefined &&
      customInput !== null &&
      customInput.trim() !== "";

    // If explicit custom run requested
    if (isCustomRun) {
      const result = await executeSandboxedCode(code, language, customInput);
      const actualTrimmed = result.stdout.trim();
      const matchedTc = (question.testCases || []).find((tc) => normalizeOutput(tc.input) === normalizeOutput(customInput));
      const expectedTrimmed = (matchedTc?.expectedOutput || matchedTc?.output || "").trim();
      const normActual = normalizeOutput(actualTrimmed);
      const normExpected = normalizeOutput(expectedTrimmed);
      const isCompileOrRuntimeError = Boolean(result.stderr);
      const passed = !isCompileOrRuntimeError && (normActual === normExpected || (Boolean(normExpected) && (normActual.includes(normExpected) || normExpected.includes(normActual))));

      return res.status(200).json({
        success: true,
        customRun: true,
        output: result.stdout,
        error: result.stderr,
        stderr: result.stderr,
        hasError: isCompileOrRuntimeError,
        expectedOutput: expectedTrimmed,
        passed,
        isMatch: Boolean(normExpected) ? passed : null,
        executionTime: result.executionTime,
      });
    }

    // Default: Run against ALL visible sample test cases
    const visibleCases = (question.testCases || []).filter((tc) => !tc.isHidden);
    const testResults = [];

    for (let i = 0; i < (visibleCases.length || 1); i++) {
      const tc = visibleCases[i] || { input: "", expectedOutput: "" };
      const runRes = await executeSandboxedCode(code, language, tc.input);

      const actualTrimmed = runRes.stdout.trim();
      const expectedTrimmed = (tc.expectedOutput || tc.output || "").trim();

      const normActual = normalizeOutput(actualTrimmed);
      const normExpected = normalizeOutput(expectedTrimmed);

      const isCompileOrRuntimeError = Boolean(runRes.stderr);

      // Check if output matches
      const passed =
        !isCompileOrRuntimeError &&
        (normActual === normExpected || (Boolean(normExpected) && (normActual.includes(normExpected) || normExpected.includes(normActual))));

      testResults.push({
        testCaseIndex: i + 1,
        input: tc.input,
        expectedOutput: expectedTrimmed,
        actualOutput: actualTrimmed || (isCompileOrRuntimeError ? "(Compilation / Runtime Error)" : "(No Output)"),
        error: runRes.stderr || (!passed ? `Expected "${expectedTrimmed}", but received "${actualTrimmed || '(No Output)'}"` : ""),
        stderr: runRes.stderr || "",
        isError: isCompileOrRuntimeError,
        passed,
        executionTime: runRes.executionTime,
      });

      // Fail-fast on compile error
      if (isCompileOrRuntimeError) break;
    }

    const allPassed = testResults.length > 0 && testResults.every((r) => r.passed);
    const hasError = testResults.some((r) => r.isError);
    const firstErrorItem = testResults.find((r) => r.stderr || r.error);
    const globalStderr = testResults.find((r) => r.stderr)?.stderr || "";

    res.status(200).json({
      success: true,
      customRun: false,
      allPassed,
      hasError,
      passedTests: testResults.filter((r) => r.passed).length,
      totalTests: testResults.length,
      error: firstErrorItem ? (firstErrorItem.stderr || firstErrorItem.error) : "",
      stderr: globalStderr,
      results: testResults,
    });
  } catch (error) {
    console.error("Error in runCodingTest:", error);
    res.status(500).json({ success: false, message: "Failed to run code." });
  }
};

/**
 * 7. POST /api/placement/submit-code
 * Submits solution against all test cases (including hidden) & updates progress
 */
export const submitCodingSolution = async (req, res) => {
  try {
    const { questionId, code, language } = req.body;
    const userId = req.user?._id;

    if (!code) {
      return res.status(400).json({ success: false, message: "Code cannot be empty." });
    }

    const question = await PlacementQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    const allTestCases = question.testCases || [];
    const testResults = [];
    let totalTime = 0;

    for (let i = 0; i < allTestCases.length; i++) {
      const tc = allTestCases[i];
      const runRes = await executeSandboxedCode(code, language, tc.input);
      totalTime += runRes.executionTime || 40;

      const actualTrimmed = runRes.stdout.trim();
      const expectedTrimmed = (tc.expectedOutput || "").trim();

      const normActual = normalizeOutput(actualTrimmed);
      const normExpected = normalizeOutput(expectedTrimmed);

      const isCompileOrRuntimeError = Boolean(runRes.stderr);

      const passed =
        !isCompileOrRuntimeError &&
        (normActual === normExpected || normActual.includes(normExpected) || normExpected.includes(normActual));

      testResults.push({
        testCaseIndex: i + 1,
        isHidden: Boolean(tc.isHidden),
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: actualTrimmed || (isCompileOrRuntimeError ? "(Compilation / Runtime Error)" : "(No Output)"),
        error: runRes.stderr || (!passed ? `Mismatch: Expected "${expectedTrimmed}", but received "${actualTrimmed || '(No Output)'}"` : ""),
        stderr: runRes.stderr || "",
        isError: isCompileOrRuntimeError,
        passed,
        executionTime: runRes.executionTime,
      });

      // Fail-fast on runtime or compilation error
      if (isCompileOrRuntimeError) break;
    }

    const passedCount = testResults.filter((r) => r.passed).length;
    const totalCount = allTestCases.length;
    const isAccepted = passedCount === totalCount && totalCount > 0;

    const avgRuntime = testResults.length > 0 ? Math.round(totalTime / testResults.length) : 55;
    const memoryKb = Math.floor(34000 + Math.random() * 8000);

    const hasCompileOrRuntimeError = testResults.some((r) => r.isError);
    const firstErrorItem = testResults.find((r) => r.stderr || r.error);
    const globalStderr = testResults.find((r) => r.stderr)?.stderr || "";

    let status = "Accepted";
    if (hasCompileOrRuntimeError) status = "Compilation / Runtime Error";
    else if (!isAccepted) status = `Wrong Answer (${passedCount}/${totalCount} test cases passed)`;

    if (userId) {
      const attemptEntry = {
        questionId: question._id,
        category: "coding",
        isCorrect: isAccepted,
        code,
        language,
        attemptedAt: new Date(),
      };

      await PlacementProgress.updateOne(
        { userId },
        {
          $pull: { solvedQuestions: { questionId: question._id } },
        },
        { upsert: true }
      );

      await PlacementProgress.updateOne(
        { userId },
        {
          $push: { solvedQuestions: attemptEntry },
        }
      );
    }

    res.status(200).json({
      success: true,
      status,
      isAccepted,
      passedCases: passedCount,
      totalCases: totalCount,
      runtimeMs: avgRuntime,
      memoryKb,
      testResults,
      hasError: hasCompileOrRuntimeError,
      error: firstErrorItem ? (firstErrorItem.stderr || firstErrorItem.error) : "",
      stderr: globalStderr,
    });
  } catch (error) {
    console.error("Error in submitCodingSolution:", error);
    res.status(500).json({ success: false, message: "Failed to submit solution." });
  }
};

/**
 * 8. POST /api/placement/bookmark
 * Toggles bookmark status for a question
 */
export const toggleBookmark = async (req, res) => {
  try {
    const { questionId } = req.body;
    const userId = req.user?._id;

    if (!questionId) {
      return res.status(400).json({ success: false, message: "questionId is required." });
    }

    const progress = await getOrCreateProgress(userId);
    const existingIndex = progress.bookmarkedQuestions.findIndex(
      (id) => id.toString() === questionId
    );

    let isBookmarked = false;
    if (existingIndex > -1) {
      progress.bookmarkedQuestions.splice(existingIndex, 1);
      isBookmarked = false;
    } else {
      progress.bookmarkedQuestions.push(questionId);
      isBookmarked = true;
    }

    await progress.save();

    res.status(200).json({
      success: true,
      isBookmarked,
      message: isBookmarked ? "Question bookmarked 📌" : "Bookmark removed",
    });
  } catch (error) {
    console.error("Error in toggleBookmark:", error);
    res.status(500).json({ success: false, message: "Failed to toggle bookmark." });
  }
};

/**
 * 9. GET /api/placement/bookmarks
 * Returns all bookmarked questions for current user
 */
export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user?._id;
    const progress = await PlacementProgress.findOne({ userId }).populate("bookmarkedQuestions");

    res.status(200).json({
      success: true,
      bookmarks: progress?.bookmarkedQuestions || [],
    });
  } catch (error) {
    console.error("Error in getBookmarks:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookmarks." });
  }
};

/**
 * 10. GET /api/placement/progress
 * Returns user global progress, accuracy, weak topics, and personalized roadmap
 */
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const [progress, allQuestions] = await Promise.all([
      PlacementProgress.findOne({ userId }).lean(),
      PlacementQuestion.find({}).select("_id difficulty topics").lean(),
    ]);

    const totalQuestionsCount = allQuestions.length;
    const solvedItems = progress?.solvedQuestions || [];
    const correctItems = solvedItems.filter((q) => q?.isCorrect);

    const solvedQuestionIds = new Set(correctItems.map((q) => q?.questionId?.toString()));

    const easyCount = allQuestions.filter((q) => q.difficulty === "Easy" && solvedQuestionIds.has(q._id.toString())).length;
    const mediumCount = allQuestions.filter((q) => q.difficulty === "Medium" && solvedQuestionIds.has(q._id.toString())).length;
    const hardCount = allQuestions.filter((q) => q.difficulty === "Hard" && solvedQuestionIds.has(q._id.toString())).length;

    const accuracy = solvedItems.length > 0
      ? Math.round((correctItems.length / solvedItems.length) * 100)
      : 0;

    const questionMap = new Map();
    allQuestions.forEach((q) => questionMap.set(q._id.toString(), q));

    const weakTopicsMap = {};
    solvedItems
      .filter((q) => !q.isCorrect)
      .forEach((attempt) => {
        const fullQ = questionMap.get(attempt?.questionId?.toString());
        (fullQ?.topics || []).forEach((t) => {
          weakTopicsMap[t] = (weakTopicsMap[t] || 0) + 1;
        });
      });

    const weakTopics = Object.entries(weakTopicsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([topic, count]) => ({ topic, incorrectCount: count }));

    const overallReadiness = totalQuestionsCount > 0
      ? Math.min(100, Math.round((correctItems.length / totalQuestionsCount) * 100))
      : 0;

    res.status(200).json({
      success: true,
      progress: {
        totalQuestionsCount,
        totalAttempted: solvedItems.length,
        totalSolved: correctItems.length,
        accuracy,
        overallReadiness,
        difficultyBreakdown: {
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount,
        },
        weakTopics,
        mockTestHistory: progress?.mockTestHistory || [],
        bookmarksCount: progress?.bookmarkedQuestions?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error in getUserProgress:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user progress." });
  }
};

/**
 * 11. POST /api/placement/mock-test/start
 * Assembles a timed, randomized mock assessment for the specified company
 */
export const startMockTest = async (req, res) => {
  try {
    const { companySlug } = req.body;
    const slug = (companySlug || "google").toLowerCase();

    // Helper to fetch random questions from database
    const getRandomQuestions = async (category, count) => {
      // 1. Try finding questions tagged with this company
      let questions = await PlacementQuestion.aggregate([
        { $match: { companies: slug, category } },
        { $sample: { size: count } },
      ]);

      // 2. If not enough questions tagged with company, fill with general category questions
      if (questions.length < count) {
        const existingIds = questions.map((q) => q._id);
        const additional = await PlacementQuestion.aggregate([
          { $match: { category, _id: { $nin: existingIds } } },
          { $sample: { size: count - questions.length } },
        ]);
        questions = [...questions, ...additional];
      }

      return questions;
    };

    const company = await PlacementCompany.findOne({ slug }).lean();
    const companyInfo = company || { name: slug.toUpperCase(), slug };

    let testSections = [];

    const sanitizeQuestions = (qList) =>
      (qList || []).map((q) => {
        const {
          correctAnswer,
          explanation,
          solutionCode,
          userAttempt,
          isSolved,
          ...safe
        } = q;
        return safe;
      });

    const sanitizeSections = (secs) =>
      (secs || []).map((sec) => ({
        ...sec,
        questions: sanitizeQuestions(sec.questions),
      }));

    if (slug === "capgemini") {
      // 5 Official Capgemini Online Assessment Stages (Strict Domain-Targeted Queries)
      const [engQuestions, aiTechQuestions, debugQuestions, codeQuestions, cogQuestions] = await Promise.all([
        // Stage 1: English Communication
        PlacementQuestion.aggregate([
          {
            $match: {
              category: "english",
              $or: [
                { topics: { $in: ["English Communication", "Business Communication", "Sentence Correction", "Active Listening", "Vocabulary"] } },
                { tags: { $in: ["English Comm", "Communication", "Versant"] } },
                { companies: "capgemini" },
              ],
            },
          },
          { $sample: { size: 4 } },
        ]),
        // Stage 2: Technical Module (AI Literacy & Situational Problem-Solving)
        PlacementQuestion.aggregate([
          {
            $match: {
              category: "technical",
              $or: [
                { topics: { $in: ["AI Literacy", "Generative AI", "Prompt Engineering", "Situational Problem Solving", "LLM Evaluation", "AI Security"] } },
                { tags: { $in: ["AI Literacy", "GenAI", "Prompting", "Security"] } },
              ],
            },
          },
          { $sample: { size: 4 } },
        ]),
        // Stage 3: Hands-On Debugging Assessment (Compiler Code Fix with Buggy Starter Code)
        PlacementQuestion.aggregate([
          {
            $match: {
              category: "coding",
              $or: [
                { topics: { $in: ["Debugging Assessment", "Code Correction"] } },
                { tags: { $in: ["Debugging", "Code Fix", "Automata Fix"] } },
              ],
            },
          },
          { $sample: { size: 2 } },
        ]),
        // Stage 4: AI-Assisted Coding Assessment (Algorithmic Studio)
        PlacementQuestion.aggregate([
          {
            $match: {
              category: "coding",
              companies: "capgemini",
              tags: { $nin: ["Debugging", "Code Fix", "Automata Fix"] },
            },
          },
          { $sample: { size: 2 } },
        ]),
        // Stage 5: Cognitive Assessment (Motion, Grid & Switch Challenge)
        PlacementQuestion.aggregate([
          {
            $match: {
              category: "aptitude",
              $or: [
                { topics: { $in: ["Cognitive Assessment", "Motion Challenge", "Grid Challenge", "Working Memory", "Inductive Logic", "Switch Challenge"] } },
                { tags: { $in: ["Cognitive", "Motion Challenge", "Grid Challenge", "Game Logic", "Switch Challenge", "Inductive Logic"] } },
              ],
            },
          },
          { $sample: { size: 4 } },
        ]),
      ]);

      const allIds = [
        ...engQuestions.map((q) => q._id.toString()),
        ...aiTechQuestions.map((q) => q._id.toString()),
        ...cogQuestions.map((q) => q._id.toString()),
        ...debugQuestions.map((q) => q._id.toString()),
        ...codeQuestions.map((q) => q._id.toString()),
      ];

      testSections = [
        {
          sectionName: "Round 1: Foundation & AI Assessment (English, Tech & Cognitive)",
          category: "aptitude",
          durationMinutes: 40,
          questions: [...engQuestions, ...aiTechQuestions, ...cogQuestions],
        },
        {
          sectionName: "Round 2: Hands-On Debugging Assessment (Compiler Code Fix)",
          category: "coding",
          durationMinutes: 30,
          questions: debugQuestions,
        },
        {
          sectionName: "Round 3: AI-Assisted Coding Assessment",
          category: "coding",
          durationMinutes: 45,
          questions: codeQuestions,
        },
      ];

      return res.status(200).json({
        success: true,
        company: companyInfo,
        durationMinutes: 115,
        totalQuestions: allIds.length,
        allQuestionIds: allIds,
        sections: sanitizeSections(testSections),
      });
    }

    // ── 2. TCS NQT (Ninja / Digital / Prime 2026 Pipeline) ──
    if (slug === "tcs") {
      const [nqtFoundationApt, nqtFoundationEng, nqtAdvTech, nqtCoding] = await Promise.all([
        getRandomQuestions("aptitude", 5),
        getRandomQuestions("english", 4),
        getRandomQuestions("technical", 5),
        getRandomQuestions("coding", 2),
      ]);

      const allIds = [
        ...nqtFoundationApt.map((q) => q._id.toString()),
        ...nqtFoundationEng.map((q) => q._id.toString()),
        ...nqtAdvTech.map((q) => q._id.toString()),
        ...nqtCoding.map((q) => q._id.toString()),
      ];

      testSections = [
        {
          sectionName: "Round 1: TCS NQT Foundation (Numerical, Verbal & Reasoning)",
          category: "aptitude",
          durationMinutes: 35,
          questions: [...nqtFoundationApt, ...nqtFoundationEng],
        },
        {
          sectionName: "Round 2: TCS NQT Advanced Cognitive & IT Pseudocode",
          category: "technical",
          durationMinutes: 25,
          questions: nqtAdvTech,
        },
        {
          sectionName: "Round 3: TCS NQT Hands-on Coding Assessment",
          category: "coding",
          durationMinutes: 45,
          questions: nqtCoding,
        },
      ];

      return res.status(200).json({
        success: true,
        company: companyInfo,
        durationMinutes: 105,
        totalQuestions: allIds.length,
        allQuestionIds: allIds,
        sections: sanitizeSections(testSections),
      });
    }

    // ── 3. Accenture (Cognitive, Coding & AI Communication 2026 Pipeline) ──
    if (slug === "accenture") {
      const [cogApt, techQuestions, codingQuestions, commQuestions] = await Promise.all([
        getRandomQuestions("aptitude", 6),
        getRandomQuestions("technical", 5),
        getRandomQuestions("coding", 2),
        getRandomQuestions("english", 5),
      ]);

      const allIds = [
        ...cogApt.map((q) => q._id.toString()),
        ...techQuestions.map((q) => q._id.toString()),
        ...codingQuestions.map((q) => q._id.toString()),
        ...commQuestions.map((q) => q._id.toString()),
      ];

      testSections = [
        {
          sectionName: "Round 1: Cognitive & Technical Assessment (Critical Thinking & Security)",
          category: "aptitude",
          durationMinutes: 40,
          questions: [...cogApt, ...techQuestions],
        },
        {
          sectionName: "Round 2: Hands-on Coding Assessment (AASE Upgrade)",
          category: "coding",
          durationMinutes: 45,
          questions: codingQuestions,
        },
        {
          sectionName: "Round 3: AI Communication & Spoken English Assessment",
          category: "english",
          durationMinutes: 20,
          questions: commQuestions,
        },
      ];

      return res.status(200).json({
        success: true,
        company: companyInfo,
        durationMinutes: 105,
        totalQuestions: allIds.length,
        allQuestionIds: allIds,
        sections: sanitizeSections(testSections),
      });
    }

    // ── 4. Infosys (Qualifier & Hands-on Coding 2026 Pipeline) ──
    if (slug === "infosys") {
      const [aptQuestions, engQuestions, techQuestions, codingQuestions] = await Promise.all([
        getRandomQuestions("aptitude", 5),
        getRandomQuestions("english", 4),
        getRandomQuestions("technical", 4),
        getRandomQuestions("coding", 3),
      ]);

      const allIds = [
        ...aptQuestions.map((q) => q._id.toString()),
        ...engQuestions.map((q) => q._id.toString()),
        ...techQuestions.map((q) => q._id.toString()),
        ...codingQuestions.map((q) => q._id.toString()),
      ];

      testSections = [
        {
          sectionName: "Round 1: Infosys Qualifier Assessment (Aptitude, Verbal & Pseudocode)",
          category: "aptitude",
          durationMinutes: 45,
          questions: [...aptQuestions, ...engQuestions, ...techQuestions],
        },
        {
          sectionName: "Round 2: Hands-on Coding Assessment (SP / DSE Track)",
          category: "coding",
          durationMinutes: 60,
          questions: codingQuestions,
        },
      ];

      return res.status(200).json({
        success: true,
        company: companyInfo,
        durationMinutes: 105,
        totalQuestions: allIds.length,
        allQuestionIds: allIds,
        sections: sanitizeSections(testSections),
      });
    }

    // ── 5. Product & FAANG Tier (Google, Microsoft, Amazon, Meta, Apple, Netflix, etc.) ──
    const isProductTier = [
      "google",
      "microsoft",
      "amazon",
      "meta",
      "apple",
      "netflix",
      "adobe",
      "goldman-sachs",
      "jpmorgan",
      "uber",
      "oracle",
      "salesforce",
      "cisco",
      "ibm",
      "qualcomm",
    ].includes(slug);

    if (isProductTier) {
      const [codingQuestions, techQuestions] = await Promise.all([
        getRandomQuestions("coding", 3),
        getRandomQuestions("technical", 6),
      ]);

      const allIds = [
        ...codingQuestions.map((q) => q._id.toString()),
        ...techQuestions.map((q) => q._id.toString()),
      ];

      testSections = [
        {
          sectionName: "Round 1: Algorithmic Online Assessment (Hard DSA & Optimization)",
          category: "coding",
          durationMinutes: 60,
          questions: codingQuestions,
        },
        {
          sectionName: "Round 2: Core CS & System Fundamentals (OS, Concurrency & Networks)",
          category: "technical",
          durationMinutes: 30,
          questions: techQuestions,
        },
      ];

      return res.status(200).json({
        success: true,
        company: companyInfo,
        durationMinutes: 90,
        totalQuestions: allIds.length,
        allQuestionIds: allIds,
        sections: sanitizeSections(testSections),
      });
    }

    // Default 4-section assessment for other companies
    const [aptQuestions, engQuestions, techQuestions, codeQuestions] = await Promise.all([
      getRandomQuestions("aptitude", 5),
      getRandomQuestions("english", 4),
      getRandomQuestions("technical", 5),
      getRandomQuestions("coding", 2),
    ]);

    const allQuestionIds = [
      ...aptQuestions.map((q) => q._id.toString()),
      ...engQuestions.map((q) => q._id.toString()),
      ...techQuestions.map((q) => q._id.toString()),
      ...codeQuestions.map((q) => q._id.toString()),
    ];

    testSections = [
      {
        sectionName: slug === "accenture" ? "Cognitive Assessment" : slug === "tcs" ? "TCS NQT Foundation" : "Quantitative & Logical Aptitude",
        category: "aptitude",
        durationMinutes: 25,
        questions: aptQuestions,
      },
      {
        sectionName: slug === "accenture" ? "English Ability" : slug === "tcs" ? "Verbal Ability" : "Verbal Ability & English",
        category: "english",
        durationMinutes: 15,
        questions: engQuestions,
      },
      {
        sectionName: slug === "accenture" ? "Technical & Pseudocode" : slug === "tcs" ? "TCS NQT Advanced" : "Core Computer Science Fundamentals",
        category: "technical",
        durationMinutes: 20,
        questions: techQuestions,
      },
      {
        sectionName: slug === "tcs" ? "Advanced Hands-on Coding" : "Hands-on Coding Assessment",
        category: "coding",
        durationMinutes: 30,
        questions: codeQuestions,
      },
    ];

    res.status(200).json({
      success: true,
      company: companyInfo,
      durationMinutes: 90,
      totalQuestions: allQuestionIds.length,
      allQuestionIds,
      sections: sanitizeSections(testSections),
    });
  } catch (error) {
    console.error("Error in startMockTest:", error);
    res.status(500).json({ success: false, message: "Failed to start mock test." });
  }
};

/**
 * 12. POST /api/placement/mock-test/submit
 * Grades the full mock test and stores the report in mockTestHistory
 */
export const submitMockTest = async (req, res) => {
  try {
    const { companySlug, answers, allQuestionIds, timeTakenSeconds } = req.body;
    const userId = req.user?._id;

    // Evaluate all test questions (both answered and unanswered)
    const questionIdsToGrade =
      Array.isArray(allQuestionIds) && allQuestionIds.length > 0
        ? allQuestionIds
        : Object.keys(answers || {});

    const [company, questions] = await Promise.all([
      PlacementCompany.findOne({ slug: (companySlug || "").toLowerCase() }).lean(),
      PlacementQuestion.find({ _id: { $in: questionIdsToGrade } })
        .select("correctAnswer category topics tags title")
        .lean(),
    ]);

    let totalScore = 0;
    let totalMaxScore = 0;
    const weakTopicsSet = new Set();

    const categoryBreakdown = {
      aptitude: { score: 0, total: 0 },
      english: { score: 0, total: 0 },
      technical: { score: 0, total: 0 },
      coding: { score: 0, total: 0 },
    };

    const slug = (companySlug || "").toLowerCase();
    const stageBreakdown = {};

    if (slug === "capgemini") {
      stageBreakdown["Round 1: Foundation & AI Assessment (English, Tech & Cognitive)"] = { score: 0, total: 0, category: "aptitude" };
      stageBreakdown["Round 2: Hands-On Debugging Round (Compiler Fix)"] = { score: 0, total: 0, category: "coding" };
      stageBreakdown["Round 3: AI-Assisted Algorithmic Coding"] = { score: 0, total: 0, category: "coding" };
    } else if (slug === "tcs") {
      stageBreakdown["Round 1: TCS NQT Foundation (Ninja Qualifier)"] = { score: 0, total: 0, category: "aptitude" };
      stageBreakdown["Round 2: TCS NQT Advanced Cognitive & IT"] = { score: 0, total: 0, category: "technical" };
      stageBreakdown["Round 3: TCS NQT Hands-on Coding Assessment"] = { score: 0, total: 0, category: "coding" };
    } else if (slug === "accenture") {
      stageBreakdown["Round 1: Cognitive & Technical Assessment"] = { score: 0, total: 0, category: "aptitude" };
      stageBreakdown["Round 2: Hands-on Coding Assessment"] = { score: 0, total: 0, category: "coding" };
      stageBreakdown["Round 3: AI Communication Assessment"] = { score: 0, total: 0, category: "english" };
    } else if (slug === "infosys") {
      stageBreakdown["Round 1: Infosys Qualifier Assessment"] = { score: 0, total: 0, category: "aptitude" };
      stageBreakdown["Round 2: Hands-on Coding Assessment (SP / DSE)"] = { score: 0, total: 0, category: "coding" };
    } else if (["google", "microsoft", "amazon", "meta", "apple", "netflix", "adobe", "goldman-sachs", "uber"].includes(slug)) {
      stageBreakdown["Round 1: Algorithmic Online Assessment (Hard DSA)"] = { score: 0, total: 0, category: "coding" };
      stageBreakdown["Round 2: Core CS & System Fundamentals"] = { score: 0, total: 0, category: "technical" };
    }

    for (const q of questions) {
      const userAns = (answers || {})[q._id.toString()];
      const cat = q.category || "aptitude";
      const weight = cat === "coding" ? 10 : 2;

      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { score: 0, total: 0 };
      }

      categoryBreakdown[cat].total += weight;
      totalMaxScore += weight;

      // Map to Stage
      let stageKey = null;
      if (slug === "capgemini") {
        if (cat === "coding") {
          const isDebug =
            (q.topics || []).some((t) => ["Debugging Assessment", "Code Correction"].includes(t)) ||
            (q.tags || []).includes("Debugging") ||
            (q.title || "").includes("Debugging");
          stageKey = isDebug
            ? "Round 2: Hands-On Debugging Round (Compiler Fix)"
            : "Round 3: AI-Assisted Algorithmic Coding";
        } else {
          // Combined Round 1 (English, Technical, Cognitive)
          stageKey = "Round 1: Foundation & AI Assessment (English, Tech & Cognitive)";
        }
      } else if (slug === "tcs") {
        if (cat === "coding") stageKey = "Round 3: TCS NQT Hands-on Coding Assessment";
        else if (cat === "technical") stageKey = "Round 2: TCS NQT Advanced Cognitive & IT";
        else stageKey = "Round 1: TCS NQT Foundation (Ninja Qualifier)";
      } else if (slug === "accenture") {
        if (cat === "coding") stageKey = "Round 2: Hands-on Coding Assessment";
        else if (cat === "english") stageKey = "Round 3: AI Communication Assessment";
        else stageKey = "Round 1: Cognitive & Technical Assessment";
      } else if (slug === "infosys") {
        if (cat === "coding") stageKey = "Round 2: Hands-on Coding Assessment (SP / DSE)";
        else stageKey = "Round 1: Infosys Qualifier Assessment";
      } else if (["google", "microsoft", "amazon", "meta", "apple", "netflix", "adobe", "goldman-sachs", "uber"].includes(slug)) {
        if (cat === "coding") stageKey = "Round 1: Algorithmic Online Assessment (Hard DSA)";
        else stageKey = "Round 2: Core CS & System Fundamentals";
      }

      if (stageKey && stageBreakdown[stageKey]) {
        stageBreakdown[stageKey].total += weight;
      }

      let isCorrect = false;

      if (userAns !== undefined && userAns !== null) {
        if (cat === "coding") {
          // Coding question is marked correct if tests were run & passed, or marked accepted
          isCorrect =
            userAns?.isAccepted === true ||
            userAns?.allPassed === true ||
            (userAns?.passedCount > 0 && userAns?.passedCount >= (userAns?.totalTests || 1));
        } else {
          // MCQ question
          const choice = typeof userAns === "object" ? userAns?.userChoice : userAns;
          isCorrect = Number(choice) === Number(q.correctAnswer);
        }
      }

      if (isCorrect) {
        categoryBreakdown[cat].score += weight;
        if (stageKey && stageBreakdown[stageKey]) {
          stageBreakdown[stageKey].score += weight;
        }
        totalScore += weight;
      } else {
        (q.topics || []).forEach((t) => weakTopicsSet.add(t));
      }
    }

    const percentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
    const weakTopics = Array.from(weakTopicsSet).slice(0, 4);

    const recommendations = [];
    if (percentage < 60) {
      recommendations.push("Revise high-frequency topics and retake the mock test in 3 days.");
    }
    if (categoryBreakdown.coding.score < categoryBreakdown.coding.total * 0.7) {
      recommendations.push("Practice hands-on compiler debugging & LeetCode problems with test case validation.");
    }
    if (weakTopics.length > 0) {
      recommendations.push(`Target weak topics: ${weakTopics.join(", ")}`);
    }

    const testResult = {
      companySlug: companySlug || "general",
      companyName: company?.name || (companySlug || "General").toUpperCase(),
      score: totalScore,
      totalMarks: totalMaxScore,
      percentage,
      timeTakenSeconds: timeTakenSeconds || 0,
      stageBreakdown: Object.keys(stageBreakdown).length > 0 ? stageBreakdown : undefined,
      categoryBreakdown,
      weakTopics,
      recommendations,
      completedAt: new Date(),
    };

    if (userId) {
      const progress = await getOrCreateProgress(userId);
      progress.mockTestHistory.unshift(testResult);
      await progress.save();
    }

    res.status(200).json({
      success: true,
      result: testResult,
    });
  } catch (error) {
    console.error("Error in submitMockTest:", error);
    res.status(500).json({ success: false, message: "Failed to submit mock test." });
  }
};

/**
 * 12. POST /api/placement/reset-progress
 * Resets user question attempts (single question, questionIds array, or category)
 */
export const resetProgress = async (req, res) => {
  try {
    const { questionId, questionIds, category } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    if (questionId) {
      const qOid = mongoose.Types.ObjectId.isValid(questionId)
        ? new mongoose.Types.ObjectId(questionId)
        : questionId;
      await PlacementProgress.updateOne(
        { userId },
        { $pull: { solvedQuestions: { questionId: { $in: [questionId, qOid] } } } }
      );
    } else if (Array.isArray(questionIds) && questionIds.length > 0) {
      const oids = questionIds.map((id) =>
        mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id
      );
      await PlacementProgress.updateOne(
        { userId },
        { $pull: { solvedQuestions: { questionId: { $in: [...questionIds, ...oids] } } } }
      );
    } else if (category && category !== "all") {
      await PlacementProgress.updateOne(
        { userId },
        { $pull: { solvedQuestions: { category: category.toLowerCase() } } }
      );
    } else {
      await PlacementProgress.updateOne(
        { userId },
        { $set: { solvedQuestions: [] } }
      );
    }

    res.status(200).json({
      success: true,
      message: "Progress reset successfully.",
    });
  } catch (error) {
    console.error("Error in resetProgress:", error);
    res.status(500).json({ success: false, message: "Failed to reset progress." });
  }
};

/**
 * 13. POST /api/placement/ai-copilot
 * Interactive AI Assistant for Round 3 (AI-Assisted Coding).
 * Strict Guardrails: NEVER gives full answer or code. Only gives clues, intuition, edge-case guidance.
 */
export const askPlacementAiCopilot = async (req, res) => {
  try {
    const { questionTitle, questionDescription, currentCode, language, userMessage, chatHistory } = req.body;

    const systemPrompt = `You are the Official AI Coding Copilot for an Online Assessment (OA) candidate.
The candidate is in the "AI-Assisted Coding" round.

CURRENT PROBLEM: "${questionTitle || "Algorithmic Problem"}"
PROBLEM DESCRIPTION:
${questionDescription || "N/A"}

STRICT INTERACTION RULES (NON-NEGOTIABLE):
1. NEVER output the full solution code, finished functions, or copy-paste answers in any programming language.
2. If the user asks "Give me the code", "Solve this problem", or "What is the answer?", politely decline and instead guide them with algorithmic clues, data structure intuition, and high-level steps.
3. Help the candidate by providing:
   - High-level algorithmic intuition (e.g. why Hash Map, Two Pointers, Monotonic Stack, or DP fits this problem).
   - Time and space complexity trade-offs ($O(N)$ vs $O(N^2)$).
   - Edge-case warnings (e.g., empty array, single element, negative numbers, boundary constraints).
   - Explaining why their current logic might be failing based on the code they provided.
4. Keep your responses concise (2 to 4 short paragraphs or bullet points), highly professional, encouraging, and clear.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(chatHistory) ? chatHistory.slice(-6) : []),
      {
        role: "user",
        content: `Candidate's Question: ${userMessage}\n\n[Candidate's Current ${language || "code"} in editor]:\n\`\`\`\n${currentCode || "No code written yet"}\n\`\`\``,
      },
    ];

    const reply = await callAiApi(messages, { maxTokens: 450, temperature: 0.6 });
    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("Error in askPlacementAiCopilot:", error);
    return res.status(500).json({
      success: false,
      message: "AI Copilot is currently busy. Please try asking your question again.",
      reply: "I'm experiencing high traffic, but here is a quick tip: check your edge cases (empty input, single element, or out-of-bounds array indices) and verify your time complexity constraint.",
    });
  }
};
