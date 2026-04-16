import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QS } from "./assessment/constants";
import { loadCiamSession, saveCiamSession } from "./sessionStorage";

const TIMEFRAME_OPTS = [
  { value: "", label: "Select timeframe" },
  { value: "immediate", label: "Immediately" },
  { value: "1-3", label: "1–3 months" },
  { value: "3-6", label: "3–6 months" },
  { value: "exploring", label: "Exploring options" },
];

const TEAM_OPTS = [
  { value: "", label: "Select team size" },
  { value: "solo", label: "Solo" },
  { value: "2-5", label: "2–5" },
  { value: "6-20", label: "6–20" },
  { value: "20plus", label: "20+" },
];

const COUNTRY_OPTS = [
  { value: "", label: "Select range" },
  { value: "1", label: "1" },
  { value: "2-5", label: "2–5" },
  { value: "6-20", label: "6–20" },
  { value: "20plus", label: "20+" },
];

const BACKOFFICE_OPTS = [
  { id: "erp", label: "ERP" },
  { id: "crm", label: "CRM" },
  { id: "hrms", label: "HRMS" },
  { id: "custom", label: "Custom" },
  { id: "other", label: "Other" },
];

export default function ContactPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");

  const [timeframe, setTimeframe] = useState("");
  const [budget, setBudget] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [countries, setCountries] = useState("");
  const [backOffice, setBackOffice] = useState(() => ({}));
  const [submitErr, setSubmitErr] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSession(loadCiamSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!session?.email || !session.unlocked) {
      navigate("/", { replace: true });
    }
  }, [hydrated, session, navigate]);

  useEffect(() => {
    if (!hydrated || !session?.email) return;
    const fn = searchParams.get("firstName");
    const ln = searchParams.get("lastName");
    const co = searchParams.get("company");
    if (fn) setFirstName(fn);
    if (ln) setLastName(ln);
    if (co) setCompany(co);
  }, [hydrated, session, searchParams]);

  const answerSummary = useMemo(() => {
    if (!session?.ans) return [];
    return QS.map((q, i) => {
      const idx = session.ans[i];
      if (idx === undefined) return null;
      const opt = q.opts[idx];
      return { n: i + 1, question: q.q, answer: opt?.t ?? "" };
    }).filter(Boolean);
  }, [session]);

  function toggleBackOffice(id) {
    setBackOffice((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function validate() {
    if (!firstName.trim() || !lastName.trim()) return false;
    if (!timeframe || !budget || !teamSize || !countries) return false;
    const anyBo = BACKOFFICE_OPTS.some((o) => backOffice[o.id]);
    if (!anyBo) return false;
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      setSubmitErr(true);
      return;
    }
    setSubmitErr(false);
    setSubmitting(true);

    const payload = {
      source: "ciam_health_tool_contact",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company.trim(),
      email: session.email,
      role: session.role || "",
      platform: session.platform || "",
      questionnaireAnswers: session.ans,
      qualifying: {
        timeframe,
        budgetApproval: budget,
        teamSize,
        countries,
        backOfficeSystems: BACKOFFICE_OPTS.filter((o) => backOffice[o.id]).map((o) => o.id),
      },
    };

    const endpoint = import.meta.env.VITE_LEAD_ENDPOINT;
    try {
      if (endpoint) {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        console.info("[CIAM] Lead payload (set VITE_LEAD_ENDPOINT to POST)", payload);
      }
      saveCiamSession({ ...session, contactSubmittedAt: new Date().toISOString() });
    } finally {
      setSubmitting(false);
    }
  }

  const sty = {
    page: { minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#0b1120", padding: 24 },
    card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 24, marginBottom: 20 },
    label: { fontSize: 12, fontWeight: 600, color: "#8896b0", marginBottom: 8, display: "block" },
    input: { width: "100%", padding: "11px 14px", fontSize: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "#f1f5f9", outline: "none", boxSizing: "border-box" },
  };

  if (!hydrated) return null;
  if (!session?.email || !session.unlocked) return null;

  return (
    <div style={sty.page}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Book your intro call</h1>
        <p style={{ fontSize: 14, color: "#8896b0", marginBottom: 28 }}>
          We'll use your answers to make sure the first conversation is relevant and specific to your situation.
        </p>

        <div style={sty.card}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#e8edf5", marginTop: 0 }}>Here's what you told us — does everything look right?</h2>
          <ul style={{ paddingLeft: 18, color: "#a0aec0", fontSize: 13, lineHeight: 1.6 }}>
            {answerSummary.map((row) => (
              <li key={row.n} style={{ marginBottom: 10 }}>
                <strong style={{ color: "#cbd5e1" }}>Q{row.n}:</strong> {row.question}
                <div style={{ color: "#8896b0", marginTop: 4 }}>→ {row.answer}</div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate("/?resume=edit")}
            style={{ marginTop: 12, padding: "10px 16px", fontSize: 13, color: "#60a5fa", background: "transparent", border: "1px solid rgba(96,165,250,0.35)", borderRadius: 6, cursor: "pointer" }}
          >
            Go back and edit my answers
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={sty.card}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#e8edf5", marginTop: 0 }}>Your details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label htmlFor="firstName" style={sty.label}>First name *</label>
                <input id="firstName" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={sty.input} required />
              </div>
              <div>
                <label htmlFor="lastName" style={sty.label}>Last name *</label>
                <input id="lastName" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} style={sty.input} required />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label htmlFor="company" style={sty.label}>Company</label>
              <input id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)} style={sty.input} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={sty.label}>Work email</label>
              <input value={session.email} readOnly style={{ ...sty.input, opacity: 0.85 }} />
            </div>
          </div>

          <div style={sty.card}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#e8edf5", marginTop: 0 }}>A few more questions</h2>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="timeframe" style={sty.label}>When are you looking to address this? *</label>
              <select id="timeframe" name="timeframe" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} style={sty.input} required>
                {TIMEFRAME_OPTS.map((o) => (
                  <option key={o.value || "empty"} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <fieldset style={{ border: "none", padding: 0, margin: "0 0 16px" }}>
              <legend style={{ ...sty.label, marginBottom: 8 }}>Has budget been approved for this? *</legend>
              {["yes", "in_progress", "not_yet"].map((v) => (
                <label key={v} style={{ display: "block", marginBottom: 6, color: "#cbd5e1", fontSize: 14, cursor: "pointer" }}>
                  <input type="radio" name="budget" value={v} checked={budget === v} onChange={() => setBudget(v)} style={{ marginRight: 8 }} />
                  {v === "yes" ? "Yes" : v === "in_progress" ? "In progress" : "Not yet"}
                </label>
              ))}
            </fieldset>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="teamSize" style={sty.label}>How large is your security/identity team? *</label>
              <select id="teamSize" name="teamSize" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} style={sty.input} required>
                {TEAM_OPTS.map((o) => (
                  <option key={o.value || "empty"} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="countries" style={sty.label}>How many countries do you operate in? *</label>
              <select id="countries" name="countries" value={countries} onChange={(e) => setCountries(e.target.value)} style={sty.input} required>
                {COUNTRY_OPTS.map((o) => (
                  <option key={o.value || "empty"} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend style={{ ...sty.label, marginBottom: 8 }}>Which systems require access to identity data? * (select all that apply)</legend>
              {BACKOFFICE_OPTS.map((o) => (
                <label key={o.id} style={{ display: "block", marginBottom: 6, color: "#cbd5e1", fontSize: 14, cursor: "pointer" }}>
                  <input type="checkbox" checked={!!backOffice[o.id]} onChange={() => toggleBackOffice(o.id)} style={{ marginRight: 8 }} />
                  {o.label}
                </label>
              ))}
            </fieldset>
          </div>

          {submitErr && (
            <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>Please complete all required fields.</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{ padding: "14px 28px", fontSize: 15, fontWeight: 600, color: "#0b1120", background: submitting ? "#475569" : "#60a5fa", border: "none", borderRadius: 8, cursor: submitting ? "default" : "pointer" }}
          >
            Book my intro call
          </button>
        </form>
      </div>
    </div>
  );
}
