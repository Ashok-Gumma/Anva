import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { CODING_QUESTIONS } from "../lib/placementCodingQuestionsData.js";
import PlacementQuestion from "../models/PlacementQuestion.js";

// Helper reference algorithms to compute accurate large test case outputs
const solvers = {
  "Two Sum": (nums, target) => {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
      const comp = target - nums[i];
      if (map.has(comp)) return `[${map.get(comp)},${i}]`;
      map.set(nums[i], i);
    }
    return "[]";
  },
  "Container With Most Water": (height) => {
    let l = 0, r = height.length - 1, max = 0;
    while (l < r) {
      max = Math.max(max, (r - l) * Math.min(height[l], height[r]));
      if (height[l] < height[r]) l++;
      else r--;
    }
    return String(max);
  },
  "Longest Substring Without Repeating Characters": (s) => {
    const map = new Map();
    let max = 0, l = 0;
    for (let r = 0; r < s.length; r++) {
      if (map.has(s[r])) l = Math.max(l, map.get(s[r]) + 1);
      map.set(s[r], r);
      max = Math.max(max, r - l + 1);
    }
    return String(max);
  },
  "Trapping Rain Water": (h) => {
    let l = 0, r = h.length - 1, lMax = 0, rMax = 0, water = 0;
    while (l < r) {
      if (h[l] < h[r]) {
        if (h[l] >= lMax) lMax = h[l];
        else water += lMax - h[l];
        l++;
      } else {
        if (h[r] >= rMax) rMax = h[r];
        else water += rMax - h[r];
        r--;
      }
    }
    return String(water);
  },
  "Word Break": (s, dict) => {
    const set = new Set(dict);
    const dp = new Array(s.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= s.length; i++) {
      for (let j = 0; j < i; j++) {
        if (dp[j] && set.has(s.substring(j, i))) {
          dp[i] = true;
          break;
        }
      }
    }
    return String(dp[s.length]);
  },
  "Course Schedule": (numCourses, prereqs) => {
    const inDeg = new Array(numCourses).fill(0);
    const adj = Array.from({ length: numCourses }, () => []);
    for (const [d, s] of prereqs) {
      adj[s].push(d);
      inDeg[d]++;
    }
    const q = [];
    for (let i = 0; i < numCourses; i++) if (inDeg[i] === 0) q.push(i);
    let count = 0;
    while (q.length > 0) {
      const curr = q.shift();
      count++;
      for (const nxt of adj[curr]) {
        inDeg[nxt]--;
        if (inDeg[nxt] === 0) q.push(nxt);
      }
    }
    return String(count === numCourses);
  },
  "LRU Cache": () => "[1,-1]",
  "Median of Two Sorted Arrays": (nums1, nums2) => {
    const merged = [...nums1, ...nums2].sort((a, b) => a - b);
    const n = merged.length;
    if (n % 2 === 1) return (merged[Math.floor(n / 2)]).toFixed(1);
    return ((merged[n / 2 - 1] + merged[n / 2]) / 2).toFixed(1);
  },
  "Meeting Rooms II": (intervals) => {
    if (!intervals.length) return "0";
    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
    const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
    let rooms = 0, endIdx = 0;
    for (let i = 0; i < starts.length; i++) {
      if (starts[i] < ends[endIdx]) rooms++;
      else endIdx++;
    }
    return String(rooms);
  },
  "Subarray Sum Equals K": (nums, k) => {
    const map = new Map([[0, 1]]);
    let sum = 0, count = 0;
    for (const n of nums) {
      sum += n;
      if (map.has(sum - k)) count += map.get(sum - k);
      map.set(sum, (map.get(sum) || 0) + 1);
    }
    return String(count);
  },
  "Merge K Sorted Lists": (lists) => {
    const flat = lists.flat().sort((a, b) => a - b);
    return JSON.stringify(flat);
  },
  "Kth Largest Element in an Array": (nums, k) => {
    const sorted = [...nums].sort((a, b) => b - a);
    return String(sorted[k - 1]);
  },
  "Unique Paths": (m, n) => {
    const dp = Array.from({ length: m }, () => new Array(n).fill(1));
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      }
    }
    return String(dp[m - 1][n - 1]);
  },
  "Search in Rotated Sorted Array": (nums, target) => {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
      const m = Math.floor((l + r) / 2);
      if (nums[m] === target) return String(m);
      if (nums[l] <= nums[m]) {
        if (target >= nums[l] && target < nums[m]) r = m - 1;
        else l = m + 1;
      } else {
        if (target > nums[m] && target <= nums[r]) l = m + 1;
        else r = m - 1;
      }
    }
    return "-1";
  },
  "Find First and Last Position of Element in Sorted Array": (nums, target) => {
    let first = -1, last = -1;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === target) {
        if (first === -1) first = i;
        last = i;
      }
    }
    return `[${first},${last}]`;
  },
  "Bus Routes": (routes, source, target) => {
    if (source === target) return "0";
    const stopToBuses = new Map();
    routes.forEach((r, busIdx) => {
      r.forEach(stop => {
        if (!stopToBuses.has(stop)) stopToBuses.set(stop, []);
        stopToBuses.get(stop).push(busIdx);
      });
    });
    const visitedBuses = new Set();
    const visitedStops = new Set([source]);
    const q = [[source, 0]];
    while (q.length > 0) {
      const [currStop, busesTaken] = q.shift();
      if (currStop === target) return String(busesTaken);
      const buses = stopToBuses.get(currStop) || [];
      for (const bus of buses) {
        if (visitedBuses.has(bus)) continue;
        visitedBuses.add(bus);
        for (const nextStop of routes[bus]) {
          if (!visitedStops.has(nextStop)) {
            visitedStops.add(nextStop);
            q.push([nextStop, busesTaken + 1]);
          }
        }
      }
    }
    return "-1";
  },
  "Number of Islands": (grid) => {
    if (!grid.length) return "0";
    let count = 0;
    const g = grid.map(r => [...r]);
    const dfs = (r, c) => {
      if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] !== "1") return;
      g[r][c] = "0";
      dfs(r + 1, c);
      dfs(r - 1, c);
      dfs(r, c + 1);
      dfs(r, c - 1);
    };
    for (let i = 0; i < g.length; i++) {
      for (let j = 0; j < g[0].length; j++) {
        if (g[i][j] === "1") {
          count++;
          dfs(i, j);
        }
      }
    }
    return String(count);
  },
  "Rotting Oranges": (grid) => {
    let fresh = 0;
    const q = [];
    const g = grid.map(r => [...r]);
    for (let i = 0; i < g.length; i++) {
      for (let j = 0; j < g[0].length; j++) {
        if (g[i][j] === 2) q.push([i, j, 0]);
        else if (g[i][j] === 1) fresh++;
      }
    }
    let mins = 0;
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    while (q.length > 0) {
      const [r, c, m] = q.shift();
      mins = Math.max(mins, m);
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < g.length && nc < g[0].length && g[nr][nc] === 1) {
          g[nr][nc] = 2;
          fresh--;
          q.push([nr, nc, m + 1]);
        }
      }
    }
    return fresh === 0 ? String(mins) : "-1";
  },
  "K Closest Points to Origin": (points, k) => {
    const sorted = [...points].sort((a, b) => (a[0] ** 2 + a[1] ** 2) - (b[0] ** 2 + b[1] ** 2));
    return JSON.stringify(sorted.slice(0, k));
  },
  "Merge Intervals": (intervals) => {
    if (!intervals.length) return "[]";
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    const res = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      const last = res[res.length - 1];
      if (sorted[i][0] <= last[1]) {
        last[1] = Math.max(last[1], sorted[i][1]);
      } else {
        res.push(sorted[i]);
      }
    }
    return JSON.stringify(res);
  },
  "Coin Change": (coins, amount) => {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
      for (const c of coins) {
        if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);
      }
    }
    return dp[amount] === Infinity ? "-1" : String(dp[amount]);
  },
  "Valid Anagram": (s, t) => {
    if (s.length !== t.length) return "false";
    const count = {};
    for (const c of s) count[c] = (count[c] || 0) + 1;
    for (const c of t) {
      if (!count[c]) return "false";
      count[c]--;
    }
    return "true";
  },
  "Second Largest Element in Array": (nums) => {
    let first = -Infinity, second = -Infinity;
    for (const n of nums) {
      if (n > first) {
        second = first;
        first = n;
      } else if (n > second && n < first) {
        second = n;
      }
    }
    return second === -Infinity ? "-1" : String(second);
  },
  "Count Inversions in an Array": (nums) => {
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        if (nums[i] > nums[j]) count++;
      }
    }
    return String(count);
  },
  "Leaders in an Array": (nums) => {
    const leaders = [];
    let maxFromRight = -Infinity;
    for (let i = nums.length - 1; i >= 0; i--) {
      if (nums[i] >= maxFromRight) {
        leaders.push(nums[i]);
        maxFromRight = nums[i];
      }
    }
    return JSON.stringify(leaders.reverse());
  },
  "Best Time to Buy and Sell Stock": (prices) => {
    let minPrice = Infinity, maxProfit = 0;
    for (const p of prices) {
      minPrice = Math.min(minPrice, p);
      maxProfit = Math.max(maxProfit, p - minPrice);
    }
    return String(maxProfit);
  },
  "Reverse Words in a String": (s) => {
    return JSON.stringify(s.trim().split(/\s+/).reverse().join(" "));
  },
  "Move Zeroes to End": (nums) => {
    const res = [...nums];
    let pos = 0;
    for (let i = 0; i < res.length; i++) {
      if (res[i] !== 0) res[pos++] = res[i];
    }
    while (pos < res.length) res[pos++] = 0;
    return JSON.stringify(res);
  },
  "Power of Two": (n) => {
    return String(n > 0 && (n & (n - 1)) === 0);
  },
  "Binary String Operations": (str) => {
    if (!str) return "0";
    let res = parseInt(str[0], 10);
    for (let i = 1; i < str.length; i += 2) {
      const op = str[i];
      const val = parseInt(str[i + 1], 10);
      if (op === "A") res = res & val;
      else if (op === "B") res = res | val;
      else if (op === "C") res = res ^ val;
    }
    return String(res);
  },
  "Find Pivot Index": (nums) => {
    const total = nums.reduce((a, b) => a + b, 0);
    let leftSum = 0;
    for (let i = 0; i < nums.length; i++) {
      if (leftSum === total - leftSum - nums[i]) return String(i);
      leftSum += nums[i];
    }
    return "-1";
  },
  "Detect Loop in Linked List": (arr, pos) => {
    return String(pos >= 0 && pos < arr.length);
  },
  "Remove All Adjacent Duplicates In String": (s) => {
    const st = [];
    for (const c of s) {
      if (st.length > 0 && st[st.length - 1] === c) st.pop();
      else st.push(c);
    }
    return JSON.stringify(st.join(""));
  },
  "Running Sum of 1d Array": (nums) => {
    const res = [];
    let sum = 0;
    for (const n of nums) {
      sum += n;
      res.push(sum);
    }
    return JSON.stringify(res);
  },
  "Roman to Integer": (s) => {
    const val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let total = 0;
    for (let i = 0; i < s.length; i++) {
      const curr = val[s[i]] || 0;
      const nxt = val[s[i + 1]] || 0;
      if (curr < nxt) total -= curr;
      else total += curr;
    }
    return String(total);
  },
  "Majority Element": (nums) => {
    let candidate = nums[0], count = 0;
    for (const n of nums) {
      if (count === 0) candidate = n;
      count += n === candidate ? 1 : -1;
    }
    return String(candidate);
  },
  "Longest Consecutive Sequence": (nums) => {
    if (!nums.length) return "0";
    const set = new Set(nums);
    let maxStreak = 0;
    for (const num of set) {
      if (!set.has(num - 1)) {
        let curr = num, streak = 1;
        while (set.has(curr + 1)) {
          curr++;
          streak++;
        }
        maxStreak = Math.max(maxStreak, streak);
      }
    }
    return String(maxStreak);
  },
  "Merge Two Sorted Lists": (l1, l2) => {
    const flat = [...l1, ...l2].sort((a, b) => a - b);
    return JSON.stringify(flat);
  },
  "Reverse Integer": (x) => {
    const sign = x < 0 ? -1 : 1;
    const rev = parseInt(Math.abs(x).toString().split("").reverse().join(""), 10) * sign;
    if (rev < -Math.pow(2, 31) || rev > Math.pow(2, 31) - 1) return "0";
    return String(rev);
  },
  "Single Number": (nums) => {
    let x = 0;
    for (const n of nums) x ^= n;
    return String(x);
  },
  "Climbing Stairs": (n) => {
    if (n <= 2) return String(n);
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
      const c = a + b;
      a = b;
      b = c;
    }
    return String(b);
  },
  "Longest Common Prefix": (strs) => {
    if (!strs.length) return '""';
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
      while (!strs[i].startsWith(prefix)) {
        prefix = prefix.substring(0, prefix.length - 1);
        if (!prefix) return '""';
      }
    }
    return JSON.stringify(prefix);
  },
  "Sort Array By Parity": (nums) => {
    const evens = nums.filter(n => n % 2 === 0);
    const odds = nums.filter(n => n % 2 !== 0);
    return JSON.stringify([...evens, ...odds]);
  },
  "Number of 1 Bits": (n) => {
    let count = 0;
    let num = Number(n);
    while (num > 0) {
      count += num & 1;
      num = Math.floor(num / 2);
    }
    return String(count);
  },
  "Maximum Product Subarray": (nums) => {
    let maxP = nums[0], minP = nums[0], res = nums[0];
    for (let i = 1; i < nums.length; i++) {
      const n = nums[i];
      if (n < 0) [maxP, minP] = [minP, maxP];
      maxP = Math.max(n, maxP * n);
      minP = Math.min(n, minP * n);
      res = Math.max(res, maxP);
    }
    return String(res);
  },
};

// Generates 8-15 rich, anti-brute-force test cases for each question
function generateComprehensiveTestCases(q) {
  const title = q.title;
  const solver = solvers[title];

  const baseCases = (q.testCases || []).map(tc => ({ ...tc }));

  // Dynamic test cases builder
  const extraCases = [];

  switch (title) {
    case "Two Sum": {
      // Large array: 1000 elements, target is sum of first and last
      const largeArr = Array.from({ length: 800 }, (_, i) => i * 3 + 1);
      const target = largeArr[0] + largeArr[799];
      extraCases.push(
        { input: `${JSON.stringify(largeArr)}\n${target}`, isHidden: true },
        { input: `[-1000,-500,0,500,1000]\n0`, isHidden: true },
        { input: `[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]\n39`, isHidden: true },
        { input: `[5,75,25]\n100`, isHidden: true },
        { input: `[0,0]\n0`, isHidden: true },
        { input: `[110,230,450,890,999]\n1449`, isHidden: true }
      );
      break;
    }
    case "Container With Most Water": {
      const largeAsc = Array.from({ length: 500 }, (_, i) => i + 1);
      const largeDesc = Array.from({ length: 500 }, (_, i) => 500 - i);
      extraCases.push(
        { input: JSON.stringify(largeAsc), isHidden: true },
        { input: JSON.stringify(largeDesc), isHidden: true },
        { input: "[10,1,1,1,1,1,1,1,1,10]", isHidden: true },
        { input: "[1,2,4,3]", isHidden: true },
        { input: "[2,3,4,5,18,17,6]", isHidden: true },
        { input: "[100,100]", isHidden: true }
      );
      break;
    }
    case "Longest Substring Without Repeating Characters": {
      extraCases.push(
        { input: '"abcdefghijklmnopqrstuvwxyz"', isHidden: true },
        { input: '"aab"', isHidden: true },
        { input: '"cdd"', isHidden: true },
        { input: '"tmmzuxt"', isHidden: true },
        { input: '"anviaj"', isHidden: true },
        { input: '"a quick brown fox jumps over the lazy dog"', isHidden: true },
        { input: '""', isHidden: true },
        { input: '" "', isHidden: true }
      );
      break;
    }
    case "Trapping Rain Water": {
      const stepped = [0, 10, 0, 20, 0, 30, 0, 20, 0, 10, 0];
      extraCases.push(
        { input: JSON.stringify(stepped), isHidden: true },
        { input: "[5,2,1,2,1,5]", isHidden: true },
        { input: "[10,0,10]", isHidden: true },
        { input: "[1,2,3,4,5]", isHidden: true },
        { input: "[5,4,3,2,1]", isHidden: true },
        { input: "[0,2,0]", isHidden: true },
        { input: "[6,4,2,0,3,2,0,3,1,4,5,3,2,7,5,3,0,1,2,1,3,4,6,8,1,3]", isHidden: true }
      );
      break;
    }
    case "Word Break": {
      extraCases.push(
        { input: '"cars"\n["car","ca","rs"]', isHidden: true },
        { input: '"aaaaaaa"\n["aaaa","aaa"]', isHidden: true },
        { input: '"goalspecial"\n["go","goal","special"]', isHidden: true },
        { input: '"program"\n["pro","gram"]', isHidden: true },
        { input: '"abcd"\n["a","abc","b","cd"]', isHidden: true },
        { input: '"a"\n["b"]', isHidden: true }
      );
      break;
    }
    case "Course Schedule": {
      extraCases.push(
        { input: "3\n[[1,0],[2,1]]", isHidden: true },
        { input: "4\n[[1,0],[2,0],[3,1],[3,2]]", isHidden: true },
        { input: "3\n[[0,1],[1,2],[2,0]]", isHidden: true },
        { input: "1\n[]", isHidden: true },
        { input: "5\n[[1,0],[2,1],[3,2],[4,3]]", isHidden: true },
        { input: "4\n[[2,0],[1,0],[3,1],[3,2],[1,3]]", isHidden: true }
      );
      break;
    }
    case "Median of Two Sorted Arrays": {
      extraCases.push(
        { input: "[0,0]\n[0,0]", isHidden: true },
        { input: "[]\n[1]", isHidden: true },
        { input: "[2]\n[]", isHidden: true },
        { input: "[1,2,3,4,5]\n[6,7,8,9,10]", isHidden: true },
        { input: "[1,1,1]\n[1,1,1]", isHidden: true },
        { input: "[100]\n[101]", isHidden: true },
        { input: "[1,5,9]\n[2,4,6,8,10]", isHidden: true }
      );
      break;
    }
    case "Subarray Sum Equals K": {
      const ones = new Array(200).fill(1);
      extraCases.push(
        { input: `${JSON.stringify(ones)}\n5`, isHidden: true },
        { input: "[1,-1,0]\n0", isHidden: true },
        { input: "[-1,-1,1]\n0", isHidden: true },
        { input: "[0,0,0,0,0]\n0", isHidden: true },
        { input: "[100,1,2,3,4]\n6", isHidden: true },
        { input: "[1,2,1,2,1]\n3", isHidden: true }
      );
      break;
    }
    case "Kth Largest Element in an Array": {
      const bigArr = Array.from({ length: 400 }, (_, i) => i * 2);
      extraCases.push(
        { input: `${JSON.stringify(bigArr)}\n10`, isHidden: true },
        { input: "[1]\n1", isHidden: true },
        { input: "[-1,-1]\n2", isHidden: true },
        { input: "[7,6,5,4,3,2,1]\n5", isHidden: true },
        { input: "[99,99]\n1", isHidden: true },
        { input: "[5,2,4,1,3,6,0]\n4", isHidden: true }
      );
      break;
    }
    case "Search in Rotated Sorted Array": {
      const rot = [400, 500, 600, 700, 10, 20, 30, 40, 50, 100, 200, 300];
      extraCases.push(
        { input: `${JSON.stringify(rot)}\n20`, isHidden: true },
        { input: `${JSON.stringify(rot)}\n999`, isHidden: true },
        { input: "[1]\n0", isHidden: true },
        { input: "[1]\n1", isHidden: true },
        { input: "[1,3]\n3", isHidden: true },
        { input: "[3,1]\n1", isHidden: true },
        { input: "[5,1,3]\n5", isHidden: true }
      );
      break;
    }
    case "Merge Intervals": {
      extraCases.push(
        { input: "[[1,4],[0,4]]", isHidden: true },
        { input: "[[1,4],[2,3]]", isHidden: true },
        { input: "[[1,4],[0,0]]", isHidden: true },
        { input: "[[1,10],[2,3],[4,5],[6,7],[8,9]]", isHidden: true },
        { input: "[[2,3],[4,5],[6,7],[8,9],[1,10]]", isHidden: true },
        { input: "[[1,4],[5,6]]", isHidden: true }
      );
      break;
    }
    case "Coin Change": {
      extraCases.push(
        { input: "[1]\n0", isHidden: true },
        { input: "[1]\n1", isHidden: true },
        { input: "[1]\n2", isHidden: true },
        { input: "[186,419,83,408]\n6249", isHidden: true },
        { input: "[2,5,10,1]\n27", isHidden: true },
        { input: "[2]\n1", isHidden: true },
        { input: "[3,7,405,436]\n8839", isHidden: true }
      );
      break;
    }
    case "Best Time to Buy and Sell Stock": {
      const decr = Array.from({ length: 300 }, (_, i) => 1000 - i);
      const incr = Array.from({ length: 300 }, (_, i) => i + 5);
      extraCases.push(
        { input: JSON.stringify(decr), isHidden: true },
        { input: JSON.stringify(incr), isHidden: true },
        { input: "[1,2]", isHidden: true },
        { input: "[2,4,1]", isHidden: true },
        { input: "[3,2,6,5,0,3]", isHidden: true },
        { input: "[2,2,2,2]", isHidden: true }
      );
      break;
    }
    case "Running Sum of 1d Array": {
      const arr = Array.from({ length: 200 }, (_, i) => i + 1);
      extraCases.push(
        { input: JSON.stringify(arr), isHidden: true },
        { input: "[1]", isHidden: true },
        { input: "[-1,-2,-3]", isHidden: true },
        { input: "[0,0,0]", isHidden: true },
        { input: "[1000,-1000,1000]", isHidden: true },
        { input: "[10,20,30,40,50]", isHidden: true }
      );
      break;
    }
    case "Roman to Integer": {
      extraCases.push(
        { input: '"I"', isHidden: true },
        { input: '"IV"', isHidden: true },
        { input: '"IX"', isHidden: true },
        { input: '"XL"', isHidden: true },
        { input: '"XC"', isHidden: true },
        { input: '"CD"', isHidden: true },
        { input: '"CM"', isHidden: true },
        { input: '"MMMCMXCIX"', isHidden: true },
        { input: '"MDCLXVI"', isHidden: true }
      );
      break;
    }
    case "Majority Element": {
      const majArr = new Array(300).fill(42);
      for (let i = 0; i < 140; i++) majArr[i] = i;
      extraCases.push(
        { input: JSON.stringify(majArr), isHidden: true },
        { input: "[1]", isHidden: true },
        { input: "[6,5,5]", isHidden: true },
        { input: "[10,10,10,20,10]", isHidden: true },
        { input: "[-1,-1,2,-1]", isHidden: true },
        { input: "[2,2,1,1,1,2,2]", isHidden: true }
      );
      break;
    }
    case "Longest Consecutive Sequence": {
      const seqArr = Array.from({ length: 300 }, (_, i) => 300 - i);
      extraCases.push(
        { input: JSON.stringify(seqArr), isHidden: true },
        { input: "[]", isHidden: true },
        { input: "[1]", isHidden: true },
        { input: "[1,2,0,1]", isHidden: true },
        { input: "[-2,-3,-1,0,1]", isHidden: true },
        { input: "[9,1,4,7,3,-1,0,5,8,-1,6]", isHidden: true }
      );
      break;
    }
    case "Single Number": {
      const pairs = [];
      for (let i = 1; i <= 200; i++) {
        pairs.push(i, i);
      }
      pairs.push(9999);
      extraCases.push(
        { input: JSON.stringify(pairs), isHidden: true },
        { input: "[1]", isHidden: true },
        { input: "[-1,-1,-2]", isHidden: true },
        { input: "[0,1,0]", isHidden: true },
        { input: "[30000,500,30000]", isHidden: true }
      );
      break;
    }
    case "Climbing Stairs": {
      extraCases.push(
        { input: "1", isHidden: true },
        { input: "4", isHidden: true },
        { input: "5", isHidden: true },
        { input: "10", isHidden: true },
        { input: "20", isHidden: true },
        { input: "30", isHidden: true },
        { input: "35", isHidden: true }
      );
      break;
    }
    case "Detect Loop in Linked List": {
      extraCases.push(
        { input: "[1,2,3,4,5]\n-1", isHidden: true },
        { input: "[1,2,3,4,5]\n0", isHidden: true },
        { input: "[1,2,3,4,5]\n4", isHidden: true },
        { input: "[10,20,30]\n-1", isHidden: true },
        { input: "[1,2,3,4,5,6,7,8,9,10]\n5", isHidden: true }
      );
      break;
    }
    case "Count Inversions in an Array": {
      extraCases.push(
        { input: "[10,10,10]", isHidden: true },
        { input: "[5,4,3,2,1]", isHidden: true },
        { input: "[1]", isHidden: true },
        { input: "[1,2,3,4,5]", isHidden: true },
        { input: "[10,9,8,7,6,5,4,3,2,1]", isHidden: true },
        { input: "[1,20,6,4,5]", isHidden: true }
      );
      break;
    }
    case "Maximum Product Subarray": {
      extraCases.push(
        { input: "[-2,3,-4]", isHidden: true },
        { input: "[0,2]", isHidden: true },
        { input: "[-4,-3,-2]", isHidden: true },
        { input: "[-2]", isHidden: true },
        { input: "[-2,-3,7]", isHidden: true },
        { input: "[-1,-2,-3,-4]", isHidden: true },
        { input: "[2,-5,-2,-4,3]", isHidden: true }
      );
      break;
    }
    case "Move Zeroes to End": {
      const zeroHeavy = [0, 0, 1, 0, 3, 0, 5, 0, 0, 12, 0];
      extraCases.push(
        { input: JSON.stringify(zeroHeavy), isHidden: true },
        { input: "[1,2,3]", isHidden: true },
        { input: "[0,0,0,1]", isHidden: true },
        { input: "[4,2,4,0,0,3,0,5,1,0]", isHidden: true },
        { input: "[0,0,0,0,0]", isHidden: true }
      );
      break;
    }
    case "Power of Two": {
      extraCases.push(
        { input: "0", isHidden: true },
        { input: "-16", isHidden: true },
        { input: "1073741824", isHidden: true },
        { input: "2147483646", isHidden: true },
        { input: "536870912", isHidden: true }
      );
      break;
    }
    case "Longest Common Prefix": {
      extraCases.push(
        { input: '["a"]', isHidden: true },
        { input: '["interspecies","interstellar","interstate"]', isHidden: true },
        { input: '["throne","throne"]', isHidden: true },
        { input: '["","b"]', isHidden: true },
        { input: '["ab","a"]', isHidden: true }
      );
      break;
    }
    case "Number of 1 Bits": {
      extraCases.push(
        { input: "0", isHidden: true },
        { input: "1", isHidden: true },
        { input: "7", isHidden: true },
        { input: "2147483647", isHidden: true },
        { input: "1024", isHidden: true }
      );
      break;
    }
    case "Meeting Rooms II": {
      extraCases.push(
        { input: "[[7,10],[2,4]]", isHidden: true },
        { input: "[[1,5],[5,6],[6,10],[10,15]]", isHidden: true },
        { input: "[[1,10],[2,9],[3,8],[4,7]]", isHidden: true },
        { input: "[[1,4],[2,5],[7,9]]", isHidden: true },
        { input: "[[9,10],[4,9],[4,17]]", isHidden: true }
      );
      break;
    }
    case "Unique Paths": {
      extraCases.push(
        { input: "1\n1", isHidden: true },
        { input: "3\n3", isHidden: true },
        { input: "7\n3", isHidden: true },
        { input: "3\n7", isHidden: true },
        { input: "10\n10", isHidden: true },
        { input: "1\n10", isHidden: true },
        { input: "10\n1", isHidden: true }
      );
      break;
    }
    case "Find First and Last Position of Element in Sorted Array": {
      const bigSorted = Array.from({ length: 400 }, (_, i) => Math.floor(i / 4));
      extraCases.push(
        { input: `${JSON.stringify(bigSorted)}\n50`, isHidden: true },
        { input: "[]\n0", isHidden: true },
        { input: "[1]\n1", isHidden: true },
        { input: "[1]\n2", isHidden: true },
        { input: "[2,2,2,2,2,2,2]\n2", isHidden: true },
        { input: "[1,3,5,7,9]\n5", isHidden: true },
        { input: "[1,2,3,4,5]\n6", isHidden: true }
      );
      break;
    }
    case "Bus Routes": {
      extraCases.push(
        { input: "[[1,2,7],[3,6,7]]\n1\n6", isHidden: true },
        { input: "[[7,12],[4,5,15],[6],[15,19],[9,12,13]]\n15\n12", isHidden: true },
        { input: "[[1,2,3],[4,5,6]]\n1\n5", isHidden: true },
        { input: "[[1,2],[2,3],[3,4],[4,5]]\n1\n5", isHidden: true },
        { input: "[[1,7],[7,10],[10,15]]\n1\n15", isHidden: true }
      );
      break;
    }
    case "Number of Islands": {
      const checker = [
        ["1","0","1","0","1"],
        ["0","1","0","1","0"],
        ["1","0","1","0","1"],
        ["0","1","0","1","0"]
      ];
      extraCases.push(
        { input: JSON.stringify(checker), isHidden: true },
        { input: '[["0"]]', isHidden: true },
        { input: '[["1"]]', isHidden: true },
        { input: '[["1","1","1"],["1","1","1"],["1","1","1"]]', isHidden: true },
        { input: '[["1","0","0"],["0","0","0"],["0","0","1"]]', isHidden: true }
      );
      break;
    }
    case "Rotting Oranges": {
      const noRotten = [[1,1,1],[1,1,1],[1,1,1]];
      const isolated = [[2,1,1],[0,1,1],[1,0,1]];
      extraCases.push(
        { input: JSON.stringify(noRotten), isHidden: true },
        { input: JSON.stringify(isolated), isHidden: true },
        { input: "[[0,2]]", isHidden: true },
        { input: "[[2,2],[1,1],[0,0],[2,0]]", isHidden: true },
        { input: "[[2,1,1],[1,1,0],[0,1,1]]", isHidden: true }
      );
      break;
    }
    case "K Closest Points to Origin": {
      const manyPts = Array.from({ length: 100 }, (_, i) => [i + 1, (i + 1) * 2]);
      extraCases.push(
        { input: `${JSON.stringify(manyPts)}\n5`, isHidden: true },
        { input: "[[1,3],[-2,2]]\n1", isHidden: true },
        { input: "[[3,3],[5,-1],[-2,4]]\n2", isHidden: true },
        { input: "[[0,1],[1,0]]\n2", isHidden: true },
        { input: "[[-5,4],[-6,-5],[4,6]]\n2", isHidden: true }
      );
      break;
    }
    case "Valid Anagram": {
      extraCases.push(
        { input: '"a"\n"a"', isHidden: true },
        { input: '"ab"\n"a"', isHidden: true },
        { input: '"aacc"\n"ccac"', expectedOutput: "false", isHidden: true },
        { input: '"listen"\n"silent"', expectedOutput: "true", isHidden: true },
        { input: '"triangle"\n"integral"', expectedOutput: "true", isHidden: true },
        { input: '"fluster"\n"restful"', expectedOutput: "true", isHidden: true }
      );
      break;
    }
    case "Second Largest Element in Array": {
      extraCases.push(
        { input: "[10,10,10]", isHidden: true },
        { input: "[5]", isHidden: true },
        { input: "[1,2,3,4,5]", isHidden: true },
        { input: "[5,4,3,2,1]", isHidden: true },
        { input: "[-10,-5,-20,-2]", isHidden: true },
        { input: "[100,50,100,25]", isHidden: true },
        { input: "[1,1,1,1,2]", isHidden: true }
      );
      break;
    }
    case "Leaders in an Array": {
      extraCases.push(
        { input: "[5]", isHidden: true },
        { input: "[10,20,30]", isHidden: true },
        { input: "[30,20,10]", isHidden: true },
        { input: "[1,2,3,4,0]", isHidden: true },
        { input: "[5,5,5,5]", isHidden: true },
        { input: "[16,17,4,3,5,2]", isHidden: true }
      );
      break;
    }
    case "Reverse Words in a String": {
      extraCases.push(
        { input: '"  hello world  "', isHidden: true },
        { input: '"a good   example"', isHidden: true },
        { input: '"EPIC"', isHidden: true },
        { input: '"  Bob    Loves  Alice   "', isHidden: true },
        { input: '"Alice does not even like bob"', isHidden: true }
      );
      break;
    }
    case "Binary String Operations": {
      extraCases.push(
        { input: '"1A0B1"', isHidden: true },
        { input: '"1C1C1A0"', isHidden: true },
        { input: '"0C1A1B1C1"', isHidden: true },
        { input: '"1B1B1B1"', isHidden: true },
        { input: '"0A0A0A0"', isHidden: true }
      );
      break;
    }
    case "Find Pivot Index": {
      extraCases.push(
        { input: "[1,2,3]", isHidden: true },
        { input: "[2,1,-1]", isHidden: true },
        { input: "[0,0,0,0]", isHidden: true },
        { input: "[-1,-1,-1,-1,-1,0]", isHidden: true },
        { input: "[-1,-1,0,1,1,0]", isHidden: true },
        { input: "[1,7,3,6,5,6]", isHidden: true }
      );
      break;
    }
    case "Merge Two Sorted Lists": {
      extraCases.push(
        { input: "[]\n[]", isHidden: true },
        { input: "[]\n[0]", isHidden: true },
        { input: "[1,3,5]\n[2,4,6]", isHidden: true },
        { input: "[1,1,1]\n[2,2,2]", isHidden: true },
        { input: "[5,10,15]\n[1,2,3,4,20]", isHidden: true }
      );
      break;
    }
    case "Merge K Sorted Lists": {
      extraCases.push(
        { input: "[]", isHidden: true },
        { input: "[[]]", isHidden: true },
        { input: "[[1,4,5],[1,3,4],[2,6]]", isHidden: true },
        { input: "[[1,2,3],[4,5,6],[7,8,9]]", isHidden: true },
        { input: "[[-10,-5,0],[1,2,3],[-2,4,8]]", isHidden: true }
      );
      break;
    }
    case "Reverse Integer": {
      extraCases.push(
        { input: "0", isHidden: true },
        { input: "1534236469", isHidden: true },
        { input: "-2147483648", isHidden: true },
        { input: "1000000003", isHidden: true },
        { input: "-120", isHidden: true }
      );
      break;
    }
    case "Sort Array By Parity": {
      extraCases.push(
        { input: "[0]", isHidden: true },
        { input: "[1,3,5]", isHidden: true },
        { input: "[2,4,6]", isHidden: true },
        { input: "[0,1,2]", isHidden: true },
        { input: "[1,2,3,4,5,6,7,8,9,10]", isHidden: true }
      );
      break;
    }
    case "Remove All Adjacent Duplicates In String": {
      extraCases.push(
        { input: '"a"', isHidden: true },
        { input: '"aa"', isHidden: true },
        { input: '"baab"', isHidden: true },
        { input: '"abbbaca"', isHidden: true },
        { input: '"aaaaaaaa"', isHidden: true },
        { input: '"mississippi"', isHidden: true }
      );
      break;
    }
    default: {
      // General fallback test cases
      extraCases.push(
        { input: baseCases[0]?.input || "[1,2,3]", isHidden: true }
      );
    }
  }

  // Calculate expected output for each test case using the reference solver if not provided
  const combined = [...baseCases];
  for (const tc of extraCases) {
    let expected = tc.expectedOutput;
    if (!expected && solver) {
      try {
        const lines = tc.input.split("\n").map(l => {
          try { return JSON.parse(l); } catch { return l; }
        });
        expected = solver(...lines);
      } catch (err) {
        console.error(`Solver error for "${title}":`, err.message);
      }
    }
    if (expected) {
      combined.push({
        input: tc.input,
        expectedOutput: expected,
        isHidden: tc.isHidden !== undefined ? tc.isHidden : true,
      });
    }
  }

  return combined;
}

async function runEnrichment() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGO_URI not found");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for Deep Test Case Enrichment");

    const enrichedQuestions = CODING_QUESTIONS.map(q => {
      const fullTestCases = generateComprehensiveTestCases(q);
      return {
        ...q,
        testCases: fullTestCases,
      };
    });

    // 1. Update in MongoDB
    let dbUpdated = 0;
    for (const q of enrichedQuestions) {
      const res = await PlacementQuestion.updateOne(
        { title: q.title, category: "coding" },
        { $set: { testCases: q.testCases } }
      );
      if (res.matchedCount > 0) {
        dbUpdated++;
      }
    }
    console.log(`✓ Updated MongoDB with anti-brute-force test cases for ${dbUpdated} questions.`);

    // 2. Persist to placementCodingQuestionsData.js source code
    const fileContent = `/**
 * Placement Hub - Comprehensive Company-Wise Coding Question Bank
 * Each company has up to 15 authentic, company-specific high-frequency coding questions
 * complete with multi-language starter code, test cases, hints, approaches, and reference solutions.
 */

export const CODING_QUESTIONS = ${JSON.stringify(enrichedQuestions, null, 2)};
`;

    const targetFilePath = path.resolve(__dirname, "../lib/placementCodingQuestionsData.js");
    fs.writeFileSync(targetFilePath, fileContent, "utf-8");
    console.log(`✓ Persisted enriched test cases to ${targetFilePath}`);

    // Print summary stats
    console.log("\n📊 Test Case Suite Summary:");
    enrichedQuestions.forEach(q => {
      const visible = q.testCases.filter(t => !t.isHidden).length;
      const hidden = q.testCases.filter(t => t.isHidden).length;
      console.log(`  • ${q.title}: ${q.testCases.length} total (${visible} visible, ${hidden} hidden/anti-brute-force)`);
    });

    await mongoose.disconnect();
    console.log("\n🎉 Full Test Case Enrichment Complete!");
    process.exit(0);
  } catch (err) {
    console.error("Enrichment Failed:", err);
    process.exit(1);
  }
}

runEnrichment();
