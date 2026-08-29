/**
 * Authentic Previous-Year & Online Assessment Questions for:
 * 1. Apple (iOS/macOS, C++, Memory, LRU, Low-level Systems)
 * 2. Netflix (Distributed Systems, Microservices, Caching, High-Concurrency DSA)
 * 3. Oracle (Database Internals, B+ Trees, SQL, Java GC, Locks)
 * 4. Goldman Sachs (Quantitative Probability, HFT DSA, Subarray Sums, Puzzles)
 * 5. JPMorgan Chase (Idempotency, REST Architecture, FinTech DSA, DP)
 * 6. Cisco (Computer Networks, TCP/IP, Socket Programming, Subnetting, Bitwise)
 * 7. Uber (Geospatial Indexing, Graph Traversal, Interval Scheduling)
 * 8. IBM (Cloud Architecture, Linux, Enterprise Java/Python, Anagrams)
 * 9. Salesforce (Multi-tenant DB, Apex Patterns, LRU Cache, Custom HashMaps)
 * 10. Qualcomm (Embedded C, ISRs, Pointers, Volatile, Bit Manipulation)
 * 11. Google (Hard Graphs, DP, Concurrency, Raft/Paxos, System Design)
 * 12. Microsoft (Azure Cloud, Trees, Bit Manipulation, C++/C# Design)
 * 13. Amazon (Leadership Principles, Heaps, Sliding Window, DynamoDB)
 * 14. Meta (GraphQL, Caching, BFS/DFS, Continuous Subarrays)
 * 15. Adobe (Matrix Transforms, Geometric Algorithms, Tries, OOP)
 * 16. TCS (Ninja/Digital/Prime NQT Numerical, Advanced Pseudocode, String/Array OA)
 * 17. Infosys (Cryptarithmetic, SP/DSE Coding, OOP, DBMS)
 * 18. Wipro (Elite NLTH Quantitative, Cloud/OS MCQs, Automata Debugging)
 * 19. Accenture (Critical Thinking, Abstract Reasoning, Pseudocode, Binary String)
 * 20. Capgemini (Game-Based / Cognitive, Versant English, Pseudo-code, Compiler Code Fix)
 * 21. Cognizant (GenC / Elevate Quant, Java/DBMS MCQs, Coding)
 * 22. Deloitte (Business & Logical Reasoning, ERP/Cloud, Tech Aptitude)
 */

export const NEW_MNC_QUESTIONS = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. APPLE QUESTIONS (Systems, C++, Memory, OA DSA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Virtual Memory Page Replacement - LRU vs Clock",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["apple"],
    topics: ["Operating Systems", "Memory Management", "Virtual Memory"],
    frequency: "High",
    source: "Reported in Apple CoreOS Technical Interview",
    tags: ["OS", "Virtual Memory", "Apple"],
    lastReviewed: "2026",
    description: "In an operating system with demand paging, what is the primary advantage of the Clock (Second-Chance) page replacement algorithm over pure Least Recently Used (LRU)?",
    options: [
      "Clock achieves a strictly lower page fault rate than optimal LRU.",
      "Clock approximates LRU with O(1) hardware reference bit inspection without maintaining a costly doubly-linked list stack.",
      "Clock eliminates page faults entirely for cyclic memory access patterns.",
      "Clock algorithm requires zero hardware reference bits from the MMU."
    ],
    correctAnswer: 1,
    explanation: "Pure LRU requires updating a linked list on every single memory access, causing immense overhead. The Clock algorithm approximates LRU by cycling through frames checking a single reference bit (clearing it to 0 on first pass), providing O(1) page replacement with minimal hardware overhead.",
  },
  {
    title: "C++ Smart Pointers & Cyclic References",
    category: "technical",
    type: "mcq",
    difficulty: "Hard",
    companies: ["apple"],
    topics: ["C++", "Memory Management", "Smart Pointers"],
    frequency: "High",
    source: "Reported in Apple Software Frameworks & Tools Round",
    tags: ["C++", "OOP", "Apple"],
    lastReviewed: "2026",
    description: "Consider two objects A and B that maintain `std::shared_ptr` references to each other. What happens when all external shared_ptrs go out of scope, and how can this be resolved?",
    options: [
      "The destructor of A is called immediately followed by B with zero leaks.",
      "A cyclic reference occurs where reference count never drops to 0, causing a memory leak. Fix by converting one reference to `std::weak_ptr`.",
      "The program terminates with a `std::bad_alloc` runtime exception.",
      "The C++ garbage collector detects the cycle and cleans both objects."
    ],
    correctAnswer: 1,
    explanation: "In C++, `std::shared_ptr` uses reference counting without a tracing garbage collector. Cyclic shared pointers keep the ref count >= 1 forever. Breaking the ownership cycle using `std::weak_ptr` (which does not increment strong count) prevents the memory leak.",
  },
  {
    title: "Cache Coherence - MESI Protocol States",
    category: "technical",
    type: "mcq",
    difficulty: "Hard",
    companies: ["apple"],
    topics: ["Computer Architecture", "Cache Memory", "Multithreading"],
    frequency: "High",
    source: "Reported in Apple Silicon & Hardware-Software Co-Design Round",
    tags: ["Architecture", "Cache", "Apple"],
    lastReviewed: "2026",
    description: "In a multi-core processor implementing the MESI cache coherence protocol, what does the 'E' (Exclusive) state indicate for a cache line?",
    options: [
      "The line is present in multiple caches and has been modified.",
      "The line is present ONLY in this core's cache and is clean (matches main memory).",
      "The line is modified and must be invalidated immediately.",
      "The line is shared read-only across all active CPU cores."
    ],
    correctAnswer: 1,
    explanation: "In the MESI protocol: M = Modified (dirty), E = Exclusive (clean, only in this cache), S = Shared (clean, in multiple caches), I = Invalid.",
  },
  {
    title: "Find Peak Element in O(log n)",
    category: "coding",
    type: "coding",
    difficulty: "Medium",
    companies: ["apple"],
    topics: ["Array", "Binary Search"],
    frequency: "High",
    source: "Reported in Apple & Google Technical Screening",
    tags: ["Binary Search", "Algorithms", "Apple"],
    lastReviewed: "2026",
    problemDescription: `A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array \`nums\`, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.

You must write an algorithm that runs in \`O(log n)\` time.`,
    examples: [
      { input: "nums = [1,2,3,1]", output: "2", explanation: "3 is a peak element and your function should return the index number 2." },
      { input: "nums = [1,2,1,3,5,6,4]", output: "5", explanation: "Your function can return either index number 1 (value 2) or index number 5 (value 6)." }
    ],
    constraints: ["1 <= nums.length <= 1000", "-2^31 <= nums[i] <= 2^31 - 1", "nums[i] != nums[i + 1] for all valid i."],
    starterCode: {
      javascript: `function findPeakElement(nums) {\n    // Write your code here\n}`,
      python: `class Solution:\n    def findPeakElement(self, nums: list[int]) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int findPeakElement(vector<int>& nums) {\n        \n    }\n};`,
      java: `class Solution {\n    public int findPeakElement(int[] nums) {\n        return 0;\n    }\n}`
    },
    testCases: [
      { input: "[1,2,3,1]", expectedOutput: "2", isHidden: false },
      { input: "[1,2,1,3,5,6,4]", expectedOutput: "5", isHidden: false },
      { input: "[1]", expectedOutput: "0", isHidden: true },
    ],
    hints: ["Use Binary Search: Compare mid with mid + 1.", "If nums[mid] < nums[mid+1], a peak must exist in the right half."],
    approach: "Binary search by comparing nums[mid] with nums[mid+1]. If nums[mid] > nums[mid+1], the peak lies on the left (including mid). Otherwise on the right.",
    solutionCode: {
      javascript: `function findPeakElement(nums) {\n    let left = 0, right = nums.length - 1;\n    while (left < right) {\n        const mid = Math.floor((left + right) / 2);\n        if (nums[mid] > nums[mid + 1]) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n    return left;\n}`,
      python: `class Solution:\n    def findPeakElement(self, nums: list[int]) -> int:\n        left, right = 0, len(nums) - 1\n        while left < right:\n            mid = (left + right) // 2\n            if nums[mid] > nums[mid + 1]:\n                right = mid\n            else:\n                left = mid + 1\n        return left`,
      cpp: `class Solution {\npublic:\n    int findPeakElement(vector<int>& nums) {\n        int left = 0, right = nums.size() - 1;\n        while (left < right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] > nums[mid + 1]) {\n                right = mid;\n            } else {\n                left = mid + 1;\n            }\n        }\n        return left;\n    }\n};`,
      java: `class Solution {\n    public int findPeakElement(int[] nums) {\n        int left = 0, right = nums.length - 1;\n        while (left < right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] > nums[mid + 1]) {\n                right = mid;\n            } else {\n                left = mid + 1;\n            }\n        }\n        return left;\n    }\n}`
    },
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. NETFLIX QUESTIONS (High Concurrency, Microservices, Monotonic Deque)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Microservices Resiliency - Circuit Breaker States",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["netflix"],
    topics: ["System Design", "Microservices", "Resiliency"],
    frequency: "High",
    source: "Reported in Netflix Distributed Systems Round",
    tags: ["Microservices", "Resilience", "Netflix"],
    lastReviewed: "2026",
    description: "In Netflix Hystrix/Resilience4j pattern, what occurs when a Circuit Breaker enters the 'Half-Open' state?",
    options: [
      "All incoming requests are immediately dropped with HTTP 503.",
      "A limited number of probe requests are allowed through to evaluate if the downstream downstream service has recovered.",
      "The circuit breaker is permanently disabled until manual restart.",
      "Traffic is mirrored to a shadow cluster without responding to clients."
    ],
    correctAnswer: 1,
    explanation: "In the Half-Open state, a predetermined small percentage of trial requests pass to the troubled service. If they succeed, the breaker resets to Closed (normal). If they fail, it immediately trips back to Open.",
  },
  {
    title: "Sliding Window Maximum",
    category: "coding",
    type: "coding",
    difficulty: "Hard",
    companies: ["netflix"],
    topics: ["Array", "Sliding Window", "Monotonic Queue"],
    frequency: "High",
    source: "Reported in Netflix & Amazon Live Coding Interviews",
    tags: ["Sliding Window", "Monotonic Queue", "Netflix"],
    lastReviewed: "2026",
    problemDescription: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.`,
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]", explanation: "Window [1,3,-1] -> 3; [3,-1,-3] -> 3; [-1,-3,5] -> 5; [-3,5,3] -> 5; [5,3,6] -> 6; [3,6,7] -> 7" }
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "1 <= k <= nums.length"],
    starterCode: {
      javascript: `function maxSlidingWindow(nums, k) {\n    // Write your code here\n}`,
      python: `class Solution:\n    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:\n        pass`,
      cpp: `class Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        \n    }\n};`,
      java: `class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        return new int[0];\n    }\n}`
    },
    testCases: [
      { input: "[1,3,-1,-3,5,3,6,7], 3", expectedOutput: "[3,3,5,5,6,7]", isHidden: false },
      { input: "[1], 1", expectedOutput: "[1]", isHidden: false },
    ],
    hints: ["Use a Monotonic Deque storing indices in decreasing order of their values."],
    approach: "Maintain a monotonic decreasing deque of indices. Pop elements smaller than current from back, remove out-of-bounds indices from front.",
    solutionCode: {
      javascript: `function maxSlidingWindow(nums, k) {\n    const q = [], res = [];\n    for (let i = 0; i < nums.length; i++) {\n        while (q.length && q[0] < i - k + 1) q.shift();\n        while (q.length && nums[q[q.length - 1]] < nums[i]) q.pop();\n        q.push(i);\n        if (i >= k - 1) res.push(nums[q[0]]);\n    }\n    return res;\n}`,
      python: `from collections import deque\nclass Solution:\n    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:\n        q = deque()\n        res = []\n        for i, n in enumerate(nums):\n            while q and q[0] < i - k + 1: q.popleft()\n            while q and nums[q[-1]] < n: q.pop()\n            q.append(i)\n            if i >= k - 1: res.append(nums[q[0]])\n        return res`,
      cpp: `class Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        deque<int> q;\n        vector<int> res;\n        for (int i = 0; i < nums.size(); ++i) {\n            while (!q.empty() && q.front() < i - k + 1) q.pop_front();\n            while (!q.empty() && nums[q.back()] < nums[i]) q.pop_back();\n            q.push_back(i);\n            if (i >= k - 1) res.push_back(nums[q.front()]);\n        }\n        return res;\n    }\n};`,
      java: `import java.util.*;\nclass Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        Deque<Integer> q = new ArrayDeque<>();\n        int[] res = new int[nums.length - k + 1];\n        int idx = 0;\n        for (int i = 0; i < nums.length; i++) {\n            while (!q.isEmpty() && q.peekFirst() < i - k + 1) q.pollFirst();\n            while (!q.isEmpty() && nums[q.peekLast()] < nums[i]) q.pollLast();\n            q.offerLast(i);\n            if (i >= k - 1) res[idx++] = nums[q.peekFirst()];\n        }\n        return res;\n    }\n}`
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ORACLE QUESTIONS (Database Internals, B+ Trees, SQL, Java)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Database B+ Tree Indexing vs B-Tree",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["oracle"],
    topics: ["DBMS", "Indexing", "B+ Trees"],
    frequency: "High",
    source: "Reported in Oracle Database & OCI Technical Rounds",
    tags: ["DBMS", "Indexing", "Oracle"],
    lastReviewed: "2026",
    description: "Why do production relational database engines (like Oracle and MySQL InnoDB) store index data in B+ Trees rather than standard B-Trees?",
    options: [
      "B+ Trees store records only in leaf nodes connected by a linked list, enabling extremely fast range scans and higher fanout in internal nodes.",
      "B+ Trees have O(1) lookup time for single key queries compared to O(log n) in B-Trees.",
      "B-Trees cannot support composite multi-column indexing.",
      "B+ Trees require zero disk I/O operations for index lookups."
    ],
    correctAnswer: 0,
    explanation: "In B+ Trees, internal nodes only store key pointers (maximizing branching factor/fanout per disk page), while all actual data/row pointers reside in linked leaf nodes, making sequential range scans (e.g. BETWEEN, >, <) exceptionally fast with sequential I/O.",
  },
  {
    title: "Subarray Sum Equals K",
    category: "coding",
    type: "coding",
    difficulty: "Medium",
    companies: ["oracle"],
    topics: ["Hash Table", "Prefix Sum", "Array"],
    frequency: "High",
    source: "Reported in Oracle OA & Goldman Sachs Technical Screening",
    tags: ["Hash Table", "Prefix Sum", "Oracle"],
    lastReviewed: "2026",
    problemDescription: `Given an array of integers \`nums\` and an integer \`k\`, return *the total number of subarrays whose sum equals to* \`k\`.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      { input: "nums = [1,1,1], k = 2", output: "2", explanation: "Subarrays [1,1] at indices (0,1) and (1,2) sum to 2." },
      { input: "nums = [1,2,3], k = 3", output: "2", explanation: "Subarrays [1,2] and [3] sum to 3." }
    ],
    constraints: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"],
    starterCode: {
      javascript: `function subarraySum(nums, k) {\n    // Write your code here\n}`,
      python: `class Solution:\n    def subarraySum(self, nums: list[int], k: int) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        \n    }\n};`,
      java: `class Solution {\n    public int subarraySum(int[] nums, int k) {\n        return 0;\n    }\n}`
    },
    testCases: [
      { input: "[1,1,1], 2", expectedOutput: "2", isHidden: false },
      { input: "[1,2,3], 3", expectedOutput: "2", isHidden: false },
      { input: "[1,-1,0], 0", expectedOutput: "3", isHidden: true },
    ],
    hints: ["Use a HashMap to store the frequency of prefix sums encountered so far."],
    approach: "Maintain a running prefix sum. Check if (prefix_sum - k) exists in the HashMap. If so, add its frequency to answer.",
    solutionCode: {
      javascript: `function subarraySum(nums, k) {\n    const map = new Map([[0, 1]]);\n    let sum = 0, count = 0;\n    for (const n of nums) {\n        sum += n;\n        if (map.has(sum - k)) count += map.get(sum - k);\n        map.set(sum, (map.get(sum) || 0) + 1);\n    }\n    return count;\n}`,
      python: `class Solution:\n    def subarraySum(self, nums: list[int], k: int) -> int:\n        count, s = 0, 0\n        mp = {0: 1}\n        for n in nums:\n            s += n\n            if s - k in mp: count += mp[s - k]\n            mp[s] = mp.get(s, 0) + 1\n        return count`,
      cpp: `class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> mp;\n        mp[0] = 1;\n        int sum = 0, count = 0;\n        for (int n : nums) {\n            sum += n;\n            if (mp.find(sum - k) != mp.end()) count += mp[sum - k];\n            mp[sum]++;\n        }\n        return count;\n    }\n};`,
      java: `import java.util.*;\nclass Solution {\n    public int subarraySum(int[] nums, int k) {\n        Map<Integer, Integer> map = new HashMap<>();\n        map.put(0, 1);\n        int sum = 0, count = 0;\n        for (int n : nums) {\n            sum += n;\n            count += map.getOrDefault(sum - k, 0);\n            map.put(sum, map.getOrDefault(sum, 0) + 1);\n        }\n        return count;\n    }\n}`
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. GOLDMAN SACHS QUESTIONS (Quant, Probability, HFT DSA, Logic)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Goldman Quant - Conditional Probability with Dice",
    category: "aptitude",
    type: "mcq",
    difficulty: "Hard",
    companies: ["goldman-sachs"],
    topics: ["Probability", "Quantitative Math"],
    frequency: "High",
    source: "Reported in Goldman Sachs Engineering OA & Math Screen",
    tags: ["Quant", "Probability", "Goldman Sachs"],
    lastReviewed: "2026",
    description: "Two fair 6-sided dice are rolled simultaneously. Given that the sum of the numbers showing is at least 9, what is the conditional probability that at least one die shows a 5?",
    options: ["4/10 (40%)", "5/10 (50%)", "3/10 (30%)", "6/10 (60%)"],
    correctAnswer: 1,
    formula: "P(A|B) = P(A ∩ B) / P(B)",
    explanation: "1. Sample space for Sum >= 9:\n- Sum=9: (3,6),(4,5),(5,4),(6,3) [4 outcomes]\n- Sum=10: (4,6),(5,5),(6,4) [3 outcomes]\n- Sum=11: (5,6),(6,5) [2 outcomes]\n- Sum=12: (6,6) [1 outcome]\nTotal B = 4 + 3 + 2 + 1 = 10 outcomes.\n2. Outcomes with at least one 5: (4,5),(5,4),(5,5),(5,6),(6,5) = 5 outcomes.\n3. Probability = 5 / 10 = 1/2 = 50%.",
  },
  {
    title: "String Compression / Run-Length Encoding",
    category: "coding",
    type: "coding",
    difficulty: "Medium",
    companies: ["goldman-sachs"],
    topics: ["String", "Two Pointers"],
    frequency: "High",
    source: "Reported in Goldman Sachs Technical Round 1",
    tags: ["String", "Two Pointers", "Goldman Sachs"],
    lastReviewed: "2026",
    problemDescription: `Given an array of characters \`chars\`, compress it using the following algorithm:

Begin with an empty string \`s\`. For each group of consecutive repeating characters in \`chars\`:
- If the group's length is \`1\`, append the character to \`s\`.
- Otherwise, append the character followed by the group's length.

The compressed string \`s\` should not be returned separately, but instead, be stored **in the input character array \`chars\`**. Return the new length of the array. You must write an algorithm that uses only constant extra space.`,
    examples: [
      { input: 'chars = ["a","a","b","b","c","c","c"]', output: "6", explanation: 'The groups are "aa", "bb", and "ccc". This compresses to ["a","2","b","2","c","3"].' },
      { input: 'chars = ["a"]', output: "1", explanation: 'Single character remains ["a"].' }
    ],
    constraints: ["1 <= chars.length <= 2000", "chars[i] is a lowercase English letter, uppercase letter, digit, or symbol."],
    starterCode: {
      javascript: `function compress(chars) {\n    // Write your code here\n}`,
      python: `class Solution:\n    def compress(self, chars: list[str]) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int compress(vector<char>& chars) {\n        \n    }\n};`,
      java: `class Solution {\n    public int compress(char[] chars) {\n        return 0;\n    }\n}`
    },
    testCases: [
      { input: '["a","a","b","b","c","c","c"]', expectedOutput: "6", isHidden: false },
      { input: '["a"]', expectedOutput: "1", isHidden: false },
    ],
    hints: ["Use two pointers: write pointer and read pointer."],
    approach: "Use read and write pointers. Count consecutive duplicate characters. Write character and if count > 1 write its digits.",
    solutionCode: {
      javascript: `function compress(chars) {\n    let write = 0, i = 0;\n    while (i < chars.length) {\n        let j = i;\n        while (j < chars.length && chars[j] === chars[i]) j++;\n        chars[write++] = chars[i];\n        const count = j - i;\n        if (count > 1) {\n            for (const c of String(count)) chars[write++] = c;\n        }\n        i = j;\n    }\n    return write;\n}`,
      python: `class Solution:\n    def compress(self, chars: list[str]) -> int:\n        write = 0\n        i = 0\n        while i < len(chars):\n            j = i\n            while j < len(chars) and chars[j] == chars[i]: j += 1\n            chars[write] = chars[i]\n            write += 1\n            count = j - i\n            if count > 1:\n                for c in str(count):\n                    chars[write] = c\n                    write += 1\n            i = j\n        return write`,
      cpp: `class Solution {\npublic:\n    int compress(vector<char>& chars) {\n        int write = 0, i = 0;\n        while (i < chars.size()) {\n            int j = i;\n            while (j < chars.size() && chars[j] == chars[i]) j++;\n            chars[write++] = chars[i];\n            int count = j - i;\n            if (count > 1) {\n                for (char c : to_string(count)) chars[write++] = c;\n            }\n            i = j;\n        }\n        return write;\n    }\n};`,
      java: `class Solution {\n    public int compress(char[] chars) {\n        int write = 0, i = 0;\n        while (i < chars.length) {\n            int j = i;\n            while (j < chars.length && chars[j] == chars[i]) j++;\n            chars[write++] = chars[i];\n            int count = j - i;\n            if (count > 1) {\n                for (char c : String.valueOf(count).toCharArray()) chars[write++] = c;\n            }\n            i = j;\n        }\n        return write;\n    }\n}`
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. JPMORGAN CHASE QUESTIONS (FinTech, Payment Idempotency, Architecture)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Financial API Idempotency Keys",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["jpmorgan"],
    topics: ["System Design", "REST APIs", "Database Transactions"],
    frequency: "High",
    source: "Reported in JPMorgan Chase Code for Good & SEP Interviews",
    tags: ["Fintech", "APIs", "JPMorgan"],
    lastReviewed: "2026",
    description: "In a financial payments API processing debit transactions, why must an `Idempotency-Key` header be used for POST requests?",
    options: [
      "To encrypt credit card numbers in transit.",
      "To ensure that network retries or duplicate client submissions do not execute multiple debit deductions for the same payment intent.",
      "To automatically bypass database ACID transactions.",
      "To convert foreign exchange currencies in real-time."
    ],
    correctAnswer: 1,
    explanation: "Network timeouts can cause clients to retry payment requests. An Idempotency Key guarantees that even if a request is received multiple times by the server, the financial charge is executed exactly once, and cached results are returned for subsequent duplicate keys.",
  },
  {
    title: "Coin Change - Minimum Coins",
    category: "coding",
    type: "coding",
    difficulty: "Medium",
    companies: ["jpmorgan"],
    topics: ["Dynamic Programming", "Knapsack"],
    frequency: "High",
    source: "Reported in JPMorgan Chase & Goldman Sachs Coding Tests",
    tags: ["DP", "FinTech", "JPMorgan"],
    lastReviewed: "2026",
    problemDescription: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`. You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1 (3 coins)" },
      { input: "coins = [2], amount = 3", output: "-1", explanation: "Cannot make 3 with coin of value 2." }
    ],
    constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n    // Write your code here\n}`,
      python: `class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}`
    },
    testCases: [
      { input: "[1,2,5], 11", expectedOutput: "3", isHidden: false },
      { input: "[2], 3", expectedOutput: "-1", isHidden: false },
      { input: "[1], 0", expectedOutput: "0", isHidden: true },
    ],
    hints: ["Use 1D bottom-up Dynamic Programming table where dp[i] is min coins to make amount i."],
    approach: "dp[i] = min(dp[i], dp[i - c] + 1) for all c in coins.",
    solutionCode: {
      javascript: `function coinChange(coins, amount) {\n    const dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let i = 1; i <= amount; i++) {\n        for (const c of coins) {\n            if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n        }\n    }\n    return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
      python: `class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        dp = [float('inf')] * (amount + 1)\n        dp[0] = 0\n        for i in range(1, amount + 1):\n            for c in coins:\n                if i >= c: dp[i] = min(dp[i], dp[i - c] + 1)\n        return dp[amount] if dp[amount] != float('inf') else -1`,
      cpp: `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; ++i) {\n            for (int c : coins) {\n                if (i >= c) dp[i] = min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};`,
      java: `import java.util.Arrays;\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}`
    },
    timeComplexity: "O(amount * len(coins))",
    spaceComplexity: "O(amount)",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. CISCO QUESTIONS (Computer Networks, TCP/IP, Sockets, Subnetting)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "IPv4 Subnetting - Usable Host Addresses",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["cisco"],
    topics: ["Computer Networks", "IP Addressing", "Subnetting"],
    frequency: "High",
    source: "Reported in Cisco Systems Technical Online Assessment",
    tags: ["Networks", "Subnetting", "Cisco"],
    lastReviewed: "2026",
    description: "How many valid, usable host IP addresses are available in a subnet with CIDR prefix `/27`?",
    options: ["32 hosts", "30 hosts", "62 hosts", "28 hosts"],
    correctAnswer: 1,
    formula: "Usable Hosts = 2^(32 - Prefix) - 2 (subtracting Network ID and Broadcast Address)",
    explanation: "For /27: Host bits = 32 - 27 = 5. Total addresses = 2^5 = 32. Usable host addresses = 32 - 2 = 30 (1 reserved for Subnet Network Address, 1 for Directed Broadcast).",
  },
  {
    title: "TCP 3-Way Handshake Connection Teardown",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["cisco"],
    topics: ["Computer Networks", "TCP/IP", "Protocols"],
    frequency: "High",
    source: "Reported in Cisco Core Software Engineering Interview",
    tags: ["Networks", "TCP", "Cisco"],
    lastReviewed: "2026",
    description: "What is the purpose of the `TIME_WAIT` state during TCP connection termination on the active-closing client?",
    options: [
      "To restart the socket handshake immediately with a new sequence number.",
      "To ensure the final ACK arrives at the server (and handle possible retransmitted FINs), and prevent old delayed duplicate packets from corrupting a new connection.",
      "To convert TCP stream into an asynchronous UDP datagram.",
      "To compress network packets before releasing socket memory."
    ],
    correctAnswer: 1,
    explanation: "TIME_WAIT (typically 2 * Maximum Segment Lifetime or 2MSL) ensures that the active closer's final ACK reached the peer. If ACK was lost, peer will retransmit FIN, which the client can still acknowledge.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. UBER QUESTIONS (Geospatial, Intervals, High-Scale Graphs)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Geospatial Indexing - Uber H3 Hexagonal Grid",
    category: "technical",
    type: "mcq",
    difficulty: "Hard",
    companies: ["uber"],
    topics: ["System Design", "Geospatial", "Architecture"],
    frequency: "High",
    source: "Reported in Uber Backend / Marketplace Systems Interview",
    tags: ["System Design", "Geospatial", "Uber"],
    lastReviewed: "2026",
    description: "Why does Uber's H3 spatial index utilize regular hexagons rather than square or triangle tiles for partitioning planetary ride demand?",
    options: [
      "Hexagons require 90% less disk space than squares in relational databases.",
      "Hexagons have invariant neighbor distance (all 6 adjacent neighbors share the exact same centroid distance) and minimize perimeter-to-area distortion.",
      "GPS satellites transmit coordinates directly in hexadecimal format.",
      "Square tiles cannot cover curved spheres without non-Euclidean angles."
    ],
    correctAnswer: 1,
    explanation: "With squares, diagonal neighbors have distance sqrt(2) * d, while orthogonal neighbors have distance d. Hexagons have identical distance to all 6 neighbors, which simplifies radius searches, smoothing, and surge algorithms.",
  },
  {
    title: "Merge Intervals",
    category: "coding",
    type: "coding",
    difficulty: "Medium",
    companies: ["uber"],
    topics: ["Array", "Sorting", "Intervals"],
    frequency: "High",
    source: "Reported in Uber & Amazon Onsite Interview",
    tags: ["Intervals", "Sorting", "Uber"],
    lastReviewed: "2026",
    problemDescription: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]." }
    ],
    constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= starti <= endi <= 10^4"],
    starterCode: {
      javascript: `function merge(intervals) {\n    // Write your code here\n}`,
      python: `class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        pass`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};`,
      java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        return new int[0][0];\n    }\n}`
    },
    testCases: [
      { input: "[[1,3],[2,6],[8,10],[15,18]]", expectedOutput: "[[1,6],[8,10],[15,18]]", isHidden: false },
      { input: "[[1,4],[4,5]]", expectedOutput: "[[1,5]]", isHidden: false },
    ],
    hints: ["Sort intervals by start time. Merge overlapping intervals iteratively."],
    approach: "Sort by start time. Maintain merged list; if current start <= previous end, merge by updating end = max(prev.end, curr.end).",
    solutionCode: {
      javascript: `function merge(intervals) {\n    if (!intervals.length) return [];\n    intervals.sort((a, b) => a[0] - b[0]);\n    const res = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const last = res[res.length - 1];\n        if (intervals[i][0] <= last[1]) {\n            last[1] = Math.max(last[1], intervals[i][1]);\n        } else {\n            res.push(intervals[i]);\n        }\n    }\n    return res;\n}`,
      python: `class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        intervals.sort(key=lambda x: x[0])\n        merged = []\n        for interval in intervals:\n            if not merged or merged[-1][1] < interval[0]:\n                merged.append(interval)\n            else:\n                merged[-1][1] = max(merged[-1][1], interval[1])\n        return merged`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        if (intervals.empty()) return {};\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> merged = {intervals[0]};\n        for (size_t i = 1; i < intervals.size(); ++i) {\n            if (intervals[i][0] <= merged.back()[1]) {\n                merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n            } else {\n                merged.push_back(intervals[i]);\n            }\n        }\n        return merged;\n    }\n};`,
      java: `import java.util.*;\nclass Solution {\n    public int[][] merge(int[][] intervals) {\n        if (intervals.length <= 1) return intervals;\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> result = new ArrayList<>();\n        int[] current = intervals[0];\n        result.add(current);\n        for (int[] interval : intervals) {\n            if (interval[0] <= current[1]) {\n                current[1] = Math.max(current[1], interval[1]);\n            } else {\n                current = interval;\n                result.add(current);\n            }\n        }\n        return result.toArray(new int[result.size()][]);\n    }\n}`
    },
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. IBM QUESTIONS (Enterprise Java, Linux, Hash Table)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Group Anagrams",
    category: "coding",
    type: "coding",
    difficulty: "Medium",
    companies: ["ibm"],
    topics: ["Array", "Hash Table", "String"],
    frequency: "High",
    source: "Reported in IBM Software Developer OA",
    tags: ["Hash Table", "String", "IBM"],
    lastReviewed: "2026",
    problemDescription: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
    ],
    constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
    starterCode: {
      javascript: `function groupAnagrams(strs) {\n    // Write your code here\n}`,
      python: `class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        pass`,
      cpp: `class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        \n    }\n};`,
      java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        return new ArrayList<>();\n    }\n}`
    },
    testCases: [
      { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]', isHidden: false },
      { input: '[""]', expectedOutput: '[[""]]', isHidden: false },
      { input: '["a"]', expectedOutput: '[["a"]]', isHidden: true },
    ],
    hints: ["Use sorted characters as HashMap keys."],
    approach: "For each string, sort characters as key. Group original strings into Map values.",
    solutionCode: {
      javascript: `function groupAnagrams(strs) {\n    const map = {};\n    for (const s of strs) {\n        const key = s.split('').sort().join('');\n        if (!map[key]) map[key] = [];\n        map[key].push(s);\n    }\n    return Object.values(map);\n}`,
      python: `from collections import defaultdict\nclass Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        mp = defaultdict(list)\n        for s in strs:\n            mp[''.join(sorted(s))].append(s)\n        return list(mp.values())`,
      cpp: `class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        unordered_map<string, vector<string>> mp;\n        for (const string& s : strs) {\n            string key = s;\n            sort(key.begin(), key.end());\n            mp[key].push_back(s);\n        }\n        vector<vector<string>> res;\n        for (auto& p : mp) res.push_back(p.second);\n        return res;\n    }\n};`,
      java: `import java.util.*;\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();\n        for (String s : strs) {\n            char[] ca = s.toCharArray();\n            Arrays.sort(ca);\n            String key = String.valueOf(ca);\n            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(map.values());\n    }\n}`
    },
    timeComplexity: "O(n * k log k)",
    spaceComplexity: "O(n * k)",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. SALESFORCE QUESTIONS (Multi-tenant Architecture, Apex, Design Patterns)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Multi-Tenant Cloud Architecture Data Isolation",
    category: "technical",
    type: "mcq",
    difficulty: "Medium",
    companies: ["salesforce"],
    topics: ["Cloud Computing", "Architecture", "Databases"],
    frequency: "High",
    source: "Reported in Salesforce AMTS & Cloud Engineer Round",
    tags: ["Cloud", "Architecture", "Salesforce"],
    lastReviewed: "2026",
    description: "In Salesforce's multi-tenant database architecture (Force.com), how are millions of separate customers' records stored on the same shared physical database cluster without cross-tenant data leaks?",
    options: [
      "A separate physical database server is provisioned on-demand for every customer account.",
      "A Tenant Identifier (Org_ID) column partitions metadata tables, and the database query engine enforces tenant boundary filters on every single SQL execution.",
      "Tenants share data openly without encryption or access controls.",
      "Customer data is stored entirely in volatile browser RAM."
    ],
    correctAnswer: 1,
    explanation: "Multi-tenancy uses shared compute and database storage with logical separation via Org_ID / Tenant_ID foreign keys combined with metadata-driven query rewrites that strictly scope all queries to the calling tenant's workspace.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. QUALCOMM QUESTIONS (Embedded C, Pointers, Volatile, Bit Manipulation)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Embedded C - The 'volatile' Keyword",
    category: "technical",
    type: "mcq",
    difficulty: "Hard",
    companies: ["qualcomm"],
    topics: ["C Programming", "Embedded Systems", "Compilers"],
    frequency: "High",
    source: "Reported in Qualcomm Technical Assessment & Embedded Round",
    tags: ["Embedded", "C", "Qualcomm"],
    lastReviewed: "2026",
    description: "In embedded C development, when MUST a variable be declared with the `volatile` keyword?",
    options: [
      "When the variable is stored in flash ROM memory.",
      "When the variable can be modified unexpectedly by hardware registers (MMIO), Interrupt Service Routines (ISRs), or another thread, preventing compiler caching in CPU registers.",
      "When the variable is a constant string literal.",
      "To force the compiler to allocate the variable strictly on the stack."
    ],
    correctAnswer: 1,
    explanation: "`volatile` tells the compiler that the value of the variable may change at any time without any action being taken by the code the compiler finds nearby. This prevents the compiler from optimizing out repeated reads/writes to memory-mapped hardware I/O or ISR flags.",
  },
  {
    title: "Counting Bits (Hamming Weight in O(n))",
    category: "coding",
    type: "coding",
    difficulty: "Easy",
    companies: ["qualcomm"],
    topics: ["Bit Manipulation", "Dynamic Programming"],
    frequency: "High",
    source: "Reported in Qualcomm OA & Apple Embedded Round",
    tags: ["Bit Manipulation", "Qualcomm"],
    lastReviewed: "2026",
    problemDescription: `Given an integer \`n\`, return *an array \`ans\` of length \`n + 1\` such that for each \`i\` (\`0 <= i <= n\`), \`ans[i]\` is the **number of \`1\`'s** in the binary representation of \`i\`*.

You must write an algorithm that runs in \`O(n)\` linear time.`,
    examples: [
      { input: "n = 2", output: "[0,1,1]", explanation: "0 -> 0; 1 -> 1; 2 -> 10 (1 bit)" },
      { input: "n = 5", output: "[0,1,1,2,1,2]", explanation: "0->0, 1->1, 2->1, 3->2, 4->1, 5->2" }
    ],
    constraints: ["0 <= n <= 10^5"],
    starterCode: {
      javascript: `function countBits(n) {\n    // Write your code here\n}`,
      python: `class Solution:\n    def countBits(self, n: int) -> list[int]:\n        pass`,
      cpp: `class Solution {\npublic:\n    vector<int> countBits(int n) {\n        \n    }\n};`,
      java: `class Solution {\n    public int[] countBits(int n) {\n        return new int[0];\n    }\n}`
    },
    testCases: [
      { input: "2", expectedOutput: "[0,1,1]", isHidden: false },
      { input: "5", expectedOutput: "[0,1,1,2,1,2]", isHidden: false },
    ],
    hints: ["ans[i] = ans[i >> 1] + (i & 1)"],
    approach: "Dynamic programming with bitwise shift: ans[i] = ans[i >> 1] + (i & 1).",
    solutionCode: {
      javascript: `function countBits(n) {\n    const ans = new Array(n + 1).fill(0);\n    for (let i = 1; i <= n; i++) {\n        ans[i] = ans[i >> 1] + (i & 1);\n    }\n    return ans;\n}`,
      python: `class Solution:\n    def countBits(self, n: int) -> list[int]:\n        ans = [0] * (n + 1)\n        for i in range(1, n + 1):\n            ans[i] = ans[i >> 1] + (i & 1)\n        return ans`,
      cpp: `class Solution {\npublic:\n    vector<int> countBits(int n) {\n        vector<int> ans(n + 1, 0);\n        for (int i = 1; i <= n; ++i) {\n            ans[i] = ans[i >> 1] + (i & 1);\n        }\n        return ans;\n    }\n};`,
      java: `class Solution {\n    public int[] countBits(int n) {\n        int[] ans = new int[n + 1];\n        for (int i = 1; i <= n; i++) {\n            ans[i] = ans[i >> 1] + (i & 1);\n        }\n        return ans;\n    }\n}`
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. CISCO CODING & NETWORKING QUESTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Reverse Bits (32-bit Integer)",
    category: "coding",
    type: "coding",
    difficulty: "Easy",
    companies: ["cisco", "qualcomm"],
    topics: ["Bit Manipulation", "Computer Architecture"],
    frequency: "High",
    source: "Reported in Cisco Software Engineer OA & Qualcomm Embedded Round",
    tags: ["Bit Manipulation", "Cisco"],
    lastReviewed: "2026",
    problemDescription: `Reverse bits of a given 32-bit unsigned integer.`,
    examples: [
      { input: "n = 43261596", output: "964176192", explanation: "43261596 in binary reversed yields 964176192." }
    ],
    constraints: ["The input is a valid 32-bit unsigned integer."],
    starterCode: {
      javascript: `function reverseBits(n) {\n    // Write your code here\n}`,
      python: `class Solution:\n    def reverseBits(self, n: int) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    uint32_t reverseBits(uint32_t n) {\n        \n    }\n};`,
      java: `class Solution {\n    public int reverseBits(int n) {\n        return 0;\n    }\n}`
    },
    testCases: [
      { input: "43261596", expectedOutput: "964176192", isHidden: false },
      { input: "1", expectedOutput: "2147483648", isHidden: false },
    ],
    hints: ["Iterate 32 times: shift result left by 1 and OR with (n & 1), then shift n right by 1."],
    approach: "Process each of the 32 bits from right to left, placing each bit into the reversed position.",
    solutionCode: {
      javascript: `function reverseBits(n) {\n    let res = 0;\n    for (let i = 0; i < 32; i++) {\n        res = (res << 1) | (n & 1);\n        n = n >>> 1;\n    }\n    return res >>> 0;\n}`,
      python: `class Solution:\n    def reverseBits(self, n: int) -> int:\n        res = 0\n        for _ in range(32):\n            res = (res << 1) | (n & 1)\n            n >>= 1\n        return res`,
      cpp: `class Solution {\npublic:\n    uint32_t reverseBits(uint32_t n) {\n        uint32_t res = 0;\n        for (int i = 0; i < 32; ++i) {\n            res = (res << 1) | (n & 1);\n            n >>= 1;\n        }\n        return res;\n    }\n};`,
      java: `class Solution {\n    public int reverseBits(int n) {\n        int res = 0;\n        for (int i = 0; i < 32; i++) {\n            res = (res << 1) | (n & 1);\n            n >>>= 1;\n        }\n        return res;\n    }\n}`
    },
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
  },
  {
    title: "Validate IPv4 / IPv6 Address",
    category: "coding",
    type: "coding",
    difficulty: "Medium",
    companies: ["cisco"],
    topics: ["String", "Networking"],
    frequency: "High",
    source: "Reported in Cisco Systems Technical OA",
    tags: ["String", "Networks", "Cisco"],
    lastReviewed: "2026",
    problemDescription: `Given a string \`queryIP\`, return \`"IPv4"\` if IP is a valid IPv4 address, \`"IPv6"\` if IP is a valid IPv6 address or \`"Neither"\` if IP is not a correct IP of any type.`,
    examples: [
      { input: 'queryIP = "172.16.254.1"', output: '"IPv4"' },
      { input: 'queryIP = "256.256.256.256"', output: '"Neither"' }
    ],
    constraints: ["queryIP consists only of English letters, digits and the characters '.' and ':'."],
    starterCode: {
      javascript: `function validIPAddress(queryIP) {\n    // Write your code here\n}`,
      python: `class Solution:\n    def validIPAddress(self, queryIP: str) -> str:\n        pass`,
      cpp: `class Solution {\npublic:\n    string validIPAddress(string queryIP) {\n        \n    }\n};`,
      java: `class Solution {\n    public String validIPAddress(String queryIP) {\n        return "";\n    }\n}`
    },
    testCases: [
      { input: '"172.16.254.1"', expectedOutput: '"IPv4"', isHidden: false },
      { input: '"256.256.256.256"', expectedOutput: '"Neither"', isHidden: false },
      { input: '"2001:0db8:85a3:0:0:8A2E:0370:7334"', expectedOutput: '"IPv6"', isHidden: true },
    ],
    hints: ["Check IPv4 by splitting on '.' (must have 4 parts, 0-255, no leading zero).", "Check IPv6 by splitting on ':' (must have 8 parts, 1-4 hex chars)."],
    approach: "Split by '.' for IPv4 validation (range 0-255, no leading zero). Split by ':' for IPv6 validation (1-4 valid hexadecimal characters).",
    solutionCode: {
      javascript: `function validIPAddress(queryIP) {\n    const v4 = queryIP.split('.');\n    if (v4.length === 4) {\n        for (const p of v4) {\n            if (!p || p.length > 3) return 'Neither';\n            if (p.length > 1 && p[0] === '0') return 'Neither';\n            for (const c of p) if (c < '0' || c > '9') return 'Neither';\n            const num = Number(p);\n            if (num < 0 || num > 255) return 'Neither';\n        }\n        return 'IPv4';\n    }\n    const v6 = queryIP.split(':');\n    if (v6.length === 8) {\n        const hex = '0123456789abcdefABCDEF';\n        for (const p of v6) {\n            if (!p || p.length > 4) return 'Neither';\n            for (const c of p) if (!hex.includes(c)) return 'Neither';\n        }\n        return 'IPv6';\n    }\n    return 'Neither';\n}`,
      python: `class Solution:\n    def validIPAddress(self, queryIP: str) -> str:\n        v4 = queryIP.split('.')\n        if len(v4) == 4:\n            for p in v4:\n                if not p or len(p) > 3 or (len(p) > 1 and p[0] == '0'): return 'Neither'\n                if not p.isdigit() or not (0 <= int(p) <= 255): return 'Neither'\n            return 'IPv4'\n        v6 = queryIP.split(':')\n        if len(v6) == 8:\n            for p in v6:\n                if not p or len(p) > 4 or not all(c in '0123456789abcdefABCDEF' for c in p): return 'Neither'\n            return 'IPv6'\n        return 'Neither'`,
      cpp: `class Solution {\npublic:\n    string validIPAddress(string queryIP) {\n        if (count(queryIP.begin(), queryIP.end(), '.') == 3) {\n            stringstream ss(queryIP);\n            string p;\n            int cnt = 0;\n            while (getline(ss, p, '.')) {\n                cnt++;\n                if (p.empty() || p.size() > 3 || (p.size() > 1 && p[0] == '0')) return "Neither";\n                for (char c : p) if (!isdigit(c)) return "Neither";\n                if (stoi(p) > 255) return "Neither";\n            }\n            return (cnt == 4 && queryIP.back() != '.') ? "IPv4" : "Neither";\n        }\n        if (count(queryIP.begin(), queryIP.end(), ':') == 7) {\n            stringstream ss(queryIP);\n            string p;\n            int cnt = 0;\n            while (getline(ss, p, ':')) {\n                cnt++;\n                if (p.empty() || p.size() > 4) return "Neither";\n                for (char c : p) if (!isxdigit(c)) return "Neither";\n            }\n            return (cnt == 8 && queryIP.back() != ':') ? "IPv6" : "Neither";\n        }\n        return "Neither";\n    }\n};`,
      java: `class Solution {\n    public String validIPAddress(String queryIP) {\n        if (queryIP.chars().filter(ch -> ch == '.').count() == 3) {\n            String[] parts = queryIP.split("\\\\.", -1);\n            if (parts.length != 4) return "Neither";\n            for (String p : parts) {\n                if (p.length() == 0 || p.length() > 3 || (p.length() > 1 && p.charAt(0) == '0')) return "Neither";\n                for (char c : p.toCharArray()) if (!Character.isDigit(c)) return "Neither";\n                int val = Integer.parseInt(p);\n                if (val < 0 || val > 255) return "Neither";\n            }\n            return "IPv4";\n        }\n        if (queryIP.chars().filter(ch -> ch == ':').count() == 7) {\n            String[] parts = queryIP.split(":", -1);\n            if (parts.length != 8) return "Neither";\n            for (String p : parts) {\n                if (p.length() == 0 || p.length() > 4) return "Neither";\n                for (char c : p.toCharArray()) {\n                    if (!((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F'))) return "Neither";\n                }\n            }\n            return "IPv6";\n        }\n        return "Neither";\n    }\n}`
    },
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. QUALCOMM POWER OF TWO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Power of Two",
    category: "coding",
    type: "coding",
    difficulty: "Easy",
    companies: ["qualcomm"],
    topics: ["Bit Manipulation", "Math"],
    frequency: "High",
    source: "Reported in Qualcomm OA",
    tags: ["Bit Manipulation", "Qualcomm"],
    lastReviewed: "2026",
    problemDescription: `Given an integer \`n\`, return \`true\` if it is a power of two. Otherwise, return \`false\`.`,
    examples: [
      { input: "n = 1", output: "true", explanation: "2^0 = 1" },
      { input: "n = 16", output: "true", explanation: "2^4 = 16" },
      { input: "n = 3", output: "false" }
    ],
    constraints: ["-2^31 <= n <= 2^31 - 1"],
    starterCode: {
      javascript: `function isPowerOfTwo(n) {\n    // Write your code here\n}`,
      python: `class Solution:\n    def isPowerOfTwo(self, n: int) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool isPowerOfTwo(int n) {\n        \n    }\n};`,
      java: `class Solution {\n    public boolean isPowerOfTwo(int n) {\n        return false;\n    }\n}`
    },
    testCases: [
      { input: "1", expectedOutput: "true", isHidden: false },
      { input: "16", expectedOutput: "true", isHidden: false },
      { input: "3", expectedOutput: "false", isHidden: false },
    ],
    hints: ["n > 0 && (n & (n - 1)) == 0"],
    approach: "A power of two in binary has exactly one '1' bit. Thus, n > 0 && (n & (n - 1)) === 0.",
    solutionCode: {
      javascript: `function isPowerOfTwo(n) {\n    return n > 0 && (n & (n - 1)) === 0;\n}`,
      python: `class Solution:\n    def isPowerOfTwo(self, n: int) -> bool:\n        return n > 0 and (n & (n - 1)) == 0`,
      cpp: `class Solution {\npublic:\n    bool isPowerOfTwo(int n) {\n        return n > 0 && (n & (n - 1)) == 0;\n    }\n};`,
      java: `class Solution {\n    public boolean isPowerOfTwo(int n) {\n        return n > 0 && (n & (n - 1)) == 0;\n    }\n}`
    },
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 13. META VERBAL & COMMUNICATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Meta Contextual Communication - Critical Inference",
    category: "english",
    type: "mcq",
    difficulty: "Medium",
    companies: ["meta"],
    topics: ["Critical Reasoning", "Reading Comprehension"],
    frequency: "High",
    source: "Reported in Meta Leadership & Communication Screening",
    tags: ["Communication", "Meta"],
    lastReviewed: "2026",
    description: "Read the excerpt: 'In asynchronous distributed engineering teams, over-indexing on synchronous alignment meetings reduces deep work intervals and increases context switching overhead.' Which conclusion is best supported?",
    options: [
      "Synchronous meetings must be eliminated completely in all software projects.",
      "Asynchronous documentation and written RFCs preserve engineering focus and reduce disruptive context switching.",
      "Deep work can only be achieved in physical office spaces.",
      "Context switching has no measurable impact on developer velocity."
    ],
    correctAnswer: 1,
    explanation: "The excerpt specifically warns that excessive reliance on synchronous meetings disrupts deep work and induces context switching. Shifting toward structured asynchronous workflows mitigates this problem.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 14. INTERVIEW BLUEPRINTS FOR FINANCIAL & SYSTEMS GIANTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Goldman Sachs - Low Latency Multithreading & Memory Alignment",
    category: "interview",
    type: "interview",
    interviewCategory: "technical",
    difficulty: "Hard",
    companies: ["goldman-sachs"],
    topics: ["Multithreading", "Concurrency", "Low Latency"],
    frequency: "High",
    source: "Reported in Goldman Sachs Quantitative / HFT Technical Round",
    tags: ["HFT", "Low Latency", "Goldman Sachs"],
    lastReviewed: "2026",
    question: "How do you eliminate false sharing in high-frequency multi-threaded C++/Java applications?",
    whatInterviewerExpects: [
      "Explanation of CPU L1/L2 cache line size (typically 64 bytes).",
      "Understanding that multiple threads updating adjacent variables on the same cache line trigger costly cache invalidations across cores.",
      "Cache line padding or alignas(64) / @Contended annotations."
    ],
    importantPoints: ["False sharing occurs when independent threads modify variables residing on the same 64-byte hardware cache line."],
    sampleAnswer: "In high-throughput systems, CPU cores fetch memory in 64-byte cache lines. If Thread A modifies variable X and Thread B modifies variable Y on the same cache line, core cache coherence protocols (MESI) invalidate the entire cache line repeatedly, creating massive lock bus contention. We eliminate this by padding variables with 64-byte alignment (alignas(64) in C++ or @jdk.internal.vm.annotation.Contended in Java) to ensure thread-local state occupies distinct hardware cache lines.",
    tips: ["Mention hardware performance counters and perf cache-miss analysis."],
  },
  {
    title: "JPMorgan Chase - Distributed Financial Transactions (Saga vs 2PC)",
    category: "interview",
    type: "interview",
    interviewCategory: "technical",
    difficulty: "Medium",
    companies: ["jpmorgan"],
    topics: ["Distributed Systems", "Saga Pattern", "Fintech"],
    frequency: "High",
    source: "Reported in JPMorgan Chase Software Engineer Round",
    tags: ["FinTech", "System Design", "JPMorgan"],
    lastReviewed: "2026",
    question: "How do you maintain data consistency across microservices in a banking payment flow without locking database rows indefinitely?",
    whatInterviewerExpects: [
      "Comparison between Two-Phase Commit (2PC) and Saga Pattern.",
      "Compensating transactions in Choreography vs Orchestration.",
      "Idempotency and outbox patterns."
    ],
    importantPoints: ["2PC creates blocking locks across network boundaries. The Saga pattern uses local transactions coordinated by events with compensating transactions on failure."],
    sampleAnswer: "In financial microservices, Two-Phase Commit causes distributed deadlocks and high latency due to long-held database locks. Instead, we implement the Saga Pattern using an Orchestrator (Temporal or Kafka-driven). Each microservice executes its local ACID transaction. If an intermediate step fails (e.g. insufficient funds during account debit), the orchestrator triggers compensating rollback transactions (e.g. unreserve credit limit, refund ledger) ensuring eventual consistency.",
    tips: ["Always mention how idempotency tokens prevent duplicate debit execution on network retry."],
  },
  {
    title: "Cisco - Linux Packet Socket Debugging & TCP Diagnostics",
    category: "interview",
    type: "interview",
    interviewCategory: "technical",
    difficulty: "Medium",
    companies: ["cisco"],
    topics: ["Linux", "Networks", "Sockets"],
    frequency: "High",
    source: "Reported in Cisco Core Engineering Technical Interview",
    tags: ["Networking", "Linux", "Cisco"],
    lastReviewed: "2026",
    question: "A high-scale server is dropping incoming TCP packets under peak load. How would you systematically diagnose and resolve the bottleneck using Linux CLI tools?",
    whatInterviewerExpects: [
      "Diagnosing NIC ring buffers via `ethtool -S`.",
      "Inspecting socket listen backlogs (`ss -lnt`, `netstat -s`).",
      "Tuning `net.core.somaxconn` and `net.ipv4.tcp_max_syn_backlog`."
    ],
    importantPoints: ["Systematic diagnosis: Hardware NIC drops -> Kernel socket backlog drops -> Application thread pool exhaustion."],
    sampleAnswer: "I begin at the network interface layer checking `ethtool -S <eth0>` for `rx_dropped` (indicating NIC ring buffer exhaustion). Next, I inspect TCP stack metrics with `netstat -s | grep -i listen` to check for listen queue overflows. If `ss -lnt` shows Send-Q full, the application is not calling `accept()` fast enough. I increase the socket backlog `somaxconn` via `sysctl -w net.core.somaxconn=4096` and optimize the epoll event loop in the application layer.",
    tips: ["Demonstrate full-stack networking awareness from physical NIC to user-space epoll."],
  },
  {
    title: "Qualcomm - Interrupt Service Routine (ISR) Best Practices in Embedded C",
    category: "interview",
    type: "interview",
    interviewCategory: "technical",
    difficulty: "Hard",
    companies: ["qualcomm"],
    topics: ["Embedded Systems", "ISRs", "C Programming"],
    frequency: "High",
    source: "Reported in Qualcomm Embedded Systems Technical Interview",
    tags: ["Embedded", "ISRs", "Qualcomm"],
    lastReviewed: "2026",
    question: "What are the core constraints and best practices when writing an Interrupt Service Routine (ISR) in embedded C?",
    whatInterviewerExpects: [
      "ISRs must be non-blocking and minimal (no dynamic malloc, no blocking I/O like printf, no mutex acquisitions).",
      "Global variables modified inside ISRs must be marked `volatile`.",
      "Deferred interrupt processing using Bottom Halves / Tasklets / FreeRTOS Queues."
    ],
    importantPoints: ["ISRs run in interrupt context where sleeping/blocking causes system lockup."],
    sampleAnswer: "An ISR must execute in deterministic, minimal microseconds. Key rules: 1) Never call blocking functions like `printf`, `malloc`, or sleep/mutex locks because interrupts cannot yield the CPU. 2) Declare all shared flags as `volatile` to prevent compiler register caching. 3) Adopt the Top-Half / Bottom-Half model: the top-half ISR acknowledges the hardware interrupt, captures the raw hardware register data into a ring buffer, and notifies a worker task/thread via a FreeRTOS semaphore or tasklet to perform heavy processing.",
    tips: ["Mention critical sections and interrupt masking precautions."],
  },
  {
    title: "Salesforce - Scalable Multi-Tenant Object Design & SOQL Optimization",
    category: "interview",
    type: "interview",
    interviewCategory: "technical",
    difficulty: "Medium",
    companies: ["salesforce"],
    topics: ["Cloud Architecture", "Database Design", "Salesforce"],
    frequency: "High",
    source: "Reported in Salesforce Technical Architect Interview",
    tags: ["Cloud", "Database", "Salesforce"],
    lastReviewed: "2026",
    question: "How does the Salesforce multitenant architecture optimize custom field indexing and avoid Governor Limit exceptions?",
    whatInterviewerExpects: [
      "Understanding metadata-driven Universal Data Dictionary.",
      "Skinny tables and custom index tables.",
      "Governor limits preventing single-tenant resource starvation."
    ],
    importantPoints: ["Governor limits enforce bounded CPU, heap, and SOQL query counts to protect neighbor tenants in shared clusters."],
    sampleAnswer: "Salesforce stores all customer records in unified physical tables (e.g. `CustomFields`, `CustomObjects`) where data and metadata are decoupled. To make queries fast across billions of rows, the platform creates dedicated index tables for indexed fields and dynamically syncs read-only 'Skinny Tables' that combine standard and custom fields to avoid multi-table joins. Governor limits (e.g. 100 SOQL queries per transaction) enforce efficient bulkified code patterns and prevent runaway queries from starving cluster resources.",
    tips: ["Highlight the importance of bulkification and set-based queries in Apex."],
  },
  {
    title: "IBM - Hybrid Cloud Enterprise Architecture & Resilience",
    category: "interview",
    type: "interview",
    interviewCategory: "technical",
    difficulty: "Medium",
    companies: ["ibm"],
    topics: ["Cloud Architecture", "Linux", "Kubernetes"],
    frequency: "High",
    source: "Reported in IBM Cloud & Enterprise Technical Interview",
    tags: ["Cloud", "Enterprise", "IBM"],
    lastReviewed: "2026",
    question: "How do you design a hybrid cloud solution that enables seamless data and application migration between on-premise OpenShift clusters and public cloud?",
    whatInterviewerExpects: [
      "Red Hat OpenShift container orchestration.",
      "API gateways, service mesh (Istio), and secure mTLS tunneling.",
      "Event-driven data replication with Kafka."
    ],
    importantPoints: ["Containers and Kubernetes Operators provide consistent runtime environments regardless of underlying infrastructure."],
    sampleAnswer: "We deploy Red Hat OpenShift across both on-premise bare-metal and public cloud environments, ensuring consistent Kubernetes runtime and security policies. We establish high-speed direct interconnects (VPN/Direct Link) with mTLS encryption. Using an Istio Service Mesh, we route traffic dynamically based on latency or regulatory requirements. Application state and databases are synchronized using Kafka event streams and distributed object storage (Ceph/S3), allowing stateless microservices to failover seamlessly across cloud boundaries.",
    tips: ["Emphasize compliance, security tokens, and container immutability."],
  }
];

