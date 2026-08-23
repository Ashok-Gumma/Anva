import mongoose from "mongoose";
import dotenv from "dotenv";
import { CODING_QUESTIONS } from "../lib/placementCodingQuestionsData.js";
import PlacementQuestion from "../models/PlacementQuestion.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Extended Hard, Edge, and Stress Test Cases Bank (LeetCode Grade)
const HARD_TEST_CASES_MAP = {
  "Two Sum": [
    { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false },
    { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: false },
    { input: "[3,3]\n6", expectedOutput: "[0,1]", isHidden: false },
    { input: "[-1,-2,-3,-4,-5]\n-8", expectedOutput: "[2,4]", isHidden: true },
    { input: "[0,4,3,0]\n0", expectedOutput: "[0,3]", isHidden: true },
    { input: "[1000000000,500000000,500000000]\n1000000000", expectedOutput: "[1,2]", isHidden: true },
    { input: "[1,5,10,20,40,80]\n100", expectedOutput: "[3,5]", isHidden: true },
    { input: "[2,5,5,11]\n10", expectedOutput: "[1,2]", isHidden: true },
  ],
  "Container With Most Water": [
    { input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49", isHidden: false },
    { input: "[1,1]", expectedOutput: "1", isHidden: false },
    { input: "[4,3,2,1,4]", expectedOutput: "16", isHidden: false },
    { input: "[1,2,1]", expectedOutput: "2", isHidden: true },
    { input: "[1,2,4,3]", expectedOutput: "4", isHidden: true },
    { input: "[10,9,8,7,6,5,4,3,2,1]", expectedOutput: "25", isHidden: true },
    { input: "[1,3,2,5,25,24,5]", expectedOutput: "24", isHidden: true },
    { input: "[0,2]", expectedOutput: "0", isHidden: true },
  ],
  "Longest Substring Without Repeating Characters": [
    { input: '"abcabcbb"', expectedOutput: "3", isHidden: false },
    { input: '"bbbbb"', expectedOutput: "1", isHidden: false },
    { input: '"pwwkew"', expectedOutput: "3", isHidden: false },
    { input: '""', expectedOutput: "0", isHidden: true },
    { input: '" "', expectedOutput: "1", isHidden: true },
    { input: '"au"', expectedOutput: "2", isHidden: true },
    { input: '"dvdf"', expectedOutput: "3", isHidden: true },
    { input: '"tmmzuxt"', expectedOutput: "5", isHidden: true },
    { input: '"abba"', expectedOutput: "2", isHidden: true },
  ],
  "Trapping Rain Water": [
    { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6", isHidden: false },
    { input: "[4,2,0,3,2,5]", expectedOutput: "9", isHidden: false },
    { input: "[3,0,2,0,4]", expectedOutput: "7", isHidden: false },
    { input: "[1,2,3,4,5]", expectedOutput: "0", isHidden: true },
    { input: "[5,4,3,2,1]", expectedOutput: "0", isHidden: true },
    { input: "[5,0,5]", expectedOutput: "5", isHidden: true },
    { input: "[0,2,0]", expectedOutput: "0", isHidden: true },
    { input: "[5,1,2,1,5]", expectedOutput: "11", isHidden: true },
    { input: "[2,0,2]", expectedOutput: "2", isHidden: true },
  ],
  "Word Break": [
    { input: '"leetcode"\n["leet","code"]', expectedOutput: "true", isHidden: false },
    { input: '"applepenapple"\n["apple","pen"]', expectedOutput: "true", isHidden: false },
    { input: '"catsandog"\n["cats","dog","sand","and","cat"]', expectedOutput: "false", isHidden: false },
    { input: '"cars"\n["car","ca","rs"]', expectedOutput: "true", isHidden: true },
    { input: '"aaaaaaa"\n["aaaa","aaa"]', expectedOutput: "true", isHidden: true },
    { input: '"a"\n["b"]', expectedOutput: "false", isHidden: true },
    { input: '"goalspecial"\n["go","goal","special"]', expectedOutput: "true", isHidden: true },
  ],
  "Course Schedule": [
    { input: "2\n[[1,0]]", expectedOutput: "true", isHidden: false },
    { input: "2\n[[1,0],[0,1]]", expectedOutput: "false", isHidden: false },
    { input: "3\n[[1,0],[2,1]]", expectedOutput: "true", isHidden: true },
    { input: "4\n[[1,0],[2,0],[3,1],[3,2]]", expectedOutput: "true", isHidden: true },
    { input: "3\n[[0,1],[1,2],[2,0]]", expectedOutput: "false", isHidden: true },
    { input: "1\n[]", expectedOutput: "true", isHidden: true },
  ],
  "Median of Two Sorted Arrays": [
    { input: "[1,3]\n[2]", expectedOutput: "2.0", isHidden: false },
    { input: "[1,2]\n[3,4]", expectedOutput: "2.5", isHidden: false },
    { input: "[0,0]\n[0,0]", expectedOutput: "0.0", isHidden: true },
    { input: "[]\n[1]", expectedOutput: "1.0", isHidden: true },
    { input: "[2]\n[]", expectedOutput: "2.0", isHidden: true },
    { input: "[1,2,3,4,5]\n[6,7,8,9,10]", expectedOutput: "5.5", isHidden: true },
    { input: "[1,1,1]\n[1,1,1]", expectedOutput: "1.0", isHidden: true },
  ],
  "Subarray Sum Equals K": [
    { input: "[1,1,1]\n2", expectedOutput: "2", isHidden: false },
    { input: "[1,2,3]\n3", expectedOutput: "2", isHidden: false },
    { input: "[1,-1,0]\n0", expectedOutput: "3", isHidden: true },
    { input: "[-1,-1,1]\n0", expectedOutput: "1", isHidden: true },
    { input: "[0,0,0,0,0]\n0", expectedOutput: "15", isHidden: true },
    { input: "[100,1,2,3,4]\n6", expectedOutput: "1", isHidden: true },
  ],
  "Kth Largest Element in an Array": [
    { input: "[3,2,1,5,6,4]\n2", expectedOutput: "5", isHidden: false },
    { input: "[3,2,3,1,2,4,5,5,6]\n4", expectedOutput: "4", isHidden: false },
    { input: "[1]\n1", expectedOutput: "1", isHidden: true },
    { input: "[-1,-1]\n2", expectedOutput: "-1", isHidden: true },
    { input: "[7,6,5,4,3,2,1]\n5", expectedOutput: "3", isHidden: true },
    { input: "[99,99]\n1", expectedOutput: "99", isHidden: true },
  ],
  "Search in Rotated Sorted Array": [
    { input: "[4,5,6,7,0,1,2]\n0", expectedOutput: "4", isHidden: false },
    { input: "[4,5,6,7,0,1,2]\n3", expectedOutput: "-1", isHidden: false },
    { input: "[1]\n0", expectedOutput: "-1", isHidden: true },
    { input: "[1]\n1", expectedOutput: "0", isHidden: true },
    { input: "[1,3]\n3", expectedOutput: "1", isHidden: true },
    { input: "[3,1]\n1", expectedOutput: "1", isHidden: true },
    { input: "[5,1,3]\n5", expectedOutput: "0", isHidden: true },
  ],
  "Number of Islands": [
    { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: "1", isHidden: false },
    { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: "3", isHidden: false },
    { input: '[["0"]]', expectedOutput: "0", isHidden: true },
    { input: '[["1"]]', expectedOutput: "1", isHidden: true },
    { input: '[["1","0","1"],["0","1","0"],["1","0","1"]]', expectedOutput: "5", isHidden: true },
  ],
  "Merge Intervals": [
    { input: "[[1,3],[2,6],[8,10],[15,18]]", expectedOutput: "[[1,6],[8,10],[15,18]]", isHidden: false },
    { input: "[[1,4],[4,5]]", expectedOutput: "[[1,5]]", isHidden: false },
    { input: "[[1,4],[0,4]]", expectedOutput: "[[0,4]]", isHidden: true },
    { input: "[[1,4],[2,3]]", expectedOutput: "[[1,4]]", isHidden: true },
    { input: "[[1,4],[0,0]]", expectedOutput: "[[0,0],[1,4]]", isHidden: true },
    { input: "[[1,10],[2,3],[4,5],[6,7],[8,9]]", expectedOutput: "[[1,10]]", isHidden: true },
  ],
  "Coin Change": [
    { input: "[1,2,5]\n11", expectedOutput: "3", isHidden: false },
    { input: "[2]\n3", expectedOutput: "-1", isHidden: false },
    { input: "[1]\n0", expectedOutput: "0", isHidden: true },
    { input: "[1]\n1", expectedOutput: "1", isHidden: true },
    { input: "[1]\n2", expectedOutput: "2", isHidden: true },
    { input: "[186,419,83,408]\n6249", expectedOutput: "20", isHidden: true },
    { input: "[2,5,10,1]\n27", expectedOutput: "4", isHidden: true },
  ],
  "Best Time to Buy and Sell Stock": [
    { input: "[7,1,5,3,6,4]", expectedOutput: "5", isHidden: false },
    { input: "[7,6,4,3,1]", expectedOutput: "0", isHidden: false },
    { input: "[1,2]", expectedOutput: "1", isHidden: true },
    { input: "[2,4,1]", expectedOutput: "2", isHidden: true },
    { input: "[3,2,6,5,0,3]", expectedOutput: "4", isHidden: true },
    { input: "[1,2,3,4,5]", expectedOutput: "4", isHidden: true },
    { input: "[2,2,2,2]", expectedOutput: "0", isHidden: true },
  ],
  "Running Sum of 1d Array": [
    { input: "[1,2,3,4]", expectedOutput: "[1,3,6,10]", isHidden: false },
    { input: "[1,1,1,1,1]", expectedOutput: "[1,2,3,4,5]", isHidden: false },
    { input: "[3,1,2,10,1]", expectedOutput: "[3,4,6,16,17]", isHidden: false },
    { input: "[1]", expectedOutput: "[1]", isHidden: true },
    { input: "[-1,-2,-3]", expectedOutput: "[-1,-3,-6]", isHidden: true },
    { input: "[0,0,0]", expectedOutput: "[0,0,0]", isHidden: true },
    { input: "[1000,-1000,1000]", expectedOutput: "[1000,0,1000]", isHidden: true },
    { input: "[10,20,30,40,50]", expectedOutput: "[10,30,60,100,150]", isHidden: true },
  ],
  "Roman to Integer": [
    { input: '"III"', expectedOutput: "3", isHidden: false },
    { input: '"LVIII"', expectedOutput: "58", isHidden: false },
    { input: '"MCMXCIV"', expectedOutput: "1994", isHidden: false },
    { input: '"I"', expectedOutput: "1", isHidden: true },
    { input: '"IV"', expectedOutput: "4", isHidden: true },
    { input: '"IX"', expectedOutput: "9", isHidden: true },
    { input: '"XL"', expectedOutput: "40", isHidden: true },
    { input: '"XC"', expectedOutput: "90", isHidden: true },
    { input: '"CD"', expectedOutput: "400", isHidden: true },
    { input: '"CM"', expectedOutput: "900", isHidden: true },
    { input: '"MMMCMXCIX"', expectedOutput: "3999", isHidden: true },
  ],
  "Majority Element": [
    { input: "[3,2,3]", expectedOutput: "3", isHidden: false },
    { input: "[2,2,1,1,1,2,2]", expectedOutput: "2", isHidden: false },
    { input: "[1]", expectedOutput: "1", isHidden: true },
    { input: "[6,5,5]", expectedOutput: "5", isHidden: true },
    { input: "[10,10,10,20,10]", expectedOutput: "10", isHidden: true },
    { input: "[-1,-1,2,-1]", expectedOutput: "-1", isHidden: true },
  ],
  "Longest Consecutive Sequence": [
    { input: "[100,4,200,1,3,2]", expectedOutput: "4", isHidden: false },
    { input: "[0,3,7,2,5,8,4,6,0,1]", expectedOutput: "9", isHidden: false },
    { input: "[]", expectedOutput: "0", isHidden: true },
    { input: "[1]", expectedOutput: "1", isHidden: true },
    { input: "[1,2,0,1]", expectedOutput: "3", isHidden: true },
    { input: "[-2,-3,-1,0,1]", expectedOutput: "5", isHidden: true },
    { input: "[9,1,4,7,3,-1,0,5,8,-1,6]", expectedOutput: "7", isHidden: true },
  ],
  "Reverse Integer": [
    { input: "123", expectedOutput: "321", isHidden: false },
    { input: "-123", expectedOutput: "-321", isHidden: false },
    { input: "120", expectedOutput: "21", isHidden: false },
    { input: "0", expectedOutput: "0", isHidden: true },
    { input: "1534236469", expectedOutput: "0", isHidden: true },
    { input: "-2147483648", expectedOutput: "0", isHidden: true },
  ],
  "Single Number": [
    { input: "[2,2,1]", expectedOutput: "1", isHidden: false },
    { input: "[4,1,2,1,2]", expectedOutput: "4", isHidden: false },
    { input: "[1]", expectedOutput: "1", isHidden: true },
    { input: "[-1,-1,-2]", expectedOutput: "-2", isHidden: true },
    { input: "[0,1,0]", expectedOutput: "1", isHidden: true },
    { input: "[30000,500,30000]", expectedOutput: "500", isHidden: true },
  ],
  "Climbing Stairs": [
    { input: "2", expectedOutput: "2", isHidden: false },
    { input: "3", expectedOutput: "3", isHidden: false },
    { input: "1", expectedOutput: "1", isHidden: true },
    { input: "4", expectedOutput: "5", isHidden: true },
    { input: "5", expectedOutput: "8", isHidden: true },
    { input: "10", expectedOutput: "89", isHidden: true },
    { input: "30", expectedOutput: "1346269", isHidden: true },
  ],
  "Detect Loop in Linked List": [
    { input: "[3,2,0,-4]\n1", expectedOutput: "true", isHidden: false },
    { input: "[1,2]\n0", expectedOutput: "true", isHidden: false },
    { input: "[1]\n-1", expectedOutput: "false", isHidden: false },
    { input: "[1,2,3,4,5]\n-1", expectedOutput: "false", isHidden: true },
    { input: "[1,2,3,4,5]\n0", expectedOutput: "true", isHidden: true },
    { input: "[1,2,3,4,5]\n4", expectedOutput: "true", isHidden: true },
    { input: "[10,20,30]\n-1", expectedOutput: "false", isHidden: true },
  ],
  "Leaders in an Array": [
    { input: "[16,17,4,3,5,2]", expectedOutput: "[17,5,2]", isHidden: false },
    { input: "[1,2,3,4,0]", expectedOutput: "[4,0]", isHidden: false },
    { input: "[5]", expectedOutput: "[5]", isHidden: true },
    { input: "[10,20,30]", expectedOutput: "[30]", isHidden: true },
    { input: "[30,20,10]", expectedOutput: "[30,20,10]", isHidden: true },
  ],
  "Count Inversions in an Array": [
    { input: "[2,4,1,3,5]", expectedOutput: "3", isHidden: false },
    { input: "[2,3,4,5,6]", expectedOutput: "0", isHidden: false },
    { input: "[10,10,10]", expectedOutput: "0", isHidden: true },
    { input: "[5,4,3,2,1]", expectedOutput: "10", isHidden: true },
    { input: "[1]", expectedOutput: "0", isHidden: true },
  ],
  "Maximum Product Subarray": [
    { input: "[2,3,-2,4]", expectedOutput: "6", isHidden: false },
    { input: "[-2,0,-1]", expectedOutput: "0", isHidden: false },
    { input: "[-2,3,-4]", expectedOutput: "24", isHidden: true },
    { input: "[0,2]", expectedOutput: "2", isHidden: true },
    { input: "[-4,-3,-2]", expectedOutput: "12", isHidden: true },
    { input: "[-2]", expectedOutput: "-2", isHidden: true },
    { input: "[-2,-3,7]", expectedOutput: "42", isHidden: true },
  ],
  "Valid Anagram": [
    { input: '"anagram"\n"nagaram"', expectedOutput: "true", isHidden: false },
    { input: '"rat"\n"car"', expectedOutput: "false", isHidden: false },
    { input: '"a"\n"a"', expectedOutput: "true", isHidden: true },
    { input: '"ab"\n"a"', expectedOutput: "false", isHidden: true },
    { input: '"aacc"\n"ccac"', expectedOutput: "false", isHidden: true },
  ],
  "Move Zeroes to End": [
    { input: "[0,1,0,3,12]", expectedOutput: "[1,3,12,0,0]", isHidden: false },
    { input: "[0]", expectedOutput: "[0]", isHidden: false },
    { input: "[1,2,3]", expectedOutput: "[1,2,3]", isHidden: true },
    { input: "[0,0,0,1]", expectedOutput: "[1,0,0,0]", isHidden: true },
    { input: "[4,2,4,0,0,3,0,5,1,0]", expectedOutput: "[4,2,4,3,5,1,0,0,0,0]", isHidden: true },
  ],
  "Power of Two": [
    { input: "1", expectedOutput: "true", isHidden: false },
    { input: "16", expectedOutput: "true", isHidden: false },
    { input: "3", expectedOutput: "false", isHidden: false },
    { input: "0", expectedOutput: "false", isHidden: true },
    { input: "-16", expectedOutput: "false", isHidden: true },
    { input: "1073741824", expectedOutput: "true", isHidden: true },
  ],
  "Find Pivot Index": [
    { input: "[1,7,3,6,5,6]", expectedOutput: "3", isHidden: false },
    { input: "[1,2,3]", expectedOutput: "-1", isHidden: false },
    { input: "[2,1,-1]", expectedOutput: "0", isHidden: false },
    { input: "[0,0,0,0]", expectedOutput: "0", isHidden: true },
    { input: "[-1,-1,-1,-1,-1,0]", expectedOutput: "2", isHidden: true },
  ],
  "Longest Common Prefix": [
    { input: '["flower","flow","flight"]', expectedOutput: '"fl"', isHidden: false },
    { input: '["dog","racecar","car"]', expectedOutput: '""', isHidden: false },
    { input: '["a"]', expectedOutput: '"a"', isHidden: true },
    { input: '["interspecies","interstellar","interstate"]', expectedOutput: '"inters"', isHidden: true },
    { input: '["throne","throne"]', expectedOutput: '"throne"', isHidden: true },
    { input: '["","b"]', expectedOutput: '""', isHidden: true },
  ],
  "Sort Array By Parity": [
    { input: "[3,1,2,4]", expectedOutput: "[2,4,3,1]", isHidden: false },
    { input: "[0]", expectedOutput: "[0]", isHidden: false },
    { input: "[1,3,5]", expectedOutput: "[1,3,5]", isHidden: true },
    { input: "[2,4,6]", expectedOutput: "[2,4,6]", isHidden: true },
    { input: "[0,1,2]", expectedOutput: "[0,2,1]", isHidden: true },
  ],
  "Number of 1 Bits": [
    { input: "11", expectedOutput: "3", isHidden: false },
    { input: "128", expectedOutput: "1", isHidden: false },
    { input: "2147483645", expectedOutput: "30", isHidden: true },
    { input: "0", expectedOutput: "0", isHidden: true },
    { input: "1", expectedOutput: "1", isHidden: true },
    { input: "7", expectedOutput: "3", isHidden: true },
  ],
  "Remove All Adjacent Duplicates In String": [
    { input: '"abbaca"', expectedOutput: '"ca"', isHidden: false },
    { input: '"azxxzy"', expectedOutput: '"ay"', isHidden: false },
    { input: '"a"', expectedOutput: '"a"', isHidden: true },
    { input: '"aa"', expectedOutput: '""', isHidden: true },
    { input: '"baab"', expectedOutput: '""', isHidden: true },
    { input: '"abbbaca"', expectedOutput: '"abaca"', isHidden: true },
  ]
};

async function syncHardTestCases() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGO_URI is not defined");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for Test Case Enrichment");

    let updatedCount = 0;
    for (const [title, testCases] of Object.entries(HARD_TEST_CASES_MAP)) {
      const res = await PlacementQuestion.updateOne(
        { title, category: "coding" },
        { $set: { testCases } }
      );
      if (res.matchedCount > 0) {
        updatedCount++;
        console.log(`✓ Enriched "${title}" with ${testCases.length} comprehensive test cases.`);
      }
    }

    console.log(`\n🎉 Successfully enriched ${updatedCount} coding questions with LeetCode-grade hard & edge test suites.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error updating test cases:", err);
    process.exit(1);
  }
}

syncHardTestCases();
