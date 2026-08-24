import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Copy,
  Check,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Terminal,
  Code2,
  Keyboard,
  FileCode,
  Trash2,
  Moon,
  Sun,
  Zap,
  WrapText,
  Info,
  Sparkles
} from "lucide-react";
import { executeCompilerCode } from "../lib/api";
import toast from "react-hot-toast";

const LANGUAGES = {
  javascript: {
    name: "JavaScript",
    ext: "js",
    version: "18.15.0",
    monacoLang: "javascript",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    code: `// Modern JavaScript Playground
// Press Ctrl + Enter (or Cmd + Enter) to Run Code!

function demonstrateFeatures() {
  console.log("⚡ Welcome to Anva Cloud Compiler & IDE!");
  
  const techStack = [
    { name: "React 19", role: "Frontend UI" },
    { name: "Monaco Editor", role: "Code Workspace" },
    { name: "Node.js 18", role: "Cloud Execution" },
    { name: "Tailwind CSS", role: "Modern Styling" }
  ];

  console.log("\\n📊 Current Tech Stack:");
  console.table(techStack);

  const numbers = [12, 45, 78, 23, 89, 56];
  const maxVal = Math.max(...numbers);
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);

  console.log(\`\\n🔢 Numbers: [\${numbers.join(", ")}]\`);
  console.log(\`📈 Max Value: \${maxVal}\`);
  console.log(\`➕ Total Sum: \${sum}\`);
}

demonstrateFeatures();`
  },
  python: {
    name: "Python 3",
    ext: "py",
    version: "3.10.0",
    monacoLang: "python",
    badgeColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    code: `# Modern Python 3.10 Playground
# Press Ctrl + Enter to run code instantly!

from dataclasses import dataclass
from typing import List

@dataclass
class Student:
    name: str
    skills: List[str]
    score: float

def main():
    print("🐍 Welcome to Anva Python Execution Engine!\\n")
    
    students = [
        Student("Aarav", ["Python", "FastAPI", "AI"], 94.5),
        Student("Diya", ["React", "TypeScript", "Node"], 96.0),
        Student("Rohan", ["C++", "DSA", "Distributed Systems"], 91.8),
    ]
    
    print("🎓 Top Performing Students:")
    for s in students:
        skills_str = ", ".join(s.skills)
        print(f"  • {s.name:<8} | Score: {s.score}% | Skills: {skills_str}")
        
    avg_score = sum(s.score for s in students) / len(students)
    print(f"\\n📊 Average Placement Score: {avg_score:.2f}%")

if __name__ == "__main__":
    main()`
  },
  typescript: {
    name: "TypeScript",
    ext: "ts",
    version: "5.0.3",
    monacoLang: "typescript",
    badgeColor: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    code: `// TypeScript 5.0 Environment
interface PlacementCandidate {
  readonly id: string;
  name: string;
  targetRole: string;
  solvedProblems: number;
  rating: number;
}

function evaluateCandidate(candidate: PlacementCandidate): string {
  const isReady = candidate.solvedProblems >= 100 && candidate.rating >= 1600;
  return isReady 
    ? \`✅ \${candidate.name} is placement-ready for \${candidate.targetRole}!\`
    : \`⏳ \${candidate.name} needs more practice (Target: 100+ problems).\`;
}

const developer: PlacementCandidate = {
  id: "ANVA-2026",
  name: "Ashok",
  targetRole: "Full Stack Engineer",
  solvedProblems: 142,
  rating: 1780
};

console.log("🔷 TypeScript Evaluation Result:");
console.log(evaluateCandidate(developer));`
  },
  cpp: {
    name: "C++ (GCC)",
    ext: "cpp",
    version: "10.2.0",
    monacoLang: "cpp",
    badgeColor: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
    code: `#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

int main() {
    std::cout << "⚡ High Performance C++ 20 Runner\\n\\n";
    
    std::vector<int> scores = {85, 92, 78, 96, 89, 94};
    
    std::cout << "Original Scores: ";
    for (int s : scores) std::cout << s << " ";
    std::cout << "\\n";
    
    std::sort(scores.begin(), scores.end(), std::greater<int>());
    
    std::cout << "Sorted (Desc):   ";
    for (int s : scores) std::cout << s << " ";
    std::cout << "\\n";
    
    double avg = std::accumulate(scores.begin(), scores.end(), 0.0) / scores.size();
    std::cout << "\\nTop Score: " << scores.front() << "\\n";
    std::cout << "Average:   " << avg << "\\n";
    
    return 0;
}`
  },
  c: {
    name: "C (GCC)",
    ext: "c",
    version: "10.2.0",
    monacoLang: "c",
    badgeColor: "text-slate-400 bg-slate-400/10 border-slate-400/20",
    code: `#include <stdio.h>
#include <stdlib.h>

void printBinary(unsigned int num) {
    printf("%3u in binary: ", num);
    for (int i = 7; i >= 0; i--) {
        int bit = (num >> i) & 1;
        printf("%d", bit);
    }
    printf("\\n");
}

int main() {
    printf("🔧 C Standard Engine (Low-Level Systems)\\n\\n");
    
    unsigned int values[] = {1, 2, 4, 8, 16, 42, 128, 255};
    int n = sizeof(values) / sizeof(values[0]);
    
    for (int i = 0; i < n; i++) {
        printBinary(values[i]);
    }
    
    return 0;
}`
  },
  java: {
    name: "Java (OpenJDK)",
    ext: "java",
    version: "15.0.2",
    monacoLang: "java",
    badgeColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("☕ Java Virtual Machine Workspace\\n");
        
        Map<String, String> roadmap = new LinkedHashMap<>();
        roadmap.put("Phase 1", "Data Structures & Algorithms in Java");
        roadmap.put("Phase 2", "Spring Boot & Microservices");
        roadmap.put("Phase 3", "System Design & Low-Level Architecture");
        roadmap.put("Phase 4", "Live Mock Interviews on Anva");
        
        roadmap.forEach((phase, desc) -> {
            System.out.printf("[%s] -> %s%n", phase, desc);
        });
        
        System.out.println("\\nStatus: JVM execution completed cleanly.");
    }
}`
  },
  go: {
    name: "Go",
    ext: "go",
    version: "1.16.2",
    monacoLang: "go",
    badgeColor: "text-teal-400 bg-teal-400/10 border-teal-400/20",
    code: `package main

import (
	"fmt"
	"strings"
	"time"
)

func main() {
	fmt.Println("🐹 Go Concurrency & Cloud Runtime")
	fmt.Printf("Started at: %s\\n\\n", time.Now().Format("2006-01-02 15:04:05"))

	languages := []string{"Go", "Rust", "TypeScript", "Python", "C++"}
	fmt.Println("Backend Services Architecture:")
	for idx, lang := range languages {
		fmt.Printf(" [%d] %s-service.internal\\n", idx+1, strings.ToLower(lang))
	}
}`
  },
  rust: {
    name: "Rust",
    ext: "rs",
    version: "1.68.2",
    monacoLang: "rust",
    badgeColor: "text-red-400 bg-red-400/10 border-red-400/20",
    code: `// Safe & Blazing Fast Systems Programming in Rust
fn main() {
    println!("🦀 Rust 1.68 Memory-Safe Compiler\\n");
    
    let numbers: Vec<i32> = (1..=10).collect();
    let evens: Vec<i32> = numbers.iter().filter(|&&x| x % 2 == 0).cloned().collect();
    let sum_of_squares: i32 = evens.iter().map(|&x| x * x).sum();
    
    println!("Range 1..=10:       {:?}", numbers);
    println!("Even elements:      {:?}", evens);
    println!("Sum of even squares: {}", sum_of_squares);
}`
  },
  csharp: {
    name: "C# (.NET)",
    ext: "cs",
    version: "9.0",
    monacoLang: "csharp",
    badgeColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    code: `using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        Console.WriteLine("🟣 Modern C# / .NET Runtime\\n");
        
        var numbers = Enumerable.Range(1, 10).ToList();
        var cubes = numbers.Select(n => new { Number = n, Cube = n * n * n });
        
        foreach (var item in cubes) {
            Console.WriteLine($"Number: {item.Number,2} | Cube: {item.Cube,4}");
        }
    }
}`
  },
  php: {
    name: "PHP",
    ext: "php",
    version: "8.2.3",
    monacoLang: "php",
    badgeColor: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    code: `<?php
echo "🐘 PHP 8.2 Live Runtime\\n\\n";

$data = [
    "platform" => "Anva Career Hub",
    "features" => ["Compiler", "Mock Tests", "Study Groups", "AI Tutor"],
    "status" => "Online"
];

print_r($data);
?>`
  },
  ruby: {
    name: "Ruby",
    ext: "rb",
    version: "3.2.1",
    monacoLang: "ruby",
    badgeColor: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    code: `# Ruby 3.2 Dynamic Language Playground
puts "💎 Elegant Ruby Environment\\n"

languages = ["Ruby", "Crystal", "Elixir", "Python"]
languages.each_with_index do |lang, idx|
  puts "#{idx + 1}. #{lang.upcase} (Length: #{lang.length})"
end`
  },
  swift: {
    name: "Swift",
    ext: "swift",
    version: "5.3.3",
    monacoLang: "swift",
    badgeColor: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    code: `import Foundation

print("🕊️ Swift 5.3 Modern Type-Safe Engine\\n")

let scores = [98, 87, 92, 75, 89]
let highest = scores.max() ?? 0
print("Scores: \(scores)")
print("Highest score achieved: \(highest)")`
  },
  kotlin: {
    name: "Kotlin",
    ext: "kt",
    version: "1.8.20",
    monacoLang: "kotlin",
    badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    code: `fun main() {
    println("🎯 Kotlin 1.8 Idiomatic JVM Runtime\\n")
    
    val items = listOf("Arrays", "Trees", "Graphs", "Dynamic Programming")
    val formatted = items.mapIndexed { index, name -> "\${index + 1}. \$name" }
    
    formatted.forEach { println(it) }
}`
  },
  dart: {
    name: "Dart",
    ext: "dart",
    version: "2.12.0",
    monacoLang: "dart",
    badgeColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    code: `void main() {
  print("🎯 Dart & Flutter Core Runtime\\n");
  
  final technologies = ["Flutter", "Dart", "Firebase", "WebSockets"];
  for (var tech in technologies) {
    print("• $tech");
  }
}`
  },
  mysql: {
    name: "MySQL",
    ext: "sql",
    version: "8.0",
    monacoLang: "sql",
    badgeColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    code: `-- MySQL Relational Database Script
CREATE TABLE Students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    cgpa DECIMAL(3,2),
    placed BOOLEAN DEFAULT FALSE
);

INSERT INTO Students (name, cgpa, placed) VALUES
('Ashok Kumar', 9.24, TRUE),
('Priya Sharma', 8.90, TRUE),
('Kiran Reddy', 8.45, FALSE);

SELECT id, name, cgpa, 
       CASE WHEN placed THEN 'Placed' ELSE 'Interviewing' END AS status
FROM Students 
ORDER BY cgpa DESC;`
  },
  postgresql: {
    name: "PostgreSQL",
    ext: "sql",
    version: "13",
    monacoLang: "sql",
    badgeColor: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    code: `-- PostgreSQL SQL Schema & Analytical Queries
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    department VARCHAR(30),
    salary NUMERIC(10, 2)
);

INSERT INTO employees (name, department, salary) VALUES
('Siddharth', 'Engineering', 120000),
('Ananya', 'Engineering', 135000),
('Vikram', 'Product', 110000),
('Neha', 'Design', 95000);

SELECT department, COUNT(*) AS headcount, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;`
  },
  mongodb: {
    name: "MongoDB",
    ext: "js",
    version: "5.0",
    monacoLang: "javascript",
    badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    code: `// MongoDB Aggregation & Document Query Demo
db.candidates.insertMany([
  { name: "Rahul", skills: ["React", "Node", "MongoDB"], experience: 3 },
  { name: "Sneha", skills: ["Python", "PyTorch", "AWS"], experience: 4 },
  { name: "Varun", skills: ["Go", "Kubernetes", "Docker"], experience: 2 }
]);

db.candidates.find({ experience: { $gte: 3 } });`
  },
  html: {
    name: "HTML5",
    ext: "html",
    version: "5",
    monacoLang: "html",
    badgeColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Anva Interactive Web Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
    .card { background: #1e293b; padding: 1.5rem; border-radius: 12px; border: 1px solid #334155; }
    h1 { color: #38bdf8; margin-top: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 Welcome to Anva Web Sandbox</h1>
    <p>HTML & CSS markup rendered live in the cloud environment.</p>
  </div>
</body>
</html>`
  },
  css: {
    name: "CSS3",
    ext: "css",
    version: "3",
    monacoLang: "css",
    badgeColor: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    code: `/* Modern Glassmorphic Stylesheet */
:root {
  --primary-accent: #6366f1;
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
}

.modern-ide-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  padding: 1.5rem;
  color: #ffffff;
}`
  }
};

const PRESETS = {
  javascript: [
    {
      title: "Two Sum (O(n) Hash Map)",
      code: `// Two Sum Problem - Efficient O(n) using Map
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const numbers = [2, 7, 11, 15];
const target = 9;
const result = twoSum(numbers, target);

console.log("Input Array:", numbers);
console.log("Target:", target);
console.log("Indices found:", result);
console.log("Values found:", result.map(idx => numbers[idx]));`
    },
    {
      title: "Binary Search (O(log n))",
      code: `// Binary Search Algorithm
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const sortedList = [10, 23, 35, 48, 59, 72, 86, 99];
const searchVal = 48;
const index = binarySearch(sortedList, searchVal);

console.log("Sorted Array:", sortedList);
console.log(\`Element \${searchVal} located at index:\`, index);`
    },
    {
      title: "FizzBuzz",
      code: `// Classic FizzBuzz Implementation
for (let i = 1; i <= 25; i++) {
  if (i % 15 === 0) console.log(\`\${i}: FizzBuzz ⚡\`);
  else if (i % 3 === 0) console.log(\`\${i}: Fizz\`);
  else if (i % 5 === 0) console.log(\`\${i}: Buzz\`);
  else console.log(\`\${i}\`);
}`
    },
    {
      title: "Fibonacci Generator",
      code: `// Fibonacci Sequence Generator
function getFibonacci(n) {
  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq.slice(0, n);
}

console.log("First 15 Fibonacci Numbers:");
console.log(getFibonacci(15));`
    }
  ],
  python: [
    {
      title: "Two Sum Problem",
      code: `# Two Sum O(n) in Python
def two_sum(nums, target):
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []

nums = [3, 2, 4]
target = 6
ans = two_sum(nums, target)
print(f"Nums: {nums}, Target: {target}")
print(f"Target indices: {ans}")`
    },
    {
      title: "Binary Search",
      code: `# Binary Search in Python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23
result = binary_search(arr, target)
print(f"Array: {arr}")
print(f"Found {target} at index: {result}")`
    },
    {
      title: "Valid Palindrome",
      code: `# Palindrome Verification
def is_palindrome(s: str) -> bool:
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]

test_cases = [
    "A man, a plan, a canal: Panama",
    "race a car",
    "Was it a car or a cat I saw?"
]

for text in test_cases:
    print(f"'{text}' -> Palindrome? {is_palindrome(text)}")`
    }
  ],
  cpp: [
    {
      title: "Binary Search",
      code: `#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    std::vector<int> nums = {4, 7, 12, 19, 25, 33, 49, 61};
    int target = 25;
    int idx = binarySearch(nums, target);
    
    std::cout << "Target " << target << " found at index: " << idx << "\\n";
    return 0;
}`
    },
    {
      title: "Matrix Transpose",
      code: `#include <iostream>
#include <vector>

int main() {
    std::vector<std::vector<int>> matrix = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    
    int rows = matrix.size();
    int cols = matrix[0].size();
    
    std::cout << "Original Matrix:\\n";
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) std::cout << matrix[r][c] << " ";
        std::cout << "\\n";
    }
    
    std::cout << "\\nTransposed Matrix:\\n";
    for (int c = 0; c < cols; c++) {
        for (int r = 0; r < rows; r++) std::cout << matrix[r][c] << " ";
        std::cout << "\\n";
    }
    return 0;
}`
    }
  ],
  java: [
    {
      title: "Two Sum Hash Map",
      code: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        
        System.out.println("Input: " + Arrays.toString(nums) + ", Target: " + target);
        System.out.println("Result indices: " + Arrays.toString(result));
    }
}`
    }
  ]
};

const FONT_SIZES = [13, 14, 15, 16, 18, 20, 22];

const CompilerPage = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGES["javascript"].code);
  const [output, setOutput] = useState("");
  const [stdin, setStdin] = useState("");
  const [activeTab, setActiveTab] = useState("terminal"); // 'terminal' | 'stdin' | 'shortcuts'
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  
  // Customization & Readability States
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("anva_compiler_font_size");
    return saved ? parseInt(saved, 10) : 16;
  });
  
  const [editorTheme, setEditorTheme] = useState(() => {
    return localStorage.getItem("anva_compiler_theme") || "vs-dark";
  });
  
  const [isWordWrap, setIsWordWrap] = useState(() => {
    return localStorage.getItem("anva_compiler_wordwrap") !== "false";
  });
  
  const [showMinimap, setShowMinimap] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("anva_compiler_font_size", fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("anva_compiler_theme", editorTheme);
  }, [editorTheme]);

  useEffect(() => {
    localStorage.setItem("anva_compiler_wordwrap", isWordWrap.toString());
  }, [isWordWrap]);

  // Global Keyboard Shortcuts (Ctrl+Enter to run code)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        toast.success("Code saved in active browser session.", { icon: "💾" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, language, stdin]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(LANGUAGES[lang].code);
    setOutput("");
    setExecutionTime(null);
    setIsError(false);
    toast.success(`Switched to ${LANGUAGES[lang].name}`, { icon: "⚡" });
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });

    // Add keybinding inside Monaco for Ctrl+Enter
    editor.addCommand(window.monaco?.KeyMod.CtrlCmd | window.monaco?.KeyCode.Enter, () => {
      runCode();
    });
  };

  const handleZoomIn = () => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  };

  const handleZoomOut = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success("Code copied to clipboard!", { icon: "📋" });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyOutput = () => {
    if (!output) {
      toast.error("No terminal output to copy.");
      return;
    }
    navigator.clipboard.writeText(output);
    setCopiedOutput(true);
    toast.success("Terminal output copied!", { icon: "📋" });
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const handleDownloadCode = () => {
    const currentLang = LANGUAGES[language];
    const filename = `${language === "java" ? "Main" : "main"}.${currentLang.ext}`;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setCode(content);
        toast.success(`Loaded file: ${file.name}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResetCode = () => {
    setCode(LANGUAGES[language].code);
    setOutput("");
    setIsError(false);
    setExecutionTime(null);
    toast.success("Reset to default template.");
  };

  const handleClearOutput = () => {
    setOutput("");
    setIsError(false);
    setExecutionTime(null);
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.error("Editor is empty. Write some code first!");
      return;
    }
    setIsRunning(true);
    setIsError(false);
    setActiveTab("terminal");
    setOutput("🚀 Compiling & executing code on cloud runner...\n");
    const startTime = performance.now();

    try {
      const data = await executeCompilerCode({
        language: language,
        version: LANGUAGES[language].version,
        files: [{ content: code }],
        stdin: stdin
      });

      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);
      setExecutionTime(data.run?.executionTime ? `${data.run.executionTime}ms` : `${elapsed}ms`);

      if (data.run) {
        if (data.run.stderr) {
          setIsError(true);
          const fullErr = data.run.stderr + (data.run.stdout ? "\n" + data.run.stdout : "");
          setOutput(fullErr);
        } else {
          setOutput(data.run.stdout || "Program exited with code 0 (no output).");
        }
      } else {
        setIsError(true);
        setOutput(data.message || "Execution engine encountered an unexpected error.");
      }
    } catch (error) {
      setIsError(true);
      setOutput(`❌ Execution Error: ${error?.response?.data?.message || error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const currentLangConfig = LANGUAGES[language] || LANGUAGES["javascript"];
  const filename = `${language === "java" ? "Main" : "main"}.${currentLangConfig.ext}`;

  return (
    <div
      ref={containerRef}
      className={`compiler-page-wrapper w-full flex flex-col bg-base-200 transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 h-screen w-screen p-0" : "min-h-[calc(100vh-4rem)] p-3 sm:p-5"
      }`}
    >
      {/* ── Hidden File Input for loading code ── */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".js,.ts,.py,.cpp,.c,.java,.go,.rs,.cs,.php,.rb,.swift,.kt,.dart,.sql,.html,.css,.txt"
      />

      {/* ── MAIN IDE WORKSPACE GRID ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 overflow-hidden">
        
        {/* ════════════════════════════════════════════════════════════════════
            LEFT COLUMN (7 COLS): MONACO CODE EDITOR STUDIO
           ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 flex flex-col bg-base-100 rounded-2xl border border-base-content/10 shadow-md overflow-hidden min-h-[500px] lg:min-h-0">
          
          {/* ── Top Bar / Studio Controls ── */}
          <div className="px-3 sm:px-4 py-2.5 bg-base-200/70 border-b border-base-content/10 flex flex-wrap items-center justify-between gap-2.5">
            {/* Left Controls: File Tab & Language Selector */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Active Tab Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-base-100 border border-base-content/10 shadow-xs">
                <FileCode className="size-4 text-primary" />
                <span className="font-mono text-xs sm:text-sm font-bold text-base-content tracking-tight">
                  {filename}
                </span>
                <span className="size-1.5 rounded-full bg-emerald-500 ml-1" title="Ready" />
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1">
                <select
                  aria-label="Select Programming Language"
                  className="select select-bordered select-sm font-semibold text-xs sm:text-sm bg-base-100 border-base-content/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl cursor-pointer"
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  {Object.entries(LANGUAGES).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name} ({item.version})
                    </option>
                  ))}
                </select>
              </div>

              {/* Algorithms / Template Presets */}
              {PRESETS[language] && PRESETS[language].length > 0 && (
                <select
                  aria-label="Select Code Algorithm Preset"
                  className="select select-bordered select-sm text-xs font-semibold bg-primary/10 border-primary/20 text-primary hover:bg-primary/15 rounded-xl cursor-pointer"
                  onChange={(e) => {
                    const selectedPreset = PRESETS[language].find((p) => p.title === e.target.value);
                    if (selectedPreset) {
                      setCode(selectedPreset.code);
                      toast.success(`Loaded preset: ${selectedPreset.title}`, { icon: "📐" });
                    }
                    e.target.value = "";
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    📐 Algorithms & Templates
                  </option>
                  {PRESETS[language].map((preset) => (
                    <option key={preset.title} value={preset.title}>
                      {preset.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Right Controls: Font Size, Theme, Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Font Size Adjuster Controls */}
              <div className="flex items-center bg-base-100 border border-base-content/10 rounded-xl p-0.5 shadow-xs" title="Editor & Terminal Font Size">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="btn btn-ghost btn-xs btn-square hover:bg-base-200 text-base-content"
                  title="Decrease Font Size"
                >
                  <ZoomOut className="size-3.5" />
                </button>
                
                <select
                  aria-label="Font Size Selection"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="bg-transparent text-xs font-mono font-bold px-1.5 text-center focus:outline-none cursor-pointer text-base-content"
                >
                  {FONT_SIZES.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}px
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="btn btn-ghost btn-xs btn-square hover:bg-base-200 text-base-content"
                  title="Increase Font Size"
                >
                  <ZoomIn className="size-3.5" />
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={() => setEditorTheme((prev) => (prev === "vs-dark" ? "light" : prev === "light" ? "hc-black" : "vs-dark"))}
                className="btn btn-ghost btn-sm btn-square border border-base-content/10 bg-base-100 shadow-xs"
                title={`Theme: ${editorTheme === "vs-dark" ? "Dark+" : editorTheme === "light" ? "Light+" : "High Contrast"}`}
              >
                {editorTheme === "vs-dark" ? (
                  <Moon className="size-4 text-primary" />
                ) : editorTheme === "light" ? (
                  <Sun className="size-4 text-amber-500" />
                ) : (
                  <Zap className="size-4 text-emerald-400" />
                )}
              </button>

              {/* Word Wrap Toggle */}
              <button
                type="button"
                onClick={() => setIsWordWrap((prev) => !prev)}
                className={`btn btn-sm btn-square border shadow-xs transition-colors ${
                  isWordWrap ? "btn-primary" : "btn-ghost border-base-content/10 bg-base-100"
                }`}
                title={isWordWrap ? "Word Wrap: Enabled" : "Word Wrap: Disabled"}
              >
                <WrapText className="size-4" />
              </button>

              {/* Copy Code */}
              <button
                type="button"
                onClick={handleCopyCode}
                className="btn btn-ghost btn-sm btn-square border border-base-content/10 bg-base-100 shadow-xs"
                title="Copy Source Code"
              >
                {copiedCode ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
              </button>

              {/* Download Code */}
              <button
                type="button"
                onClick={handleDownloadCode}
                className="btn btn-ghost btn-sm btn-square border border-base-content/10 bg-base-100 shadow-xs"
                title="Download Source Code File"
              >
                <Download className="size-4" />
              </button>

              {/* Upload Code File */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-ghost btn-sm btn-square border border-base-content/10 bg-base-100 shadow-xs"
                title="Open Local File"
              >
                <Upload className="size-4" />
              </button>

              {/* Reset Code */}
              <button
                type="button"
                onClick={handleResetCode}
                className="btn btn-ghost btn-sm btn-square border border-base-content/10 bg-base-100 shadow-xs text-error hover:bg-error/10"
                title="Reset Code Template"
              >
                <RotateCcw className="size-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="btn btn-ghost btn-sm btn-square border border-base-content/10 bg-base-100 shadow-xs"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Focus Mode"}
              >
                {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </button>
            </div>
          </div>

          {/* ── Monaco Editor Live Workspace ── */}
          <div className="flex-1 relative overflow-hidden min-h-[380px] sm:min-h-[460px]">
            <Editor
              height="100%"
              language={currentLangConfig.monacoLang}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              theme={editorTheme}
              loading={
                <div className="flex flex-col justify-center items-center h-full gap-3 bg-base-100 text-base-content/60">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="text-sm font-medium">Initializing Monaco Editor...</p>
                </div>
              }
              options={{
                minimap: { enabled: showMinimap },
                fontSize: fontSize,
                lineHeight: Math.round(fontSize * 1.6),
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, Consolas, 'Courier New', monospace",
                fontLigatures: true,
                letterSpacing: 0.3,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true,
                  highlightActiveBracketPair: true
                },
                renderLineHighlight: "all",
                wordWrap: isWordWrap ? "on" : "off",
                padding: { top: 18, bottom: 18 },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 2,
                formatOnPaste: true,
                formatOnType: true
              }}
            />
          </div>

          {/* ── Editor Footer Status Bar ── */}
          <div className="px-4 py-2 bg-base-200/80 border-t border-base-content/10 flex items-center justify-between text-xs font-mono text-base-content/60 select-none">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold">
                <span className="text-base-content/40">Ln</span> {cursorPos.line},{" "}
                <span className="text-base-content/40">Col</span> {cursorPos.column}
              </span>
              <span className="hidden sm:inline text-base-content/30">•</span>
              <span className="hidden sm:inline font-medium">{code.length} characters</span>
              <span className="hidden sm:inline text-base-content/30">•</span>
              <span className="hidden sm:inline font-medium">{code.split("\n").length} lines</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-primary">{currentLangConfig.name}</span>
              <span className="text-base-content/30">•</span>
              <span>UTF-8</span>
              <span className="text-base-content/30">•</span>
              <span className="font-bold">{fontSize}px</span>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            RIGHT COLUMN (5 COLS): INTERACTIVE RUNNER, STDIN & TERMINAL STUDIO
           ════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 flex flex-col bg-base-100 rounded-2xl border border-base-content/10 shadow-md overflow-hidden min-h-[480px] lg:min-h-0">
          
          {/* ── Studio Navigation Header & Primary RUN CTA ── */}
          <div className="px-3 sm:px-4 py-2.5 bg-base-200/70 border-b border-base-content/10 flex items-center justify-between gap-2 flex-wrap">
            {/* Tabs */}
            <div className="flex items-center bg-base-100 border border-base-content/10 rounded-xl p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("terminal")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "terminal"
                    ? "bg-primary text-primary-content shadow-xs"
                    : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                }`}
              >
                <Terminal className="size-3.5" />
                <span>Output</span>
                {output && !isRunning && (
                  <span className={`size-2 rounded-full ${isError ? "bg-red-400" : "bg-emerald-400"}`} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("stdin")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "stdin"
                    ? "bg-primary text-primary-content shadow-xs"
                    : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                }`}
              >
                <Keyboard className="size-3.5" />
                <span>Standard Input</span>
                {stdin.trim() && (
                  <span className="badge badge-xs badge-info font-bold px-1 py-0.5 text-[10px]">active</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("shortcuts")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "shortcuts"
                    ? "bg-primary text-primary-content shadow-xs"
                    : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                }`}
              >
                <Sparkles className="size-3.5" />
                <span className="hidden sm:inline">Tips</span>
              </button>
            </div>

            {/* Primary RUN CODE Action Button */}
            <button
              type="button"
              onClick={runCode}
              disabled={isRunning}
              className="btn btn-primary btn-sm px-4 font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
            >
              {isRunning ? (
                <>
                  <span className="loading loading-spinner size-4"></span>
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="size-4 fill-current" />
                  <span>Run Code</span>
                  <kbd className="hidden sm:inline-block kbd kbd-xs bg-primary-content/20 text-primary-content border-none font-mono text-[10px] ml-1">
                    Ctrl + ↵
                  </kbd>
                </>
              )}
            </button>
          </div>

          {/* ── TAB 1: TERMINAL OUTPUT WINDOW ── */}
          {activeTab === "terminal" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0c1017] text-slate-200">
              {/* Terminal Window Chrome */}
              <div className="px-4 py-2.5 bg-[#161b22] border-b border-white/10 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="size-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="size-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  </div>
                  <span className="font-mono text-xs text-slate-400 font-semibold ml-2">
                    bash — {currentLangConfig.name} runner
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Indicator */}
                  {isRunning ? (
                    <span className="badge badge-warning badge-sm gap-1 font-bold text-xs">
                      <span className="loading loading-spinner size-3"></span> Running...
                    </span>
                  ) : isError ? (
                    <span className="badge badge-error badge-sm gap-1 font-bold text-xs">
                      <AlertCircle className="size-3" /> Runtime Error
                    </span>
                  ) : output ? (
                    <span className="badge badge-success badge-sm gap-1 font-bold text-xs text-black">
                      <CheckCircle2 className="size-3" /> Exited 0
                    </span>
                  ) : (
                    <span className="badge badge-ghost badge-sm text-xs font-semibold text-slate-400">
                      Idle
                    </span>
                  )}

                  {executionTime && (
                    <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      ⏱️ {executionTime}
                    </span>
                  )}

                  {/* Terminal Actions */}
                  <button
                    type="button"
                    onClick={handleCopyOutput}
                    className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
                    title="Copy Output"
                  >
                    {copiedOutput ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleClearOutput}
                    className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-rose-400 transition-colors"
                    title="Clear Terminal"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Terminal Body with Dynamic Readable Font */}
              <div
                className="flex-1 p-4 sm:p-5 font-mono overflow-y-auto whitespace-pre-wrap select-text leading-relaxed focus:outline-none"
                style={{
                  fontSize: `${Math.max(fontSize - 1, 14)}px`,
                  lineHeight: 1.6,
                  fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
                }}
              >
                {output ? (
                  <div className={isError ? "text-rose-400 font-medium" : "text-emerald-400 font-medium"}>
                    {output}
                  </div>
                ) : (
                  <div className="text-slate-500 flex flex-col gap-2">
                    <p className="text-slate-400 font-semibold">
                      $ ./run --lang {language} --entry {filename}
                    </p>
                    <p className="text-slate-500 text-sm">
                      Ready to execute. Write your code on the left and click{" "}
                      <span className="text-primary font-bold">Run Code</span> or press{" "}
                      <kbd className="kbd kbd-xs bg-slate-800 text-slate-300">Ctrl+Enter</kbd>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: STANDARD INPUT (STDIN) ── */}
          {activeTab === "stdin" && (
            <div className="flex-1 p-4 sm:p-5 flex flex-col bg-base-100 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Keyboard className="size-4 text-primary" />
                  <span className="text-sm font-bold text-base-content">
                    Program Input (stdin)
                  </span>
                </div>
                {stdin && (
                  <button
                    type="button"
                    onClick={() => setStdin("")}
                    className="btn btn-ghost btn-xs text-error font-semibold"
                  >
                    Clear Input
                  </button>
                )}
              </div>

              <p className="text-xs text-base-content/60 mb-3">
                Provide custom test inputs line-by-line. Used whenever your code calls functions like{" "}
                <code className="px-1 py-0.5 bg-base-200 rounded text-primary font-mono font-bold">
                  input()
                </code>
                ,{" "}
                <code className="px-1 py-0.5 bg-base-200 rounded text-primary font-mono font-bold">
                  cin &gt;&gt;
                </code>
                , or{" "}
                <code className="px-1 py-0.5 bg-base-200 rounded text-primary font-mono font-bold">
                  Scanner.next()
                </code>
                .
              </p>

              <textarea
                aria-label="Standard input text box"
                className="textarea textarea-bordered flex-1 w-full bg-base-200/50 text-base-content font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed resize-none rounded-xl p-3"
                style={{ fontSize: `${Math.max(fontSize - 1, 14)}px` }}
                placeholder="Enter input values here (e.g. numbers, strings, test cases on separate lines)..."
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
              />

              {/* Sample Input helper chips */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-base-content/60">
                <span className="font-semibold text-base-content/80">Quick Samples:</span>
                <button
                  type="button"
                  onClick={() => setStdin("10\n20\n30\n40\n50")}
                  className="btn btn-xs btn-outline rounded-lg"
                >
                  List of integers
                </button>
                <button
                  type="button"
                  onClick={() => setStdin("5\nhello world\nanva compiler")}
                  className="btn btn-xs btn-outline rounded-lg"
                >
                  Strings
                </button>
                <button
                  type="button"
                  onClick={() => setStdin("3\n1 2 3\n4 5 6\n7 8 9")}
                  className="btn btn-xs btn-outline rounded-lg"
                >
                  Matrix
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 3: KEYBOARD SHORTCUTS & TIPS ── */}
          {activeTab === "shortcuts" && (
            <div className="flex-1 p-4 sm:p-5 flex flex-col bg-base-100 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="size-5 text-primary" />
                <h3 className="font-bold text-base text-base-content">
                  Compiler Quick Guide & Shortcuts
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="p-3.5 rounded-xl bg-base-200/60 border border-base-content/10 flex items-center justify-between">
                  <span className="text-sm font-semibold">Run Code</span>
                  <kbd className="kbd kbd-sm bg-base-100 font-mono font-bold">Ctrl + Enter</kbd>
                </div>
                <div className="p-3.5 rounded-xl bg-base-200/60 border border-base-content/10 flex items-center justify-between">
                  <span className="text-sm font-semibold">Save Session</span>
                  <kbd className="kbd kbd-sm bg-base-100 font-mono font-bold">Ctrl + S</kbd>
                </div>
                <div className="p-3.5 rounded-xl bg-base-200/60 border border-base-content/10 flex items-center justify-between">
                  <span className="text-sm font-semibold">Find / Replace</span>
                  <kbd className="kbd kbd-sm bg-base-100 font-mono font-bold">Ctrl + F</kbd>
                </div>
                <div className="p-3.5 rounded-xl bg-base-200/60 border border-base-content/10 flex items-center justify-between">
                  <span className="text-sm font-semibold">Format Code</span>
                  <kbd className="kbd kbd-sm bg-base-100 font-mono font-bold">Shift + Alt + F</kbd>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Info className="size-4" />
                  <span>Cloud Execution Environment</span>
                </div>
                <p className="text-xs text-base-content/70 leading-relaxed">
                  The Anva execution engine connects to isolated container environments supporting {Object.keys(LANGUAGES).length}+ programming languages. Memory and time limits are enforced to guarantee rapid, secure compilation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompilerPage;
