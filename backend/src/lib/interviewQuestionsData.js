/**
 * ── AUTHENTIC COMPANY-SPECIFIC INTERVIEW QUESTIONS MASTERCLASS ──
 * Comprehensive Technical, HR (STAR Method), and Project Defense Questions
 * Specifically Asked by Top MNCs & Product Titans (Capgemini, TCS, Accenture, Infosys, Wipro, Cognizant, Deloitte, Google, Amazon, Microsoft).
 */

export const INTERVIEW_QUESTIONS_DATA = [
  // ─────────────────────────────────────────────────────────────
  // ── 1. CAPGEMINI PARTICULARLY ASKED INTERVIEW QUESTIONS ──
  // ─────────────────────────────────────────────────────────────
  {
    title: "Explain the Four Pillars of OOP with Real-World Production Examples",
    category: "interview",
    type: "interview",
    interviewCategory: "Technical",
    difficulty: "Medium",
    companies: ["capgemini", "tcs", "accenture", "infosys", "wipro", "cognizant"],
    topics: ["OOP", "Java", "Inheritance", "Polymorphism", "Abstraction", "Encapsulation"],
    frequency: "High",
    whatInterviewerExpects: [
      "Clear, conceptual definitions of Encapsulation, Abstraction, Inheritance, and Polymorphism.",
      "Real-world enterprise examples beyond the generic 'Animal/Dog' or 'Vehicle/Car' examples.",
      "Distinction between Method Overloading (Compile-time) and Method Overriding (Runtime).",
      "Explanation of why Abstraction and Encapsulation are vital in software architecture."
    ],
    importantPoints: [
      "Encapsulation: Bundling data and methods, using private variables and public getters/setters (e.g. BankAccount balance protection).",
      "Abstraction: Hiding complex implementation details and showing only essentials using Interfaces / Abstract Classes (e.g. PaymentGateway interface with executePayment()).",
      "Inheritance: Code reusability where child class acquires parent properties (e.g. Employee parent class with Developer and Manager subclasses).",
      "Polymorphism: Dynamic method dispatch allowing one interface to represent multiple underlying forms (e.g. NotificationService.sendNotification() implemented by EmailService and SMSService)."
    ],
    sampleAnswer: `In object-oriented software engineering, the four pillars govern maintainability, modularity, and security:

1. Encapsulation: Restricts direct access to an object's internal state. In enterprise systems, we make fields private and expose controlled getter/setter methods with validation. For example, in an e-commerce 'Order' object, totalAmount cannot be directly modified without passing through an applyDiscount() method.

2. Abstraction: Hides internal complexity behind a simplified interface. For instance, creating an interface 'PaymentProcessor' with a method 'processPayment()'. The caller doesn't need to know whether PayPal, Stripe, or Razorpay handles the network protocol underneath.

3. Inheritance: Promotes DRY (Don't Repeat Yourself) by sharing common attributes. An 'Account' class provides base fields like 'accountNumber' and 'owner', which 'SavingsAccount' and 'CurrentAccount' inherit while adding specific interest rate rules.

4. Polymorphism: Allows methods to execute differently based on the runtime instance. Using method overriding, an 'ExportService' invokes 'generateReport()', which executes as PDFExporter or CSVExporter depending on user configuration.`,
    tips: [
      "Always mention Abstract Class vs Interface differences if asked follow-up questions.",
      "Mention that Java does not support multiple inheritance with classes to avoid the Diamond Problem, but achieves it through interfaces."
    ]
  },
  {
    title: "How does HashMap work internally in Java? What is Collision Resolution?",
    category: "interview",
    type: "interview",
    interviewCategory: "Technical",
    difficulty: "Hard",
    companies: ["capgemini", "amazon", "microsoft", "tcs", "infosys", "oracle"],
    topics: ["Java Collections", "HashMap", "Hashing", "Data Structures"],
    frequency: "High",
    whatInterviewerExpects: [
      "Understanding of the underlying array of Node (Bucket Array).",
      "Working of hashCode() and equals() contracts.",
      "How hash collision is handled via LinkedList and Treeify threshold (Java 8 Red-Black Tree conversion).",
      "Time complexity in best, average, and worst cases."
    ],
    importantPoints: [
      "Default initial capacity is 16; default load factor is 0.75.",
      "Hashing: hash(key) is computed to find the index: index = (n - 1) & hash.",
      "Collision Handling: When two different keys hash to the same bucket index, they are stored in a LinkedList at that bucket.",
      "Java 8 Treeification: If bucket size exceeds TREEIFY_THRESHOLD (8 nodes) and total capacity >= 64, the linked list is converted into a Red-Black Tree reducing worst-case search from O(N) to O(log N)."
    ],
    sampleAnswer: `Java's HashMap is built on an array of Node<K,V> instances. Here is the lifecycle of a put(key, value) operation:

1. Hash Computation: The JVM invokes key.hashCode() and applies a secondary hash spread function to distribute bits evenly.
2. Bucket Calculation: The bucket index is calculated using bitwise AND: index = (array_length - 1) & hash.
3. Node Insertion:
   - If the bucket is empty, a new Node is placed.
   - If a collision occurs (bucket occupied), it traverses the existing elements comparing both hash and key.equals().
   - If an identical key is found, the value is updated. Otherwise, a new node is appended to the linked list.
4. Java 8 Optimization: If the number of collided elements in a single bucket reaches 8 and array capacity is at least 64, Java converts that bucket's LinkedList into a balanced Red-Black Tree, improving lookup from O(n) to O(log n).
5. Rehashing: When total stored elements exceed (capacity * load factor) (e.g. 16 * 0.75 = 12), the array capacity doubles and all existing entries are re-indexed.`,
    tips: [
      "Emphasize that custom keys must override both equals() and hashCode() to maintain consistency.",
      "If asked about thread-safety, mention ConcurrentHashMap (using synchronized bucket locks) vs Collections.synchronizedMap() vs Hashtable."
    ]
  },
  {
    title: "Tell Me About a Challenging Situation in a Project and How You Resolved It (STAR Method)",
    category: "interview",
    type: "interview",
    interviewCategory: "HR",
    difficulty: "Medium",
    companies: ["capgemini", "accenture", "tcs", "deloitte", "amazon", "google"],
    topics: ["STAR Method", "Problem Solving", "Conflict Resolution", "Behavioral"],
    frequency: "High",
    whatInterviewerExpects: [
      "Structured delivery following Situation, Task, Action, Result (STAR).",
      "Demonstration of personal initiative, technical troubleshooting, and composure under pressure.",
      "Quantifiable outcome or positive metric resulting from your resolution."
    ],
    importantPoints: [
      "Situation: Set the context (tight deadline, production bug, API failure).",
      "Task: Define your specific responsibility in that challenge.",
      "Action: Explain the step-by-step diagnostic and implementation actions YOU took.",
      "Result: Share the outcome with measurable success or key lessons learned."
    ],
    sampleAnswer: `Here is an authentic situation using the STAR framework:

• Situation: During my final-year project (a collaborative full-stack web portal), we were 4 days away from final submission when our live database connections started timing out under concurrent user simulations of just 25 users.

• Task: As the backend lead, I was responsible for diagnosing the bottleneck, optimizing API response latencies, and ensuring database stability under multi-user concurrency.

• Action: I profiled the slowest endpoints and identified two root causes: multiple unindexed foreign-key lookups on every page reload, and creating a new raw database connection per request rather than reusing connections. I implemented an optimized connection pool, added compound database indexes on frequently queried user-ID and timestamp fields, and implemented Redis memory caching for static catalog data.

• Result: The query latency dropped from 1,850ms to 42ms (a 97% reduction), and our system smoothly passed stress-testing with 300+ concurrent requests with zero connection dropouts.`,
    tips: [
      "Focus on 'I did' rather than just 'we did' to highlight your individual contribution.",
      "Never blame teammates or instructors; emphasize proactive problem-solving."
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // ── 2. TCS PARTICULARLY ASKED INTERVIEW QUESTIONS ──
  // ─────────────────────────────────────────────────────────────
  {
    title: "What is the difference between Primary Key, Unique Key, and Foreign Key in DBMS?",
    category: "interview",
    type: "interview",
    interviewCategory: "Technical",
    difficulty: "Easy",
    companies: ["tcs", "cognizant", "infosys", "wipro", "deloitte", "oracle"],
    topics: ["DBMS", "SQL", "Database Constraints", "Primary Key", "Foreign Key"],
    frequency: "High",
    whatInterviewerExpects: [
      "Clear distinction regarding NULL allowance, number of keys permitted per table, and relational integrity.",
      "Understanding of clustered vs non-clustered index creation by default."
    ],
    importantPoints: [
      "Primary Key: Uniquely identifies each row, allows NO NULL values, and automatically creates a Clustered Index (Only 1 Primary Key allowed per table).",
      "Unique Key: Ensures all values in a column are distinct, allows ONE NULL value in SQL standards, and creates a Non-Clustered Index (Multiple Unique Keys allowed per table).",
      "Foreign Key: Enforces referential integrity by linking a column in one table to the Primary Key of another table (Can contain duplicates and NULL values)."
    ],
    sampleAnswer: `In Relational Database Management Systems:

1. Primary Key:
   - Uniquely identifies each record in a database table.
   - Strictly does NOT allow any NULL values.
   - Each table can have only ONE primary key.
   - It creates a clustered index by default for high-speed sequential lookups.

2. Unique Key:
   - Enforces uniqueness across a column to prevent duplicate values (e.g. Email ID, Aadhaar number).
   - Allows a single NULL value (in databases like MySQL/PostgreSQL).
   - A table can have multiple unique key constraints.

3. Foreign Key:
   - Establishes a relational constraint between two tables by pointing to the Primary Key of a parent table.
   - Enforces referential integrity (e.g. preventing the deletion of a Customer if active Orders exist).
   - It allows multiple duplicate values and NULLs.`,
    tips: [
      "Mention CASCADE operations (ON DELETE CASCADE, ON UPDATE CASCADE) to show deep SQL knowledge."
    ]
  },
  {
    title: "Why are you interested in joining TCS, and are you willing to work in rotational shifts and relocate?",
    category: "interview",
    type: "interview",
    interviewCategory: "HR",
    difficulty: "Easy",
    companies: ["tcs", "wipro", "cognizant", "capgemini"],
    topics: ["HR", "Company Fit", "Flexibility", "Career Goals"],
    frequency: "High",
    whatInterviewerExpects: [
      "Enthusiasm for TCS's global scale, research labs, and continuous learning culture.",
      "Clear and unconditional confirmation regarding relocation and rotational shifts.",
      "Long-term career perspective."
    ],
    importantPoints: [
      "Highlight TCS's global presence, enterprise transformation projects, and training ecosystem.",
      "State an affirmative 'Yes' to relocation and 24/7 rotational project shifts without hesitation.",
      "Show willingness to learn new emerging tech stacks based on project needs."
    ],
    sampleAnswer: `I am eager to begin my professional career with Tata Consultancy Services for three main reasons:

First, TCS has an extraordinary reputation for fostering talent through world-class learning platforms and hands-on enterprise modernization projects. The opportunity to work on large-scale digital architectures for global Fortune 500 clients is the ideal environment to accelerate my engineering growth.

Second, the Tata Group's ethos of ethics, sustainability, and trust aligns deeply with my personal values.

Regarding relocation and rotational shifts: Yes, absolutely! I am 100% flexible to relocate to any TCS development center across India or overseas, and I am completely comfortable working in rotational shifts based on project and client requirements. I view relocation as a great opportunity to adapt to new environments and collaborate with diverse engineering teams.`,
    tips: [
      "Never show hesitation regarding shifts or location; MNCs require operational flexibility."
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // ── 3. ACCENTURE PARTICULARLY ASKED INTERVIEW QUESTIONS ──
  // ─────────────────────────────────────────────────────────────
  {
    title: "What is the Difference Between Monolithic and Microservices Architecture?",
    category: "interview",
    type: "interview",
    interviewCategory: "Technical",
    difficulty: "Medium",
    companies: ["accenture", "capgemini", "deloitte", "microsoft", "amazon", "google"],
    topics: ["System Design", "Microservices", "Cloud", "Software Architecture"],
    frequency: "High",
    whatInterviewerExpects: [
      "Definition and core differences in codebase structure, deployment, database management, and scalability.",
      "Understanding trade-offs (e.g. latency, distributed debugging, CI/CD)."
    ],
    importantPoints: [
      "Monolith: Single unified codebase, shared database, single deployable artifact (JAR/WAR), but single point of failure and difficult to scale independently.",
      "Microservices: Loosely coupled independent services, each owning its database, communicating via REST/gRPC/Kafka, scalable per service demand, but higher operational complexity."
    ],
    sampleAnswer: `A Monolithic architecture builds all functional components (Auth, Payment, Notification, Inventory) into a single, unified codebase sharing one centralized database.
• Advantages: Simpler initial development, straightforward end-to-end debugging, and zero inter-service network overhead.
• Challenges: A single bug can crash the entire application, and the entire system must be redeployed for minor updates.

In contrast, a Microservices architecture decomposes the application into small, autonomous services organized around distinct business capabilities:
• Advantages: Independent deployment, polyglot technology choices (e.g. Python for AI, Go for high-throughput APIs), and independent horizontal autoscaling (e.g. scaling only the Payment service on Black Friday).
• Challenges: Distributed data consistency, complex network latency, and requires API Gateways, service discovery, and distributed tracing.`,
    tips: [
      "Mention tools like Docker, Kubernetes, and Kafka to show practical microservices awareness."
    ]
  },
  {
    title: "How do you handle a disagreement or conflict with a teammate during a critical sprint deadline?",
    category: "interview",
    type: "interview",
    interviewCategory: "HR",
    difficulty: "Medium",
    companies: ["accenture", "google", "amazon", "microsoft", "capgemini", "deloitte"],
    topics: ["HR", "Conflict Resolution", "Teamwork", "Emotional Intelligence"],
    frequency: "High",
    whatInterviewerExpects: [
      "Empathy, active listening, and depersonalizing technical arguments.",
      "Focusing on data, benchmark results, and project deadlines rather than ego.",
      "Constructive collaboration to find a win-win solution."
    ],
    importantPoints: [
      "Listen first to understand the teammate's perspective and rationale.",
      "Focus on project requirements, performance benchmarks, or client goals.",
      "If deadlocked, build a quick Proof-of-Concept (POC) or consult the technical lead."
    ],
    sampleAnswer: `When disagreements arise, I prioritize open communication, objective data, and the project's success over personal opinions.

First, I step back and actively listen to my teammate's perspective to understand their reasoning. For example, in a past sprint, my teammate wanted to use a NoSQL database for rapid prototyping, while I favored PostgreSQL due to strict relational constraints on transactions.

Instead of debating abstractly, we outlined the core requirements together: data consistency was non-negotiable for billing. We agreed on a balanced approach—PostgreSQL for the core transactional data and MongoDB for flexible logging.

By focusing on objective benchmarks and shared sprint goals, we resolved the debate in under 30 minutes, delivered the feature ahead of schedule, and maintained a strong working relationship.`,
    tips: [
      "Emphasize that technical disagreements are healthy when resolved using data and shared goals."
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // ── 4. PRODUCT & FAANG (GOOGLE, AMAZON, MICROSOFT, META) ──
  // ─────────────────────────────────────────────────────────────
  {
    title: "How do you detect and prevent Deadlocks in a Multi-Threaded Environment?",
    category: "interview",
    type: "interview",
    interviewCategory: "Technical",
    difficulty: "Hard",
    companies: ["google", "microsoft", "amazon", "meta", "apple", "netflix", "adobe"],
    topics: ["Operating Systems", "Concurrency", "Multithreading", "Deadlock", "Java"],
    frequency: "High",
    whatInterviewerExpects: [
      "The 4 Coffman conditions for deadlocks: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
      "Strategies to break each condition (Lock Ordering, tryLock with timeouts, Deadlock Detection Graphs)."
    ],
    importantPoints: [
      "Coffman Conditions: All 4 must hold simultaneously for a deadlock to occur.",
      "Deadlock Prevention: Enforce a strict global lock acquisition ordering (e.g. always acquire Lock A before Lock B).",
      "Deadlock Avoidance: Banker's Algorithm checking safe states before allocation.",
      "Deadlock Detection & Recovery: Thread dump analysis (jstack), wait-for graphs, and resource preemption."
    ],
    sampleAnswer: `A deadlock occurs when two or more threads are permanently blocked, each holding a resource and waiting for another resource held by another thread.

A deadlock strictly requires all 4 Coffman Conditions:
1. Mutual Exclusion: At least one resource must be non-shareable.
2. Hold and Wait: A thread holds a resource while requesting another.
3. No Preemption: Resources cannot be forcibly revoked from holding threads.
4. Circular Wait: A closed loop exists where Thread 1 waits for Thread 2, which waits for Thread 1.

How to Prevent Deadlocks in Production:
1. Strict Lock Ordering: Break Circular Wait by establishing a global order for all lock acquisitions. If Thread 1 and Thread 2 both always acquire Lock A before Lock B, circular deadlock is mathematically impossible.
2. Timed Lock Acquisition: Use ReentrantLock.tryLock(timeout) in Java instead of intrinsic synchronized blocks. If a lock cannot be acquired within 500ms, the thread releases its current locks, backs off, and retries.
3. Minimize Lock Scope: Keep critical sections as concise as possible and prefer lock-free atomic primitives (AtomicInteger, ConcurrentLinkedQueue).`,
    tips: [
      "Mention thread dump diagnostics using tools like jstack, VisualVM, or Go pprof."
    ]
  },
  {
    title: "Amazon Leadership Principle: Tell me about a time you showed 'Customer Obsession' and 'Bias for Action'",
    category: "interview",
    type: "interview",
    interviewCategory: "HR",
    difficulty: "Hard",
    companies: ["amazon", "google", "microsoft", "uber"],
    topics: ["Amazon Leadership Principles", "Customer Obsession", "Bias for Action", "Behavioral"],
    frequency: "High",
    whatInterviewerExpects: [
      "Clear alignment with Amazon's core principle of working backwards from the customer.",
      "Calculated risk taking and swift decision-making with incomplete information (Bias for Action).",
      "Tangible customer impact with measurable metrics."
    ],
    importantPoints: [
      "Customer Obsession: Leaders start with the customer and work backwards, earning and keeping customer trust.",
      "Bias for Action: Speed matters in business; many decisions are two-way doors (reversible) and don't require exhaustive analysis."
    ],
    sampleAnswer: `• Situation: During an internship deployment of an internal student-mentorship portal, users reported that the mentor appointment booking flow was failing silently on mobile browsers during peak registration hours.

• Task: Although this issue was outside my assigned module (I was working on search filters), I recognized that students were missing critical mentorship slots, creating frustration and eroding trust.

• Action: I immediately investigated the production client logs and discovered that the mobile Safari browser was blocking third-party cookie tokens in the payment iframe. Knowing that waiting for next week's sprint planning would cost students hundreds of booking slots, I exercised Bias for Action: I drafted a reversible patch replacing cookie-based iframe handshakes with secure tokenized redirect callbacks, validated it in staging within 3 hours, and coordinated a zero-downtime hotfix.

• Result: Booking failure rates dropped from 18% to 0.1% within that afternoon, successfully salvaging 400+ scheduled mentorship appointments.`,
    tips: [
      "Amazon interviewers love two-way door vs one-way door decision framing.",
      "Always quantify customer impact (latency saved, user drop-offs prevented)."
    ]
  },
  {
    title: "Explain How You Designed and Defended the Architecture of Your Capstone / Personal Project",
    category: "interview",
    type: "interview",
    interviewCategory: "Project",
    difficulty: "Medium",
    companies: ["capgemini", "tcs", "accenture", "google", "microsoft", "amazon", "infosys", "cognizant"],
    topics: ["Project Defense", "System Architecture", "Database Design", "API Design"],
    frequency: "High",
    whatInterviewerExpects: [
      "High-level architecture overview (Frontend, Backend, Database, Auth, Caching, Cloud hosting).",
      "Rationale behind chosen tech stacks and trade-offs considered.",
      "Handling scale, security, and potential future improvements."
    ],
    importantPoints: [
      "State the problem statement solved and the target user persona.",
      "Detail the architectural layers: Client UI -> API Gateway/Controllers -> Service Layer -> Database / Cache.",
      "Discuss authentication (JWT / OAuth2), validation, and indexing choices.",
      "Reflect on what you would improve with more time (e.g. WebSocket live updates, Dockerized microservices)."
    ],
    sampleAnswer: `My flagship project is a real-time collaborative code editor and candidate evaluation portal designed for mock technical assessments.

1. High-Level Architecture:
   - Frontend: React with Tailwind/DaisyUI, Monaco Code Editor, and TanStack React Query for cached, optimistic UI state.
   - Backend: Node.js / Express REST API following a 3-tier architecture (Routes -> Controllers -> Mongoose Models).
   - Real-time Engine: WebSocket (Socket.io) handling bi-directional live syntax cursor synchronization.
   - Database: MongoDB with compound indexes on company tags and user progress queries for sub-10ms lookups.

2. Key Engineering Challenges Solved:
   - Security: Sandboxed code execution with memory/timeout limits preventing infinite loops or malicious system calls.
   - Concurrency: Debounced state persistence ensuring code drafts are preserved across network interruptions without hammering the database.

3. If given more time, I would containerize the code execution engine using lightweight Docker micro-containers to support 10+ programming languages securely.`,
    tips: [
      "Be prepared to draw your project's database ER diagram or architecture diagram on a whiteboard.",
      "Be honest about bugs you encountered and how you solved them."
    ]
  }
];
