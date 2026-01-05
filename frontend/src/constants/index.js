/* =========================
   THEMES
========================= */
export const THEMES = [
  { name: "light", label: "Light", colors: ["#ffffff", "#5a67d8", "#8b5cf6", "#1a202c"] },
  { name: "dark", label: "Dark", colors: ["#1f2937", "#8b5cf6", "#ec4899", "#1a202c"] },
  { name: "cupcake", label: "Cupcake", colors: ["#f5f5f4", "#65c3c8", "#ef9fbc", "#291334"] },
  { name: "forest", label: "Forest", colors: ["#1f1d1d", "#3ebc96", "#70c217", "#e2e8f0"] },
  { name: "bumblebee", label: "Bumblebee", colors: ["#ffffff", "#f8e36f", "#f0d50c", "#1c1917"] },
  { name: "emerald", label: "Emerald", colors: ["#ffffff", "#66cc8a", "#3b82f6", "#1e3a8a"] },
  { name: "corporate", label: "Corporate", colors: ["#ffffff", "#4b6bfb", "#7b92b2", "#1d232a"] },
  { name: "synthwave", label: "Synthwave", colors: ["#2d1b69", "#e779c1", "#58c7f3", "#f8f8f2"] },
  { name: "retro", label: "Retro", colors: ["#e4d8b4", "#ea6962", "#6aaa64", "#282425"] },
  { name: "cyberpunk", label: "Cyberpunk", colors: ["#ffee00", "#ff7598", "#75d1f0", "#1a103d"] },
  { name: "valentine", label: "Valentine", colors: ["#f0d6e8", "#e96d7b", "#a991f7", "#37243c"] },
  { name: "halloween", label: "Halloween", colors: ["#0d0d0d", "#ff7800", "#006400", "#ffffff"] },
  { name: "garden", label: "Garden", colors: ["#e9e7e7", "#ec4899", "#16a34a", "#374151"] },
  { name: "aqua", label: "Aqua", colors: ["#193549", "#4cd4e3", "#9059ff", "#f8d766"] },
  { name: "lofi", label: "Lofi", colors: ["#0f0f0f", "#1a1919", "#232323", "#2c2c2c"] },
  { name: "pastel", label: "Pastel", colors: ["#f7f3f5", "#d1c1d7", "#a1e3d8", "#4a98f1"] },
  { name: "fantasy", label: "Fantasy", colors: ["#ffe7d6", "#a21caf", "#3b82f6", "#f59e0b"] },
  { name: "wireframe", label: "Wireframe", colors: ["#e6e6e6", "#b3b3b3", "#b3b3b3", "#888888"] },
  { name: "black", label: "Black", colors: ["#000000", "#191919", "#313131", "#4a4a4a"] },
  { name: "luxury", label: "Luxury", colors: ["#171618", "#1e293b", "#94589c", "#d4a85a"] },
  { name: "dracula", label: "Dracula", colors: ["#282a36", "#ff79c6", "#bd93f9", "#f8f8f2"] },
  { name: "night", label: "Night", colors: ["#0f172a", "#38bdf8", "#818cf8", "#e2e8f0"] },
  { name: "nord", label: "Nord", colors: ["#eceff4", "#5e81ac", "#81a1c1", "#3b4252"] },
  { name: "sunset", label: "Sunset", colors: ["#1e293b", "#f5734c", "#ec4899", "#ffffff"] },
];

/* =========================
   LANGUAGES (UI SELECT)
========================= */
export const LANGUAGES = [
  // Programming / Tech
  "C",
  "C++",
  "Java",
  "JavaScript",
  "Python",
  "Go",
  "Kotlin",
  "MATLAB",
  "SQL",
  "Ruby",
  "Swift",
  "Rust",
  "React",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "MariaDB",
  "SQLite",

  // Spoken
  "English",
  "Spanish",
  "French",
  "Korean",
  "Hindi",
];

/* =========================
   SPOKEN LANGUAGE → FLAG
========================= */
export const LANGUAGE_TO_FLAG = {
  english: "gb",
  spanish: "es",
  french: "fr",
  german: "de",
  mandarin: "cn",
  japanese: "jp",
  korean: "kr",
  hindi: "in",
  russian: "ru",
  portuguese: "pt",
  arabic: "sa",
  italian: "it",
  turkish: "tr",
  dutch: "nl",
};

/* =========================
   PROGRAMMING LANGUAGE → ICON
========================= */
export const LANGUAGE_TO_ICON = {
  c: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  "c++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  kotlin: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  matlab: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg",
  ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
  swift: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
  react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",

  sql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  mongodb: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  postgresql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  mariadb: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg",
  sqlite: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
};
