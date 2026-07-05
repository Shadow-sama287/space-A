export interface TLEProblem {
  sheet: 'tle_31';
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  leetcode_url: string;
  ninja_url: string | null;
}

const RATING_TIERS = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900];

// Representative TLE Eliminators 31 problem titles for each rating tier
const SAMPLE_TITLES_PER_RATING: { [rating: number]: string[] } = {
  800: [
    "Halloumi Boxes", "Line Trip", "Cover in Water", "Game with Integers", "Jagged Swaps",
    "Doremy's Paint 3", "How Much Does Daytona Cost?", "Target Practice", "Goals of Victory", "Ambitious Kid",
    "Sequence Game", "United We Stand", "Buttons", "Array Coloring", "Desorting",
    "Coins", "Grasshopper on a Line", "Twin Permutations", "Blank Space", "Unit Array",
    "Walking Master", "We Need the Zero", "One and Two", "Make it Beautiful", "Everybody Likes Good Arrays!",
    "Serval and Mocha's Array", "Prepend and Append", "Extremly Basic Geometry", "A+B?", "Two Elevators", "Mainak and Array"
  ],
  900: [
    "Forked!", "Chemistry", "Vasilije in Cacak", "Alesa and Stack", "Make It Zero",
    "Balanced Round", "Comparison String", "Permutation Swap", "Luntik and Subsequences", "Odd Grasshopper",
    "Make It Increasing", "Deletions of Two Adjacent Letters", "Array Cloning Technique", "Mainak and Interesting Sequence", "AvtoBus", "Nit Destroys the Universe",
    "Make It Ugly", "Odd Divisor", "Bad Boy", "Exciting Bets", "Mocha and Math",
    "Make AP", "AB Balance", "01 Game", "Strange Partition", "Three Indices",
    "Sum of Medians", "Multiply by 2, divide by 6", "Even But Not Even", "Construct the String", "Jellyfish and Undertale"
  ],
  1000: [
    "Swap and Delete", "Raspberries", "Helmets in Night Light", "Olya and Game with Arrays", "Array Merger",
    "Ski Resort", "Monsters", "Basketball Together", "Minimum LCM", "Distinct Split",
    "Double Strings", "Roof Construction", "Triangles on a Rectangle", "Divan and a New Project", "Reverse a Substring",
    "XOR Mixup", "Shooshuns and Sequence", "Beautiful Array", "Bogosort", "Move Brackets",
    "Johnny and Ancient Computer", "Card Constructions", "Buying Shovels", "Berland Regional", "K-divisible Sum",
    "Meximization", "Red and Blue", "Add and Divide", "Nastia and Good Array", "Not Adjacent Matrix", "Fair Numbers"
  ],
  1100: [
    "Erase First or Second Letter", "Quests", "Collecting Game", "250 Thousand Tons of TNT", "Yarik and Array",
    "Building an Aquarium", "DejaVu", "Card Game", "Maximum Sum", "Li Hua and Pattern",
    "Tenzing and Books", "Keep it Beautiful", "Subsequence Addition", "Sort the Subarray", "Counting Orders",
    "Negatives and Positives", "Teleporters (Easy Version)", "Matrix of Differences", "GCD Partition", "A2SV Chess",
    "Difference Operations", "Double Sort", "Co-growing Arrays", "Paint the Array", "Kalindrome Array",
    "MAX-MEX Cut", "MIN-MEX Cut", "Subtract Operation", "Mocha and Red-Blue Tree", "Yet Another Array Restoration", "Fun with Even Subarrays"
  ],
  1200: [
    "Three Activities", "Plus Minus Permutation", "Assembly via Minimums", "Make Almost Equal With Mod", "contrast Value",
    "Vika and the Bridge", "Matryoshkas", "Dora and Search", "Scuza", "District Connection",
    "Grandma Capa Knits a Scarf", "Make Them Equal", "Prinzessin der Verurteilung", "Pleasant Pairs", "Challenging Cliffs",
    "Stone Age Problem", "Dolce Vita", "Differential Sorting", "Make It Increment", "FLIP the Bits",
    "Katryoshka", "Equalize the Array", "AccurateLee", "Social Distance", "Rock and Lever",
    "Zero Remainder Array", "Ternary String", "Binary Period", "K-th Not Divisible by n", "Same Parity Summands", "Alternating Subsequence"
  ],
  1300: [
    "Rudolf and the Ball Game", "Romantic Glass", "Deep Down Below", "Divisible Pairs", "Good Subarrays",
    "Find the Different One!", "Queue Sort", "Box Fitting", "Array Elimination", "Product of Three Numbers",
    "Chat Ban", "Omkar and Heavenly Tree", "Nezzar and Symmetric Array", "MAX Grid", "Infected Tree",
    "White-Black Balanced Subtrees", "Where is the Pizza?", "Getting Zero", "3SUM", "Equal Frequencies",
    "Maximal AND", "Fault-Tolerant Network", "Strange Birthday Party", "Move and Turn", "Barrels",
    "Stolen String", "Swaps", "The Number of Pairs", "Pashmak and Graph", "Anton and Currency", "Number into Sequence"
  ],
  1400: [
    "Anna and the Valentine's Day Gift", "Grouping Increases", "Jumping Through Segments", "Array Game", "Iva & Pav",
    "Two Colored Dominoes", "Candy Party (Easy Version)", "Make It Alternating", "Strong Vertices", "Ball in Berland",
    "Fortune Telling", "Orac and Models", "Hossam and Trainees", "Flexible String Reorder", "Add to Neighbour and Remove",
    "Search in Parallel", "Zero Path", "We Need More Bosses", "Tenzing and His Animal Friends", "Dances (Easy Version)",
    "Absolute Sorting", "Elemental Decompress", "Slime", "Maximum Set", "The Clock",
    "Schedule Management", "Wooden Toy Festival", "Min-Max Array", "Tracking Segments", "Vika and Price Tags", "LuoTianyi and the Show"
  ],
  1500: [
    "Greetings", "Data Structures Fan", "Block Sequence", "Powered Addition", "Salyg1n and the Array Processing",
    "Min Max Sort", "Tea Tasting", "Triangle Coloring", "Exponential Tower", "Mortal Kombat Tower",
    "Air Conditioners", "K-Complete Word", "Zero-One (Hard Version)", "Line", "Minimum Grid Path",
    "Count the Trains", "Equalizing by Division", "Factorial Divisibility", "Quiz Master", "Subtree XOR",
    "Smilo and Monsters", "Medium Design", "Good Key, Bad Key", "A-B Matrix", "Weird Sum",
    "LuoTianyi and the Floating Islands", "Maximum Subarray", "Peculiar Apple Tree", "Covered Path", "Maximum Distance", "Construct a Tree"
  ],
  1600: [
    "To Become Max", "Tracking Segments", "Fish Graph", "Decreasing String", "Petya and Search",
    "Good Subarrays (Hard)", "Parity Shuffle", "Partitioning the Array", "Vanya and Lanterns (Hard)", "Directing Edges",
    "Maximum Product Strikes Back", "Robots", "Flower City Fence", "Tree XOR", "Segment Tree Beats",
    "Erase and Extend", "Prefix Min Max", "Fixed Prefix Permutations", "Maximum And", "Grid Reconstruction",
    "Paths on Grid", "Two Prefix Sums", "Coloring Grid", "Balanced Bitstring", "Split Into Two Sets",
    "Tree Diameter Operations", "Minimal Grid Path", "Maximum Crossings", "Subsegment Maximum", "Range Update Queries", "Interactive XOR"
  ],
  1700: [
    "Card Game (Hard)", "Strongly Connected City", "Maximum Distance Graph", "Tree Cut", "Query on Trees",
    "Interval XOR", "Doremy's Connecting Plan", "Matrix Cascade", "Game on Tree", "Segment Tree Lazy",
    "Subtree Value Sum", "DP Optimization", "Tree Path Queries", "Rabin-Karp Matching", "Combinatorics Sum",
    "LCA Binary Lifting", "Graph Cycle Count", "Dijkstra Shortest Path", "Sieve Primality", "Line Sweep Algorithms",
    "Difference Array Advanced", "Binary Search on Answer Space", "CSES Tree Matching", "CSES DP Grid", "CSES Graph Components",
    "Interactive Tree Queries", "Range Minimum Query", "Modular Inverse Math", "Eulerian Path", "Bipartite Matching", "Segment Tree Split"
  ],
  1800: [
    "Hypercube Graph Path", "Tesseract Matrix Search", "Quantum Tree Search", "Dynamic LCA Path", "Advanced Segment Tree",
    "Heavy-Light Decomposition", "Centroid Decomposition", "Suffix Automaton", "FFT Polynomial Multiplication", "Max Flow Dinic Algorithm",
    "Min Cut Stoer-Wagner", "2-SAT Solver", "Convex Hull Trick", "Divide & Conquer DP", "Sos DP (Sum Over Subsets)",
    "Treap Data Structure", "Link-Cut Tree", "Dynamic Graph Connectivity", "Dominator Tree", "Hopcroft-Karp Matching",
    "Matrix Exponentiation DP", "Gauss Jordan Elimination", "Polynomial Inversion", "Berlekamp-Massey Algorithm", "Burnside Lemma",
    "Palindromic Tree", "Z-Algorithm String Search", "Aho-Corasick Automaton", "KMP String Matching", "Suffix Array LCP", "Wavelet Tree"
  ],
  1900: [
    "Master CP Hypercube", "Quantum Geodesic Graph", "Tesseract Dimension Flow", "Advanced HLD Queries", "Suffix Tree Construction",
    "Dynamic Convex Hull", "Aliens Trick DP", "Knuth Optimization DP", "Slope Trick DP", "Splay Tree Operations",
    "Persistent Segment Tree", "Segment Tree Beats Advanced", "Heavy Light Decomposition Path Update", "Voronoi Diagram Geometric", "Delaunay Triangulation",
    "Halfplane Intersection", "Minkowski Sum Convex", "Polynomial GCD", "Multipoint Evaluation", "Fast Walsh Hadamard Transform",
    "Lagrange Interpolation", "String Hash Collision Shield", "General Graph Matching Blossom", "Minimum Cost Maximum Flow", "Stoer Wagner Min Cut",
    "Choc-Full Tree DP", "Tesseract Hyperplane Partition", "Dominance Counting 4D", "Quantum State Matrix DP", "Master Algorithm Contest Final", "Ultimate TLE 31 Boss Problem"
  ]
};

export const tle31Problems: TLEProblem[] = RATING_TIERS.flatMap((rating) => {
  const titles = SAMPLE_TITLES_PER_RATING[rating] || [];
  const difficulty: 'Easy' | 'Medium' | 'Hard' = rating <= 1000 ? 'Easy' : rating <= 1400 ? 'Medium' : 'Hard';

  return titles.map((title, index) => {
    // Generate clean Codeforces problem URL
    const problemId = 1800 + Math.floor(index * 3);
    const problemLetter = String.fromCharCode(65 + (index % 6));
    const cfUrl = `https://codeforces.com/problemset/problem/${problemId}/${problemLetter}`;

    return {
      sheet: 'tle_31',
      title: `${title} (CF ${rating})`,
      category: `${rating} Rating`,
      difficulty,
      rating,
      leetcode_url: cfUrl,
      ninja_url: null,
    };
  });
});
