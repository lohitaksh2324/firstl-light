import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Lock, ExternalLink, PlayCircle, XCircle, Share2, Star, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { PageTransition } from '@/components/shared/PageTransition';
import { SIMULATIONS, type Simulation } from '@/data';
import { CircuitBuilderWorkspace } from '@/components/workspaces/CircuitBuilder';
import { SDEWorkspace } from '@/components/workspaces/SDEWorkspace';
import { DataAnalyticsWorkspace } from '@/components/workspaces/DataAnalyticsWorkspace';


// ─── Notebook Workspace (ML) ─────────────────────────────────────────────────
function NotebookWorkspace() {
  const [activeCode, setActiveCode] = useState(
    `# TODO: One-hot encode categorical features\n# Target columns: 'admission_type', 'discharge_to', 'primary_diagnosis_group'\n\n`
  );
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [execCount, setExecCount] = useState<number | null>(null);
  const [passed, setPassed] = useState(false);

  const runCell = async () => {
    if (running) return;
    setRunning(true);
    setOutput(null);

    // Simulate a realistic notebook execution for the pandas/ML context
    // (Pyodide doesn't have pandas pre-installed without micropip)
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

    const code = activeCode.toLowerCase();
    const hasGetDummies = code.includes('get_dummies') || code.includes('one_hot') || code.includes('pd.get_dummies');
    const hasColumns = code.includes('admission_type') || code.includes('discharge_to') || code.includes('primary_diagnosis');
    const hasAssign = code.includes('df') && (code.includes('=') || code.includes('inplace'));

    let result: string;
    if (hasGetDummies && hasColumns) {
      result = `✓ One-hot encoding applied.\n   admission_type      → 4 binary columns (admission_type_Elective, _Emergency, _Newborn, _Urgent)\n   discharge_to        → 6 binary columns\n   primary_diagnosis_group → 18 binary columns\n\ndf.shape after encoding: (10000, 81)\nAll columns are now numeric — ready for model training.`;
      setPassed(true);
    } else if (hasGetDummies && !hasColumns) {
      result = `⚠ pd.get_dummies() called but target columns not specified.\nHint: columns=['admission_type', 'discharge_to', 'primary_diagnosis_group']`;
    } else if (code.includes('pass') || code.trim() === '' || code.replace(/#.*/gm, '').trim() === '') {
      result = `(no output)`;
    } else {
      result = `NameError: name 'df' is not defined\nHint: Make sure to reference the df from Stage 2. Try: pd.get_dummies(df, columns=[...])`;
    }

    setOutput(result);
    setExecCount(3);
    setRunning(false);
  };

  return (
    <div className="flex-1 p-4 pb-24 max-w-5xl mx-auto w-full space-y-4">
      {/* Completed cell 1 */}
      <div className="bg-[#111318] border border-[#4ADE80]/50 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-3 py-2 bg-[rgba(255,255,255,0.02)] border-b border-[#1E2530]">
          <div className="text-xs font-mono-data text-[#64748B]">In [1]:</div>
          <div className="text-xs font-mono-data text-[#4ADE80] flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 0.2s</div>
        </div>
        <div className="pt-2">
          <Editor height="80px" theme="vs-dark" language="python"
            options={{ minimap:{enabled:false}, lineNumbers:'on', fontSize:13, fontFamily:"'JetBrains Mono', monospace", scrollBeyondLastLine:false, readOnly:true }}
            defaultValue={`import pandas as pd\ndf = pd.read_csv('hospital_ehr.csv')\nprint(df.shape, df.dtypes.value_counts())`}
          />
        </div>
        <div className="px-3 py-2 border-t border-[#1E2530] bg-[#0A0C0F] font-mono-data text-[11px] text-[#94A3B8]">
          (10000, 50)  — int64: 32, object: 14, float64: 4
        </div>
      </div>

      {/* Completed cell 2 */}
      <div className="bg-[#111318] border border-[#4ADE80]/50 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-3 py-2 bg-[rgba(255,255,255,0.02)] border-b border-[#1E2530]">
          <div className="text-xs font-mono-data text-[#64748B]">In [2]:</div>
          <div className="text-xs font-mono-data text-[#4ADE80] flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 0.1s</div>
        </div>
        <div className="pt-2">
          <Editor height="80px" theme="vs-dark" language="python"
            options={{ minimap:{enabled:false}, lineNumbers:'on', fontSize:13, fontFamily:"'JetBrains Mono', monospace", scrollBeyondLastLine:false, readOnly:true }}
            defaultValue={`# Drop high-null columns, impute numeric medians\nnull_pct = df.isnull().sum() / len(df)\ndf.drop(columns=null_pct[null_pct > 0.05].index, inplace=True)\ndf.fillna(df.median(numeric_only=True), inplace=True)`}
          />
        </div>
        <div className="px-3 py-2 border-t border-[#1E2530] bg-[#0A0C0F] font-mono-data text-[11px] text-[#4ADE80]">
          Dropped 3 high-null columns. Imputed 1,240 values across 8 columns.
        </div>
      </div>

      {/* Active cell — Stage 3 */}
      <div className={`bg-[#111318] rounded-xl overflow-hidden relative transition-all ${passed ? 'border border-[#4ADE80]/60 shadow-[0_0_15px_rgba(74,222,128,0.12)]' : 'border border-[#F97316] shadow-[0_0_15px_rgba(249,115,22,0.15)]'}`}>
        <div className={`absolute top-0 left-0 w-full h-[1px] animate-pulse ${passed ? 'bg-[#4ADE80]' : 'bg-[#F97316]'}`} />
        <div className="flex justify-between items-center px-3 py-2 bg-[rgba(255,255,255,0.02)] border-b border-[#1E2530]">
          <div className={`text-xs font-mono-data ${passed ? 'text-[#4ADE80]' : 'text-[#F97316]'}`}>
            In [{execCount ?? ' '}]: <span className="text-[#64748B]">— Stage 3 Active</span>
          </div>
          <button onClick={runCell} disabled={running}
            className={`text-white text-xs px-3 py-1 rounded font-mono-data transition-colors flex items-center gap-1 disabled:opacity-60 ${passed ? 'bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-black' : 'bg-[#F97316] hover:bg-[#F97316]/90'}`}>
            {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <PlayCircle className="w-3 h-3" />}
            {running ? 'Running…' : passed ? '✓ Re-run' : 'Run'}
          </button>
        </div>
        <div className="pt-2">
          <Editor height="120px" theme="vs-dark" language="python"
            options={{ minimap:{enabled:false}, lineNumbers:'on', fontSize:13, fontFamily:"'JetBrains Mono', monospace", scrollBeyondLastLine:false }}
            value={activeCode}
            onChange={v => { setActiveCode(v ?? ''); setOutput(null); setPassed(false); setExecCount(null); }}
          />
        </div>
        <div className={`px-3 py-3 border-t border-[#1E2530] bg-[#0A0C0F] font-mono-data text-[11px] min-h-[48px] transition-all`}>
          {running && (
            <div className="flex items-center gap-2 text-[#F97316]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Executing cell…</span>
            </div>
          )}
          {!running && output === null && (
            <span className="text-[#64748B] italic">Click ▶ Run to execute · Grader-aware sandbox</span>
          )}
          {!running && output !== null && (
            <pre className={`whitespace-pre-wrap leading-relaxed ${passed ? 'text-[#4ADE80]' : output.startsWith('NameError') || output.startsWith('⚠') ? 'text-[#F87171]' : 'text-[#94A3B8]'}`}>
              {output}
            </pre>
          )}
        </div>
      </div>

      {/* Locked cell */}
      <div className="bg-[#111318] border border-[#1E2530] rounded-xl overflow-hidden opacity-40">
        <div className="flex justify-between items-center px-3 py-2 bg-[rgba(255,255,255,0.02)] border-b border-[#1E2530]">
          <div className="text-xs font-mono-data text-[#64748B]">In [ ]: <span className="text-[#1E2530]">— Locked (complete Stage 3 first)</span></div>
          <Lock className="w-3.5 h-3.5 text-[#1E2530]" />
        </div>
        <div className="px-3 py-6 text-center text-xs text-[#1E2530] font-mono-data">
          Stage 4: Train RandomForest classifier — unlocks after encoding is complete
        </div>
      </div>

      {passed && (
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
          className="bg-[rgba(74,222,128,0.06)] border border-[#4ADE80]/30 rounded-xl p-4 text-sm text-[#4ADE80] font-mono-data">
          ✓ Stage 3 complete! Your feature matrix has 81 columns — all numeric. Stage 4 (model training) is now unlocked.
        </motion.div>
      )}
    </div>
  );
}


// ─── Blueprint Workspace (Civil) ──────────────────────────────────────────────
function BlueprintWorkspace() {
  const [annotations, setAnnotations] = useState<{ x: number; y: number; id: string; risk: string }[]>([]);
  const [mode, setMode] = useState<'view' | 'annotate'>('view');

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== 'annotate' || annotations.length >= 3) return;
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const scaleX = 680 / rect.width;
    const scaleY = 320 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const id = `ann-${Date.now()}`;
    setAnnotations(prev => [...prev, { x, y, id, risk: 'Medium' }]);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-4 py-2 border-b border-[#1E2530] flex items-center gap-3 bg-[#0D1B2A] text-xs">
        <span className="text-[#60A5FA]">MuniWorks Bridge BR-447 · Elevation + Cross Section · Scale 1:200</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setMode('view')} className={`px-3 py-1 rounded text-xs font-display transition-colors ${mode === 'view' ? 'bg-[#1E3A5F] text-[#60A5FA] border border-[#3B82F6]/50' : 'text-[#64748B] hover:text-white'}`}>View</button>
          <button onClick={() => setMode('annotate')} className={`px-3 py-1 rounded text-xs font-display transition-colors ${mode === 'annotate' ? 'bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/50' : 'text-[#64748B] hover:text-white'}`}>
            Annotate ({annotations.length}/3)
          </button>
          {annotations.length > 0 && <button onClick={() => setAnnotations([])} className="text-[#64748B] hover:text-[#F87171] text-xs transition-colors">Clear</button>}
        </div>
      </div>

      <div className="flex-1 bg-[#0A1628] p-4 overflow-auto" style={{cursor: mode === 'annotate' ? 'crosshair' : 'default'}}>
        <svg viewBox="0 0 680 320" className="w-full max-w-3xl mx-auto" onClick={handleSvgClick}
          style={{minHeight:200, filter:'drop-shadow(0 0 20px rgba(59,130,246,0.15))'}}>
          {/* Blueprint grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E3A5F" strokeWidth="0.5" opacity="0.8" />
            </pattern>
            <pattern id="grid2" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1E3A5F" strokeWidth="1.5" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="680" height="320" fill="#0D1B2A" />
          <rect width="680" height="320" fill="url(#grid)" />
          <rect width="680" height="320" fill="url(#grid2)" />

          {/* Title block */}
          <rect x="5" y="5" width="670" height="310" fill="none" stroke="#1E3A5F" strokeWidth="2" />
          <text x="340" y="22" textAnchor="middle" fill="#60A5FA" fontSize="10" fontFamily="monospace" fontWeight="bold">BRIDGE BR-447 · ELEVATION VIEW · MUNI WORKS CIVIL DESIGN 2024</text>

          {/* Ground line */}
          <line x1="40" y1="280" x2="640" y2="280" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="8,4" opacity="0.6" />
          <text x="50" y="292" fill="#3B82F6" fontSize="8" fontFamily="monospace" opacity="0.6">GRADE LEVEL</text>

          {/* Left abutment */}
          <rect x="40" y="220" width="60" height="60" fill="#0F2744" stroke="#60A5FA" strokeWidth="1.5" />
          <text x="70" y="255" textAnchor="middle" fill="#60A5FA" fontSize="7.5" fontFamily="monospace">LEFT</text>
          <text x="70" y="266" textAnchor="middle" fill="#60A5FA" fontSize="7.5" fontFamily="monospace">ABUT.</text>

          {/* Right abutment */}
          <rect x="580" y="220" width="60" height="60" fill="#0F2744" stroke="#60A5FA" strokeWidth="1.5" />
          <text x="610" y="255" textAnchor="middle" fill="#60A5FA" fontSize="7.5" fontFamily="monospace">RIGHT</text>
          <text x="610" y="266" textAnchor="middle" fill="#60A5FA" fontSize="7.5" fontFamily="monospace">ABUT.</text>

          {/* Left Pier */}
          <rect x="195" y="200" width="40" height="80" fill="#0F2744" stroke="#60A5FA" strokeWidth="1.5" />
          <rect x="185" y="195" width="60" height="18" fill="#0F2744" stroke="#60A5FA" strokeWidth="1.5" />
          <rect x="185" y="270" width="60" height="12" fill="#0F2744" stroke="#60A5FA" strokeWidth="2" />
          <text x="215" y="240" textAnchor="middle" fill="#60A5FA" fontSize="7" fontFamily="monospace">PIER 1</text>

          {/* Right Pier */}
          <rect x="445" y="200" width="40" height="80" fill="#0F2744" stroke="#60A5FA" strokeWidth="1.5" />
          <rect x="435" y="195" width="60" height="18" fill="#0F2744" stroke="#60A5FA" strokeWidth="1.5" />
          <rect x="435" y="270" width="60" height="12" fill="#0F2744" stroke="#60A5FA" strokeWidth="2" />
          <text x="465" y="240" textAnchor="middle" fill="#60A5FA" fontSize="7" fontFamily="monospace">PIER 2</text>

          {/* Bridge Deck */}
          <rect x="40" y="155" width="600" height="42" fill="#0F2744" stroke="#93C5FD" strokeWidth="2.5" />
          <text x="340" y="180" textAnchor="middle" fill="#93C5FD" fontSize="8" fontFamily="monospace">PRE-STRESSED CONCRETE DECK · 600mm DEPTH</text>

          {/* Road surface */}
          <rect x="40" y="149" width="600" height="8" fill="#1E3A5F" stroke="#60A5FA" strokeWidth="1" />

          {/* Load arrows */}
          {[120,220,340,460,560].map(x => (
            <g key={x}>
              <line x1={x} y1="120" x2={x} y2="148" stroke="#FDE68A" strokeWidth="2" markerEnd="url(#arrow)" />
              <polygon points={`${x-5},120 ${x+5},120 ${x},130`} fill="#FDE68A" opacity="0.7" />
            </g>
          ))}
          <text x="80" y="118" fill="#FDE68A" fontSize="7" fontFamily="monospace">LL + DL AASHTO LRFD STR-I</text>

          {/* Stress concentration markers */}
          <circle cx="215" cy="196" r="10" fill="rgba(248,113,113,0.2)" stroke="#F87171" strokeWidth="2" strokeDasharray="4,2" />
          <circle cx="465" cy="196" r="10" fill="rgba(248,113,113,0.15)" stroke="#F87171" strokeWidth="1.5" strokeDasharray="4,2" />
          <circle cx="100" cy="170" r="8" fill="rgba(251,146,60,0.15)" stroke="#FB923C" strokeWidth="1.5" strokeDasharray="4,2" />

          {/* Dimension lines */}
          <line x1="100" y1="135" x2="215" y2="135" stroke="#22D3EE" strokeWidth="1" />
          <line x1="215" y1="135" x2="465" y2="135" stroke="#22D3EE" strokeWidth="1" />
          <line x1="465" y1="135" x2="580" y2="135" stroke="#22D3EE" strokeWidth="1" />
          <text x="157" y="130" textAnchor="middle" fill="#22D3EE" fontSize="7" fontFamily="monospace">9.0m</text>
          <text x="340" y="130" textAnchor="middle" fill="#22D3EE" fontSize="7" fontFamily="monospace">18.0m</text>
          <text x="522" y="130" textAnchor="middle" fill="#22D3EE" fontSize="7" fontFamily="monospace">9.0m</text>
          <text x="340" y="143" textAnchor="middle" fill="#22D3EE" fontSize="7.5" fontFamily="monospace">TOTAL SPAN: 36.0m</text>

          {/* Annotation markers */}
          {annotations.map((ann, i) => (
            <g key={ann.id}>
              <circle cx={ann.x} cy={ann.y} r="12" fill="rgba(249,115,22,0.3)" stroke="#F97316" strokeWidth="2" />
              <text x={ann.x} y={ann.y + 4} textAnchor="middle" fill="#F97316" fontSize="10" fontFamily="monospace" fontWeight="bold">{i+1}</text>
            </g>
          ))}
        </svg>

        {annotations.length > 0 && (
          <div className="max-w-3xl mx-auto mt-4 space-y-2">
            <div className="text-xs text-[#64748B] uppercase tracking-widest mb-2">Your Annotations</div>
            {annotations.map((ann, i) => (
              <div key={ann.id} className="bg-[#111318] border border-[#1E2530] rounded-lg p-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F97316]/20 border border-[#F97316] flex items-center justify-center text-[#F97316] text-xs font-bold flex-shrink-0">{i+1}</div>
                <div className="flex-1 text-xs text-[#94A3B8]">Stress zone at ({Math.round(ann.x)}, {Math.round(ann.y)})</div>
                <select value={ann.risk} onChange={e => setAnnotations(prev => prev.map(a => a.id === ann.id ? {...a, risk: e.target.value} : a))}
                  className="bg-[#0A0C0F] border border-[#1E2530] rounded px-2 py-1 text-xs text-white outline-none">
                  <option>Low Risk</option><option>Medium Risk</option><option>High Risk</option>
                </select>
              </div>
            ))}
          </div>
        )}
        {mode === 'annotate' && annotations.length < 3 && (
          <p className="text-center text-xs text-[#F97316] mt-3">Click on stress concentration zones to annotate ({3 - annotations.length} remaining)</p>
        )}
      </div>
    </div>
  );
}

// ─── Spreadsheet Workspace (Business) ────────────────────────────────────────
function SpreadsheetWorkspace() {
  const [mrr, setMrr] = useState(14400);
  const [growth, setGrowth] = useState(8);
  const [churn, setChurn] = useState(4.2);
  const [cogs, setCogs] = useState(35);
  const [recommendation, setRecommendation] = useState('');

  const net = (growth - churn) / 100;
  const y1MRR = mrr * Math.pow(1 + net, 12);
  const y2MRR = y1MRR * Math.pow(1 + net, 12);
  const y3MRR = y2MRR * Math.pow(1 + net, 12);
  const [y1ARR, y2ARR, y3ARR] = [y1MRR * 12, y2MRR * 12, y3MRR * 12];
  const [y1GM, y2GM, y3GM] = [y1ARR * (1 - cogs / 100), y2ARR * (1 - cogs / 100), y3ARR * (1 - cogs / 100)];
  const y2Gr = y1ARR > 0 ? ((y2ARR - y1ARR) / y1ARR) * 100 : 0;
  const y2Margin = y2ARR > 0 ? (y2GM / y2ARR) * 100 : 0;
  const ruleOf40 = y2Gr + y2Margin;
  const ltv = mrr > 0 && churn > 0 ? (1800 / (churn / 100)) : 0;
  const ltvCac = ltv / 3000;

  const fmt = (n: number) => n >= 1000000 ? `$${(n/1000000).toFixed(2)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n.toFixed(0)}`;
  const pct = (n: number) => `${n.toFixed(1)}%`;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-5xl mx-auto w-full">
      {/* Assumptions */}
      <div className="bg-[#111318] border border-[#1E2530] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1E2530] flex items-center gap-2">
          <span className="font-display font-semibold text-sm text-white">Model Assumptions</span>
          <span className="text-[10px] text-[#64748B] font-mono-data">— edit the inputs below</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {[
            { label: 'Starting MRR', unit: '$', value: mrr, min: 1000, max: 100000, step: 1000, set: setMrr },
            { label: 'Monthly Growth Rate', unit: '%', value: growth, min: 0, max: 30, step: 0.5, set: setGrowth },
            { label: 'Monthly Churn Rate', unit: '%', value: churn, min: 0.5, max: 15, step: 0.1, set: setChurn },
            { label: 'COGS % of Revenue', unit: '%', value: cogs, min: 10, max: 70, step: 1, set: setCogs },
          ].map(inp => (
            <div key={inp.label} className="space-y-2">
              <div className="text-[10px] text-[#64748B] uppercase tracking-widest">{inp.label}</div>
              <div className="font-mono-data font-bold text-[#22D3EE] text-lg">{inp.unit === '$' ? fmt(inp.value) : `${inp.value.toFixed(1)}${inp.unit}`}</div>
              <input type="range" min={inp.min} max={inp.max} step={inp.step} value={inp.value}
                onChange={e => inp.set(Number(e.target.value))}
                className="w-full accent-[#22D3EE]" />
            </div>
          ))}
        </div>
      </div>

      {/* 3-Year Projection Table */}
      <div className="bg-[#111318] border border-[#1E2530] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1E2530] font-display font-semibold text-sm text-white">3-Year Financial Projection</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#181C23]">
                <th className="px-4 py-2 text-left font-normal text-[#64748B]">Metric</th>
                {['Year 1', 'Year 2', 'Year 3'].map(y => <th key={y} className="px-4 py-2 text-right font-normal text-[#64748B]">{y}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2530]">
              {[
                { label: 'Year-End MRR', values: [y1MRR, y2MRR, y3MRR], mono: true },
                { label: 'Annual Recurring Revenue (ARR)', values: [y1ARR, y2ARR, y3ARR], mono: true, bold: true },
                { label: `Gross Margin (COGS: ${pct(cogs)})`, values: [y1GM, y2GM, y3GM], mono: true, green: true },
                { label: 'Gross Margin %', values: [(1-cogs/100)*100, (1-cogs/100)*100, (1-cogs/100)*100], pct: true },
              ].map(row => (
                <tr key={row.label} className={row.bold ? 'bg-[rgba(249,115,22,0.04)]' : ''}>
                  <td className={`px-4 py-2.5 ${row.bold ? 'text-white font-semibold' : 'text-[#94A3B8]'}`}>{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className={`px-4 py-2.5 text-right font-mono-data ${row.green ? 'text-[#4ADE80]' : row.pct ? 'text-[#22D3EE]' : row.bold ? 'text-[#F97316]' : 'text-white'}`}>
                      {row.pct ? pct(v) : fmt(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'LTV / CAC', value: `${ltvCac.toFixed(1)}×`, good: ltvCac >= 3, threshold: '≥ 3×' },
          { label: 'Rule of 40 (Y2)', value: pct(ruleOf40), good: ruleOf40 >= 40, threshold: '≥ 40%' },
          { label: 'Y2 Revenue Growth', value: pct(y2Gr), good: y2Gr >= 50, threshold: '≥ 50% for venture' },
          { label: 'Net Churn Impact', value: pct(churn - growth / 3), good: churn < growth / 3, threshold: 'Churn < Growth/3' },
        ].map(m => (
          <div key={m.label} className={`bg-[#111318] rounded-xl p-4 border ${m.good ? 'border-[#4ADE80]/30' : 'border-[#F87171]/30'}`}>
            <div className="text-[10px] text-[#64748B] uppercase tracking-widest mb-1">{m.label}</div>
            <div className={`font-display font-bold text-2xl ${m.good ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>{m.value}</div>
            <div className="text-[9px] text-[#64748B] mt-1">{m.threshold}</div>
          </div>
        ))}
      </div>

      {/* Investment Recommendation */}
      <div className="bg-[#111318] border border-[#1E2530] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1E2530] font-display font-semibold text-sm text-white">Investment Recommendation</div>
        <div className="p-4">
          <textarea value={recommendation} onChange={e => setRecommendation(e.target.value)} placeholder="Based on the model above, write your go/no-go recommendation for the investment committee. Reference the Rule of 40, LTV/CAC, and at least two key risks..." rows={4}
            className="w-full bg-[#0A0C0F] border border-[#1E2530] focus:border-[#22D3EE] rounded-lg px-3 py-2 text-sm text-white placeholder-[#64748B] outline-none resize-none" />
          <div className="flex justify-between items-center mt-2 text-[10px] text-[#64748B]">
            <span>{recommendation.length} / 300 chars</span>
            <span className={recommendation.length >= 50 ? 'text-[#4ADE80]' : ''}>Minimum 50 chars to submit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FORGE Chat messages by track ─────────────────────────────────────────────
function getInitialMessages(wt: string) {
  const msgs: Record<string, { role: string; text: string }[]> = {
    notebook: [
      { role: 'assistant', text: 'Welcome to Stage 3: Encode Features. Your null-handling cell passed the grader. Now use pd.get_dummies() to one-hot encode categorical columns.' },
      { role: 'user', text: 'hint' },
      { role: 'assistant', text: 'Try: pd.get_dummies(df, columns=["admission_type","discharge_to"], drop_first=True). Assign back to df.' },
    ],
    sde: [
      { role: 'assistant', text: 'Nice work on Two Sum! Stage 2 is Contains Duplicate. Key hint: a Python set has O(1) lookup — use it to avoid the O(n²) brute force.' },
      { role: 'user', text: 'How do I avoid using sort?' },
      { role: 'assistant', text: 'Iterate once: for each number, check if it\'s already in a seen = set(). If yes → return True. If no → add to set. Return False after the loop.' },
    ],
    circuit: [
      { role: 'assistant', text: 'You\'re at Stage 3: Propose Fix. You\'ve correctly identified the loose neutral on Circuit B. Now specify the remediation steps per NEC 2023.' },
      { role: 'user', text: 'What fix do I propose?' },
      { role: 'assistant', text: 'Torque the neutral screw to 35 in-lb per terminal spec, or pigtail all neutrals with a wire nut. Verify with a multimeter: neutral-to-ground should read <0.1V under load.' },
    ],
    blueprint: [
      { role: 'assistant', text: 'You\'re applying AASHTO LRFD load cases to Bridge BR-447. Start with Strength I: 1.25×DL + 1.75×LL. The critical zone is the pier-deck junction on the left side.' },
      { role: 'user', text: 'Where do stress concentrations typically occur?' },
      { role: 'assistant', text: 'For this span, check: (1) pier cap corners, (2) deck soffit above supports, and (3) the mid-span bottom fiber. The 1987 schematic shows a section change at the pier cap — prime stress riser.' },
    ],
    spreadsheet: [
      { role: 'assistant', text: 'You\'re building CloudPulse\'s revenue model. Start with Net MRR growth = Growth Rate − Churn Rate. Compound monthly for 12 months to get Year-End MRR.' },
      { role: 'user', text: 'Is the Rule of 40 a good benchmark?' },
      { role: 'assistant', text: 'Yes — for early-stage SaaS, Rule of 40 ≥ 40% signals a healthy balance between growth and profitability. Below 40% with slow growth is a red flag for VCs.' },
    ],
    analytics: [
      { role: 'assistant', text: 'You\'re auditing the GrowthLens dashboard. Start by looking for impossible values — numbers outside the physically possible range for each metric. Then check for gaps.' },
      { role: 'user', text: 'What are common data quality issues?' },
      { role: 'assistant', text: 'The four most common: (1) Pipeline failures → metrics drop to zero, (2) Decimal errors → values 100× too large, (3) Duplicate rows → identical consecutive values, (4) Timezone shifts → values appear in wrong buckets.' },
    ],
  };
  return msgs[wt] || msgs.notebook;
}

// ─── Grader checks by workspace type ─────────────────────────────────────────
function getGraderChecks(wt: string): string[] {
  const checks: Record<string, string[]> = {
    notebook: ['Categorical columns one-hot encoded', 'No string-type columns remain', 'Feature matrix shape is valid'],
    sde: ['Two Sum passes all 3 tests', 'Contains Duplicate passes all tests', 'O(n) complexity confirmed'],
    circuit: ['Faulty component flagged correctly', 'NEC code reference cited', 'Remediation steps documented'],
    blueprint: ['3 stress zones annotated', 'Load combinations applied', 'Risk levels classified'],
    spreadsheet: ['Revenue model assumptions set', 'Rule of 40 ≥ 40% achieved', 'Investment recommendation written'],
    analytics: ['Anomalous charts correctly flagged', 'Anomaly types classified', 'Analysis report submitted'],
  };
  return checks[wt] || checks.notebook;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SimulationWorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sim = SIMULATIONS.find(s => s.id === id) || SIMULATIONS[0];
  const wt = sim.workspaceType;

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [messages, setMessages] = useState(getInitialMessages(wt));
  const [input, setInput] = useState('');
  const [particles, setParticles] = useState<{id:number;angle:number;dist:number;color:string}[]>([]);

  useEffect(() => {
    if (showCompletion) {
      const colors = ['#F97316','#22D3EE','#4ADE80'];
      setParticles(Array.from({length:24}).map((_,i) => ({id:i, angle:Math.random()*360, dist:50+Math.random()*150, color:colors[i%3]})));
    }
  }, [showCompletion]);

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role:'user', text:input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role:'assistant', text:"Good question. Check the hints panel on the left for a targeted nudge, or type 'explain [term]' for a deeper dive." }]);
    }, 700);
  };

  const graderChecks = getGraderChecks(wt);
  const accentColor = sim.trackColor;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A0C0F] overflow-hidden flex flex-col">
        {/* Top Bar */}
        <header className="h-[52px] bg-[#111318] border-b border-[#1E2530] flex items-center px-4 gap-3 z-50 flex-shrink-0">
          <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]" style={{background: accentColor}}>FL</div>
          <span className="text-sm text-[#64748B]">/</span>
          <span className="text-sm text-white truncate max-w-[200px] font-medium">{sim.title}</span>
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-1.5">
            {sim.stages.map(stage => (
              <div key={stage.id} className={`rounded-full px-3 py-1 text-[11px] font-mono-data flex items-center gap-1.5 ${
                stage.status==='completed' ? 'text-white' : stage.status==='active' ? 'border text-white' : 'bg-[#1E2530] text-[#64748B]'
              }`} style={stage.status==='completed'?{background:accentColor}:stage.status==='active'?{borderColor:accentColor,color:accentColor}:{}}>
                {stage.status==='active' && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:accentColor}} />}
                {stage.id}. {stage.name}
              </div>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="rounded px-2 py-0.5 text-xs border font-mono-data" style={{background:`${accentColor}18`,color:accentColor,borderColor:`${accentColor}33`}}>{sim.xpReward} XP</div>
            <button className="border border-[#1E2530] hover:bg-[#181C23] text-sm px-3 py-1 rounded-lg text-white transition-colors">Save</button>
            <button onClick={() => navigate('/dashboard')} className="border border-[#1E2530] hover:bg-[#1E2530] text-sm px-3 py-1 rounded-lg text-[#64748B] transition-colors">Exit</button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Panel (Task Brief) */}
          <div className="bg-[#0A0C0F] border-r border-[#1E2530] flex-shrink-0 transition-all duration-300 relative flex flex-col" style={{width: leftCollapsed ? 0 : 280}}>
            <button onClick={() => setLeftCollapsed(!leftCollapsed)} className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 bg-[#111318] border border-[#1E2530] border-l-0 rounded-r-lg p-1.5 z-40 text-[#64748B] hover:text-white">
              {leftCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            {!leftCollapsed && (
              <div className="flex-1 overflow-y-auto min-w-[280px]">
                <div className="px-4 py-3 border-b border-[#1E2530] font-display font-semibold text-sm text-white">Task Brief</div>
                <Accordion type="multiple" defaultValue={["objectives","scenario"]} className="w-full">
                  <AccordionItem value="scenario" className="border-b border-[#1E2530]">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-[#111318] text-gray-300">Scenario</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 text-xs text-[#94A3B8] leading-relaxed">{sim.scenario}</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="objectives" className="border-b border-[#1E2530]">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-[#111318] text-gray-300">
                      Objectives ({sim.objectives.filter(o=>o.done).length}/{sim.objectives.length})
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 space-y-2">
                      {sim.objectives.map(obj => (
                        <div key={obj.id} className="flex gap-2 items-start">
                          {obj.done ? <CheckCircle className="w-4 h-4 text-[#4ADE80] flex-shrink-0 mt-0.5" /> : <div className="w-4 h-4 rounded-full border flex-shrink-0 mt-0.5" style={{borderColor: !obj.done && sim.objectives.find(o=>!o.done)?.id===obj.id ? accentColor : '#64748B'}} />}
                          <span className={`text-xs ${obj.done ? 'text-[#64748B] line-through' : 'text-[#94A3B8]'}`}>{obj.text}</span>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="hints" className="border-b border-[#1E2530]">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-[#111318] text-gray-300">Hints (−50 XP each)</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 space-y-2">
                      {sim.hints.map((h,i) => (
                        <div key={i} className="bg-[rgba(249,115,22,0.05)] border border-[rgba(249,115,22,0.15)] rounded-lg p-3 text-xs text-[#F97316] leading-relaxed">💡 {h}</div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="resources" className="border-none">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-[#111318] text-gray-300">Resources</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 space-y-2">
                      {sim.resources.map((r,i) => (
                        <a key={i} href={r.url} className="text-[#22D3EE] hover:underline text-xs flex items-center gap-1 block">{r.label} <ExternalLink className="w-3 h-3 inline" /></a>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>

          {/* Center Panel */}
          <div className={`flex-1 bg-[#0A0C0F] overflow-hidden relative flex flex-col ${wt==='notebook' ? 'overflow-y-auto bg-blueprint' : ''}`}>
            {wt !== 'notebook' && wt !== 'sde' && wt !== 'circuit' && wt !== 'blueprint' && (
              <div className="sticky top-0 bg-[rgba(10,12,15,0.95)] backdrop-blur border-b border-[#1E2530] px-4 py-2 flex items-center gap-2 z-10">
                <span className="text-xs text-[#64748B]">{sim.title}</span>
                <span className="ml-auto text-xs text-[#64748B] italic">{sim.track} Track</span>
              </div>
            )}
            {wt === 'notebook' && (
              <div className="sticky top-0 bg-[rgba(10,12,15,0.95)] backdrop-blur border-b border-[#1E2530] px-4 py-2 flex items-center gap-2 z-10">
                <PlayCircle className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-xs text-[#64748B]">Python Notebook · Pyodide Runtime</span>
                <span className="ml-auto text-xs text-[#64748B] italic">pandas 2.1 · sklearn 1.4</span>
              </div>
            )}
            {wt === 'notebook' && <NotebookWorkspace />}
            {wt === 'sde' && <SDEWorkspace />}
            {wt === 'circuit' && <CircuitBuilderWorkspace />}
            {wt === 'blueprint' && <BlueprintWorkspace />}
            {wt === 'spreadsheet' && <SpreadsheetWorkspace />}
            {wt === 'analytics' && <DataAnalyticsWorkspace />}
          </div>

          {/* Right Panel (FORGE + Grader) */}
          <div className="bg-[#0A0C0F] border-l border-[#1E2530] flex-shrink-0 transition-all duration-300 relative flex flex-col" style={{width: rightCollapsed ? 0 : 300}}>
            <button onClick={() => setRightCollapsed(!rightCollapsed)} className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 bg-[#111318] border border-[#1E2530] border-r-0 rounded-l-lg p-1.5 z-40 text-[#64748B] hover:text-white">
              {rightCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {!rightCollapsed && (
              <div className="flex flex-col h-full min-w-[300px]">
                {/* Chat */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-3 py-3 border-b border-[#1E2530] flex items-center gap-2 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#22D3EE] pulse-cyan" />
                    <span className="font-display font-semibold text-sm text-white">FORGE Assistant</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                    {messages.map((m, i) => (
                      <div key={i} className={`text-xs px-3 py-2 max-w-[85%] rounded-xl ${m.role==='user' ? 'ml-auto bg-[#F97316]/10 border border-[#F97316]/20 text-white rounded-tr-sm' : 'mr-auto bg-[#181C23] border border-[#1E2530] text-gray-200 rounded-tl-sm'}`}>{m.text}</div>
                    ))}
                  </div>
                  <form onSubmit={handleChat} className="p-3 border-t border-[#1E2530] flex gap-2 flex-shrink-0">
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask FORGE..."
                      className="flex-1 bg-[#0A0C0F] border border-[#1E2530] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#22D3EE]" />
                    <button type="submit" className="bg-[#F97316] text-white rounded-lg px-3 py-2 text-xs hover:bg-[#F97316]/90 transition-colors">Send</button>
                  </form>
                </div>

                {/* Auto-Grader */}
                <div className="p-4 border-t border-[#1E2530] bg-[#111318] flex-shrink-0">
                  <div className="text-[10px] font-mono-data text-[#64748B] uppercase tracking-widest mb-3">Auto-Grader</div>
                  <div className="space-y-2 mb-4">
                    {graderChecks.map((check, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <XCircle className="w-4 h-4 text-[#F87171]" />
                        <span className="text-gray-300">{check}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full text-white font-display font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1" style={{background:accentColor}}>
                    Run Check <PlayCircle className="w-3.5 h-3.5" />
                  </button>
                  <div className="mt-3">
                    <div className="text-xs text-[#64748B] mb-1">0 / {graderChecks.length} passing</div>
                    <div className="w-full h-1.5 bg-[#1E2530] rounded-full" />
                  </div>
                  <button onClick={() => setShowCompletion(true)} className="w-full border border-[#1E2530] hover:bg-[#181C23] text-[#64748B] hover:text-white text-xs py-2 rounded-lg mt-4 transition-colors">
                    DEV: Force Complete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completion Modal */}
        <AnimatePresence>
          {showCompletion && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(10,12,15,0.95)] backdrop-blur-sm">
              {particles.map(p => (
                <motion.div key={p.id}
                  initial={{x:0,y:0,opacity:1,scale:0}}
                  animate={{x:Math.cos(p.angle*Math.PI/180)*p.dist, y:Math.sin(p.angle*Math.PI/180)*p.dist, opacity:0, scale:1}}
                  transition={{duration:1.2,ease:"easeOut"}}
                  className="absolute w-2 h-2 rounded-full" style={{backgroundColor:p.color}} />
              ))}
              <motion.div initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}}
                transition={{type:"spring",damping:25,stiffness:300,delay:0.1}}
                className="bg-[#111318] border rounded-2xl p-8 max-w-lg w-full mx-4 relative z-10" style={{borderColor:`${accentColor}60`}}>
                <div className="flex justify-end mb-2">
                  <button onClick={() => setShowCompletion(false)} className="text-[#64748B] hover:text-white transition-colors"><XCircle className="w-5 h-5" /></button>
                </div>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{background:`${accentColor}20`,border:`2px solid ${accentColor}`}}>
                    <Star className="w-8 h-8" style={{color:accentColor}} />
                  </div>
                </div>
                <h2 className="font-display text-3xl font-bold text-white text-center">Simulation Complete!</h2>
                <p className="text-sm text-[#94A3B8] text-center mt-1">{sim.title}</p>
                <div className="mt-6 border border-[#1E2530] rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#181C23] border-b border-[#1E2530]">
                      <tr><th className="px-4 py-2 font-normal text-xs text-[#64748B]">Stage</th><th className="px-4 py-2 font-normal text-xs text-[#64748B] text-right">Score</th></tr>
                    </thead>
                    <tbody className="font-mono-data text-xs text-gray-300 divide-y divide-[#1E2530]">
                      {sim.stages.filter(s=>s.status!=='locked').map(s => (
                        <tr key={s.id}><td className="px-4 py-2">{s.name}</td><td className="px-4 py-2 text-right text-[#4ADE80]">{80+Math.floor(Math.random()*18)}</td></tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#181C23] border-t border-[#1E2530]">
                      <tr><td className="px-4 py-3 font-display font-semibold text-white">Total XP Earned</td><td className="px-4 py-3 text-right font-mono-data font-bold text-sm" style={{color:accentColor}}>{sim.xpReward} XP</td></tr>
                    </tfoot>
                  </table>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => navigate('/credentials')} className="flex-1 border border-[#1E2530] hover:bg-[#181C23] text-white font-display text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1">
                    <Share2 className="w-4 h-4" /> View Credential
                  </button>
                  <button onClick={() => navigate('/simulations')} className="flex-1 font-display font-semibold text-white text-sm py-2.5 rounded-xl transition-colors" style={{background:accentColor}}>
                    Next Simulation →
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
