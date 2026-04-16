import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { DIMS, OVERALL_DESC, QS } from "./assessment/constants";
import { getDetail, getLevel } from "./assessment/classification";
import { calcOverall, calcScores } from "./assessment/scoring";
import { validateWorkEmail } from "./assessment/validation";
import { clearCiamSession, loadCiamSession, saveCiamSession } from "./sessionStorage";

function AnimNum({ value, color }) {
  const [disp, setDisp] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const dur = 800;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      setDisp(Math.round((1 - Math.pow(1 - p, 3)) * value * 10) / 10);
      if (p < 1) ref.current = requestAnimationFrame(tick);
    }
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);

  return <span style={{ color, fontVariantNumeric: "tabular-nums" }}>{disp.toFixed(1)}</span>;
}

function motivationalLine(qi) {
  if (qi === 7) return "Almost there — just 3 to go!";
  if (qi === 8) return "Only 2 more questions!";
  if (qi === 9) return "Last one — you've got this!";
  return "\u00a0";
}

export default function App() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [step, setStep] = useState("intro");
  const [qi, setQi] = useState(0);
  const [ans, setAns] = useState({});
  const [sel, setSel] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [platform, setPlatform] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [emailDomainErr, setEmailDomainErr] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (searchParams.get("resume") !== "edit") return;
    const s = loadCiamSession();
    if (s?.ans && typeof s.ans === "object") {
      setAns(s.ans);
      setEmail(s.email || "");
      setRole(s.role || "");
      setPlatform(s.platform || "");
      setShowDetail(false);
      setQi(0);
      setSel(null);
      setStep("questions");
    }
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const cq = QS[qi];
  const progress = ((qi + 1) / QS.length) * 100;
  const dimLabel = DIMS.find((d) => d.key === cq?.dim)?.label;
  const scores = useMemo(() => calcScores(ans), [ans]);
  const overall = useMemo(() => calcOverall(scores), [scores]);
  const rd = scores.map((s) => ({ subject: s.short, score: s.score, fullMark: 5 }));
  const oLevel = getLevel(overall);
  const sorted = [...scores].sort((a, b) => a.score - b.score);

  function pick() {
    if (sel === null) return;
    const next = { ...ans, [qi]: sel };
    setAns(next);
    setSel(null);
    if (qi < QS.length - 1) setQi(qi + 1);
    else setStep("results_preview");
  }

  function back() {
    if (qi > 0) {
      setQi(qi - 1);
      setSel(ans[qi - 1] ?? null);
    }
  }

  function submitGate(e) {
    if (e) e.preventDefault();
    const validation = validateWorkEmail(email);
    setEmailErr(validation.emailErr);
    setEmailDomainErr(validation.domainErr);
    if (!validation.ok) return;
    setShowDetail(true);
    saveCiamSession({
      email: email.trim(),
      role,
      platform,
      ans,
      unlocked: true,
      unlockedAt: new Date().toISOString(),
      overall,
      scores: scores.map((s) => ({ key: s.key, score: s.score })),
    });
  }

  function goToContact() {
    saveCiamSession({
      email: email.trim(),
      role,
      platform,
      ans,
      unlocked: true,
      overall,
      scores: scores.map((s) => ({ key: s.key, score: s.score })),
    });
    navigate("/contact");
  }

  const sty = {
    page: { minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#0b1120" },
    card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 },
  };

  if (step === "intro") {
    return (
      <div style={{ ...sty.page, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2.5, color: "#60a5fa", textTransform: "uppercase", marginBottom: 20 }}>Free Assessment</div>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.15, margin: "0 0 14px" }}>How Healthy Is Your<br />CIAM Environment?</h1>
          <p style={{ fontSize: 15, color: "#8896b0", lineHeight: 1.65, margin: "0 auto 12px", maxWidth: 480 }}>
            10 scenario-based questions that reveal how your customer identity environment would perform under real-world pressure — from credential breaches to regulatory inquiries.
          </p>
          <p style={{ fontSize: 13, color: "#586a84", lineHeight: 1.6, margin: "0 auto 36px", maxWidth: 440 }}>
            This is a self-assessment based on your team's perspective. It won't replace a hands-on platform review — but it will show you where to look first.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320, margin: "0 auto 40px", textAlign: "left" }}>
            {DIMS.map((d) => (
              <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", ...sty.card }}>
                <span style={{ fontSize: 16, width: 22, textAlign: "center", color: "#60a5fa" }}>{d.icon}</span>
                <span style={{ fontSize: 13, color: "#cbd5e1" }}>{d.label}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { clearCiamSession(); setStep("questions"); }} style={{ padding: "15px 48px", fontSize: 16, fontWeight: 600, color: "#0b1120", background: "#60a5fa", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Start Assessment
          </button>
          <p style={{ fontSize: 12, color: "#4b5c78", marginTop: 16 }}>10 questions · Under 5 minutes · No account needed</p>
        </div>
      </div>
    );
  }

  if (step === "questions") {
    const micro = motivationalLine(qi);
    return (
      <div style={{ ...sty.page, padding: 24 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", paddingTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#60a5fa", textTransform: "uppercase" }}>{dimLabel}</span>
            <span data-testid="question-step-label" style={{ fontSize: 13, fontWeight: 600, color: "#8896b0" }}>
              Question {qi + 1} of {QS.length}
            </span>
          </div>
          <div style={{ minHeight: 40, marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.45, margin: 0 }}>{micro}</p>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 44 }}>
            <div data-testid="progress-bar" style={{ height: 3, background: "#60a5fa", borderRadius: 2, width: `${progress}%`, transition: "width 0.3s" }} />
          </div>
          <h2 style={{ fontSize: 19, fontWeight: 600, color: "#e8edf5", lineHeight: 1.45, margin: "0 0 28px" }}>{cq.q}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cq.opts.map((o, i) => {
              const on = sel === i;
              return (
                <button key={i} aria-label={`option-${i + 1}`} onClick={() => setSel(i)} style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 16px", textAlign: "left",
                  background: on ? "rgba(96,165,250,0.1)" : "rgba(255,255,255,0.02)",
                  border: on ? "1px solid rgba(96,165,250,0.4)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8, cursor: "pointer", transition: "all 0.12s"
                }}>
                  <span style={{ minWidth: 18, height: 18, borderRadius: 9, marginTop: 2, border: on ? "5px solid #60a5fa" : "2px solid #3b4a63", background: "transparent", boxSizing: "border-box" }} />
                  <span style={{ fontSize: 14, color: on ? "#dbe4f0" : "#8896b0", lineHeight: 1.5 }}>{o.t}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
            <button onClick={back} disabled={qi === 0} style={{ padding: "10px 22px", fontSize: 13, color: qi === 0 ? "#2a3548" : "#8896b0", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, cursor: qi === 0 ? "default" : "pointer" }}>Back</button>
            <button onClick={pick} disabled={sel === null} style={{ padding: "10px 30px", fontSize: 13, fontWeight: 600, color: sel === null ? "#3b4a63" : "#0b1120", background: sel === null ? "rgba(255,255,255,0.04)" : "#60a5fa", border: "none", borderRadius: 6, cursor: sel === null ? "default" : "pointer" }}>
              {qi === QS.length - 1 ? "See My Results" : "Next"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const lockedVisual = (
    <>
      <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 24, marginTop: 8 }}>
        <p style={{ fontSize: 12, color: "#586a84", lineHeight: 1.6, margin: 0, textAlign: "center" }}>
          These results reflect your team's <strong style={{ color: "#8896b0" }}>perception</strong> of your CIAM environment — not a technical assessment. Self-reported scores and actual platform reality often diverge, especially in Security and Compliance.
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2.5, color: "#60a5fa", textTransform: "uppercase", marginBottom: 16 }}>Your CIAM Health Profile</div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1 }}><AnimNum value={overall} color={oLevel.color} /><span style={{ fontSize: 22, color: "#3b4a63" }}> / 5.0</span></div>
        <div data-testid="level-badge" style={{ display: "inline-block", marginTop: 10, padding: "5px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, color: oLevel.color, background: oLevel.bg, border: `1px solid ${oLevel.border}` }}>{oLevel.label}</div>
        <p style={{ fontSize: 14, color: "#8896b0", lineHeight: 1.65, maxWidth: 520, margin: "14px auto 0" }}>{OVERALL_DESC[oLevel.label]}</p>
      </div>

      <div style={{ ...sty.card, padding: "20px 8px", marginBottom: 24, marginTop: 28 }}>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={rd} cx="50%" cy="50%">
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#8896b0", fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "#3b4a63", fontSize: 10 }} tickCount={6} />
            <Radar dataKey="score" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.15} strokeWidth={2} dot={{ r: 4, fill: "#60a5fa" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {scores.map((s) => {
          const lv = getLevel(s.score);
          const pct = (s.score / 5) * 100;
          const det = getDetail(s.key, s.score);
          return (
            <div key={s.key} style={{ ...sty.card, padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#dbe4f0" }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: lv.color }}>{s.score} · {lv.label}</span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, marginBottom: 10 }}>
                <div data-testid={`progress-${s.key}`} style={{ height: 5, background: lv.color, borderRadius: 3, width: `${pct}%`, transition: "width 0.6s ease-out" }} />
              </div>
              <p style={{ fontSize: 13, color: "#8896b0", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{det.headline}</p>
            </div>
          );
        })}
      </div>

      <div style={{ background: "rgba(96,165,250,0.06)", borderRadius: 12, border: "1px solid rgba(96,165,250,0.15)", padding: "20px 24px", marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#60a5fa", marginBottom: 8 }}>Where You're Most Exposed</div>
        <p style={{ fontSize: 14, color: "#c4cfdf", lineHeight: 1.65, margin: 0 }}>
          Based on your responses, <strong style={{ color: "#f1f5f9" }}>{sorted[0]?.label}</strong> ({sorted[0]?.score}/5.0) represents your greatest perceived exposure
          {sorted[1] && sorted[1].score < 4 && <>, followed by <strong style={{ color: "#f1f5f9" }}>{sorted[1]?.label}</strong> ({sorted[1]?.score}/5.0)</>}.
          {" "}Unlock below to see full detailed findings and what to focus on first.
        </p>
      </div>
    </>
  );

  return (
    <div style={{ ...sty.page, padding: 24 }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <div style={{ position: "relative", marginBottom: showDetail ? 0 : 0 }}>
          <div
            style={{
              filter: showDetail ? "none" : "blur(8px)",
              opacity: showDetail ? 1 : 0.5,
              transition: "filter 0.35s ease, opacity 0.35s ease",
              pointerEvents: showDetail ? "auto" : "none",
            }}
          >
            {lockedVisual}
          </div>

          {!showDetail && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                zIndex: 4,
                pointerEvents: "none",
              }}
            >
              <div style={{ ...sty.card, padding: "28px 28px 24px", marginBottom: 0, maxWidth: 440, width: "100%", pointerEvents: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.45)" }}>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <h3 data-testid="unlock-gate-heading" style={{ fontSize: 17, fontWeight: 600, color: "#f1f5f9", margin: "0 0 6px" }}>See your full results</h3>
                  <p style={{ fontSize: 13, color: "#6b7c96", margin: 0 }}>Unlock the detailed report on this page right after you confirm your work email — no waiting.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label htmlFor="work-email" style={{ display: "none" }}>Work email</label>
                  <input
                    id="work-email"
                    name="workEmail"
                    aria-label="work-email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailErr(false); setEmailDomainErr(false); }}
                    placeholder="Work email *"
                    style={{ padding: "11px 14px", fontSize: 14, background: "rgba(255,255,255,0.04)", border: (emailErr || emailDomainErr) ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f1f5f9", outline: "none" }}
                  />
                  {emailErr && <span style={{ fontSize: 11, color: "#ef4444", marginTop: -4 }}>Please enter a valid work email</span>}
                  {emailDomainErr && <span style={{ fontSize: 11, color: "#ef4444", marginTop: -4 }}>Please use your company email address (personal domains are not allowed)</span>}
                  <div style={{ display: "flex", gap: 10 }}>
                    <label htmlFor="role" style={{ display: "none" }}>Role</label>
                    <input id="role" name="role" aria-label="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Your role" style={{ flex: 1, padding: "11px 14px", fontSize: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f1f5f9", outline: "none" }} />
                  </div>
                  <label htmlFor="platform" style={{ display: "none" }}>Current CIAM platform</label>
                  <select id="platform" name="platform" aria-label="platform" value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ padding: "11px 14px", fontSize: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: platform ? "#f1f5f9" : "#586a84", outline: "none" }}>
                    <option value="">Current CIAM platform (optional)</option>
                    <option value="auth0">Auth0 / Okta CIC</option><option value="okta">Okta WIC</option><option value="ping">Ping Identity / ForgeRock</option><option value="cognito">AWS Cognito</option><option value="entra">Microsoft Entra External ID</option><option value="akamai">Akamai Identity Cloud</option><option value="sap">SAP CDC (Gigya)</option><option value="loginradius">LoginRadius</option><option value="custom">Custom / In-house</option><option value="multiple">Multiple platforms</option><option value="other">Other</option>
                  </select>
                  <button type="button" onClick={submitGate} style={{ padding: "13px", fontSize: 15, fontWeight: 600, color: "#0b1120", background: "#60a5fa", border: "none", borderRadius: 8, cursor: "pointer", marginTop: 4 }}>Unlock your results</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {showDetail && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#60a5fa", textTransform: "uppercase", marginBottom: 16 }}>Detailed Findings</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
              {scores.map((s) => {
                const lv = getLevel(s.score);
                const det = getDetail(s.key, s.score);
                return (
                  <div key={s.key} style={{ ...sty.card, padding: "22px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: "#e8edf5" }}>{s.label}</span>
                      <span style={{ padding: "3px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, color: lv.color, background: lv.bg, border: `1px solid ${lv.border}` }}>{s.score} · {lv.label}</span>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: "#586a84", textTransform: "uppercase", marginBottom: 4 }}>What This Means</div>
                      <p style={{ fontSize: 13, color: "#a0aec0", lineHeight: 1.65, margin: 0 }}>{det.insight}</p>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: "#586a84", textTransform: "uppercase", marginBottom: 4 }}>What We'd Look At Next</div>
                      <p style={{ fontSize: 13, color: "#a0aec0", lineHeight: 1.65, margin: 0 }}>{det.rec}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ ...sty.card, padding: "28px", textAlign: "center", marginBottom: 24, borderColor: "rgba(96,165,250,0.15)" }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: "#f1f5f9", margin: "0 0 10px" }}>What Would a Real Assessment Find?</h3>
              <p style={{ fontSize: 13, color: "#8896b0", lineHeight: 1.7, maxWidth: 540, margin: "0 auto 8px" }}>
                This self-assessment reveals where you <em>think</em> your gaps are. Our <strong style={{ color: "#dbe4f0" }}>CIAM Maturity Scorecard</strong> reveals where they <em>actually</em> are — through a hands-on review of your platform configuration, architecture, and compliance posture. Scored findings delivered in 5 business days, with the external credibility your board and auditors require.
              </p>
              <p style={{ fontSize: 13, color: "#586a84", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 24px" }}>
                Not sure if you need a full assessment? Talk to one of our CIAM specialists. We'll review your self-assessment results together and give you an honest recommendation — even if that recommendation is "you don't need us right now."
              </p>
              <button type="button" onClick={goToContact} style={{ padding: "14px 36px", fontSize: 15, fontWeight: 600, color: "#0b1120", background: "#60a5fa", border: "none", borderRadius: 8, cursor: "pointer" }}>
                Talk to a CIAM Specialist
              </button>
              <p style={{ fontSize: 11, color: "#3b4a63", marginTop: 10 }}>15-minute conversation · No commitment · We'll tell you if a deeper engagement makes sense</p>
            </div>
          </>
        )}
        <p style={{ fontSize: 11, color: "#1e293b", textAlign: "center", marginTop: 32, paddingBottom: 16 }}>
          CIAM Maturity Self-Assessment · Built by Next Reason · This tool provides directional guidance based on self-reported inputs and does not constitute a professional assessment.
        </p>
      </div>
    </div>
  );
}
