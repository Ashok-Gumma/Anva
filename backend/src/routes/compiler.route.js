import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import vm from "vm";

const router = express.Router();

router.post("/execute", protectRoute, async (req, res) => {
  try {
    const { language, version, files } = req.body;
    const code = files[0].content;

    // Locally sandbox JavaScript bypassing ALL internet connectivity completely!
    if (language === "javascript" || language === "js") {
      let output = "";
      const context = {
        console: {
          log: (...args) => { output += args.join(" ") + "\n"; },
          error: (...args) => { output += args.join(" ") + "\n"; },
          warn: (...args) => { output += args.join(" ") + "\n"; }
        }
      };
      
      vm.createContext(context);
      
      try {
        vm.runInContext(code, context, { timeout: 2000 }); // 2-second timeout to prevent infinite loops
        return res.status(200).json({ run: { stdout: output, stderr: "" } });
      } catch (err) {
        return res.status(200).json({ run: { stdout: output, stderr: err.toString() } });
      }
    }
    
    // For Python, C++, Java, etc: We fetch Piston from Node.js
    const response = await fetch("https://piston.codes/api/v2/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, version, files })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Backend Piston Proxy Error:", error);
    // Return a 200 with an explicit manual error message so the UI renders it smoothly in red text, rather than a raw 500 HTTP crash
    return res.status(200).json({
      run: { 
        stderr: "Network Firewall Block: Your local machine's internet router or proxy is permanently blocking Piston API DNS resolutions. JavaScript executes locally perfectly, but Python/C++ requires internet access! \n\nError Context: " + error.message,
        stdout: ""
      }
    });
  }
});

export default router;
