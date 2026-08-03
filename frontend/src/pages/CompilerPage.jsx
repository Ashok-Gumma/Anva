import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, CheckCircle2, AlertCircle } from "lucide-react";
import { executeCompilerCode } from "../lib/api";
import toast from "react-hot-toast";

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

const PRESETS = {
  javascript: [
    { title: "FizzBuzz", code: `// FizzBuzz Implementation in JS\nfor (let i = 1; i <= 20; i++) {\n  if (i % 3 === 0 && i % 5 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}` },
    { title: "Fibonacci Sequence", code: `// Fibonacci Sequence Generator\nfunction fibonacci(n) {\n  let sequence = [0, 1];\n  for (let i = 2; i < n; i++) {\n    sequence.push(sequence[i - 1] + sequence[i - 2]);\n  }\n  return sequence;\n}\nconsole.log(fibonacci(10));` },
    { title: "Array Reverse", code: `// Reverse Array\nconst array = [1, 2, 3, 4, 5];\nconst reversed = array.reverse();\nconsole.log("Original: [1,2,3,4,5]");\nconsole.log("Reversed:", reversed);` }
  ],
  python: [
    { title: "FizzBuzz", code: `# FizzBuzz in Python\nfor i in range(1, 21):\n    if i % 3 == 0 and i % 5 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)` },
    { title: "Fibonacci Sequence", code: `# Fibonacci Generator\ndef fibonacci(n):\n    seq = [0, 1]\n    while len(seq) < n:\n        seq.append(seq[-1] + seq[-2])\n    return seq\nprint(fibonacci(10))` },
    { title: "Palindrome Check", code: `# Check if String is Palindrome\ndef is_palindrome(s):\n    cleaned = "".join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]\n\nprint("racecar:", is_palindrome("racecar"))\nprint("hello:", is_palindrome("hello"))` }
  ],
  cpp: [
    { title: "Hello World", code: `#include <iostream>\n\nint main() {\n    std::cout << "Hello World!" << std::endl;\n    return 0;\n}` },
    { title: "Factorial", code: `#include <iostream>\n\nlong long factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    std::cout << "Factorial of 5: " << factorial(5) << std::endl;\n    return 0;\n}` }
  ],
  java: [
    { title: "Factorial Calculator", code: `public class Main {\n    public static int factorial(int n) {\n        return (n <= 1) ? 1 : n * factorial(n - 1);\n    }\n    public static void main(String[] args) {\n        System.out.println("Factorial of 5: " + factorial(5));\n    }\n}` }
  ],
  go: [
    { title: "Sum of Slice", code: `package main\n\nimport "fmt"\n\nfunc main() {\n    nums := []int{1, 2, 3, 4, 5}\n    sum := 0\n    for _, num := range nums {\n        sum += num\n    }\n    fmt.Println("Sum of elements:", sum)\n}` }
  ]
};

const CompilerPage = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGES["javascript"].code);
  const [output, setOutput] = useState("");
  const [stdin, setStdin] = useState("");
  const [activeTab, setActiveTab] = useState("run");
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

    try {
      const data = await executeCompilerCode({
        language: language,
        version: LANGUAGES[language].version,
        files: [{ content: code }],
        stdin: stdin
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
    <div className="ide-split-container p-4">
      {/* Editor Section */}
      <div className="lg:col-span-7 ide-panel rounded-2xl">
        <div className="ide-panel-header">
          <div className="flex items-center gap-3">
            <span className="font-extrabold tracking-wider text-sm hidden sm:block">Editor</span>
            <select
              className="select select-bordered select-xs w-28 sm:w-36 font-mono font-bold text-[11px] sm:text-xs"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {Object.keys(LANGUAGES).map((lang) => (
                <option key={lang} value={lang}>{lang.toUpperCase()}</option>
              ))}
            </select>
            {PRESETS[language] && (
              <select
                className="select select-bordered select-xs w-32 sm:w-44 font-mono font-bold text-[10px] bg-primary/10 border-primary/20 text-primary"
                onChange={(e) => {
                  const selectedPreset = PRESETS[language].find(p => p.title === e.target.value);
                  if (selectedPreset) {
                    setCode(selectedPreset.code);
                    toast.success(`Loaded preset: ${selectedPreset.title}`);
                  }
                  e.target.value = "";
                }}
                defaultValue=""
              >
                <option value="" disabled>📐 ALGORITHMS</option>
                {PRESETS[language].map((preset) => (
                  <option key={preset.title} value={preset.title}>{preset.title}</option>
                ))}
              </select>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCode(LANGUAGES[language].code);
                toast.success("Code reset to default template.");
              }}
              className="btn btn-ghost btn-xs text-xs font-bold"
            >
              Reset
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast.success("Code copied to clipboard!");
              }}
              className="btn btn-ghost btn-xs text-xs font-bold"
            >
              Copy
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden relative min-h-[300px]">
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

      {/* Input / Output Section */}
      <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden">
        {/* Input Pane */}
        <div className="flex-1 ide-panel rounded-2xl min-h-[220px]">
          <div className="ide-panel-header p-0 flex items-stretch">
            <div className="flex">
              <button
                className={`px-5 text-[10px] font-extrabold uppercase tracking-widest border-r border-base-content/10 flex items-center justify-center transition-colors ${
                  activeTab === 'run'
                    ? 'bg-base-100 text-primary border-b-2 border-b-primary'
                    : 'text-base-content/50 hover:text-base-content hover:bg-base-content/5'
                }`}
                onClick={() => setActiveTab('run')}
              >
                Run / Stdin
              </button>
              <button
                className={`px-5 text-[10px] font-extrabold uppercase tracking-widest border-r border-base-content/10 flex items-center justify-center transition-colors ${
                  activeTab === 'visualize'
                    ? 'bg-base-100 text-primary border-b-2 border-b-primary'
                    : 'text-base-content/50 hover:text-base-content hover:bg-base-content/5'
                }`}
                onClick={() => setActiveTab('visualize')}
              >
                Visualize Code
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-end px-3">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="btn btn-primary btn-xs font-extrabold uppercase tracking-wider px-3"
              >
                {isRunning ? (
                  <span className="loading loading-spinner size-3"></span>
                ) : (
                  <Play className="size-3 mr-1" />
                )}
                Run Code
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col bg-base-100/40 overflow-hidden">
            {activeTab === 'run' ? (
              <div className="flex-1 flex flex-col gap-2 overflow-hidden h-full">
                <span className="text-[10px] font-black uppercase text-base-content/50 tracking-widest">Enter Input here</span>
                <textarea
                  className="textarea textarea-bordered font-mono text-sm w-full flex-1 bg-base-200/50 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none"
                  placeholder="Provide program inputs here (one per line)..."
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                />
                <span className="text-[9px] font-bold text-base-content/40 uppercase tracking-tighter">
                  If your code takes input, add it in the above box before running.
                </span>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-base-content/60">
                <span className="text-xs font-bold uppercase tracking-wider mb-2">Code Visualizer Mode</span>
                <p className="text-[11px] max-w-xs font-medium leading-relaxed">
                  Trace state changes, memory variables, and logic blocks as your code runs line-by-line.
                </p>
                <div className="mt-3 badge badge-primary badge-outline font-bold uppercase tracking-widest text-[8px] py-1 px-2">Coming Soon</div>
              </div>
            )}
          </div>
        </div>

        {/* Terminal/Output Pane */}
        <div className="flex-1 ide-panel rounded-2xl min-h-[220px]">
          <div className="ide-panel-header flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-base-content flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Terminal Output
            </span>
            {isError ? (
              <span className="badge badge-error gap-1 text-[9px] font-black uppercase py-1 px-2">
                <AlertCircle className="size-3" /> Runtime Error
              </span>
            ) : output && !isRunning ? (
              <span className="badge badge-success gap-1 text-[9px] font-black uppercase py-1 px-2">
                <CheckCircle2 className="size-3" /> Execution Complete
              </span>
            ) : null}
          </div>
          <div className="flex-1 p-4 bg-[#0d1117] text-emerald-400 font-mono text-xs overflow-y-auto whitespace-pre-wrap select-text leading-relaxed border-t border-base-content/10 shadow-inner">
            {output || ">> Ready to execute code."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompilerPage;
