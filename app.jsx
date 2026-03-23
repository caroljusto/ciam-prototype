
const DIMS = [
  { key: "architecture", label: "Identity Architecture", short: "Architecture", icon: "◇" },
  { key: "security", label: "Security Posture", short: "Security", icon: "◈" },
  { key: "operations", label: "Operational Maturity", short: "Operations", icon: "▣" },
  { key: "devex", label: "Developer Experience", short: "DevEx", icon: "⟐" },
  { key: "compliance", label: "Compliance Readiness", short: "Compliance", icon: "◉" },
];

const QS = [
  { dim: "architecture", q: "If a customer changes their email address today, how many systems need to be updated for that change to take effect everywhere?", opts: [
    { t: "We're not sure — it depends on the application", s: 1 },
    { t: "Multiple systems need manual or batch updates", s: 2 },
    { t: "Most systems sync from a central store, but a few still require separate updates", s: 3 },
    { t: "One change propagates automatically across every customer touchpoint", s: 4 },
  ]},
  { dim: "architecture", q: "If your CIAM platform went down for 30 minutes during peak hours, what would the customer impact be?", opts: [
    { t: "All customer-facing logins and registrations would stop completely", s: 1 },
    { t: "Most applications would be affected, though some have local session caches", s: 2 },
    { t: "Existing sessions would continue but new logins would fail across channels", s: 3 },
    { t: "Failover or multi-region redundancy would keep customer impact minimal", s: 4 },
  ]},
  { dim: "security", q: "If a database of 10 million stolen credentials was published tomorrow and included your customers' emails, what would happen?", opts: [
    { t: "We'd have no automated way to detect or respond to credential stuffing attacks", s: 1 },
    { t: "Rate limiting would slow attacks down, but we can't proactively check against breached credentials", s: 2 },
    { t: "We'd detect unusual login patterns and could force password resets for affected accounts", s: 3 },
    { t: "Breached password detection would automatically block compromised credentials and trigger step-up verification", s: 4 },
  ]},
  { dim: "security", q: "What percentage of your customer base currently uses anything stronger than a password to authenticate?", opts: [
    { t: "Less than 5% — MFA is not available or not promoted", s: 1 },
    { t: "5–20% — MFA is optional and available on some applications", s: 2 },
    { t: "20–60% — MFA is encouraged or required for sensitive operations", s: 3 },
    { t: "Over 60% — MFA is standard, with passwordless or passkeys actively adopted", s: 4 },
  ]},
  { dim: "operations", q: "When was the last time someone manually changed a CIAM configuration directly in production — and how would you know if they did?", opts: [
    { t: "Changes are regularly made in production, and there's no reliable audit trail", s: 1 },
    { t: "Some changes go through staging, but urgent fixes are applied directly in production", s: 2 },
    { t: "Most changes go through CI/CD, though admin console changes still happen occasionally", s: 3 },
    { t: "All changes are version-controlled with automated deployment, and direct production edits trigger alerts", s: 4 },
  ]},
  { dim: "operations", q: "If authentication failure rates doubled overnight, how quickly would your team know — and what would they do?", opts: [
    { t: "We'd likely find out from customer complaints or support tickets", s: 1 },
    { t: "We monitor uptime but don't have specific alerting on authentication failure rates", s: 2 },
    { t: "We'd see it in dashboards within hours and could investigate manually", s: 3 },
    { t: "Automated alerting would trigger within minutes, with runbooks for investigation and response", s: 4 },
  ]},
  { dim: "devex", q: "A new product team needs to add customer login to their application. What does that process look like?", opts: [
    { t: "They'll likely build their own auth integration — there's no shared approach", s: 1 },
    { t: "They can reference what other teams have done, but there's no standard pattern or documentation", s: 2 },
    { t: "Standardized SDKs and docs exist, though teams still need identity team support to get started", s: 3 },
    { t: "Self-service — templates, documentation, sandbox environments, and they can ship in a day", s: 4 },
  ]},
  { dim: "devex", q: "How confident are you that every application integrating with your CIAM platform is doing so correctly and securely?", opts: [
    { t: "Not confident — each team implemented their own way and we haven't audited them", s: 1 },
    { t: "We trust the teams that built them, but haven't systematically reviewed integration quality", s: 2 },
    { t: "We've reviewed the major applications, but newer or smaller apps haven't been audited", s: 3 },
    { t: "Automated checks validate integration patterns, and all apps go through identity security review before launch", s: 4 },
  ]},
  { dim: "compliance", q: "A customer emails asking for a complete copy of all personal data you hold about them. You have 30 days. What happens?", opts: [
    { t: "It would be a significant scramble — we're not sure we'd find everything in time", s: 1 },
    { t: "We could do it, but it requires manual work across multiple systems and teams", s: 2 },
    { t: "We have a defined process, but it's partially manual and depends on specific people being available", s: 3 },
    { t: "Automated or self-service — the customer can export their data directly, or we can fulfill it within days", s: 4 },
  ]},
  { dim: "compliance", q: "If a regulator asked you to prove exactly what customer consent you collected, when, and for what purpose — could you produce that evidence today?", opts: [
    { t: "No — we capture consent at registration but don't maintain a versioned, auditable record", s: 1 },
    { t: "We have consent records, but they may not cover all data processing activities or be easily exportable", s: 2 },
    { t: "Consent is tracked with timestamps and purposes, though producing a complete audit package would take effort", s: 3 },
    { t: "Granular consent records with full audit trail, version history, and export-ready reporting", s: 4 },
  ]},
];

const LEVELS = [
  { min: 0, max: 1.5, label: "Initial", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
  { min: 1.5, max: 2.5, label: "Developing", color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.25)" },
  { min: 2.5, max: 3.5, label: "Established", color: "#eab308", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.25)" },
  { min: 3.5, max: 4.01, label: "Advanced", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" },
];

const OVERALL_DESC = {
  Initial: "Your responses suggest significant gaps across multiple dimensions that likely expose the organization to security risk, compliance exposure, and poor customer experience. Environments at this level often carry hidden costs in support overhead, incident response, and technical debt.",
  Developing: "Foundations are in place but your environment appears to be reactive rather than proactive. Organizations at this stage typically discover, during an expert review, that the gaps between what they believe is working and what's actually configured are wider than expected — particularly in security and compliance.",
  Established: "Solid practices across most dimensions, with specific areas where automation, enforcement, or coverage gaps may create hidden exposure. At this level, the highest-value insight usually comes from validating whether your actual platform configuration matches your intended policies.",
  Advanced: "Your responses indicate a mature environment. Even at this level, expert-led assessments typically uncover configuration drift, edge cases in compliance enforcement, or optimization opportunities that internal teams don't have the bandwidth to identify.",
};

const DIM_DETAIL = {
  architecture: {
    low: { headline: "Identity fragmentation is compounding risk and cost", insight: "When customer identity data lives in multiple disconnected stores, every system that's out of sync is a potential security gap, a compliance liability, and a source of customer friction. This is the most expensive dimension to fix retroactively — the longer fragmentation persists, the deeper the technical debt.", rec: "The first step is mapping every system that stores or processes customer identity data and understanding which are authoritative, which are stale, and which create contradictions. This mapping exercise is a core component of the CIAM Maturity Scorecard." },
    mid: { headline: "Partial centralization creates a false sense of control", insight: "Having most identities centralized while some applications remain disconnected is often more dangerous than full fragmentation — because the gaps are less visible. Teams assume the central platform is the complete picture, but edge cases and legacy integrations quietly accumulate risk.", rec: "An expert-led architecture review can identify which systems sit outside your central CIAM, what data they hold, and whether they create compliance or security exposure that your team hasn't quantified." },
    high: { headline: "Strong foundation — focus shifts to resilience and scale", insight: "Unified architecture and redundancy are in place. At this maturity level, the focus typically shifts to multi-region data residency, B2B federation complexity, platform capacity planning, and ensuring your architecture can absorb future requirements without structural changes.", rec: "Periodic validation that your architecture matches your growth trajectory — including M&A scenarios, new customer segments, and regulatory expansion — is where most advanced organizations find value in external review." },
  },
  security: {
    low: { headline: "Your customers are more exposed than you may realize", insight: "Credential stuffing and account takeover are the most common attack vectors in consumer-facing environments. Without MFA adoption and breach detection, your customer accounts rely entirely on passwords your customers likely reuse across dozens of other services — many of which have already been breached.", rec: "Understanding your actual attack surface — not just what controls exist, but whether they're configured effectively and covering all applications — is critical. The CIAM Maturity Scorecard evaluates security controls at the platform configuration level, not just policy documentation." },
    mid: { headline: "Basic defenses in place, but modern threats require adaptive response", insight: "Static security policies can't keep up with AI-driven credential attacks, MFA bypass techniques, and session hijacking. The gap between 'we have MFA available' and 'MFA is effectively protecting our customers' is often larger than teams expect — particularly when adoption rates are uneven across applications.", rec: "A configuration-level security review can reveal whether your platform's adaptive capabilities are properly configured and whether there are applications or user segments that fall outside your security perimeter." },
    high: { headline: "Strong posture — continuous validation is the next step", insight: "At advanced maturity, the biggest security risks tend to come from configuration drift over time, rather than missing capabilities. Token lifetimes that were appropriate at launch may now be too permissive. Attack protection rules that made sense for your original user base may not fit your current traffic patterns.", rec: "Even mature environments benefit from periodic external validation — particularly after platform upgrades, new application launches, or changes in your threat landscape." },
  },
  operations: {
    low: { headline: "Manual operations amplify both risk and cost", insight: "When CIAM changes happen directly in production without version control, the question isn't whether an unintended change will cause an incident — it's when. Without observability, the incident will be detected by your customers before your team. Every hour of customer-facing downtime or degradation carries direct revenue and trust costs.", rec: "The CIAM Maturity Scorecard evaluates not just whether monitoring exists, but whether it's measuring the right signals — authentication failure rates, latency percentiles, configuration change frequency — and whether alerting thresholds are calibrated to your actual traffic patterns." },
    mid: { headline: "Processes exist but gaps between environments create hidden risk", insight: "The most common operational risk at this stage is drift between what's deployed in staging and what's actually running in production. Urgent fixes, admin console changes, and manual configuration adjustments accumulate over time and create a production environment that no longer matches your documented architecture.", rec: "An external assessment can compare your documented operational processes against your actual platform state — surfacing the drift that internal teams often normalize over time." },
    high: { headline: "Mature operations — optimization focus", insight: "Automated deployment, comprehensive observability, and defined operational processes are in place. Optimization opportunities at this stage typically involve reducing mean time to detection, automating incident response for common scenarios, and ensuring operational procedures keep pace with platform changes.", rec: "At this maturity level, the value of external review comes from benchmarking your operational practices against what we see across the industry — particularly around emerging best practices in identity-specific observability and incident response." },
  },
  devex: {
    low: { headline: "Every new application is a new identity risk", insight: "When development teams build custom auth integrations without shared patterns, each application becomes a unique security surface that hasn't been vetted against a common standard. Integration inconsistencies aren't just an engineering velocity problem — they're a security problem. The application with the weakest identity implementation defines your actual security posture.", rec: "The CIAM Maturity Scorecard includes a review of how applications integrate with your CIAM platform, identifying inconsistencies, deprecated patterns, and integration-level vulnerabilities that aren't visible from the platform admin console alone." },
    mid: { headline: "Standards exist on paper but enforcement varies", insight: "Having SDKs and documentation is a good foundation, but without systematic review of how teams actually implement them, standards drift over time. Newer applications may follow the patterns, while older applications — often the ones handling the most traffic and sensitive data — remain on legacy integration approaches.", rec: "An expert review can map which applications follow your current standards and which are technical debt — and quantify the risk exposure from the ones that aren't." },
    high: { headline: "Identity is a platform capability — keep validating", insight: "Self-service developer workflows and automated integration validation put you ahead of most organizations. The focus at this stage is typically ensuring that your platform keeps pace with developer expectations — new frameworks, new deployment models, new authentication patterns — without creating tech debt.", rec: "External benchmarking against industry-leading developer identity experiences can highlight where your platform still creates unnecessary friction for engineering teams." },
  },
  compliance: {
    low: { headline: "Regulatory exposure likely exceeds your current awareness", insight: "The gap between 'we collect consent at registration' and 'we can prove to a regulator exactly what consent we collected, when, for what purpose, and that we've honored it consistently' is where regulatory fines and litigation risk live. Most organizations at this stage discover during a formal assessment that their actual compliance posture is significantly weaker than what their policies describe.", rec: "The CIAM Maturity Scorecard maps your regulatory obligations based on industry and customer geography, then evaluates whether your CIAM platform's configuration actually supports those requirements — not just whether policies exist." },
    mid: { headline: "Major requirements addressed, but enforcement gaps are likely", insight: "Consent is tracked and DSR processes exist, but the question is whether enforcement is end-to-end. If a customer revokes consent for marketing data processing, does your CIAM platform actually prevent downstream systems from using that data? In our experience, this is where most organizations at this stage find gaps they hadn't considered.", rec: "A hands-on compliance review can test whether your consent and DSR workflows actually enforce what they claim — including edge cases like partial consent revocation, cross-jurisdictional requirements, and data retention conflicts." },
    high: { headline: "Strong compliance foundation — focus on emerging requirements", insight: "Granular consent management and automated DSR fulfillment are in place. At this maturity level, the focus typically shifts to emerging regulations in new markets, the intersection of AI and identity data processing, evolving cross-border data transfer requirements, and audit evidence automation.", rec: "Periodic external validation ensures your compliance posture keeps pace with regulatory changes — particularly as you expand to new customer geographies or introduce new data processing capabilities." },
  },
};

function getLevel(s) { return LEVELS.find(l => s >= l.min && s < l.max) || LEVELS[0]; }
function getDetail(dim, s) { return s <= 2 ? DIM_DETAIL[dim].low : s <= 3 ? DIM_DETAIL[dim].mid : DIM_DETAIL[dim].high; }
const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "mail.com",
  "zoho.com",
]);

function AnimNum({ value, color }) {
  const [disp, setDisp] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const dur = 800, t0 = performance.now();
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

function App() {
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

  const cq = QS[qi];
  const progress = ((qi + 1) / QS.length) * 100;
  const dimLabel = DIMS.find(d => d.key === cq?.dim)?.label;

  function pick() {
    if (sel === null) return;
    const n = { ...ans, [qi]: sel };
    setAns(n);
    setSel(null);
    if (qi < QS.length - 1) setQi(qi + 1);
    else setStep("results_preview");
  }
  function back() { if (qi > 0) { setQi(qi - 1); setSel(ans[qi - 1] ?? null); } }

  const scores = useMemo(() => {
    const g = {}; DIMS.forEach(d => g[d.key] = []);
    QS.forEach((q, i) => { if (ans[i] !== undefined) g[q.dim].push(q.opts[ans[i]].s); });
    return DIMS.map(d => {
      const a = g[d.key]; const avg = a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
      return { ...d, score: Math.round(avg * 10) / 10 };
    });
  }, [ans]);

  const overall = useMemo(() => {
    const v = scores.map(s => s.score).filter(Boolean);
    return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : 0;
  }, [scores]);

  const rd = scores.map(s => ({ subject: s.short, score: s.score, fullMark: 4 }));
  const oLevel = getLevel(overall);
  const sorted = [...scores].sort((a, b) => a.score - b.score);

  function submitGate(e) {
    if (e) e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!emailIsValid) {
      setEmailErr(true);
      setEmailDomainErr(false);
      return;
    }
    const domain = normalizedEmail.split("@")[1] || "";
    if (PERSONAL_EMAIL_DOMAINS.has(domain)) {
      setEmailErr(false);
      setEmailDomainErr(true);
      return;
    }
    setEmailErr(false);
    setEmailDomainErr(false);
    setShowDetail(true);
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
          <h1 style={{ fontSize: 34, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.15, margin: "0 0 14px" }}>How Healthy Is Your<br/>CIAM Environment?</h1>
          <p style={{ fontSize: 15, color: "#8896b0", lineHeight: 1.65, margin: "0 auto 12px", maxWidth: 480 }}>
            10 scenario-based questions that reveal how your customer identity environment would perform under real-world pressure — from credential breaches to regulatory inquiries.
          </p>
          <p style={{ fontSize: 13, color: "#586a84", lineHeight: 1.6, margin: "0 auto 36px", maxWidth: 440 }}>
            This is a self-assessment based on your team's perspective. It won't replace a hands-on platform review — but it will show you where to look first.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320, margin: "0 auto 40px", textAlign: "left" }}>
            {DIMS.map(d => (
              <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", ...sty.card }}>
                <span style={{ fontSize: 16, width: 22, textAlign: "center", color: "#60a5fa" }}>{d.icon}</span>
                <span style={{ fontSize: 13, color: "#cbd5e1" }}>{d.label}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setStep("questions")} style={{ padding: "15px 48px", fontSize: 16, fontWeight: 600, color: "#0b1120", background: "#60a5fa", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Start Assessment
          </button>
          <p style={{ fontSize: 12, color: "#4b5c78", marginTop: 16 }}>10 questions · Under 5 minutes · No account needed</p>
        </div>
      </div>
    );
  }

  if (step === "questions") {
    return (
      <div style={{ ...sty.page, padding: 24 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", paddingTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#60a5fa", textTransform: "uppercase" }}>{dimLabel}</span>
            <span style={{ fontSize: 12, color: "#4b5c78" }}>{qi + 1}/{QS.length}</span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 44 }}>
            <div style={{ height: 3, background: "#60a5fa", borderRadius: 2, width: `${progress}%`, transition: "width 0.3s" }} />
          </div>
          <h2 style={{ fontSize: 19, fontWeight: 600, color: "#e8edf5", lineHeight: 1.45, margin: "0 0 28px" }}>{cq.q}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cq.opts.map((o, i) => {
              const on = sel === i;
              return (
                <button key={i} onClick={() => setSel(i)} style={{
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

  return (
    <div style={{ ...sty.page, padding: 24 }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 24, marginTop: 8 }}>
          <p style={{ fontSize: 12, color: "#586a84", lineHeight: 1.6, margin: 0, textAlign: "center" }}>
            These results reflect your team's <strong style={{ color: "#8896b0" }}>perception</strong> of your CIAM environment — not a technical assessment. Self-reported scores and actual platform reality often diverge, especially in Security and Compliance.
          </p>
        </div>

        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2.5, color: "#60a5fa", textTransform: "uppercase", marginBottom: 16 }}>Your CIAM Health Profile</div>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1 }}><AnimNum value={overall} color={oLevel.color} /><span style={{ fontSize: 22, color: "#3b4a63" }}> / 4.0</span></div>
          <div style={{ display: "inline-block", marginTop: 10, padding: "5px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, color: oLevel.color, background: oLevel.bg, border: `1px solid ${oLevel.border}` }}>{oLevel.label}</div>
          <p style={{ fontSize: 14, color: "#8896b0", lineHeight: 1.65, maxWidth: 520, margin: "14px auto 0" }}>{OVERALL_DESC[oLevel.label]}</p>
        </div>

        <div style={{ ...sty.card, padding: "20px 8px", marginBottom: 24, marginTop: 28 }}>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={rd} cx="50%" cy="50%">
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#8896b0", fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 4]} tick={{ fill: "#3b4a63", fontSize: 10 }} tickCount={5} />
              <Radar dataKey="score" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.15} strokeWidth={2} dot={{ r: 4, fill: "#60a5fa" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {scores.map(s => {
            const lv = getLevel(s.score);
            const pct = (s.score / 4) * 100;
            const det = getDetail(s.key, s.score);
            return (
              <div key={s.key} style={{ ...sty.card, padding: "18px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#dbe4f0" }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: lv.color }}>{s.score} · {lv.label}</span>
                </div>
                <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, marginBottom: 10 }}>
                  <div style={{ height: 5, background: lv.color, borderRadius: 3, width: `${pct}%`, transition: "width 0.6s ease-out" }} />
                </div>
                <p style={{ fontSize: 13, color: "#8896b0", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{det.headline}</p>
              </div>
            );
          })}
        </div>

        <div style={{ background: "rgba(96,165,250,0.06)", borderRadius: 12, border: "1px solid rgba(96,165,250,0.15)", padding: "20px 24px", marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#60a5fa", marginBottom: 8 }}>Where You're Most Exposed</div>
          <p style={{ fontSize: 14, color: "#c4cfdf", lineHeight: 1.65, margin: 0 }}>
            Based on your responses, <strong style={{ color: "#f1f5f9" }}>{sorted[0]?.label}</strong> ({sorted[0]?.score}/4.0) represents your greatest perceived exposure
            {sorted[1] && sorted[1].score < 3.5 && <>, followed by <strong style={{ color: "#f1f5f9" }}>{sorted[1]?.label}</strong> ({sorted[1]?.score}/4.0)</>}.
            {" "}Unlock the detailed findings below to understand what these scores mean and what to focus on first.
          </p>
        </div>

        {!showDetail && (
          <div style={{ ...sty.card, padding: "28px 28px 24px", marginBottom: 32 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: "#f1f5f9", margin: "0 0 6px" }}>Unlock Your Detailed Findings</h3>
              <p style={{ fontSize: 13, color: "#6b7c96", margin: 0 }}>Get the full analysis: what each score means for your business, where the real risks are, and what to prioritize.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 440, margin: "0 auto" }}>
              <input value={email} onChange={e => { setEmail(e.target.value); setEmailErr(false); setEmailDomainErr(false); }} placeholder="Work email *" style={{ padding: "11px 14px", fontSize: 14, background: "rgba(255,255,255,0.04)", border: (emailErr || emailDomainErr) ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f1f5f9", outline: "none" }} />
              {emailErr && <span style={{ fontSize: 11, color: "#ef4444", marginTop: -4 }}>Please enter a valid work email</span>}
              {emailDomainErr && <span style={{ fontSize: 11, color: "#ef4444", marginTop: -4 }}>Please use your company email address (personal domains are not allowed)</span>}
              <div style={{ display: "flex", gap: 10 }}>
                <input value={role} onChange={e => setRole(e.target.value)} placeholder="Your role" style={{ flex: 1, padding: "11px 14px", fontSize: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f1f5f9", outline: "none" }} />
              </div>
              <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ padding: "11px 14px", fontSize: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: platform ? "#f1f5f9" : "#586a84", outline: "none" }}>
                <option value="">Current CIAM platform (optional)</option>
                <option value="auth0">Auth0 / Okta CIC</option><option value="okta">Okta WIC</option><option value="ping">Ping Identity / ForgeRock</option><option value="cognito">AWS Cognito</option><option value="entra">Microsoft Entra External ID</option><option value="akamai">Akamai Identity Cloud</option><option value="sap">SAP CDC (Gigya)</option><option value="loginradius">LoginRadius</option><option value="custom">Custom / In-house</option><option value="multiple">Multiple platforms</option><option value="other">Other</option>
              </select>
              <button onClick={submitGate} style={{ padding: "13px", fontSize: 15, fontWeight: 600, color: "#0b1120", background: "#60a5fa", border: "none", borderRadius: 8, cursor: "pointer", marginTop: 4 }}>Unlock Detailed Findings</button>
              <p style={{ fontSize: 11, color: "#3b4a63", textAlign: "center", margin: 0 }}>We'll also email you a copy of your results. No spam.</p>
            </div>
          </div>
        )}

        {showDetail && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#60a5fa", textTransform: "uppercase", marginBottom: 16 }}>Detailed Findings</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
              {scores.map(s => {
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
              <button onClick={() => window.open("https://nextreason.com/contact", "_blank")} style={{ padding: "14px 36px", fontSize: 15, fontWeight: 600, color: "#0b1120", background: "#60a5fa", border: "none", borderRadius: 8, cursor: "pointer" }}>
                Talk to a CIAM Specialist
              </button>
              <p style={{ fontSize: 11, color: "#3b4a63", marginTop: 10 }}>15-minute conversation · No commitment · We'll tell you if a deeper engagement makes sense</p>
            </div>
          </>
        )}

        <p style={{ fontSize: 11, color: "#1e293b", textAlign: "center", marginTop: 32, paddingBottom: 16 }}>CIAM Maturity Self-Assessment · Built by Next Reason · This tool provides directional guidance based on self-reported inputs and does not constitute a professional assessment.</p>
      </div>
    </div>
  );
}