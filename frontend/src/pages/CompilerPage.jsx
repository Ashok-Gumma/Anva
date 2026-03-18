import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play } from "lucide-react";
import { executeCompilerCode } from "../lib/api";

// Using Piston v2 API format defaults
const LANGUAGES = {
  javascript: { version: "18.15.0", code: 'console.log("Hello Output!");' },
  python: { version: "3.10.0", code: 'print("Hello Output!")' },
  cpp: { version: "10.2.0", code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello Output!\\n";\n    return 0;\n}' },
  java: { version: "15.0.2", code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Output!");\n    }\n}' },
  go: { version: "1.16.2", code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello Output!")\n}' }
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
    setOutput("Running Engine...\n");

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
      setOutput(`An error occurred connecting to local execution proxy: ${error?.response?.data?.message || error.message}`);
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
            <select
              className="select select-bordered select-sm w-40 font-mono"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {Object.keys(LANGUAGES).map((lang) => (
                <option key={lang} value={lang}>{lang.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="btn btn-primary btn-sm w-24 shadow-md"
          >
            {isRunning ? <span className="loading loading-spinner loading-xs"></span> : <Play className="size-4" />}
            Run 
          </button>
        </div>
        
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            loading={<div className="flex justify-center items-center h-full"><span className="loading loading-dots"></span></div>}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              wordWrap: "on",
              padding: { top: 16 }
            }}
          />
        </div>
      </div>

      {/* Output Terminal Section */}
      <div className="w-full lg:w-1/3 flex flex-col bg-[#1e1e1e] border-t lg:border-t-0 border-base-content/20 shadow-inner">
        <div className="p-3 bg-[#252526] text-gray-300 font-semibold border-b border-[#3c3c3c] text-sm uppercase tracking-wider flex items-center justify-between">
          <span>Terminal Output</span>
        </div>
        <div className={`flex-1 p-4 font-mono text-sm overflow-y-auto whitespace-pre-wrap ${isError ? "text-red-400" : "text-gray-300"}`}>
          {output || ">> Ready to run code."}
        </div>
      </div>
    </div>
  );
};

export default CompilerPage;
