import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { executeCompilerCode } from "../lib/api";

const LANGUAGES = {
  javascript: { version: "18.15.0", code: 'console.log("Hello from JavaScript!");', local: true },
  python: { version: "3.10.0", code: 'print("Hello from Python (Local Pyodide)!")', local: true },
  typescript: { version: "5.0.3", code: 'let message: string = "Hello TypeScript!";\nconsole.log(message);', local: false },
  cpp: { version: "10.2.0", code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!\\n";\n    return 0;\n}', local: false },
  c: { version: "10.2.0", code: '#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}', local: false },
  java: { version: "15.0.2", code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}', local: false },
  go: { version: "1.16.2", code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}', local: false },
  rust: { version: "1.68.2", code: 'fn main() {\n    println!("Hello from Rust!");\n}', local: false },
  php: { version: "8.2.3", code: '<?php\necho "Hello from PHP!";\n?>', local: false },
  ruby: { version: "3.2.1", code: 'puts "Hello from Ruby!"', local: false },
  swift: { version: "5.3.3", code: 'print("Hello from Swift!")', local: false },
  kotlin: { version: "1.8.20", code: 'fun main() {\n    println("Hello from Kotlin!")\n}', local: false }
};

const CompilerPage = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGES["javascript"].code);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  
  const pyodideLoaded = useRef(false);

  // Initialize Pyodide for Python
  useEffect(() => {
    if (language === "python" && !pyodide && !pyodideLoaded.current) {
      const initPyodide = async () => {
        setIsPyodideLoading(true);
        try {
          if (window.loadPyodide) {
            const py = await window.loadPyodide({
              indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
            });
            setPyodide(py);
            pyodideLoaded.current = true;
          }
        } catch (err) {
          console.error("Failed to load Pyodide:", err);
        } finally {
          setIsPyodideLoading(false);
        }
      };
      initPyodide();
    }
  }, [language, pyodide]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(LANGUAGES[lang].code);
    setOutput("");
  };

  const runCode = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setIsError(false);
    setOutput("Executing Code...\n");

    // Local Python Execution
    if (language === "python") {
      if (!pyodide) {
        setOutput("Error: Python engine (Pyodide) is still loading or failed to load. Please wait or refresh.");
        setIsError(true);
        setIsRunning(false);
        return;
      }
      
      try {
        // Redirect stdout to our terminal
        pyodide.runPython(`
          import sys
          import io
          sys.stdout = io.StringIO()
          sys.stderr = io.StringIO()
        `);
        
        await pyodide.runPythonAsync(code);
        
        const stdout = pyodide.runPython("sys.stdout.getvalue()");
        const stderr = pyodide.runPython("sys.stderr.getvalue()");
        
        if (stderr) {
          setIsError(true);
          setOutput(stderr + "\n" + (stdout || ""));
        } else {
          setOutput(stdout || "Program exited with code 0 (no output).");
        }
      } catch (err) {
        setIsError(true);
        setOutput(err.toString());
      } finally {
        setIsRunning(false);
      }
      return;
    }

    // Cloud/Backend Execution (JavaScript and others)
    try {
      const data = await executeCompilerCode({
        language: language,
        version: LANGUAGES[language].version,
        files: [{ content: code }]
      });

      if (data.run) {
        if (data.run.stderr) {
          setIsError(true);
          setOutput(data.run.stderr + "\n" + (data.run.stdout || ""));
        } else {
          setOutput(data.run.stdout || "Program exited with code 0 (no output).");
        }
      } else {
        setIsError(true);
        setOutput(data.message || "Execution engine failed instantly.");
      }
    } catch (error) {
      setIsError(true);
      setOutput(`Connectivity Issue: ${error?.response?.data?.message || error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-base-300">
      {/* Editor Section */}
      <div className="flex-1 flex flex-col border-r border-base-content/10">
        <div className="p-4 bg-base-100 flex flex-wrap items-center justify-between border-b border-base-content/10 gap-2">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-lg hidden sm:block">Code Compiler</h2>
            <div className="flex items-center gap-2">
              <select
                className="select select-bordered select-sm w-40 font-mono"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                {Object.keys(LANGUAGES).map((lang) => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
              
              <div className="flex items-center gap-1.5 px-3 py-1 bg-base-200 rounded-lg border border-base-content/5 text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                {LANGUAGES[language].local ? (
                  <>
                    <CheckCircle2 className="size-3 text-green-500" />
                    <span>Local Run</span>
                  </>
                ) : (
                  <>
                    <Info className="size-3 text-blue-500" />
                    <span>Cloud Run</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isPyodideLoading && (
                <div className="flex items-center gap-2 text-xs font-semibold text-primary animate-pulse">
                    <span className="loading loading-spinner loading-xs"></span>
                    Initializing Python...
                </div>
            )}
            <button
                onClick={runCode}
                disabled={isRunning || (language === "python" && !pyodide)}
                className="btn btn-primary btn-sm w-32 shadow-md"
            >
                {isRunning ? <span className="loading loading-spinner loading-xs"></span> : <Play className="size-4" />}
                Run Code
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language === "cpp" ? "cpp" : language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            loading={<div className="flex justify-center items-center h-full"><span className="loading loading-dots"></span></div>}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              wordWrap: "on",
              padding: { top: 16 },
              automaticLayout: true
            }}
          />
        </div>
      </div>

      {/* Output Terminal Section */}
      <div className="w-full lg:w-1/3 flex flex-col bg-[#1e1e1e] border-t lg:border-t-0 border-base-content/20 shadow-inner">
        <div className="p-3 bg-[#252526] text-gray-300 font-semibold border-b border-[#3c3c3c] text-sm uppercase tracking-wider flex items-center justify-between">
          <span>Terminal Output</span>
          {isError && <AlertCircle className="size-4 text-red-500" />}
        </div>
        <div className={`flex-1 p-4 font-mono text-sm overflow-y-auto whitespace-pre-wrap ${isError ? "text-red-400" : "text-gray-300"}`}>
          {output || ">> Ready to run code."}
        </div>
      </div>
    </div>
  );
};

export default CompilerPage;
