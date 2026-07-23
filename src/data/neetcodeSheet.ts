export interface NeetCodeProblem {
  sheet: string;
  sub_sheets: string[];
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcode_url: string;
  ninja_url?: string | null;
}

export const neetcodeProblems: NeetCodeProblem[] = [
  // === ARRAYS & HASHING (9) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Contains Duplicate', category: 'Arrays & Hashing', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/contains-duplicate/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Valid Anagram', category: 'Arrays & Hashing', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/valid-anagram/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Two Sum', category: 'Arrays & Hashing', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/two-sum/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Group Anagrams', category: 'Arrays & Hashing', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/group-anagrams/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Top K Frequent Elements', category: 'Arrays & Hashing', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Encode and Decode Strings', category: 'Arrays & Hashing', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/encode-and-decode-strings/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Product of Array Except Self', category: 'Arrays & Hashing', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/product-of-array-except-self/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Valid Sudoku', category: 'Arrays & Hashing', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/valid-sudoku/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Longest Consecutive Sequence', category: 'Arrays & Hashing', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },

  // === TWO POINTERS (5) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Valid Palindrome', category: 'Two Pointers', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/valid-palindrome/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Two Sum II - Input Array Is Sorted', category: 'Two Pointers', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: '3Sum', category: 'Two Pointers', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/3sum/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Container With Most Water', category: 'Two Pointers', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/container-with-most-water/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Trapping Rain Water', category: 'Two Pointers', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/trapping-rain-water/' },

  // === SLIDING WINDOW (6) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Best Time to Buy and Sell Stock', category: 'Sliding Window', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Longest Substring Without Repeating Characters', category: 'Sliding Window', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Longest Repeating Character Replacement', category: 'Sliding Window', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Permutation in String', category: 'Sliding Window', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/permutation-in-string/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Minimum Window Substring', category: 'Sliding Window', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/minimum-window-substring/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Sliding Window Maximum', category: 'Sliding Window', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/sliding-window-maximum/' },

  // === STACK (7) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Valid Parentheses', category: 'Stack', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/valid-parentheses/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Min Stack', category: 'Stack', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/min-stack/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Evaluate Reverse Polish Notation', category: 'Stack', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Generate Parentheses', category: 'Stack', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/generate-parentheses/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Daily Temperatures', category: 'Stack', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/daily-temperatures/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Car Fleet', category: 'Stack', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/car-fleet/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Largest Rectangle in Histogram', category: 'Stack', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },

  // === BINARY SEARCH (7) ===
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Binary Search', category: 'Binary Search', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/binary-search/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Search a 2D Matrix', category: 'Binary Search', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/search-a-2d-matrix/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Koko Eating Bananas', category: 'Binary Search', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/koko-eating-bananas/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Find Minimum in Rotated Sorted Array', category: 'Binary Search', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Search in Rotated Sorted Array', category: 'Binary Search', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Time Based Key-Value Store', category: 'Binary Search', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/time-based-key-value-store/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Median of Two Sorted Arrays', category: 'Binary Search', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },

  // === LINKED LIST (11) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Reverse Linked List', category: 'Linked List', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/reverse-linked-list/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Merge Two Sorted Lists', category: 'Linked List', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Linked List Cycle', category: 'Linked List', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/linked-list-cycle/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Reorder List', category: 'Linked List', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/reorder-list/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Remove Nth Node From End of List', category: 'Linked List', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Copy List with Random Pointer', category: 'Linked List', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Add Two Numbers', category: 'Linked List', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/add-two-numbers/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Find the Duplicate Number', category: 'Linked List', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/find-the-duplicate-number/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'LRU Cache', category: 'Linked List', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/lru-cache/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Merge K Sorted Lists', category: 'Linked List', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Reverse Nodes in k-Group', category: 'Linked List', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },

  // === TREES (15) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Invert Binary Tree', category: 'Trees', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/invert-binary-tree/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Maximum Depth of Binary Tree', category: 'Trees', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Diameter of Binary Tree', category: 'Trees', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Balanced Binary Tree', category: 'Trees', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/balanced-binary-tree/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Same Tree', category: 'Trees', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/same-tree/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Subtree of Another Tree', category: 'Trees', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/subtree-of-another-tree/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Lowest Common Ancestor of a Binary Search Tree', category: 'Trees', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Binary Tree Level Order Traversal', category: 'Trees', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Binary Tree Right Side View', category: 'Trees', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Count Good Nodes in Binary Tree', category: 'Trees', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Validate Binary Search Tree', category: 'Trees', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Kth Smallest Element in a BST', category: 'Trees', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Construct Binary Tree from Preorder and Inorder Traversal', category: 'Trees', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Binary Tree Maximum Path Sum', category: 'Trees', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Serialize and Deserialize Binary Tree', category: 'Trees', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },

  // === HEAP / PRIORITY QUEUE (7) ===
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Kth Largest Element in a Stream', category: 'Heap / Priority Queue', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Last Stone Weight', category: 'Heap / Priority Queue', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/last-stone-weight/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'K Closest Points to Origin', category: 'Heap / Priority Queue', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Kth Largest Element in an Array', category: 'Heap / Priority Queue', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Task Scheduler', category: 'Heap / Priority Queue', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/task-scheduler/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Design Twitter', category: 'Heap / Priority Queue', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/design-twitter/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Find Median from Data Stream', category: 'Heap / Priority Queue', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/find-median-from-data-stream/' },

  // === BACKTRACKING (9) ===
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Subsets', category: 'Backtracking', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/subsets/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Combination Sum', category: 'Backtracking', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/combination-sum/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Combination Sum II', category: 'Backtracking', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/combination-sum-ii/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Permutations', category: 'Backtracking', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/permutations/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Subsets II', category: 'Backtracking', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/subsets-ii/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Word Search', category: 'Backtracking', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/word-search/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Palindrome Partitioning', category: 'Backtracking', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/palindrome-partitioning/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Letter Combinations of a Phone Number', category: 'Backtracking', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'N-Queens', category: 'Backtracking', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/n-queens/' },

  // === TRIES (3) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Implement Trie (Prefix Tree)', category: 'Tries', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Design Add and Search Words Data Structure', category: 'Tries', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Word Search II', category: 'Tries', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/word-search-ii/' },

  // === GRAPHS (13) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Number of Islands', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/number-of-islands/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Max Area of Island', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/max-area-of-island/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Clone Graph', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/clone-graph/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Walls and Gates', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/walls-and-gates/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Rotting Oranges', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/rotting-oranges/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Pacific Atlantic Water Flow', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Surrounded Regions', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/surrounded-regions/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Course Schedule', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/course-schedule/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Course Schedule II', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/course-schedule-ii/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Graph Valid Tree', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/graph-valid-tree/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Number of Connected Components in an Undirected Graph', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Redundant Connection', category: 'Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/redundant-connection/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Word Ladder', category: 'Graphs', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/word-ladder/' },

  // === ADVANCED GRAPHS (6) ===
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Network Delay Time', category: 'Advanced Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/network-delay-time/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Reconstruct Itinerary', category: 'Advanced Graphs', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/reconstruct-itinerary/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Min Cost to Connect All Points', category: 'Advanced Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Swim in Rising Water', category: 'Advanced Graphs', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/swim-in-rising-water/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Alien Dictionary', category: 'Advanced Graphs', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/alien-dictionary/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Cheapest Flights Within K Stops', category: 'Advanced Graphs', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },

  // === 1-D DYNAMIC PROGRAMMING (12) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Climbing Stairs', category: '1-D Dynamic Programming', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/climbing-stairs/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Min Cost Climbing Stairs', category: '1-D Dynamic Programming', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'House Robber', category: '1-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/house-robber/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'House Robber II', category: '1-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/house-robber-ii/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Longest Palindromic Substring', category: '1-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/longest-palindromic-substring/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Palindromic Substrings', category: '1-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/palindromic-substrings/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Decode Ways', category: '1-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/decode-ways/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Coin Change', category: '1-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/coin-change/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Maximum Product Subarray', category: '1-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/maximum-product-subarray/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Word Break', category: '1-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/word-break/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Longest Increasing Subsequence', category: '1-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Partition Equal Subset Sum', category: '1-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/partition-equal-subset-sum/' },

  // === 2-D DYNAMIC PROGRAMMING (11) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Unique Paths', category: '2-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/unique-paths/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Longest Common Subsequence', category: '2-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/longest-common-subsequence/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Best Time to Buy and Sell Stock with Cooldown', category: '2-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Coin Change II', category: '2-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/coin-change-ii/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Target Sum', category: '2-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/target-sum/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Interleaving String', category: '2-D Dynamic Programming', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/interleaving-string/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Longest Increasing Path in a Matrix', category: '2-D Dynamic Programming', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Distinct Subsequences', category: '2-D Dynamic Programming', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/distinct-subsequences/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Edit Distance', category: '2-D Dynamic Programming', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/edit-distance/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Burst Balloons', category: '2-D Dynamic Programming', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/burst-balloons/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Regular Expression Matching', category: '2-D Dynamic Programming', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/regular-expression-matching/' },

  // === GREEDY (8) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Maximum Subarray', category: 'Greedy', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/maximum-subarray/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Jump Game', category: 'Greedy', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/jump-game/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Jump Game II', category: 'Greedy', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/jump-game-ii/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Gas Station', category: 'Greedy', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/gas-station/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Hand of Straights', category: 'Greedy', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/hand-of-straights/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Merge Triplets to Form Target Triplet', category: 'Greedy', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Partition Labels', category: 'Greedy', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/partition-labels/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Valid Parenthesis String', category: 'Greedy', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/valid-parenthesis-string/' },

  // === INTERVALS (6) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Insert Interval', category: 'Intervals', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/insert-interval/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Merge Intervals', category: 'Intervals', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/merge-intervals/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Non-overlapping Intervals', category: 'Intervals', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/non-overlapping-intervals/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Meeting Rooms', category: 'Intervals', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/meeting-rooms/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Meeting Rooms II', category: 'Intervals', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/meeting-rooms-ii/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Minimum Interval to Include Each Query', category: 'Intervals', difficulty: 'Hard', leetcode_url: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/' },

  // === MATH & GEOMETRY (8) ===
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Rotate Image', category: 'Math & Geometry', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/rotate-image/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Spiral Matrix', category: 'Math & Geometry', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/spiral-matrix/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Set Matrix Zeroes', category: 'Math & Geometry', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/set-matrix-zeroes/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Happy Number', category: 'Math & Geometry', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/happy-number/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Plus One', category: 'Math & Geometry', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/plus-one/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Pow(x, n)', category: 'Math & Geometry', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/powx-n/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Multiply Strings', category: 'Math & Geometry', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/multiply-strings/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Detect Squares', category: 'Math & Geometry', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/detect-squares/' },

  // === BIT MANIPULATION (7) ===
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Single Number', category: 'Bit Manipulation', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/single-number/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Number of 1 Bits', category: 'Bit Manipulation', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/number-of-1-bits/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Counting Bits', category: 'Bit Manipulation', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/counting-bits/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Reverse Bits', category: 'Bit Manipulation', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/reverse-bits/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Missing Number', category: 'Bit Manipulation', difficulty: 'Easy', leetcode_url: 'https://leetcode.com/problems/missing-number/' },
  { sheet: 'neetcode_all', sub_sheets: ['blind_75', 'neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Sum of Two Integers', category: 'Bit Manipulation', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/sum-of-two-integers/' },
  { sheet: 'neetcode_all', sub_sheets: ['neetcode_150', 'neetcode_250', 'neetcode_all'], title: 'Reverse Integer', category: 'Bit Manipulation', difficulty: 'Medium', leetcode_url: 'https://leetcode.com/problems/reverse-integer/' }
];
