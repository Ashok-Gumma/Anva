import { useState, useRef } from "react";
import { Play, Copy, X, Loader } from "lucide-react";
import toast from "react-hot-toast";

const CompilerPage = () => {
  const [code, setCode] = useState(`// Welcome to ANVA Code Compiler
// Write your code here

// Example: JavaScript
console.log("Hello, World!");

function add(a, b) {
  return a + b;
}

console.log(add(5, 3));
`);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const outputRef = useRef(null);

  const languages = [
    { id: "javascript", name: "JavaScript", ext: "js" },
    { id: "python", name: "Python", ext: "py" },
    { id: "html", name: "HTML/CSS/JS", ext: "html" },
  ];

  const runCode = async () => {
    if (!code.trim()) {
      toast.error("Code cannot be empty");
      return;
    }

    setIsRunning(true);
    setOutput("");

    try {
      if (selectedLanguage === "javascript") {
        runJavaScript();
      } else if (selectedLanguage === "python") {
        await runPython();
      } else if (selectedLanguage === "html") {
        runHTML();
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runJavaScript = () => {
    const originalLog = console.log;
    const outputs = [];

    console.log = (...args) => {
      outputs.push(args.map((arg) => JSON.stringify(arg)).join(" "));
      originalLog(...args);
    };

    try {
      eval(code);
      console.log = originalLog;

      if (outputs.length === 0) {
        setOutput("✅ Code executed successfully (no output)");
      } else {
        setOutput(outputs.join("\n"));
      }
    } catch (err) {
      console.log = originalLog;
      setOutput(`❌ Error: ${err.message}`);
    }
  };

  const runPython = async () => {
    setOutput("⚠️ Python execution requires backend support. Coming soon!");
  };

  const runHTML = () => {
    try {
      const newWindow = window.open("", "_blank");
      newWindow.document.write(code);
      newWindow.document.close();
      setOutput("✅ HTML opened in new window");
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const clearCode = () => {
    setCode("");
    setOutput("");
    toast.success("Code cleared!");
  };

  const resetCode = () => {
    setCode(`// Welcome to ANVA Code Compiler
// Write your code here

// Example: JavaScript
console.log("Hello, World!");

function add(a, b) {
  return a + b;
}

console.log(add(5, 3));
`);
    setOutput("");
    toast.success("Code reset to default!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="container mx-auto flex-1 flex flex-col gap-4 max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Code Compiler</h1>
            <p className="text-sm opacity-70 mt-1">
              Write, compile and execute code
            </p>
          </div>

          {/* LANGUAGE SELECTOR */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="select select-bordered w-full sm:w-40"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* EDITOR + OUTPUT */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">

          {/* EDITOR */}
          <div className="card bg-base-200 shadow-lg flex flex-col h-full overflow-hidden">
            <div className="card-body p-0 flex flex-col h-full">

              <div className="p-4 border-b border-base-300 flex justify-between items-center">
                <h2 className="font-bold">Editor</h2>
                <div className="flex gap-2">
                  <button onClick={copyCode} className="btn btn-ghost btn-xs">
                    <Copy className="size-4" />
                  </button>
                  <button onClick={clearCode} className="btn btn-ghost btn-xs">
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-4 font-mono text-sm bg-base-100 resize-none focus:outline-none"
                spellCheck="false"
              />

              <div className="p-4 border-t border-base-300">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="btn btn-primary w-full"
                >
                  {isRunning ? (
                    <>
                      <Loader className="animate-spin size-5 mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="size-5 mr-2" />
                      Run Code
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* OUTPUT */}
          <div className="card bg-base-200 shadow-lg flex flex-col h-full overflow-hidden">
            <div className="card-body p-0 flex flex-col h-full">

              <div className="p-4 border-b border-base-300 flex justify-between items-center">
                <h2 className="font-bold">Output</h2>
                <button onClick={() => setOutput("")} className="btn btn-ghost btn-xs">
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 p-4 font-mono text-sm bg-base-100 overflow-auto whitespace-pre-wrap">
                {output || (
                  <span className="opacity-50">Output will appear here...</span>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="card bg-base-300 p-3 text-xs opacity-70">
          <p>
            <strong>Tip:</strong>
            {selectedLanguage === "javascript" &&
              " JavaScript runs in browser. Use console.log()."}
            {selectedLanguage === "python" &&
              " Python needs backend (not implemented)."}
            {selectedLanguage === "html" &&
              " HTML opens in new tab."}
          </p>
        </div>

      </div>
    </div>
  );
};

export default CompilerPage;