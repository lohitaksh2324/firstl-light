import { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { PlayCircle, CheckCircle, XCircle, RotateCcw, MessageSquare, ThumbsUp, Loader2, Code, Bug, GitPullRequest, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LumiTutor } from '@/components/shared/LumiTutor';
import { runPython } from '@/lib/pyodide-runner';

type Tab = 'algorithm' | 'bugfix' | 'review' | 'sysdesign';

// ─── DSA Problems ─────────────────────────────────────────────────────────────

interface Problem {
  num: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: React.ReactNode;
  constraints: string[];
  starterCode: string;
  testCases: { input: string; expected: string; harness: string }[];
}

const PROBLEMS: Problem[] = [
  {
    num: 1, title: '1. Two Sum', difficulty: 'Easy',
    description: <>Given an array of integers <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">nums</code> and an integer <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">target</code>, return the indices of the two numbers that add up to <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">target</code>.</>,
    constraints: ['Exactly one solution exists', 'O(n) time — no nested loops', 'Elements can be negative'],
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Return indices [i, j] such that nums[i] + nums[j] == target.
    Hint: use a dict mapping value → index.
    """
    # Your solution here
    pass
`,
    testCases: [
      { input: 'two_sum([2,7,11,15], 9)', expected: '[0,1]', harness: `result = two_sum([2,7,11,15], 9)\nprint("PASS" if sorted(result) == [0,1] else f"FAIL: got {result}")` },
      { input: 'two_sum([3,2,4], 6)', expected: '[1,2]', harness: `result = two_sum([3,2,4], 6)\nprint("PASS" if sorted(result) == [1,2] else f"FAIL: got {result}")` },
      { input: 'two_sum([3,3], 6)', expected: '[0,1]', harness: `result = two_sum([3,3], 6)\nprint("PASS" if sorted(result) == [0,1] else f"FAIL: got {result}")` },
    ],
  },
  {
    num: 2, title: '217. Contains Duplicate', difficulty: 'Easy',
    description: <>Given an integer array <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">nums</code>, return <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">True</code> if any value appears at least twice, <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">False</code> if every element is distinct.</>,
    constraints: ['O(n) time — no sorting', 'O(n) space OK', 'Use a set for O(1) lookup'],
    starterCode: `def contains_duplicate(nums: list[int]) -> bool:
    """
    Return True if any value appears at least twice.
    Constraint: O(n) time — no sorting allowed.
    """
    # Your solution here
    pass
`,
    testCases: [
      { input: 'contains_duplicate([1,2,3,1])', expected: 'True', harness: `result = contains_duplicate([1,2,3,1])\nprint("PASS" if result == True else f"FAIL: got {result}")` },
      { input: 'contains_duplicate([1,2,3,4])', expected: 'False', harness: `result = contains_duplicate([1,2,3,4])\nprint("PASS" if result == False else f"FAIL: got {result}")` },
      { input: 'contains_duplicate([1,1,1,3,3,4,3,2,4,2])', expected: 'True', harness: `result = contains_duplicate([1,1,1,3,3,4,3,2,4,2])\nprint("PASS" if result == True else f"FAIL: got {result}")` },
    ],
  },
  {
    num: 3, title: '121. Best Time to Buy & Sell Stock', difficulty: 'Easy',
    description: <>Given an array <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">prices</code> where <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">prices[i]</code> is the price on day <em>i</em>, return the max profit. You must buy before you sell.</>,
    constraints: ['Single pass O(n)', 'If no profit possible, return 0', 'Track min price as you scan'],
    starterCode: `def max_profit(prices: list[int]) -> int:
    """
    Find the maximum profit from one buy-sell transaction.
    You must buy before you sell. Return 0 if no profit possible.
    Hint: track the minimum price seen so far.
    """
    # Your solution here
    pass
`,
    testCases: [
      { input: 'max_profit([7,1,5,3,6,4])', expected: '5', harness: `result = max_profit([7,1,5,3,6,4])\nprint("PASS" if result == 5 else f"FAIL: got {result}")` },
      { input: 'max_profit([7,6,4,3,1])', expected: '0', harness: `result = max_profit([7,6,4,3,1])\nprint("PASS" if result == 0 else f"FAIL: got {result}")` },
      { input: 'max_profit([1,2])', expected: '1', harness: `result = max_profit([1,2])\nprint("PASS" if result == 1 else f"FAIL: got {result}")` },
    ],
  },
  {
    num: 4, title: '53. Maximum Subarray', difficulty: 'Medium',
    description: <>Given an integer array <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">nums</code>, find the subarray with the largest sum and return its sum. <em>Kadane's Algorithm</em> is the intended approach.</>,
    constraints: ['O(n) time — Kadane\'s', 'Must contain at least one element', 'Subarray must be contiguous'],
    starterCode: `def max_sub_array(nums: list[int]) -> int:
    """
    Find the contiguous subarray with the largest sum.
    Hint: Kadane's algorithm — track current and global max.
    """
    # Your solution here
    pass
`,
    testCases: [
      { input: 'max_sub_array([-2,1,-3,4,-1,2,1,-5,4])', expected: '6', harness: `result = max_sub_array([-2,1,-3,4,-1,2,1,-5,4])\nprint("PASS" if result == 6 else f"FAIL: got {result}")` },
      { input: 'max_sub_array([1])', expected: '1', harness: `result = max_sub_array([1])\nprint("PASS" if result == 1 else f"FAIL: got {result}")` },
      { input: 'max_sub_array([5,4,-1,7,8])', expected: '23', harness: `result = max_sub_array([5,4,-1,7,8])\nprint("PASS" if result == 23 else f"FAIL: got {result}")` },
    ],
  },
];

type TestState = 'idle' | 'running' | 'pass' | 'fail';

interface TestResult {
  state: TestState;
  output?: string;
}

function AlgorithmTab() {
  const [problemIdx, setProblemIdx] = useState(0);
  const [codes, setCodes] = useState<Record<number, string>>(
    Object.fromEntries(PROBLEMS.map(p => [p.num, p.starterCode]))
  );
  const [testResults, setTestResults] = useState<Record<number, TestResult[]>>({});
  const [running, setRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  const problem = PROBLEMS[problemIdx];
  const code = codes[problem.num] ?? problem.starterCode;
  const results = testResults[problem.num] ?? [];

  const runTests = useCallback(async () => {
    if (running) return;
    setRunning(true);
    if (pyStatus === 'idle') setPyStatus('loading');

    const newResults: TestResult[] = problem.testCases.map(() => ({ state: 'running' as TestState }));
    setTestResults(prev => ({ ...prev, [problem.num]: newResults }));

    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i];
      const { output, error } = await runPython(code, tc.harness);
      const combined = (output + (error ?? '')).trim();
      const passed = combined.startsWith('PASS');
      newResults[i] = { state: passed ? 'pass' : 'fail', output: combined };
      setTestResults(prev => ({ ...prev, [problem.num]: [...newResults] }));
    }

    setPyStatus('ready');
    setRunning(false);
  }, [running, problem, code, pyStatus]);

  const resetCode = () => {
    setCodes(prev => ({ ...prev, [problem.num]: problem.starterCode }));
    setTestResults(prev => ({ ...prev, [problem.num]: [] }));
  };

  const allPass = results.length > 0 && results.every(r => r.state === 'pass');
  const passCount = results.filter(r => r.state === 'pass').length;
  const solved = PROBLEMS.filter((_, i) => {
    const res = testResults[PROBLEMS[i].num] ?? [];
    return res.length > 0 && res.every(r => r.state === 'pass');
  });

  return (
    <div className="flex flex-col h-full">
      {/* Problem selector */}
      <div className="flex items-center gap-1 px-3 pt-3 pb-0 bg-[#0D1117] border-b border-[#1E2530]">
        {PROBLEMS.map((p, i) => {
          const res = testResults[p.num] ?? [];
          const isSolved = res.length > 0 && res.every(r => r.state === 'pass');
          return (
            <button key={p.num} onClick={() => setProblemIdx(i)}
              className={`px-3 py-2 text-[11px] font-mono-data rounded-t transition-colors flex items-center gap-1.5 border-b-2 -mb-px ${
                i === problemIdx ? 'border-[#A78BFA] text-white bg-[#111318]' : 'border-transparent text-[#64748B] hover:text-white'
              }`}>
              {isSolved && <CheckCircle className="w-3 h-3 text-[#4ADE80]" />}
              <span>{i + 1}. {p.title.split('.').pop()?.trim()}</span>
            </button>
          );
        })}
        {solved.length > 0 && (
          <div className="ml-auto text-[10px] font-mono-data text-[#4ADE80] px-2">{solved.length}/{PROBLEMS.length} solved</div>
        )}
      </div>

      {/* Problem description */}
      <div className="p-4 border-b border-[#1E2530] bg-[#0D1117] space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-mono-data px-2 py-0.5 rounded border ${
            problem.difficulty === 'Easy' ? 'bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/30' :
            problem.difficulty === 'Medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30' :
            'bg-[#F87171]/20 text-[#F87171] border-[#F87171]/30'
          }`}>{problem.difficulty}</span>
        </div>
        <h2 className="font-display font-bold text-white text-lg">{problem.title}</h2>
        <p className="text-[#94A3B8] text-sm leading-relaxed">{problem.description}</p>
        <div className="flex gap-3 flex-wrap text-xs text-[#64748B]">
          {problem.constraints.map((c, i) => <span key={i}>• {c}</span>)}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor height="100%" theme="vs-dark" language="python" value={code}
          onChange={v => setCodes(prev => ({ ...prev, [problem.num]: v ?? '' }))}
          options={{ minimap:{enabled:false}, lineNumbers:'on', fontSize:13, fontFamily:"'JetBrains Mono',monospace", scrollBeyondLastLine:false }} />
      </div>

      {/* Test panel */}
      <div className="border-t border-[#1E2530] bg-[#111318] p-4 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-display font-semibold text-[#64748B] uppercase tracking-widest">Test Cases</span>
          <div className="flex gap-2 items-center">
            {pyStatus === 'loading' && (
              <span className="text-[10px] text-[#F59E0B] flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Loading Python…</span>
            )}
            <button onClick={resetCode} className="text-xs text-[#64748B] hover:text-white flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <button onClick={runTests} disabled={running}
              className="bg-[#A78BFA] hover:bg-[#A78BFA]/90 disabled:opacity-50 text-white text-xs px-4 py-1.5 rounded font-display font-semibold flex items-center gap-1.5 transition-colors">
              {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />}
              {running ? 'Running…' : 'Run Tests'}
            </button>
          </div>
        </div>

        {problem.testCases.map((tc, i) => {
          const r = results[i];
          return (
            <div key={i} className={`flex items-center gap-3 p-2 rounded-lg text-xs border transition-all ${
              !r || r.state === 'idle' ? 'bg-[#0A0C0F] border-[#1E2530]' :
              r.state === 'running' ? 'bg-[rgba(34,211,238,0.04)] border-[#22D3EE]/30' :
              r.state === 'pass' ? 'bg-[rgba(74,222,128,0.04)] border-[#4ADE80]/30' :
              'bg-[rgba(248,113,113,0.05)] border-[#F87171]/30'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                !r || r.state === 'idle' ? 'bg-[#1E2530] text-[#64748B]' :
                r.state === 'running' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' :
                r.state === 'pass' ? 'bg-[#4ADE80]/20 text-[#4ADE80]' :
                'bg-[#F87171]/20 text-[#F87171]'
              }`}>
                {r?.state === 'running' ? <Loader2 className="w-3 h-3 animate-spin" /> :
                 r?.state === 'pass' ? <CheckCircle className="w-3 h-3" /> :
                 r?.state === 'fail' ? <XCircle className="w-3 h-3" /> :
                 <span className="text-[10px]">{i+1}</span>}
              </div>
              <span className="font-mono-data text-[#94A3B8] flex-1 truncate">{tc.input}</span>
              {r?.state === 'fail' && r.output && (
                <span className="font-mono-data text-[#F87171] text-[10px] max-w-[120px] truncate">{r.output.replace('FAIL: ', '')}</span>
              )}
              <span className={`font-mono-data font-bold ${
                r?.state === 'pass' ? 'text-[#4ADE80]' :
                r?.state === 'fail' ? 'text-[#64748B]' : 'text-[#64748B]'}`}>
                → {tc.expected}
              </span>
            </div>
          );
        })}

        <AnimatePresence>
          {allPass && (
            <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
              className="text-center text-xs text-[#4ADE80] font-display font-semibold pt-1">
              ✓ All {problem.testCases.length} tests passed · Problem {problemIdx + 1}/{PROBLEMS.length} complete!
              {problemIdx < PROBLEMS.length - 1 && (
                <button onClick={() => setProblemIdx(i => i + 1)} className="ml-3 text-[#A78BFA] underline">Next problem →</button>
              )}
            </motion.div>
          )}
          {!allPass && results.some(r => r.state === 'fail') && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}}
              className="text-center text-xs text-[#F87171] pt-1">
              {passCount}/{problem.testCases.length} tests passing — keep debugging!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Bug Fix Tab ───────────────────────────────────────────────────────────────
const BUG_CODE = `def calculate_discount(price: float, discount_pct: float) -> float:
    """Apply a discount percentage to a price and return the discounted price."""
    # Example: calculate_discount(100, 10) should return 90.00
    discounted = price + (price * discount_pct / 100)
    return round(discounted, 2)


def apply_coupon(cart_total: float, coupon_code: str) -> float:
    """Apply a coupon to the cart. Returns discounted total."""
    COUPONS = {"SAVE10": 10, "SAVE20": 20, "FIRST50": 50}
    if coupon_code not in COUPONS:
        raise ValueError(f"Invalid coupon: {coupon_code}")
    return calculate_discount(cart_total, COUPONS[coupon_code])
`;

const BUG_HARNESS = `
results = []
try:
    r = calculate_discount(100, 10)
    results.append("PASS" if abs(r - 90.0) < 0.01 else f"FAIL: got {r}")
except Exception as e:
    results.append(f"ERROR: {e}")

try:
    r = calculate_discount(200, 20)
    results.append("PASS" if abs(r - 160.0) < 0.01 else f"FAIL: got {r}")
except Exception as e:
    results.append(f"ERROR: {e}")

try:
    r = apply_coupon(50.0, "SAVE10")
    results.append("PASS" if abs(r - 45.0) < 0.01 else f"FAIL: got {r}")
except Exception as e:
    results.append(f"ERROR: {e}")

for r in results:
    print(r)
`;

function BugFixTab() {
  const [code, setCode] = useState(BUG_CODE);
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const tests = [
    { desc: 'calculate_discount(100, 10)', expected: '90.0' },
    { desc: 'calculate_discount(200, 20)', expected: '160.0' },
    { desc: 'apply_coupon(50.0, "SAVE10")', expected: '45.0' },
  ];

  const runTests = async () => {
    if (running) return;
    setRunning(true);
    setResults(tests.map(() => ({ state: 'running' })));
    const { output, error } = await runPython(code, BUG_HARNESS);
    const lines = (output + (error ?? '')).trim().split('\n');
    setResults(lines.map(line => ({
      state: line.startsWith('PASS') ? 'pass' : 'fail',
      output: line
    })));
    setRunning(false);
  };

  const [showHint, setShowHint] = useState(false);
  const allPass = results.length > 0 && results.every(r => r.state === 'pass');

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#1E2530] bg-[#0D1117] space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#F87171]/20 text-[#F87171] text-[10px] font-mono-data px-2 py-0.5 rounded border border-[#F87171]/30">Bug Report #FL-4821</span>
          <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-[10px] font-mono-data px-2 py-0.5 rounded border border-[#F59E0B]/30">CRITICAL</span>
        </div>
        <h2 className="font-display font-bold text-white text-lg">E-commerce Discount Calculation Error</h2>
        <div className="bg-[#0A0C0F] border border-[#F87171]/30 rounded-lg p-3 text-xs text-[#94A3B8] leading-relaxed">
          <strong className="text-[#F87171]">User report:</strong> "I applied the SAVE10 coupon to my $100 cart but was charged $110 instead of $90. The price goes UP instead of DOWN."
        </div>
        <button onClick={() => setShowHint(!showHint)} className="text-xs text-[#F97316] hover:underline">{showHint ? '▲ Hide hint' : '▼ Show hint'}</button>
        {showHint && (
          <div className="bg-[rgba(249,115,22,0.06)] border border-[#F97316]/20 rounded-lg p-3 text-xs text-[#F97316]">
            💡 Line 4 — the arithmetic operator is wrong. Applying 10% discount should REDUCE the price, not increase it.
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0">
        <Editor height="100%" theme="vs-dark" language="python" value={code} onChange={v => setCode(v ?? '')}
          options={{ minimap:{enabled:false}, lineNumbers:'on', fontSize:13, fontFamily:"'JetBrains Mono',monospace", scrollBeyondLastLine:false }} />
      </div>
      <div className="border-t border-[#1E2530] bg-[#111318] p-4 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-display font-semibold text-[#64748B] uppercase tracking-widest">Regression Tests</span>
          <button onClick={runTests} disabled={running}
            className="bg-[#F87171] hover:bg-[#F87171]/90 disabled:opacity-50 text-white text-xs px-4 py-1.5 rounded font-display font-semibold flex items-center gap-1.5 transition-colors">
            {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />}
            {running ? 'Running…' : 'Run Tests'}
          </button>
        </div>
        {tests.map((t, i) => {
          const r = results[i];
          return (
            <div key={i} className={`flex items-center gap-3 p-2 rounded-lg text-xs border ${
              !r ? 'bg-[#0A0C0F] border-[#1E2530]' :
              r.state === 'running' ? 'bg-[rgba(34,211,238,0.04)] border-[#22D3EE]/30' :
              r.state === 'pass' ? 'bg-[rgba(74,222,128,0.04)] border-[#4ADE80]/30' :
              'bg-[rgba(248,113,113,0.05)] border-[#F87171]/30'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                !r ? 'bg-[#1E2530] text-[#64748B]' :
                r.state === 'running' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' :
                r.state === 'pass' ? 'bg-[#4ADE80]/20 text-[#4ADE80]' :
                'bg-[#F87171]/20 text-[#F87171]'}`}>
                {r?.state === 'running' ? <Loader2 className="w-3 h-3 animate-spin" /> :
                 r?.state === 'pass' ? <CheckCircle className="w-3 h-3" /> :
                 r?.state === 'fail' ? <XCircle className="w-3 h-3" /> :
                 <span className="text-[10px]">{i+1}</span>}
              </div>
              <span className="font-mono-data text-[#94A3B8] flex-1">{t.desc}</span>
              {r?.state === 'fail' && <span className="font-mono-data text-[#F87171]">{r.output?.replace('FAIL:', 'got')}</span>}
              <span className={`font-mono-data font-bold ${r?.state === 'pass' ? 'text-[#4ADE80]' : 'text-[#64748B]'}`}>→ {t.expected}</span>
            </div>
          );
        })}
        {allPass && <div className="text-center text-xs text-[#4ADE80] font-display font-semibold pt-1">✓ Bug fixed! All regression tests passing · +80 XP</div>}
        {!allPass && results.some(r => r.state === 'fail') && <div className="text-center text-xs text-[#F87171] pt-1">Still failing — look at the arithmetic operator in calculate_discount().</div>}
      </div>
    </div>
  );
}

// ── Code Review Tab ───────────────────────────────────────────────────────────
type ReviewTag = 'Security' | 'Missing validation' | 'Error handling' | 'Performance' | 'Missing test' | 'Style';
interface ReviewComment { line: number; tag: ReviewTag; text: string }

const PR_LINES = [
  { n: 1,  code: "@app.route('/api/users/<user_id>/profile')", type: 'normal' },
  { n: 2,  code: "def get_user_profile(user_id):",            type: 'add'    },
  { n: 3,  code: "    db = get_db_connection()",              type: 'add'    },
  { n: 4,  code: '    query = f"SELECT * FROM users WHERE id = {user_id}"', type: 'add', issue: true },
  { n: 5,  code: "    cursor = db.execute(query)",            type: 'add'    },
  { n: 6,  code: "    result = cursor.fetchone()",            type: 'add'    },
  { n: 7,  code: "    profile = dict(result)",                type: 'add', issue: true },
  { n: 8,  code: "    return jsonify(profile)",               type: 'add'    },
  { n: 9,  code: "",                                          type: 'normal' },
  { n: 10, code: "# Tests: None added",                      type: 'add', issue: true },
];
const EXPECTED_ISSUES = [4, 7, 10];

function CodeReviewTab() {
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [activeComment, setActiveComment] = useState<number | null>(null);
  const [tag, setTag] = useState<ReviewTag>('Security');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const addComment = () => {
    if (activeComment === null) return;
    setComments(prev => prev.filter(c => c.line !== activeComment).concat({ line: activeComment, tag, text }));
    setActiveComment(null); setText('');
  };

  const commentedLines = new Set(comments.map(c => c.line));
  const correctFinds = EXPECTED_ISSUES.filter(l => commentedLines.has(l)).length;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#1E2530] bg-[#0D1117] space-y-1">
        <div className="flex items-center gap-2">
          <span className="bg-[#A78BFA]/20 text-[#A78BFA] text-[10px] font-mono-data px-2 py-0.5 rounded border border-[#A78BFA]/30">PR #47 · Open</span>
          <span className="text-[10px] text-[#64748B]">by new_engineer · 2 files changed, +28 lines</span>
        </div>
        <h2 className="font-display font-bold text-white">Add user profile API endpoint</h2>
        <p className="text-xs text-[#64748B]">Click any line to leave a review comment. There are <strong className="text-[#F97316]">3 issues</strong> to find.</p>
      </div>
      <div className="flex-1 overflow-y-auto bg-[#0A0C0F]">
        <table className="w-full text-xs font-mono-data border-collapse">
          <tbody>
            {PR_LINES.map(line => {
              const hasComment = commentedLines.has(line.n);
              const isActive = activeComment === line.n;
              const comment = comments.find(c => c.line === line.n);
              return (
                <>
                  <tr key={line.n} onClick={() => { if (line.code) setActiveComment(isActive ? null : line.n); }}
                    className={`group border-b border-[#111318] transition-colors ${line.code ? 'cursor-pointer' : ''} ${
                      isActive ? 'bg-[rgba(249,115,22,0.08)]' : hasComment ? 'bg-[rgba(167,139,250,0.05)]' :
                      line.type === 'add' ? 'bg-[rgba(74,222,128,0.03)]' : 'bg-transparent'} hover:bg-[rgba(255,255,255,0.03)]`}>
                    <td className="w-10 text-right pr-3 py-1.5 text-[#1E2530] group-hover:text-[#64748B] select-none">{line.n}</td>
                    <td className={`w-4 px-1 py-1.5 text-center ${line.type === 'add' ? 'text-[#4ADE80]' : 'text-[#64748B]'}`}>{line.type === 'add' ? '+' : ' '}</td>
                    <td className={`py-1.5 pl-2 pr-4 ${line.type === 'add' ? 'text-white' : 'text-[#64748B]'}`}>
                      <span dangerouslySetInnerHTML={{ __html: line.code.replace(/(\{user_id\}|dict\(result\)|# Tests: None added)/g,
                        '<span style="background:rgba(248,113,113,0.2);color:#F87171;border-radius:3px;padding:0 2px">$1</span>') }} />
                    </td>
                    <td className="py-1.5 pr-3 text-right">
                      {hasComment
                        ? <span className="inline-flex items-center gap-1 bg-[#A78BFA]/20 text-[#A78BFA] px-2 py-0.5 rounded text-[9px]"><MessageSquare className="w-2.5 h-2.5" />{comment?.tag}</span>
                        : line.code && !isActive && <span className="opacity-0 group-hover:opacity-60 text-[#64748B] text-[9px]">+ comment</span>}
                    </td>
                  </tr>
                  {isActive && (
                    <tr key={`${line.n}-comment`} className="bg-[#111318] border-b border-[#1E2530]">
                      <td colSpan={4} className="px-4 py-3">
                        <div className="flex gap-2 items-start">
                          <select value={tag} onChange={e => setTag(e.target.value as ReviewTag)}
                            className="bg-[#0A0C0F] border border-[#1E2530] rounded px-2 py-1.5 text-xs text-white outline-none focus:border-[#A78BFA]">
                            {(['Security','Missing validation','Error handling','Performance','Missing test','Style'] as ReviewTag[]).map(t => <option key={t}>{t}</option>)}
                          </select>
                          <input value={text} onChange={e => setText(e.target.value)} placeholder="Add review comment..."
                            className="flex-1 bg-[#0A0C0F] border border-[#1E2530] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#A78BFA] font-sans" />
                          <button onClick={addComment} className="bg-[#A78BFA] text-white text-xs px-3 py-1.5 rounded hover:bg-[#A78BFA]/90 transition-colors">Add</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex-shrink-0 border-t border-[#1E2530] bg-[#111318] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-[#64748B]">{correctFinds}/{EXPECTED_ISSUES.length} issues found · {comments.length} total comments</div>
          <button onClick={() => setSubmitted(true)} disabled={correctFinds < 2}
            className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded font-display font-semibold transition-colors ${correctFinds >= 2 ? 'bg-[#4ADE80] text-black' : 'bg-[#1E2530] text-[#64748B] cursor-not-allowed'}`}>
            <ThumbsUp className="w-3.5 h-3.5" /> Submit Review
          </button>
        </div>
        <AnimatePresence>
          {submitted && (
            <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
              className="text-xs rounded-lg p-3 bg-[rgba(74,222,128,0.06)] border border-[#4ADE80]/30 text-[#4ADE80]">
              ✓ Review submitted! You found {correctFinds}/3 issues. Line 4: SQL injection. Line 7: null crash. Line 10: no tests.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── System Design Tab ─────────────────────────────────────────────────────────
type SysCompType = 'client'|'cdn'|'lb'|'server'|'cache'|'db'|'queue'|'worker';
interface SysComp { id:string; type:SysCompType; x:number; y:number }
interface SysEdge { id:string; from:string; to:string }

const SYS_PALETTE: { type:SysCompType; label:string; color:string }[] = [
  { type:'client', label:'Client',        color:'#94A3B8' },
  { type:'cdn',    label:'CDN',           color:'#22D3EE' },
  { type:'lb',     label:'Load Balancer', color:'#F97316' },
  { type:'server', label:'API Server',    color:'#A78BFA' },
  { type:'cache',  label:'Redis Cache',   color:'#F87171' },
  { type:'db',     label:'Database',      color:'#4ADE80' },
  { type:'queue',  label:'Msg Queue',     color:'#F59E0B' },
  { type:'worker', label:'Worker',        color:'#FB923C' },
];
const uid2 = () => Math.random().toString(36).slice(2, 9);

function SystemDesignTab() {
  const [comps, setComps] = useState<SysComp[]>([]);
  const [edges, setEdges] = useState<SysEdge[]>([]);
  const [pendingFrom, setPendingFrom] = useState<string|null>(null);
  const [dragOver, setDragOver] = useState<{x:number;y:number}|null>(null);
  const SNAP=100, W=700, H=400;
  const REQUIRED: SysCompType[] = ['client','lb','server','db'];
  const hasRequired = REQUIRED.every(r => comps.some(c => c.type === r));
  const getMeta = (t: SysCompType) => SYS_PALETTE.find(p => p.type === t) ?? SYS_PALETTE[0];

  const handleDrop = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('sysType') as SysCompType;
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = Math.round((e.clientX - rect.left)/SNAP)*SNAP;
    const sy = Math.round((e.clientY - rect.top)/SNAP)*SNAP;
    setComps(prev => [...prev, { id:uid2(), type, x:Math.min(sx,W-90), y:Math.min(sy,H-50) }]);
    setDragOver(null);
  };

  const onNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pendingFrom) { setPendingFrom(id); return; }
    if (pendingFrom !== id) {
      const dup = edges.some(e => (e.from===pendingFrom&&e.to===id)||(e.from===id&&e.to===pendingFrom));
      if (!dup) setEdges(prev => [...prev, { id:uid2(), from:pendingFrom, to:id }]);
    }
    setPendingFrom(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 border-b border-[#1E2530] bg-[#0D1117] px-4 py-2">
        <div className="text-xs text-[#94A3B8] mb-1"><strong className="text-white">Task:</strong> Design a scalable URL shortener (bit.ly) that handles 10k req/sec.</div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-[#64748B]">Drag to canvas →</span>
          {SYS_PALETTE.map(({ type, label, color }) => (
            <div key={type} draggable onDragStart={e => e.dataTransfer.setData('sysType', type)}
              className="px-2 py-1 rounded border text-[10px] font-display cursor-grab select-none hover:border-white/30 transition-colors"
              style={{ borderColor:`${color}40`, color, background:`${color}10` }}>
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-[#0A0C0F] overflow-hidden">
        <svg width={W} height={H} className="w-full h-full"
          onDragOver={e => { e.preventDefault(); const r=e.currentTarget.getBoundingClientRect(); setDragOver({x:Math.round((e.clientX-r.left)/SNAP)*SNAP,y:Math.round((e.clientY-r.top)/SNAP)*SNAP}); }}
          onDrop={handleDrop} onDragLeave={() => setDragOver(null)}
          onClick={() => { setPendingFrom(null); }}>
          <defs>
            <pattern id="sysGrid" width={SNAP} height={SNAP} patternUnits="userSpaceOnUse">
              <path d={`M ${SNAP} 0 L 0 0 0 ${SNAP}`} fill="none" stroke="#1A1F2A" strokeWidth={0.5} />
            </pattern>
            <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#22D3EE" />
            </marker>
          </defs>
          <rect width={W} height={H} fill="#0A0C0F" />
          <rect width={W} height={H} fill="url(#sysGrid)" />
          {dragOver && <rect x={dragOver.x} y={dragOver.y} width={90} height={40} rx={6} fill="#22D3EE" opacity={0.08} stroke="#22D3EE" strokeDasharray="4 2" strokeWidth={1} />}
          {edges.map(e => {
            const from=comps.find(c=>c.id===e.from); const to=comps.find(c=>c.id===e.to);
            if (!from||!to) return null;
            return <line key={e.id} x1={from.x+45} y1={from.y+20} x2={to.x+45} y2={to.y+20} stroke="#22D3EE" strokeWidth={1.5} markerEnd="url(#arrow2)" opacity={0.6} />;
          })}
          {comps.map(comp => {
            const { label, color } = getMeta(comp.type);
            const isPend = pendingFrom===comp.id;
            return (
              <g key={comp.id} onClick={e => onNodeClick(comp.id, e)} style={{cursor:'pointer'}}>
                <rect x={comp.x} y={comp.y} width={90} height={40} rx={6} fill={`${color}18`} stroke={isPend ? '#F97316' : color} strokeWidth={isPend ? 2 : 1.5} />
                <text x={comp.x+45} y={comp.y+24} textAnchor="middle" fill={isPend?'#F97316':color} fontSize={9} fontFamily="monospace">{label}</text>
                {isPend && <rect x={comp.x-2} y={comp.y-2} width={94} height={44} rx={7} fill="none" stroke="#F97316" strokeWidth={1} strokeDasharray="4 2" />}
                <g onClick={e => { e.stopPropagation(); setComps(p=>p.filter(c=>c.id!==comp.id)); setEdges(p=>p.filter(e2=>e2.from!==comp.id&&e2.to!==comp.id)); }}>
                  <circle cx={comp.x+83} cy={comp.y+7} r={7} fill="#F87171" opacity={0.8} />
                  <text x={comp.x+83} y={comp.y+11} textAnchor="middle" fill="white" fontSize={9}>×</text>
                </g>
              </g>
            );
          })}
          {comps.length===0 && <text x={W/2} y={H/2} textAnchor="middle" fill="#1E2530" fontSize={14} fontFamily="monospace">Drag components here to build your architecture</text>}
        </svg>
      </div>
      <div className="flex-shrink-0 border-t border-[#1E2530] bg-[#111318] p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#64748B]">Required: Client → Load Balancer → API Server → Database</div>
          <button disabled={!hasRequired} className={`text-xs px-4 py-1.5 rounded font-display font-semibold transition-colors ${hasRequired ? 'bg-[#4ADE80] text-black hover:bg-[#4ADE80]/90' : 'bg-[#1E2530] text-[#64748B] cursor-not-allowed'}`}>
            {hasRequired ? '✓ Submit Design' : `Need: ${REQUIRED.filter(r => !comps.some(c => c.type===r)).join(', ')}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main SDE Workspace ─────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'algorithm', label: 'Algorithms', icon: Code },
  { id: 'bugfix',    label: 'Bug Fix',    icon: Bug },
  { id: 'review',    label: 'Code Review',icon: GitPullRequest },
  { id: 'sysdesign', label: 'System Design', icon: Layers },
];

export function SDEWorkspace() {
  const [tab, setTab] = useState<Tab>('algorithm');

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-[#1E2530] bg-[#0D1117] px-3 pt-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-display font-semibold border-b-2 -mb-px transition-colors ${
              tab===t.id ? 'border-[#A78BFA] text-white' : 'border-transparent text-[#64748B] hover:text-white'}`}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0">
        {tab === 'algorithm'  && <AlgorithmTab />}
        {tab === 'bugfix'     && <BugFixTab />}
        {tab === 'review'     && <CodeReviewTab />}
        {tab === 'sysdesign'  && <SystemDesignTab />}
      </div>
    </div>
  );
}
