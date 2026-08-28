/**
 * 2026 Latest Hiring Process & Assessment Questions Dataset
 * Features authentic questions for:
 * 1. Capgemini (AI Literacy, Debugging Assessment, AI-Assisted Coding, Cognitive Assessment, English Communication)
 * 2. Accenture (Cognitive & Technical, MS Office/Cloud, Pseudocode, Coding)
 * 3. TCS (TCS NQT Foundation, Advanced Quantitative, Prime/Digital Coding)
 * 4. Infosys (Pseudocode, Mathematical Ability, SP/DSE Coding)
 * 5. Cognizant (GenC/Elevate/Next, SQL, DSA, Core CS)
 * 6. Wipro & LTI Mindtree (Automata Fix / Debugging, Aptitude, Core Technical)
 */

export const PLACEMENT_2026_QUESTIONS = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. CAPGEMINI & MNC ENGLISH COMMUNICATION & VERSANT MODULE (STAGE 1)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "English Communication - Professional Email Tone & Grammar",
    category: "english",
    type: "mcq",
    difficulty: "Easy",
    companies: ["capgemini", "accenture", "cognizant", "tcs", "wipro"],
    topics: ["English Communication", "Business Communication", "Grammar"],
    frequency: "High",
    source: "Capgemini English Communication Module & Versant Pattern",
    tags: ["English Comm", "Communication", "Grammar", "2026"],
    lastReviewed: "2026",
    description: "Choose the most grammatically correct and professional sentence to decline a client's unrealistic deadline request in a software delivery email:",
    options: [
      "We can't do this work so fast because you didn't give us enough time.",
      "While we appreciate the urgency of the milestone, delivering a thoroughly tested release by Friday will compromise code quality; we propose delivering the core modules by Monday.",
      "It is totally impossible to finish by Friday so don't expect anything.",
      "We are refusing your deadline since my team is already too busy."
    ],
    correctAnswer: 1,
    explanation: "Professional business communication requires diplomacy, solution-oriented alternatives, and clear justification rather than blunt refusal or assigning blame.",
  },
  {
    title: "English Communication - Sentence Reconstruction & Active Listening",
    category: "english",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "accenture", "cognizant", "tcs"],
    topics: ["English Communication", "Sentence Correction", "Verbal Ability"],
    frequency: "High",
    source: "Capgemini English Communication & Versant Spoken Test",
    tags: ["English Comm", "Versant", "Sentence Correction", "2026"],
    lastReviewed: "2026",
    description: "Identify the sentence that has NO grammatical or subject-verb agreement error:",
    options: [
      "Neither the software architect nor the backend developers was able to reproduce the concurrency bug.",
      "Neither the software architect nor the backend developers were able to reproduce the concurrency bug.",
      "Each of the sprint tasks have been completed ahead of schedule.",
      "The team of QA engineers are reviewing the release notes right now."
    ],
    correctAnswer: 1,
    explanation: "In 'Neither... nor' constructions, the verb agrees with the closer subject. Since 'backend developers' is plural, the plural verb 'were' is correct.",
  },
  {
    title: "English Communication - Contextual Vocabulary & Collocation",
    category: "english",
    type: "mcq",
    difficulty: "Easy",
    companies: ["capgemini", "infosys", "accenture", "wipro"],
    topics: ["English Communication", "Vocabulary", "Verbal Ability"],
    frequency: "High",
    source: "Capgemini English Communication Module",
    tags: ["English Comm", "Vocabulary", "2026"],
    lastReviewed: "2026",
    description: "Select the word that best completes the sentence:\n\n'The development team decided to ________ the deployment until all critical security vulnerabilities were patched.'",
    options: ["accelerate", "defer", "expedite", "manifest"],
    correctAnswer: 1,
    explanation: "'Defer' means to postpone or delay an action until a later date. Given security issues, deferring deployment is the contextually precise choice.",
  },
  {
    title: "English Communication - Spoken Dialogue & Active Listening Nuance",
    category: "english",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "accenture", "cognizant"],
    topics: ["English Communication", "Active Listening", "Situational"],
    frequency: "High",
    source: "Capgemini English Assessment (Listening & Response)",
    tags: ["English Comm", "Listening", "2026"],
    lastReviewed: "2026",
    description: "In a client standup, the client states: 'We love the UI revamp, but our field agents primarily operate in low-bandwidth rural regions.'\n\nWhat is the most attentive and constructive response?",
    options: [
      "You should tell your field agents to upgrade to faster 5G networks.",
      "Thank you for highlighting this. We will optimize asset bundles, implement offline local caching, and evaluate lightweight data payload schemas.",
      "The UI cannot be changed anymore since the design phase is completed.",
      "Bandwidth is a network provider problem, not a frontend code problem."
    ],
    correctAnswer: 1,
    explanation: "Active listening involves acknowledging the client's constraint and proposing specific, feasible technical solutions (e.g. offline caching, payload compression).",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. CAPGEMINI & MNC AI LITERACY & SITUATIONAL TECHNICAL MODULE (STAGE 2)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "AI Literacy - Temperature Parameter in Large Language Models",
    category: "technical",
    type: "mcq",
    difficulty: "Easy",
    companies: ["capgemini", "accenture", "cognizant", "tcs", "infosys", "ibm"],
    topics: ["AI Literacy", "Generative AI", "Prompt Engineering"],
    frequency: "High",
    source: "Capgemini Technical Module (AI Literacy)",
    tags: ["AI Literacy", "GenAI", "LLM", "2026"],
    lastReviewed: "2026",
    description: "In Generative AI and Large Language Model (LLM) APIs, what is the effect of setting the `temperature` parameter close to 0 (e.g., `temperature = 0.1`)?",
    options: [
      "The model generates maximum creativity, humor, and diverse responses.",
      "The model becomes highly deterministic, focused, and selects the highest-probability tokens for predictable and consistent outputs.",
      "The model increases the processing speed by dropping half the training weights.",
      "The model skips tokenization and processes raw ASCII characters directly."
    ],
    correctAnswer: 1,
    explanation: "Temperature controls randomness in token selection: Lower temperature (near 0) makes the model greedy/deterministic, ideal for factual answers, math, code generation, and structured JSON. Higher temperature (>0.7) flattens the probability distribution for creative writing.",
  },
  {
    title: "AI Literacy - Understanding Hallucinations in LLMs",
    category: "technical",
    type: "mcq",
    difficulty: "Easy",
    companies: ["capgemini", "accenture", "ibm", "infosys", "wipro"],
    topics: ["AI Literacy", "Generative AI", "LLM Evaluation"],
    frequency: "High",
    source: "Capgemini Technical Module (AI Literacy)",
    tags: ["AI Literacy", "Hallucinations", "GenAI", "2026"],
    lastReviewed: "2026",
    description: "What does the term 'Hallucination' specifically refer to in the context of Large Language Models?",
    options: [
      "A hardware graphics card malfunction while rendering AI avatar animations.",
      "When an LLM generates factually inaccurate, ungrounded, or fabricated information while presenting it with high grammatical confidence.",
      "When the user inputs a prompt that exceeds the maximum GPU memory limit.",
      "When a recursive prompt causes an infinite CPU execution loop."
    ],
    correctAnswer: 1,
    explanation: "Hallucination in LLMs occurs when the model produces believable, grammatically fluent text that has no basis in factual reality or the provided context. Mitigation techniques include RAG (Retrieval-Augmented Generation), grounding, and low temperature.",
  },
  {
    title: "AI Literacy - Retrieval-Augmented Generation (RAG) Architecture",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "accenture", "cognizant", "ibm", "google"],
    topics: ["AI Literacy", "Generative AI", "RAG", "System Design"],
    frequency: "High",
    source: "Capgemini Technical Module & Product AI Screening",
    tags: ["AI Literacy", "RAG", "Vector Search", "2026"],
    lastReviewed: "2026",
    description: "In a Retrieval-Augmented Generation (RAG) system, what is the primary role of the Vector Database?",
    options: [
      "To fine-tune the LLM weights on new datasets in real-time.",
      "To store high-dimensional embeddings of documents and retrieve semantically relevant context chunks via cosine similarity to augment the prompt.",
      "To compile Python and C++ code into machine assembly before execution.",
      "To serve static HTML and CSS assets to the frontend client."
    ],
    correctAnswer: 1,
    explanation: "In RAG, external knowledge is converted to embedding vectors. When a user queries the system, semantic search (cosine similarity / k-NN) in the vector database retrieves the most relevant chunks, which are injected into the prompt as grounding context.",
  },
  {
    title: "AI Literacy - Zero-Shot vs Few-Shot Prompting",
    category: "technical",
    type: "mcq",
    difficulty: "Easy",
    companies: ["capgemini", "accenture", "infosys", "tcs"],
    topics: ["AI Literacy", "Prompt Engineering"],
    frequency: "High",
    source: "Capgemini Technical Module & Accenture GenAI Fundamentals",
    tags: ["AI Literacy", "Prompt Engineering", "2026"],
    lastReviewed: "2026",
    description: "What distinguishes 'Few-Shot Prompting' from 'Zero-Shot Prompting'?",
    options: [
      "Few-shot prompting provides 1 or more concrete input-output demonstration examples within the prompt to guide the model's pattern recognition.",
      "Few-shot prompting limits the LLM response to fewer than 5 words.",
      "Few-shot prompting charges fewer API tokens per request.",
      "Few-shot prompting can only be executed once every 24 hours."
    ],
    correctAnswer: 0,
    explanation: "Zero-shot prompting asks the model to perform a task directly without examples. Few-shot prompting provides exemplary input-output pairs inside the prompt, significantly boosting accuracy on classification, code formatting, and translation.",
  },
  {
    title: "AI Literacy - Context Window & Token Limitations",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "accenture", "cognizant", "google"],
    topics: ["AI Literacy", "Generative AI", "Tokens"],
    frequency: "High",
    source: "Capgemini Technical Module",
    tags: ["AI Literacy", "LLM", "2026"],
    lastReviewed: "2026",
    description: "What happens when the combined length of a system prompt, chat history, and retrieval documents exceeds the LLM's specified Context Window limit?",
    options: [
      "The LLM server crashes and restarts automatically.",
      "The oldest or trailing tokens are truncated, causing loss of critical instructions or context, or the API rejects the request with a context length error.",
      "The model automatically increases its parameter size to fit the input.",
      "The output is encrypted with AES-256 for privacy."
    ],
    correctAnswer: 1,
    explanation: "The Context Window is the maximum sequence length (input + output tokens) an attention mechanism can process. Exceeding it results in token truncation (lost context) or API validation failure.",
  },
  {
    title: "AI Literacy - Situational Problem Solving: AI Code Verification",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "accenture", "tcs", "cognizant"],
    topics: ["AI Literacy", "Situational Problem Solving", "AI-assisted Coding"],
    frequency: "High",
    source: "Capgemini AI-Assisted Coding Assessment Guidelines",
    tags: ["AI Literacy", "Situational", "Code Verification", "2026"],
    lastReviewed: "2026",
    description: "When using an AI coding assistant in an assessment or production setting, what is the MOST effective approach before submitting the generated code?",
    options: [
      "Immediately copy and submit the generated code if it passes the first basic sample test case.",
      "Verify time/space complexity against problem constraints, inspect edge cases (null inputs, empty arrays, integer overflows, boundary limits), and trace the logic manually.",
      "Ask the AI assistant 'is this code 100% correct?' and rely solely on its confirmation.",
      "Convert the code to another programming language 3 times to remove bugs."
    ],
    correctAnswer: 1,
    explanation: "AI coding assistants frequently produce solutions that pass naive happy-path tests but fail on edge cases (e.g., $N=0$, large $10^9$ constraints causing TLE, negative numbers, precision loss). Rigorous human verification of constraints and edge cases is essential.",
  },
  {
    title: "AI Literacy - Prompt Injection & Security Guardrails",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "accenture", "ibm", "google"],
    topics: ["AI Literacy", "Prompt Engineering", "AI Security"],
    frequency: "High",
    source: "Capgemini Technical Module & AI Security Guidelines",
    tags: ["AI Literacy", "Security", "GenAI", "2026"],
    lastReviewed: "2026",
    description: "What is a 'Prompt Injection' vulnerability in an LLM application?",
    options: [
      "When a user enters malicious text designed to override system instructions and force the LLM to execute unauthorized actions or leak sensitive context.",
      "Injecting physical RAM cards into the AI inference server.",
      "Adding SQL database indexes to accelerate prompt processing.",
      "Translating a prompt into multiple natural languages simultaneously."
    ],
    correctAnswer: 0,
    explanation: "Prompt Injection occurs when untrusted user input manipulates the LLM's instruction hierarchy, bypassing system constraints to exfiltrate private data or perform forbidden operations.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. CAPGEMINI & MNC CODE DEBUGGING ASSESSMENT (STAGE 3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Code Debugging - Python Integer Division Loop Bug",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "accenture", "wipro", "tcs", "infosys"],
    topics: ["Debugging Assessment", "Code Correction", "Python"],
    frequency: "High",
    source: "Capgemini Debugging Round & Wipro Automata Fix",
    tags: ["Debugging", "Python", "Code Fix", "2026"],
    lastReviewed: "2026",
    description: "Look at the following Python code intended to count the number of digits in a positive integer:\n\n```python\ndef count_digits(n):\n    count = 0\n    while n > 0:\n        count += 1\n        n = n / 10   # Line 5\n    return count\n```\nWhy does this function cause an infinite loop in Python 3 for input `n = 123`?",
    options: [
      "`count` variable is not initialized globally.",
      "In Python 3, `/` performs float division so `n` becomes `0.123... > 0` and never reaches integer `0`.",
      "Python does not support `+=` operator inside while loops.",
      "The while condition should be `while n >= 0`."
    ],
    correctAnswer: 1,
    explanation: "In Python 3, `/` is true float division (e.g. `1 / 10 = 0.1`), so `n` will asymptotically approach zero as a float (e.g. `1e-323 > 0`) without terminating. The fix is integer floor division `n = n // 10`.",
  },
  {
    title: "Code Debugging - C/C++ Array Off-By-One & Buffer Overflow",
    category: "technical",
    type: "mcq",
    difficulty: "Easy",
    companies: ["capgemini", "accenture", "wipro", "tcs", "cognizant"],
    topics: ["Debugging Assessment", "Code Correction", "C++"],
    frequency: "High",
    source: "Capgemini Debugging Assessment & TCS Technical",
    tags: ["Debugging", "C++", "Off-by-one", "2026"],
    lastReviewed: "2026",
    description: "Identify the bug in the following C++ function designed to find the maximum element in an array of size `n`:\n\n```cpp\nint findMax(int arr[], int n) {\n    int maxVal = arr[0];\n    for (int i = 1; i <= n; i++) {   // Loop condition\n        if (arr[i] > maxVal)\n            maxVal = arr[i];\n    }\n    return maxVal;\n}\n```",
    options: [
      "`maxVal` should be initialized to `0` instead of `arr[0]`.",
      "The loop condition `i <= n` accesses `arr[n]`, which is an out-of-bounds index (off-by-one error) causing undefined behavior.",
      "The comparison operator should be `<` instead of `>`.",
      "Array parameters must always be passed as `const vector<int>&` in C++."
    ],
    correctAnswer: 1,
    explanation: "Arrays of size `n` have valid indices `0` through `n - 1`. The loop runs up to `i = n`, reading past the allocated memory (`arr[n]`), leading to buffer over-read or undefined behavior. The correct loop condition is `i < n`.",
  },
  {
    title: "Code Debugging - Java NullPointerException & String Comparison",
    category: "technical",
    type: "mcq",
    difficulty: "Easy",
    companies: ["capgemini", "infosys", "cognizant", "accenture", "wipro"],
    topics: ["Debugging Assessment", "Code Correction", "Java"],
    frequency: "High",
    source: "Capgemini Debugging Round & Infosys Pseudocode",
    tags: ["Debugging", "Java", "Strings", "2026"],
    lastReviewed: "2026",
    description: "In Java, what is the bug in the following authentication validator method?\n\n```java\npublic boolean checkAdmin(String role) {\n    if (role.equals(\"ADMIN\")) {\n        return true;\n    }\n    return false;\n}\n```\nWhat happens if `null` is passed as the argument for `role`?",
    options: [
      "It returns `false` safely without any errors.",
      "It throws a runtime `NullPointerException` because calling `.equals()` on a null reference crashes the JVM.",
      "It automatically converts null to empty string `\"\"`.",
      "It causes a compilation error at `return true;`."
    ],
    correctAnswer: 1,
    explanation: "Calling any instance method on a null reference throws `NullPointerException`. The defensive, null-safe best practice is `\"ADMIN\".equals(role)` (literal on left) or `Objects.equals(role, \"ADMIN\")`.",
  },
  {
    title: "Code Debugging - Missing Base Case in Recursive Fibonacci",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "tcs", "infosys", "accenture"],
    topics: ["Debugging Assessment", "Code Correction", "Recursion"],
    frequency: "High",
    source: "Capgemini Debugging & TCS NQT Advanced",
    tags: ["Debugging", "Recursion", "Stack Overflow", "2026"],
    lastReviewed: "2026",
    description: "Look at the following recursive function intended to compute the $n$-th Fibonacci number:\n\n```python\ndef fib(n):\n    if n == 1:\n        return 1\n    return fib(n - 1) + fib(n - 2)\n```\nWhat critical bug occurs when calling `fib(0)` or `fib(2)`?",
    options: [
      "`fib(0)` correctly returns 0.",
      "Missing base case for `n <= 0` or `n == 0` causes infinite recursion and a `RecursionError` / Stack Overflow.",
      "The addition operator is not allowed between recursive function calls.",
      "The function returns a float instead of integer."
    ],
    correctAnswer: 1,
    explanation: "For `fib(2)`, it evaluates `fib(1) + fib(0)`. Because there is no base case for `0` (or `<= 0`), `fib(0)` calls `fib(-1)`, `fib(-2)` infinitely, exhausting the call stack and throwing `RecursionError: maximum recursion depth exceeded`.",
  },
  {
    title: "Code Debugging - Binary Search Midpoint Integer Overflow",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "google", "amazon", "microsoft", "adobe"],
    topics: ["Debugging Assessment", "Code Correction", "Binary Search"],
    frequency: "High",
    source: "Capgemini Debugging & FAANG Standard Bug Pattern",
    tags: ["Debugging", "Binary Search", "Overflow", "2026"],
    lastReviewed: "2026",
    description: "In C/C++ and Java, what is the subtle bug in calculating the midpoint of a binary search using `int mid = (low + high) / 2;` for arrays with large indices?",
    options: [
      "`(low + high)` can exceed $2^{31} - 1$ (signed 32-bit integer maximum), resulting in integer overflow to a negative number and out-of-bounds access.",
      "Division by 2 always rounds up, missing the first element.",
      "Bitwise shifts cannot be performed on signed integers.",
      "`mid` is calculated as a floating point value in Java."
    ],
    correctAnswer: 0,
    explanation: "When `low + high > 2,147,483,647`, the 32-bit signed integer wraps around into negative territory (`-2,147,483,648`), causing `arr[mid]` to crash with negative index bounds. The bug-free formulation is `int mid = low + (high - low) / 2;` or `(low + high) >>> 1`.",
  },
  {
    title: "Code Debugging - Python Mutable Default Argument Pitfall",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "accenture", "wipro", "tcs"],
    topics: ["Debugging Assessment", "Code Correction", "Python"],
    frequency: "High",
    source: "Capgemini Debugging Round & Python Assessment",
    tags: ["Debugging", "Python", "Mutable Defaults", "2026"],
    lastReviewed: "2026",
    description: "Look at the following Python function designed to append an item to a list:\n\n```python\ndef add_item(item, item_list=[]):\n    item_list.append(item)\n    return item_list\n\nprint(add_item(\"A\"))\nprint(add_item(\"B\"))\n```\nWhat is the unexpected output and why?",
    options: [
      "`['A']` then `['B']` because each call creates a new list.",
      "`['A']` then `['A', 'B']` because Python default argument expressions are evaluated once when the function is defined, sharing the same list across invocations.",
      "`TypeError: cannot append string to empty list`.",
      "`None` because list `.append()` does not return a value."
    ],
    correctAnswer: 1,
    explanation: "In Python, default arguments are evaluated only once at function definition time. Using a mutable object (`[]` or `{}`) as default means all subsequent calls without that argument mutate the shared object. Fix: `def add_item(item, item_list=None): if item_list is None: item_list = []`.",
  },
  {
    title: "Code Debugging - JavaScript Loop Closure with 'var'",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "cognizant", "infosys", "accenture"],
    topics: ["Debugging Assessment", "Code Correction", "JavaScript"],
    frequency: "High",
    source: "Capgemini Technical & Full-Stack Screening",
    tags: ["Debugging", "JavaScript", "Closures", "2026"],
    lastReviewed: "2026",
    description: "What will be printed to the console by the following JavaScript snippet?\n\n```javascript\nfor (var i = 0; i < 3; i++) {\n    setTimeout(function() {\n        console.log(i);\n    }, 100);\n}\n```",
    options: [
      "`0, 1, 2`",
      "`3, 3, 3` because `var` is function-scoped (not block-scoped), so all timer callbacks reference the final mutated value of `i`.",
      "`undefined, undefined, undefined`",
      "`0, 0, 0`"
    ],
    correctAnswer: 1,
    explanation: "`var` declarations are hoisted and function-scoped. By the time the asynchronous `setTimeout` callbacks execute (after 100ms), the loop has finished and `i` equals 3. Replacing `var` with block-scoped `let i = 0` binds a distinct `i` to each iteration, printing `0, 1, 2`.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CAPGEMINI & MNC COGNITIVE & GAME-BASED REASONING (STAGE 5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Cognitive Assessment - Motion & Pathway Optimization",
    category: "aptitude",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "ibm", "accenture"],
    topics: ["Cognitive Assessment", "Motion Challenge", "Game-Based Reasoning"],
    frequency: "High",
    source: "Capgemini Cognitive Assessment (Motion Challenge)",
    tags: ["Cognitive", "Motion Challenge", "Game Logic", "2026"],
    lastReviewed: "2026",
    description: "In a grid-based spatial motion challenge, a ball moves in straight lines and only stops when it hits a boundary wall or obstacle. On a 5x5 grid from start `(0,0)` to target `(4,4)` with obstacles at `(0,2)`, `(2,4)`, and `(3,1)`, what strategy determines the minimum moves to reach the goal?",
    options: [
      "Always roll randomly until the target cell is entered.",
      "Model the state transitions as a Breadth-First Search (BFS) graph where each edge represents rolling until an obstacle/wall is hit, finding the shortest path.",
      "Calculate the geometric Euclidean straight-line distance and ignore the obstacles.",
      "Move diagonally across the boundary corners."
    ],
    correctAnswer: 1,
    explanation: "In motion challenges, continuous rolling is modeled as a state graph where each direction (Up, Down, Left, Right) transitions from position $(r, c)$ to the obstacle boundary $(r', c')$. Running BFS guarantees finding the minimum number of directional moves.",
  },
  {
    title: "Cognitive Assessment - Working Memory & Grid Challenge Sequences",
    category: "aptitude",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "ibm", "accenture"],
    topics: ["Cognitive Assessment", "Grid Challenge", "Working Memory"],
    frequency: "High",
    source: "Capgemini Cognitive Assessment (Grid Challenge)",
    tags: ["Cognitive", "Grid Challenge", "Working Memory", "2026"],
    lastReviewed: "2026",
    description: "In the Grid Challenge, you are shown a 3x3 grid where dots flash sequentially, interleaved with symmetry-checking visual tasks. What is the cognitive skill being evaluated?",
    options: [
      "Vocabulary and English typing speed.",
      "Visuo-spatial working memory capacity and dual-task cognitive processing under time pressure.",
      "SQL database query optimization skills.",
      "Hardware circuit soldering ability."
    ],
    correctAnswer: 1,
    explanation: "The Grid Challenge tests working memory span and multi-task executive function by evaluating how accurately you can retain spatial coordinate sequences while performing cognitive distractor tasks (e.g. vertical/horizontal symmetry verification).",
  },
  {
    title: "Cognitive Assessment - Inductive Logic & Matrix Pattern Rules",
    category: "aptitude",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "accenture", "ibm"],
    topics: ["Cognitive Assessment", "Inductive Logic", "Game-Based Reasoning"],
    frequency: "High",
    source: "Capgemini Cognitive Assessment (Deductive/Inductive)",
    tags: ["Cognitive", "Inductive Logic", "2026"],
    lastReviewed: "2026",
    description: "In a 3x3 symbol matrix, each row transitions by rotating the outer arrow 90° clockwise and toggling the central dot between shaded and unshaded. If Row 3 has a shaded dot with an arrow pointing North in Cell 1, and an unshaded dot with an arrow pointing East in Cell 2, what MUST Cell 3 contain?",
    options: [
      "A shaded dot with an arrow pointing South.",
      "An unshaded dot with an arrow pointing West.",
      "A shaded dot with an arrow pointing North.",
      "An unshaded dot with an arrow pointing South."
    ],
    correctAnswer: 0,
    explanation: "Applying the row rule: 1) Arrow rotates 90° clockwise: North -> East -> South. 2) Central dot toggles: Shaded -> Unshaded -> Shaded. Hence Cell 3 has a shaded dot with an arrow pointing South.",
  },
  {
    title: "Cognitive Assessment - Switch Challenge / Operator Transformation",
    category: "aptitude",
    type: "mcq",
    difficulty: "Medium",
    companies: ["capgemini", "ibm", "deloitte"],
    topics: ["Cognitive Assessment", "Switch Challenge", "Game-Based Reasoning"],
    frequency: "High",
    source: "Capgemini Cognitive Assessment (Switch Challenge)",
    tags: ["Cognitive", "Switch Challenge", "2026"],
    lastReviewed: "2026",
    description: "In the Switch Challenge, a four-digit operator code transforms input shapes into output shapes by swapping positions. If operator `[4, 2, 3, 1]` swaps the 1st and 4th position of an input sequence `[Circle, Square, Triangle, Star]`, what is the resulting sequence?",
    options: [
      "`[Star, Square, Triangle, Circle]`",
      "`[Circle, Star, Square, Triangle]`",
      "`[Square, Triangle, Star, Circle]`",
      "`[Triangle, Circle, Star, Square]`"
    ],
    correctAnswer: 0,
    explanation: "Operator `[4, 2, 3, 1]` places the 4th item (Star) in slot 1, keeps 2nd (Square) and 3rd (Triangle) in place, and moves the 1st item (Circle) to slot 4, giving `[Star, Square, Triangle, Circle]`.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. ACCENTURE COGNITIVE & TECHNICAL (PSEUDOCODE & COMMON APPLICATIONS)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Accenture Pseudocode - Bitwise XOR & Nested Loops",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["accenture", "capgemini", "tcs", "cognizant"],
    topics: ["Pseudocode", "Bit Manipulation"],
    frequency: "High",
    source: "Accenture Cognitive & Technical Assessment",
    tags: ["Accenture", "Pseudocode", "Bitwise", "2026"],
    lastReviewed: "2026",
    description: "What will be the output of the following pseudocode?\n\n```text\nInteger a, b, c\nSet a = 4, b = 6, c = 2\na = (a ^ b) + c\nif ((a + b + c) > (b * c))\n    b = (a + c) ^ b\nElse\n    c = a + b\nEnd if\nPrint a + b + c\n```",
    options: ["14", "18", "16", "20"],
    correctAnswer: 0,
    explanation: "1. `a = 4 ^ 6 + 2`: `4 ^ 6 = 2`, so `a = 2 + 2 = 4`.\n2. Condition check: `(4 + 6 + 2) = 12`. `(b * c) = (6 * 2) = 12`.\n3. `12 > 12` is FALSE!\n4. Else branch executes: `c = a + b = 4 + 6 = 10`.\n5. Output: `a + b + c = 4 + 6 + 10 = 20`.",
  },
  {
    title: "Accenture Technical - Cloud & MS Office Security Fundamentals",
    category: "technical",
    type: "mcq",
    difficulty: "Easy",
    companies: ["accenture", "deloitte", "capgemini", "wipro"],
    topics: ["Common Applications", "Cloud Computing", "Network Security"],
    frequency: "High",
    source: "Accenture Cognitive & Technical Assessment",
    tags: ["Accenture", "Cloud", "Security", "2026"],
    lastReviewed: "2026",
    description: "In cloud computing and enterprise IT security, what is the primary benefit of Multi-Factor Authentication (MFA)?",
    options: [
      "It compresses file attachments sent via Microsoft Outlook.",
      "It requires two or more distinct verification factors (something you know, something you have, something you are), rendering stolen passwords alone insufficient for unauthorized access.",
      "It increases broadband internet download bandwidth.",
      "It automatically backups local hard drives to optical media."
    ],
    correctAnswer: 1,
    explanation: "Multi-Factor Authentication (MFA) defends against credential stuffing and phishing by demanding multiple independent credentials (e.g. password + hardware token or biometric scan) before granting access.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. TCS NQT ADVANCED & DIGITAL/PRIME QUANTITATIVE & CODING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "TCS Advanced Quantitative - Remainder with Fermat's Little Theorem",
    category: "aptitude",
    type: "mcq",
    difficulty: "Hard",
    companies: ["tcs", "infosys", "google", "goldman-sachs"],
    topics: ["Number Theory", "Fermat's Little Theorem", "Advanced Quantitative"],
    frequency: "High",
    source: "TCS NQT Advanced Quantitative (Prime / Digital)",
    tags: ["TCS Prime", "Advanced Quant", "Number Theory", "2026"],
    lastReviewed: "2026",
    description: "Find the remainder when $3^{102}$ is divided by $101$ (where $101$ is a prime number).",
    options: ["9", "3", "1", "27"],
    correctAnswer: 0,
    formula: "Fermat's Little Theorem: If p is prime and gcd(a, p) = 1, then a^(p - 1) ≡ 1 (mod p)",
    explanation: "1. By Fermat's Little Theorem, $3^{101 - 1} = 3^{100} \\equiv 1 \\pmod{101}$.\n2. Therefore, $3^{102} = 3^{100} \\times 3^2 = 1 \\times 9 = 9 \\pmod{101}$.\n3. The remainder is 9.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. INFOSYS SP / DSE & COGNIZANT ELEVATE TECHNICAL MCQS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Cognizant & Infosys SQL - Window Function DENSE_RANK()",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["cognizant", "infosys", "tcs", "accenture", "capgemini"],
    topics: ["SQL", "DBMS", "Window Functions"],
    frequency: "High",
    source: "Cognizant GenC Elevate & Infosys DSE Assessment",
    tags: ["SQL", "Window Functions", "2026"],
    lastReviewed: "2026",
    description: "What is the difference between `RANK()` and `DENSE_RANK()` in SQL when two rows share the exact same ordering value (a tie for rank 1)?",
    options: [
      "`RANK()` leaves no gaps in ranking (1, 1, 2), while `DENSE_RANK()` skips ranks (1, 1, 3).",
      "`RANK()` skips the subsequent rank number (1, 1, 3), whereas `DENSE_RANK()` produces contiguous consecutive ranks without gaps (1, 1, 2).",
      "`DENSE_RANK()` can only be used with PostgreSQL.",
      "`RANK()` requires a `GROUP BY` clause whereas `DENSE_RANK()` does not."
    ],
    correctAnswer: 1,
    explanation: "When tied values occur: `RANK()` assigns identical ranks and skips subsequent rank numbers (e.g. 1, 1, 3). `DENSE_RANK()` assigns identical ranks but maintains sequential numbering without gaps (e.g. 1, 1, 2).",
  },
];

export const CODING_2026_QUESTIONS = [
  // ── Capgemini & Accenture OA: Binary String Operations Evaluator ──
  {
    title: "Operations on Binary String",
    category: "coding",
    type: "coding",
    difficulty: "Easy",
    companies: ["capgemini", "accenture", "wipro", "tcs"],
    topics: ["String", "Bit Manipulation", "Simulation"],
    frequency: "High",
    source: "Reported in Accenture & Capgemini Coding Assessment",
    tags: ["Accenture", "Capgemini", "Binary String", "2026"],
    lastReviewed: "2026",
    problemDescription: "You are given a binary string `str` consisting of binary digits ('0' and '1') separated by operations:\n- 'A' represents bitwise `AND`\n- 'B' represents bitwise `OR`\n- 'C' represents bitwise `XOR`\n\nEvaluate the string expression from left to right and return the final single-digit binary integer result (`0` or `1`). If the string is null or empty, return `-1`.",
    examples: [
      {
        input: "str = \"1C0C1B1A0\"",
        output: "0",
        explanation: "1 XOR 0 = 1; 1 XOR 1 = 0; 0 OR 1 = 1; 1 AND 0 = 0."
      },
      {
        input: "str = \"0C1A1B1C1C1B0A1\"",
        output: "1",
        explanation: "Evaluating from left to right yields 1."
      }
    ],
    constraints: [
      "1 <= str.length <= 10^5",
      "str always consists of alternating binary digits and operation characters (A, B, C)."
    ],
    starterCode: {
      javascript: "function operationsBinaryString(str) {\n    // Write your optimal solution here\n    \n}",
      python: "class Solution:\n    def operationsBinaryString(self, s: str) -> int:\n        # Write your optimal solution here\n        pass",
      cpp: "class Solution {\npublic:\n    int operationsBinaryString(string str) {\n        // Write your optimal solution here\n        return 0;\n    }\n};",
      java: "class Solution {\n    public int operationsBinaryString(String str) {\n        // Write your optimal solution here\n        return 0;\n    }\n}"
    },
    testCases: [
      { input: "\"1C0C1B1A0\"", expectedOutput: "0", isHidden: false },
      { input: "\"0C1A1B1C1C1B0A1\"", expectedOutput: "1", isHidden: false },
      { input: "\"1A1A1A1\"", expectedOutput: "1", isHidden: true },
      { input: "\"0B0B0B0\"", expectedOutput: "0", isHidden: true }
    ],
    hints: [
      "Process the string in steps of 2: index i is the operator, index i+1 is the next digit.",
      "Initialize your result with the first character converted to an integer."
    ],
    approach: "Linear scan in O(N) time with O(1) auxiliary space.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },

  // ── Capgemini AI-Assisted / TCS Digital: Find Leaders in Array ──
  {
    title: "Leaders in an Array",
    category: "coding",
    type: "coding",
    difficulty: "Easy",
    companies: ["capgemini", "tcs", "accenture", "cognizant", "infosys"],
    topics: ["Array", "Prefix/Suffix"],
    frequency: "High",
    source: "Reported in Capgemini AI-Assisted Coding & TCS NQT",
    tags: ["Capgemini", "TCS", "Leaders", "2026"],
    lastReviewed: "2026",
    problemDescription: "Given an array `arr` of positive integers, return an array of all the **Leaders** in the array in their original order of appearance.\n\nAn element is considered a **Leader** if it is strictly greater than all the elements to its right side. The rightmost element is always a leader.",
    examples: [
      {
        input: "arr = [16, 17, 4, 3, 5, 2]",
        output: "[17, 5, 2]",
        explanation: "17 is greater than [4,3,5,2]. 5 is greater than [2]. 2 is the rightmost element."
      },
      {
        input: "arr = [1, 2, 3, 4, 0]",
        output: "[4, 0]",
        explanation: "4 is greater than 0, and 0 is rightmost."
      }
    ],
    constraints: [
      "1 <= arr.length <= 10^5",
      "0 <= arr[i] <= 10^6"
    ],
    starterCode: {
      javascript: "function findLeaders(arr) {\n    // Write your optimal solution here\n    \n}",
      python: "class Solution:\n    def findLeaders(self, arr: list[int]) -> list[int]:\n        # Write your optimal solution here\n        pass",
      cpp: "class Solution {\npublic:\n    vector<int> findLeaders(vector<int>& arr) {\n        // Write your optimal solution here\n        return {};\n    }\n};",
      java: "class Solution {\n    public int[] findLeaders(int[] arr) {\n        // Write your optimal solution here\n        return new int[0];\n    }\n}"
    },
    testCases: [
      { input: "[16,17,4,3,5,2]", expectedOutput: "[17,5,2]", isHidden: false },
      { input: "[1,2,3,4,0]", expectedOutput: "[4,0]", isHidden: false },
      { input: "[5]", expectedOutput: "[5]", isHidden: true },
      { input: "[10,22,12,3,0,6]", expectedOutput: "[22,12,6]", isHidden: true }
    ],
    hints: [
      "Instead of checking all elements to the right for each item (O(N^2)), traverse from right to left in O(N).",
      "Keep track of the maximum element seen so far from the right."
    ],
    approach: "Right-to-left scan maintaining running maximum.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },

  // ── Capgemini Stage 3: Hands-On Code Debugging (Buggy Starter Code) ──
  {
    title: "Reverse Vowels of a String (Debugging)",
    category: "coding",
    type: "coding",
    difficulty: "Easy",
    companies: ["capgemini", "wipro", "tcs", "cognizant"],
    topics: ["Debugging Assessment", "Code Correction", "Two Pointers", "String"],
    frequency: "High",
    source: "Capgemini Hands-on Debugging Round (Automata Fix Pattern)",
    tags: ["Capgemini", "Debugging", "Code Fix", "Automata Fix", "2026"],
    lastReviewed: "2026",
    problemDescription: "Given a string `s`, reverse only all the vowels in the string ('a', 'e', 'i', 'o', 'u', both lowercase and uppercase) and return the resulting string.",
    examples: [
      {
        input: "s = \"Capgemini\"",
        output: "\"Cipgameny\"",
        explanation: "Vowels 'a', 'e', 'i', 'i' reversed."
      },
      {
        input: "s = \"aA\"",
        output: "\"Aa\"",
        explanation: "Vowels 'a' and 'A' are swapped."
      },
      {
        input: "s = \"hello\"",
        output: "\"holle\"",
        explanation: "Vowels 'e' and 'o' are swapped."
      }
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s consists of printable ASCII characters."
    ],
    starterCode: {
      javascript: "function reverseVowels(s) {\n    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n    const arr = s.split('');\n    let left = 0, right = arr.length - 1;\n    while (left < right) {\n        if (!vowels.has(arr[left])) left++;\n        else if (!vowels.has(arr[right])) right--;\n        else {\n            const temp = arr[left];\n            arr[left] = arr[right];\n            arr[right] = temp;\n            left++;\n            right--;\n        }\n    }\n    return arr.join('');\n}",
      python: "class Solution:\n    def reverseVowels(self, s: str) -> str:\n        vowels = set('aeiou')\n        chars = list(s)\n        left, right = 0, len(chars) - 1\n        while left < right:\n            if chars[left] not in vowels:\n                left += 1\n            elif chars[right] not in vowels:\n                right -= 1\n            else:\n                chars[left], chars[right] = chars[right], chars[left]\n                left += 1\n                right -= 1\n        return ''.join(chars)",
      cpp: "class Solution {\npublic:\n    string reverseVowels(string s) {\n        string vowels = \"aeiou\";\n        int left = 0, right = s.length() - 1;\n        while (left < right) {\n            if (vowels.find(s[left]) == string::npos) left++;\n            else if (vowels.find(s[right]) == string::npos) right--;\n            else {\n                swap(s[left], s[right]);\n                left++; right--;\n            }\n        }\n        return s;\n    }\n};",
      java: "class Solution {\n    public String reverseVowels(String s) {\n        String vowels = \"aeiou\";\n        char[] chars = s.toCharArray();\n        int left = 0, right = chars.length - 1;\n        while (left < right) {\n            if (vowels.indexOf(chars[left]) == -1) left++;\n            else if (vowels.indexOf(chars[right]) == -1) right--;\n            else {\n                char temp = chars[left];\n                chars[left] = chars[right];\n                chars[right] = temp;\n                left++; right--;\n            }\n        }\n        return new String(chars);\n    }\n}"
    },
    testCases: [
      { input: "\"Capgemini\"", expectedOutput: "\"Cipgameny\"", isHidden: false },
      { input: "\"aA\"", expectedOutput: "\"Aa\"", isHidden: false },
      { input: "\"hello\"", expectedOutput: "\"holle\"", isHidden: true },
      { input: "\"leetcode\"", expectedOutput: "\"leotcede\"", isHidden: true }
    ],
    hints: [
      "Pay attention to character case handling (both lowercase and uppercase vowels).",
      "Check two-pointer termination conditions and boundary updates."
    ],
    approach: "Two-pointer approach swapping vowels from both ends in O(N) time.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },

  // ── Capgemini Stage 3: Hands-On Debugging (Contains Duplicate) ──
  {
    title: "Check Array Duplicates (Debugging)",
    category: "coding",
    type: "coding",
    difficulty: "Easy",
    companies: ["capgemini", "wipro", "accenture", "cognizant"],
    topics: ["Debugging Assessment", "Code Correction", "Hash Table", "Array"],
    frequency: "High",
    source: "Capgemini Hands-on Debugging Round",
    tags: ["Capgemini", "Debugging", "Code Fix", "Automata Fix", "2026"],
    lastReviewed: "2026",
    problemDescription: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    examples: [
      {
        input: "nums = [1, 2, 3, 1]",
        output: "true",
        explanation: "1 appears twice."
      },
      {
        input: "nums = [1, 2, 3, 4]",
        output: "false",
        explanation: "All elements are distinct."
      },
      {
        input: "nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]",
        output: "true",
        explanation: "Multiple duplicates exist."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    starterCode: {
      javascript: "function containsDuplicate(nums) {\n    const seen = new Set();\n    for (let i = 0; i < nums.length; i++) {\n        if (seen.has(nums[i])) {\n            return true;\n        } else {\n            seen.add(nums[i]);\n            return false;\n        }\n    }\n    return false;\n}",
      python: "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        seen = set()\n        for x in nums:\n            if x in seen:\n                return True\n            else:\n                seen.add(x)\n                return False\n        return False",
      cpp: "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int x : nums) {\n            if (seen.count(x)) {\n                return true;\n            } else {\n                seen.insert(x);\n                return false;\n            }\n        }\n        return false;\n    }\n};",
      java: "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        java.util.HashSet<Integer> seen = new java.util.HashSet<>();\n        for (int x : nums) {\n            if (seen.contains(x)) {\n                return true;\n            } else {\n                seen.add(x);\n                return false;\n            }\n        }\n        return false;\n    }\n}"
    },
    testCases: [
      { input: "[1,2,3,1]", expectedOutput: "true", isHidden: false },
      { input: "[1,2,3,4]", expectedOutput: "false", isHidden: false },
      { input: "[1,1,1,3,3,4,3,2,4,2]", expectedOutput: "true", isHidden: true },
      { input: "[0]", expectedOutput: "false", isHidden: true }
    ],
    hints: [
      "Check when the function returns false relative to the iteration of the collection.",
      "A collection can only be verified to have no duplicates after all elements have been examined."
    ],
    approach: "Use a HashSet for O(N) time and O(N) space.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },

  // ── 4. Subarray Sum Equals K (Debugging - Medium) ──
  {
    title: "Subarray Sum Equals K (Debugging)",
    category: "coding",
    type: "coding",
    difficulty: "Medium",
    companies: ["capgemini", "amazon", "microsoft", "google", "tcs"],
    topics: ["Debugging Assessment", "Code Correction", "Prefix Sum", "Hash Table"],
    frequency: "High",
    source: "Technical Debugging Assessment (Hash Map Logic)",
    tags: ["Debugging", "Code Fix", "Prefix Sum", "Hash Table", "2026"],
    lastReviewed: "2026",
    problemDescription: "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.\n\nA subarray is a contiguous non-empty sequence of elements within an array.",
    examples: [
      {
        input: "nums = [3], k = 3",
        output: "1",
        explanation: "The subarray [3] has sum 3."
      },
      {
        input: "nums = [1, 1, 1], k = 2",
        output: "2",
        explanation: "Subarrays [1, 1] at indices (0,1) and (1,2) sum to 2."
      },
      {
        input: "nums = [1, 2, 3], k = 3",
        output: "2",
        explanation: "Subarrays [1, 2] and [3] sum to 3."
      }
    ],
    constraints: [
      "1 <= nums.length <= 2 * 10^4",
      "-1000 <= nums[i] <= 1000",
      "-10^7 <= k <= 10^7"
    ],
    starterCode: {
      javascript: "function subarraySum(nums, k) {\n    let count = 0, sum = 0;\n    const map = new Map();\n    // Bug: Missing base prefix sum frequency registration map.set(0, 1)\n    for (let i = 0; i < nums.length; i++) {\n        sum += nums[i];\n        if (map.has(sum - k)) {\n            count += map.get(sum - k);\n        }\n        map.set(sum, (map.get(sum) || 0) + 1);\n    }\n    return count;\n}",
      python: "class Solution:\n    def subarraySum(self, nums: list[int], k: int) -> int:\n        count = 0\n        curr_sum = 0\n        # Bug: Missing base prefix count prefix_counts = {0: 1}\n        prefix_counts = {}\n        for x in nums:\n            curr_sum += x\n            if curr_sum - k in prefix_counts:\n                count += prefix_counts[curr_sum - k]\n            prefix_counts[curr_sum] = prefix_counts.get(curr_sum, 0) + 1\n        return count",
      cpp: "class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        int count = 0, sum = 0;\n        unordered_map<int, int> map;\n        // Bug: Missing base prefix sum registration map[0] = 1\n        for (int x : nums) {\n            sum += x;\n            if (map.find(sum - k) != map.end()) {\n                count += map[sum - k];\n            }\n            map[sum]++;\n        }\n        return count;\n    }\n};",
      java: "class Solution {\n    public int subarraySum(int[] nums, int k) {\n        int count = 0, sum = 0;\n        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n        // Bug: Missing base prefix sum map.put(0, 1)\n        for (int x : nums) {\n            sum += x;\n            if (map.containsKey(sum - k)) {\n                count += map.get(sum - k);\n            }\n            map.put(sum, map.getOrDefault(sum, 0) + 1);\n        }\n        return count;\n    }\n}"
    },
    testCases: [
      { input: "[3]\n3", expectedOutput: "1", isHidden: false },
      { input: "[1,1,1]\n2", expectedOutput: "2", isHidden: false },
      { input: "[1,2,3]\n3", expectedOutput: "2", isHidden: false },
      { input: "[1,-1,0]\n0", expectedOutput: "3", isHidden: true }
    ],
    hints: [
      "Think about what happens when the prefix sum from index 0 itself equals k.",
      "Consider how base prefix sum 0 is initially registered in your map."
    ],
    approach: "Prefix sum with hash table frequency counts in O(N) time.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },

  // ── 5. Merge Overlapping Intervals (Debugging - Medium/Hard) ──
  {
    title: "Merge Overlapping Intervals (Debugging)",
    category: "coding",
    type: "coding",
    difficulty: "Medium",
    companies: ["capgemini", "microsoft", "amazon", "google", "accenture"],
    topics: ["Debugging Assessment", "Code Correction", "Sorting", "Intervals"],
    frequency: "High",
    source: "Advanced Debugging Round (Interval Logic)",
    tags: ["Debugging", "Code Fix", "Intervals", "Sorting", "2026"],
    lastReviewed: "2026",
    problemDescription: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      {
        input: "intervals = [[1,4],[0,4]]",
        output: "[[0,4]]",
        explanation: "Intervals [0,4] completely encompasses [1,4]."
      },
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Intervals [1,3] and [2,6] overlap, merging into [1,6]."
      }
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    starterCode: {
      javascript: "function merge(intervals) {\n    if (intervals.length <= 1) return intervals;\n    // Bug: Flawed sort criteria (sorting by end time instead of start time)\n    intervals.sort((a, b) => a[1] - b[1]);\n    const merged = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const current = intervals[i];\n        const last = merged[merged.length - 1];\n        if (current[0] <= last[1]) {\n            // Bug: Overwrites end without checking maximum boundary\n            last[1] = current[1];\n        } else {\n            merged.push(current);\n        }\n    }\n    return merged;\n}",
      python: "class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        if len(intervals) <= 1:\n            return intervals\n        # Bug: Sorting by end time instead of start time\n        intervals.sort(key=lambda x: x[1])\n        merged = [intervals[0]]\n        for curr in intervals[1:]:\n            last = merged[-1]\n            if curr[0] <= last[1]:\n                last[1] = curr[1]\n            else:\n                merged.append(curr)\n        return merged",
      cpp: "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        if (intervals.size() <= 1) return intervals;\n        // Bug: Flawed comparator sorting by end point\n        sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {\n            return a[1] < b[1];\n        });\n        vector<vector<int>> merged = {intervals[0]};\n        for (size_t i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] <= merged.back()[1]) {\n                merged.back()[1] = intervals[i][1];\n            } else {\n                merged.push_back(intervals[i]);\n            }\n        }\n        return merged;\n    }\n};",
      java: "class Solution {\n    public int[][] merge(int[][] intervals) {\n        if (intervals.length <= 1) return intervals;\n        // Bug: Flawed comparator sorting by end point\n        java.util.Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));\n        java.util.List<int[]> merged = new java.util.ArrayList<>();\n        merged.add(intervals[0]);\n        for (int i = 1; i < intervals.length; i++) {\n            int[] last = merged.get(merged.size() - 1);\n            if (intervals[i][0] <= last[1]) {\n                last[1] = intervals[i][1];\n            } else {\n                merged.add(intervals[i]);\n            }\n        }\n        return merged.toArray(new int[merged.size()][]);\n    }\n}"
    },
    testCases: [
      { input: "[[1,4],[0,4]]", expectedOutput: "[[0,4]]", isHidden: false },
      { input: "[[1,3],[2,6],[8,10],[15,18]]", expectedOutput: "[[1,6],[8,10],[15,18]]", isHidden: false },
      { input: "[[1,4],[2,3]]", expectedOutput: "[[1,4]]", isHidden: true },
      { input: "[[2,3],[4,5],[6,7],[8,9],[1,10]]", expectedOutput: "[[1,10]]", isHidden: true }
    ],
    hints: [
      "Check which property of intervals you should sort by (start time vs end time).",
      "When one interval is completely inside another (e.g. [1,4] and [2,3]), how should the end boundary be resolved?"
    ],
    approach: "Sort by start times, then greedily merge overlapping intervals taking Math.max of end times.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)"
  },

  // ── 6. Longest Substring Without Repeating Characters (Debugging - Medium/Hard) ──
  {
    title: "Longest Substring Without Repeating Characters (Debugging)",
    category: "coding",
    type: "coding",
    difficulty: "Medium",
    companies: ["capgemini", "amazon", "microsoft", "google", "meta"],
    topics: ["Debugging Assessment", "Code Correction", "Sliding Window", "String", "Hash Table"],
    frequency: "High",
    source: "Technical Debugging Assessment (Sliding Window Pointer Fix)",
    tags: ["Debugging", "Code Fix", "Sliding Window", "Two Pointers", "2026"],
    lastReviewed: "2026",
    problemDescription: "Given a string `s`, find the length of the longest substring without duplicate characters.",
    examples: [
      {
        input: "s = \"abba\"",
        output: "2",
        explanation: "The longest non-repeating substrings are \"ab\" and \"ba\", both of length 2."
      },
      {
        input: "s = \"abcabcbb\"",
        output: "3",
        explanation: "The answer is \"abc\", with the length of 3."
      },
      {
        input: "s = \"bbbbb\"",
        output: "1",
        explanation: "The answer is \"b\", with the length of 1."
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    starterCode: {
      javascript: "function lengthOfLongestSubstring(s) {\n    let maxLen = 0, left = 0;\n    const map = new Map();\n    for (let right = 0; right < s.length; right++) {\n        const c = s[right];\n        // Bug: Rolls left pointer backwards if character was seen before current left boundary\n        if (map.has(c)) {\n            left = map.get(c) + 1;\n        }\n        map.set(c, right);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
      python: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        max_len = 0\n        left = 0\n        last_seen = {}\n        for right, char in enumerate(s):\n            # Bug: Rolls left pointer backwards if character was seen before current window left\n            if char in last_seen:\n                left = last_seen[char] + 1\n            last_seen[char] = right\n            max_len = max(max_len, right - left + 1)\n        return max_len",
      cpp: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        int maxLen = 0, left = 0;\n        unordered_map<char, int> map;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s[right];\n            // Bug: Rolls left pointer backwards without std::max(left, map[c] + 1)\n            if (map.find(c) != map.end()) {\n                left = map[c] + 1;\n            }\n            map[c] = right;\n            maxLen = max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};",
      java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int maxLen = 0, left = 0;\n        java.util.Map<Character, Integer> map = new java.util.HashMap<>();\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            // Bug: Rolls left pointer backwards without Math.max(left, map.get(c) + 1)\n            if (map.containsKey(c)) {\n                left = map.get(c) + 1;\n            }\n            map.put(c, right);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}"
    },
    testCases: [
      { input: "\"abba\"", expectedOutput: "2", isHidden: false },
      { input: "\"abcabcbb\"", expectedOutput: "3", isHidden: false },
      { input: "\"pwwkew\"", expectedOutput: "3", isHidden: false },
      { input: "\"tmmzuxt\"", expectedOutput: "5", isHidden: true },
      { input: "\"\"", expectedOutput: "0", isHidden: true }
    ],
    hints: [
      "Test with string 'abba'. What happens to the left pointer when processing the second 'a'?",
      "Ensure the left pointer never moves backward."
    ],
    approach: "Sliding window with hash map ensuring left = max(left, lastSeen[char] + 1).",
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n, m))"
  },

  // ── 7. Search in Rotated Sorted Array (Debugging - Hard) ──
  {
    title: "Search in Rotated Sorted Array (Debugging)",
    category: "coding",
    type: "coding",
    difficulty: "Hard",
    companies: ["capgemini", "google", "amazon", "microsoft", "adobe"],
    topics: ["Debugging Assessment", "Code Correction", "Binary Search", "Array"],
    frequency: "High",
    source: "Advanced Algorithmic Debugging Assessment",
    tags: ["Debugging", "Code Fix", "Binary Search", "Hard", "2026"],
    lastReviewed: "2026",
    problemDescription: "There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index. Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with $O(\\log n)$ runtime complexity.",
    examples: [
      {
        input: "nums = [3,1], target = 1",
        output: "1",
        explanation: "1 is at index 1 in the rotated array."
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4"
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1"
      }
    ],
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique."
    ],
    starterCode: {
      javascript: "function search(nums, target) {\n    let left = 0, right = nums.length - 1;\n    while (left <= right) {\n        const mid = Math.floor((left + right) / 2);\n        if (nums[mid] === target) return mid;\n        // Bug: Strict inequality '<' instead of '<=' fails on 2-element arrays\n        if (nums[left] < nums[mid]) {\n            // Bug: Missing equality check for target matching bounds\n            if (nums[left] < target && target < nums[mid]) {\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        } else {\n            if (nums[mid] < target && target < nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n    }\n    return -1;\n}",
      python: "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        left, right = 0, len(nums) - 1\n        while left <= right:\n            mid = (left + right) // 2\n            if nums[mid] == target:\n                return mid\n            # Bug: Strict inequality fails when left == mid\n            if nums[left] < nums[mid]:\n                if nums[left] < target < nums[mid]:\n                    right = mid - 1\n                else:\n                    left = mid + 1\n            else:\n                if nums[mid] < target < nums[right]:\n                    left = mid + 1\n                else:\n                    right = mid - 1\n        return -1",
      cpp: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            // Bug: Strict inequality '<' instead of '<='\n            if (nums[left] < nums[mid]) {\n                if (nums[left] < target && target < nums[mid]) {\n                    right = mid - 1;\n                } else {\n                    left = mid + 1;\n                }\n            } else {\n                if (nums[mid] < target && target < nums[right]) {\n                    left = mid + 1;\n                } else {\n                    right = mid - 1;\n                }\n            }\n        }\n        return -1;\n    }\n};",
      java: "class Solution {\n    public int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            // Bug: Strict inequality '<' instead of '<='\n            if (nums[left] < nums[mid]) {\n                if (nums[left] < target && target < nums[mid]) {\n                    right = mid - 1;\n                } else {\n                    left = mid + 1;\n                }\n            } else {\n                if (nums[mid] < target && target < nums[right]) {\n                    left = mid + 1;\n                } else {\n                    right = mid - 1;\n                }\n            }\n        }\n        return -1;\n    }\n}"
    },
    testCases: [
      { input: "[3,1]\n1", expectedOutput: "1", isHidden: false },
      { input: "[4,5,6,7,0,1,2]\n0", expectedOutput: "4", isHidden: false },
      { input: "[4,5,6,7,0,1,2]\n3", expectedOutput: "-1", isHidden: false },
      { input: "[5,1,3]\n5", expectedOutput: "0", isHidden: true },
      { input: "[1]\n0", expectedOutput: "-1", isHidden: true }
    ],
    hints: [
      "Check the inequality signs: should `nums[left] <= nums[mid]` use `<=` or `<`?",
      "Check if target can equal `nums[left]` or `nums[right]` during range boundary checks."
    ],
    approach: "Modified Binary Search determining which half is sorted in O(log N) time.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)"
  },

  // ── 8. Valid Parentheses String Matching (Debugging - Hard) ──
  {
    title: "Valid Parentheses Matching (Debugging)",
    category: "coding",
    type: "coding",
    difficulty: "Medium",
    companies: ["capgemini", "tcs", "infosys", "wipro", "cognizant"],
    topics: ["Debugging Assessment", "Code Correction", "Stack", "String"],
    frequency: "High",
    source: "Technical Debugging Assessment (Stack Order)",
    tags: ["Debugging", "Code Fix", "Stack", "2026"],
    lastReviewed: "2026",
    problemDescription: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      {
        input: "s = \"[\"",
        output: "false",
        explanation: "The open bracket '[' was never closed."
      },
      {
        input: "s = \"()[]{}\"",
        output: "true"
      },
      {
        input: "s = \"(]\"",
        output: "false"
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    starterCode: {
      javascript: "function isValid(s) {\n    const stack = [];\n    const pairs = { ')': '(', '}': '{', ']': '[' };\n    for (let i = 0; i < s.length; i++) {\n        const c = s[i];\n        if (c === '(' || c === '{' || c === '[') {\n            stack.push(c);\n        } else {\n            const top = stack.pop();\n            if (top !== pairs[c]) return false;\n        }\n    }\n    // Bug: Always returns true even if stack contains unclosed brackets\n    return true;\n}",
      python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        pairs = {')': '(', '}': '{', ']': '['}\n        for c in s:\n            if c in '({[':\n                stack.append(c)\n            else:\n                if not stack or stack.pop() != pairs[c]:\n                    return False\n        // Bug: Ignores non-empty stack\n        return True",
      cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(' || c == '{' || c == '[') {\n                st.push(c);\n            } else {\n                if (st.empty()) return false;\n                char top = st.top(); st.pop();\n                if ((c == ')' && top != '(') ||\n                    (c == '}' && top != '{') ||\n                    (c == ']' && top != '[')) return false;\n            }\n        }\n        // Bug: Should return st.empty()\n        return true;\n    }\n};",
      java: "class Solution {\n    public boolean isValid(String s) {\n        java.util.Stack<Character> stack = new java.util.Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(' || c == '{' || c == '[') {\n                stack.push(c);\n            } else {\n                if (stack.isEmpty()) return false;\n                char top = stack.pop();\n                if (c == ')' && top != '(') return false;\n                if (c == '}' && top != '{') return false;\n                if (c == ']' && top != '[') return false;\n            }\n        }\n        // Bug: Should return stack.isEmpty()\n        return true;\n    }\n}"
    },
    testCases: [
      { input: "\"[\"", expectedOutput: "false", isHidden: false },
      { input: "\"()[]{}\"", expectedOutput: "true", isHidden: false },
      { input: "\"(]\"", expectedOutput: "false", isHidden: false },
      { input: "\"]\"", expectedOutput: "false", isHidden: true },
      { input: "\"{[]}\"", expectedOutput: "true", isHidden: true }
    ],
    hints: [
      "What should the function return if the string contains only open brackets like '[' at the end?",
      "Make sure the stack is completely empty when all characters have been processed."
    ],
    approach: "Use a Stack matching closing brackets with corresponding opening brackets in O(N) time.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },

  // 9. Kth Largest Element in an Array (Debugging - Hard) ──
  {
    title: "Kth Largest Element in an Array (Debugging)",
    category: "coding",
    type: "coding",
    difficulty: "Hard",
    companies: ["capgemini", "amazon", "microsoft", "google", "meta"],
    topics: ["Debugging Assessment", "Code Correction", "Heap", "Quickselect", "Array"],
    frequency: "High",
    source: "Advanced Compiler Debugging Round (Heap / Selection Logic)",
    tags: ["Debugging", "Code Fix", "Heap", "Quickselect", "Hard", "2026"],
    lastReviewed: "2026",
    problemDescription: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nNote that it is the `k`th largest element in the sorted order, not the `k`th distinct element.",
    examples: [
      {
        input: "nums = [3,2,1,5,6,4], k = 2",
        output: "5"
      },
      {
        input: "nums = [3,2,3,1,2,4,5,5,6], k = 4",
        output: "4"
      }
    ],
    constraints: [
      "1 <= k <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    starterCode: {
      javascript: "function findKthLargest(nums, k) {\n    // Bug: Sorts ascending and accesses index k-1 (yielding kth smallest)\n    nums.sort((a, b) => a - b);\n    return nums[k - 1];\n}",
      python: "class Solution:\n    def findKthLargest(self, nums: list[int], k: int) -> int:\n        import heapq\n        heap = []\n        # Bug: Inverse heap bounding condition\n        for x in nums:\n            heapq.heappush(heap, x)\n            if len(heap) > len(nums) - k:\n                heapq.heappop(heap)\n        return heap[0]",
      cpp: "class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        priority_queue<int, vector<int>, greater<int>> minHeap;\n        // Bug: Flawed heap size limit\n        for (int x : nums) {\n            minHeap.push(x);\n            if (minHeap.size() > nums.size() - k) {\n                minHeap.pop();\n            }\n        }\n        return minHeap.top();\n    }\n};",
      java: "class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        java.util.PriorityQueue<Integer> minHeap = new java.util.PriorityQueue<>();\n        // Bug: Flawed heap size limit\n        for (int x : nums) {\n            minHeap.offer(x);\n            if (minHeap.size() > nums.length - k) {\n                minHeap.poll();\n            }\n        }\n        return minHeap.peek();\n    }\n}"
    },
    testCases: [
      { input: "[3,2,1,5,6,4]\n2", expectedOutput: "5", isHidden: false },
      { input: "[3,2,3,1,2,4,5,5,6]\n4", expectedOutput: "4", isHidden: false },
      { input: "[1]\n1", expectedOutput: "1", isHidden: true },
      { input: "[7,6,5,4,3,2,1]\n5", expectedOutput: "3", isHidden: true }
    ],
    hints: [
      "To find the kth largest element with a min-heap, maintain a heap of size exactly k.",
      "The root of a min-heap of size k will store the kth largest element."
    ],
    approach: "Maintain a Min-Heap of size k for O(N log k) time and O(k) space.",
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)"
  }
];
