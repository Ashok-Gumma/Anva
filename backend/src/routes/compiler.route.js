import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import axios from "axios";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Language mapping: frontend language name → OneCompiler language ID
// Refer to: https://onecompiler.com/api/code/languages
// ─────────────────────────────────────────────────────────────────────────────
const LANG_MAP = {
  javascript: "javascript",
  js:         "javascript",
  typescript: "typescript",
  python:     "python",
  python3:    "python",
  java:       "java",
  c:          "c",
  cpp:        "cpp",
  "c++":      "cpp",
  ruby:       "ruby",
  go:         "go",
  php:        "php",
  rust:       "rust",
  swift:      "swift",
  kotlin:     "kotlin",
  mysql:      "mysql",
  postgresql: "postgresql",
  mongodb:    "mongodb",
  dart:       "dart",
  html:       "html",
  css:        "css",
  csharp:     "csharp",
};

router.post("/execute", protectRoute, async (req, res) => {
  const { language, files, stdin } = req.body;
  const code = files?.[0]?.content || "";
  const lang = language?.toLowerCase();
  
  const oneCompilerLang = LANG_MAP[lang];

  if (!oneCompilerLang) {
    return res.status(200).json({
      run: {
        stdout: "",
        stderr: `⚠️ Language "${language}" is not yet supported.\n\nSupported: ${Object.keys(LANG_MAP).filter(l => l.length > 2).join(", ")}`,
      },
    });
  }

  try {
    const options = {
      method: 'POST',
      url: 'https://onecompiler-apis.p.rapidapi.com/api/v1/run',
      headers: {
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        language: oneCompilerLang,
        stdin: stdin || "",
        files: [
          {
            name: `main.${lang === 'javascript' ? 'js' : lang === 'typescript' ? 'ts' : lang === 'cpp' ? 'cpp' : lang}`, // fallback extension
            content: code
          }
        ]
      }
    };

    const response = await axios.request(options);
    const data = response.data;

    // OneCompiler response format: { stdout, stderr, exception, executionTime, limitExceeded }
    // We map it to the frontend's expected format: { run: { stdout, stderr } }
    
    let stdout = data.stdout || "";
    let stderr = data.stderr || "";
    
    if (data.exception) {
        stderr = (stderr ? stderr + "\n" : "") + data.exception;
    }

    return res.status(200).json({
      run: {
        stdout,
        stderr,
        executionTime: data.executionTime,
        limitExceeded: data.limitExceeded
      }
    });

  } catch (error) {
    console.error("RapidAPI Error:", error.response?.data || error.message);
    
    return res.status(200).json({
      run: {
        stdout: "",
        stderr: `❌ Compiler API Error: ${error.response?.data?.message || error.message}`,
      },
    });
  }
});

export default router;
