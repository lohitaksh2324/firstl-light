export const USER = {
  name: "Arjun Sharma",
  initials: "AS",
  email: "arjun@example.com",
  track: "Machine Learning & AI",
  level: 4,
  xp: 2340,
  xpToNext: 3000,
  globalRank: 1204,
  institution: "IIT Bombay",
  walletAddress: "0x1a2b3c4d5e6f7890abcd",
  credentials: 3,
  simulationsDone: 5,
  streak: 7,
  skillDNA: [
    { skill: "Preprocessing", value: 88, fullName: "Data Preprocessing" },
    { skill: "Feature Eng", value: 74, fullName: "Feature Engineering" },
    { skill: "Model Train", value: 91, fullName: "Model Training" },
    { skill: "Evaluation", value: 69, fullName: "Evaluation Metrics" },
    { skill: "Statistics", value: 77, fullName: "Statistics & Probability" },
    { skill: "Communication", value: 82, fullName: "Data Communication" },
  ],
  topSkills: ["Random Forest", "Feature Engineering", "EDA", "Statistics", "Python"],
};

export type SimStageStatus = "completed" | "active" | "locked";
export type SimStatus = "in-progress" | "available" | "locked" | "completed";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type WorkspaceType = "notebook" | "sde" | "circuit" | "blueprint" | "spreadsheet" | "analytics";

export interface Simulation {
  id: string;
  title: string;
  track: string;
  trackColor: string;
  difficulty: Difficulty;
  durationHours: number;
  xpReward: number;
  activeStudents: number;
  description: string;
  skills: string[];
  stages: { id: number; name: string; status: SimStageStatus }[];
  currentStage: number;
  progress: number;
  dataset: { rows: number | null; cols: number | null; size: string; source: string };
  status: SimStatus;
  scenario: string;
  objectives: { id: number; text: string; done: boolean }[];
  hints: string[];
  workspaceType: WorkspaceType;
  resources: { label: string; url: string }[];
}

export const SIMULATIONS: Simulation[] = [
  {
    id: "sim-001",
    title: "Patient Readmission Predictor",
    track: "Machine Learning",
    trackColor: "#F97316",
    difficulty: "Intermediate",
    durationHours: 2.5,
    xpReward: 450,
    activeStudents: 234,
    description: "Predict 30-day hospital readmissions using real-world EHR data patterns to improve patient outcomes and reduce costs.",
    skills: ["Random Forest", "Feature Engineering", "F1 Score"],
    stages: [
      { id: 1, name: "Explore Dataset", status: "completed" },
      { id: 2, name: "Handle Missing Values", status: "completed" },
      { id: 3, name: "Encode Features", status: "active" },
      { id: 4, name: "Train Random Forest", status: "locked" },
      { id: 5, name: "Evaluate F1 Score", status: "locked" },
    ],
    currentStage: 3,
    progress: 42,
    dataset: { rows: 10000, cols: 50, size: "4.2 MB", source: "Synthetic Hospital EHR" },
    status: "in-progress",
    scenario: "You are a junior ML engineer at HealthAI Corp. Your manager has handed you a de-identified patient readmission dataset with 50 features covering demographics, diagnoses, medications, and prior visits. Your task: build a model that predicts 30-day readmission risk with F1 score ≥ 0.72 on the held-out test set.",
    objectives: [
      { id: 1, text: "Load and profile the dataset (10k rows, 50 features)", done: true },
      { id: 2, text: "Identify and handle missing values (>5% threshold)", done: true },
      { id: 3, text: "One-hot encode categorical features (admission_type, discharge_to)", done: false },
      { id: 4, text: "Train a Random Forest with 5-fold cross-validation", done: false },
      { id: 5, text: "Achieve F1 score ≥ 0.72 on the held-out test set", done: false },
    ],
    hints: [
      "Use df.isnull().sum() / len(df) > 0.05 to identify high-null columns to drop.",
      "pd.get_dummies(df, columns=['admission_type','discharge_to']) — don't forget drop_first=True to avoid multicollinearity.",
      "Try n_estimators=200, max_depth=10, class_weight='balanced' since readmission is a rare event (~12% base rate).",
    ],
    workspaceType: "notebook",
    resources: [
      { label: "Scikit-learn RandomForestClassifier", url: "#" },
      { label: "Pandas get_dummies docs", url: "#" },
      { label: "Handling Imbalanced Classes", url: "#" },
    ],
  },
  {
    id: "sim-002",
    title: "SaaS Startup Financial Model",
    track: "Business & Finance",
    trackColor: "#4ADE80",
    difficulty: "Beginner",
    durationHours: 1.5,
    xpReward: 280,
    activeStudents: 189,
    description: "Build a 3-statement financial model for a SaaS startup and deliver a go/no-go investment recommendation with supporting DCF analysis.",
    skills: ["DCF Analysis", "Revenue Modeling", "P&L", "Unit Economics"],
    stages: [
      { id: 1, name: "Read Case Brief", status: "completed" },
      { id: 2, name: "Build Revenue Model", status: "active" },
      { id: 3, name: "3-Statement Projection", status: "locked" },
      { id: 4, name: "Go/No-Go Memo", status: "locked" },
    ],
    currentStage: 2,
    progress: 25,
    dataset: { rows: null, cols: null, size: "Case Brief PDF", source: "VenturePoint Capital" },
    status: "available",
    scenario: "You've been hired as a junior analyst at VenturePoint Capital. CloudPulse, a B2B SaaS startup, is seeking $2M in seed funding. They have 120 paying customers, $14,400 MRR, 4.2% monthly churn, and $1,800 blended ACV. You have 90 minutes to build their 3-year financial model and deliver a written go/no-go recommendation to the investment committee.",
    objectives: [
      { id: 1, text: "Review the investment memo and extract key SaaS metrics (MRR, churn, CAC, LTV)", done: true },
      { id: 2, text: "Model MRR growth trajectory with cohort-based churn and expansion revenue", done: false },
      { id: 3, text: "Build P&L, Balance Sheet, and Cash Flow projections for Years 1-3", done: false },
      { id: 4, text: "Calculate LTV/CAC ratio and Rule of 40 score", done: false },
      { id: 5, text: "Write a 2-paragraph go/no-go recommendation with key risks", done: false },
    ],
    hints: [
      "ARR = MRR × 12. Start with ARR then model Net Revenue Retention (NRR) including expansions and churns.",
      "Rule of 40: Revenue Growth % + EBITDA Margin % ≥ 40 is the benchmark for healthy SaaS companies.",
      "LTV = ACV / Churn Rate. If LTV/CAC < 3×, the unit economics are likely not venture-scale.",
    ],
    workspaceType: "spreadsheet",
    resources: [
      { label: "SaaS Metrics Primer (A16Z)", url: "#" },
      { label: "Rule of 40 Explained", url: "#" },
      { label: "DCF for Startups", url: "#" },
    ],
  },
  {
    id: "sim-003",
    title: "Residential Circuit Fault Diagnosis",
    track: "Electrical Engineering",
    trackColor: "#22D3EE",
    difficulty: "Intermediate",
    durationHours: 2,
    xpReward: 380,
    activeStudents: 97,
    description: "Diagnose a fault in a residential kitchen circuit schematic, identify the root cause, and propose a code-compliant remediation per NEC 2023.",
    skills: ["Circuit Analysis", "NEC 2023 Code", "Fault Diagnosis", "GFCI Protection"],
    stages: [
      { id: 1, name: "Read Schematic", status: "completed" },
      { id: 2, name: "Identify Fault", status: "completed" },
      { id: 3, name: "Propose Fix", status: "active" },
      { id: 4, name: "NEC Code Check", status: "locked" },
    ],
    currentStage: 3,
    progress: 60,
    dataset: { rows: null, cols: null, size: "Schematic PDF", source: "NEC 2023 Residential" },
    status: "available",
    scenario: "A homeowner reports intermittent power loss in their kitchen. Only outlets near the counter lose power — the microwave and refrigerator on separate circuits work fine. You're the licensed electrician reviewing the residential wiring diagram. Identify the fault component, propose a code-compliant fix, and verify all outlets meet NEC 2023 requirements for the kitchen zone.",
    objectives: [
      { id: 1, text: "Review the kitchen circuit schematic — identify all components and their load ratings", done: true },
      { id: 2, text: "Identify the root cause of the intermittent fault on the counter branch circuit", done: true },
      { id: 3, text: "Click the faulty component in the schematic and mark it for replacement", done: false },
      { id: 4, text: "Verify GFCI protection covers all required receptacles per NEC 210.52(B)", done: false },
    ],
    hints: [
      "Intermittent faults on one branch only — check for a loose neutral on the neutral bar, not the breaker.",
      "NEC 210.52(B) requires two 20A small appliance circuits for kitchen counters. GFCI is required within 6ft of any sink.",
      "A loose neutral causes voltage imbalance and the 'flickering then dead' pattern the homeowner describes.",
    ],
    workspaceType: "circuit",
    resources: [
      { label: "NEC 2023 Article 210", url: "#" },
      { label: "GFCI Requirements by Location", url: "#" },
      { label: "Troubleshooting Loose Neutrals", url: "#" },
    ],
  },
  {
    id: "sim-004",
    title: "Array Algorithms & Hash Maps",
    track: "Software Engineering",
    trackColor: "#A78BFA",
    difficulty: "Beginner",
    durationHours: 1.5,
    xpReward: 260,
    activeStudents: 312,
    description: "Solve classic array and hash map problems used in FAANG interviews, with increasing complexity from O(n²) brute-force to O(n) optimal solutions.",
    skills: ["Hash Maps", "Two Pointers", "Sliding Window", "Big-O Analysis"],
    stages: [
      { id: 1, name: "Two Sum", status: "completed" },
      { id: 2, name: "Contains Duplicate", status: "active" },
      { id: 3, name: "Best Time to Buy", status: "locked" },
      { id: 4, name: "Max Subarray", status: "locked" },
    ],
    currentStage: 2,
    progress: 25,
    dataset: { rows: null, cols: null, size: "4 Problems", source: "TechForge SDE Track" },
    status: "available",
    scenario: "You're preparing for your SWE interview at a FAANG company. Your mentor has assigned four array/hashmap problems of increasing difficulty. Each must be solved with the optimal time complexity — brute-force solutions fail the performance tests. You're working in Python and must pass all hidden test cases.",
    objectives: [
      { id: 1, text: "Solve Two Sum in O(n) using a hash map", done: true },
      { id: 2, text: "Solve Contains Duplicate in O(n) — no sorting allowed", done: false },
      { id: 3, text: "Solve Best Time to Buy & Sell Stock in O(n)", done: false },
      { id: 4, text: "Solve Maximum Subarray using Kadane's Algorithm O(n)", done: false },
    ],
    hints: [
      "For Contains Duplicate: iterate once, check if nums[i] is already in a set before adding it.",
      "For Best Time to Buy: track the minimum price seen so far as you iterate — no need for two loops.",
      "Kadane's Algorithm: max_current = max(nums[i], max_current + nums[i]) at each step.",
    ],
    workspaceType: "sde",
    resources: [
      { label: "Python Set & Dict Complexity", url: "#" },
      { label: "Two Pointer Technique", url: "#" },
      { label: "Kadane's Algorithm Explained", url: "#" },
    ],
  },
  {
    id: "sim-005",
    title: "Investment Portfolio Optimizer",
    track: "Business & Finance",
    trackColor: "#4ADE80",
    difficulty: "Advanced",
    durationHours: 3.5,
    xpReward: 620,
    activeStudents: 45,
    description: "Apply Modern Portfolio Theory to construct an optimal multi-asset allocation that maximizes risk-adjusted returns on a $500K portfolio.",
    skills: ["MPT", "Sharpe Ratio", "Monte Carlo", "Correlation Matrix"],
    stages: [
      { id: 1, name: "Load Market Data", status: "locked" },
      { id: 2, name: "Calculate Returns", status: "locked" },
      { id: 3, name: "Optimize Weights", status: "locked" },
      { id: 4, name: "Monte Carlo Sim", status: "locked" },
    ],
    currentStage: 0,
    progress: 0,
    dataset: { rows: null, cols: null, size: "Market Data CSV", source: "QuantBridge Analytics" },
    status: "locked",
    scenario: "Prerequisite: Complete SaaS Startup Financial Model first.",
    objectives: [],
    hints: [],
    workspaceType: "spreadsheet",
    resources: [],
  },
  {
    id: "sim-006",
    title: "Bridge Deck Structural Analysis",
    track: "Civil Engineering",
    trackColor: "#FB923C",
    difficulty: "Advanced",
    durationHours: 4,
    xpReward: 700,
    activeStudents: 28,
    description: "Analyze a pre-stressed concrete bridge deck for stress concentrations and load capacity. Annotate the structural drawings and identify failure risk zones.",
    skills: ["Structural Analysis", "FEA Fundamentals", "Load Combinations", "Blueprint Reading"],
    stages: [
      { id: 1, name: "Review Drawings", status: "completed" },
      { id: 2, name: "Apply Load Cases", status: "active" },
      { id: 3, name: "Identify Stress Zones", status: "locked" },
      { id: 4, name: "Safety Report", status: "locked" },
    ],
    currentStage: 2,
    progress: 30,
    dataset: { rows: null, cols: null, size: "CAD Drawings", source: "MuniWorks Civil Design" },
    status: "available",
    scenario: "MuniWorks City Planning has flagged a 1987 pre-stressed concrete bridge for a structural review after a routine inspection found micro-cracking near one of the mid-span supports. As the junior structural engineer, you must review the elevation and cross-section drawings, identify the stress concentration zones under AASHTO LRFD load combinations, and annotate the drawings with your findings.",
    objectives: [
      { id: 1, text: "Review bridge elevation and cross-section drawings", done: true },
      { id: 2, text: "Apply dead load (DL) and live load (LL) per AASHTO LRFD", done: false },
      { id: 3, text: "Click and annotate the 3 primary stress concentration zones", done: false },
      { id: 4, text: "Classify each zone: Low / Medium / High failure risk", done: false },
    ],
    hints: [
      "Stress concentrations appear at re-entrant corners, abrupt section changes, and support reactions — look at the pier-deck junction first.",
      "AASHTO LRFD Strength I: 1.25×DL + 1.75×LL is the governing load combination for most highway bridges.",
      "Pre-stressed concrete fails in shear near supports more often than in flexure at mid-span for this span length.",
    ],
    workspaceType: "blueprint",
    resources: [
      { label: "AASHTO LRFD Bridge Design Specs", url: "#" },
      { label: "Pre-Stressed Concrete Failure Modes", url: "#" },
      { label: "Reading Structural Drawings", url: "#" },
    ],
  },
  {
    id: "sim-007",
    title: "Revenue Dashboard Anomaly Detective",
    track: "Data Visualization",
    trackColor: "#F472B6",
    difficulty: "Intermediate",
    durationHours: 2,
    xpReward: 340,
    activeStudents: 156,
    description: "Audit four live business charts for data quality issues — missing values, impossible figures, and duplicate entries — and write a findings report for the engineering team.",
    skills: ["Data Quality", "Anomaly Detection", "Chart Auditing", "Root Cause Analysis"],
    stages: [
      { id: 1, name: "Review Charts", status: "active" },
      { id: 2, name: "Flag Anomalies", status: "locked" },
      { id: 3, name: "Root Cause Analysis", status: "locked" },
      { id: 4, name: "Write Report", status: "locked" },
    ],
    currentStage: 1,
    progress: 10,
    dataset: { rows: 12, cols: 4, size: "Dashboard Export", source: "GrowthLens Analytics" },
    status: "available",
    scenario: "You've just joined the analytics team at GrowthLens, a SaaS company. Your manager has flagged the Monday morning revenue dashboard as 'looking wrong' but can't pinpoint why. Four charts pulled from the data warehouse are shown below. Your task: systematically audit each chart, identify all data quality issues, classify each anomaly type, and write a concise incident report that the data engineering team can act on.",
    objectives: [
      { id: 1, text: "Review all four dashboard charts for data irregularities", done: false },
      { id: 2, text: "Identify and flag at least 2 anomalies with the correct chart labels", done: false },
      { id: 3, text: "Classify each anomaly: Missing Data, Entry Error, Pipeline Failure, or Duplicate", done: false },
      { id: 4, text: "Submit your analysis report with root cause hypotheses", done: false },
    ],
    hints: [
      "Pay attention to scale — an axis that suddenly needs 10× range to fit one data point is a strong signal.",
      "Missing data often shows as zero in aggregated dashboards when the pipeline dropped records rather than returning NULL.",
      "Duplicate records produce exact replicas that look suspiciously smooth — two consecutive identical values should be questioned.",
    ],
    workspaceType: "analytics",
    resources: [
      { label: "Data Quality Dimensions (DAMA)", url: "#" },
      { label: "Common Dashboard Anti-Patterns", url: "#" },
      { label: "Writing a Data Incident Report", url: "#" },
    ],
  },
];

export const CREDENTIALS = [
  {
    id: "cred-001",
    simulation: "Data Preprocessing Fundamentals",
    track: "Machine Learning",
    trackColor: "#F97316",
    dateEarned: "Mar 15, 2024",
    score: 94,
    txHash: "0xabc123def456789012345678901234567890abcd",
    skills: [
      { name: "Null Handling", score: 96 },
      { name: "Outlier Detection", score: 91 },
      { name: "Data Type Casting", score: 94 },
    ],
  },
  {
    id: "cred-002",
    simulation: "Exploratory Data Analysis",
    track: "Machine Learning",
    trackColor: "#F97316",
    dateEarned: "Mar 28, 2024",
    score: 88,
    txHash: "0xdef789abc012345678901234567890abcdef0123",
    skills: [
      { name: "Statistical Summary", score: 90 },
      { name: "Distribution Analysis", score: 85 },
      { name: "Correlation Analysis", score: 89 },
    ],
  },
  {
    id: "cred-003",
    simulation: "Feature Engineering Expert",
    track: "Machine Learning",
    trackColor: "#F97316",
    dateEarned: "Apr 10, 2024",
    score: 91,
    txHash: "0x012345abcdef6789012345678901234567890abc",
    skills: [
      { name: "One-Hot Encoding", score: 93 },
      { name: "Feature Scaling", score: 88 },
      { name: "Feature Selection", score: 92 },
    ],
  },
];

export const LEADERBOARD = [
  { rank: 1, name: "Priya Nair", initials: "PN", avatarColor: "#8B5CF6", track: "ML", xp: 8920, credentials: 12, change: 2, isCurrentUser: false },
  { rank: 2, name: "Jonas Weber", initials: "JW", avatarColor: "#3B82F6", track: "SWE", xp: 8440, credentials: 11, change: -1, isCurrentUser: false },
  { rank: 3, name: "Amara Osei", initials: "AO", avatarColor: "#10B981", track: "Business", xp: 7890, credentials: 9, change: 3, isCurrentUser: false },
  { rank: 4, name: "Liu Wei", initials: "LW", avatarColor: "#F59E0B", track: "ML", xp: 6230, credentials: 8, change: 0, isCurrentUser: false },
  { rank: 5, name: "Sofia Rossi", initials: "SR", avatarColor: "#EC4899", track: "Electrical", xp: 5780, credentials: 7, change: -2, isCurrentUser: false },
  { rank: 6, name: "Marcus Chen", initials: "MC", avatarColor: "#06B6D4", track: "SWE", xp: 5210, credentials: 6, change: 1, isCurrentUser: false },
  { rank: 7, name: "Aisha Patel", initials: "AP", avatarColor: "#84CC16", track: "ML", xp: 4890, credentials: 6, change: 4, isCurrentUser: false },
  { rank: 8, name: "Diego Morales", initials: "DM", avatarColor: "#F97316", track: "Civil", xp: 4560, credentials: 5, change: -1, isCurrentUser: false },
  { rank: 1204, name: "Arjun Sharma", initials: "AS", avatarColor: "#F97316", track: "ML", xp: 2340, credentials: 3, change: 15, isCurrentUser: true },
];

export const ACTIVITY_LOG = [
  { type: "credential", text: "Credential Minted: Feature Engineering Expert", date: "Apr 10, 2024", xp: 150 },
  { type: "simulation_complete", text: "Simulation Completed: Exploratory Data Analysis", date: "Mar 28, 2024", xp: 280 },
  { type: "simulation_start", text: "Simulation Started: Patient Readmission Predictor", date: "Apr 12, 2024", xp: null },
  { type: "level_up", text: "Level Up! Reached Level 4", date: "Apr 14, 2024", xp: null },
  { type: "simulation_complete", text: "Simulation Completed: Data Preprocessing Fundamentals", date: "Mar 15, 2024", xp: 200 },
  { type: "credential", text: "Credential Minted: EDA Practitioner", date: "Mar 28, 2024", xp: 130 },
];

export const TRACK_SKILL_QUESTIONS: Record<string, { question: string; options: string[] }[]> = {
  ml: [
    { question: "How comfortable are you with Python (NumPy / Pandas)?", options: ["Never used Python", "Can run basic scripts", "Comfortable with Pandas & NumPy", "Build production ML pipelines"] },
    { question: "Can you explain train/test split and why it prevents data leakage?", options: ["Not sure what that means", "Heard of it but can't explain it", "Can explain and implement it", "Can explain leakage edge cases too"] },
    { question: "Have you built a classification model from scratch before?", options: ["No prior experience", "Followed a tutorial once", "Built one independently", "Built and deployed multiple models"] },
    { question: "Do you understand precision, recall, and F1 score?", options: ["Not familiar with these", "Know the definitions", "Can calculate and interpret them", "Know when to optimize each"] },
    { question: "How familiar are you with feature engineering techniques?", options: ["What is feature engineering?", "I know about one-hot encoding", "Scaling, encoding, selection", "Advanced methods like target encoding, embeddings"] },
  ],
  swe: [
    { question: "How comfortable are you with data structures (arrays, trees, graphs)?", options: ["Just learning arrays", "Comfortable with arrays and hashmaps", "Know trees and graphs too", "Can implement from scratch"] },
    { question: "Can you analyze time and space complexity (Big O)?", options: ["Not yet", "Can identify O(n) and O(1)", "Can derive complexity for most code", "Can prove tighter bounds"] },
    { question: "Have you designed or consumed a REST API?", options: ["No experience", "Used APIs with Postman", "Built simple CRUD APIs", "Designed versioned, authed production APIs"] },
    { question: "Do you write automated tests for your code?", options: ["No — I test manually", "Sometimes write unit tests", "Write unit + integration tests", "Practice TDD consistently"] },
    { question: "How comfortable are you with system design?", options: ["Never studied it", "Know basic client-server", "Can design small distributed systems", "Can design scaled systems like Twitter"] },
  ],
  ee: [
    { question: "Can you analyze a resistive circuit using Ohm's Law and KVL/KCL?", options: ["Still learning basic concepts", "Can solve single-loop circuits", "Handle multi-loop circuits with confidence", "Analyze complex networks with Thevenin/Norton"] },
    { question: "Do you understand the difference between AC and DC circuits?", options: ["Not yet", "Know the basics", "Understand phasors and impedance", "Can do full AC power analysis"] },
    { question: "How comfortable are you reading electrical schematics?", options: ["Can't read them yet", "Can identify basic components", "Read residential/commercial schematics", "Read IEC/ANSI industrial schematics"] },
    { question: "Are you familiar with the National Electrical Code (NEC)?", options: ["Never heard of NEC", "Know it exists", "Know the key articles for residential work", "Apply NEC daily in the field"] },
    { question: "Have you worked with PLCs or embedded systems?", options: ["No embedded experience", "Wrote basic Arduino sketches", "Programmed PLCs in ladder logic", "Designed industrial control systems"] },
  ],
  ce: [
    { question: "Can you read and interpret structural engineering drawings?", options: ["Not yet familiar", "Can read basic plans", "Comfortable with elevation and section views", "Read full construction drawing sets"] },
    { question: "Do you understand static equilibrium and load distribution?", options: ["Just starting statics", "Understand free body diagrams", "Can solve beam and truss problems", "Apply to complex indeterminate structures"] },
    { question: "Are you familiar with CAD tools (AutoCAD, Revit, Civil 3D)?", options: ["No CAD experience", "Used a CAD tool briefly", "Proficient in at least one tool", "Produce professional-grade drawings"] },
    { question: "Do you know the properties of structural materials (steel, concrete, timber)?", options: ["Not yet", "Know basic differences", "Understand strength grades and codes", "Apply material properties in design calculations"] },
    { question: "Have you performed any structural or geotechnical analysis?", options: ["No analysis experience", "Done textbook hand calculations", "Used software (SAP2000, ETABS)", "Completed a full structural design project"] },
  ],
  biz: [
    { question: "Can you build a revenue model in a spreadsheet from scratch?", options: ["No modeling experience", "Can enter formulas in Excel", "Built a basic revenue model", "Built full 3-statement financial models"] },
    { question: "Do you understand P&L, Balance Sheet, and Cash Flow statements?", options: ["Not familiar with financial statements", "Know what they are at a high level", "Can read and interpret all three", "Can build them from scratch with proper links"] },
    { question: "Can you interpret key SaaS metrics (ARR, MRR, churn, LTV/CAC)?", options: ["Not familiar with SaaS metrics", "Know ARR and MRR", "Calculate and benchmark them", "Use them for strategic decision-making"] },
    { question: "Have you done market sizing or competitive analysis?", options: ["No prior experience", "Done basic research", "Done TAM/SAM/SOM analysis", "Produced investment-grade market research"] },
    { question: "Are you comfortable making data-driven business recommendations?", options: ["Not yet confident", "Can present basic findings", "Structure recommendations with data", "Present to senior stakeholders confidently"] },
  ],
  data: [
    { question: "How comfortable are you writing SQL queries?", options: ["Never used SQL", "Can do basic SELECT/WHERE", "Comfortable with JOINs and aggregations", "Write complex window functions and CTEs"] },
    { question: "Can you identify outliers and anomalies in a dataset?", options: ["Not sure how to approach it", "Use basic summary stats (min/max)", "Use IQR, Z-score, and visual inspection", "Apply statistical tests and ML methods"] },
    { question: "Have you built dashboards using BI tools (Tableau, Power BI, Looker)?", options: ["No BI tool experience", "Explored one tool briefly", "Built production dashboards", "Design and govern dashboards for teams"] },
    { question: "Do you understand A/B testing and statistical significance?", options: ["Not familiar with A/B testing", "Know what an A/B test is", "Can design and analyze an A/B test", "Understand power analysis and sequential testing"] },
    { question: "How familiar are you with data storytelling and chart design principles?", options: ["Never studied this", "Know basic chart types", "Apply chart design best practices", "Coach others on data storytelling"] },
  ],
};

export const TRACK_PATHS: Record<string, { title: string; time: string; diff: string; state: "completed" | "current" | "locked" | "final" }[]> = {
  ml: [
    { title: "Data Preprocessing Fundamentals", time: "45 min", diff: "Beginner", state: "completed" },
    { title: "Patient Readmission Predictor", time: "2.5 hrs", diff: "Intermediate", state: "current" },
    { title: "Feature Engineering Expert", time: "2 hrs", diff: "Intermediate", state: "locked" },
    { title: "Neural Network from Scratch", time: "4 hrs", diff: "Advanced", state: "locked" },
    { title: "ML Practitioner Credential", time: "Final Milestone", diff: "", state: "final" },
  ],
  swe: [
    { title: "Array Algorithms & Hash Maps", time: "1.5 hrs", diff: "Beginner", state: "current" },
    { title: "Binary Trees & Recursion", time: "2 hrs", diff: "Intermediate", state: "locked" },
    { title: "System Design: URL Shortener", time: "3 hrs", diff: "Intermediate", state: "locked" },
    { title: "Distributed Systems Fundamentals", time: "4 hrs", diff: "Advanced", state: "locked" },
    { title: "SWE Practitioner Credential", time: "Final Milestone", diff: "", state: "final" },
  ],
  ee: [
    { title: "DC Circuit Analysis Basics", time: "1 hr", diff: "Beginner", state: "current" },
    { title: "Residential Circuit Fault Diagnosis", time: "2 hrs", diff: "Intermediate", state: "locked" },
    { title: "AC Power & Power Factor Correction", time: "2.5 hrs", diff: "Intermediate", state: "locked" },
    { title: "PLC Ladder Logic: Motor Control", time: "3 hrs", diff: "Advanced", state: "locked" },
    { title: "Electrical Engineer Credential", time: "Final Milestone", diff: "", state: "final" },
  ],
  ce: [
    { title: "Reading Structural Drawings", time: "45 min", diff: "Beginner", state: "current" },
    { title: "Bridge Deck Structural Analysis", time: "4 hrs", diff: "Advanced", state: "locked" },
    { title: "Retaining Wall Design", time: "3 hrs", diff: "Intermediate", state: "locked" },
    { title: "Site Grading & Drainage Plan", time: "2.5 hrs", diff: "Intermediate", state: "locked" },
    { title: "Civil Engineer Credential", time: "Final Milestone", diff: "", state: "final" },
  ],
  biz: [
    { title: "SaaS Startup Financial Model", time: "1.5 hrs", diff: "Beginner", state: "current" },
    { title: "M&A Valuation: DCF & Comparables", time: "3 hrs", diff: "Intermediate", state: "locked" },
    { title: "Investment Portfolio Optimizer", time: "3.5 hrs", diff: "Advanced", state: "locked" },
    { title: "PE Deal Memo: LBO Analysis", time: "4 hrs", diff: "Advanced", state: "locked" },
    { title: "Finance Analyst Credential", time: "Final Milestone", diff: "", state: "final" },
  ],
  data: [
    { title: "Revenue Dashboard Anomaly Detective", time: "2 hrs", diff: "Intermediate", state: "current" },
    { title: "SQL Analytics: Funnel Analysis", time: "2 hrs", diff: "Intermediate", state: "locked" },
    { title: "Cohort Analysis & Retention", time: "2.5 hrs", diff: "Intermediate", state: "locked" },
    { title: "Executive KPI Dashboard Design", time: "3 hrs", diff: "Advanced", state: "locked" },
    { title: "Data Analyst Credential", time: "Final Milestone", diff: "", state: "final" },
  ],
};
