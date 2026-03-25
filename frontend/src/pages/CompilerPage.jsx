import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, CheckCircle2, AlertCircle } from "lucide-react";
import { executeCompilerCode } from "../lib/api";

const LANGUAGES = {
  javascript: { version: "18.15.0", code: 'console.log("Hello from JavaScript!");' },
  python: { version: "3.10.0", code: 'print("Hello from Python!")' },
  typescript: { version: "5.0.3", code: 'let message: string = "Hello TypeScript!";\nconsole.log(message);' },
  cpp: { version: "10.2.0", code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!\\n";\n    return 0;\n}' },
  c: { version: "10.2.0", code: '#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}' },
  java: { version: "15.0.2", code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}' },
  go: { version: "1.16.2", code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}' },
  rust: { version: "1.68.2", code: 'fn main() {\n    println!("Hello from Rust!");\n}' },
  php: { version: "8.2.3", code: '<?php\necho "Hello from PHP!";\n?>' },
  ruby: { version: "3.2.1", code: 'puts "Hello from Ruby!"' },
  swift: { version: "5.3.3", code: 'print("Hello from Swift!")' },
  kotlin: { version: "1.8.20", code: 'fun main() {\n    println("Hello from Kotlin!")\n}' },
  mysql: { version: "8.0", code: '-- Create a table\nCREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR(50));\n\n-- Insert data\nINSERT INTO Users VALUES (1, "Alice"), (2, "Bob");\n\n-- Query data\nSELECT * FROM Users;' },
  postgresql: { version: "13", code: '-- Create a table\nCREATE TABLE employee (id SERIAL PRIMARY KEY, name TEXT);\n\n-- Insert data\nINSERT INTO employee (name) VALUES (\'John Doe\'), (\'Jane Smith\');\n\n-- Query data\nSELECT * FROM employee;' },
  mongodb: { version: "5.0", code: '// Create and insert a document\ndb.users.insertOne({ name: "Alice", age: 30 });\n\n// Find document\ndb.users.find({ name: "Alice" });' },
  dart: { version: "2.12.0", code: 'void main() {\n  print("Hello from Dart (Flutter core)!");\n}' },
  csharp: { version: "9.0", code: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello from C#!");\n    }\n}' },
  html: { version: "5", code: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello</title>\n</head>\n<body>\n  <h1>Hello from HTML!</h1>\n</body>\n</html>' },
  css: { version: "3", code: 'body {\n  background-color: #f0f0f0;\n  color: #333;\n  font-family: sans-serif;\n}\n\nh1 {\n  color: #007bff;\n}' }
};

const CompilerPage = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGES["javascript"].code);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  
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

    // Cloud/Backend Execution 
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
                <CheckCircle2 className="size-3 text-green-500" />
                <span>Cloud Run Enabled</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
                onClick={runCode}
                disabled={isRunning}
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
