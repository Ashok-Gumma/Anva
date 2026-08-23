/**
 * Placement Hub - Comprehensive Company-Wise Coding Question Bank
 * Each company has up to 15 authentic, company-specific high-frequency coding questions
 * complete with multi-language starter code, test cases, hints, approaches, and reference solutions.
 */

export const CODING_QUESTIONS = [
  {
    "title": "Two Sum",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "google",
      "amazon",
      "microsoft",
      "meta",
      "adobe"
    ],
    "topics": [
      "Array",
      "Hash Map",
      "Two Pointers"
    ],
    "frequency": "High",
    "source": "Reported in Google SWE L3 & Amazon OA",
    "tags": [
      "OA",
      "Coding Interview",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.\n\nYou may assume that each input would have ***exactly one solution***, and you may not use the same element twice.",
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "Because nums[0] + nums[1] == 9, return [0, 1]."
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "output": "[1,2]",
        "explanation": "nums[1] + nums[2] == 6, return [1, 2]."
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Only one valid answer exists."
    ],
    "starterCode": {
      "javascript": "function twoSum(nums, target) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass",
      "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
      "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}"
    },
    "testCases": [
      {
        "input": "[2,7,11,15]\n9",
        "expectedOutput": "[0,1]",
        "isHidden": false
      },
      {
        "input": "[3,2,4]\n6",
        "expectedOutput": "[1,2]",
        "isHidden": false
      },
      {
        "input": "[3,3]\n6",
        "expectedOutput": "[0,1]",
        "isHidden": true
      },
      {
        "input": "[1,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,130,133,136,139,142,145,148,151,154,157,160,163,166,169,172,175,178,181,184,187,190,193,196,199,202,205,208,211,214,217,220,223,226,229,232,235,238,241,244,247,250,253,256,259,262,265,268,271,274,277,280,283,286,289,292,295,298,301,304,307,310,313,316,319,322,325,328,331,334,337,340,343,346,349,352,355,358,361,364,367,370,373,376,379,382,385,388,391,394,397,400,403,406,409,412,415,418,421,424,427,430,433,436,439,442,445,448,451,454,457,460,463,466,469,472,475,478,481,484,487,490,493,496,499,502,505,508,511,514,517,520,523,526,529,532,535,538,541,544,547,550,553,556,559,562,565,568,571,574,577,580,583,586,589,592,595,598,601,604,607,610,613,616,619,622,625,628,631,634,637,640,643,646,649,652,655,658,661,664,667,670,673,676,679,682,685,688,691,694,697,700,703,706,709,712,715,718,721,724,727,730,733,736,739,742,745,748,751,754,757,760,763,766,769,772,775,778,781,784,787,790,793,796,799,802,805,808,811,814,817,820,823,826,829,832,835,838,841,844,847,850,853,856,859,862,865,868,871,874,877,880,883,886,889,892,895,898,901,904,907,910,913,916,919,922,925,928,931,934,937,940,943,946,949,952,955,958,961,964,967,970,973,976,979,982,985,988,991,994,997,1000,1003,1006,1009,1012,1015,1018,1021,1024,1027,1030,1033,1036,1039,1042,1045,1048,1051,1054,1057,1060,1063,1066,1069,1072,1075,1078,1081,1084,1087,1090,1093,1096,1099,1102,1105,1108,1111,1114,1117,1120,1123,1126,1129,1132,1135,1138,1141,1144,1147,1150,1153,1156,1159,1162,1165,1168,1171,1174,1177,1180,1183,1186,1189,1192,1195,1198,1201,1204,1207,1210,1213,1216,1219,1222,1225,1228,1231,1234,1237,1240,1243,1246,1249,1252,1255,1258,1261,1264,1267,1270,1273,1276,1279,1282,1285,1288,1291,1294,1297,1300,1303,1306,1309,1312,1315,1318,1321,1324,1327,1330,1333,1336,1339,1342,1345,1348,1351,1354,1357,1360,1363,1366,1369,1372,1375,1378,1381,1384,1387,1390,1393,1396,1399,1402,1405,1408,1411,1414,1417,1420,1423,1426,1429,1432,1435,1438,1441,1444,1447,1450,1453,1456,1459,1462,1465,1468,1471,1474,1477,1480,1483,1486,1489,1492,1495,1498,1501,1504,1507,1510,1513,1516,1519,1522,1525,1528,1531,1534,1537,1540,1543,1546,1549,1552,1555,1558,1561,1564,1567,1570,1573,1576,1579,1582,1585,1588,1591,1594,1597,1600,1603,1606,1609,1612,1615,1618,1621,1624,1627,1630,1633,1636,1639,1642,1645,1648,1651,1654,1657,1660,1663,1666,1669,1672,1675,1678,1681,1684,1687,1690,1693,1696,1699,1702,1705,1708,1711,1714,1717,1720,1723,1726,1729,1732,1735,1738,1741,1744,1747,1750,1753,1756,1759,1762,1765,1768,1771,1774,1777,1780,1783,1786,1789,1792,1795,1798,1801,1804,1807,1810,1813,1816,1819,1822,1825,1828,1831,1834,1837,1840,1843,1846,1849,1852,1855,1858,1861,1864,1867,1870,1873,1876,1879,1882,1885,1888,1891,1894,1897,1900,1903,1906,1909,1912,1915,1918,1921,1924,1927,1930,1933,1936,1939,1942,1945,1948,1951,1954,1957,1960,1963,1966,1969,1972,1975,1978,1981,1984,1987,1990,1993,1996,1999,2002,2005,2008,2011,2014,2017,2020,2023,2026,2029,2032,2035,2038,2041,2044,2047,2050,2053,2056,2059,2062,2065,2068,2071,2074,2077,2080,2083,2086,2089,2092,2095,2098,2101,2104,2107,2110,2113,2116,2119,2122,2125,2128,2131,2134,2137,2140,2143,2146,2149,2152,2155,2158,2161,2164,2167,2170,2173,2176,2179,2182,2185,2188,2191,2194,2197,2200,2203,2206,2209,2212,2215,2218,2221,2224,2227,2230,2233,2236,2239,2242,2245,2248,2251,2254,2257,2260,2263,2266,2269,2272,2275,2278,2281,2284,2287,2290,2293,2296,2299,2302,2305,2308,2311,2314,2317,2320,2323,2326,2329,2332,2335,2338,2341,2344,2347,2350,2353,2356,2359,2362,2365,2368,2371,2374,2377,2380,2383,2386,2389,2392,2395,2398]\n2399",
        "expectedOutput": "[399,400]",
        "isHidden": true
      },
      {
        "input": "[-1000,-500,0,500,1000]\n0",
        "expectedOutput": "[1,3]",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]\n39",
        "expectedOutput": "[18,19]",
        "isHidden": true
      },
      {
        "input": "[5,75,25]\n100",
        "expectedOutput": "[1,2]",
        "isHidden": true
      },
      {
        "input": "[0,0]\n0",
        "expectedOutput": "[0,1]",
        "isHidden": true
      },
      {
        "input": "[110,230,450,890,999]\n1449",
        "expectedOutput": "[2,4]",
        "isHidden": true
      },
      {
        "input": "[1,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,130,133,136,139,142,145,148,151,154,157,160,163,166,169,172,175,178,181,184,187,190,193,196,199,202,205,208,211,214,217,220,223,226,229,232,235,238,241,244,247,250,253,256,259,262,265,268,271,274,277,280,283,286,289,292,295,298,301,304,307,310,313,316,319,322,325,328,331,334,337,340,343,346,349,352,355,358,361,364,367,370,373,376,379,382,385,388,391,394,397,400,403,406,409,412,415,418,421,424,427,430,433,436,439,442,445,448,451,454,457,460,463,466,469,472,475,478,481,484,487,490,493,496,499,502,505,508,511,514,517,520,523,526,529,532,535,538,541,544,547,550,553,556,559,562,565,568,571,574,577,580,583,586,589,592,595,598,601,604,607,610,613,616,619,622,625,628,631,634,637,640,643,646,649,652,655,658,661,664,667,670,673,676,679,682,685,688,691,694,697,700,703,706,709,712,715,718,721,724,727,730,733,736,739,742,745,748,751,754,757,760,763,766,769,772,775,778,781,784,787,790,793,796,799,802,805,808,811,814,817,820,823,826,829,832,835,838,841,844,847,850,853,856,859,862,865,868,871,874,877,880,883,886,889,892,895,898,901,904,907,910,913,916,919,922,925,928,931,934,937,940,943,946,949,952,955,958,961,964,967,970,973,976,979,982,985,988,991,994,997,1000,1003,1006,1009,1012,1015,1018,1021,1024,1027,1030,1033,1036,1039,1042,1045,1048,1051,1054,1057,1060,1063,1066,1069,1072,1075,1078,1081,1084,1087,1090,1093,1096,1099,1102,1105,1108,1111,1114,1117,1120,1123,1126,1129,1132,1135,1138,1141,1144,1147,1150,1153,1156,1159,1162,1165,1168,1171,1174,1177,1180,1183,1186,1189,1192,1195,1198,1201,1204,1207,1210,1213,1216,1219,1222,1225,1228,1231,1234,1237,1240,1243,1246,1249,1252,1255,1258,1261,1264,1267,1270,1273,1276,1279,1282,1285,1288,1291,1294,1297,1300,1303,1306,1309,1312,1315,1318,1321,1324,1327,1330,1333,1336,1339,1342,1345,1348,1351,1354,1357,1360,1363,1366,1369,1372,1375,1378,1381,1384,1387,1390,1393,1396,1399,1402,1405,1408,1411,1414,1417,1420,1423,1426,1429,1432,1435,1438,1441,1444,1447,1450,1453,1456,1459,1462,1465,1468,1471,1474,1477,1480,1483,1486,1489,1492,1495,1498,1501,1504,1507,1510,1513,1516,1519,1522,1525,1528,1531,1534,1537,1540,1543,1546,1549,1552,1555,1558,1561,1564,1567,1570,1573,1576,1579,1582,1585,1588,1591,1594,1597,1600,1603,1606,1609,1612,1615,1618,1621,1624,1627,1630,1633,1636,1639,1642,1645,1648,1651,1654,1657,1660,1663,1666,1669,1672,1675,1678,1681,1684,1687,1690,1693,1696,1699,1702,1705,1708,1711,1714,1717,1720,1723,1726,1729,1732,1735,1738,1741,1744,1747,1750,1753,1756,1759,1762,1765,1768,1771,1774,1777,1780,1783,1786,1789,1792,1795,1798,1801,1804,1807,1810,1813,1816,1819,1822,1825,1828,1831,1834,1837,1840,1843,1846,1849,1852,1855,1858,1861,1864,1867,1870,1873,1876,1879,1882,1885,1888,1891,1894,1897,1900,1903,1906,1909,1912,1915,1918,1921,1924,1927,1930,1933,1936,1939,1942,1945,1948,1951,1954,1957,1960,1963,1966,1969,1972,1975,1978,1981,1984,1987,1990,1993,1996,1999,2002,2005,2008,2011,2014,2017,2020,2023,2026,2029,2032,2035,2038,2041,2044,2047,2050,2053,2056,2059,2062,2065,2068,2071,2074,2077,2080,2083,2086,2089,2092,2095,2098,2101,2104,2107,2110,2113,2116,2119,2122,2125,2128,2131,2134,2137,2140,2143,2146,2149,2152,2155,2158,2161,2164,2167,2170,2173,2176,2179,2182,2185,2188,2191,2194,2197,2200,2203,2206,2209,2212,2215,2218,2221,2224,2227,2230,2233,2236,2239,2242,2245,2248,2251,2254,2257,2260,2263,2266,2269,2272,2275,2278,2281,2284,2287,2290,2293,2296,2299,2302,2305,2308,2311,2314,2317,2320,2323,2326,2329,2332,2335,2338,2341,2344,2347,2350,2353,2356,2359,2362,2365,2368,2371,2374,2377,2380,2383,2386,2389,2392,2395,2398]\n2399",
        "expectedOutput": "[399,400]",
        "isHidden": true
      },
      {
        "input": "[-1000,-500,0,500,1000]\n0",
        "expectedOutput": "[1,3]",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]\n39",
        "expectedOutput": "[18,19]",
        "isHidden": true
      },
      {
        "input": "[5,75,25]\n100",
        "expectedOutput": "[1,2]",
        "isHidden": true
      },
      {
        "input": "[0,0]\n0",
        "expectedOutput": "[0,1]",
        "isHidden": true
      },
      {
        "input": "[110,230,450,890,999]\n1449",
        "expectedOutput": "[2,4]",
        "isHidden": true
      }
    ],
    "hints": [
      "Use a Hash Map to store seen numbers: key=nums[i], val=i.",
      "Check if target - nums[i] already exists."
    ],
    "approach": "Single pass hash map lookup: O(n) time and O(n) space.",
    "solutionCode": {
      "javascript": "function twoSum(nums, target) {\n    const seen = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (seen.has(complement)) return [seen.get(complement), i];\n        seen.set(nums[i], i);\n    }\n    return [];\n}",
      "python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            if target - num in seen:\n                return [seen[target - num], i]\n            seen[num] = i\n        return []",
      "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            if (seen.count(target - nums[i])) return {seen[target - nums[i]], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (seen.containsKey(target - nums[i])) return new int[]{seen.get(target - nums[i]), i};\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)"
  },
  {
    "title": "Container With Most Water",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "google",
      "amazon",
      "meta",
      "adobe"
    ],
    "topics": [
      "Array",
      "Two Pointers",
      "Greedy"
    ],
    "frequency": "High",
    "source": "Reported in Google SWE Phone Screen",
    "tags": [
      "Two Pointers",
      "Google",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the *maximum amount of water a container can store*.",
    "examples": [
      {
        "input": "height = [1,8,6,2,5,4,8,3,7]",
        "output": "49",
        "explanation": "The max area is between index 1 and 8: min(8, 7) * 7 = 49."
      },
      {
        "input": "height = [1,1]",
        "output": "1",
        "explanation": "Area = min(1, 1) * 1 = 1."
      }
    ],
    "constraints": [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    "starterCode": {
      "javascript": "function maxArea(height) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};",
      "java": "class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[1,8,6,2,5,4,8,3,7]",
        "expectedOutput": "49",
        "isHidden": false
      },
      {
        "input": "[1,1]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[4,3,2,1,4]",
        "expectedOutput": "16",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500]",
        "expectedOutput": "62500",
        "isHidden": true
      },
      {
        "input": "[500,499,498,497,496,495,494,493,492,491,490,489,488,487,486,485,484,483,482,481,480,479,478,477,476,475,474,473,472,471,470,469,468,467,466,465,464,463,462,461,460,459,458,457,456,455,454,453,452,451,450,449,448,447,446,445,444,443,442,441,440,439,438,437,436,435,434,433,432,431,430,429,428,427,426,425,424,423,422,421,420,419,418,417,416,415,414,413,412,411,410,409,408,407,406,405,404,403,402,401,400,399,398,397,396,395,394,393,392,391,390,389,388,387,386,385,384,383,382,381,380,379,378,377,376,375,374,373,372,371,370,369,368,367,366,365,364,363,362,361,360,359,358,357,356,355,354,353,352,351,350,349,348,347,346,345,344,343,342,341,340,339,338,337,336,335,334,333,332,331,330,329,328,327,326,325,324,323,322,321,320,319,318,317,316,315,314,313,312,311,310,309,308,307,306,305,304,303,302,301,300,299,298,297,296,295,294,293,292,291,290,289,288,287,286,285,284,283,282,281,280,279,278,277,276,275,274,273,272,271,270,269,268,267,266,265,264,263,262,261,260,259,258,257,256,255,254,253,252,251,250,249,248,247,246,245,244,243,242,241,240,239,238,237,236,235,234,233,232,231,230,229,228,227,226,225,224,223,222,221,220,219,218,217,216,215,214,213,212,211,210,209,208,207,206,205,204,203,202,201,200,199,198,197,196,195,194,193,192,191,190,189,188,187,186,185,184,183,182,181,180,179,178,177,176,175,174,173,172,171,170,169,168,167,166,165,164,163,162,161,160,159,158,157,156,155,154,153,152,151,150,149,148,147,146,145,144,143,142,141,140,139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,124,123,122,121,120,119,118,117,116,115,114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]",
        "expectedOutput": "62500",
        "isHidden": true
      },
      {
        "input": "[10,1,1,1,1,1,1,1,1,10]",
        "expectedOutput": "90",
        "isHidden": true
      },
      {
        "input": "[1,2,4,3]",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[2,3,4,5,18,17,6]",
        "expectedOutput": "17",
        "isHidden": true
      },
      {
        "input": "[100,100]",
        "expectedOutput": "100",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500]",
        "expectedOutput": "62500",
        "isHidden": true
      },
      {
        "input": "[500,499,498,497,496,495,494,493,492,491,490,489,488,487,486,485,484,483,482,481,480,479,478,477,476,475,474,473,472,471,470,469,468,467,466,465,464,463,462,461,460,459,458,457,456,455,454,453,452,451,450,449,448,447,446,445,444,443,442,441,440,439,438,437,436,435,434,433,432,431,430,429,428,427,426,425,424,423,422,421,420,419,418,417,416,415,414,413,412,411,410,409,408,407,406,405,404,403,402,401,400,399,398,397,396,395,394,393,392,391,390,389,388,387,386,385,384,383,382,381,380,379,378,377,376,375,374,373,372,371,370,369,368,367,366,365,364,363,362,361,360,359,358,357,356,355,354,353,352,351,350,349,348,347,346,345,344,343,342,341,340,339,338,337,336,335,334,333,332,331,330,329,328,327,326,325,324,323,322,321,320,319,318,317,316,315,314,313,312,311,310,309,308,307,306,305,304,303,302,301,300,299,298,297,296,295,294,293,292,291,290,289,288,287,286,285,284,283,282,281,280,279,278,277,276,275,274,273,272,271,270,269,268,267,266,265,264,263,262,261,260,259,258,257,256,255,254,253,252,251,250,249,248,247,246,245,244,243,242,241,240,239,238,237,236,235,234,233,232,231,230,229,228,227,226,225,224,223,222,221,220,219,218,217,216,215,214,213,212,211,210,209,208,207,206,205,204,203,202,201,200,199,198,197,196,195,194,193,192,191,190,189,188,187,186,185,184,183,182,181,180,179,178,177,176,175,174,173,172,171,170,169,168,167,166,165,164,163,162,161,160,159,158,157,156,155,154,153,152,151,150,149,148,147,146,145,144,143,142,141,140,139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,124,123,122,121,120,119,118,117,116,115,114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]",
        "expectedOutput": "62500",
        "isHidden": true
      },
      {
        "input": "[10,1,1,1,1,1,1,1,1,10]",
        "expectedOutput": "90",
        "isHidden": true
      },
      {
        "input": "[1,2,4,3]",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[2,3,4,5,18,17,6]",
        "expectedOutput": "17",
        "isHidden": true
      },
      {
        "input": "[100,100]",
        "expectedOutput": "100",
        "isHidden": true
      }
    ],
    "hints": [
      "Use two pointers at the ends (left=0, right=n-1).",
      "Move the pointer with the smaller height inward."
    ],
    "approach": "Two pointers starting from outside moving inward based on smaller height. Time: O(n), Space: O(1).",
    "solutionCode": {
      "javascript": "function maxArea(height) {\n    let left = 0, right = height.length - 1, maxWater = 0;\n    while (left < right) {\n        const w = right - left;\n        const h = Math.min(height[left], height[right]);\n        maxWater = Math.max(maxWater, w * h);\n        if (height[left] < height[right]) left++;\n        else right--;\n    }\n    return maxWater;\n}",
      "python": "class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        l, r = 0, len(height) - 1\n        max_water = 0\n        while l < r:\n            max_water = max(max_water, (r - l) * min(height[l], height[r]))\n            if height[l] < height[r]: l += 1\n            else: r -= 1\n        return max_water",
      "cpp": "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int l = 0, r = height.size() - 1, maxWater = 0;\n        while (l < r) {\n            maxWater = max(maxWater, (r - l) * min(height[l], height[r]));\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return maxWater;\n    }\n};",
      "java": "class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, maxWater = 0;\n        while (l < r) {\n            maxWater = Math.max(maxWater, (r - l) * Math.min(height[l], height[r]));\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return maxWater;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Longest Substring Without Repeating Characters",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "google",
      "amazon",
      "microsoft",
      "meta"
    ],
    "topics": [
      "Hash Table",
      "String",
      "Sliding Window"
    ],
    "frequency": "High",
    "source": "Reported in Google & Amazon Online Assessments",
    "tags": [
      "Sliding Window",
      "Google",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given a string `s`, find the length of the **longest substring** without repeating characters.",
    "examples": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3",
        "explanation": "The answer is \"abc\", with the length of 3."
      },
      {
        "input": "s = \"bbbbb\"",
        "output": "1",
        "explanation": "The answer is \"b\", with the length of 1."
      },
      {
        "input": "s = \"pwwkew\"",
        "output": "3",
        "explanation": "The answer is \"wke\", with the length of 3."
      }
    ],
    "constraints": [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    "starterCode": {
      "javascript": "function lengthOfLongestSubstring(s) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};",
      "java": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "\"abcabcbb\"",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "\"bbbbb\"",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "\"pwwkew\"",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "\"abcdefghijklmnopqrstuvwxyz\"",
        "expectedOutput": "26",
        "isHidden": true
      },
      {
        "input": "\"aab\"",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "\"cdd\"",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "\"tmmzuxt\"",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "\"anviaj\"",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "\"a quick brown fox jumps over the lazy dog\"",
        "expectedOutput": "11",
        "isHidden": true
      },
      {
        "input": "\"\"",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "\" \"",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "\"abcdefghijklmnopqrstuvwxyz\"",
        "expectedOutput": "26",
        "isHidden": true
      },
      {
        "input": "\"aab\"",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "\"cdd\"",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "\"tmmzuxt\"",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "\"anviaj\"",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "\"a quick brown fox jumps over the lazy dog\"",
        "expectedOutput": "11",
        "isHidden": true
      },
      {
        "input": "\"\"",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "\" \"",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "hints": [
      "Use a sliding window with two pointers `left` and `right`.",
      "Store the latest index of each character in a map."
    ],
    "approach": "Sliding window with map of character to last seen index: O(n) time and O(min(m, n)) space.",
    "solutionCode": {
      "javascript": "function lengthOfLongestSubstring(s) {\n    const map = new Map();\n    let maxLen = 0, left = 0;\n    for (let right = 0; right < s.length; right++) {\n        if (map.has(s[right])) {\n            left = Math.max(left, map.get(s[right]) + 1);\n        }\n        map.set(s[right], right);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
      "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        l = 0\n        max_len = 0\n        for r, char in enumerate(s):\n            if char in seen:\n                l = max(l, seen[char] + 1)\n            seen[char] = r\n            max_len = max(max_len, r - l + 1)\n        return max_len",
      "cpp": "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> seen;\n        int maxLen = 0, left = 0;\n        for (int right = 0; right < s.size(); right++) {\n            if (seen.count(s[right])) left = max(left, seen[s[right]] + 1);\n            seen[s[right]] = right;\n            maxLen = max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};",
      "java": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> seen = new HashMap<>();\n        int maxLen = 0, left = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (seen.containsKey(c)) {\n                left = Math.max(left, seen.get(c) + 1);\n            }\n            seen.put(c, right);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(min(m, n))"
  },
  {
    "title": "Trapping Rain Water",
    "category": "coding",
    "type": "coding",
    "difficulty": "Hard",
    "companies": [
      "google",
      "amazon",
      "adobe",
      "infosys"
    ],
    "topics": [
      "Array",
      "Two Pointers",
      "Dynamic Programming",
      "Stack"
    ],
    "frequency": "High",
    "source": "Top Google, Amazon & Infosys SP Question",
    "tags": [
      "Hard",
      "Two Pointers",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
    "examples": [
      {
        "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6",
        "explanation": "The elevation map traps 6 units of rain water."
      },
      {
        "input": "height = [4,2,0,3,2,5]",
        "output": "9",
        "explanation": "9 units trapped."
      }
    ],
    "constraints": [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    "starterCode": {
      "javascript": "function trap(height) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def trap(self, height: list[int]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};",
      "java": "class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[0,1,0,2,1,0,1,3,2,1,2,1]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[4,2,0,3,2,5]",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "input": "[3,0,2,0,4]",
        "expectedOutput": "7",
        "isHidden": true
      },
      {
        "input": "[0,10,0,20,0,30,0,20,0,10,0]",
        "expectedOutput": "60",
        "isHidden": true
      },
      {
        "input": "[5,2,1,2,1,5]",
        "expectedOutput": "14",
        "isHidden": true
      },
      {
        "input": "[10,0,10]",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[5,4,3,2,1]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[0,2,0]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[6,4,2,0,3,2,0,3,1,4,5,3,2,7,5,3,0,1,2,1,3,4,6,8,1,3]",
        "expectedOutput": "83",
        "isHidden": true
      },
      {
        "input": "[0,10,0,20,0,30,0,20,0,10,0]",
        "expectedOutput": "60",
        "isHidden": true
      },
      {
        "input": "[5,2,1,2,1,5]",
        "expectedOutput": "14",
        "isHidden": true
      },
      {
        "input": "[10,0,10]",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[5,4,3,2,1]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[0,2,0]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[6,4,2,0,3,2,0,3,1,4,5,3,2,7,5,3,0,1,2,1,3,4,6,8,1,3]",
        "expectedOutput": "83",
        "isHidden": true
      }
    ],
    "hints": [
      "Water trapped at index i is min(maxLeft, maxRight) - height[i].",
      "Use two pointers from left and right maintaining leftMax and rightMax."
    ],
    "approach": "Two pointers approach maintaining left_max and right_max: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function trap(height) {\n    let left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, water = 0;\n    while (left < right) {\n        if (height[left] < height[right]) {\n            if (height[left] >= leftMax) leftMax = height[left];\n            else water += leftMax - height[left];\n            left++;\n        } else {\n            if (height[right] >= rightMax) rightMax = height[right];\n            else water += rightMax - height[right];\n            right--;\n        }\n    }\n    return water;\n}",
      "python": "class Solution:\n    def trap(self, height: list[int]) -> int:\n        l, r = 0, len(height) - 1\n        l_max, r_max = 0, 0\n        water = 0\n        while l < r:\n            if height[l] < height[r]:\n                if height[l] >= l_max: l_max = height[l]\n                else: water += l_max - height[l]\n                l += 1\n            else:\n                if height[r] >= r_max: r_max = height[r]\n                else: water += r_max - height[r]\n                r -= 1\n        return water",
      "cpp": "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        int l = 0, r = height.size() - 1, lMax = 0, rMax = 0, water = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= lMax) lMax = height[l];\n                else water += lMax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rMax) rMax = height[r];\n                else water += rMax - height[r];\n                r--;\n            }\n        }\n        return water;\n    }\n};",
      "java": "class Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= lMax) lMax = height[l];\n                else water += lMax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rMax) rMax = height[r];\n                else water += rMax - height[r];\n                r--;\n            }\n        }\n        return water;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Word Break",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "google",
      "amazon",
      "microsoft",
      "meta"
    ],
    "topics": [
      "Array",
      "Hash Table",
      "String",
      "Dynamic Programming",
      "Trie"
    ],
    "frequency": "High",
    "source": "Asked in Google SWE Onsite Interview",
    "tags": [
      "DP",
      "Google",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.",
    "examples": [
      {
        "input": "s = \"leetcode\", wordDict = [\"leet\",\"code\"]",
        "output": "true",
        "explanation": "Return true because \"leetcode\" can be segmented as \"leet code\"."
      },
      {
        "input": "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]",
        "output": "true",
        "explanation": "Return true because \"applepenapple\" can be segmented as \"apple pen apple\"."
      }
    ],
    "constraints": [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "1 <= wordDict[i].length <= 20",
      "s and wordDict[i] consist of lowercase letters."
    ],
    "starterCode": {
      "javascript": "function wordBreak(s, wordDict) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def wordBreak(self, s: str, wordDict: list[str]) -> bool:\n        pass",
      "cpp": "class Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        \n    }\n};",
      "java": "class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        return false;\n    }\n}"
    },
    "testCases": [
      {
        "input": "\"leetcode\"\n[\"leet\",\"code\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "\"applepenapple\"\n[\"apple\",\"pen\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "\"catsandog\"\n[\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "\"cars\"\n[\"car\",\"ca\",\"rs\"]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"aaaaaaa\"\n[\"aaaa\",\"aaa\"]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"goalspecial\"\n[\"go\",\"goal\",\"special\"]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"program\"\n[\"pro\",\"gram\"]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"abcd\"\n[\"a\",\"abc\",\"b\",\"cd\"]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"a\"\n[\"b\"]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "\"cars\"\n[\"car\",\"ca\",\"rs\"]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"aaaaaaa\"\n[\"aaaa\",\"aaa\"]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"goalspecial\"\n[\"go\",\"goal\",\"special\"]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"program\"\n[\"pro\",\"gram\"]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"abcd\"\n[\"a\",\"abc\",\"b\",\"cd\"]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"a\"\n[\"b\"]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "hints": [
      "Define dp[i] as true if s[0...i-1] can be segmented.",
      "Check all substrings s[j...i] for valid dictionary matches."
    ],
    "approach": "1D Dynamic Programming with boolean array dp of size n+1: O(n^2) time.",
    "solutionCode": {
      "javascript": "function wordBreak(s, wordDict) {\n    const dict = new Set(wordDict);\n    const dp = new Array(s.length + 1).fill(false);\n    dp[0] = true;\n    for (let i = 1; i <= s.length; i++) {\n        for (let j = 0; j < i; j++) {\n            if (dp[j] && dict.has(s.substring(j, i))) {\n                dp[i] = true;\n                break;\n            }\n        }\n    }\n    return dp[s.length];\n}",
      "python": "class Solution:\n    def wordBreak(self, s: str, wordDict: list[str]) -> bool:\n        words = set(wordDict)\n        dp = [False] * (len(s) + 1)\n        dp[0] = True\n        for i in range(1, len(s) + 1):\n            for j in range(i):\n                if dp[j] and s[j:i] in words:\n                    dp[i] = True\n                    break\n        return dp[len(s)]",
      "cpp": "class Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        unordered_set<string> dict(wordDict.begin(), wordDict.end());\n        vector<bool> dp(s.length() + 1, false);\n        dp[0] = true;\n        for (int i = 1; i <= s.length(); i++) {\n            for (int j = 0; j < i; j++) {\n                if (dp[j] && dict.count(s.substr(j, i - j))) {\n                    dp[i] = true;\n                    break;\n                }\n            }\n        }\n        return dp[s.length()];\n    }\n};",
      "java": "class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        Set<String> set = new HashSet<>(wordDict);\n        boolean[] dp = new boolean[s.length() + 1];\n        dp[0] = true;\n        for (int i = 1; i <= s.length(); i++) {\n            for (int j = 0; j < i; j++) {\n                if (dp[j] && set.contains(s.substring(j, i))) {\n                    dp[i] = true;\n                    break;\n                }\n            }\n        }\n        return dp[s.length()];\n    }\n}"
    },
    "timeComplexity": "O(n^2)",
    "spaceComplexity": "O(n)"
  },
  {
    "title": "Course Schedule",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "google",
      "amazon",
      "microsoft",
      "meta"
    ],
    "topics": [
      "Depth-First Search",
      "Breadth-First Search",
      "Graph",
      "Topological Sort"
    ],
    "frequency": "High",
    "source": "Classic Google Graph Assessment Question",
    "tags": [
      "Graph",
      "Topological Sort",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a, b]` indicates that you must take course `b` first if you want to take course `a`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.",
    "examples": [
      {
        "input": "numCourses = 2, prerequisites = [[1,0]]",
        "output": "true",
        "explanation": "Take course 0 then course 1."
      },
      {
        "input": "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        "output": "false",
        "explanation": "Cycle detected between course 0 and 1."
      }
    ],
    "constraints": [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2"
    ],
    "starterCode": {
      "javascript": "function canFinish(numCourses, prerequisites) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:\n        pass",
      "cpp": "class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        \n    }\n};",
      "java": "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        return false;\n    }\n}"
    },
    "testCases": [
      {
        "input": "2\n[[1,0]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "2\n[[1,0],[0,1]]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "3\n[[1,0],[2,1]]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "4\n[[1,0],[2,0],[3,1],[3,2]]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "3\n[[0,1],[1,2],[2,0]]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "1\n[]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "5\n[[1,0],[2,1],[3,2],[4,3]]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "4\n[[2,0],[1,0],[3,1],[3,2],[1,3]]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "3\n[[1,0],[2,1]]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "4\n[[1,0],[2,0],[3,1],[3,2]]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "3\n[[0,1],[1,2],[2,0]]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "1\n[]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "5\n[[1,0],[2,1],[3,2],[4,3]]",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "4\n[[2,0],[1,0],[3,1],[3,2],[1,3]]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "hints": [
      "This problem is equivalent to detecting a cycle in a directed graph.",
      "Use Kahn's Algorithm (BFS with In-degree count) or DFS with 3 color states."
    ],
    "approach": "Kahn's Topological Sort algorithm using indegree array: O(V + E) time.",
    "solutionCode": {
      "javascript": "function canFinish(numCourses, prerequisites) {\n    const inDegree = new Array(numCourses).fill(0);\n    const adj = Array.from({ length: numCourses }, () => []);\n    for (const [dest, src] of prerequisites) {\n        adj[src].push(dest);\n        inDegree[dest]++;\n    }\n    const queue = [];\n    for (let i = 0; i < numCourses; i++) {\n        if (inDegree[i] === 0) queue.push(i);\n    }\n    let count = 0;\n    while (queue.length > 0) {\n        const curr = queue.shift();\n        count++;\n        for (const next of adj[curr]) {\n            inDegree[next]--;\n            if (inDegree[next] === 0) queue.push(next);\n        }\n    }\n    return count === numCourses;\n}",
      "python": "class Solution:\n    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:\n        from collections import deque, defaultdict\n        adj = defaultdict(list)\n        indegree = [0] * numCourses\n        for dest, src in prerequisites:\n            adj[src].append(dest)\n            indegree[dest] += 1\n        q = deque([i for i in range(numCourses) if indegree[i] == 0])\n        visited = 0\n        while q:\n            node = q.popleft()\n            visited += 1\n            for neighbor in adj[node]:\n                indegree[neighbor] -= 1\n                if indegree[neighbor] == 0:\n                    q.append(neighbor)\n        return visited == numCourses",
      "cpp": "class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        vector<int> inDegree(numCourses, 0);\n        vector<vector<int>> adj(numCourses);\n        for (auto& p : prerequisites) {\n            adj[p[1]].push_back(p[0]);\n            inDegree[p[0]]++;\n        }\n        queue<int> q;\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.push(i);\n        int count = 0;\n        while (!q.empty()) {\n            int node = q.front(); q.pop();\n            count++;\n            for (int next : adj[node]) {\n                if (--inDegree[next] == 0) q.push(next);\n            }\n        }\n        return count == numCourses;\n    }\n};",
      "java": "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        int[] inDegree = new int[numCourses];\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n        for (int[] p : prerequisites) {\n            adj.get(p[1]).add(p[0]);\n            inDegree[p[0]]++;\n        }\n        Queue<Integer> q = new LinkedList<>();\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.add(i);\n        int count = 0;\n        while (!q.isEmpty()) {\n            int node = q.poll();\n            count++;\n            for (int next : adj.get(node)) {\n                if (--inDegree[next] == 0) q.add(next);\n            }\n        }\n        return count == numCourses;\n    }\n}"
    },
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)"
  },
  {
    "title": "LRU Cache",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "google",
      "amazon",
      "microsoft",
      "meta",
      "adobe"
    ],
    "topics": [
      "Hash Table",
      "Linked List",
      "Design",
      "Doubly-Linked List"
    ],
    "frequency": "High",
    "source": "Top Google & Amazon High-Frequency System/DSA Question",
    "tags": [
      "Design",
      "Google",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, **evict** the least recently used key.",
    "examples": [
      {
        "input": "[\"LRUCache\", \"put\", \"put\", \"get\", \"put\", \"get\", \"put\", \"get\", \"get\", \"get\"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]",
        "output": "[null, null, null, 1, null, -1, null, -1, 3, 4]",
        "explanation": "LRU cache maintains eviction order."
      }
    ],
    "constraints": [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls to get and put."
    ],
    "starterCode": {
      "javascript": "class LRUCache {\n    constructor(capacity) {\n        // Initialize\n    }\n    get(key) {\n        // Return value\n    }\n    put(key, value) {\n        // Store value\n    }\n}",
      "python": "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass",
      "cpp": "class LRUCache {\npublic:\n    LRUCache(int capacity) {\n        \n    }\n    int get(int key) {\n        return -1;\n    }\n    void put(int key, int value) {\n        \n    }\n};",
      "java": "class LRUCache {\n    public LRUCache(int capacity) {\n        \n    }\n    public int get(int key) {\n        return -1;\n    }\n    public void put(int key, int value) {\n        \n    }\n}"
    },
    "testCases": [
      {
        "input": "[[2], [1, 1], [2, 2], [1], [3, 3], [2]]",
        "expectedOutput": "[1, -1]",
        "isHidden": false
      },
      {
        "input": "[[2], [1, 1], [2, 2], [1], [3, 3], [2]]",
        "expectedOutput": "[1,-1]",
        "isHidden": true
      },
      {
        "input": "[[2], [1, 1], [2, 2], [1], [3, 3], [2]]",
        "expectedOutput": "[1,-1]",
        "isHidden": true
      }
    ],
    "hints": [
      "Use a Doubly-Linked List to achieve O(1) removals and insertions.",
      "Use a Hash Map mapping keys to DLL Node pointers."
    ],
    "approach": "Hash Map combined with Doubly Linked List for O(1) get and O(1) put operations.",
    "solutionCode": {
      "javascript": "class LRUCache {\n    constructor(capacity) {\n        this.cap = capacity;\n        this.map = new Map();\n    }\n    get(key) {\n        if (!this.map.has(key)) return -1;\n        const val = this.map.get(key);\n        this.map.delete(key);\n        this.map.set(key, val);\n        return val;\n    }\n    put(key, value) {\n        if (this.map.has(key)) this.map.delete(key);\n        else if (this.map.size >= this.cap) {\n            const oldestKey = this.map.keys().next().value;\n            this.map.delete(oldestKey);\n        }\n        this.map.set(key, value);\n    }\n}",
      "python": "from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = OrderedDict()\n    def get(self, key: int) -> int:\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)",
      "cpp": "class LRUCache {\n    int cap;\n    list<pair<int, int>> dll;\n    unordered_map<int, list<pair<int, int>>::iterator> map;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (!map.count(key)) return -1;\n        dll.splice(dll.begin(), dll, map[key]);\n        return map[key]->second;\n    }\n    void put(int key, int value) {\n        if (map.count(key)) {\n            dll.splice(dll.begin(), dll, map[key]);\n            map[key]->second = value;\n            return;\n        }\n        if (dll.size() == cap) {\n            int delKey = dll.back().first;\n            dll.pop_back();\n            map.erase(delKey);\n        }\n        dll.emplace_front(key, value);\n        map[key] = dll.begin();\n    }\n};",
      "java": "class LRUCache {\n    private final int cap;\n    private final LinkedHashMap<Integer, Integer> map;\n    public LRUCache(int capacity) {\n        this.cap = capacity;\n        this.map = new LinkedHashMap<>(capacity, 0.75f, true) {\n            protected boolean removeEldestEntry(Map.Entry eldest) {\n                return size() > cap;\n            }\n        };\n    }\n    public int get(int key) { return map.getOrDefault(key, -1); }\n    public void put(int key, int value) { map.put(key, value); }\n}"
    },
    "timeComplexity": "O(1) for get and put",
    "spaceComplexity": "O(capacity)"
  },
  {
    "title": "Median of Two Sorted Arrays",
    "category": "coding",
    "type": "coding",
    "difficulty": "Hard",
    "companies": [
      "google",
      "microsoft",
      "amazon",
      "adobe"
    ],
    "topics": [
      "Array",
      "Binary Search",
      "Divide and Conquer"
    ],
    "frequency": "High",
    "source": "Top Google Senior SWE Problem",
    "tags": [
      "Hard",
      "Binary Search",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the **median** of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.",
    "examples": [
      {
        "input": "nums1 = [1,3], nums2 = [2]",
        "output": "2.00000",
        "explanation": "merged array = [1,2,3] and median is 2."
      },
      {
        "input": "nums1 = [1,2], nums2 = [3,4]",
        "output": "2.50000",
        "explanation": "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    ],
    "constraints": [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m, n <= 1000",
      "1 <= m + n <= 2000"
    ],
    "starterCode": {
      "javascript": "function findMedianSortedArrays(nums1, nums2) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        pass",
      "cpp": "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        return 0.0;\n    }\n};",
      "java": "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[1,3]\n[2]",
        "expectedOutput": "2.00000",
        "isHidden": false
      },
      {
        "input": "[1,2]\n[3,4]",
        "expectedOutput": "2.50000",
        "isHidden": false
      },
      {
        "input": "[0,0]\n[0,0]",
        "expectedOutput": "0.0",
        "isHidden": true
      },
      {
        "input": "[]\n[1]",
        "expectedOutput": "1.0",
        "isHidden": true
      },
      {
        "input": "[2]\n[]",
        "expectedOutput": "2.0",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]\n[6,7,8,9,10]",
        "expectedOutput": "5.5",
        "isHidden": true
      },
      {
        "input": "[1,1,1]\n[1,1,1]",
        "expectedOutput": "1.0",
        "isHidden": true
      },
      {
        "input": "[100]\n[101]",
        "expectedOutput": "100.5",
        "isHidden": true
      },
      {
        "input": "[1,5,9]\n[2,4,6,8,10]",
        "expectedOutput": "5.5",
        "isHidden": true
      },
      {
        "input": "[0,0]\n[0,0]",
        "expectedOutput": "0.0",
        "isHidden": true
      },
      {
        "input": "[]\n[1]",
        "expectedOutput": "1.0",
        "isHidden": true
      },
      {
        "input": "[2]\n[]",
        "expectedOutput": "2.0",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]\n[6,7,8,9,10]",
        "expectedOutput": "5.5",
        "isHidden": true
      },
      {
        "input": "[1,1,1]\n[1,1,1]",
        "expectedOutput": "1.0",
        "isHidden": true
      },
      {
        "input": "[100]\n[101]",
        "expectedOutput": "100.5",
        "isHidden": true
      },
      {
        "input": "[1,5,9]\n[2,4,6,8,10]",
        "expectedOutput": "5.5",
        "isHidden": true
      }
    ],
    "hints": [
      "Binary search on the smaller array for the partition cut.",
      "Ensure left partitions <= right partitions."
    ],
    "approach": "Binary search on partition points of the smaller array: O(log(min(m, n))) time.",
    "solutionCode": {
      "javascript": "function findMedianSortedArrays(nums1, nums2) {\n    if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n    const m = nums1.length, n = nums2.length;\n    let low = 0, high = m;\n    while (low <= high) {\n        const cut1 = (low + high) >> 1;\n        const cut2 = ((m + n + 1) >> 1) - cut1;\n        const l1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];\n        const l2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];\n        const r1 = cut1 === m ? Infinity : nums1[cut1];\n        const r2 = cut2 === n ? Infinity : nums2[cut2];\n        if (l1 <= r2 && l2 <= r1) {\n            if ((m + n) % 2 === 0) return (Math.max(l1, l2) + Math.min(r1, r2)) / 2;\n            return Math.max(l1, l2);\n        } else if (l1 > r2) high = cut1 - 1;\n        else low = cut1 + 1;\n    }\n    return 0.0;\n}",
      "python": "class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        if len(nums1) > len(nums2): nums1, nums2 = nums2, nums1\n        m, n = len(nums1), len(nums2)\n        low, high = 0, m\n        while low <= high:\n            cut1 = (low + high) // 2\n            cut2 = (m + n + 1) // 2 - cut1\n            l1 = float('-inf') if cut1 == 0 else nums1[cut1 - 1]\n            l2 = float('-inf') if cut2 == 0 else nums2[cut2 - 1]\n            r1 = float('inf') if cut1 == m else nums1[cut1]\n            r2 = float('inf') if cut2 == n else nums2[cut2]\n            if l1 <= r2 and l2 <= r1:\n                if (m + n) % 2 == 0:\n                    return (max(l1, l2) + min(r1, r2)) / 2.0\n                return float(max(l1, l2))\n            elif l1 > r2: high = cut1 - 1\n            else: low = cut1 + 1\n        return 0.0",
      "cpp": "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);\n        int m = nums1.size(), n = nums2.size();\n        int low = 0, high = m;\n        while (low <= high) {\n            int cut1 = (low + high) / 2;\n            int cut2 = (m + n + 1) / 2 - cut1;\n            int l1 = cut1 == 0 ? INT_MIN : nums1[cut1 - 1];\n            int l2 = cut2 == 0 ? INT_MIN : nums2[cut2 - 1];\n            int r1 = cut1 == m ? INT_MAX : nums1[cut1];\n            int r2 = cut2 == n ? INT_MAX : nums2[cut2];\n            if (l1 <= r2 && l2 <= r1) {\n                if ((m + n) % 2 == 0) return (max(l1, l2) + min(r1, r2)) / 2.0;\n                return max(l1, l2);\n            } else if (l1 > r2) high = cut1 - 1;\n            else low = cut1 + 1;\n        }\n        return 0.0;\n    }\n};",
      "java": "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n        int m = nums1.length, n = nums2.length;\n        int low = 0, high = m;\n        while (low <= high) {\n            int cut1 = (low + high) / 2;\n            int cut2 = (m + n + 1) / 2 - cut1;\n            int l1 = cut1 == 0 ? Integer.MIN_VALUE : nums1[cut1 - 1];\n            int l2 = cut2 == 0 ? Integer.MIN_VALUE : nums2[cut2 - 1];\n            int r1 = cut1 == m ? Integer.MAX_VALUE : nums1[cut1];\n            int r2 = cut2 == n ? Integer.MAX_VALUE : nums2[cut2];\n            if (l1 <= r2 && l2 <= r1) {\n                if ((m + n) % 2 == 0) return (Math.max(l1, l2) + Math.min(r1, r2)) / 2.0;\n                return Math.max(l1, l2);\n            } else if (l1 > r2) high = cut1 - 1;\n            else low = cut1 + 1;\n        }\n        return 0.0;\n    }\n}"
    },
    "timeComplexity": "O(log(min(m, n)))",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Meeting Rooms II",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "google",
      "amazon",
      "microsoft",
      "meta"
    ],
    "topics": [
      "Array",
      "Two Pointers",
      "Greedy",
      "Sorting",
      "Heap (Priority Queue)"
    ],
    "frequency": "High",
    "source": "Reported in Google & Amazon Technical Rounds",
    "tags": [
      "Intervals",
      "Google",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the *minimum number of conference rooms required*.",
    "examples": [
      {
        "input": "intervals = [[0,30],[5,10],[15,20]]",
        "output": "2",
        "explanation": "Two rooms needed for overlapping intervals [0,30] and [5,10]."
      },
      {
        "input": "intervals = [[7,10],[2,4]]",
        "output": "1",
        "explanation": "No overlap, 1 room suffices."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "0 <= start_i < end_i <= 10^6"
    ],
    "starterCode": {
      "javascript": "function minMeetingRooms(intervals) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def minMeetingRooms(self, intervals: list[list[int]]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int minMeetingRooms(vector<vector<int>>& intervals) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int minMeetingRooms(int[][] intervals) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[[0,30],[5,10],[15,20]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[7,10],[2,4]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[0,30],[5,10],[15,20]]",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[[7,10],[2,4]]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[[1,5],[5,6],[6,10],[10,15]]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[[1,10],[2,9],[3,8],[4,7]]",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[[1,4],[2,5],[7,9]]",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[[9,10],[4,9],[4,17]]",
        "expectedOutput": "2",
        "isHidden": true
      }
    ],
    "hints": [
      "Separate start times and end times into two sorted arrays.",
      "Iterate starts and increment rooms if start < end; else advance end pointer."
    ],
    "approach": "Sort start and end times independently with two pointers: O(n log n) time and O(n) space.",
    "solutionCode": {
      "javascript": "function minMeetingRooms(intervals) {\n    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);\n    const ends = intervals.map(i => i[1]).sort((a, b) => a - b);\n    let rooms = 0, endIdx = 0;\n    for (let i = 0; i < starts.length; i++) {\n        if (starts[i] < ends[endIdx]) rooms++;\n        else endIdx++;\n    }\n    return rooms;\n}",
      "python": "class Solution:\n    def minMeetingRooms(self, intervals: list[list[int]]) -> int:\n        starts = sorted([i[0] for i in intervals])\n        ends = sorted([i[1] for i in intervals])\n        rooms, end_ptr = 0, 0\n        for s in starts:\n            if s < ends[end_ptr]: rooms += 1\n            else: end_ptr += 1\n        return rooms",
      "cpp": "class Solution {\npublic:\n    int minMeetingRooms(vector<vector<int>>& intervals) {\n        vector<int> starts, ends;\n        for (auto& i : intervals) { starts.push_back(i[0]); ends.push_back(i[1]); }\n        sort(starts.begin(), starts.end());\n        sort(ends.begin(), ends.end());\n        int rooms = 0, endPtr = 0;\n        for (int s : starts) {\n            if (s < ends[endPtr]) rooms++;\n            else endPtr++;\n        }\n        return rooms;\n    }\n};",
      "java": "class Solution {\n    public int minMeetingRooms(int[][] intervals) {\n        int[] starts = new int[intervals.length];\n        int[] ends = new int[intervals.length];\n        for (int i = 0; i < intervals.length; i++) {\n            starts[i] = intervals[i][0];\n            ends[i] = intervals[i][1];\n        }\n        Arrays.sort(starts);\n        Arrays.sort(ends);\n        int rooms = 0, endPtr = 0;\n        for (int s : starts) {\n            if (s < ends[endPtr]) rooms++;\n            else endPtr++;\n        }\n        return rooms;\n    }\n}"
    },
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)"
  },
  {
    "title": "Subarray Sum Equals K",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "google",
      "meta",
      "amazon",
      "microsoft"
    ],
    "topics": [
      "Array",
      "Hash Table",
      "Prefix Sum"
    ],
    "frequency": "High",
    "source": "Frequently asked in Google and Meta technical rounds",
    "tags": [
      "Prefix Sum",
      "Google",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an array of integers `nums` and an integer `k`, return *the total number of subarrays whose sum equals to `k`*.\n\nA subarray is a contiguous **non-empty** sequence of elements within an array.",
    "examples": [
      {
        "input": "nums = [1,1,1], k = 2",
        "output": "2",
        "explanation": "Subarrays [1,1] from indices 0..1 and 1..2."
      },
      {
        "input": "nums = [1,2,3], k = 3",
        "output": "2",
        "explanation": "Subarrays [1,2] and [3]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 2 * 10^4",
      "-1000 <= nums[i] <= 1000",
      "-10^7 <= k <= 10^7"
    ],
    "starterCode": {
      "javascript": "function subarraySum(nums, k) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def subarraySum(self, nums: list[int], k: int) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int subarraySum(int[] nums, int k) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[1,1,1]\n2",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[1,2,3]\n3",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[1,-1,0]\n0",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]\n5",
        "expectedOutput": "196",
        "isHidden": true
      },
      {
        "input": "[1,-1,0]\n0",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "[-1,-1,1]\n0",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[0,0,0,0,0]\n0",
        "expectedOutput": "15",
        "isHidden": true
      },
      {
        "input": "[100,1,2,3,4]\n6",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[1,2,1,2,1]\n3",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]\n5",
        "expectedOutput": "196",
        "isHidden": true
      },
      {
        "input": "[1,-1,0]\n0",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "[-1,-1,1]\n0",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[0,0,0,0,0]\n0",
        "expectedOutput": "15",
        "isHidden": true
      },
      {
        "input": "[100,1,2,3,4]\n6",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[1,2,1,2,1]\n3",
        "expectedOutput": "4",
        "isHidden": true
      }
    ],
    "hints": [
      "If prefixSum[j] - prefixSum[i] = k, then sum(i+1..j) = k.",
      "Store count of prefix sums in a hash map."
    ],
    "approach": "Prefix sum with frequency map: O(n) time and O(n) space.",
    "solutionCode": {
      "javascript": "function subarraySum(nums, k) {\n    const map = new Map();\n    map.set(0, 1);\n    let sum = 0, count = 0;\n    for (const num of nums) {\n        sum += num;\n        if (map.has(sum - k)) count += map.get(sum - k);\n        map.set(sum, (map.get(sum) || 0) + 1);\n    }\n    return count;\n}",
      "python": "class Solution:\n    def subarraySum(self, nums: list[int], k: int) -> int:\n        from collections import defaultdict\n        counts = defaultdict(int)\n        counts[0] = 1\n        curr_sum = 0\n        total = 0\n        for num in nums:\n            curr_sum += num\n            total += counts[curr_sum - k]\n            counts[curr_sum] += 1\n        return total",
      "cpp": "class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> seen;\n        seen[0] = 1;\n        int sum = 0, count = 0;\n        for (int num : nums) {\n            sum += num;\n            if (seen.count(sum - k)) count += seen[sum - k];\n            seen[sum]++;\n        }\n        return count;\n    }\n};",
      "java": "class Solution {\n    public int subarraySum(int[] nums, int k) {\n        Map<Integer, Integer> map = new HashMap<>();\n        map.put(0, 1);\n        int sum = 0, count = 0;\n        for (int num : nums) {\n            sum += num;\n            count += map.getOrDefault(sum - k, 0);\n            map.put(sum, map.getOrDefault(sum, 0) + 1);\n        }\n        return count;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)"
  },
  {
    "title": "Merge K Sorted Lists",
    "category": "coding",
    "type": "coding",
    "difficulty": "Hard",
    "companies": [
      "google",
      "amazon",
      "microsoft",
      "meta",
      "adobe"
    ],
    "topics": [
      "Linked List",
      "Divide and Conquer",
      "Heap (Priority Queue)",
      "Merge Sort"
    ],
    "frequency": "High",
    "source": "Core Google & Amazon SDE-2 Question",
    "tags": [
      "Hard",
      "Heap",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\n*Merge all the linked-lists into one sorted linked-list and return it.*",
    "examples": [
      {
        "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
        "output": "[1,1,2,3,4,4,5,6]",
        "explanation": "Merged into single sorted linked list."
      },
      {
        "input": "lists = []",
        "output": "[]",
        "explanation": "Empty input returns empty list."
      }
    ],
    "constraints": [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4"
    ],
    "starterCode": {
      "javascript": "function mergeKLists(lists) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def mergeKLists(self, lists: list) -> list:\n        pass",
      "cpp": "class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        return nullptr;\n    }\n};",
      "java": "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        return null;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[[1,4,5],[1,3,4],[2,6]]",
        "expectedOutput": "[1,1,2,3,4,4,5,6]",
        "isHidden": false
      },
      {
        "input": "[]",
        "expectedOutput": "[]",
        "isHidden": false
      },
      {
        "input": "[[1,4,5],[1,3,4],[2,6]]",
        "expectedOutput": "[1,1,2,3,4,4,5,6]",
        "isHidden": true
      },
      {
        "input": "[]",
        "expectedOutput": "[]",
        "isHidden": true
      },
      {
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": true
      },
      {
        "input": "[[1,4,5],[1,3,4],[2,6]]",
        "expectedOutput": "[1,1,2,3,4,4,5,6]",
        "isHidden": true
      },
      {
        "input": "[[1,2,3],[4,5,6],[7,8,9]]",
        "expectedOutput": "[1,2,3,4,5,6,7,8,9]",
        "isHidden": true
      },
      {
        "input": "[[-10,-5,0],[1,2,3],[-2,4,8]]",
        "expectedOutput": "[-10,-5,-2,0,1,2,3,4,8]",
        "isHidden": true
      }
    ],
    "hints": [
      "Use a Min-Heap of size k storing the current head of each list.",
      "Or use divide-and-conquer to merge pairs of lists."
    ],
    "approach": "Min Heap / Priority Queue or Divide & Conquer: O(N log k) time where N is total nodes.",
    "solutionCode": {
      "javascript": "function mergeKLists(lists) {\n    const values = [];\n    for (const list of lists) {\n        let curr = list;\n        while (curr) {\n            values.push(curr.val !== undefined ? curr.val : curr);\n            curr = curr.next;\n        }\n    }\n    values.sort((a, b) => a - b);\n    return values;\n}",
      "python": "class Solution:\n    def mergeKLists(self, lists: list) -> list:\n        import heapq\n        heap = []\n        for l in lists:\n            for val in l:\n                heapq.heappush(heap, val)\n        res = []\n        while heap:\n            res.append(heapq.heappop(heap))\n        return res",
      "cpp": "class Solution {\npublic:\n    vector<int> mergeKLists(vector<vector<int>>& lists) {\n        priority_queue<int, vector<int>, greater<int>> pq;\n        for (auto& l : lists) for (int x : l) pq.push(x);\n        vector<int> res;\n        while (!pq.empty()) { res.push_back(pq.top()); pq.pop(); }\n        return res;\n    }\n};",
      "java": "class Solution {\n    public List<Integer> mergeKLists(List<List<Integer>> lists) {\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        for (List<Integer> l : lists) for (int x : l) pq.add(x);\n        List<Integer> res = new ArrayList<>();\n        while (!pq.isEmpty()) res.add(pq.poll());\n        return res;\n    }\n}"
    },
    "timeComplexity": "O(N log k)",
    "spaceComplexity": "O(k)"
  },
  {
    "title": "Kth Largest Element in an Array",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "google",
      "amazon",
      "meta",
      "microsoft"
    ],
    "topics": [
      "Array",
      "Divide and Conquer",
      "Sorting",
      "Heap (Priority Queue)",
      "Quickselect"
    ],
    "frequency": "High",
    "source": "Asked in Google & Meta SWE Interviews",
    "tags": [
      "Heap",
      "Google",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an integer array `nums` and an integer `k`, return *the `k`th largest element in the array*.\n\nNote that it is the `k`th largest element in the sorted order, not the `k`th distinct element.\n\nCan you solve it without sorting in `O(n)` average time?",
    "examples": [
      {
        "input": "nums = [3,2,1,5,6,4], k = 2",
        "output": "5",
        "explanation": "Sorted: [1,2,3,4,5,6]. 2nd largest is 5."
      },
      {
        "input": "nums = [3,2,3,1,2,4,5,5,6], k = 4",
        "output": "4",
        "explanation": "4th largest element is 4."
      }
    ],
    "constraints": [
      "1 <= k <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "starterCode": {
      "javascript": "function findKthLargest(nums, k) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def findKthLargest(self, nums: list[int], k: int) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[3,2,1,5,6,4]\n2",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[3,2,3,1,2,4,5,5,6]\n4",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,136,138,140,142,144,146,148,150,152,154,156,158,160,162,164,166,168,170,172,174,176,178,180,182,184,186,188,190,192,194,196,198,200,202,204,206,208,210,212,214,216,218,220,222,224,226,228,230,232,234,236,238,240,242,244,246,248,250,252,254,256,258,260,262,264,266,268,270,272,274,276,278,280,282,284,286,288,290,292,294,296,298,300,302,304,306,308,310,312,314,316,318,320,322,324,326,328,330,332,334,336,338,340,342,344,346,348,350,352,354,356,358,360,362,364,366,368,370,372,374,376,378,380,382,384,386,388,390,392,394,396,398,400,402,404,406,408,410,412,414,416,418,420,422,424,426,428,430,432,434,436,438,440,442,444,446,448,450,452,454,456,458,460,462,464,466,468,470,472,474,476,478,480,482,484,486,488,490,492,494,496,498,500,502,504,506,508,510,512,514,516,518,520,522,524,526,528,530,532,534,536,538,540,542,544,546,548,550,552,554,556,558,560,562,564,566,568,570,572,574,576,578,580,582,584,586,588,590,592,594,596,598,600,602,604,606,608,610,612,614,616,618,620,622,624,626,628,630,632,634,636,638,640,642,644,646,648,650,652,654,656,658,660,662,664,666,668,670,672,674,676,678,680,682,684,686,688,690,692,694,696,698,700,702,704,706,708,710,712,714,716,718,720,722,724,726,728,730,732,734,736,738,740,742,744,746,748,750,752,754,756,758,760,762,764,766,768,770,772,774,776,778,780,782,784,786,788,790,792,794,796,798]\n10",
        "expectedOutput": "780",
        "isHidden": true
      },
      {
        "input": "[1]\n1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[-1,-1]\n2",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[7,6,5,4,3,2,1]\n5",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "[99,99]\n1",
        "expectedOutput": "99",
        "isHidden": true
      },
      {
        "input": "[5,2,4,1,3,6,0]\n4",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "[0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,136,138,140,142,144,146,148,150,152,154,156,158,160,162,164,166,168,170,172,174,176,178,180,182,184,186,188,190,192,194,196,198,200,202,204,206,208,210,212,214,216,218,220,222,224,226,228,230,232,234,236,238,240,242,244,246,248,250,252,254,256,258,260,262,264,266,268,270,272,274,276,278,280,282,284,286,288,290,292,294,296,298,300,302,304,306,308,310,312,314,316,318,320,322,324,326,328,330,332,334,336,338,340,342,344,346,348,350,352,354,356,358,360,362,364,366,368,370,372,374,376,378,380,382,384,386,388,390,392,394,396,398,400,402,404,406,408,410,412,414,416,418,420,422,424,426,428,430,432,434,436,438,440,442,444,446,448,450,452,454,456,458,460,462,464,466,468,470,472,474,476,478,480,482,484,486,488,490,492,494,496,498,500,502,504,506,508,510,512,514,516,518,520,522,524,526,528,530,532,534,536,538,540,542,544,546,548,550,552,554,556,558,560,562,564,566,568,570,572,574,576,578,580,582,584,586,588,590,592,594,596,598,600,602,604,606,608,610,612,614,616,618,620,622,624,626,628,630,632,634,636,638,640,642,644,646,648,650,652,654,656,658,660,662,664,666,668,670,672,674,676,678,680,682,684,686,688,690,692,694,696,698,700,702,704,706,708,710,712,714,716,718,720,722,724,726,728,730,732,734,736,738,740,742,744,746,748,750,752,754,756,758,760,762,764,766,768,770,772,774,776,778,780,782,784,786,788,790,792,794,796,798]\n10",
        "expectedOutput": "780",
        "isHidden": true
      },
      {
        "input": "[1]\n1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[-1,-1]\n2",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[7,6,5,4,3,2,1]\n5",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "[99,99]\n1",
        "expectedOutput": "99",
        "isHidden": true
      },
      {
        "input": "[5,2,4,1,3,6,0]\n4",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "hints": [
      "Use a Min Heap of size k, or QuickSelect algorithm."
    ],
    "approach": "Min-Heap of size k: O(n log k) time and O(k) space, or Quickselect: O(n) average.",
    "solutionCode": {
      "javascript": "function findKthLargest(nums, k) {\n    nums.sort((a, b) => b - a);\n    return nums[k - 1];\n}",
      "python": "class Solution:\n    def findKthLargest(self, nums: list[int], k: int) -> int:\n        import heapq\n        return heapq.nlargest(k, nums)[-1]",
      "cpp": "class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        priority_queue<int, vector<int>, greater<int>> pq;\n        for (int x : nums) {\n            pq.push(x);\n            if (pq.size() > k) pq.pop();\n        }\n        return pq.top();\n    }\n};",
      "java": "class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        for (int x : nums) {\n            pq.add(x);\n            if (pq.size() > k) pq.poll();\n        }\n        return pq.peek();\n    }\n}"
    },
    "timeComplexity": "O(n log k)",
    "spaceComplexity": "O(k)"
  },
  {
    "title": "Unique Paths",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "google",
      "amazon",
      "microsoft",
      "adobe"
    ],
    "topics": [
      "Math",
      "Dynamic Programming",
      "Combinatorics"
    ],
    "frequency": "High",
    "source": "Reported in Google SWE Coding Assessment",
    "tags": [
      "DP",
      "Google",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "There is a robot on an `m x n` grid. The robot is initially located at the **top-left corner** (i.e., `grid[0][0]`). The robot tries to move to the **bottom-right corner** (i.e., `grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time.\n\nGiven the two integers `m` and `n`, return *the number of possible unique paths that the robot can take to reach the bottom-right corner*.",
    "examples": [
      {
        "input": "m = 3, n = 7",
        "output": "28",
        "explanation": "28 unique paths from (0,0) to (2,6)."
      },
      {
        "input": "m = 3, n = 2",
        "output": "3",
        "explanation": "3 unique paths: Down->Down->Right, Down->Right->Down, Right->Down->Down."
      }
    ],
    "constraints": [
      "1 <= m, n <= 100"
    ],
    "starterCode": {
      "javascript": "function uniquePaths(m, n) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int uniquePaths(int m, int n) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "3\n7",
        "expectedOutput": "28",
        "isHidden": false
      },
      {
        "input": "3\n2",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "3\n7",
        "expectedOutput": "28",
        "isHidden": true
      },
      {
        "input": "1\n1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "3\n3",
        "expectedOutput": "6",
        "isHidden": true
      },
      {
        "input": "7\n3",
        "expectedOutput": "28",
        "isHidden": true
      },
      {
        "input": "3\n7",
        "expectedOutput": "28",
        "isHidden": true
      },
      {
        "input": "10\n10",
        "expectedOutput": "48620",
        "isHidden": true
      },
      {
        "input": "1\n10",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "10\n1",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "hints": [
      "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
      "Base cases: dp[0][j] = 1 and dp[i][0] = 1."
    ],
    "approach": "2D Dynamic Programming (or 1D rolling array): O(m*n) time and O(n) space.",
    "solutionCode": {
      "javascript": "function uniquePaths(m, n) {\n    const dp = new Array(n).fill(1);\n    for (let i = 1; i < m; i++) {\n        for (let j = 1; j < n; j++) {\n            dp[j] += dp[j - 1];\n        }\n    }\n    return dp[n - 1];\n}",
      "python": "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        dp = [1] * n\n        for _ in range(1, m):\n            for j in range(1, n):\n                dp[j] += dp[j - 1]\n        return dp[-1]",
      "cpp": "class Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        vector<int> dp(n, 1);\n        for (int i = 1; i < m; i++) {\n            for (int j = 1; j < n; j++) dp[j] += dp[j - 1];\n        }\n        return dp[n - 1];\n    }\n};",
      "java": "class Solution {\n    public int uniquePaths(int m, int n) {\n        int[] dp = new int[n];\n        Arrays.fill(dp, 1);\n        for (int i = 1; i < m; i++) {\n            for (int j = 1; j < n; j++) dp[j] += dp[j - 1];\n        }\n        return dp[n - 1];\n    }\n}"
    },
    "timeComplexity": "O(m * n)",
    "spaceComplexity": "O(n)"
  },
  {
    "title": "Search in Rotated Sorted Array",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "google",
      "amazon",
      "microsoft",
      "meta",
      "adobe"
    ],
    "topics": [
      "Array",
      "Binary Search"
    ],
    "frequency": "High",
    "source": "Classic Google & Amazon OA Problem",
    "tags": [
      "Binary Search",
      "Google",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "There is an integer array `nums` sorted in ascending order (with **distinct** values).\n\nPrior to being passed to your function, `nums` is **possibly rotated** at an unknown pivot index `k` (`1 <= k < nums.length`).\n\nGiven the array `nums` after the possible rotation and an integer `target`, return *the index of `target` if it is in `nums`, or `-1` if it is not in `nums`*.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 0",
        "output": "4",
        "explanation": "0 is at index 4."
      },
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 3",
        "output": "-1",
        "explanation": "3 not in nums."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values are unique."
    ],
    "starterCode": {
      "javascript": "function search(nums, target) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[4,5,6,7,0,1,2]\n0",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[4,5,6,7,0,1,2]\n3",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "[1]\n0",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[400,500,600,700,10,20,30,40,50,100,200,300]\n20",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "[400,500,600,700,10,20,30,40,50,100,200,300]\n999",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[1]\n0",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[1]\n1",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[1,3]\n3",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[3,1]\n1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[5,1,3]\n5",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[400,500,600,700,10,20,30,40,50,100,200,300]\n20",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "[400,500,600,700,10,20,30,40,50,100,200,300]\n999",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[1]\n0",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[1]\n1",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[1,3]\n3",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[3,1]\n1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[5,1,3]\n5",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "hints": [
      "One of the two halves [low..mid] or [mid..high] is always sorted.",
      "Check if target lies within the sorted half."
    ],
    "approach": "Modified Binary Search determining which half is normally sorted: O(log n) time.",
    "solutionCode": {
      "javascript": "function search(nums, target) {\n    let low = 0, high = nums.length - 1;\n    while (low <= high) {\n        const mid = (low + high) >> 1;\n        if (nums[mid] === target) return mid;\n        if (nums[low] <= nums[mid]) {\n            if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n            else low = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return -1;\n}",
      "python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        l, r = 0, len(nums) - 1\n        while l <= r:\n            mid = (l + r) // 2\n            if nums[mid] == target: return mid\n            if nums[l] <= nums[mid]:\n                if nums[l] <= target < nums[mid]: r = mid - 1\n                else: l = mid + 1\n            else:\n                if nums[mid] < target <= nums[r]: l = mid + 1\n                else: r = mid - 1\n        return -1",
      "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = nums.size() - 1;\n        while (l <= r) {\n            int mid = (l + r) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[l] <= nums[mid]) {\n                if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = (l + r) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[l] <= nums[mid]) {\n                if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n}"
    },
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Find First and Last Position of Element in Sorted Array",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "google",
      "microsoft",
      "amazon",
      "adobe"
    ],
    "topics": [
      "Array",
      "Binary Search"
    ],
    "frequency": "High",
    "source": "Reported in Google & Microsoft technical interviews",
    "tags": [
      "Binary Search",
      "Google",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3,4]",
        "explanation": "8 starts at 3 and ends at 4."
      },
      {
        "input": "nums = [5,7,7,8,8,10], target = 6",
        "output": "[-1,-1]",
        "explanation": "6 is not in the array."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is non-decreasing."
    ],
    "starterCode": {
      "javascript": "function searchRange(nums, target) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def searchRange(self, nums: list[int], target: int) -> list[int]:\n        pass",
      "cpp": "class Solution {\npublic:\n    vector<int> searchRange(vector<int>& nums, int target) {\n        return {-1, -1};\n    }\n};",
      "java": "class Solution {\n    public int[] searchRange(int[] nums, int target) {\n        return new int[]{-1, -1};\n    }\n}"
    },
    "testCases": [
      {
        "input": "[5,7,7,8,8,10]\n8",
        "expectedOutput": "[3,4]",
        "isHidden": false
      },
      {
        "input": "[5,7,7,8,8,10]\n6",
        "expectedOutput": "[-1,-1]",
        "isHidden": false
      },
      {
        "input": "[5,7,7,8,8,10]\n8",
        "expectedOutput": "[3,4]",
        "isHidden": true
      },
      {
        "input": "[0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33,34,34,34,34,35,35,35,35,36,36,36,36,37,37,37,37,38,38,38,38,39,39,39,39,40,40,40,40,41,41,41,41,42,42,42,42,43,43,43,43,44,44,44,44,45,45,45,45,46,46,46,46,47,47,47,47,48,48,48,48,49,49,49,49,50,50,50,50,51,51,51,51,52,52,52,52,53,53,53,53,54,54,54,54,55,55,55,55,56,56,56,56,57,57,57,57,58,58,58,58,59,59,59,59,60,60,60,60,61,61,61,61,62,62,62,62,63,63,63,63,64,64,64,64,65,65,65,65,66,66,66,66,67,67,67,67,68,68,68,68,69,69,69,69,70,70,70,70,71,71,71,71,72,72,72,72,73,73,73,73,74,74,74,74,75,75,75,75,76,76,76,76,77,77,77,77,78,78,78,78,79,79,79,79,80,80,80,80,81,81,81,81,82,82,82,82,83,83,83,83,84,84,84,84,85,85,85,85,86,86,86,86,87,87,87,87,88,88,88,88,89,89,89,89,90,90,90,90,91,91,91,91,92,92,92,92,93,93,93,93,94,94,94,94,95,95,95,95,96,96,96,96,97,97,97,97,98,98,98,98,99,99,99,99]\n50",
        "expectedOutput": "[200,203]",
        "isHidden": true
      },
      {
        "input": "[]\n0",
        "expectedOutput": "[-1,-1]",
        "isHidden": true
      },
      {
        "input": "[1]\n1",
        "expectedOutput": "[0,0]",
        "isHidden": true
      },
      {
        "input": "[1]\n2",
        "expectedOutput": "[-1,-1]",
        "isHidden": true
      },
      {
        "input": "[2,2,2,2,2,2,2]\n2",
        "expectedOutput": "[0,6]",
        "isHidden": true
      },
      {
        "input": "[1,3,5,7,9]\n5",
        "expectedOutput": "[2,2]",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]\n6",
        "expectedOutput": "[-1,-1]",
        "isHidden": true
      }
    ],
    "hints": [
      "Run two separate binary searches: one for the lower bound and one for the upper bound."
    ],
    "approach": "Dual Binary Search: O(log n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function searchRange(nums, target) {\n    const findBound = (isFirst) => {\n        let low = 0, high = nums.length - 1, res = -1;\n        while (low <= high) {\n            const mid = (low + high) >> 1;\n            if (nums[mid] === target) {\n                res = mid;\n                if (isFirst) high = mid - 1;\n                else low = mid + 1;\n            } else if (nums[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return res;\n    };\n    return [findBound(true), findBound(false)];\n}",
      "python": "class Solution:\n    def searchRange(self, nums: list[int], target: int) -> list[int]:\n        def find_bound(is_first):\n            l, r, res = 0, len(nums) - 1, -1\n            while l <= r:\n                mid = (l + r) // 2\n                if nums[mid] == target:\n                    res = mid\n                    if is_first: r = mid - 1\n                    else: l = mid + 1\n                elif nums[mid] < target: l = mid + 1\n                else: r = mid - 1\n            return res\n        return [find_bound(True), find_bound(False)]",
      "cpp": "class Solution {\npublic:\n    vector<int> searchRange(vector<int>& nums, int target) {\n        auto findBound = [&](bool isFirst) {\n            int l = 0, r = nums.size() - 1, res = -1;\n            while (l <= r) {\n                int mid = (l + r) / 2;\n                if (nums[mid] == target) {\n                    res = mid;\n                    if (isFirst) r = mid - 1;\n                    else l = mid + 1;\n                } else if (nums[mid] < target) l = mid + 1;\n                else r = mid - 1;\n            }\n            return res;\n        };\n        return {findBound(true), findBound(false)};\n    }\n};",
      "java": "class Solution {\n    public int[] searchRange(int[] nums, int target) {\n        return new int[]{findBound(nums, target, true), findBound(nums, target, false)};\n    }\n    private int findBound(int[] nums, int target, boolean isFirst) {\n        int l = 0, r = nums.length - 1, res = -1;\n        while (l <= r) {\n            int mid = (l + r) / 2;\n            if (nums[mid] == target) {\n                res = mid;\n                if (isFirst) r = mid - 1;\n                else l = mid + 1;\n            } else if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return res;\n    }\n}"
    },
    "timeComplexity": "O(log n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Bus Routes",
    "category": "coding",
    "type": "coding",
    "difficulty": "Hard",
    "companies": [
      "google"
    ],
    "topics": [
      "Array",
      "Hash Table",
      "Breadth-First Search",
      "Graph"
    ],
    "frequency": "High",
    "source": "Top Google Graph Problem",
    "tags": [
      "Hard",
      "BFS",
      "Google",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "You are given an array `routes` representing bus routes where `routes[i]` is a bus route that the `i`th bus repeats forever.\n\nFor example, if `routes[0] = [1, 5, 7]`, this means that the `0`th bus travels in the sequence `1 -> 5 -> 7 -> 1 -> 5 -> 7 -> ...` forever.\n\nYou will start at the bus stop `source` (you are not on any bus initially), and you want to go to the bus stop `target`. You can travel between bus stops by buses only.\n\nReturn *the least number of buses you must take to travel from `source` to `target`*. Return `-1` if it is not possible.",
    "examples": [
      {
        "input": "routes = [[1,2,7],[3,6,7]], source = 1, target = 6",
        "output": "2",
        "explanation": "Take bus 0 (1->7), transfer to bus 1 (7->6)."
      },
      {
        "input": "routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12",
        "output": "-1",
        "explanation": "Cannot reach 12 from 15."
      }
    ],
    "constraints": [
      "1 <= routes.length <= 500",
      "1 <= routes[i].length <= 10^5",
      "0 <= routes[i][j] < 10^6"
    ],
    "starterCode": {
      "javascript": "function numBusesToDestination(routes, source, target) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def numBusesToDestination(self, routes: list[list[int]], source: int, target: int) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int numBusesToDestination(vector<vector<int>>& routes, int source, int target) {\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int numBusesToDestination(int[][] routes, int source, int target) {\n        return -1;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[[1,2,7],[3,6,7]]\n1\n6",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[7,12],[4,5,15],[6],[15,19],[9,12,13]]\n15\n12",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "[[1,2,7],[3,6,7]]\n1\n6",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[[1,2,7],[3,6,7]]\n1\n6",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[[7,12],[4,5,15],[6],[15,19],[9,12,13]]\n15\n12",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[[1,2,3],[4,5,6]]\n1\n5",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[[1,2],[2,3],[3,4],[4,5]]\n1\n5",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[[1,7],[7,10],[10,15]]\n1\n15",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "hints": [
      "Map each stop to all bus routes that visit it.",
      "Perform BFS where each level represents taking 1 more bus."
    ],
    "approach": "Breadth-First Search on bus routes: O(N * M) time.",
    "solutionCode": {
      "javascript": "function numBusesToDestination(routes, source, target) {\n    if (source === target) return 0;\n    const stopToRoutes = new Map();\n    routes.forEach((route, rIdx) => {\n        for (const stop of route) {\n            if (!stopToRoutes.has(stop)) stopToRoutes.set(stop, []);\n            stopToRoutes.get(stop).push(rIdx);\n        }\n    });\n    const queue = [[source, 0]];\n    const visitedStops = new Set([source]);\n    const visitedRoutes = new Set();\n    while (queue.length > 0) {\n        const [stop, buses] = queue.shift();\n        if (stop === target) return buses;\n        for (const rIdx of (stopToRoutes.get(stop) || [])) {\n            if (visitedRoutes.has(rIdx)) continue;\n            visitedRoutes.add(rIdx);\n            for (const nextStop of routes[rIdx]) {\n                if (!visitedStops.has(nextStop)) {\n                    visitedStops.add(nextStop);\n                    queue.push([nextStop, buses + 1]);\n                }\n            }\n        }\n    }\n    return -1;\n}",
      "python": "class Solution:\n    def numBusesToDestination(self, routes: list[list[int]], source: int, target: int) -> int:\n        if source == target: return 0\n        from collections import defaultdict, deque\n        stop_to_routes = defaultdict(list)\n        for i, r in enumerate(routes):\n            for s in r: stop_to_routes[s].append(i)\n        q = deque([(source, 0)])\n        visited_stops = {source}\n        visited_routes = set()\n        while q:\n            stop, buses = q.popleft()\n            if stop == target: return buses\n            for r in stop_to_routes[stop]:\n                if r not in visited_routes:\n                    visited_routes.add(r)\n                    for next_s in routes[r]:\n                        if next_s not in visited_stops:\n                            visited_stops.add(next_s)\n                            q.append((next_s, buses + 1))\n        return -1",
      "cpp": "class Solution {\npublic:\n    int numBusesToDestination(vector<vector<int>>& routes, int source, int target) {\n        if (source == target) return 0;\n        unordered_map<int, vector<int>> stopToRoutes;\n        for (int i = 0; i < routes.size(); i++) for (int s : routes[i]) stopToRoutes[s].push_back(i);\n        queue<pair<int, int>> q;\n        q.push({source, 0});\n        unordered_set<int> visitedStops = {source}, visitedRoutes;\n        while (!q.empty()) {\n            auto [stop, buses] = q.front(); q.pop();\n            if (stop == target) return buses;\n            for (int r : stopToRoutes[stop]) {\n                if (!visitedRoutes.count(r)) {\n                    visitedRoutes.insert(r);\n                    for (int nextS : routes[r]) {\n                        if (!visitedStops.count(nextS)) {\n                            visitedStops.insert(nextS);\n                            q.push({nextS, buses + 1});\n                        }\n                    }\n                }\n            }\n        }\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int numBusesToDestination(int[][] routes, int source, int target) {\n        if (source == target) return 0;\n        Map<Integer, List<Integer>> stopToRoutes = new HashMap<>();\n        for (int i = 0; i < routes.length; i++) {\n            for (int s : routes[i]) {\n                stopToRoutes.computeIfAbsent(s, k -> new ArrayList<>()).add(i);\n            }\n        }\n        Queue<int[]> q = new LinkedList<>();\n        q.add(new int[]{source, 0});\n        Set<Integer> visitedStops = new HashSet<>();\n        Set<Integer> visitedRoutes = new HashSet<>();\n        visitedStops.add(source);\n        while (!q.isEmpty()) {\n            int[] curr = q.poll();\n            int stop = curr[0], buses = curr[1];\n            if (stop == target) return buses;\n            for (int r : stopToRoutes.getOrDefault(stop, Collections.emptyList())) {\n                if (visitedRoutes.add(r)) {\n                    for (int nextS : routes[r]) {\n                        if (visitedStops.add(nextS)) {\n                            q.add(new int[]{nextS, buses + 1});\n                        }\n                    }\n                }\n            }\n        }\n        return -1;\n    }\n}"
    },
    "timeComplexity": "O(sum(routes[i].length))",
    "spaceComplexity": "O(sum(routes[i].length))"
  },
  {
    "title": "Number of Islands",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft",
      "meta",
      "adobe"
    ],
    "topics": [
      "Array",
      "Depth-First Search",
      "Breadth-First Search",
      "Matrix"
    ],
    "frequency": "High",
    "source": "Top Amazon Online Assessment & Technical Round Question",
    "tags": [
      "Graph",
      "Matrix",
      "Amazon",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return *the number of islands*.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "output": "1",
        "explanation": "1 contiguous connected island."
      },
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "explanation": "3 separate islands."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    "starterCode": {
      "javascript": "function numIslands(grid) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[[\"1\",\"0\",\"1\",\"0\",\"1\"],[\"0\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"0\",\"1\",\"0\",\"1\"],[\"0\",\"1\",\"0\",\"1\",\"0\"]]",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "[[\"0\"]]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[[\"1\"]]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[[\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\"]]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[[\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\"]]",
        "expectedOutput": "2",
        "isHidden": true
      }
    ],
    "hints": [
      "Traverse the grid. When encountering '1', trigger DFS/BFS to sink the connected island to '0'."
    ],
    "approach": "Matrix DFS / BFS sinking visited land cells in-place: O(M * N) time and O(M * N) space.",
    "solutionCode": {
      "javascript": "function numIslands(grid) {\n    if (!grid.length) return 0;\n    let count = 0;\n    const dfs = (r, c) => {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== '1') return;\n        grid[r][c] = '0';\n        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n    };\n    for (let r = 0; r < grid.length; r++) {\n        for (let c = 0; c < grid[0].length; c++) {\n            if (grid[r][c] === '1') {\n                count++;\n                dfs(r, c);\n            }\n        }\n    }\n    return count;\n}",
      "python": "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        if not grid: return 0\n        rows, cols = len(grid), len(grid[0])\n        count = 0\n        def dfs(r, c):\n            if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1': return\n            grid[r][c] = '0'\n            dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == '1':\n                    count += 1\n                    dfs(r, c)\n        return count",
      "cpp": "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        int count = 0;\n        int m = grid.size(), n = grid[0].size();\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (grid[r][c] == '1') {\n                    count++;\n                    sink(grid, r, c, m, n);\n                }\n            }\n        }\n        return count;\n    }\n    void sink(vector<vector<char>>& grid, int r, int c, int m, int n) {\n        if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] != '1') return;\n        grid[r][c] = '0';\n        sink(grid, r+1, c, m, n); sink(grid, r-1, c, m, n);\n        sink(grid, r, c+1, m, n); sink(grid, r, c-1, m, n);\n    }\n};",
      "java": "class Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == '1') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    private void dfs(char[][] grid, int r, int c) {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;\n        grid[r][c] = '0';\n        dfs(grid, r + 1, c); dfs(grid, r - 1, c); dfs(grid, r, c + 1); dfs(grid, r, c - 1);\n    }\n}"
    },
    "timeComplexity": "O(m * n)",
    "spaceComplexity": "O(m * n)"
  },
  {
    "title": "Rotting Oranges",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "microsoft",
      "google"
    ],
    "topics": [
      "Array",
      "Breadth-First Search",
      "Matrix"
    ],
    "frequency": "High",
    "source": "High frequency Amazon Online Assessment Problem",
    "tags": [
      "Matrix",
      "BFS",
      "Amazon",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "You are given an `m x n` grid where each cell can have one of three values:\n- `0` representing an empty cell,\n- `1` representing a fresh orange, or\n- `2` representing a rotten orange.\n\nEvery minute, any fresh orange that is **4-directionally adjacent** to a rotten orange becomes rotten.\n\nReturn *the minimum number of minutes that must elapse until no cell has a fresh orange*. If this is impossible, return `-1`.",
    "examples": [
      {
        "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
        "output": "4",
        "explanation": "All oranges rot in 4 minutes."
      },
      {
        "input": "grid = [[2,1,1],[0,1,1],[1,0,1]]",
        "output": "-1",
        "explanation": "Bottom-left orange never rots."
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 10",
      "grid[i][j] is 0, 1, or 2."
    ],
    "starterCode": {
      "javascript": "function orangesRotting(grid) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def orangesRotting(self, grid: list[list[int]]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int orangesRotting(vector<vector<int>>& grid) {\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int orangesRotting(int[][] grid) {\n        return -1;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[[2,1,1],[1,1,0],[0,1,1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[2,1,1],[0,1,1],[1,0,1]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "[[0,2]]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[[2,1,1],[1,1,0],[0,1,1]]",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[[1,1,1],[1,1,1],[1,1,1]]",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[[2,1,1],[0,1,1],[1,0,1]]",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[[0,2]]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[[2,2],[1,1],[0,0],[2,0]]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[[2,1,1],[1,1,0],[0,1,1]]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ],
    "hints": [
      "Use multi-source BFS starting with all initially rotten oranges in the queue."
    ],
    "approach": "Multi-Source BFS: O(m * n) time and O(m * n) space.",
    "solutionCode": {
      "javascript": "function orangesRotting(grid) {\n    const m = grid.length, n = grid[0].length;\n    const queue = [];\n    let fresh = 0, minutes = 0;\n    for (let r = 0; r < m; r++) {\n        for (let c = 0; c < n; c++) {\n            if (grid[r][c] === 2) queue.push([r, c]);\n            else if (grid[r][c] === 1) fresh++;\n        }\n    }\n    const dirs = [[1,0], [-1,0], [0,1], [0,-1]];\n    while (queue.length > 0 && fresh > 0) {\n        const size = queue.length;\n        for (let i = 0; i < size; i++) {\n            const [r, c] = queue.shift();\n            for (const [dr, dc] of dirs) {\n                const nr = r + dr, nc = c + dc;\n                if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] === 1) {\n                    grid[nr][nc] = 2;\n                    fresh--;\n                    queue.push([nr, nc]);\n                }\n            }\n        }\n        minutes++;\n    }\n    return fresh === 0 ? minutes : -1;\n}",
      "python": "class Solution:\n    def orangesRotting(self, grid: list[list[int]]) -> int:\n        from collections import deque\n        m, n = len(grid), len(grid[0])\n        q = deque()\n        fresh = 0\n        for r in range(m):\n            for c in range(n):\n                if grid[r][c] == 2: q.append((r, c))\n                elif grid[r][c] == 1: fresh += 1\n        minutes = 0\n        dirs = [(1,0),(-1,0),(0,1),(0,-1)]\n        while q and fresh > 0:\n            for _ in range(len(q)):\n                r, c = q.popleft()\n                for dr, dc in dirs:\n                    nr, nc = r + dr, c + dc\n                    if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:\n                        grid[nr][nc] = 2\n                        fresh -= 1\n                        q.append((nr, nc))\n            minutes += 1\n        return minutes if fresh == 0 else -1",
      "cpp": "class Solution {\npublic:\n    int orangesRotting(vector<vector<int>>& grid) {\n        int m = grid.size(), n = grid[0].size(), fresh = 0, minutes = 0;\n        queue<pair<int, int>> q;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (grid[r][c] == 2) q.push({r, c});\n                else if (grid[r][c] == 1) fresh++;\n            }\n        }\n        vector<pair<int, int>> dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};\n        while (!q.empty() && fresh > 0) {\n            int sz = q.size();\n            for (int i = 0; i < sz; i++) {\n                auto [r, c] = q.front(); q.pop();\n                for (auto& [dr, dc] : dirs) {\n                    int nr = r + dr, nc = c + dc;\n                    if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] == 1) {\n                        grid[nr][nc] = 2;\n                        fresh--;\n                        q.push({nr, nc});\n                    }\n                }\n            }\n            minutes++;\n        }\n        return fresh == 0 ? minutes : -1;\n    }\n};",
      "java": "class Solution {\n    public int orangesRotting(int[][] grid) {\n        int m = grid.length, n = grid[0].length, fresh = 0, minutes = 0;\n        Queue<int[]> q = new LinkedList<>();\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (grid[r][c] == 2) q.add(new int[]{r, c});\n                else if (grid[r][c] == 1) fresh++;\n            }\n        }\n        int[][] dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};\n        while (!q.isEmpty() && fresh > 0) {\n            int sz = q.size();\n            for (int i = 0; i < sz; i++) {\n                int[] curr = q.poll();\n                for (int[] d : dirs) {\n                    int nr = curr[0] + d[0], nc = curr[1] + d[1];\n                    if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] == 1) {\n                        grid[nr][nc] = 2;\n                        fresh--;\n                        q.add(new int[]{nr, nc});\n                    }\n                }\n            }\n            minutes++;\n        }\n        return fresh == 0 ? minutes : -1;\n    }\n}"
    },
    "timeComplexity": "O(m * n)",
    "spaceComplexity": "O(m * n)"
  },
  {
    "title": "K Closest Points to Origin",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "meta",
      "google"
    ],
    "topics": [
      "Array",
      "Math",
      "Divide and Conquer",
      "Geometry",
      "Sorting",
      "Heap (Priority Queue)"
    ],
    "frequency": "High",
    "source": "Top Amazon OA Question",
    "tags": [
      "Heap",
      "Amazon",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an array of `points` where `points[i] = [x_i, y_i]` represents a point on the **X-Y** plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.\n\nThe distance between two points on the X-Y plane is the Euclidean distance (i.e., `sqrt((x_1 - x_2)^2 + (y_1 - y_2)^2)`).\n\nYou may return the answer in **any order**.",
    "examples": [
      {
        "input": "points = [[1,3],[-2,2]], k = 1",
        "output": "[[-2,2]]",
        "explanation": "(-2,2) has distance sqrt(8), (1,3) has distance sqrt(10)."
      },
      {
        "input": "points = [[3,3],[5,-1],[-2,4]], k = 2",
        "output": "[[3,3],[-2,4]]",
        "explanation": "Two closest points to origin."
      }
    ],
    "constraints": [
      "1 <= k <= points.length <= 10^4",
      "-10^4 <= x_i, y_i <= 10^4"
    ],
    "starterCode": {
      "javascript": "function kClosest(points, k) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:\n        pass",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[][] kClosest(int[][] points, int k) {\n        return new int[][]{};\n    }\n}"
    },
    "testCases": [
      {
        "input": "[[1,3],[-2,2]]\n1",
        "expectedOutput": "[[-2,2]]",
        "isHidden": false
      },
      {
        "input": "[[3,3],[5,-1],[-2,4]]\n2",
        "expectedOutput": "[[3,3],[-2,4]]",
        "isHidden": false
      },
      {
        "input": "[[1,3],[-2,2]]\n1",
        "expectedOutput": "[[-2,2]]",
        "isHidden": true
      },
      {
        "input": "[[1,2],[2,4],[3,6],[4,8],[5,10],[6,12],[7,14],[8,16],[9,18],[10,20],[11,22],[12,24],[13,26],[14,28],[15,30],[16,32],[17,34],[18,36],[19,38],[20,40],[21,42],[22,44],[23,46],[24,48],[25,50],[26,52],[27,54],[28,56],[29,58],[30,60],[31,62],[32,64],[33,66],[34,68],[35,70],[36,72],[37,74],[38,76],[39,78],[40,80],[41,82],[42,84],[43,86],[44,88],[45,90],[46,92],[47,94],[48,96],[49,98],[50,100],[51,102],[52,104],[53,106],[54,108],[55,110],[56,112],[57,114],[58,116],[59,118],[60,120],[61,122],[62,124],[63,126],[64,128],[65,130],[66,132],[67,134],[68,136],[69,138],[70,140],[71,142],[72,144],[73,146],[74,148],[75,150],[76,152],[77,154],[78,156],[79,158],[80,160],[81,162],[82,164],[83,166],[84,168],[85,170],[86,172],[87,174],[88,176],[89,178],[90,180],[91,182],[92,184],[93,186],[94,188],[95,190],[96,192],[97,194],[98,196],[99,198],[100,200]]\n5",
        "expectedOutput": "[[1,2],[2,4],[3,6],[4,8],[5,10]]",
        "isHidden": true
      },
      {
        "input": "[[1,3],[-2,2]]\n1",
        "expectedOutput": "[[-2,2]]",
        "isHidden": true
      },
      {
        "input": "[[3,3],[5,-1],[-2,4]]\n2",
        "expectedOutput": "[[3,3],[-2,4]]",
        "isHidden": true
      },
      {
        "input": "[[0,1],[1,0]]\n2",
        "expectedOutput": "[[0,1],[1,0]]",
        "isHidden": true
      },
      {
        "input": "[[-5,4],[-6,-5],[4,6]]\n2",
        "expectedOutput": "[[-5,4],[4,6]]",
        "isHidden": true
      }
    ],
    "hints": [
      "Calculate distance squared x^2 + y^2.",
      "Use a max-heap of size k or sort by squared distance."
    ],
    "approach": "Max-Heap of size k or sort by Euclidean distance squared: O(n log k) time.",
    "solutionCode": {
      "javascript": "function kClosest(points, k) {\n    points.sort((a, b) => (a[0]**2 + a[1]**2) - (b[0]**2 + b[1]**2));\n    return points.slice(0, k);\n}",
      "python": "class Solution:\n    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:\n        import heapq\n        return heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2)",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {\n        sort(points.begin(), points.end(), [](const vector<int>& a, const vector<int>& b) {\n            return (a[0]*a[0] + a[1]*a[1]) < (b[0]*b[0] + b[1]*b[1]);\n        });\n        return vector<vector<int>>(points.begin(), points.begin() + k);\n    }\n};",
      "java": "class Solution {\n    public int[][] kClosest(int[][] points, int k) {\n        Arrays.sort(points, (a, b) -> Integer.compare(a[0]*a[0] + a[1]*a[1], b[0]*b[0] + b[1]*b[1]));\n        return Arrays.copyOfRange(points, 0, k);\n    }\n}"
    },
    "timeComplexity": "O(n log k)",
    "spaceComplexity": "O(k)"
  },
  {
    "title": "Merge Intervals",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "microsoft",
      "google",
      "meta",
      "adobe"
    ],
    "topics": [
      "Array",
      "Sorting"
    ],
    "frequency": "High",
    "source": "High frequency Amazon SDE-1 OA & Bar Raiser Question",
    "tags": [
      "Intervals",
      "Amazon",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Since [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Overlapping at boundary 4."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "starterCode": {
      "javascript": "function merge(intervals) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        pass",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        return new int[][]{};\n    }\n}"
    },
    "testCases": [
      {
        "input": "[[1,3],[2,6],[8,10],[15,18]]",
        "expectedOutput": "[[1,6],[8,10],[15,18]]",
        "isHidden": false
      },
      {
        "input": "[[1,4],[4,5]]",
        "expectedOutput": "[[1,5]]",
        "isHidden": false
      },
      {
        "input": "[[1,4],[0,4]]",
        "expectedOutput": "[[0,4]]",
        "isHidden": true
      },
      {
        "input": "[[1,4],[2,3]]",
        "expectedOutput": "[[1,4]]",
        "isHidden": true
      },
      {
        "input": "[[1,4],[0,0]]",
        "expectedOutput": "[[0,0],[1,4]]",
        "isHidden": true
      },
      {
        "input": "[[1,10],[2,3],[4,5],[6,7],[8,9]]",
        "expectedOutput": "[[1,10]]",
        "isHidden": true
      },
      {
        "input": "[[2,3],[4,5],[6,7],[8,9],[1,10]]",
        "expectedOutput": "[[1,10]]",
        "isHidden": true
      },
      {
        "input": "[[1,4],[5,6]]",
        "expectedOutput": "[[1,4],[5,6]]",
        "isHidden": true
      },
      {
        "input": "[[1,4],[0,4]]",
        "expectedOutput": "[[0,4]]",
        "isHidden": true
      },
      {
        "input": "[[1,4],[2,3]]",
        "expectedOutput": "[[1,4]]",
        "isHidden": true
      },
      {
        "input": "[[1,4],[0,0]]",
        "expectedOutput": "[[0,0],[1,4]]",
        "isHidden": true
      },
      {
        "input": "[[1,10],[2,3],[4,5],[6,7],[8,9]]",
        "expectedOutput": "[[1,10]]",
        "isHidden": true
      },
      {
        "input": "[[2,3],[4,5],[6,7],[8,9],[1,10]]",
        "expectedOutput": "[[1,10]]",
        "isHidden": true
      },
      {
        "input": "[[1,4],[5,6]]",
        "expectedOutput": "[[1,4],[5,6]]",
        "isHidden": true
      }
    ],
    "hints": [
      "Sort the intervals by their start times.",
      "Compare the current interval's start with the previous interval's end."
    ],
    "approach": "Sort by start time and merge overlapping intervals: O(n log n) time and O(n) space.",
    "solutionCode": {
      "javascript": "function merge(intervals) {\n    if (intervals.length <= 1) return intervals;\n    intervals.sort((a, b) => a[0] - b[0]);\n    const merged = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const last = merged[merged.length - 1];\n        const curr = intervals[i];\n        if (curr[0] <= last[1]) last[1] = Math.max(last[1], curr[1]);\n        else merged.push(curr);\n    }\n    return merged;\n}",
      "python": "class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        intervals.sort(key=lambda x: x[0])\n        merged = [intervals[0]]\n        for curr in intervals[1:]:\n            if curr[0] <= merged[-1][1]:\n                merged[-1][1] = max(merged[-1][1], curr[1])\n            else:\n                merged.append(curr)\n        return merged",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> merged = {intervals[0]};\n        for (int i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] <= merged.back()[1]) {\n                merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n            } else {\n                merged.push_back(intervals[i]);\n            }\n        }\n        return merged;\n    }\n};",
      "java": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> merged = new ArrayList<>();\n        merged.add(intervals[0]);\n        for (int i = 1; i < intervals.length; i++) {\n            int[] last = merged.get(merged.size() - 1);\n            if (intervals[i][0] <= last[1]) {\n                last[1] = Math.max(last[1], intervals[i][1]);\n            } else {\n                merged.add(intervals[i]);\n            }\n        }\n        return merged.toArray(new int[merged.size()][]);\n    }\n}"
    },
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)"
  },
  {
    "title": "Coin Change",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "amazon",
      "google",
      "microsoft",
      "adobe"
    ],
    "topics": [
      "Array",
      "Dynamic Programming",
      "Breadth-First Search"
    ],
    "frequency": "High",
    "source": "Top Amazon Dynamic Programming Problem",
    "tags": [
      "DP",
      "Amazon",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    "examples": [
      {
        "input": "coins = [1,2,5], amount = 11",
        "output": "3",
        "explanation": "11 = 5 + 5 + 1."
      },
      {
        "input": "coins = [2], amount = 3",
        "output": "-1",
        "explanation": "Cannot make 3 using only 2."
      },
      {
        "input": "coins = [1], amount = 0",
        "output": "0",
        "explanation": "0 coins needed for 0."
      }
    ],
    "constraints": [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    "starterCode": {
      "javascript": "function coinChange(coins, amount) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[1,2,5]\n11",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[2]\n3",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "[1]\n0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[1]\n0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[1]\n1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[1]\n2",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[186,419,83,408]\n6249",
        "expectedOutput": "20",
        "isHidden": true
      },
      {
        "input": "[2,5,10,1]\n27",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[2]\n1",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[3,7,405,436]\n8839",
        "expectedOutput": "25",
        "isHidden": true
      },
      {
        "input": "[1]\n0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[1]\n1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[1]\n2",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[186,419,83,408]\n6249",
        "expectedOutput": "20",
        "isHidden": true
      },
      {
        "input": "[2,5,10,1]\n27",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[2]\n1",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[3,7,405,436]\n8839",
        "expectedOutput": "25",
        "isHidden": true
      }
    ],
    "hints": [
      "Define dp[i] as the min coins to form amount i.",
      "dp[i] = min(dp[i], dp[i - coin] + 1)."
    ],
    "approach": "Bottom-up Dynamic Programming (Unbounded Knapsack): O(amount * coins.length) time.",
    "solutionCode": {
      "javascript": "function coinChange(coins, amount) {\n    const dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let i = 1; i <= amount; i++) {\n        for (const coin of coins) {\n            if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n        }\n    }\n    return dp[amount] === Infinity ? -1 : dp[amount];\n}",
      "python": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        dp = [float('inf')] * (amount + 1)\n        dp[0] = 0\n        for i in range(1, amount + 1):\n            for c in coins:\n                if i - c >= 0:\n                    dp[i] = min(dp[i], dp[i - c] + 1)\n        return dp[amount] if dp[amount] != float('inf') else -1",
      "cpp": "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i - c >= 0) dp[i] = min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};",
      "java": "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) {\n                if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}"
    },
    "timeComplexity": "O(amount * n)",
    "spaceComplexity": "O(amount)"
  },
  {
    "title": "Valid Anagram",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "tcs",
      "infosys",
      "accenture",
      "wipro",
      "cognizant"
    ],
    "topics": [
      "String",
      "Hash Table",
      "Sorting"
    ],
    "frequency": "High",
    "source": "Reported in TCS NQT & Infosys Assessment",
    "tags": [
      "OA",
      "String",
      "TCS",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given two strings `s` and `t`, return `true` *if `t` is an anagram of `s`, and `false` otherwise*.\n\nAn **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "examples": [
      {
        "input": "s = \"anagram\", t = \"nagaram\"",
        "output": "true",
        "explanation": "Both contain the same character counts."
      },
      {
        "input": "s = \"rat\", t = \"car\"",
        "output": "false",
        "explanation": "Different character sets."
      }
    ],
    "constraints": [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    "starterCode": {
      "javascript": "function isAnagram(s, t) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass",
      "cpp": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        return false;\n    }\n}"
    },
    "testCases": [
      {
        "input": "\"anagram\"\n\"nagaram\"",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "\"rat\"\n\"car\"",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "\"anagram\"\n\"nagaram\"",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"a\"\n\"a\"",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"ab\"\n\"a\"",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "\"aacc\"\n\"ccac\"",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "\"listen\"\n\"silent\"",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"triangle\"\n\"integral\"",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "\"fluster\"\n\"restful\"",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "hints": [
      "Check if lengths match.",
      "Use a 26-element frequency array to increment for s and decrement for t."
    ],
    "approach": "Character frequency array: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const counts = new Array(26).fill(0);\n    for (let i = 0; i < s.length; i++) {\n        counts[s.charCodeAt(i) - 97]++;\n        counts[t.charCodeAt(i) - 97]--;\n    }\n    return counts.every(c => c === 0);\n}",
      "python": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        if len(s) != len(t): return False\n        from collections import Counter\n        return Counter(s) == Counter(t)",
      "cpp": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if (s.length() != t.length()) return false;\n        vector<int> counts(26, 0);\n        for (int i = 0; i < s.length(); i++) {\n            counts[s[i] - 'a']++;\n            counts[t[i] - 'a']--;\n        }\n        for (int c : counts) if (c != 0) return false;\n        return true;\n    }\n};",
      "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] counts = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            counts[s.charAt(i) - 'a']++;\n            counts[t.charAt(i) - 'a']--;\n        }\n        for (int c : counts) if (c != 0) return false;\n        return true;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Second Largest Element in Array",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "tcs",
      "wipro",
      "accenture",
      "cognizant"
    ],
    "topics": [
      "Array"
    ],
    "frequency": "High",
    "source": "Frequently asked in TCS NQT Hands-on Coding",
    "tags": [
      "TCS NQT",
      "Array",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an array of integers `nums`, return *the second largest distinct element* in the array. If the second largest element does not exist, return `-1`.",
    "examples": [
      {
        "input": "nums = [12, 35, 1, 10, 34, 1]",
        "output": "34",
        "explanation": "The largest element is 35 and the second largest element is 34."
      },
      {
        "input": "nums = [10, 10, 10]",
        "output": "-1",
        "explanation": "All elements are equal."
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^5",
      "1 <= nums[i] <= 10^6"
    ],
    "starterCode": {
      "javascript": "function getSecondLargest(nums) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def getSecondLargest(self, nums: list[int]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int getSecondLargest(vector<int>& nums) {\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int getSecondLargest(int[] nums) {\n        return -1;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[12, 35, 1, 10, 34, 1]",
        "expectedOutput": "34",
        "isHidden": false
      },
      {
        "input": "[10, 10, 10]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "[12, 35, 1, 10, 34, 1]",
        "expectedOutput": "34",
        "isHidden": true
      },
      {
        "input": "[10,10,10]",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[5]",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[5,4,3,2,1]",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[-10,-5,-20,-2]",
        "expectedOutput": "-5",
        "isHidden": true
      },
      {
        "input": "[100,50,100,25]",
        "expectedOutput": "50",
        "isHidden": true
      },
      {
        "input": "[1,1,1,1,2]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "hints": [
      "Maintain largest and secondLargest in a single pass."
    ],
    "approach": "Single pass traversal updating largest and second_largest: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function getSecondLargest(nums) {\n    let first = -1, second = -1;\n    for (const x of nums) {\n        if (x > first) {\n            second = first;\n            first = x;\n        } else if (x > second && x < first) {\n            second = x;\n        }\n    }\n    return second;\n}",
      "python": "class Solution:\n    def getSecondLargest(self, nums: list[int]) -> int:\n        first = second = -1\n        for x in nums:\n            if x > first:\n                second = first\n                first = x\n            elif x > second and x < first:\n                second = x\n        return second",
      "cpp": "class Solution {\npublic:\n    int getSecondLargest(vector<int>& nums) {\n        int first = -1, second = -1;\n        for (int x : nums) {\n            if (x > first) { second = first; first = x; }\n            else if (x > second && x < first) second = x;\n        }\n        return second;\n    }\n};",
      "java": "class Solution {\n    public int getSecondLargest(int[] nums) {\n        int first = -1, second = -1;\n        for (int x : nums) {\n            if (x > first) { second = first; first = x; }\n            else if (x > second && x < first) second = x;\n        }\n        return second;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Count Inversions in an Array",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "tcs",
      "infosys",
      "amazon"
    ],
    "topics": [
      "Array",
      "Divide and Conquer",
      "Merge Sort"
    ],
    "frequency": "High",
    "source": "Asked in TCS Digital & Prime Coding Rounds",
    "tags": [
      "TCS Digital",
      "Sorting",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an integer array `nums`, return *the number of inversions* in the array.\n\nTwo elements `nums[i]` and `nums[j]` form an inversion if `nums[i] > nums[j]` and `i < j`.",
    "examples": [
      {
        "input": "nums = [2, 4, 1, 3, 5]",
        "output": "3",
        "explanation": "Inversions are (2,1), (4,1), (4,3)."
      },
      {
        "input": "nums = [5, 4, 3, 2, 1]",
        "output": "10",
        "explanation": "Every pair forms an inversion: 5*4/2 = 10."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "1 <= nums[i] <= 10^9"
    ],
    "starterCode": {
      "javascript": "function countInversions(nums) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def countInversions(self, nums: list[int]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    long long countInversions(vector<int>& nums) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public long countInversions(int[] nums) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[2, 4, 1, 3, 5]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[5, 4, 3, 2, 1]",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "input": "[10,10,10]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[5,4,3,2,1]",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[10,9,8,7,6,5,4,3,2,1]",
        "expectedOutput": "45",
        "isHidden": true
      },
      {
        "input": "[1,20,6,4,5]",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "[10,10,10]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[5,4,3,2,1]",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[10,9,8,7,6,5,4,3,2,1]",
        "expectedOutput": "45",
        "isHidden": true
      },
      {
        "input": "[1,20,6,4,5]",
        "expectedOutput": "5",
        "isHidden": true
      }
    ],
    "hints": [
      "Modify Merge Sort. When left[i] > right[j], all remaining elements in left half form inversions."
    ],
    "approach": "Merge Sort with inversion counter: O(n log n) time and O(n) space.",
    "solutionCode": {
      "javascript": "function countInversions(nums) {\n    let count = 0;\n    function mergeSort(arr) {\n        if (arr.length <= 1) return arr;\n        const mid = Math.floor(arr.length / 2);\n        const left = mergeSort(arr.slice(0, mid));\n        const right = mergeSort(arr.slice(mid));\n        const res = [];\n        let i = 0, j = 0;\n        while (i < left.length && j < right.length) {\n            if (left[i] <= right[j]) res.push(left[i++]);\n            else {\n                res.push(right[j++]);\n                count += left.length - i;\n            }\n        }\n        return res.concat(left.slice(i)).concat(right.slice(j));\n    }\n    mergeSort(nums);\n    return count;\n}",
      "python": "class Solution:\n    def countInversions(self, nums: list[int]) -> int:\n        self.count = 0\n        def merge_sort(arr):\n            if len(arr) <= 1: return arr\n            mid = len(arr) // 2\n            left = merge_sort(arr[:mid])\n            right = merge_sort(arr[mid:])\n            res = []\n            i = j = 0\n            while i < len(left) and j < len(right):\n                if left[i] <= right[j]: res.append(left[i]); i += 1\n                else:\n                    res.append(right[j]); j += 1\n                    self.count += len(left) - i\n            return res + left[i:] + right[j:]\n        merge_sort(nums)\n        return self.count",
      "cpp": "class Solution {\n    long long count = 0;\n    void merge(vector<int>& arr, int l, int m, int r) {\n        vector<int> left(arr.begin() + l, arr.begin() + m + 1);\n        vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);\n        int i = 0, j = 0, k = l;\n        while (i < left.size() && j < right.size()) {\n            if (left[i] <= right[j]) arr[k++] = left[i++];\n            else { arr[k++] = right[j++]; count += left.size() - i; }\n        }\n        while (i < left.size()) arr[k++] = left[i++];\n        while (j < right.size()) arr[k++] = right[j++];\n    }\n    void mergeSort(vector<int>& arr, int l, int r) {\n        if (l >= r) return;\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m + 1, r);\n        merge(arr, l, m, r);\n    }\npublic:\n    long long countInversions(vector<int>& nums) {\n        mergeSort(nums, 0, nums.size() - 1);\n        return count;\n    }\n};",
      "java": "class Solution {\n    private long count = 0;\n    public long countInversions(int[] nums) {\n        mergeSort(nums, 0, nums.length - 1);\n        return count;\n    }\n    private void mergeSort(int[] arr, int l, int r) {\n        if (l >= r) return;\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m + 1, r);\n        merge(arr, l, m, r);\n    }\n    private void merge(int[] arr, int l, int m, int r) {\n        int[] left = Arrays.copyOfRange(arr, l, m + 1);\n        int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);\n        int i = 0, j = 0, k = l;\n        while (i < left.length && j < right.length) {\n            if (left[i] <= right[j]) arr[k++] = left[i++];\n            else { arr[k++] = right[j++]; count += left.length - i; }\n        }\n        while (i < left.length) arr[k++] = left[i++];\n        while (j < right.length) arr[k++] = right[j++];\n    }\n}"
    },
    "timeComplexity": "O(n log n)",
    "spaceComplexity": "O(n)"
  },
  {
    "title": "Leaders in an Array",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "tcs",
      "wipro",
      "infosys",
      "accenture"
    ],
    "topics": [
      "Array"
    ],
    "frequency": "High",
    "source": "TCS NQT Classic Question",
    "tags": [
      "TCS NQT",
      "Array",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an array `nums` of positive integers, return an array of all the **leaders** in the array in order of appearance.\n\nAn element is a **leader** if it is strictly greater than or equal to all the elements to its right. The rightmost element is always a leader.",
    "examples": [
      {
        "input": "nums = [16, 17, 4, 3, 5, 2]",
        "output": "[17, 5, 2]",
        "explanation": "17 > all elements to its right. 5 > 2. 2 is rightmost."
      },
      {
        "input": "nums = [1, 2, 3, 4, 0]",
        "output": "[4, 0]",
        "explanation": "4 and 0 are leaders."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "0 <= nums[i] <= 10^6"
    ],
    "starterCode": {
      "javascript": "function leaders(nums) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def leaders(self, nums: list[int]) -> list[int]:\n        pass",
      "cpp": "class Solution {\npublic:\n    vector<int> leaders(vector<int>& nums) {\n        return {};\n    }\n};",
      "java": "class Solution {\n    public List<Integer> leaders(int[] nums) {\n        return new ArrayList<>();\n    }\n}"
    },
    "testCases": [
      {
        "input": "[16, 17, 4, 3, 5, 2]",
        "expectedOutput": "[17, 5, 2]",
        "isHidden": false
      },
      {
        "input": "[1, 2, 3, 4, 0]",
        "expectedOutput": "[4, 0]",
        "isHidden": false
      },
      {
        "input": "[16, 17, 4, 3, 5, 2]",
        "expectedOutput": "[17,5,2]",
        "isHidden": true
      },
      {
        "input": "[5]",
        "expectedOutput": "[5]",
        "isHidden": true
      },
      {
        "input": "[10,20,30]",
        "expectedOutput": "[30]",
        "isHidden": true
      },
      {
        "input": "[30,20,10]",
        "expectedOutput": "[30,20,10]",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,0]",
        "expectedOutput": "[4,0]",
        "isHidden": true
      },
      {
        "input": "[5,5,5,5]",
        "expectedOutput": "[5,5,5,5]",
        "isHidden": true
      },
      {
        "input": "[16,17,4,3,5,2]",
        "expectedOutput": "[17,5,2]",
        "isHidden": true
      }
    ],
    "hints": [
      "Iterate the array from right to left keeping track of the current maximum element."
    ],
    "approach": "Reverse scan tracking running maximum: O(n) time and O(1) auxiliary space.",
    "solutionCode": {
      "javascript": "function leaders(nums) {\n    const res = [];\n    let maxRight = -Infinity;\n    for (let i = nums.length - 1; i >= 0; i--) {\n        if (nums[i] >= maxRight) {\n            res.push(nums[i]);\n            maxRight = nums[i];\n        }\n    }\n    return res.reverse();\n}",
      "python": "class Solution:\n    def leaders(self, nums: list[int]) -> list[int]:\n        res = []\n        max_right = float('-inf')\n        for x in reversed(nums):\n            if x >= max_right:\n                res.append(x)\n                max_right = x\n        return res[::-1]",
      "cpp": "class Solution {\npublic:\n    vector<int> leaders(vector<int>& nums) {\n        vector<int> res;\n        int maxRight = INT_MIN;\n        for (int i = nums.size() - 1; i >= 0; i--) {\n            if (nums[i] >= maxRight) {\n                res.push_back(nums[i]);\n                maxRight = nums[i];\n            }\n        }\n        reverse(res.begin(), res.end());\n        return res;\n    }\n};",
      "java": "class Solution {\n    public List<Integer> leaders(int[] nums) {\n        List<Integer> res = new ArrayList<>();\n        int maxRight = Integer.MIN_VALUE;\n        for (int i = nums.length - 1; i >= 0; i--) {\n            if (nums[i] >= maxRight) {\n                res.add(nums[i]);\n                maxRight = nums[i];\n            }\n        }\n        Collections.reverse(res);\n        return res;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Best Time to Buy and Sell Stock",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "infosys",
      "tcs",
      "wipro",
      "deloitte",
      "cognizant"
    ],
    "topics": [
      "Array",
      "Dynamic Programming"
    ],
    "frequency": "High",
    "source": "Top Asked Question in Infosys SE & DSE Coding Assessments",
    "tags": [
      "Infosys",
      "Greedy",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return `0`.",
    "examples": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "5",
        "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      },
      {
        "input": "prices = [7,6,4,3,1]",
        "output": "0",
        "explanation": "In this case, no transactions are done and max profit = 0."
      }
    ],
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "starterCode": {
      "javascript": "function maxProfit(prices) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[7,1,5,3,6,4]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[7,6,4,3,1]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "[1000,999,998,997,996,995,994,993,992,991,990,989,988,987,986,985,984,983,982,981,980,979,978,977,976,975,974,973,972,971,970,969,968,967,966,965,964,963,962,961,960,959,958,957,956,955,954,953,952,951,950,949,948,947,946,945,944,943,942,941,940,939,938,937,936,935,934,933,932,931,930,929,928,927,926,925,924,923,922,921,920,919,918,917,916,915,914,913,912,911,910,909,908,907,906,905,904,903,902,901,900,899,898,897,896,895,894,893,892,891,890,889,888,887,886,885,884,883,882,881,880,879,878,877,876,875,874,873,872,871,870,869,868,867,866,865,864,863,862,861,860,859,858,857,856,855,854,853,852,851,850,849,848,847,846,845,844,843,842,841,840,839,838,837,836,835,834,833,832,831,830,829,828,827,826,825,824,823,822,821,820,819,818,817,816,815,814,813,812,811,810,809,808,807,806,805,804,803,802,801,800,799,798,797,796,795,794,793,792,791,790,789,788,787,786,785,784,783,782,781,780,779,778,777,776,775,774,773,772,771,770,769,768,767,766,765,764,763,762,761,760,759,758,757,756,755,754,753,752,751,750,749,748,747,746,745,744,743,742,741,740,739,738,737,736,735,734,733,732,731,730,729,728,727,726,725,724,723,722,721,720,719,718,717,716,715,714,713,712,711,710,709,708,707,706,705,704,703,702,701]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304]",
        "expectedOutput": "299",
        "isHidden": true
      },
      {
        "input": "[1,2]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[2,4,1]",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[3,2,6,5,0,3]",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[2,2,2,2]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[1000,999,998,997,996,995,994,993,992,991,990,989,988,987,986,985,984,983,982,981,980,979,978,977,976,975,974,973,972,971,970,969,968,967,966,965,964,963,962,961,960,959,958,957,956,955,954,953,952,951,950,949,948,947,946,945,944,943,942,941,940,939,938,937,936,935,934,933,932,931,930,929,928,927,926,925,924,923,922,921,920,919,918,917,916,915,914,913,912,911,910,909,908,907,906,905,904,903,902,901,900,899,898,897,896,895,894,893,892,891,890,889,888,887,886,885,884,883,882,881,880,879,878,877,876,875,874,873,872,871,870,869,868,867,866,865,864,863,862,861,860,859,858,857,856,855,854,853,852,851,850,849,848,847,846,845,844,843,842,841,840,839,838,837,836,835,834,833,832,831,830,829,828,827,826,825,824,823,822,821,820,819,818,817,816,815,814,813,812,811,810,809,808,807,806,805,804,803,802,801,800,799,798,797,796,795,794,793,792,791,790,789,788,787,786,785,784,783,782,781,780,779,778,777,776,775,774,773,772,771,770,769,768,767,766,765,764,763,762,761,760,759,758,757,756,755,754,753,752,751,750,749,748,747,746,745,744,743,742,741,740,739,738,737,736,735,734,733,732,731,730,729,728,727,726,725,724,723,722,721,720,719,718,717,716,715,714,713,712,711,710,709,708,707,706,705,704,703,702,701]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304]",
        "expectedOutput": "299",
        "isHidden": true
      },
      {
        "input": "[1,2]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[2,4,1]",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[3,2,6,5,0,3]",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[2,2,2,2]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "hints": [
      "Track the minimum price seen so far as you iterate through the prices."
    ],
    "approach": "Single pass minimum tracking: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function maxProfit(prices) {\n    let minPrice = Infinity, maxProf = 0;\n    for (const p of prices) {\n        if (p < minPrice) minPrice = p;\n        else if (p - minPrice > maxProf) maxProf = p - minPrice;\n    }\n    return maxProf;\n}",
      "python": "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        min_p = float('inf')\n        max_prof = 0\n        for p in prices:\n            if p < min_p: min_p = p\n            elif p - min_p > max_prof: max_prof = p - min_p\n        return max_prof",
      "cpp": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxProf = 0;\n        for (int p : prices) {\n            if (p < minP) minP = p;\n            else maxProf = max(maxProf, p - minP);\n        }\n        return maxProf;\n    }\n};",
      "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        int minP = Integer.MAX_VALUE, maxProf = 0;\n        for (int p : prices) {\n            if (p < minP) minP = p;\n            else maxProf = Math.max(maxProf, p - minP);\n        }\n        return maxProf;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Reverse Words in a String",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "infosys",
      "deloitte",
      "accenture",
      "cognizant",
      "capgemini"
    ],
    "topics": [
      "Two Pointers",
      "String"
    ],
    "frequency": "High",
    "source": "Reported in Infosys DSE & Accenture Coding",
    "tags": [
      "String",
      "Infosys",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an input string `s`, reverse the order of the **words**.\n\nA **word** is defined as a sequence of non-space characters. The words in `s` will be separated by at least one space.\n\nReturn *a string of the words in reverse order concatenated by a single space*.\n\nNote that `s` may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.",
    "examples": [
      {
        "input": "s = \"the sky is blue\"",
        "output": "\"blue is sky the\"",
        "explanation": "Words reversed."
      },
      {
        "input": "s = \"  hello world  \"",
        "output": "\"world hello\"",
        "explanation": "Leading/trailing spaces removed."
      },
      {
        "input": "s = \"a good   example\"",
        "output": "\"example good a\"",
        "explanation": "Multiple spaces reduced to single space."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^4",
      "s contains English letters, digits, and spaces."
    ],
    "starterCode": {
      "javascript": "function reverseWords(s) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def reverseWords(self, s: str) -> str:\n        pass",
      "cpp": "class Solution {\npublic:\n    string reverseWords(string s) {\n        return \"\";\n    }\n};",
      "java": "class Solution {\n    public String reverseWords(String s) {\n        return \"\";\n    }\n}"
    },
    "testCases": [
      {
        "input": "\"the sky is blue\"",
        "expectedOutput": "\"blue is sky the\"",
        "isHidden": false
      },
      {
        "input": "\"  hello world  \"",
        "expectedOutput": "\"world hello\"",
        "isHidden": false
      },
      {
        "input": "\"the sky is blue\"",
        "expectedOutput": "\"blue is sky the\"",
        "isHidden": true
      },
      {
        "input": "\"  hello world  \"",
        "expectedOutput": "\"world hello\"",
        "isHidden": true
      },
      {
        "input": "\"a good   example\"",
        "expectedOutput": "\"example good a\"",
        "isHidden": true
      },
      {
        "input": "\"EPIC\"",
        "expectedOutput": "\"EPIC\"",
        "isHidden": true
      },
      {
        "input": "\"  Bob    Loves  Alice   \"",
        "expectedOutput": "\"Alice Loves Bob\"",
        "isHidden": true
      },
      {
        "input": "\"Alice does not even like bob\"",
        "expectedOutput": "\"bob like even not does Alice\"",
        "isHidden": true
      }
    ],
    "hints": [
      "Split string into tokens/words ignoring multiple whitespace, then reverse."
    ],
    "approach": "Tokenize by whitespace and reverse word sequence: O(n) time and O(n) space.",
    "solutionCode": {
      "javascript": "function reverseWords(s) {\n    return s.trim().split(/\\s+/).reverse().join(' ');\n}",
      "python": "class Solution:\n    def reverseWords(self, s: str) -> str:\n        return ' '.join(reversed(s.split()))",
      "cpp": "class Solution {\npublic:\n    string reverseWords(string s) {\n        stringstream ss(s);\n        string word, res = \"\";\n        vector<string> words;\n        while (ss >> word) words.push_back(word);\n        reverse(words.begin(), words.end());\n        for (int i = 0; i < words.size(); i++) {\n            if (i > 0) res += \" \";\n            res += words[i];\n        }\n        return res;\n    }\n};",
      "java": "class Solution {\n    public String reverseWords(String s) {\n        String[] words = s.trim().split(\"\\\\s+\");\n        StringBuilder sb = new StringBuilder();\n        for (int i = words.length - 1; i >= 0; i--) {\n            sb.append(words[i]);\n            if (i > 0) sb.append(\" \");\n        }\n        return sb.toString();\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)"
  },
  {
    "title": "Move Zeroes to End",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "wipro",
      "tcs",
      "cognizant",
      "capgemini"
    ],
    "topics": [
      "Array",
      "Two Pointers"
    ],
    "frequency": "High",
    "source": "Asked in Wipro Elite National Talent Hunt",
    "tags": [
      "Wipro",
      "Array",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.\n\nNote that you must do this in-place without making a copy of the array.",
    "examples": [
      {
        "input": "nums = [0,1,0,3,12]",
        "output": "[1,3,12,0,0]",
        "explanation": "Zeroes moved to the end."
      },
      {
        "input": "nums = [0]",
        "output": "[0]",
        "explanation": "Single zero unchanged."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-2^31 <= nums[i] <= 2^31 - 1"
    ],
    "starterCode": {
      "javascript": "function moveZeroes(nums) {\n    // Modify nums in-place\n    return nums;\n}",
      "python": "class Solution:\n    def moveZeroes(self, nums: list[int]) -> list[int]:\n        pass",
      "cpp": "class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        \n    }\n};",
      "java": "class Solution {\n    public void moveZeroes(int[] nums) {\n        \n    }\n}"
    },
    "testCases": [
      {
        "input": "[0,1,0,3,12]",
        "expectedOutput": "[1,3,12,0,0]",
        "isHidden": false
      },
      {
        "input": "[0]",
        "expectedOutput": "[0]",
        "isHidden": false
      },
      {
        "input": "[0,0,1,0,3,0,5,0,0,12,0]",
        "expectedOutput": "[1,3,5,12,0,0,0,0,0,0,0]",
        "isHidden": true
      },
      {
        "input": "[1,2,3]",
        "expectedOutput": "[1,2,3]",
        "isHidden": true
      },
      {
        "input": "[0,0,0,1]",
        "expectedOutput": "[1,0,0,0]",
        "isHidden": true
      },
      {
        "input": "[4,2,4,0,0,3,0,5,1,0]",
        "expectedOutput": "[4,2,4,3,5,1,0,0,0,0]",
        "isHidden": true
      },
      {
        "input": "[0,0,0,0,0]",
        "expectedOutput": "[0,0,0,0,0]",
        "isHidden": true
      },
      {
        "input": "[0,0,1,0,3,0,5,0,0,12,0]",
        "expectedOutput": "[1,3,5,12,0,0,0,0,0,0,0]",
        "isHidden": true
      },
      {
        "input": "[1,2,3]",
        "expectedOutput": "[1,2,3]",
        "isHidden": true
      },
      {
        "input": "[0,0,0,1]",
        "expectedOutput": "[1,0,0,0]",
        "isHidden": true
      },
      {
        "input": "[4,2,4,0,0,3,0,5,1,0]",
        "expectedOutput": "[4,2,4,3,5,1,0,0,0,0]",
        "isHidden": true
      },
      {
        "input": "[0,0,0,0,0]",
        "expectedOutput": "[0,0,0,0,0]",
        "isHidden": true
      }
    ],
    "hints": [
      "Use a pointer `insertPos` to write non-zero elements, then fill remaining with 0."
    ],
    "approach": "Two Pointers in-place swap / overwrite: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function moveZeroes(nums) {\n    let pos = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] !== 0) {\n            [nums[pos], nums[i]] = [nums[i], nums[pos]];\n            pos++;\n        }\n    }\n    return nums;\n}",
      "python": "class Solution:\n    def moveZeroes(self, nums: list[int]) -> list[int]:\n        pos = 0\n        for i in range(len(nums)):\n            if nums[i] != 0:\n                nums[pos], nums[i] = nums[i], nums[pos]\n                pos += 1\n        return nums",
      "cpp": "class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        int pos = 0;\n        for (int i = 0; i < nums.size(); i++) {\n            if (nums[i] != 0) swap(nums[pos++], nums[i]);\n        }\n    }\n};",
      "java": "class Solution {\n    public void moveZeroes(int[] nums) {\n        int pos = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (nums[i] != 0) {\n                int temp = nums[pos];\n                nums[pos] = nums[i];\n                nums[i] = temp;\n                pos++;\n            }\n        }\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Power of Two",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "wipro",
      "tcs",
      "cognizant",
      "capgemini"
    ],
    "topics": [
      "Math",
      "Bit Manipulation",
      "Recursion"
    ],
    "frequency": "High",
    "source": "Reported in Wipro Elite OA",
    "tags": [
      "Bit Manipulation",
      "Wipro",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an integer `n`, return `true` *if it is a power of two. Otherwise, return `false`*.\n\nAn integer `n` is a power of two, if there exists an integer `x` such that `n == 2^x`.",
    "examples": [
      {
        "input": "n = 1",
        "output": "true",
        "explanation": "2^0 = 1"
      },
      {
        "input": "n = 16",
        "output": "true",
        "explanation": "2^4 = 16"
      },
      {
        "input": "n = 3",
        "output": "false",
        "explanation": "3 is not a power of two."
      }
    ],
    "constraints": [
      "-2^31 <= n <= 2^31 - 1"
    ],
    "starterCode": {
      "javascript": "function isPowerOfTwo(n) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def isPowerOfTwo(self, n: int) -> bool:\n        pass",
      "cpp": "class Solution {\npublic:\n    bool isPowerOfTwo(int n) {\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean isPowerOfTwo(int n) {\n        return false;\n    }\n}"
    },
    "testCases": [
      {
        "input": "1",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "16",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "3",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "0",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "-16",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "1073741824",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "2147483646",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "536870912",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "0",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "-16",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "1073741824",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "2147483646",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "536870912",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "hints": [
      "A power of two in binary has exactly one set bit: n > 0 && (n & (n - 1)) == 0."
    ],
    "approach": "Bitwise trick `(n > 0) && (n & (n - 1)) == 0`: O(1) time and O(1) space.",
    "solutionCode": {
      "javascript": "function isPowerOfTwo(n) {\n    return n > 0 && (n & (n - 1)) === 0;\n}",
      "python": "class Solution:\n    def isPowerOfTwo(self, n: int) -> bool:\n        return n > 0 and (n & (n - 1)) == 0",
      "cpp": "class Solution {\npublic:\n    bool isPowerOfTwo(int n) {\n        return n > 0 && (n & (n - 1)) == 0;\n    }\n};",
      "java": "class Solution {\n    public boolean isPowerOfTwo(int n) {\n        return n > 0 && (n & (n - 1)) == 0;\n    }\n}"
    },
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Binary String Operations",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "accenture",
      "cognizant",
      "capgemini"
    ],
    "topics": [
      "String",
      "Bit Manipulation"
    ],
    "frequency": "High",
    "source": "Accenture ASE Hands-on Coding Assessment",
    "tags": [
      "Accenture",
      "String",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "The binary string operations are encoded as follows in a string `str`:\n- `'A'` denotes `AND` operation\n- `'B'` denotes `OR` operation\n- `'C'` denotes `XOR` operation\n\nYou are given a string `str` consisting of binary digits (`0` and `1`) separated by operations (`A`, `B`, `C`). Evaluate the string from left to right and return the final single integer result (`0` or `1`). Return `-1` if the string is empty.",
    "examples": [
      {
        "input": "str = \"1C0C1C1A0B1\"",
        "output": "1",
        "explanation": "1 XOR 0 = 1 -> 1 XOR 1 = 0 -> 0 XOR 1 = 1 -> 1 AND 0 = 0 -> 0 OR 1 = 1."
      },
      {
        "input": "str = \"0A1A1C1B0\"",
        "output": "0",
        "explanation": "Evaluates to 0."
      }
    ],
    "constraints": [
      "1 <= str.length <= 100",
      "str starts with a digit and alternates with operation letters."
    ],
    "starterCode": {
      "javascript": "function operationsBinaryString(str) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def operationsBinaryString(self, str: str) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int operationsBinaryString(string str) {\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int operationsBinaryString(String str) {\n        return -1;\n    }\n}"
    },
    "testCases": [
      {
        "input": "\"1C0C1C1A0B1\"",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "\"0A1A1C1B0\"",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "\"1C0C1C1A0B1\"",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "\"1A0B1\"",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "\"1C1C1A0\"",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "\"0C1A1B1C1\"",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "\"1B1B1B1\"",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "\"0A0A0A0\"",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "hints": [
      "Initialize result with int(str[0]).",
      "Iterate by step 2: read operator and next operand, apply bitwise logic."
    ],
    "approach": "Left to right linear evaluation: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function operationsBinaryString(str) {\n    if (!str) return -1;\n    let res = parseInt(str[0], 10);\n    for (let i = 1; i < str.length; i += 2) {\n        const op = str[i];\n        const nextVal = parseInt(str[i + 1], 10);\n        if (op === 'A') res = res & nextVal;\n        else if (op === 'B') res = res | nextVal;\n        else if (op === 'C') res = res ^ nextVal;\n    }\n    return res;\n}",
      "python": "class Solution:\n    def operationsBinaryString(self, s: str) -> int:\n        if not s: return -1\n        res = int(s[0])\n        for i in range(1, len(s), 2):\n            op = s[i]\n            val = int(s[i+1])\n            if op == 'A': res &= val\n            elif op == 'B': res |= val\n            elif op == 'C': res ^= val\n        return res",
      "cpp": "class Solution {\npublic:\n    int operationsBinaryString(string str) {\n        if (str.empty()) return -1;\n        int res = str[0] - '0';\n        for (int i = 1; i < str.length(); i += 2) {\n            char op = str[i];\n            int val = str[i + 1] - '0';\n            if (op == 'A') res &= val;\n            else if (op == 'B') res |= val;\n            else if (op == 'C') res ^= val;\n        }\n        return res;\n    }\n};",
      "java": "class Solution {\n    public int operationsBinaryString(String str) {\n        if (str == null || str.isEmpty()) return -1;\n        int res = str.charAt(0) - '0';\n        for (int i = 1; i < str.length(); i += 2) {\n            char op = str.charAt(i);\n            int val = str.charAt(i + 1) - '0';\n            if (op == 'A') res &= val;\n            else if (op == 'B') res |= val;\n            else if (op == 'C') res ^= val;\n        }\n        return res;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Find Pivot Index",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "accenture",
      "deloitte",
      "cognizant",
      "capgemini"
    ],
    "topics": [
      "Array",
      "Prefix Sum"
    ],
    "frequency": "High",
    "source": "Reported in Accenture & Deloitte Coding Assessments",
    "tags": [
      "Accenture",
      "Prefix Sum",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an array of integers `nums`, calculate the **pivot index** of this array.\n\nThe **pivot index** is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. This also applies to the right edge of the array.\n\nReturn *the leftmost pivot index*. If no such index exists, return `-1`.",
    "examples": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "explanation": "The pivot index is 3: left sum = 1+7+3 = 11, right sum = 5+6 = 11."
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "explanation": "No index qualifies as pivot index."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "starterCode": {
      "javascript": "function pivotIndex(nums) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def pivotIndex(self, nums: list[int]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int pivotIndex(vector<int>& nums) {\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int pivotIndex(int[] nums) {\n        return -1;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[1,7,3,6,5,6]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[1,2,3]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "[1,7,3,6,5,6]",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "[1,2,3]",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[2,1,-1]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[0,0,0,0]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[-1,-1,-1,-1,-1,0]",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[-1,-1,0,1,1,0]",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "[1,7,3,6,5,6]",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "hints": [
      "Compute totalSum first.",
      "As you iterate, rightSum = totalSum - leftSum - nums[i]."
    ],
    "approach": "Prefix sum calculation in two passes: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function pivotIndex(nums) {\n    const total = nums.reduce((a, b) => a + b, 0);\n    let leftSum = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (leftSum === total - leftSum - nums[i]) return i;\n        leftSum += nums[i];\n    }\n    return -1;\n}",
      "python": "class Solution:\n    def pivotIndex(self, nums: list[int]) -> int:\n        total = sum(nums)\n        left_sum = 0\n        for i, x in enumerate(nums):\n            if left_sum == total - left_sum - x: return i\n            left_sum += x\n        return -1",
      "cpp": "class Solution {\npublic:\n    int pivotIndex(vector<int>& nums) {\n        int total = accumulate(nums.begin(), nums.end(), 0);\n        int leftSum = 0;\n        for (int i = 0; i < nums.size(); i++) {\n            if (leftSum == total - leftSum - nums[i]) return i;\n            leftSum += nums[i];\n        }\n        return -1;\n    }\n};",
      "java": "class Solution {\n    public int pivotIndex(int[] nums) {\n        int total = 0;\n        for (int x : nums) total += x;\n        int leftSum = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (leftSum == total - leftSum - nums[i]) return i;\n            leftSum += nums[i];\n        }\n        return -1;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Detect Loop in Linked List",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "deloitte",
      "cognizant",
      "capgemini",
      "infosys",
      "tcs"
    ],
    "topics": [
      "Linked List",
      "Two Pointers"
    ],
    "frequency": "High",
    "source": "Reported in Deloitte & Cognizant Technical Interviews",
    "tags": [
      "Deloitte",
      "Linked List",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.\n\nReturn `true` *if there is a cycle in the linked list*. Otherwise, return `false`.",
    "examples": [
      {
        "input": "head = [3,2,0,-4], pos = 1",
        "output": "true",
        "explanation": "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)."
      },
      {
        "input": "head = [1,2], pos = 0",
        "output": "true",
        "explanation": "Tail connects to 0th node."
      },
      {
        "input": "head = [1], pos = -1",
        "output": "false",
        "explanation": "No cycle."
      }
    ],
    "constraints": [
      "The number of the nodes in the list is in the range [0, 10^4].",
      "-10^5 <= Node.val <= 10^5"
    ],
    "starterCode": {
      "javascript": "function hasCycle(head) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def hasCycle(self, head) -> bool:\n        pass",
      "cpp": "class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean hasCycle(ListNode head) {\n        return false;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[3,2,0,-4]\n1",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[1]\n-1",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "[1,2,3,4,5]\n-1",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]\n0",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]\n4",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "[10,20,30]\n-1",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5,6,7,8,9,10]\n5",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]\n-1",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]\n0",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5]\n4",
        "expectedOutput": "true",
        "isHidden": true
      },
      {
        "input": "[10,20,30]\n-1",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5,6,7,8,9,10]\n5",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "hints": [
      "Use Floyd's Tortoise and Hare algorithm with slow and fast pointers."
    ],
    "approach": "Floyd's Cycle-Finding Algorithm (slow/fast pointers): O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function hasCycle(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow === fast) return true;\n    }\n    return false;\n}",
      "python": "class Solution:\n    def hasCycle(self, head) -> bool:\n        slow = fast = head\n        while fast and fast.next:\n            slow = slow.next\n            fast = fast.next.next\n            if slow == fast: return True\n        return False",
      "cpp": "class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        ListNode *slow = head, *fast = head;\n        while (fast && fast->next) {\n            slow = slow->next;\n            fast = fast->next->next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n};",
      "java": "public class Solution {\n    public boolean hasCycle(ListNode head) {\n        ListNode slow = head, fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Remove All Adjacent Duplicates In String",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "cognizant",
      "capgemini",
      "deloitte"
    ],
    "topics": [
      "String",
      "Stack"
    ],
    "frequency": "High",
    "source": "Cognizant GenC Elevate Coding Test",
    "tags": [
      "Cognizant",
      "Stack",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "You are given a string `s` consisting of lowercase English letters. A **duplicate removal** consists of choosing two **adjacent** and **equal** letters and removing them.\n\nWe repeatedly make duplicate removals on `s` until we no longer can.\n\nReturn *the final string after all such duplicate removals have been made*. It can be proven that the answer is **unique**.",
    "examples": [
      {
        "input": "s = \"abbaca\"",
        "output": "\"ca\"",
        "explanation": "\"abbaca\" -> \"aaca\" -> \"ca\""
      },
      {
        "input": "s = \"azxxzy\"",
        "output": "\"ay\"",
        "explanation": "\"azxxzy\" -> \"azzy\" -> \"ay\""
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters."
    ],
    "starterCode": {
      "javascript": "function removeDuplicates(s) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def removeDuplicates(self, s: str) -> str:\n        pass",
      "cpp": "class Solution {\npublic:\n    string removeDuplicates(string s) {\n        return \"\";\n    }\n};",
      "java": "class Solution {\n    public String removeDuplicates(String s) {\n        return \"\";\n    }\n}"
    },
    "testCases": [
      {
        "input": "\"abbaca\"",
        "expectedOutput": "\"ca\"",
        "isHidden": false
      },
      {
        "input": "\"azxxzy\"",
        "expectedOutput": "\"ay\"",
        "isHidden": false
      },
      {
        "input": "\"a\"",
        "expectedOutput": "\"a\"",
        "isHidden": true
      },
      {
        "input": "\"aa\"",
        "expectedOutput": "\"\"",
        "isHidden": true
      },
      {
        "input": "\"baab\"",
        "expectedOutput": "\"\"",
        "isHidden": true
      },
      {
        "input": "\"abbbaca\"",
        "expectedOutput": "\"abaca\"",
        "isHidden": true
      },
      {
        "input": "\"aaaaaaaa\"",
        "expectedOutput": "\"\"",
        "isHidden": true
      },
      {
        "input": "\"mississippi\"",
        "expectedOutput": "\"m\"",
        "isHidden": true
      },
      {
        "input": "\"a\"",
        "expectedOutput": "\"a\"",
        "isHidden": true
      },
      {
        "input": "\"aa\"",
        "expectedOutput": "\"\"",
        "isHidden": true
      },
      {
        "input": "\"baab\"",
        "expectedOutput": "\"\"",
        "isHidden": true
      },
      {
        "input": "\"abbbaca\"",
        "expectedOutput": "\"abaca\"",
        "isHidden": true
      },
      {
        "input": "\"aaaaaaaa\"",
        "expectedOutput": "\"\"",
        "isHidden": true
      },
      {
        "input": "\"mississippi\"",
        "expectedOutput": "\"m\"",
        "isHidden": true
      }
    ],
    "hints": [
      "Use a stack. If the current character matches stack top, pop it; otherwise push."
    ],
    "approach": "Stack-based character reduction: O(n) time and O(n) space.",
    "solutionCode": {
      "javascript": "function removeDuplicates(s) {\n    const stack = [];\n    for (const c of s) {\n        if (stack.length && stack[stack.length - 1] === c) stack.pop();\n        else stack.push(c);\n    }\n    return stack.join('');\n}",
      "python": "class Solution:\n    def removeDuplicates(self, s: str) -> str:\n        st = []\n        for c in s:\n            if st and st[-1] == c: st.pop()\n            else: st.append(c)\n        return ''.join(st)",
      "cpp": "class Solution {\npublic:\n    string removeDuplicates(string s) {\n        string res = \"\";\n        for (char c : s) {\n            if (!res.empty() && res.back() == c) res.pop_back();\n            else res.push_back(c);\n        }\n        return res;\n    }\n};",
      "java": "class Solution {\n    public String removeDuplicates(String s) {\n        StringBuilder sb = new StringBuilder();\n        for (char c : s.toCharArray()) {\n            if (sb.length() > 0 && sb.charAt(sb.length() - 1) == c) {\n                sb.deleteCharAt(sb.length() - 1);\n            } else {\n                sb.append(c);\n            }\n        }\n        return sb.toString();\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)"
  },
  {
    "title": "Running Sum of 1d Array",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "capgemini",
      "cognizant",
      "deloitte",
      "accenture"
    ],
    "topics": [
      "Array",
      "Prefix Sum"
    ],
    "frequency": "High",
    "source": "Capgemini Online Test OA Question",
    "tags": [
      "Capgemini",
      "Array",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an array `nums`. We define a running sum of an array as `runningSum[i] = sum(nums[0]…nums[i])`.\n\nReturn *the running sum of `nums`*.",
    "examples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[1,3,6,10]",
        "explanation": "Running sum is [1, 1+2, 1+2+3, 1+2+3+4]."
      },
      {
        "input": "nums = [1,1,1,1,1]",
        "output": "[1,2,3,4,5]",
        "explanation": "Running sum is [1, 2, 3, 4, 5]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 1000",
      "-10^6 <= nums[i] <= 10^6"
    ],
    "starterCode": {
      "javascript": "function runningSum(nums) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def runningSum(self, nums: list[int]) -> list[int]:\n        pass",
      "cpp": "class Solution {\npublic:\n    vector<int> runningSum(vector<int>& nums) {\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] runningSum(int[] nums) {\n        return new int[]{};\n    }\n}"
    },
    "testCases": [
      {
        "input": "[1,2,3,4]",
        "expectedOutput": "[1,3,6,10]",
        "isHidden": false
      },
      {
        "input": "[1,1,1,1,1]",
        "expectedOutput": "[1,2,3,4,5]",
        "isHidden": false
      },
      {
        "input": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200]",
        "expectedOutput": "[1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210,231,253,276,300,325,351,378,406,435,465,496,528,561,595,630,666,703,741,780,820,861,903,946,990,1035,1081,1128,1176,1225,1275,1326,1378,1431,1485,1540,1596,1653,1711,1770,1830,1891,1953,2016,2080,2145,2211,2278,2346,2415,2485,2556,2628,2701,2775,2850,2926,3003,3081,3160,3240,3321,3403,3486,3570,3655,3741,3828,3916,4005,4095,4186,4278,4371,4465,4560,4656,4753,4851,4950,5050,5151,5253,5356,5460,5565,5671,5778,5886,5995,6105,6216,6328,6441,6555,6670,6786,6903,7021,7140,7260,7381,7503,7626,7750,7875,8001,8128,8256,8385,8515,8646,8778,8911,9045,9180,9316,9453,9591,9730,9870,10011,10153,10296,10440,10585,10731,10878,11026,11175,11325,11476,11628,11781,11935,12090,12246,12403,12561,12720,12880,13041,13203,13366,13530,13695,13861,14028,14196,14365,14535,14706,14878,15051,15225,15400,15576,15753,15931,16110,16290,16471,16653,16836,17020,17205,17391,17578,17766,17955,18145,18336,18528,18721,18915,19110,19306,19503,19701,19900,20100]",
        "isHidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "[1]",
        "isHidden": true
      },
      {
        "input": "[-1,-2,-3]",
        "expectedOutput": "[-1,-3,-6]",
        "isHidden": true
      },
      {
        "input": "[0,0,0]",
        "expectedOutput": "[0,0,0]",
        "isHidden": true
      },
      {
        "input": "[1000,-1000,1000]",
        "expectedOutput": "[1000,0,1000]",
        "isHidden": true
      },
      {
        "input": "[10,20,30,40,50]",
        "expectedOutput": "[10,30,60,100,150]",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200]",
        "expectedOutput": "[1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210,231,253,276,300,325,351,378,406,435,465,496,528,561,595,630,666,703,741,780,820,861,903,946,990,1035,1081,1128,1176,1225,1275,1326,1378,1431,1485,1540,1596,1653,1711,1770,1830,1891,1953,2016,2080,2145,2211,2278,2346,2415,2485,2556,2628,2701,2775,2850,2926,3003,3081,3160,3240,3321,3403,3486,3570,3655,3741,3828,3916,4005,4095,4186,4278,4371,4465,4560,4656,4753,4851,4950,5050,5151,5253,5356,5460,5565,5671,5778,5886,5995,6105,6216,6328,6441,6555,6670,6786,6903,7021,7140,7260,7381,7503,7626,7750,7875,8001,8128,8256,8385,8515,8646,8778,8911,9045,9180,9316,9453,9591,9730,9870,10011,10153,10296,10440,10585,10731,10878,11026,11175,11325,11476,11628,11781,11935,12090,12246,12403,12561,12720,12880,13041,13203,13366,13530,13695,13861,14028,14196,14365,14535,14706,14878,15051,15225,15400,15576,15753,15931,16110,16290,16471,16653,16836,17020,17205,17391,17578,17766,17955,18145,18336,18528,18721,18915,19110,19306,19503,19701,19900,20100]",
        "isHidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "[1]",
        "isHidden": true
      },
      {
        "input": "[-1,-2,-3]",
        "expectedOutput": "[-1,-3,-6]",
        "isHidden": true
      },
      {
        "input": "[0,0,0]",
        "expectedOutput": "[0,0,0]",
        "isHidden": true
      },
      {
        "input": "[1000,-1000,1000]",
        "expectedOutput": "[1000,0,1000]",
        "isHidden": true
      },
      {
        "input": "[10,20,30,40,50]",
        "expectedOutput": "[10,30,60,100,150]",
        "isHidden": true
      }
    ],
    "hints": [
      "Iterate through the array and accumulate sum: nums[i] += nums[i - 1]."
    ],
    "approach": "In-place prefix sum accumulation: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function runningSum(nums) {\n    for (let i = 1; i < nums.length; i++) nums[i] += nums[i - 1];\n    return nums;\n}",
      "python": "class Solution:\n    def runningSum(self, nums: list[int]) -> list[int]:\n        for i in range(1, len(nums)):\n            nums[i] += nums[i - 1]\n        return nums",
      "cpp": "class Solution {\npublic:\n    vector<int> runningSum(vector<int>& nums) {\n        for (int i = 1; i < nums.size(); i++) nums[i] += nums[i - 1];\n        return nums;\n    }\n};",
      "java": "class Solution {\n    public int[] runningSum(int[] nums) {\n        for (int i = 1; i < nums.length; i++) nums[i] += nums[i - 1];\n        return nums;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Roman to Integer",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "tcs",
      "wipro",
      "infosys",
      "accenture",
      "cognizant"
    ],
    "topics": [
      "Hash Table",
      "Math",
      "String"
    ],
    "frequency": "High",
    "source": "TCS NQT & Infosys High-Frequency Question",
    "tags": [
      "String",
      "TCS",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Roman numerals are represented by seven different symbols: `I`, `V`, `X`, `L`, `C`, `D` and `M`.\n\n| Symbol | Value |\n|---|---|\n| I | 1 |\n| V | 5 |\n| X | 10 |\n| L | 50 |\n| C | 100 |\n| D | 500 |\n| M | 1000 |\n\nGiven a roman numeral string `s`, convert it to an integer.",
    "examples": [
      {
        "input": "s = \"III\"",
        "output": "3",
        "explanation": "III = 3."
      },
      {
        "input": "s = \"LVIII\"",
        "output": "58",
        "explanation": "L = 50, V= 5, III = 3."
      },
      {
        "input": "s = \"MCMXCIV\"",
        "output": "1994",
        "explanation": "M = 1000, CM = 900, XC = 90 and IV = 4."
      }
    ],
    "constraints": [
      "1 <= s.length <= 15",
      "s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M')."
    ],
    "starterCode": {
      "javascript": "function romanToInt(s) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def romanToInt(self, s: str) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int romanToInt(string s) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int romanToInt(String s) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "\"III\"",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "\"LVIII\"",
        "expectedOutput": "58",
        "isHidden": false
      },
      {
        "input": "\"MCMXCIV\"",
        "expectedOutput": "1994",
        "isHidden": true
      },
      {
        "input": "\"I\"",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "\"IV\"",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "\"IX\"",
        "expectedOutput": "9",
        "isHidden": true
      },
      {
        "input": "\"XL\"",
        "expectedOutput": "40",
        "isHidden": true
      },
      {
        "input": "\"XC\"",
        "expectedOutput": "90",
        "isHidden": true
      },
      {
        "input": "\"CD\"",
        "expectedOutput": "400",
        "isHidden": true
      },
      {
        "input": "\"CM\"",
        "expectedOutput": "900",
        "isHidden": true
      },
      {
        "input": "\"MMMCMXCIX\"",
        "expectedOutput": "3999",
        "isHidden": true
      },
      {
        "input": "\"MDCLXVI\"",
        "expectedOutput": "1666",
        "isHidden": true
      },
      {
        "input": "\"I\"",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "\"IV\"",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "\"IX\"",
        "expectedOutput": "9",
        "isHidden": true
      },
      {
        "input": "\"XL\"",
        "expectedOutput": "40",
        "isHidden": true
      },
      {
        "input": "\"XC\"",
        "expectedOutput": "90",
        "isHidden": true
      },
      {
        "input": "\"CD\"",
        "expectedOutput": "400",
        "isHidden": true
      },
      {
        "input": "\"CM\"",
        "expectedOutput": "900",
        "isHidden": true
      },
      {
        "input": "\"MMMCMXCIX\"",
        "expectedOutput": "3999",
        "isHidden": true
      },
      {
        "input": "\"MDCLXVI\"",
        "expectedOutput": "1666",
        "isHidden": true
      }
    ],
    "hints": [
      "If current Roman digit < next Roman digit, subtract it (e.g., IV = 5 - 1 = 4); otherwise add it."
    ],
    "approach": "Map lookup and subtraction condition: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function romanToInt(s) {\n    const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };\n    let sum = 0;\n    for (let i = 0; i < s.length; i++) {\n        const curr = map[s[i]], next = map[s[i + 1]] || 0;\n        if (curr < next) sum -= curr;\n        else sum += curr;\n    }\n    return sum;\n}",
      "python": "class Solution:\n    def romanToInt(self, s: str) -> int:\n        m = {'I':1, 'V':5, 'X':10, 'L':50, 'C':100, 'D':500, 'M':1000}\n        total = 0\n        for i in range(len(s)):\n            if i + 1 < len(s) and m[s[i]] < m[s[i+1]]:\n                total -= m[s[i]]\n            else:\n                total += m[s[i]]\n        return total",
      "cpp": "class Solution {\npublic:\n    int romanToInt(string s) {\n        unordered_map<char, int> m = {{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};\n        int sum = 0;\n        for (int i = 0; i < s.size(); i++) {\n            if (i + 1 < s.size() && m[s[i]] < m[s[i+1]]) sum -= m[s[i]];\n            else sum += m[s[i]];\n        }\n        return sum;\n    }\n};",
      "java": "class Solution {\n    public int romanToInt(String s) {\n        Map<Character, Integer> m = Map.of('I',1,'V',5,'X',10,'L',50,'C',100,'D',500,'M',1000);\n        int sum = 0;\n        for (int i = 0; i < s.length(); i++) {\n            int curr = m.get(s.charAt(i));\n            if (i + 1 < s.length() && curr < m.get(s.charAt(i + 1))) sum -= curr;\n            else sum += curr;\n        }\n        return sum;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Majority Element",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "tcs",
      "infosys",
      "cognizant",
      "capgemini",
      "wipro"
    ],
    "topics": [
      "Array",
      "Hash Table",
      "Divide and Conquer",
      "Counting"
    ],
    "frequency": "High",
    "source": "Asked in TCS NQT & Cognizant GenC",
    "tags": [
      "Boyer-Moore",
      "TCS",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an array `nums` of size `n`, return *the majority element*.\n\nThe **majority element** is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.",
    "examples": [
      {
        "input": "nums = [3,2,3]",
        "output": "3",
        "explanation": "3 appears 2 times (> 3/2)."
      },
      {
        "input": "nums = [2,2,1,1,1,2,2]",
        "output": "2",
        "explanation": "2 appears 4 times (> 7/2)."
      }
    ],
    "constraints": [
      "n == nums.length",
      "1 <= n <= 5 * 10^4",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "starterCode": {
      "javascript": "function majorityElement(nums) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def majorityElement(self, nums: list[int]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int majorityElement(int[] nums) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[3,2,3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[2,2,1,1,1,2,2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42]",
        "expectedOutput": "42",
        "isHidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[6,5,5]",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "[10,10,10,20,10]",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "[-1,-1,2,-1]",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[2,2,1,1,1,2,2]",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42,42]",
        "expectedOutput": "42",
        "isHidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[6,5,5]",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "[10,10,10,20,10]",
        "expectedOutput": "10",
        "isHidden": true
      },
      {
        "input": "[-1,-1,2,-1]",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[2,2,1,1,1,2,2]",
        "expectedOutput": "2",
        "isHidden": true
      }
    ],
    "hints": [
      "Use Boyer-Moore Voting Algorithm to find the majority element in O(1) space."
    ],
    "approach": "Boyer-Moore Voting Algorithm: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function majorityElement(nums) {\n    let candidate = null, count = 0;\n    for (const num of nums) {\n        if (count === 0) candidate = num;\n        count += (num === candidate) ? 1 : -1;\n    }\n    return candidate;\n}",
      "python": "class Solution:\n    def majorityElement(self, nums: list[int]) -> int:\n        candidate, count = None, 0\n        for x in nums:\n            if count == 0: candidate = x\n            count += 1 if x == candidate else -1\n        return candidate",
      "cpp": "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        int candidate = 0, count = 0;\n        for (int x : nums) {\n            if (count == 0) candidate = x;\n            count += (x == candidate) ? 1 : -1;\n        }\n        return candidate;\n    }\n};",
      "java": "class Solution {\n    public int majorityElement(int[] nums) {\n        int candidate = 0, count = 0;\n        for (int x : nums) {\n            if (count == 0) candidate = x;\n            count += (x == candidate) ? 1 : -1;\n        }\n        return candidate;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Longest Consecutive Sequence",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "infosys",
      "tcs",
      "amazon",
      "deloitte"
    ],
    "topics": [
      "Array",
      "Hash Table",
      "Union Find"
    ],
    "frequency": "High",
    "source": "Top Infosys Specialist Programmer & Amazon Problem",
    "tags": [
      "Infosys",
      "Hash Set",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an unsorted array of integers `nums`, return *the length of the longest consecutive elements sequence*.\n\nYou must write an algorithm that runs in `O(n)` time.",
    "examples": [
      {
        "input": "nums = [100,4,200,1,3,2]",
        "output": "4",
        "explanation": "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4."
      },
      {
        "input": "nums = [0,3,7,2,5,8,4,6,0,1]",
        "output": "9",
        "explanation": "Sequence 0..8 has length 9."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "starterCode": {
      "javascript": "function longestConsecutive(nums) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def longestConsecutive(self, nums: list[int]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int longestConsecutive(int[] nums) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[100,4,200,1,3,2]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[0,3,7,2,5,8,4,6,0,1]",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "input": "[300,299,298,297,296,295,294,293,292,291,290,289,288,287,286,285,284,283,282,281,280,279,278,277,276,275,274,273,272,271,270,269,268,267,266,265,264,263,262,261,260,259,258,257,256,255,254,253,252,251,250,249,248,247,246,245,244,243,242,241,240,239,238,237,236,235,234,233,232,231,230,229,228,227,226,225,224,223,222,221,220,219,218,217,216,215,214,213,212,211,210,209,208,207,206,205,204,203,202,201,200,199,198,197,196,195,194,193,192,191,190,189,188,187,186,185,184,183,182,181,180,179,178,177,176,175,174,173,172,171,170,169,168,167,166,165,164,163,162,161,160,159,158,157,156,155,154,153,152,151,150,149,148,147,146,145,144,143,142,141,140,139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,124,123,122,121,120,119,118,117,116,115,114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]",
        "expectedOutput": "300",
        "isHidden": true
      },
      {
        "input": "[]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[1,2,0,1]",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "[-2,-3,-1,0,1]",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "[9,1,4,7,3,-1,0,5,8,-1,6]",
        "expectedOutput": "7",
        "isHidden": true
      },
      {
        "input": "[300,299,298,297,296,295,294,293,292,291,290,289,288,287,286,285,284,283,282,281,280,279,278,277,276,275,274,273,272,271,270,269,268,267,266,265,264,263,262,261,260,259,258,257,256,255,254,253,252,251,250,249,248,247,246,245,244,243,242,241,240,239,238,237,236,235,234,233,232,231,230,229,228,227,226,225,224,223,222,221,220,219,218,217,216,215,214,213,212,211,210,209,208,207,206,205,204,203,202,201,200,199,198,197,196,195,194,193,192,191,190,189,188,187,186,185,184,183,182,181,180,179,178,177,176,175,174,173,172,171,170,169,168,167,166,165,164,163,162,161,160,159,158,157,156,155,154,153,152,151,150,149,148,147,146,145,144,143,142,141,140,139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,124,123,122,121,120,119,118,117,116,115,114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]",
        "expectedOutput": "300",
        "isHidden": true
      },
      {
        "input": "[]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[1,2,0,1]",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "[-2,-3,-1,0,1]",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "[9,1,4,7,3,-1,0,5,8,-1,6]",
        "expectedOutput": "7",
        "isHidden": true
      }
    ],
    "hints": [
      "Store numbers in a Set. Only start counting if num - 1 is NOT in the set."
    ],
    "approach": "Hash Set sequence expansion starting only at sequence heads: O(n) time and O(n) space.",
    "solutionCode": {
      "javascript": "function longestConsecutive(nums) {\n    const set = new Set(nums);\n    let maxLen = 0;\n    for (const num of set) {\n        if (!set.has(num - 1)) {\n            let curr = num, len = 1;\n            while (set.has(curr + 1)) {\n                curr++;\n                len++;\n            }\n            maxLen = Math.max(maxLen, len);\n        }\n    }\n    return maxLen;\n}",
      "python": "class Solution:\n    def longestConsecutive(self, nums: list[int]) -> int:\n        num_set = set(nums)\n        longest = 0\n        for num in num_set:\n            if num - 1 not in num_set:\n                curr = num\n                length = 1\n                while curr + 1 in num_set:\n                    curr += 1\n                    length += 1\n                longest = max(longest, length)\n        return longest",
      "cpp": "class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        unordered_set<int> s(nums.begin(), nums.end());\n        int maxLen = 0;\n        for (int num : s) {\n            if (!s.count(num - 1)) {\n                int curr = num, len = 1;\n                while (s.count(curr + 1)) { curr++; len++; }\n                maxLen = max(maxLen, len);\n            }\n        }\n        return maxLen;\n    }\n};",
      "java": "class Solution {\n    public int longestConsecutive(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int x : nums) set.add(x);\n        int maxLen = 0;\n        for (int num : set) {\n            if (!set.contains(num - 1)) {\n                int curr = num, len = 1;\n                while (set.contains(curr + 1)) { curr++; len++; }\n                maxLen = Math.max(maxLen, len);\n            }\n        }\n        return maxLen;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(n)"
  },
  {
    "title": "Merge Two Sorted Lists",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "infosys",
      "wipro",
      "cognizant",
      "accenture",
      "deloitte"
    ],
    "topics": [
      "Linked List",
      "Recursion"
    ],
    "frequency": "High",
    "source": "High frequency Infosys & Wipro Technical Round",
    "tags": [
      "Linked List",
      "Infosys",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn *the head of the merged linked list*.",
    "examples": [
      {
        "input": "list1 = [1,2,4], list2 = [1,3,4]",
        "output": "[1,1,2,3,4,4]",
        "explanation": "Merged into sorted list."
      },
      {
        "input": "list1 = [], list2 = []",
        "output": "[]",
        "explanation": "Empty merged list."
      }
    ],
    "constraints": [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100"
    ],
    "starterCode": {
      "javascript": "function mergeTwoLists(list1, list2) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def mergeTwoLists(self, list1, list2):\n        pass",
      "cpp": "class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        return nullptr;\n    }\n};",
      "java": "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        return null;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[1,2,4]\n[1,3,4]",
        "expectedOutput": "[1,1,2,3,4,4]",
        "isHidden": false
      },
      {
        "input": "[]\n[]",
        "expectedOutput": "[]",
        "isHidden": false
      },
      {
        "input": "[1,2,4]\n[1,3,4]",
        "expectedOutput": "[1,1,2,3,4,4]",
        "isHidden": true
      },
      {
        "input": "[]\n[]",
        "expectedOutput": "[]",
        "isHidden": true
      },
      {
        "input": "[]\n[0]",
        "expectedOutput": "[0]",
        "isHidden": true
      },
      {
        "input": "[1,3,5]\n[2,4,6]",
        "expectedOutput": "[1,2,3,4,5,6]",
        "isHidden": true
      },
      {
        "input": "[1,1,1]\n[2,2,2]",
        "expectedOutput": "[1,1,1,2,2,2]",
        "isHidden": true
      },
      {
        "input": "[5,10,15]\n[1,2,3,4,20]",
        "expectedOutput": "[1,2,3,4,5,10,15,20]",
        "isHidden": true
      }
    ],
    "hints": [
      "Use a dummy node and iterate while both lists are non-empty."
    ],
    "approach": "Iterative two pointers with dummy head: O(n + m) time and O(1) space.",
    "solutionCode": {
      "javascript": "function mergeTwoLists(list1, list2) {\n    const arr = [];\n    let p1 = 0, p2 = 0;\n    while (p1 < (list1 ? list1.length : 0) && p2 < (list2 ? list2.length : 0)) {\n        if (list1[p1] <= list2[p2]) arr.push(list1[p1++]);\n        else arr.push(list2[p2++]);\n    }\n    if (list1) while (p1 < list1.length) arr.push(list1[p1++]);\n    if (list2) while (p2 < list2.length) arr.push(list2[p2++]);\n    return arr;\n}",
      "python": "class Solution:\n    def mergeTwoLists(self, list1, list2):\n        res = []\n        i = j = 0\n        l1 = list1 or []\n        l2 = list2 or []\n        while i < len(l1) and j < len(l2):\n            if l1[i] <= l2[j]: res.append(l1[i]); i += 1\n            else: res.append(l2[j]); j += 1\n        res.extend(l1[i:])\n        res.extend(l2[j:])\n        return res",
      "cpp": "class Solution {\npublic:\n    vector<int> mergeTwoLists(vector<int>& list1, vector<int>& list2) {\n        vector<int> res;\n        int i = 0, j = 0;\n        while (i < list1.size() && j < list2.size()) {\n            if (list1[i] <= list2[j]) res.push_back(list1[i++]);\n            else res.push_back(list2[j++]);\n        }\n        while (i < list1.size()) res.push_back(list1[i++]);\n        while (j < list2.size()) res.push_back(list2[j++]);\n        return res;\n    }\n};",
      "java": "class Solution {\n    public List<Integer> mergeTwoLists(List<Integer> list1, List<Integer> list2) {\n        List<Integer> res = new ArrayList<>();\n        int i = 0, j = 0;\n        int s1 = list1 != null ? list1.size() : 0;\n        int s2 = list2 != null ? list2.size() : 0;\n        while (i < s1 && j < s2) {\n            if (list1.get(i) <= list2.get(j)) res.add(list1.get(i++));\n            else res.add(list2.get(j++));\n        }\n        while (i < s1) res.add(list1.get(i++));\n        while (j < s2) res.add(list2.get(j++));\n        return res;\n    }\n}"
    },
    "timeComplexity": "O(n + m)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Reverse Integer",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "wipro",
      "accenture",
      "deloitte",
      "capgemini"
    ],
    "topics": [
      "Math"
    ],
    "frequency": "High",
    "source": "Reported in Wipro Turbo & Deloitte Assessments",
    "tags": [
      "Math",
      "Wipro",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given a signed 32-bit integer `x`, return `x` *with its digits reversed*. If reversing `x` causes the value to go outside the signed 32-bit integer range `[-2^31, 2^31 - 1]`, then return `0`.\n\n**Assume the environment does not allow you to store 64-bit integers (signed or unsigned).**",
    "examples": [
      {
        "input": "x = 123",
        "output": "321",
        "explanation": "Reversed integer."
      },
      {
        "input": "x = -123",
        "output": "-321",
        "explanation": "Negative sign preserved."
      },
      {
        "input": "x = 120",
        "output": "21",
        "explanation": "Trailing zeroes removed."
      }
    ],
    "constraints": [
      "-2^31 <= x <= 2^31 - 1"
    ],
    "starterCode": {
      "javascript": "function reverse(x) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def reverse(self, x: int) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int reverse(int x) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int reverse(int x) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "123",
        "expectedOutput": "321",
        "isHidden": false
      },
      {
        "input": "-123",
        "expectedOutput": "-321",
        "isHidden": false
      },
      {
        "input": "120",
        "expectedOutput": "21",
        "isHidden": true
      },
      {
        "input": "123",
        "expectedOutput": "321",
        "isHidden": true
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "1534236469",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "-2147483648",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "1000000003",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "-120",
        "expectedOutput": "-21",
        "isHidden": true
      }
    ],
    "hints": [
      "Pop digits using % 10, push to result using * 10 + pop. Check overflow before multiplying."
    ],
    "approach": "Mathematical digit extraction with 32-bit integer overflow guard: O(log |x|) time.",
    "solutionCode": {
      "javascript": "function reverse(x) {\n    const sign = x < 0 ? -1 : 1;\n    let n = Math.abs(x);\n    let rev = 0;\n    while (n > 0) {\n        rev = rev * 10 + (n % 10);\n        n = Math.floor(n / 10);\n    }\n    rev *= sign;\n    if (rev < -Math.pow(2, 31) || rev > Math.pow(2, 31) - 1) return 0;\n    return rev;\n}",
      "python": "class Solution:\n    def reverse(self, x: int) -> int:\n        sign = -1 if x < 0 else 1\n        rev = int(str(abs(x))[::-1]) * sign\n        return rev if -2**31 <= rev <= 2**31 - 1 else 0",
      "cpp": "class Solution {\npublic:\n    int reverse(int x) {\n        int rev = 0;\n        while (x != 0) {\n            int pop = x % 10;\n            x /= 10;\n            if (rev > INT_MAX/10 || (rev == INT_MAX / 10 && pop > 7)) return 0;\n            if (rev < INT_MIN/10 || (rev == INT_MIN / 10 && pop < -8)) return 0;\n            rev = rev * 10 + pop;\n        }\n        return rev;\n    }\n};",
      "java": "class Solution {\n    public int reverse(int x) {\n        int rev = 0;\n        while (x != 0) {\n            int pop = x % 10;\n            x /= 10;\n            if (rev > Integer.MAX_VALUE/10 || (rev == Integer.MAX_VALUE/10 && pop > 7)) return 0;\n            if (rev < Integer.MIN_VALUE/10 || (rev == Integer.MIN_VALUE/10 && pop < -8)) return 0;\n            rev = rev * 10 + pop;\n        }\n        return rev;\n    }\n}"
    },
    "timeComplexity": "O(log10(x))",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Single Number",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "wipro",
      "cognizant",
      "capgemini",
      "accenture"
    ],
    "topics": [
      "Array",
      "Bit Manipulation"
    ],
    "frequency": "High",
    "source": "Wipro & Cognizant OA Question",
    "tags": [
      "Bit Manipulation",
      "Wipro",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given a **non-empty** array of integers `nums`, every element appears *twice* except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.",
    "examples": [
      {
        "input": "nums = [2,2,1]",
        "output": "1",
        "explanation": "1 appears once."
      },
      {
        "input": "nums = [4,1,2,1,2]",
        "output": "4",
        "explanation": "4 appears once."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 3 * 10^4",
      "-3 * 10^4 <= nums[i] <= 3 * 10^4",
      "Every element appears twice except for one."
    ],
    "starterCode": {
      "javascript": "function singleNumber(nums) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int singleNumber(int[] nums) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[2,2,1]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[4,1,2,1,2]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31,32,32,33,33,34,34,35,35,36,36,37,37,38,38,39,39,40,40,41,41,42,42,43,43,44,44,45,45,46,46,47,47,48,48,49,49,50,50,51,51,52,52,53,53,54,54,55,55,56,56,57,57,58,58,59,59,60,60,61,61,62,62,63,63,64,64,65,65,66,66,67,67,68,68,69,69,70,70,71,71,72,72,73,73,74,74,75,75,76,76,77,77,78,78,79,79,80,80,81,81,82,82,83,83,84,84,85,85,86,86,87,87,88,88,89,89,90,90,91,91,92,92,93,93,94,94,95,95,96,96,97,97,98,98,99,99,100,100,101,101,102,102,103,103,104,104,105,105,106,106,107,107,108,108,109,109,110,110,111,111,112,112,113,113,114,114,115,115,116,116,117,117,118,118,119,119,120,120,121,121,122,122,123,123,124,124,125,125,126,126,127,127,128,128,129,129,130,130,131,131,132,132,133,133,134,134,135,135,136,136,137,137,138,138,139,139,140,140,141,141,142,142,143,143,144,144,145,145,146,146,147,147,148,148,149,149,150,150,151,151,152,152,153,153,154,154,155,155,156,156,157,157,158,158,159,159,160,160,161,161,162,162,163,163,164,164,165,165,166,166,167,167,168,168,169,169,170,170,171,171,172,172,173,173,174,174,175,175,176,176,177,177,178,178,179,179,180,180,181,181,182,182,183,183,184,184,185,185,186,186,187,187,188,188,189,189,190,190,191,191,192,192,193,193,194,194,195,195,196,196,197,197,198,198,199,199,200,200,9999]",
        "expectedOutput": "9999",
        "isHidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[-1,-1,-2]",
        "expectedOutput": "-2",
        "isHidden": true
      },
      {
        "input": "[0,1,0]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[30000,500,30000]",
        "expectedOutput": "500",
        "isHidden": true
      },
      {
        "input": "[1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31,32,32,33,33,34,34,35,35,36,36,37,37,38,38,39,39,40,40,41,41,42,42,43,43,44,44,45,45,46,46,47,47,48,48,49,49,50,50,51,51,52,52,53,53,54,54,55,55,56,56,57,57,58,58,59,59,60,60,61,61,62,62,63,63,64,64,65,65,66,66,67,67,68,68,69,69,70,70,71,71,72,72,73,73,74,74,75,75,76,76,77,77,78,78,79,79,80,80,81,81,82,82,83,83,84,84,85,85,86,86,87,87,88,88,89,89,90,90,91,91,92,92,93,93,94,94,95,95,96,96,97,97,98,98,99,99,100,100,101,101,102,102,103,103,104,104,105,105,106,106,107,107,108,108,109,109,110,110,111,111,112,112,113,113,114,114,115,115,116,116,117,117,118,118,119,119,120,120,121,121,122,122,123,123,124,124,125,125,126,126,127,127,128,128,129,129,130,130,131,131,132,132,133,133,134,134,135,135,136,136,137,137,138,138,139,139,140,140,141,141,142,142,143,143,144,144,145,145,146,146,147,147,148,148,149,149,150,150,151,151,152,152,153,153,154,154,155,155,156,156,157,157,158,158,159,159,160,160,161,161,162,162,163,163,164,164,165,165,166,166,167,167,168,168,169,169,170,170,171,171,172,172,173,173,174,174,175,175,176,176,177,177,178,178,179,179,180,180,181,181,182,182,183,183,184,184,185,185,186,186,187,187,188,188,189,189,190,190,191,191,192,192,193,193,194,194,195,195,196,196,197,197,198,198,199,199,200,200,9999]",
        "expectedOutput": "9999",
        "isHidden": true
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[-1,-1,-2]",
        "expectedOutput": "-2",
        "isHidden": true
      },
      {
        "input": "[0,1,0]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[30000,500,30000]",
        "expectedOutput": "500",
        "isHidden": true
      }
    ],
    "hints": [
      "XOR of any number with itself is 0: a ^ a = 0.",
      "XOR of any number with 0 is the number: a ^ 0 = a."
    ],
    "approach": "XOR Accumulation across the entire array: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function singleNumber(nums) {\n    return nums.reduce((acc, curr) => acc ^ curr, 0);\n}",
      "python": "class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        res = 0\n        for x in nums: res ^= x\n        return res",
      "cpp": "class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        int res = 0;\n        for (int x : nums) res ^= x;\n        return res;\n    }\n};",
      "java": "class Solution {\n    public int singleNumber(int[] nums) {\n        int res = 0;\n        for (int x : nums) res ^= x;\n        return res;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Climbing Stairs",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "wipro",
      "deloitte",
      "infosys",
      "adobe"
    ],
    "topics": [
      "Math",
      "Dynamic Programming",
      "Memoization"
    ],
    "frequency": "High",
    "source": "Top Asked DP Question in Deloitte & Wipro",
    "tags": [
      "DP",
      "Deloitte",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    "examples": [
      {
        "input": "n = 2",
        "output": "2",
        "explanation": "1. 1 step + 1 step, 2. 2 steps."
      },
      {
        "input": "n = 3",
        "output": "3",
        "explanation": "1. 1+1+1, 2. 1+2, 3. 2+1."
      }
    ],
    "constraints": [
      "1 <= n <= 45"
    ],
    "starterCode": {
      "javascript": "function climbStairs(n) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "2",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "3",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "5",
        "expectedOutput": "8",
        "isHidden": true
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "4",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "5",
        "expectedOutput": "8",
        "isHidden": true
      },
      {
        "input": "10",
        "expectedOutput": "89",
        "isHidden": true
      },
      {
        "input": "20",
        "expectedOutput": "10946",
        "isHidden": true
      },
      {
        "input": "30",
        "expectedOutput": "1346269",
        "isHidden": true
      },
      {
        "input": "35",
        "expectedOutput": "14930352",
        "isHidden": true
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "4",
        "expectedOutput": "5",
        "isHidden": true
      },
      {
        "input": "5",
        "expectedOutput": "8",
        "isHidden": true
      },
      {
        "input": "10",
        "expectedOutput": "89",
        "isHidden": true
      },
      {
        "input": "20",
        "expectedOutput": "10946",
        "isHidden": true
      },
      {
        "input": "30",
        "expectedOutput": "1346269",
        "isHidden": true
      },
      {
        "input": "35",
        "expectedOutput": "14930352",
        "isHidden": true
      }
    ],
    "hints": [
      "ways(n) = ways(n - 1) + ways(n - 2). This is the Fibonacci sequence."
    ],
    "approach": "Iterative Fibonacci state transition: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function climbStairs(n) {\n    if (n <= 2) return n;\n    let a = 1, b = 2;\n    for (let i = 3; i <= n; i++) {\n        const c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}",
      "python": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        if n <= 2: return n\n        a, b = 1, 2\n        for _ in range(3, n + 1):\n            a, b = b, a + b\n        return b",
      "cpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        return b;\n    }\n};",
      "java": "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        return b;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Longest Common Prefix",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "cognizant",
      "deloitte",
      "accenture",
      "capgemini"
    ],
    "topics": [
      "String",
      "Trie"
    ],
    "frequency": "High",
    "source": "Cognizant GenC & Deloitte Online Assessment",
    "tags": [
      "String",
      "Cognizant",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string `\"\"`.",
    "examples": [
      {
        "input": "strs = [\"flower\",\"flow\",\"flight\"]",
        "output": "\"fl\"",
        "explanation": "\"fl\" is common to all."
      },
      {
        "input": "strs = [\"dog\",\"racecar\",\"car\"]",
        "output": "\"\"",
        "explanation": "No common prefix."
      }
    ],
    "constraints": [
      "1 <= strs.length <= 200",
      "0 <= strs[i].length <= 200",
      "strs[i] consists of only lowercase English letters."
    ],
    "starterCode": {
      "javascript": "function longestCommonPrefix(strs) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        pass",
      "cpp": "class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        return \"\";\n    }\n};",
      "java": "class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        return \"\";\n    }\n}"
    },
    "testCases": [
      {
        "input": "[\"flower\",\"flow\",\"flight\"]",
        "expectedOutput": "\"fl\"",
        "isHidden": false
      },
      {
        "input": "[\"dog\",\"racecar\",\"car\"]",
        "expectedOutput": "\"\"",
        "isHidden": false
      },
      {
        "input": "[\"a\"]",
        "expectedOutput": "\"a\"",
        "isHidden": true
      },
      {
        "input": "[\"interspecies\",\"interstellar\",\"interstate\"]",
        "expectedOutput": "\"inters\"",
        "isHidden": true
      },
      {
        "input": "[\"throne\",\"throne\"]",
        "expectedOutput": "\"throne\"",
        "isHidden": true
      },
      {
        "input": "[\"\",\"b\"]",
        "expectedOutput": "\"\"",
        "isHidden": true
      },
      {
        "input": "[\"ab\",\"a\"]",
        "expectedOutput": "\"a\"",
        "isHidden": true
      },
      {
        "input": "[\"a\"]",
        "expectedOutput": "\"a\"",
        "isHidden": true
      },
      {
        "input": "[\"interspecies\",\"interstellar\",\"interstate\"]",
        "expectedOutput": "\"inters\"",
        "isHidden": true
      },
      {
        "input": "[\"throne\",\"throne\"]",
        "expectedOutput": "\"throne\"",
        "isHidden": true
      },
      {
        "input": "[\"\",\"b\"]",
        "expectedOutput": "\"\"",
        "isHidden": true
      },
      {
        "input": "[\"ab\",\"a\"]",
        "expectedOutput": "\"a\"",
        "isHidden": true
      }
    ],
    "hints": [
      "Compare character by character across all strings at index i."
    ],
    "approach": "Vertical scanning character by character: O(S) where S is sum of all chars.",
    "solutionCode": {
      "javascript": "function longestCommonPrefix(strs) {\n    if (!strs.length) return \"\";\n    for (let i = 0; i < strs[0].length; i++) {\n        const c = strs[0][i];\n        for (let j = 1; j < strs.length; j++) {\n            if (i === strs[j].length || strs[j][i] !== c) {\n                return strs[0].substring(0, i);\n            }\n        }\n    }\n    return strs[0];\n}",
      "python": "class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        if not strs: return \"\"\n        for i, c in enumerate(strs[0]):\n            for other in strs[1:]:\n                if i == len(other) or other[i] != c:\n                    return strs[0][:i]\n        return strs[0]",
      "cpp": "class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        if (strs.empty()) return \"\";\n        for (int i = 0; i < strs[0].size(); i++) {\n            char c = strs[0][i];\n            for (int j = 1; j < strs.size(); j++) {\n                if (i == strs[j].size() || strs[j][i] != c) return strs[0].substr(0, i);\n            }\n        }\n        return strs[0];\n    }\n};",
      "java": "class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        if (strs == null || strs.length == 0) return \"\";\n        for (int i = 0; i < strs[0].length(); i++) {\n            char c = strs[0].charAt(i);\n            for (int j = 1; j < strs.length; j++) {\n                if (i == strs[j].length() || strs[j].charAt(i) != c) {\n                    return strs[0].substring(0, i);\n                }\n            }\n        }\n        return strs[0];\n    }\n}"
    },
    "timeComplexity": "O(S)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Sort Array By Parity",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "capgemini",
      "cognizant",
      "accenture",
      "wipro"
    ],
    "topics": [
      "Array",
      "Two Pointers",
      "Sorting"
    ],
    "frequency": "High",
    "source": "Capgemini & Accenture Online Coding Test",
    "tags": [
      "Capgemini",
      "Two Pointers",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an integer array `nums`, move all the even integers at the beginning of the array followed by all the odd integers.\n\nReturn *any array that satisfies this condition*.",
    "examples": [
      {
        "input": "nums = [3,1,2,4]",
        "output": "[2,4,3,1]",
        "explanation": "[4,2,3,1], [2,4,1,3], and [4,2,1,3] would also be accepted."
      },
      {
        "input": "nums = [0]",
        "output": "[0]",
        "explanation": "Single element unchanged."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 5000",
      "0 <= nums[i] <= 5000"
    ],
    "starterCode": {
      "javascript": "function sortArrayByParity(nums) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def sortArrayByParity(self, nums: list[int]) -> list[int]:\n        pass",
      "cpp": "class Solution {\npublic:\n    vector<int> sortArrayByParity(vector<int>& nums) {\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] sortArrayByParity(int[] nums) {\n        return new int[]{};\n    }\n}"
    },
    "testCases": [
      {
        "input": "[3,1,2,4]",
        "expectedOutput": "[2,4,3,1]",
        "isHidden": false
      },
      {
        "input": "[0]",
        "expectedOutput": "[0]",
        "isHidden": false
      },
      {
        "input": "[3,1,2,4]",
        "expectedOutput": "[2,4,3,1]",
        "isHidden": true
      },
      {
        "input": "[0]",
        "expectedOutput": "[0]",
        "isHidden": true
      },
      {
        "input": "[1,3,5]",
        "expectedOutput": "[1,3,5]",
        "isHidden": true
      },
      {
        "input": "[2,4,6]",
        "expectedOutput": "[2,4,6]",
        "isHidden": true
      },
      {
        "input": "[0,1,2]",
        "expectedOutput": "[0,2,1]",
        "isHidden": true
      },
      {
        "input": "[1,2,3,4,5,6,7,8,9,10]",
        "expectedOutput": "[2,4,6,8,10,1,3,5,7,9]",
        "isHidden": true
      }
    ],
    "hints": [
      "Use two pointers at left=0 and right=n-1, swapping odd numbers on left with evens on right."
    ],
    "approach": "Two pointers in-place swap: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function sortArrayByParity(nums) {\n    let left = 0, right = nums.length - 1;\n    while (left < right) {\n        if (nums[left] % 2 > nums[right] % 2) {\n            [nums[left], nums[right]] = [nums[right], nums[left]];\n        }\n        if (nums[left] % 2 === 0) left++;\n        if (nums[right] % 2 === 1) right--;\n    }\n    return nums;\n}",
      "python": "class Solution:\n    def sortArrayByParity(self, nums: list[int]) -> list[int]:\n        l, r = 0, len(nums) - 1\n        while l < r:\n            if nums[l] % 2 > nums[r] % 2:\n                nums[l], nums[r] = nums[r], nums[l]\n            if nums[l] % 2 == 0: l += 1\n            if nums[r] % 2 == 1: r -= 1\n        return nums",
      "cpp": "class Solution {\npublic:\n    vector<int> sortArrayByParity(vector<int>& nums) {\n        int l = 0, r = nums.size() - 1;\n        while (l < r) {\n            if (nums[l] % 2 > nums[r] % 2) swap(nums[l], nums[r]);\n            if (nums[l] % 2 == 0) l++;\n            if (nums[r] % 2 == 1) r--;\n        }\n        return nums;\n    }\n};",
      "java": "class Solution {\n    public int[] sortArrayByParity(int[] nums) {\n        int l = 0, r = nums.length - 1;\n        while (l < r) {\n            if (nums[l] % 2 > nums[r] % 2) {\n                int t = nums[l]; nums[l] = nums[r]; nums[r] = t;\n            }\n            if (nums[l] % 2 == 0) l++;\n            if (nums[r] % 2 == 1) r--;\n        }\n        return nums;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Number of 1 Bits",
    "category": "coding",
    "type": "coding",
    "difficulty": "Easy",
    "companies": [
      "deloitte",
      "wipro",
      "accenture",
      "cognizant"
    ],
    "topics": [
      "Divide and Conquer",
      "Bit Manipulation"
    ],
    "frequency": "High",
    "source": "Reported in Deloitte & Accenture Assessments",
    "tags": [
      "Deloitte",
      "Bit Manipulation",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given a positive integer `n`, write a function that returns the number of set bits (1s) in its binary representation (also known as the **Hamming weight**).",
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "11 in binary is 1011, which has three set bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "128 in binary is 10000000 (one set bit)."
      }
    ],
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "starterCode": {
      "javascript": "function hammingWeight(n) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def hammingWeight(self, n: int) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int hammingWeight(int n) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int hammingWeight(int n) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "11",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "128",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "2147483645",
        "expectedOutput": "30",
        "isHidden": true
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "7",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "2147483647",
        "expectedOutput": "31",
        "isHidden": true
      },
      {
        "input": "1024",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "7",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "2147483647",
        "expectedOutput": "31",
        "isHidden": true
      },
      {
        "input": "1024",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "hints": [
      "Use Brian Kernighan's Algorithm: n = n & (n - 1) clears the lowest set bit in each iteration."
    ],
    "approach": "Brian Kernighan's Bit Manipulation: O(number of set bits) time and O(1) space.",
    "solutionCode": {
      "javascript": "function hammingWeight(n) {\n    let count = 0;\n    while (n !== 0) {\n        n = n & (n - 1);\n        count++;\n    }\n    return count;\n}",
      "python": "class Solution:\n    def hammingWeight(self, n: int) -> int:\n        count = 0\n        while n:\n            n &= (n - 1)\n            count += 1\n        return count",
      "cpp": "class Solution {\npublic:\n    int hammingWeight(int n) {\n        int count = 0;\n        while (n != 0) {\n            n &= (n - 1);\n            count++;\n        }\n        return count;\n    }\n};",
      "java": "class Solution {\n    public int hammingWeight(int n) {\n        int count = 0;\n        while (n != 0) {\n            n &= (n - 1);\n            count++;\n        }\n        return count;\n    }\n}"
    },
    "timeComplexity": "O(k) where k is number of set bits",
    "spaceComplexity": "O(1)"
  },
  {
    "title": "Maximum Product Subarray",
    "category": "coding",
    "type": "coding",
    "difficulty": "Medium",
    "companies": [
      "adobe",
      "meta",
      "microsoft",
      "google"
    ],
    "topics": [
      "Array",
      "Dynamic Programming"
    ],
    "frequency": "High",
    "source": "Top Adobe & Meta Technical Coding Question",
    "tags": [
      "DP",
      "Adobe",
      "2026"
    ],
    "lastReviewed": "2026",
    "problemDescription": "Given an integer array `nums`, find a subarray that has the largest product, and return *the product*.\n\nThe test cases are generated so that the answer will fit in a **32-bit** integer.",
    "examples": [
      {
        "input": "nums = [2,3,-2,4]",
        "output": "6",
        "explanation": "[2,3] has the largest product 6."
      },
      {
        "input": "nums = [-2,0,-1]",
        "output": "0",
        "explanation": "The result cannot be 2, because [-2,-1] is not a contiguous subarray."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 2 * 10^4",
      "-10 <= nums[i] <= 10"
    ],
    "starterCode": {
      "javascript": "function maxProduct(nums) {\n    // Write your code here\n}",
      "python": "class Solution:\n    def maxProduct(self, nums: list[int]) -> int:\n        pass",
      "cpp": "class Solution {\npublic:\n    int maxProduct(vector<int>& nums) {\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int maxProduct(int[] nums) {\n        return 0;\n    }\n}"
    },
    "testCases": [
      {
        "input": "[2,3,-2,4]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[-2,0,-1]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "[-2,3,-4]",
        "expectedOutput": "24",
        "isHidden": true
      },
      {
        "input": "[0,2]",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[-4,-3,-2]",
        "expectedOutput": "12",
        "isHidden": true
      },
      {
        "input": "[-2]",
        "expectedOutput": "-2",
        "isHidden": true
      },
      {
        "input": "[-2,-3,7]",
        "expectedOutput": "42",
        "isHidden": true
      },
      {
        "input": "[-1,-2,-3,-4]",
        "expectedOutput": "24",
        "isHidden": true
      },
      {
        "input": "[2,-5,-2,-4,3]",
        "expectedOutput": "24",
        "isHidden": true
      },
      {
        "input": "[-2,3,-4]",
        "expectedOutput": "24",
        "isHidden": true
      },
      {
        "input": "[0,2]",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[-4,-3,-2]",
        "expectedOutput": "12",
        "isHidden": true
      },
      {
        "input": "[-2]",
        "expectedOutput": "-2",
        "isHidden": true
      },
      {
        "input": "[-2,-3,7]",
        "expectedOutput": "42",
        "isHidden": true
      },
      {
        "input": "[-1,-2,-3,-4]",
        "expectedOutput": "24",
        "isHidden": true
      },
      {
        "input": "[2,-5,-2,-4,3]",
        "expectedOutput": "24",
        "isHidden": true
      }
    ],
    "hints": [
      "Maintain both maxProduct and minProduct since multiplying by a negative flips min to max."
    ],
    "approach": "Dynamic Programming tracking min and max running products: O(n) time and O(1) space.",
    "solutionCode": {
      "javascript": "function maxProduct(nums) {\n    let maxProd = nums[0], minProd = nums[0], result = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        const x = nums[i];\n        if (x < 0) [maxProd, minProd] = [minProd, maxProd];\n        maxProd = Math.max(x, maxProd * x);\n        minProd = Math.min(x, minProd * x);\n        result = Math.max(result, maxProd);\n    }\n    return result;\n}",
      "python": "class Solution:\n    def maxProduct(self, nums: list[int]) -> int:\n        max_p = min_p = res = nums[0]\n        for x in nums[1:]:\n            if x < 0: max_p, min_p = min_p, max_p\n            max_p = max(x, max_p * x)\n            min_p = min(x, min_p * x)\n            res = max(res, max_p)\n        return res",
      "cpp": "class Solution {\npublic:\n    int maxProduct(vector<int>& nums) {\n        int maxP = nums[0], minP = nums[0], res = nums[0];\n        for (int i = 1; i < nums.size(); i++) {\n            int x = nums[i];\n            if (x < 0) swap(maxP, minP);\n            maxP = max(x, maxP * x);\n            minP = min(x, minP * x);\n            res = max(res, maxP);\n        }\n        return res;\n    }\n};",
      "java": "class Solution {\n    public int maxProduct(int[] nums) {\n        int maxP = nums[0], minP = nums[0], res = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            int x = nums[i];\n            if (x < 0) { int t = maxP; maxP = minP; minP = t; }\n            maxP = Math.max(x, maxP * x);\n            minP = Math.min(x, minP * x);\n            res = Math.max(res, maxP);\n        }\n        return res;\n    }\n}"
    },
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  }
];
