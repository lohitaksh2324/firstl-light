import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CircuitContext {
  components: Array<{ id: string; type: string; col: number; row: number; switchClosed: boolean }>;
  wires: Array<{ id: string; a: { compId: string; pin: string }; b: { compId: string; pin: string } }>;
  circuitComplete: boolean;
  energizedComponents: string[];
}

export interface SDEContext {
  challengeTitle: string;
  challengeDescription: string;
  currentCode: string;
  testResults: Array<{ name: string; passed: boolean }>;
}

export interface AnalyticsContext {
  datasetName: string;
  currentQuery: string;
  results: string;
}

type WorkspaceType = "circuit" | "sde" | "analytics";
type WorkspaceContext = CircuitContext | SDEContext | AnalyticsContext;

interface LumiTutorProps {
  workspaceType: WorkspaceType;
  workspaceContext: WorkspaceContext;
}

// ── Default messages ──────────────────────────────────────────────────────────

const DEFAULT_MESSAGES: Record<WorkspaceType, string> = {
  circuit: "Add some components and I'll explain what's happening!",
  sde: "Write some code and I'll help you understand it!",
  analytics: "Load some data and I'll guide your analysis!",
};

// ── Check if context has meaningful data ──────────────────────────────────────

function hasData(type: WorkspaceType, context: WorkspaceContext): boolean {
  if (type === "circuit") {
    const c = context as CircuitContext;
    return c.components.length > 0;
  }
  if (type === "sde") {
    const c = context as SDEContext;
    return c.currentCode.trim().length > 0 && !c.currentCode.includes("# Your solution here\n    pass");
  }
  if (type === "analytics") {
    const c = context as AnalyticsContext;
    return c.datasetName.trim().length > 0;
  }
  return false;
}

// ── Build prompt ──────────────────────────────────────────────────────────────

function buildPrompt(type: WorkspaceType, context: WorkspaceContext): { system: string; user: string } {
  if (type === "circuit") {
    const c = context as CircuitContext;
    const compTypes = c.components.map(comp => comp.type);
    const compList = compTypes.length > 0 ? compTypes.join(", ") : "none";
    const wireList = c.wires.length > 0
      ? c.wires.map(w => `${w.a.compId}(${w.a.pin}) → ${w.b.compId}(${w.b.pin})`).join("; ")
      : "no wires";
    const energized = c.energizedComponents.length > 0
      ? c.energizedComponents.join(", ")
      : "none";

    return {
      system: `You are Lumi, a friendly AI electronics tutor for students. 
You will receive the current state of a student's circuit as JSON. 
Explain clearly why the circuit works or doesn't work. Be specific 
about the actual components present. Mention what is missing if the 
circuit is incomplete. If it works, explain what each component is 
doing and how current is flowing. Keep it under 80 words. Use simple 
friendly language. No bullet points, just natural sentences.`,
      user: `My circuit has these components: ${compList}
Connections: ${wireList}
Circuit complete (closed loop): ${c.circuitComplete ? "yes" : "no"}
Components with current flowing: ${energized}
Please explain why my circuit works or doesn't work.`,
    };
  }

  if (type === "sde") {
    const c = context as SDEContext;
    const testSummary = c.testResults.length > 0
      ? c.testResults.map(t => `${t.name}: ${t.passed ? "passed" : "failed"}`).join(", ")
      : "no tests run yet";

    return {
      system: `You are Lumi, a friendly AI software engineering tutor for students. 
You will receive a coding challenge, the student's current code, and 
test results. Explain what the code is doing, why tests pass or fail, 
and what software engineering concept this teaches. Keep it under 80 
words. Use simple friendly language. No bullet points.`,
      user: `Challenge: ${c.challengeTitle}
Description: ${c.challengeDescription}
Current code:
${c.currentCode}
Test results: ${testSummary}
Please explain what my code is doing and why tests pass or fail.`,
    };
  }

  // analytics
  const c = context as AnalyticsContext;
  return {
    system: `You are Lumi, a friendly AI data science tutor for students. 
You will receive information about what a student is analyzing. 
Explain what the data shows, whether their approach is right, and 
what insight they can draw. Keep it under 80 words. Use simple 
friendly language. No bullet points.`,
    user: `Dataset: ${c.datasetName}
Current analysis: ${c.currentQuery}
Results/findings: ${c.results}
Please explain what the data shows and what insight I can draw.`,
  };
}

// ── Lumi Face SVG ─────────────────────────────────────────────────────────────

function LumiFace({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <svg viewBox="0 0 56 56" width="56" height="56" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="lumi-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="lumi-glow-strong" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow ring */}
      <circle cx="28" cy="29" r="23" fill="none" stroke="#22D3EE" strokeWidth="1.5" opacity="0.35" filter="url(#lumi-glow)" />

      {/* Head circle */}
      <circle cx="28" cy="29" r="20" fill="#080A0D" stroke="#22D3EE" strokeWidth="2" filter="url(#lumi-glow)" />

      {/* Antenna base */}
      <line x1="28" y1="9" x2="28" y2="5" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" filter="url(#lumi-glow)" />
      <circle cx="28" cy="4" r="2.5" fill={isSpeaking ? "#22D3EE" : "#0D1119"} stroke="#22D3EE" strokeWidth="1.5" filter="url(#lumi-glow)" />

      {/* Left eye */}
      <rect
        x="16" y="23" width="8" height="6" rx="2"
        fill={isSpeaking ? "#22D3EE" : "#0D2030"}
        stroke="#22D3EE" strokeWidth="1.5"
        filter={isSpeaking ? "url(#lumi-glow-strong)" : "url(#lumi-glow)"}
        opacity={isSpeaking ? 1 : 0.8}
      />

      {/* Right eye */}
      <rect
        x="32" y="23" width="8" height="6" rx="2"
        fill={isSpeaking ? "#22D3EE" : "#0D2030"}
        stroke="#22D3EE" strokeWidth="1.5"
        filter={isSpeaking ? "url(#lumi-glow-strong)" : "url(#lumi-glow)"}
        opacity={isSpeaking ? 1 : 0.8}
      />

      {/* Eye shine dots */}
      {isSpeaking && (
        <>
          <circle cx="21" cy="25" r="1.2" fill="white" opacity="0.9" />
          <circle cx="37" cy="25" r="1.2" fill="white" opacity="0.9" />
        </>
      )}

      {/* Smile */}
      <path
        d="M 21 35 Q 28 41 35 35"
        fill="none"
        stroke="#22D3EE"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#lumi-glow)"
        opacity={isSpeaking ? 1 : 0.7}
      />

      {/* Cheek dots */}
      <circle cx="17" cy="33" r="2" fill="#22D3EE" opacity="0.25" />
      <circle cx="39" cy="33" r="2" fill="#22D3EE" opacity="0.25" />
    </svg>
  );
}

// ── Typing dots ───────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 2px" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22D3EE",
            boxShadow: "0 0 6px #22D3EE80",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Main LumiTutor Component ──────────────────────────────────────────────────

export function LumiTutor({ workspaceType, workspaceContext }: LumiTutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = useCallback(async () => {
    if (!hasData(workspaceType, workspaceContext)) {
      setMessage(DEFAULT_MESSAGES[workspaceType]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { system, user } = buildPrompt(workspaceType, workspaceContext);

    try {
      const apiKey = "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";
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          max_tokens: 200,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content ?? "Hmm, I couldn't get a response. Try again!";
      setMessage(text);
    } catch (err) {
      setError("Oops! I had trouble connecting. Check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceType, workspaceContext]);

  const handleClick = () => {
    if (isOpen) {
      setIsOpen(false);
      setMessage(null);
      setError(null);
    } else {
      setIsOpen(true);
      fetchExplanation();
    }
  };

  const isSpeaking = isOpen && (isLoading || !!message);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, x: 20, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            style={{
              maxWidth: 280,
              background: "#0D1119",
              border: "1.5px solid #22D3EE",
              borderRadius: 14,
              padding: "12px 15px",
              fontSize: 13,
              color: "#CBD5E1",
              lineHeight: 1.55,
              boxShadow: "0 0 18px #22D3EE25, 0 4px 24px rgba(0,0,0,0.5)",
              position: "relative",
              pointerEvents: "auto",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {/* Bubble tail pointing right */}
            <div style={{
              position: "absolute",
              right: -8,
              bottom: 18,
              width: 0,
              height: 0,
              borderTop: "7px solid transparent",
              borderBottom: "7px solid transparent",
              borderLeft: "8px solid #22D3EE",
            }} />
            <div style={{
              position: "absolute",
              right: -6,
              bottom: 19,
              width: 0,
              height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderLeft: "7px solid #0D1119",
            }} />

            {/* Lumi label */}
            <div style={{
              fontSize: 10,
              color: "#22D3EE",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 6,
              opacity: 0.8,
            }}>
              Lumi
            </div>

            {isLoading && <TypingDots />}
            {!isLoading && message && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {message}
              </motion.span>
            )}
            {!isLoading && error && (
              <span style={{ color: "#F87171", fontSize: 12 }}>{error}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lumi avatar button */}
      <motion.button
        onClick={handleClick}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#080A0D",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: isSpeaking
            ? "0 0 0 2px #22D3EE, 0 0 24px #22D3EE50"
            : "0 0 0 2px #22D3EE60, 0 4px 16px rgba(0,0,0,0.6)",
          transition: "box-shadow 0.3s ease",
          pointerEvents: "auto",
        }}
        title={isOpen ? "Close Lumi" : "Ask Lumi to explain!"}
      >
        <LumiFace isSpeaking={isSpeaking} />
      </motion.button>
    </div>
  );
}
