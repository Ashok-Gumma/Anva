import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import vm from "vm";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);
const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Language config: maps language name → { cmd, ext }
// cmd receives the temp file path as %FILE%
// ─────────────────────────────────────────────────────────────────────────────
const LANG_CONFIG = {
  python:     { ext: "py",   cmd: (f) => `python "${f}"` },
  python3:    { ext: "py",   cmd: (f) => `python3 "${f}"` },
  javascript: null, // handled by Node.js vm — no file needed
  js:         null,
  typescript: null, // frontend-only / unsupported on server
  java: {
    ext: "java",
    // Java requires class name to match file name — use Main.java + javac + java Main
    cmd: async (f, code) => {
      const dir = path.dirname(f);
      const javaFile = path.join(dir, "Main.java");
      await fs.writeFile(javaFile, code);
      return { compile: `javac "${javaFile}"`, run: `java -cp "${dir}" Main`, file: javaFile };
    },
  },
  c: {
    ext: "c",
    cmd: (f) => {
      const out = f.replace(".c", "");
      return { compile: `gcc "${f}" -o "${out}"`, run: `"${out}"`, cleanExtra: out };
    },
  },
  cpp: {
    ext: "cpp",
    cmd: (f) => {
      const out = f.replace(".cpp", "");
      return { compile: `g++ "${f}" -o "${out}"`, run: `"${out}"`, cleanExtra: out };
    },
  },
  "c++": {
    ext: "cpp",
    cmd: (f) => {
      const out = f.replace(".cpp", "");
      return { compile: `g++ "${f}" -o "${out}"`, run: `"${out}"`, cleanExtra: out };
    },
  },
  ruby: { ext: "rb",  cmd: (f) => `ruby "${f}"` },
  go:   { ext: "go",  cmd: (f) => `go run "${f}"` },
  php:  { ext: "php", cmd: (f) => `php "${f}"` },
};

const EXEC_OPTS = { timeout: 10000, maxBuffer: 1024 * 512 };

router.post("/execute", protectRoute, async (req, res) => {
  const { language, files } = req.body;
  const code = files?.[0]?.content || "";
  const lang = language?.toLowerCase();

  // ── JavaScript: run in Node.js vm sandbox ──────────────────────────────
  if (lang === "javascript" || lang === "js") {
    let output = "";
    const ctx = {
      console: {
        log:   (...a) => { output += a.join(" ") + "\n"; },
        error: (...a) => { output += a.join(" ") + "\n"; },
        warn:  (...a) => { output += a.join(" ") + "\n"; },
      },
    };
    vm.createContext(ctx);
    try {
      vm.runInContext(code, ctx, { timeout: 5000 });
      return res.status(200).json({ run: { stdout: output, stderr: "" } });
    } catch (err) {
      return res.status(200).json({ run: { stdout: output, stderr: err.toString() } });
    }
  }

  // ── All other languages: execute via child_process ──────────────────────
  const config = LANG_CONFIG[lang];
  if (!config) {
    return res.status(200).json({
      run: {
        stdout: "",
        stderr: `⚠️ Language "${language}" is not supported for server-side execution.\n\nSupported: JavaScript (local), Python, Java, C, C++, Ruby, Go, PHP`,
      },
    });
  }

  const tmpBase = path.join(os.tmpdir(), `anva_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const ext = typeof config.ext === "string" ? config.ext : config.ext;
  const tmpFile = `${tmpBase}.${ext}`;
  let extraFiles = [];

  try {
    await fs.writeFile(tmpFile, code);

    let stdout = "";
    let stderr = "";

    const cmdResult = await (typeof config.cmd === "function" && config.cmd.constructor.name === "AsyncFunction"
      ? config.cmd(tmpFile, code)
      : Promise.resolve(config.cmd(tmpFile)));

    if (typeof cmdResult === "string") {
      // Simple: one command does everything (Python, Ruby, Go, PHP)
      try {
        const result = await execAsync(cmdResult, EXEC_OPTS);
        stdout = result.stdout || "";
        stderr = result.stderr || "";
      } catch (err) {
        stdout = err.stdout || "";
        stderr = err.stderr || err.message || "Execution failed";
      }
    } else {
      // Compiled language: compile first, then run
      const { compile, run, file, cleanExtra } = cmdResult;
      if (file) extraFiles.push(file);
      if (cleanExtra) extraFiles.push(cleanExtra);

      try {
        await execAsync(compile, EXEC_OPTS);
      } catch (compErr) {
        return res.status(200).json({
          run: {
            stdout: "",
            stderr: compErr.stderr || compErr.message || "Compilation failed",
          },
        });
      }

      try {
        const result = await execAsync(run, EXEC_OPTS);
        stdout = result.stdout || "";
        stderr = result.stderr || "";
      } catch (runErr) {
        stdout = runErr.stdout || "";
        stderr = runErr.stderr || runErr.message || "Runtime error";
      }
    }

    return res.status(200).json({ run: { stdout, stderr } });
  } catch (err) {
    const isNotFound =
      err.message?.includes("not found") ||
      err.message?.includes("is not recognized") ||
      err.message?.includes("No such file") ||
      err.code === "ENOENT";

    return res.status(200).json({
      run: {
        stdout: "",
        stderr: isNotFound
          ? `⚠️ Runtime not found for "${language}".\n\nMake sure ${language} is installed on the server and available in PATH.`
          : `❌ ${err.message}`,
      },
    });
  } finally {
    // Clean up temp files
    for (const f of [tmpFile, ...extraFiles]) {
      await fs.unlink(f).catch(() => {});
    }
  }
});

export default router;
