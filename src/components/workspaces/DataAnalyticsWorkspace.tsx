import { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, XCircle, BarChart2, Table, FileText, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { LumiTutor } from '@/components/shared/LumiTutor';

type Tab = 'table' | 'charts' | 'insights';

// ── Raw data ──────────────────────────────────────────────────────────────────
interface RawRow {
  month: string;
  revenue_k: string | number | null;
  active_users: number | null;
  churn_pct: string | number | null;
  new_signups: number | null;
  avg_session_min: number | null;
  issue?: 'missing' | 'invalid' | 'duplicate' | 'outlier';
  issueCol?: string;
  fixed?: boolean;
}

const INITIAL_ROWS: RawRow[] = [
  { month: 'Jan', revenue_k: 42.1,  active_users: 12400, churn_pct: 2.1, new_signups: 340,  avg_session_min: 18.2 },
  { month: 'Feb', revenue_k: 48.3,  active_users: 13100, churn_pct: 1.8, new_signups: 410,  avg_session_min: 19.1 },
  { month: 'Mar', revenue_k: null,  active_users: 13800, churn_pct: 2.3, new_signups: 490,  avg_session_min: 20.4, issue: 'missing',   issueCol: 'revenue_k' },
  { month: 'Apr', revenue_k: 61.0,  active_users: 14200, churn_pct: 1.9, new_signups: 520,  avg_session_min: 21.0 },
  { month: 'May', revenue_k: 58.4,  active_users: 14900, churn_pct: 1.7, new_signups: 480,  avg_session_min: 20.8 },
  { month: 'Jun', revenue_k: 67.2,  active_users: 15700, churn_pct: 1.6, new_signups: 560,  avg_session_min: 22.3 },
  { month: 'Jul', revenue_k: 74.1,  active_users: -842,  churn_pct: 2.4, new_signups: 610,  avg_session_min: 21.5, issue: 'invalid',   issueCol: 'active_users' },
  { month: 'Aug', revenue_k: 79.8,  active_users: 17200, churn_pct: 2.1, new_signups: 640,  avg_session_min: 23.1 },
  { month: 'Sep', revenue_k: 86.5,  active_users: 18100, churn_pct: 'N/A', new_signups: 700, avg_session_min: 24.0, issue: 'missing',  issueCol: 'churn_pct' },
  { month: 'Oct', revenue_k: 91.0,  active_users: 18900, churn_pct: 1.5, new_signups: 730,  avg_session_min: 24.6 },
  { month: 'Nov', revenue_k: 91.0,  active_users: 18900, churn_pct: 1.5, new_signups: 730,  avg_session_min: 24.6, issue: 'duplicate', issueCol: 'all' },
  { month: 'Dec', revenue_k: 98.3,  active_users: 20100, churn_pct: 1.3, new_signups: 810,  avg_session_min: 25.4 },
];

const COLS_META = [
  { key: 'month',           label: 'Month',             type: 'text'   },
  { key: 'revenue_k',       label: 'Revenue ($K)',       type: 'number' },
  { key: 'active_users',    label: 'Active Users',       type: 'number' },
  { key: 'churn_pct',       label: 'Churn Rate (%)',     type: 'number' },
  { key: 'new_signups',     label: 'New Signups',        type: 'number' },
  { key: 'avg_session_min', label: 'Avg Session (min)',  type: 'number' },
];

const ISSUE_LABELS = {
  missing:   { color: '#F59E0B', label: 'Missing/Null',       fixLabel: 'Impute with median' },
  invalid:   { color: '#F87171', label: 'Invalid Value',       fixLabel: 'Remove row' },
  duplicate: { color: '#A78BFA', label: 'Duplicate Row',       fixLabel: 'Remove duplicate' },
  outlier:   { color: '#FB923C', label: 'Statistical Outlier', fixLabel: 'Flag & review' },
};

// ── Data Table Tab ────────────────────────────────────────────────────────────
function DataTableTab({ rows, onFix }: { rows: RawRow[]; onFix: (i: number) => void }) {
  const [active, setActive] = useState<number | null>(null);
  const totalIssues = rows.filter(r => r.issue && !r.fixed).length;
  const fixedIssues = rows.filter(r => r.issue &&  r.fixed).length;

  return (
    <div className="flex flex-col h-full">
      {/* Summary */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-[#1E2530] bg-[#0D1117] flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-[#F87171]" />
          <span className="text-white">{totalIssues} active issues</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#4ADE80]">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{fixedIssues} fixed</span>
        </div>
        <div className="ml-auto flex gap-3">
          {Object.entries(ISSUE_LABELS).map(([k, v]) => (
            <span key={k} className="text-[9px] flex items-center gap-1" style={{ color: v.color }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: v.color }} />
              {v.label}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-2 pb-1 bg-[#0D1117]">
        <div className="flex justify-between text-[10px] text-[#64748B] mb-1">
          <span>Data Quality Score</span>
          <span className={fixedIssues === 4 ? 'text-[#4ADE80]' : 'text-[#F97316]'}>{Math.round((fixedIssues / 4) * 100)}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1E2530] rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full bg-[#4ADE80]" style={{ width: `${(fixedIssues / 4) * 100}%` }} />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="inline-block min-w-full">
          <table className="min-w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#111318] border-b border-[#1E2530]">
                <th className="w-8 px-3 py-2 text-center text-[#64748B] font-normal">#</th>
                {COLS_META.map(c => (
                  <th key={c.key} className="px-3 py-2 text-left text-[#64748B] font-normal whitespace-nowrap">{c.label}</th>
                ))}
                <th className="px-3 py-2 text-left text-[#64748B] font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111318]">
              {rows.map((row, i) => {
                const meta   = row.issue ? ISSUE_LABELS[row.issue] : null;
                const isAct  = active === i;
                return (
                  <>
                    <tr key={i}
                      onClick={() => setActive(row.issue && !row.fixed ? (isAct ? null : i) : null)}
                      className={`transition-colors ${row.issue && !row.fixed ? 'cursor-pointer hover:bg-[rgba(255,255,255,0.02)]' : ''} ${isAct ? 'bg-[rgba(249,115,22,0.05)]' : row.fixed ? 'opacity-60' : ''}`}>
                      <td className="px-3 py-2.5 text-center text-[#64748B] font-mono-data">{i + 1}</td>
                      {COLS_META.map(col => {
                        const val = row[col.key as keyof RawRow];
                        const isIssueCell = row.issue && !row.fixed && (row.issueCol === col.key || row.issueCol === 'all');
                        return (
                          <td key={col.key} className="px-3 py-2.5 font-mono-data whitespace-nowrap">
                            <span className={`${isIssueCell ? 'px-1.5 py-0.5 rounded text-xs' : ''}`}
                              style={isIssueCell && meta ? { background: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}40` } : {}}>
                              {val === null ? <span className="text-[#64748B] italic">null</span> : String(val)}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-3 py-2.5">
                        {row.fixed
                          ? <span className="text-[10px] text-[#4ADE80] flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Fixed</span>
                          : meta
                            ? <span className="text-[10px] flex items-center gap-1" style={{ color: meta.color }}><AlertTriangle className="w-3 h-3" /> {meta.label}</span>
                            : <span className="text-[10px] text-[#4ADE80]">✓ Clean</span>
                        }
                      </td>
                    </tr>
                    {isAct && meta && (
                      <tr key={`${i}-fix`} className="bg-[#111318] border-b border-[#1E2530]">
                        <td colSpan={8} className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#94A3B8]">Issue: <strong style={{ color: meta.color }}>{meta.label}</strong> — Suggested fix:</span>
                            <button onClick={() => { onFix(i); setActive(null); }}
                              className="text-xs px-4 py-1.5 rounded font-display font-semibold text-white transition-colors"
                              style={{ background: meta.color }}>
                              {meta.fixLabel}
                            </button>
                            <button onClick={() => setActive(null)} className="text-xs text-[#64748B] hover:text-white transition-colors">Skip</button>
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
      </div>

      {fixedIssues === 4 && (
        <div className="flex-shrink-0 px-4 pb-3">
          <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} className="bg-[rgba(74,222,128,0.06)] border border-[#4ADE80]/30 rounded-xl p-3 text-xs text-[#4ADE80] text-center">
            ✓ All data quality issues resolved! Switch to Charts to visualize the clean data.
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ── Charts Tab ────────────────────────────────────────────────────────────────
const revenueData = [
  {m:'Jan',v:42.1},{m:'Feb',v:48.3},{m:'Mar',v:null},{m:'Apr',v:61},{m:'May',v:58.4},
  {m:'Jun',v:67.2},{m:'Jul',v:74.1},{m:'Aug',v:79.8},{m:'Sep',v:86.5},{m:'Oct',v:91},
  {m:'Nov',v:91},{m:'Dec',v:98.3},
];
const usersData = [
  {m:'Jan',v:12400},{m:'Feb',v:13100},{m:'Mar',v:13800},{m:'Apr',v:14200},{m:'May',v:14900},
  {m:'Jun',v:15700},{m:'Jul',v:-842},{m:'Aug',v:17200},{m:'Sep',v:18100},{m:'Oct',v:18900},
  {m:'Nov',v:18900},{m:'Dec',v:20100},
];
const churnData = [
  {m:'Jan',v:2.1},{m:'Feb',v:1.8},{m:'Mar',v:2.3},{m:'Apr',v:1.9},{m:'May',v:1.7},
  {m:'Jun',v:1.6},{m:'Jul',v:2.4},{m:'Aug',v:2.1},{m:'Sep',v:null},{m:'Oct',v:1.5},
  {m:'Nov',v:1.5},{m:'Dec',v:1.3},
];
const signupData = [
  {m:'Jan',v:340},{m:'Feb',v:410},{m:'Mar',v:490},{m:'Apr',v:520},{m:'May',v:480},
  {m:'Jun',v:560},{m:'Jul',v:610},{m:'Aug',v:640},{m:'Sep',v:700},{m:'Oct',v:730},
  {m:'Nov',v:730},{m:'Dec',v:810},
];

interface ChartFlag { id: string; chartId: string; anomalyType: string }
type ChartId = 'revenue' | 'users' | 'churn' | 'signups';

const CHART_ANOMALIES: Record<ChartId, { description: string; months: string[] }> = {
  revenue: { description: 'March shows null/missing revenue — likely data pipeline failure', months: ['Mar'] },
  users:   { description: 'July shows -842 active users — impossible negative value (data entry error)', months: ['Jul'] },
  churn:   { description: 'Sep is missing; Nov is an exact duplicate of Oct (copy-paste error)', months: ['Sep','Nov'] },
  signups: { description: 'Nov is an exact duplicate of Oct — same duplicate issue as churn chart', months: ['Nov'] },
};

function ChartsTab({ rows }: { rows: RawRow[] }) {
  const [flags, setFlags] = useState<ChartFlag[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (chartId: ChartId, anomalyType: string) => {
    setFlags(prev => {
      const exists = prev.find(f => f.chartId === chartId);
      if (exists) return prev.filter(f => f.chartId !== chartId);
      return [...prev, { id: Math.random().toString(36).slice(2), chartId, anomalyType }];
    });
  };

  const flaggedIds   = new Set(flags.map(f => f.chartId));
  const correctFlags = (['revenue','users','churn'] as ChartId[]).filter(id => flaggedIds.has(id)).length;

  const CHART_COLOR = { revenue: '#4ADE80', users: '#22D3EE', churn: '#F97316', signups: '#A78BFA' };

  const ChartCard = ({ id, title, data, dataKey, children }: { id: ChartId; title: string; data: {m:string;v:number|null}[]; dataKey: string; children: React.ReactNode }) => {
    const isFlagged = flaggedIds.has(id);
    const hasRealAnomaly = id !== 'signups'; // signups is clean-ish
    return (
      <div className={`bg-[#111318] rounded-xl border overflow-hidden transition-colors ${isFlagged ? 'border-[#F97316]/60' : 'border-[#1E2530]'}`}>
        <div className="px-3 py-2 border-b border-[#1E2530] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: CHART_COLOR[id] }} />
          <span className="text-xs font-display font-semibold text-white">{title}</span>
          {isFlagged && <AlertTriangle className="w-3.5 h-3.5 text-[#F97316] ml-auto" />}
          {submitted && hasRealAnomaly && isFlagged && <CheckCircle className="w-3.5 h-3.5 text-[#4ADE80]" />}
          {submitted && hasRealAnomaly && !isFlagged && <XCircle className="w-3.5 h-3.5 text-[#F87171]" />}
        </div>
        <div className="p-2">{children}</div>
        {submitted && hasRealAnomaly && !isFlagged && (
          <div className="px-3 pb-2 text-[10px] text-[#F87171]">Missed: {CHART_ANOMALIES[id].description}</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard id="revenue" title="Monthly Revenue ($K)" data={revenueData} dataKey="v">
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={revenueData} margin={{top:4,right:8,bottom:4,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2530" />
              <XAxis dataKey="m" tick={{fill:'#64748B',fontSize:9}} />
              <YAxis tick={{fill:'#64748B',fontSize:9}} />
              <Tooltip contentStyle={{background:'#111318',border:'1px solid #1E2530',borderRadius:8,fontSize:11}} />
              <ReferenceLine x="Mar" stroke="#F87171" strokeDasharray="4 2" label={{value:'?',fill:'#F87171',fontSize:9}} />
              <Line type="monotone" dataKey="v" stroke="#4ADE80" strokeWidth={2} connectNulls={false}
                dot={(p: {cx:number;cy:number;payload:{v:number|null}}) => p.payload.v === null ? <circle key={p.cx} cx={p.cx} cy={p.cy} r={5} fill="#F87171" /> : <circle key={p.cx} cx={p.cx} cy={p.cy} r={3} fill="#4ADE80" />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard id="users" title="Monthly Active Users" data={usersData} dataKey="v">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={usersData} margin={{top:4,right:8,bottom:4,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2530" />
              <XAxis dataKey="m" tick={{fill:'#64748B',fontSize:9}} />
              <YAxis tick={{fill:'#64748B',fontSize:9}} />
              <Tooltip contentStyle={{background:'#111318',border:'1px solid #1E2530',borderRadius:8,fontSize:11}} />
              <ReferenceLine y={0} stroke="#F87171" />
              <Bar dataKey="v" radius={[2,2,0,0]}
                fill="#22D3EE"
                label={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard id="churn" title="Monthly Churn Rate (%)" data={churnData} dataKey="v">
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={churnData} margin={{top:4,right:8,bottom:4,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2530" />
              <XAxis dataKey="m" tick={{fill:'#64748B',fontSize:9}} />
              <YAxis tick={{fill:'#64748B',fontSize:9}} domain={[1,3]} />
              <Tooltip contentStyle={{background:'#111318',border:'1px solid #1E2530',borderRadius:8,fontSize:11}} />
              <ReferenceLine x="Nov" stroke="#A78BFA" strokeDasharray="4 2" label={{value:'dup',fill:'#A78BFA',fontSize:8}} />
              <Line type="monotone" dataKey="v" stroke="#F97316" strokeWidth={2} connectNulls={false}
                dot={(p: {cx:number;cy:number;payload:{m:string;v:number|null}}) => p.payload.v === null || p.payload.m === 'Nov' ? <circle key={p.cx} cx={p.cx} cy={p.cy} r={5} fill={p.payload.v === null ? '#F87171' : '#A78BFA'} /> : <circle key={p.cx} cx={p.cx} cy={p.cy} r={3} fill="#F97316" />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard id="signups" title="Monthly New Signups (Control)" data={signupData} dataKey="v">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={signupData} margin={{top:4,right:8,bottom:4,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2530" />
              <XAxis dataKey="m" tick={{fill:'#64748B',fontSize:9}} />
              <YAxis tick={{fill:'#64748B',fontSize:9}} />
              <Tooltip contentStyle={{background:'#111318',border:'1px solid #1E2530',borderRadius:8,fontSize:11}} />
              <Bar dataKey="v" fill="#A78BFA" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Flag anomalies */}
      <div className="bg-[#111318] border border-[#1E2530] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1E2530] font-display font-semibold text-sm text-white">Flag Anomalous Charts</div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['revenue','users','churn','signups'] as ChartId[]).map(id => (
            <div key={id}
              onClick={() => toggle(id, '')}
              className={`border rounded-lg p-3 cursor-pointer transition-colors select-none ${flaggedIds.has(id) ? 'border-[#F97316]/50 bg-[rgba(249,115,22,0.06)]' : 'border-[#1E2530] hover:border-[#2E3540]'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLOR[id] }} />
                <span className="text-xs font-display text-white capitalize">{id === 'revenue' ? 'Revenue' : id === 'users' ? 'Users' : id === 'churn' ? 'Churn' : 'Signups'}</span>
                {flaggedIds.has(id) && <AlertTriangle className="w-3.5 h-3.5 text-[#F97316] ml-auto" />}
              </div>
              {flaggedIds.has(id) && (
                <select defaultValue="" className="w-full bg-[#0A0C0F] border border-[#1E2530] rounded px-1.5 py-1 text-[10px] text-white outline-none"
                  onClick={e => e.stopPropagation()}>
                  <option value="">— Anomaly type —</option>
                  <option>Missing / Null values</option>
                  <option>Invalid / Negative values</option>
                  <option>Duplicate records</option>
                  <option>Statistical outlier</option>
                </select>
              )}
            </div>
          ))}
        </div>
        <div className="px-4 pb-4">
          <button onClick={() => setSubmitted(true)} className="w-full bg-[#F472B6] hover:bg-[#F472B6]/90 text-white font-display font-semibold py-2.5 rounded-lg text-sm transition-colors">
            Submit Anomaly Report
          </button>
          {submitted && (
            <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} className="mt-3 text-xs rounded-lg p-3 bg-[rgba(74,222,128,0.06)] border border-[#4ADE80]/30 text-[#94A3B8] space-y-1">
              <div className="text-[#4ADE80] font-semibold">Analysis submitted — {correctFlags}/3 anomalous charts correctly identified.</div>
              <div><span className="text-[#F87171]">Revenue (Mar):</span> null value — data pipeline dropped the record instead of returning $0.</div>
              <div><span className="text-[#F87171]">Users (Jul):</span> −842 active users is physically impossible — likely a sign error in the ETL script.</div>
              <div><span className="text-[#A78BFA]">Churn (Sep+Nov):</span> Sep missing; Nov is an exact copy of Oct — manual copy-paste in data entry.</div>
              <div className="text-[#4ADE80]">Signups chart has no anomalies — it was the control chart.</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Insights Tab ──────────────────────────────────────────────────────────────
function InsightsTab({ rows }: { rows: RawRow[] }) {
  const [finding, setFinding]     = useState('');
  const [rootCause, setRootCause] = useState('');
  const [actions, setActions]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fixedCount = rows.filter(r => r.fixed).length;
  const totalIssues = 4;
  const score = Math.round(((fixedCount / totalIssues) * 50) + (finding.length > 80 ? 20 : 0) + (rootCause.length > 60 ? 15 : 0) + (actions.length > 60 ? 15 : 0));

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
      <div className="bg-[#111318] border border-[#1E2530] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1E2530] font-display font-semibold text-sm text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#F472B6]" /> Data Incident Report
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-[10px] text-[#64748B] uppercase tracking-widest block mb-2">Summary of Findings</label>
            <textarea value={finding} onChange={e => setFinding(e.target.value)} rows={3}
              placeholder="Describe the data quality issues found — which metrics, which time periods, what types of errors..."
              className="w-full bg-[#0A0C0F] border border-[#1E2530] focus:border-[#F472B6] rounded-lg px-3 py-2 text-sm text-white placeholder-[#64748B] outline-none resize-none" />
            <div className="text-[10px] text-[#64748B] mt-1">{finding.length} chars · min 80 for full marks</div>
          </div>
          <div>
            <label className="text-[10px] text-[#64748B] uppercase tracking-widest block mb-2">Root Cause Hypothesis</label>
            <textarea value={rootCause} onChange={e => setRootCause(e.target.value)} rows={3}
              placeholder="What do you think caused these issues? ETL pipeline failure? Manual data entry errors? Schema migration?"
              className="w-full bg-[#0A0C0F] border border-[#1E2530] focus:border-[#F472B6] rounded-lg px-3 py-2 text-sm text-white placeholder-[#64748B] outline-none resize-none" />
          </div>
          <div>
            <label className="text-[10px] text-[#64748B] uppercase tracking-widest block mb-2">Recommended Actions</label>
            <textarea value={actions} onChange={e => setActions(e.target.value)} rows={3}
              placeholder="What should the engineering team do? Add data validation? Automated anomaly alerts? Backfill missing data?"
              className="w-full bg-[#0A0C0F] border border-[#1E2530] focus:border-[#F472B6] rounded-lg px-3 py-2 text-sm text-white placeholder-[#64748B] outline-none resize-none" />
          </div>
        </div>
      </div>

      {/* Data quality scorecard */}
      <div className="bg-[#111318] border border-[#1E2530] rounded-xl p-4">
        <div className="text-[10px] text-[#64748B] uppercase tracking-widest mb-3">Grader Scorecard</div>
        <div className="space-y-2 text-xs">
          {[
            { label: 'Data issues resolved (Data Table)', val: fixedCount, max: totalIssues, done: fixedCount === totalIssues },
            { label: 'Findings summary (80+ chars)', val: finding.length, max: 80, done: finding.length >= 80 },
            { label: 'Root cause hypothesis (60+ chars)', val: rootCause.length, max: 60, done: rootCause.length >= 60 },
            { label: 'Action items (60+ chars)', val: actions.length, max: 60, done: actions.length >= 60 },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              {item.done ? <CheckCircle className="w-4 h-4 text-[#4ADE80] flex-shrink-0" /> : <XCircle className="w-4 h-4 text-[#64748B] flex-shrink-0" />}
              <span className={item.done ? 'text-white' : 'text-[#64748B]'}>{item.label}</span>
              <span className="ml-auto font-mono-data text-[#64748B]">{Math.min(item.val, item.max)}/{item.max}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm font-display font-semibold text-white">Score: <span className={score >= 80 ? 'text-[#4ADE80]' : score >= 50 ? 'text-[#F97316]' : 'text-[#F87171]'}>{score}/100</span></div>
          <button onClick={() => setSubmitted(true)} disabled={score < 50}
            className={`text-sm px-6 py-2 rounded-lg font-display font-semibold transition-colors ${score >= 50 ? 'bg-[#F472B6] hover:bg-[#F472B6]/90 text-white' : 'bg-[#1E2530] text-[#64748B] cursor-not-allowed'}`}>
            Submit Report
          </button>
        </div>
        {submitted && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-3 text-xs text-[#4ADE80] text-center">
            ✓ Incident report submitted to the data engineering team! +{score} XP earned.
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Main DataAnalytics Workspace ──────────────────────────────────────────────
export function DataAnalyticsWorkspace() {
  const [tab, setTab] = useState<Tab>('table');
  const [rows, setRows] = useState<RawRow[]>(INITIAL_ROWS);

  const handleFix = (i: number) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, fixed: true } : r));
  };

  const totalFixed  = rows.filter(r => r.fixed).length;
  const totalIssues = rows.filter(r => r.issue).length;

  const tabs: { id: Tab; label: string; icon: typeof Table; desc: string }[] = [
    { id: 'table',   label: 'Data Cleaning',     icon: Table,    desc: `${totalFixed}/${totalIssues} fixed` },
    { id: 'charts',  label: 'Anomaly Detection',  icon: BarChart2, desc: '4 charts' },
    { id: 'insights',label: 'Incident Report',    icon: FileText,  desc: 'Write findings' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex-shrink-0 border-b border-[#1E2530] bg-[#0D1117] flex">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-display font-semibold transition-colors border-b-2 ${tab === t.id ? 'border-[#F472B6] text-[#F472B6]' : 'border-transparent text-[#64748B] hover:text-white'}`}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            <span className={`text-[9px] font-mono-data ${tab === t.id ? 'text-[#F472B6]/60' : 'text-[#1E2530]'}`}>{t.desc}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15}} className="flex-1 flex flex-col overflow-hidden min-h-0">
            {tab === 'table'    && <DataTableTab rows={rows} onFix={handleFix} />}
            {tab === 'charts'   && <ChartsTab rows={rows} />}
            {tab === 'insights' && <InsightsTab rows={rows} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lumi AI Tutor */}
      <LumiTutor
        workspaceType="analytics"
        workspaceContext={{
          datasetName: 'SaaS Product Analytics — Monthly KPIs (Jan–Dec)',
          currentQuery: tab === 'table'
            ? `Data cleaning — ${totalFixed} of ${totalIssues} data quality issues fixed`
            : tab === 'charts'
            ? 'Anomaly detection — analyzing revenue, active users, churn rate, and session time charts'
            : 'Incident report — writing findings and root cause analysis',
          results: tab === 'table'
            ? `Dataset has ${rows.length} rows. Issues found: ${totalIssues} (${totalFixed} fixed). Issue types: missing values in revenue and churn columns, invalid negative user count in July, duplicate row for November.`
            : tab === 'charts'
            ? 'Revenue shows steady growth from $42K to $98K. Active users grew from 12,400 to 20,100. Churn rate declined from 2.1% to 1.3%. July shows suspicious negative active_users value.'
            : 'Student is analyzing incident findings and writing a root cause analysis report.',
        }}
      />
    </div>
  );
}
