import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Trash2, Zap, RotateCcw, CheckCircle, ZoomIn, ZoomOut, Maximize2, Info, Move } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LumiTutor } from "@/components/shared/LumiTutor";

// ── Constants ─────────────────────────────────────────────────────────────────
const CELL = 88;        // Larger cells for more room
const COLS = 16;        // Wide canvas
const ROWS = 10;        // Tall canvas
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;

// ── Types ─────────────────────────────────────────────────────────────────────
export type CompType =
  | "battery"
  | "resistor"
  | "led"
  | "switch"
  | "bulb"
  | "capacitor"
  | "voltmeter"
  | "inductor"
  | "diode";

export interface PlacedComp {
  id: string;
  type: CompType;
  col: number;
  row: number;
  switchClosed: boolean;
}

export interface CircuitWire {
  id: string;
  a: { compId: string; pin: "l" | "r" };
  b: { compId: string; pin: "l" | "r" };
}

const uid = () => Math.random().toString(36).slice(2, 9);

const PALETTE_ITEMS: { type: CompType; label: string; desc: string; icon: string; color: string }[] = [
  { type: "battery",   label: "Battery",    desc: "9V DC",  icon: "⚡", color: "#F59E0B" },
  { type: "resistor",  label: "Resistor",   desc: "100Ω",   icon: "≡",  color: "#22D3EE" },
  { type: "led",       label: "LED",        desc: "Green",  icon: "▶",  color: "#4ADE80" },
  { type: "switch",    label: "Switch",     desc: "SPST",   icon: "⌀",  color: "#F97316" },
  { type: "bulb",      label: "Bulb",       desc: "5W",     icon: "☀",  color: "#FDE68A" },
  { type: "capacitor", label: "Capacitor",  desc: "10μF",   icon: "⊞",  color: "#A78BFA" },
  { type: "voltmeter", label: "Voltmeter",  desc: "V",      icon: "V",  color: "#FB923C" },
  { type: "inductor",  label: "Inductor",   desc: "10mH",   icon: "∿",  color: "#67E8F9" },
  { type: "diode",     label: "Diode",      desc: "1N4148", icon: "◁|", color: "#F472B6" },
];

// ── Pin positions ─────────────────────────────────────────────────────────────
function getPin(comp: PlacedComp, pin: "l" | "r") {
  const cx = comp.col * CELL + CELL / 2;
  const cy = comp.row * CELL + CELL / 2;
  return { x: pin === "l" ? cx - CELL / 2 + 8 : cx + CELL / 2 - 8, y: cy };
}

// ── Orthogonal wire path ──────────────────────────────────────────────────────
function wirePath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  if (Math.abs(from.y - to.y) < 3) return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  if (Math.abs(from.x - to.x) < 3) return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  const midX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} H ${midX} V ${to.y} H ${to.x}`;
}

// ── Circuit connectivity check ────────────────────────────────────────────────
function checkCircuit(comps: PlacedComp[], wires: CircuitWire[]) {
  const battery = comps.find((c) => c.type === "battery");
  if (!battery) return { complete: false, energized: new Set<string>() };

  const adj = new Map<string, Set<string>>();
  const addEdge = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a)!.add(b);
    adj.get(b)!.add(a);
  };

  for (const w of wires) {
    addEdge(`${w.a.compId}_${w.a.pin}`, `${w.b.compId}_${w.b.pin}`);
  }
  for (const c of comps) {
    if (c.type === "battery") continue;
    if (c.type === "switch" && !c.switchClosed) continue;
    addEdge(`${c.id}_l`, `${c.id}_r`);
  }

  const start = `${battery.id}_l`;
  const end = `${battery.id}_r`;
  const visited = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const node = queue.shift()!;
    for (const nb of adj.get(node) ?? []) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
    }
  }

  const complete = visited.has(end);
  const energized = new Set<string>();
  for (const c of comps) {
    if (visited.has(`${c.id}_l`) && visited.has(`${c.id}_r`)) energized.add(c.id);
  }
  return { complete, energized };
}

// ── Component SVG Symbol ──────────────────────────────────────────────────────
function CompBody({ comp, cx, cy, isEnergized }: {
  comp: PlacedComp; cx: number; cy: number; isEnergized: boolean;
}) {
  const baseColor = isEnergized ? "#FDE68A" : "#22D3EE";
  const w = CELL / 2 - 10;

  switch (comp.type) {
    case "battery":
      return (
        <g>
          <line x1={cx - w} y1={cy} x2={cx - 12} y2={cy} stroke="#F59E0B" strokeWidth={2.5} />
          <line x1={cx - 12} y1={cy - 16} x2={cx - 12} y2={cy + 16} stroke="#F59E0B" strokeWidth={4} />
          <line x1={cx - 4}  y1={cy - 10} x2={cx - 4}  y2={cy + 10} stroke="#94A3B8" strokeWidth={2.5} />
          <line x1={cx + 4}  y1={cy - 16} x2={cx + 4}  y2={cy + 16} stroke="#F59E0B" strokeWidth={4} />
          <line x1={cx + 12} y1={cy - 10} x2={cx + 12} y2={cy + 10} stroke="#94A3B8" strokeWidth={2.5} />
          <line x1={cx + 12} y1={cy} x2={cx + w} y2={cy} stroke="#94A3B8" strokeWidth={2.5} />
          <text x={cx - 12} y={cy - 20} textAnchor="middle" fill="#F59E0B" fontSize={10} fontFamily="monospace">+</text>
          <text x={cx + 12} y={cy - 20} textAnchor="middle" fill="#94A3B8" fontSize={10} fontFamily="monospace">−</text>
          <text x={cx}      y={cy + 28} textAnchor="middle" fill="#64748B" fontSize={9}  fontFamily="monospace">9V</text>
        </g>
      );

    case "resistor":
      return (
        <g>
          <line x1={cx - w} y1={cy} x2={cx - 20} y2={cy} stroke={baseColor} strokeWidth={2.5} />
          <rect x={cx - 20} y={cy - 11} width={40} height={22} rx={4} fill="#0D1117" stroke={baseColor} strokeWidth={1.8} />
          {/* Zigzag lines inside */}
          <polyline
            points={`${cx - 16},${cy} ${cx - 12},${cy - 7} ${cx - 6},${cy + 7} ${cx},${cy - 7} ${cx + 6},${cy + 7} ${cx + 12},${cy - 7} ${cx + 16},${cy}`}
            fill="none" stroke={baseColor} strokeWidth={1.5} strokeLinejoin="round"
          />
          <line x1={cx + 20} y1={cy} x2={cx + w} y2={cy} stroke={baseColor} strokeWidth={2.5} />
          <text x={cx} y={cy + 28} textAnchor="middle" fill="#64748B" fontSize={8} fontFamily="monospace">100Ω</text>
        </g>
      );

    case "led":
      return (
        <g>
          <line x1={cx - w} y1={cy} x2={cx - 14} y2={cy} stroke={isEnergized ? "#4ADE80" : baseColor} strokeWidth={2.5} />
          <polygon
            points={`${cx - 14},${cy - 13} ${cx - 14},${cy + 13} ${cx + 6},${cy}`}
            fill={isEnergized ? "rgba(74,222,128,0.3)" : "none"}
            stroke={isEnergized ? "#4ADE80" : baseColor}
            strokeWidth={2}
          />
          <line x1={cx + 6} y1={cy - 13} x2={cx + 6} y2={cy + 13}
            stroke={isEnergized ? "#4ADE80" : baseColor} strokeWidth={3} />
          {isEnergized && (
            <>
              <line x1={cx + 11} y1={cy - 11} x2={cx + 18} y2={cy - 18} stroke="#4ADE80" strokeWidth={1.8} opacity={0.9} />
              <line x1={cx + 11} y1={cy + 11} x2={cx + 18} y2={cy + 18} stroke="#4ADE80" strokeWidth={1.8} opacity={0.9} />
              <line x1={cx + 14} y1={cy}       x2={cx + 22} y2={cy}       stroke="#4ADE80" strokeWidth={1.8} opacity={0.9} />
            </>
          )}
          <line x1={cx + 6} y1={cy} x2={cx + w} y2={cy} stroke={isEnergized ? "#4ADE80" : baseColor} strokeWidth={2.5} />
        </g>
      );

    case "switch":
      return (
        <g>
          <line x1={cx - w} y1={cy} x2={cx - 14} y2={cy} stroke={baseColor} strokeWidth={2.5} />
          <circle cx={cx - 14} cy={cy} r={4.5} fill={baseColor} />
          <line
            x1={cx - 14} y1={cy}
            x2={cx + 14}  y2={comp.switchClosed ? cy : cy - 22}
            stroke={baseColor} strokeWidth={2.5}
          />
          <circle cx={cx + 14} cy={cy} r={4.5} fill={comp.switchClosed ? baseColor : "#0D1117"} stroke={baseColor} strokeWidth={2} />
          <line x1={cx + 14} y1={cy} x2={cx + w} y2={cy} stroke={baseColor} strokeWidth={2.5} />
          <text x={cx} y={cy + 30} textAnchor="middle" fill={comp.switchClosed ? "#4ADE80" : "#F97316"} fontSize={8} fontFamily="monospace">
            {comp.switchClosed ? "● CLOSED" : "○ OPEN"}
          </text>
        </g>
      );

    case "bulb":
      return (
        <g>
          {isEnergized && <circle cx={cx} cy={cy} r={26} fill="#FDE68A" opacity={0.18} />}
          <line x1={cx - w} y1={cy} x2={cx - 18} y2={cy} stroke={baseColor} strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={16}
            fill={isEnergized ? "rgba(253,230,138,0.3)" : "#0D1117"}
            stroke={isEnergized ? "#F59E0B" : baseColor}
            strokeWidth={isEnergized ? 2.5 : 2}
          />
          {/* Filament */}
          <polyline
            points={`${cx - 6},${cy + 6} ${cx - 6},${cy - 2} ${cx - 2},${cy + 4} ${cx + 2},${cy - 4} ${cx + 6},${cy + 2} ${cx + 6},${cy - 6}`}
            fill="none"
            stroke={isEnergized ? "#F97316" : baseColor}
            strokeWidth={1.5} strokeLinejoin="round"
          />
          <line x1={cx + 18} y1={cy} x2={cx + w} y2={cy} stroke={baseColor} strokeWidth={2.5} />
          <text x={cx} y={cy + 30} textAnchor="middle" fill="#64748B" fontSize={8} fontFamily="monospace">5W</text>
        </g>
      );

    case "capacitor":
      return (
        <g>
          <line x1={cx - w} y1={cy} x2={cx - 8} y2={cy} stroke={isEnergized ? "#A78BFA" : baseColor} strokeWidth={2.5} />
          <line x1={cx - 8} y1={cy - 16} x2={cx - 8} y2={cy + 16} stroke={isEnergized ? "#A78BFA" : baseColor} strokeWidth={4} />
          <line x1={cx + 8} y1={cy - 16} x2={cx + 8} y2={cy + 16} stroke={isEnergized ? "#A78BFA" : baseColor} strokeWidth={4} />
          <line x1={cx + 8} y1={cy} x2={cx + w} y2={cy} stroke={isEnergized ? "#A78BFA" : baseColor} strokeWidth={2.5} />
          <text x={cx} y={cy + 30} textAnchor="middle" fill="#64748B" fontSize={8} fontFamily="monospace">10μF</text>
        </g>
      );

    case "voltmeter":
      return (
        <g>
          <line x1={cx - w} y1={cy} x2={cx - 18} y2={cy} stroke={isEnergized ? "#FB923C" : baseColor} strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={17} fill="#0D1117" stroke={isEnergized ? "#FB923C" : baseColor} strokeWidth={2} />
          <text x={cx} y={cy + 5} textAnchor="middle" fill={isEnergized ? "#FB923C" : baseColor} fontSize={14} fontFamily="monospace" fontWeight="bold">V</text>
          {isEnergized && <text x={cx} y={cy + 24} textAnchor="middle" fill="#FB923C" fontSize={8} fontFamily="monospace">9.0V</text>}
          <line x1={cx + 18} y1={cy} x2={cx + w} y2={cy} stroke={isEnergized ? "#FB923C" : baseColor} strokeWidth={2.5} />
        </g>
      );

    case "inductor":
      return (
        <g>
          <line x1={cx - w} y1={cy} x2={cx - 22} y2={cy} stroke={isEnergized ? "#67E8F9" : baseColor} strokeWidth={2.5} />
          {[-15, -7, 1, 9].map((ox, i) => (
            <path key={i} d={`M ${cx + ox} ${cy} a 4 4 0 1 1 8 0`}
              fill="none" stroke={isEnergized ? "#67E8F9" : baseColor} strokeWidth={2.2} />
          ))}
          <line x1={cx + 22} y1={cy} x2={cx + w} y2={cy} stroke={isEnergized ? "#67E8F9" : baseColor} strokeWidth={2.5} />
          <text x={cx} y={cy + 28} textAnchor="middle" fill="#64748B" fontSize={8} fontFamily="monospace">10mH</text>
        </g>
      );

    case "diode":
      return (
        <g>
          <line x1={cx - w} y1={cy} x2={cx - 14} y2={cy} stroke={isEnergized ? "#F472B6" : baseColor} strokeWidth={2.5} />
          <polygon
            points={`${cx - 12},${cy - 12} ${cx - 12},${cy + 12} ${cx + 8},${cy}`}
            fill={isEnergized ? "rgba(244,114,182,0.25)" : "none"}
            stroke={isEnergized ? "#F472B6" : baseColor}
            strokeWidth={2}
          />
          <line x1={cx + 8} y1={cy - 12} x2={cx + 8} y2={cy + 12}
            stroke={isEnergized ? "#F472B6" : baseColor} strokeWidth={3} />
          <line x1={cx + 8} y1={cy} x2={cx + w} y2={cy} stroke={isEnergized ? "#F472B6" : baseColor} strokeWidth={2.5} />
          <text x={cx} y={cy + 28} textAnchor="middle" fill="#64748B" fontSize={8} fontFamily="monospace">1N4148</text>
        </g>
      );
  }
}

// ── Main Circuit Builder ──────────────────────────────────────────────────────
export function CircuitBuilderWorkspace() {
  const [comps, setComps]           = useState<PlacedComp[]>([]);
  const [wires, setWires]           = useState<CircuitWire[]>([]);
  const [pendingPin, setPendingPin] = useState<{ compId: string; pin: "l" | "r" } | null>(null);
  const [selected, setSelected]     = useState<string | null>(null);
  const [mousePos, setMousePos]     = useState({ x: 0, y: 0 });
  const [dragType, setDragType]     = useState<CompType | null>(null);
  const [dragOver, setDragOver]     = useState<{ col: number; row: number } | null>(null);
  const [zoom, setZoom]             = useState(1.0);
  const [pan, setPan]               = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning]   = useState(false);
  const [showHelp, setShowHelp]     = useState(false);
  const panStart                    = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const canvasRef                   = useRef<HTMLDivElement>(null);

  const { complete, energized } = useMemo(() => checkCircuit(comps, wires), [comps, wires]);

  const canvasW = COLS * CELL;
  const canvasH = ROWS * CELL;

  // ── Zoom helpers ─────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta)));
  }, []);

  const zoomIn  = () => setZoom(z => Math.min(MAX_ZOOM, +(z + 0.2).toFixed(1)));
  const zoomOut = () => setZoom(z => Math.max(MIN_ZOOM, +(z - 0.2).toFixed(1)));
  const resetView = () => { setZoom(1.0); setPan({ x: 0, y: 0 }); };

  // ── Pan via middle-mouse drag ─────────────────────────────────────────────────
  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      panStart.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
    }
  };
  const onCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning && panStart.current) {
      setPan({
        x: panStart.current.px + (e.clientX - panStart.current.mx),
        y: panStart.current.py + (e.clientY - panStart.current.my),
      });
    }
  };
  const onCanvasMouseUp = () => { setIsPanning(false); panStart.current = null; };

  // ── Keyboard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setPendingPin(null); setSelected(null); }
      if ((e.key === "Delete" || e.key === "Backspace") && selected) {
        setComps(p => p.filter(c => c.id !== selected));
        setWires(p => p.filter(w => w.a.compId !== selected && w.b.compId !== selected));
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  // ── Drag helpers ──────────────────────────────────────────────────────────────
  const toGrid = (clientX: number, clientY: number, rect: DOMRect) => ({
    col: Math.floor((clientX - rect.left - pan.x) / (CELL * zoom)),
    row: Math.floor((clientY - rect.top  - pan.y) / (CELL * zoom)),
  });

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("compType") as CompType;
    const rect = canvasRef.current!.getBoundingClientRect();
    const { col, row } = toGrid(e.clientX, e.clientY, rect);
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
    if (comps.find(c => c.col === col && c.row === row)) return;
    setComps(prev => [...prev, { id: uid(), type, col, row, switchClosed: false }]);
    setDragOver(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const { col, row } = toGrid(e.clientX, e.clientY, rect);
    setDragOver({ col, row });
  };

  // ── Pin click ────────────────────────────────────────────────────────────────
  const onPinClick = (compId: string, pin: "l" | "r", e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pendingPin) { setPendingPin({ compId, pin }); return; }
    if (pendingPin.compId === compId && pendingPin.pin === pin) { setPendingPin(null); return; }
    const dup = wires.some(w =>
      (w.a.compId === pendingPin.compId && w.a.pin === pendingPin.pin && w.b.compId === compId && w.b.pin === pin) ||
      (w.b.compId === pendingPin.compId && w.b.pin === pendingPin.pin && w.a.compId === compId && w.a.pin === pin)
    );
    if (!dup) setWires(prev => [...prev, { id: uid(), a: pendingPin, b: { compId, pin } }]);
    setPendingPin(null);
  };

  const deleteComp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setComps(prev => prev.filter(c => c.id !== id));
    setWires(prev => prev.filter(w => w.a.compId !== id && w.b.compId !== id));
    setSelected(null);
  };

  const toggleSwitch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setComps(prev => prev.map(c => c.id === id ? { ...c, switchClosed: !c.switchClosed } : c));
  };

  const clearAll = () => {
    setComps([]); setWires([]); setPendingPin(null); setSelected(null);
  };

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: "#080A0D", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* ── Top Toolbar ──────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        borderBottom: "1px solid #1A2030",
        background: "linear-gradient(180deg, #0E1118 0%, #0A0D14 100%)",
        padding: "10px 16px",
      }}>
        {/* Component Palette */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, color: "#3A4560", textTransform: "uppercase", letterSpacing: "0.12em", marginRight: 4 }}>
            COMPONENTS
          </span>
          {PALETTE_ITEMS.map(({ type, label, color }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => { e.dataTransfer.setData("compType", type); setDragType(type); }}
              onDragEnd={() => setDragType(null)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 10px", borderRadius: 6,
                border: `1px solid ${dragType === type ? color : "#1E2535"}`,
                background: dragType === type ? `${color}18` : "#0D1119",
                color: dragType === type ? color : "#6B7A99",
                fontSize: 11, cursor: "grab", userSelect: "none",
                transition: "all 0.15s",
                boxShadow: dragType === type ? `0 0 10px ${color}30` : "none",
              }}
              onMouseEnter={e => {
                if (dragType !== type) {
                  (e.currentTarget as HTMLElement).style.borderColor = color;
                  (e.currentTarget as HTMLElement).style.color = "#CBD5E1";
                }
              }}
              onMouseLeave={e => {
                if (dragType !== type) {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1E2535";
                  (e.currentTarget as HTMLElement).style.color = "#6B7A99";
                }
              }}
            >
              <span style={{ color, fontSize: 12 }}>{PALETTE_ITEMS.find(p => p.type === type)?.icon}</span>
              {label}
            </div>
          ))}

          {/* Right-side controls */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            {pendingPin && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ fontSize: 10, color: "#F97316", display: "flex", alignItems: "center", gap: 4 }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F97316", display: "inline-block", animation: "pulse 1s infinite" }} />
                Click another pin to wire · ESC to cancel
              </motion.span>
            )}

            {/* Zoom controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#0D1119", border: "1px solid #1E2535", borderRadius: 8, padding: "3px 6px" }}>
              <button onClick={zoomOut} style={iconBtnStyle} title="Zoom out"><ZoomOut size={12} /></button>
              <span style={{ fontSize: 10, color: "#4A5568", minWidth: 34, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
              <button onClick={zoomIn}  style={iconBtnStyle} title="Zoom in"><ZoomIn  size={12} /></button>
              <button onClick={resetView} style={{ ...iconBtnStyle, borderLeft: "1px solid #1E2535", paddingLeft: 6, marginLeft: 2 }} title="Reset view">
                <Maximize2 size={12} />
              </button>
            </div>

            <button
              onClick={clearAll}
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#4A5568", background: "none", border: "1px solid #1A2030", borderRadius: 6, padding: "5px 10px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#F87171"; (e.currentTarget as HTMLElement).style.borderColor = "#F8717150"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#4A5568"; (e.currentTarget as HTMLElement).style.borderColor = "#1A2030"; }}
            >
              <RotateCcw size={12} /> Clear All
            </button>

            <button
              onClick={() => setShowHelp(h => !h)}
              style={{ ...iconBtnStyle, color: showHelp ? "#22D3EE" : "#4A5568", borderColor: showHelp ? "#22D3EE40" : "#1E2535" }}
            >
              <Info size={12} />
            </button>
          </div>
        </div>

        {/* Help / instruction bar */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ marginTop: 8, display: "flex", gap: 20, fontSize: 10, color: "#3A4560", flexWrap: "wrap", paddingTop: 8, borderTop: "1px solid #0F1520" }}>
                {[
                  ["Drag", "Drop components from palette onto grid"],
                  ["Click pin ●", "Start drawing a wire"],
                  ["Click 2nd pin", "Connect the wire"],
                  ["Click component", "Select (then × to delete)"],
                  ["Click SWITCH", "Toggle open/closed"],
                  ["Scroll / Alt+drag", "Zoom & pan the canvas"],
                  ["Delete key", "Remove selected component"],
                ].map(([key, desc]) => (
                  <span key={key} style={{ display: "flex", gap: 5 }}>
                    <span style={{ color: "#22D3EE80", fontWeight: 600 }}>{key}</span>
                    <span>{desc}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status line */}
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 16, fontSize: 10, color: "#3A4560" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Zap size={11} style={{ color: "#F59E0B" }} />
            {comps.length} components · {wires.length} wires
          </span>
          <AnimatePresence>
            {complete && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: "flex", alignItems: "center", gap: 5, color: "#4ADE80", fontWeight: 600 }}
              >
                <CheckCircle size={11} /> Circuit complete — 9V flowing!
              </motion.span>
            )}
            {!complete && comps.length > 0 && (
              <span style={{ color: "#3A4560" }}>
                Open circuit — connect battery terminals through components to close the loop
              </span>
            )}
          </AnimatePresence>
          {selected && (
            <span style={{ marginLeft: "auto", color: "#F97316" }}>
              {comps.find(c => c.id === selected)?.type} selected · Delete key or × to remove
            </span>
          )}
          <span style={{ marginLeft: selected ? 0 : "auto", display: "flex", alignItems: "center", gap: 4, color: "#262F45" }}>
            <Move size={10} /> Alt+drag or scroll to navigate
          </span>
        </div>
      </div>

      {/* ── Canvas Area ───────────────────────────────────────────────────────── */}
      <div
        ref={canvasRef}
        style={{ flex: 1, overflow: "hidden", position: "relative", cursor: isPanning ? "grabbing" : pendingPin ? "crosshair" : "default" }}
        onWheel={handleWheel}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
        onMouseLeave={onCanvasMouseUp}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(null)}
        onDrop={handleDrop}
        onClick={() => { if (!isPanning) { setPendingPin(null); setSelected(null); } }}
      >
        {/* Canvas background — scrollable inner */}
        <div style={{
          position: "absolute",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          width: canvasW, height: canvasH,
        }}>
          <svg
            width={canvasW}
            height={canvasH}
            style={{ position: "absolute", inset: 0 }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMousePos({ x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom });
            }}
          >
            <defs>
              {/* Fine grid dots */}
              <pattern id="dotGrid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
                <circle cx={CELL / 2} cy={CELL / 2} r={1.2} fill="#141B28" />
                <circle cx={0}        cy={0}          r={0.8} fill="#0F1520" />
                <circle cx={CELL}     cy={0}          r={0.8} fill="#0F1520" />
                <circle cx={0}        cy={CELL}        r={0.8} fill="#0F1520" />
                <circle cx={CELL}     cy={CELL}        r={0.8} fill="#0F1520" />
              </pattern>
              {/* Cell borders */}
              <pattern id="cellGrid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
                <path d={`M ${CELL} 0 L 0 0 0 ${CELL}`} fill="none" stroke="#0E1420" strokeWidth={0.6} />
              </pattern>
              {/* Major grid */}
              <pattern id="majorGrid" width={CELL * 4} height={CELL * 4} patternUnits="userSpaceOnUse">
                <path d={`M ${CELL * 4} 0 L 0 0 0 ${CELL * 4}`} fill="none" stroke="#131C2E" strokeWidth={1.2} />
              </pattern>

              {/* Glow filter */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glowStrong" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="7" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="pinGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>

              {/* Energized wire gradient */}
              <linearGradient id="liveWire" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#F59E0B" />
                <stop offset="50%"  stopColor="#FDE68A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* Background layers */}
            <rect width={canvasW} height={canvasH} fill="#080A0D" />
            <rect width={canvasW} height={canvasH} fill="url(#dotGrid)" />
            <rect width={canvasW} height={canvasH} fill="url(#cellGrid)" />
            <rect width={canvasW} height={canvasH} fill="url(#majorGrid)" />

            {/* Canvas border */}
            <rect x={1} y={1} width={canvasW - 2} height={canvasH - 2} fill="none" stroke="#141E30" strokeWidth={1.5} rx={4} />

            {/* Drop target highlight */}
            {dragOver && dragOver.col >= 0 && dragOver.col < COLS && dragOver.row >= 0 && dragOver.row < ROWS && (
              <g>
                <rect
                  x={dragOver.col * CELL + 3} y={dragOver.row * CELL + 3}
                  width={CELL - 6} height={CELL - 6} rx={8}
                  fill="#22D3EE0D" stroke="#22D3EE" strokeWidth={1.5} strokeDasharray="6 3"
                />
                {/* Corner accents */}
                {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy], i) => (
                  <g key={i} transform={`translate(${dragOver.col * CELL + CELL / 2 + sx * (CELL / 2 - 8)}, ${dragOver.row * CELL + CELL / 2 + sy * (CELL / 2 - 8)})`}>
                    <line x1={0} y1={0} x2={-sx * 8} y2={0} stroke="#22D3EE" strokeWidth={1.5} />
                    <line x1={0} y1={0} x2={0} y2={-sy * 8} stroke="#22D3EE" strokeWidth={1.5} />
                  </g>
                ))}
              </g>
            )}

            {/* ── Wires ──────────────────────────────────────────────────────── */}
            {wires.map((w) => {
              const ca = comps.find(c => c.id === w.a.compId);
              const cb = comps.find(c => c.id === w.b.compId);
              if (!ca || !cb) return null;
              const from = getPin(ca, w.a.pin);
              const to   = getPin(cb, w.b.pin);
              const lit  = energized.has(w.a.compId) && energized.has(w.b.compId);
              return (
                <g key={w.id}>
                  {lit && (
                    <path d={wirePath(from, to)} fill="none"
                      stroke="#F59E0B" strokeWidth={6} opacity={0.2}
                      filter="url(#glow)" strokeLinecap="round" strokeLinejoin="round"
                    />
                  )}
                  <path
                    d={wirePath(from, to)} fill="none"
                    stroke={lit ? "#FDE68A" : "#1E3A4A"}
                    strokeWidth={lit ? 2.5 : 2}
                    filter={lit ? "url(#glow)" : undefined}
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                  {/* Wire junction dots at endpoints */}
                  {lit && (
                    <>
                      <circle cx={from.x} cy={from.y} r={3.5} fill="#FDE68A" filter="url(#glow)" />
                      <circle cx={to.x}   cy={to.y}   r={3.5} fill="#FDE68A" filter="url(#glow)" />
                    </>
                  )}
                </g>
              );
            })}

            {/* Pending wire preview */}
            {pendingPin && (() => {
              const c = comps.find(x => x.id === pendingPin.compId);
              if (!c) return null;
              const from = getPin(c, pendingPin.pin);
              return (
                <g>
                  <line x1={from.x} y1={from.y} x2={mousePos.x} y2={mousePos.y}
                    stroke="#F97316" strokeWidth={2} strokeDasharray="10 5" opacity={0.7}
                    strokeLinecap="round"
                  />
                  <circle cx={from.x} cy={from.y} r={5} fill="#F97316" filter="url(#pinGlow)" />
                </g>
              );
            })()}

            {/* ── Components ─────────────────────────────────────────────────── */}
            {comps.map((comp) => {
              const cx = comp.col * CELL + CELL / 2;
              const cy = comp.row * CELL + CELL / 2;
              const isEnergized = energized.has(comp.id);
              const isSel = selected === comp.id;

              return (
                <g key={comp.id} onClick={(e) => { e.stopPropagation(); setSelected(isSel ? null : comp.id); }} style={{ cursor: "pointer" }}>
                  {/* Cell background */}
                  <rect
                    x={comp.col * CELL + 2} y={comp.row * CELL + 2}
                    width={CELL - 4} height={CELL - 4} rx={8}
                    fill={isEnergized ? "rgba(253,230,138,0.04)" : "rgba(14,20,32,0.8)"}
                    stroke={isSel ? "#F97316" : isEnergized ? "rgba(253,230,138,0.18)" : "#111B2C"}
                    strokeWidth={isSel ? 1.5 : 1}
                    strokeDasharray={isSel ? "6 3" : undefined}
                  />

                  {/* Energized glow layer */}
                  {isEnergized && comp.type === "bulb" && (
                    <rect
                      x={comp.col * CELL + 2} y={comp.row * CELL + 2}
                      width={CELL - 4} height={CELL - 4} rx={8}
                      fill="rgba(253,230,138,0.08)"
                      filter="url(#glowStrong)"
                    />
                  )}

                  {/* Component symbol */}
                  <CompBody comp={comp} cx={cx} cy={cy} isEnergized={isEnergized} />

                  {/* Label below */}
                  <text
                    x={cx} y={comp.row * CELL + CELL - 6}
                    textAnchor="middle" fill={isEnergized ? "#5A6A50" : "#1E2A3A"}
                    fontSize={7.5} fontFamily="monospace"
                  >
                    {PALETTE_ITEMS.find(p => p.type === comp.type)?.label.toUpperCase()}
                  </text>

                  {/* Delete button when selected */}
                  {isSel && (
                    <g onClick={(e) => deleteComp(comp.id, e)} style={{ cursor: "pointer" }}>
                      <circle cx={comp.col * CELL + CELL - 10} cy={comp.row * CELL + 10} r={9} fill="#1A0C0C" stroke="#F87171" strokeWidth={1} />
                      <text x={comp.col * CELL + CELL - 10} y={comp.row * CELL + 14} textAnchor="middle" fill="#F87171" fontSize={12} fontFamily="monospace">×</text>
                    </g>
                  )}

                  {/* Switch toggle area */}
                  {comp.type === "switch" && (
                    <g onClick={(e) => toggleSwitch(comp.id, e)} style={{ cursor: "pointer" }}>
                      <rect
                        x={cx - 22} y={comp.row * CELL + 5} width={44} height={16} rx={5}
                        fill={comp.switchClosed ? "rgba(74,222,128,0.1)" : "rgba(249,115,22,0.08)"}
                        stroke={comp.switchClosed ? "rgba(74,222,128,0.4)" : "rgba(249,115,22,0.3)"}
                        strokeWidth={1}
                      />
                      <text x={cx} y={comp.row * CELL + 16} textAnchor="middle"
                        fill={comp.switchClosed ? "#4ADE80" : "#F97316"}
                        fontSize={7.5} fontFamily="monospace"
                      >
                        {comp.switchClosed ? "CLOSE" : "CLICK"}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* ── Pin dots (top layer) ───────────────────────────────────────── */}
            {comps.map((comp) =>
              (["l", "r"] as const).map((pin) => {
                const pos   = getPin(comp, pin);
                const isPend = pendingPin?.compId === comp.id && pendingPin.pin === pin;
                const isEn   = energized.has(comp.id);
                return (
                  <g key={`${comp.id}_${pin}`} onClick={(e) => onPinClick(comp.id, pin, e)} style={{ cursor: "crosshair" }}>
                    <circle cx={pos.x} cy={pos.y} r={14} fill="transparent" />
                    {/* Outer ring on hover hint */}
                    <circle cx={pos.x} cy={pos.y} r={isPend ? 9 : 6}
                      fill={isPend ? "#F97316" : isEn ? "#FDE68A" : "#080A0D"}
                      stroke={isPend ? "#F97316" : isEn ? "#FDE68A" : "#22D3EE"}
                      strokeWidth={2}
                      filter={isPend || isEn ? "url(#pinGlow)" : undefined}
                    />
                    {isPend && <circle cx={pos.x} cy={pos.y} r={14} fill="none" stroke="#F97316" strokeWidth={1} opacity={0.5} strokeDasharray="4 3" />}
                  </g>
                );
              })
            )}

            {/* Empty-state */}
            {comps.length === 0 && (
              <g>
                <text x={canvasW / 2} y={canvasH / 2 - 18} textAnchor="middle" fill="#131B28" fontSize={13} fontFamily="monospace">
                  ← Drag components from the palette to start building
                </text>
                <text x={canvasW / 2} y={canvasH / 2 + 6} textAnchor="middle" fill="#0F1520" fontSize={10} fontFamily="monospace">
                  Connect a battery, components, and wires to close a circuit
                </text>
                {/* Center crosshair decoration */}
                <line x1={canvasW / 2 - 30} y1={canvasH / 2 + 28} x2={canvasW / 2 + 30} y2={canvasH / 2 + 28} stroke="#0F1520" strokeWidth={1} strokeDasharray="4 4" />
              </g>
            )}
          </svg>
        </div>

        {/* Zoom badge */}
        <div style={{
          position: "absolute", bottom: 14, right: 14,
          background: "#0A0D14E0", border: "1px solid #1A2030",
          borderRadius: 6, padding: "4px 10px", fontSize: 10,
          color: "#3A4560", backdropFilter: "blur(4px)",
          pointerEvents: "none",
        }}>
          {COLS}×{ROWS} grid · {Math.round(zoom * 100)}%
        </div>

        {/* Circuit closed celebratory pulse */}
        <AnimatePresence>
          {complete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute", top: 14, right: 14,
                background: "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.05))",
                border: "1px solid rgba(74,222,128,0.4)",
                borderRadius: 8, padding: "8px 14px",
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 11, color: "#4ADE80", backdropFilter: "blur(4px)",
                boxShadow: "0 0 20px rgba(74,222,128,0.15)",
              }}
            >
              <CheckCircle size={14} />
              <span style={{ fontWeight: 600 }}>Circuit Closed</span>
              <span style={{ color: "#2D5A3D", fontSize: 10 }}>9V · current flowing</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lumi AI Tutor */}
      <LumiTutor
        workspaceType="circuit"
        workspaceContext={{
          components: comps.map(c => ({ id: c.id, type: c.type, col: c.col, row: c.row, switchClosed: c.switchClosed })),
          wires: wires.map(w => ({ id: w.id, a: { compId: w.a.compId, pin: w.a.pin }, b: { compId: w.b.compId, pin: w.b.pin } })),
          circuitComplete: complete,
          energizedComponents: [...energized],
        }}
      />
    </div>
  );
}

// ── Utility styles ────────────────────────────────────────────────────────────
const iconBtnStyle: React.CSSProperties = {
  background: "none", border: "1px solid transparent", borderRadius: 5,
  padding: "4px 6px", cursor: "pointer", color: "#4A5568",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "color 0.15s",
};