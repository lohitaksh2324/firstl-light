import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { PlayCircle, CheckCircle, XCircle, AlertTriangle, MessageSquare, ThumbsUp, RotateCcw, Code, Bug, GitPullRequest, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LumiTutor } from '@/components/shared/LumiTutor';

type Tab = 'algorithm' | 'bugfix' | 'review' | 'sysdesign';

// ── Algorithm Tab ────────────────────────────────────────────────────────────
function AlgorithmTab() {
  const [testRan, setTestRan] = useState(false);
  const [code, setCode] = useState(`def contains_duplicate(nums: list[int]) -> bool:
    """
    Given an integer array nums, return True if any value
    appears at least twice. Return False if all elements distinct.
    
    Constraint: O(n) time — no sorting allowed.
    """
    # Your solution here
    pass
`);
  const tests = [
    { input: 'nums = [1, 2, 3, 1]',                  expected: 'True' },
    { input: 'nums = [1, 2, 3, 4]',                  expected: 'False' },
    { input: 'nums = [1,1,1,3,3,4,3,2,4,2]',         expected: 'True' },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#1E2530] bg-[#0D1117] space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-[#A78BFA]/20 text-[#A78BFA] text-[10px] font-mono-data px-2 py-0.5 rounded border border-[#A78BFA]/30">Problem 2 / 4</span>
          <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-[10px] font-mono-data px-2 py-0.5 rounded border border-[#F59E0B]/30">Easy</span>
          <span className="bg-[#4ADE80]/20 text-[#4ADE80] text-[10px] font-mono-data px-2 py-0.5 rounded border border-[#4ADE80]/30">✓ Two Sum solved</span>
        </div>
        <h2 className="font-display font-bold text-white text-lg">217. Contains Duplicate</h2>
        <p className="text-[#94A3B8] text-sm leading-relaxed">
          Given an integer array <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">nums</code>, return <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">True</code> if any value appears at least twice, <code className="bg-[#1E2530] px-1 rounded text-[#22D3EE] text-xs">False</code> if every element is distinct.
        </p>
        <div className="flex gap-4 text-xs text-[#64748B]">
          <span>⏱ Constraint: <strong className="text-white">O(n) time</strong></span>
          <span>💾 Space: <strong className="text-white">O(n) OK</strong></span>
          <span>🚫 <strong className="text-white">No sorting</strong></span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Editor height="100%" theme="vs-dark" language="python" value={code} onChange={v => setCode(v ?? '')}
          options={{ minimap:{enabled:false}, lineNumbers:'on', fontSize:13, fontFamily:"'JetBrains Mono',monospace", scrollBeyondLastLine:false }} />
      </div>
      <div className="border-t border-[#1E2530] bg-[#111318] p-4 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-display font-semibold text-[#64748B] uppercase tracking-widest">Test Cases</span>
          <div className="flex gap-2">
            <button onClick={() => setTestRan(false)} className="text-xs text-[#64748B] hover:text-white flex items-center gap-1 transition-colors"><RotateCcw className="w-3 h-3" /> Reset</button>
            <button onClick={() => setTestRan(true)} className="bg-[#A78BFA] hover:bg-[#A78BFA]/90 text-white text-xs px-4 py-1.5 rounded font-display font-semibold flex items-center gap-1.5 transition-colors"><PlayCircle className="w-3.5 h-3.5" /> Run Tests</button>
          </div>
        </div>
        {tests.map((t, i) => (
          <div key={i} className={`flex items-center gap-3 p-2 rounded-lg text-xs border transition-all ${testRan ? 'bg-[rgba(74,222,128,0.04)] border-[#4ADE80]/30' : 'bg-[#0A0C0F] border-[#1E2530]'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${testRan ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-[#1E2530] text-[#64748B]'}`}>
              {testRan ? <CheckCircle className="w-3 h-3" /> : <span className="text-[10px]">{i+1}</span>}
            </div>
            <span className="font-mono-data text-[#94A3B8] flex-1 truncate">{t.input}</span>
            <span className={`font-mono-data font-bold ${testRan ? 'text-[#4ADE80]' : 'text-[#64748B]'}`}>{t.expected}</span>
          </div>
        ))}
        {testRan && <div className="text-center text-xs text-[#4ADE80] font-display font-semibold pt-1">✓ All 3 tests passed · Runtime: 48ms · O(n) solution detected</div>}
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

function BugFixTab() {
  const [code, setCode]       = useState(BUG_CODE);
  const [testRan, setTestRan] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const hasFix = code.includes('price - (price') || code.includes('price*(1') || code.includes('price * (1');
  const tests = [
    { desc: 'calculate_discount(100, 10)',   expected: '90.0',  got: hasFix ? '90.0' : '110.0', pass: hasFix },
    { desc: 'calculate_discount(200, 20)',   expected: '160.0', got: hasFix ? '160.0' : '240.0', pass: hasFix },
    { desc: 'apply_coupon(50.0, "SAVE10")',  expected: '45.0',  got: hasFix ? '45.0' : '55.0',   pass: hasFix },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#1E2530] bg-[#0D1117] space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#F87171]/20 text-[#F87171] text-[10px] font-mono-data px-2 py-0.5 rounded border border-[#F87171]/30">Bug Report #FL-4821</span>
          <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-[10px] font-mono-data px-2 py-0.5 rounded border border-[#F59E0B]/30">CRITICAL</span>
        </div>
        <h2 className="font-display font-bold text-white text-lg">E-commerce Discount Calculation Error</h2>
        <div className="bg-[#0A0C0F] border border-[#F87171]/30 rounded-lg p-3 text-xs text-[#94A3B8] leading-relaxed">
          <strong className="text-[#F87171]">User report:</strong> "I applied the SAVE10 coupon to my $100 cart but was charged $110 instead of $90. This is happening for all coupons — the price goes UP instead of DOWN."
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowHint(!showHint)} className="text-xs text-[#F97316] hover:underline">{showHint ? '▲ Hide hint' : '▼ Show hint'}</button>
        </div>
        {showHint && (
          <div className="bg-[rgba(249,115,22,0.06)] border border-[#F97316]/20 rounded-lg p-3 text-xs text-[#F97316]">
            💡 Hint: Look at line 4 — the arithmetic operator used to apply the discount is wrong. Applying 10% discount should REDUCE the price, not increase it.
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
          <button onClick={() => setTestRan(true)} className="bg-[#F87171] hover:bg-[#F87171]/90 text-white text-xs px-4 py-1.5 rounded font-display font-semibold flex items-center gap-1.5 transition-colors">
            <PlayCircle className="w-3.5 h-3.5" /> Run Tests
          </button>
        </div>
        {tests.map((t, i) => (
          <div key={i} className={`flex items-center gap-3 p-2 rounded-lg text-xs border ${testRan ? (t.pass ? 'bg-[rgba(74,222,128,0.04)] border-[#4ADE80]/30' : 'bg-[rgba(248,113,113,0.05)] border-[#F87171]/30') : 'bg-[#0A0C0F] border-[#1E2530]'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${testRan ? (t.pass ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-[#F87171]/20 text-[#F87171]') : 'bg-[#1E2530] text-[#64748B]'}`}>
              {testRan ? (t.pass ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />) : <span className="text-[10px]">{i+1}</span>}
            </div>
            <span className="font-mono-data text-[#94A3B8] flex-1">{t.desc}</span>
            {testRan && !t.pass && <span className="font-mono-data text-[#F87171]">got {t.got}</span>}
            <span className={`font-mono-data font-bold ${testRan ? (t.pass ? 'text-[#4ADE80]' : 'text-[#64748B]') : 'text-[#64748B]'}`}>→ {t.expected}</span>
          </div>
        ))}
        {testRan && hasFix && <div className="text-center text-xs text-[#4ADE80] font-display font-semibold pt-1">✓ Bug fixed! All regression tests passing · +80 XP</div>}
        {testRan && !hasFix && <div className="text-center text-xs text-[#F87171] pt-1">Still failing. Look at the arithmetic operator in calculate_discount().</div>}
      </div>
    </div>
  );
}

// ── Code Review Tab ───────────────────────────────────────────────────────────
type ReviewTag = 'Security' | 'Missing validation' | 'Error handling' | 'Performance' | 'Missing test' | 'Style';

interface ReviewComment {
  line: number;
  tag: ReviewTag;
  text: string;
}

const PR_LINES = [
  { n: 1,  code: "@app.route('/api/users/<user_id>/profile')",  type: 'normal' },
  { n: 2,  code: "def get_user_profile(user_id):",              type: 'add'    },
  { n: 3,  code: "    db = get_db_connection()",                type: 'add'    },
  { n: 4,  code: "    query = f\"SELECT * FROM users WHERE id = {user_id}\"",  type: 'add', issue: true },
  { n: 5,  code: "    cursor = db.execute(query)",              type: 'add'    },
  { n: 6,  code: "    result = cursor.fetchone()",              type: 'add'    },
  { n: 7,  code: "    profile = dict(result)",                  type: 'add', issue: true },
  { n: 8,  code: "    return jsonify(profile)",                 type: 'add'    },
  { n: 9,  code: "",                                            type: 'normal' },
  { n: 10, code: "# Tests: None added",                        type: 'add', issue: true },
];

const EXPECTED_ISSUES = [4, 7, 10]; // line numbers with real issues

function CodeReviewTab() {
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [activeComment, setActiveComment] = useState<number | null>(null);
  const [tag, setTag]         = useState<ReviewTag>('Security');
  const [text, setText]       = useState('');
  const [submitted, setSubmitted] = useState(false);

  const addComment = () => {
    if (activeComment === null) return;
    setComments(prev => prev.filter(c => c.line !== activeComment).concat({ line: activeComment, tag, text }));
    setActiveComment(null);
    setText('');
  };

  const commentedLines = new Set(comments.map(c => c.line));
  const correctFinds   = EXPECTED_ISSUES.filter(l => commentedLines.has(l)).length;

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
              const isActive   = activeComment === line.n;
              const comment    = comments.find(c => c.line === line.n);
              return (
                <>
                  <tr key={line.n}
                    onClick={() => { if (line.code) setActiveComment(isActive ? null : line.n); }}
                    className={`group border-b border-[#111318] transition-colors ${line.code ? 'cursor-pointer' : ''} ${isActive ? 'bg-[rgba(249,115,22,0.08)]' : hasComment ? 'bg-[rgba(167,139,250,0.05)]' : line.type === 'add' ? 'bg-[rgba(74,222,128,0.03)]' : 'bg-transparent'} hover:bg-[rgba(255,255,255,0.03)]`}>
                    <td className="w-10 text-right pr-3 py-1.5 text-[#1E2530] group-hover:text-[#64748B] select-none">{line.n}</td>
                    <td className={`w-4 px-1 py-1.5 text-center ${line.type === 'add' ? 'text-[#4ADE80]' : 'text-[#64748B]'}`}>{line.type === 'add' ? '+' : ' '}</td>
                    <td className={`py-1.5 pl-2 pr-4 ${line.type === 'add' ? 'text-white' : 'text-[#64748B]'}`}>
                      <span dangerouslySetInnerHTML={{ __html: line.code.replace(
                        /(\{user_id\}|dict\(result\)|# Tests: None added)/g,
                        '<span style="background:rgba(248,113,113,0.2);color:#F87171;border-radius:3px;padding:0 2px">$1</span>'
                      ) }} />
                    </td>
                    <td className="py-1.5 pr-3 text-right">
                      {hasComment
                        ? <span className="inline-flex items-center gap-1 bg-[#A78BFA]/20 text-[#A78BFA] px-2 py-0.5 rounded text-[9px]"><MessageSquare className="w-2.5 h-2.5" />{comment?.tag}</span>
                        : line.code && !isActive && <span className="opacity-0 group-hover:opacity-60 text-[#64748B] text-[9px]">+ comment</span>
                      }
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
                            className="flex-1 bg-[#0A0C0F] border border-[#1E2530] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#A78BFA] font-sans"
                          />
                          <button onClick={addComment} className="bg-[#A78BFA] text-white text-xs px-3 py-1.5 rounded transition-colors hover:bg-[#A78BFA]/90">Add</button>
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
          <div className="text-xs text-[#64748B]">{correctFinds} / {EXPECTED_ISSUES.length} issues found · {comments.length} total comments</div>
          <button onClick={() => setSubmitted(true)}
            disabled={correctFinds < 2}
            className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded font-display font-semibold transition-colors ${correctFinds >= 2 ? 'bg-[#4ADE80] text-black' : 'bg-[#1E2530] text-[#64748B] cursor-not-allowed'}`}>
            <ThumbsUp className="w-3.5 h-3.5" /> Submit Review
          </button>
        </div>
        <AnimatePresence>
          {submitted && (
            <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} className="text-xs rounded-lg p-3 bg-[rgba(74,222,128,0.06)] border border-[#4ADE80]/30 text-[#4ADE80]">
              ✓ Review submitted! You correctly flagged {correctFinds}/3 issues:
              Line 4 — SQL injection via f-string interpolation.
              Line 7 — Crashes if <code className="text-white">result</code> is None (no null check).
              Line 10 — No tests written for this endpoint.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── System Design Tab ─────────────────────────────────────────────────────────
type SysCompType = 'client' | 'cdn' | 'lb' | 'server' | 'cache' | 'db' | 'queue' | 'worker';

interface SysComp { id: string; type: SysCompType; x: number; y: number }
interface SysEdge { id: string; from: string; to: string }

const SYS_PALETTE: { type: SysCompType; label: string; color: string }[] = [
  { type: 'client',  label: 'Client',         color: '#94A3B8' },
  { type: 'cdn',     label: 'CDN',            color: '#22D3EE' },
  { type: 'lb',      label: 'Load Balancer',  color: '#F97316' },
  { type: 'server',  label: 'API Server',     color: '#A78BFA' },
  { type: 'cache',   label: 'Redis Cache',    color: '#F87171' },
  { type: 'db',      label: 'Database',       color: '#4ADE80' },
  { type: 'queue',   label: 'Message Queue',  color: '#F59E0B' },
  { type: 'worker',  label: 'Worker',         color: '#FB923C' },
];

const uid2 = () => Math.random().toString(36).slice(2, 9);

function SystemDesignTab() {
  const [comps, setComps]     = useState<SysComp[]>([]);
  const [edges, setEdges]     = useState<SysEdge[]>([]);
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const [dragOver, setDragOver]       = useState<{x:number;y:number}|null>(null);
  const [selected, setSelected]       = useState<string|null>(null);

  const SNAP = 100;
  const W = 700, H = 400;

  const handleDrop = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('sysType') as SysCompType;
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = Math.round((e.clientX - rect.left) / SNAP) * SNAP;
    const sy = Math.round((e.clientY - rect.top)  / SNAP) * SNAP;
    setComps(prev => [...prev, { id: uid2(), type, x: Math.min(sx, W-90), y: Math.min(sy, H-50) }]);
    setDragOver(null);
  };

  const handleDragOver = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOver({ x: Math.round((e.clientX - rect.left) / SNAP) * SNAP, y: Math.round((e.clientY - rect.top) / SNAP) * SNAP });
  };

  const onNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pendingFrom) { setPendingFrom(id); return; }
    if (pendingFrom !== id) {
      const dup = edges.some(e => (e.from === pendingFrom && e.to === id) || (e.from === id && e.to === pendingFrom));
      if (!dup) setEdges(prev => [...prev, { id: uid2(), from: pendingFrom, to: id }]);
    }
    setPendingFrom(null);
  };

  const getMeta = (type: SysCompType) => SYS_PALETTE.find(p => p.type === type) ?? SYS_PALETTE[0];
  const REQUIRED = ['client', 'lb', 'server', 'db'] as SysCompType[];
  const hasRequired = REQUIRED.every(r => comps.some(c => c.type === r));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 border-b border-[#1E2530] bg-[#0D1117] px-4 py-2">
        <div className="text-xs text-[#94A3B8] mb-1"><strong className="text-white">Task:</strong> Design a scalable URL shortener (like bit.ly) that handles 10k req/sec.</div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-[#64748B]">Palette —</span>
          {SYS_PALETTE.map(({ type, label, color }) => (
            <div key={type} draggable onDragStart={e => e.dataTransfer.setData('sysType', type)}
              className="px-2 py-1 rounded border text-[10px] font-display cursor-grab select-none transition-colors hover:border-white/30"
              style={{ borderColor: `${color}40`, color, background: `${color}10` }}>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-[#0A0C0F] overflow-hidden">
        <svg width={W} height={H} className="w-full h-full"
          onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={() => setDragOver(null)}
          onClick={() => { setPendingFrom(null); setSelected(null); }}>
          <defs>
            <pattern id="sysGrid" width={SNAP} height={SNAP} patternUnits="userSpaceOnUse">
              <path d={`M ${SNAP} 0 L 0 0 0 ${SNAP}`} fill="none" stroke="#1A1F2A" strokeWidth={0.5} />
            </pattern>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#22D3EE" />
            </marker>
          </defs>
          <rect width={W} height={H} fill="#0A0C0F" />
          <rect width={W} height={H} fill="url(#sysGrid)" />

          {/* Drop preview */}
          {dragOver && <rect x={dragOver.x} y={dragOver.y} width={90} height={40} rx={6} fill="#22D3EE" opacity={0.08} stroke="#22D3EE" strokeDasharray="4 2" strokeWidth={1} />}

          {/* Edges */}
          {edges.map(e => {
            const from = comps.find(c => c.id === e.from);
            const to   = comps.find(c => c.id === e.to);
            if (!from || !to) return null;
            const fx = from.x + 45, fy = from.y + 20;
            const tx = to.x + 45,   ty = to.y + 20;
            return <line key={e.id} x1={fx} y1={fy} x2={tx} y2={ty} stroke="#22D3EE" strokeWidth={1.5} markerEnd="url(#arrow)" opacity={0.6} />;
          })}

          {/* Nodes */}
          {comps.map(comp => {
            const { label, color } = getMeta(comp.type);
            const isSel  = selected === comp.id;
            const isPend = pendingFrom === comp.id;
            return (
              <g key={comp.id} onClick={e => onNodeClick(comp.id, e)} style={{ cursor: 'pointer' }}>
                <rect x={comp.x} y={comp.y} width={90} height={40} rx={6}
                  fill={`${color}18`} stroke={isSel || isPend ? '#F97316' : color} strokeWidth={isSel || isPend ? 2 : 1.5} />
                <text x={comp.x + 45} y={comp.y + 24} textAnchor="middle" fill={isSel || isPend ? '#F97316' : color} fontSize={9} fontFamily="monospace">{label}</text>
                {isPend && <rect x={comp.x - 2} y={comp.y - 2} width={94} height={44} rx={7} fill="none" stroke="#F97316" strokeWidth={1} strokeDasharray="4 2" />}
                <g onClick={e => { e.stopPropagation(); setComps(prev => prev.filter(c => c.id !== comp.id)); setEdges(prev => prev.filter(e2 => e2.from !== comp.id && e2.to !== comp.id)); }}>
                  <circle cx={comp.x + 83} cy={comp.y + 7} r={7} fill="#F87171" opacity={0.8} />
                  <text x={comp.x + 83} y={comp.y + 11} textAnchor="middle" fill="white" fontSize={9}>×</text>
                </g>
              </g>
            );
          })}

          {/* Empty state */}
          {comps.length === 0 && (
            <text x={W/2} y={H/2} textAnchor="middle" fill="#1E2530" fontSize={14} fontFamily="monospace">
              Drag components to design the system · Click two nodes to connect them
            </text>
          )}
        </svg>
      </div>

      <div className="flex-shrink-0 border-t border-[#1E2530] bg-[#111318] px-4 py-3 flex items-center gap-3 text-xs">
        {REQUIRED.map(r => (
          <div key={r} className={`flex items-center gap-1 ${comps.some(c=>c.type===r) ? 'text-[#4ADE80]' : 'text-[#64748B]'}`}>
            {comps.some(c=>c.type===r) ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            <span className="capitalize">{getMeta(r).label}</span>
          </div>
        ))}
        {pendingFrom && <span className="text-[#F97316] animate-pulse ml-auto">Click another component to draw a connection</span>}
        {hasRequired && !pendingFrom && <span className="text-[#4ADE80] ml-auto">✓ Core architecture complete! Add caching and async workers for full marks.</span>}
      </div>
    </div>
  );
}

// ── Main SDE Workspace ────────────────────────────────────────────────────────
export function SDEWorkspace() {
  const [tab, setTab] = useState<Tab>('algorithm');

  const tabs: { id: Tab; label: string; icon: typeof Code; color: string }[] = [
    { id: 'algorithm', label: 'Algorithms',    icon: Code,          color: '#A78BFA' },
    { id: 'bugfix',    label: 'Bug Fix',        icon: Bug,           color: '#F87171' },
    { id: 'review',    label: 'Code Review',    icon: GitPullRequest, color: '#4ADE80' },
    { id: 'sysdesign', label: 'System Design',  icon: Layers,        color: '#22D3EE' },
  ];

  const TAB_CONTEXT: Record<Tab, { challengeTitle: string; challengeDescription: string; currentCode: string; testResults: Array<{ name: string; passed: boolean }> }> = {
    algorithm: {
      challengeTitle: '217. Contains Duplicate',
      challengeDescription: 'Given an integer array nums, return True if any value appears at least twice. Return False if all elements distinct. Constraint: O(n) time — no sorting allowed.',
      currentCode: 'Write your solution in the editor above.',
      testResults: [],
    },
    bugfix: {
      challengeTitle: 'Bug Fix: calculate_discount',
      challengeDescription: 'Fix the calculate_discount function that incorrectly adds instead of subtracts the discount percentage.',
      currentCode: BUG_CODE,
      testResults: [
        { name: 'calculate_discount(100, 10) == 90.0', passed: false },
        { name: 'calculate_discount(200, 20) == 160.0', passed: false },
      ],
    },
    review: {
      challengeTitle: 'Code Review: Shopping Cart',
      challengeDescription: 'Review the shopping cart implementation for code quality, edge cases, and best practices.',
      currentCode: '# Review the code shown on the left side of the screen.',
      testResults: [],
    },
    sysdesign: {
      challengeTitle: 'System Design: URL Shortener',
      challengeDescription: 'Design a URL shortening service like bit.ly. Consider scalability, storage, and API design.',
      currentCode: '# System design challenge — no code required.',
      testResults: [],
    },
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex-shrink-0 border-b border-[#1E2530] bg-[#0D1117] flex">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-display font-semibold transition-colors border-b-2 ${tab === t.id ? 'border-current text-white' : 'border-transparent text-[#64748B] hover:text-white'}`}
            style={tab === t.id ? { color: t.color, borderColor: t.color } : {}}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15}} className="flex-1 flex flex-col overflow-hidden min-h-0">
            {tab === 'algorithm' && <AlgorithmTab />}
            {tab === 'bugfix'    && <BugFixTab />}
            {tab === 'review'    && <CodeReviewTab />}
            {tab === 'sysdesign' && <SystemDesignTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lumi AI Tutor */}
      <LumiTutor
        workspaceType="sde"
        workspaceContext={TAB_CONTEXT[tab]}
      />
    </div>
  );
}
