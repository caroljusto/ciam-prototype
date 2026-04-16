export const DIMS = [
  { key: "architecture", label: "Identity Architecture", short: "Architecture", icon: "◇" },
  { key: "security", label: "Security Posture", short: "Security", icon: "◈" },
  { key: "operations", label: "Operational Maturity", short: "Operations", icon: "▣" },
  { key: "devex", label: "Developer Experience", short: "DevEx", icon: "⟐" },
  { key: "compliance", label: "Compliance Readiness", short: "Compliance", icon: "◉" },
];

export const QS = [
  { dim: "architecture", q: "If a customer changes their email address today, how many systems need to be updated for that change to take effect everywhere?", opts: [
    { t: "We're not sure — it depends on the application", s: 1 },
    { t: "Multiple systems need manual or batch updates", s: 2 },
    { t: "Most systems sync from a central store, but a few still require separate updates", s: 3 },
    { t: "One change propagates automatically across every customer touchpoint", s: 4 },
    { t: "Customer identity is unified globally with near real-time consistency and no duplicate records", s: 5 },
  ]},
  { dim: "architecture", q: "If your CIAM platform went down for 30 minutes during peak hours, what would the customer impact be?", opts: [
    { t: "All customer-facing logins and registrations would stop completely", s: 1 },
    { t: "Most applications would be affected, though some have local session caches", s: 2 },
    { t: "Existing sessions would continue but new logins would fail across channels", s: 3 },
    { t: "Failover or multi-region redundancy would keep customer impact minimal", s: 4 },
    { t: "Active-active multi-region with failover tested through regular DR drills — our last test showed zero customer-visible disruption.", s: 5 },
  ]},
  { dim: "security", q: "Beyond the immediate hit to brand value and customer trust, what are you most concerned about if millions of customer credentials tied to your brand were stolen and published online?", opts: [
    { t: "Brand and reputational damage would dominate headlines — we'd have no automated way to detect or respond to credential stuffing attacks", s: 1 },
    { t: "Trust and brand equity would take a serious hit — rate limiting would slow attacks, but we can't proactively check against breached credentials", s: 2 },
    { t: "We'd prioritize rebuilding customer confidence while detecting unusual login patterns and forcing password resets for affected accounts", s: 3 },
    { t: "Breached password detection would automatically block compromised credentials and trigger step-up verification to protect brand-impacting accounts", s: 4 },
    { t: "Real-time risk detection would block attacks across channels with adaptive controls and automated incident workflows — limiting brand and regulatory exposure", s: 5 },
  ]},
  { dim: "security", q: "What percentage of your customer base currently uses anything stronger than a password to authenticate?", opts: [
    { t: "Less than 5% — MFA is not available or not promoted", s: 1 },
    { t: "5–20% — MFA is optional and available on some applications", s: 2 },
    { t: "20–60% — MFA is encouraged or required for sensitive operations", s: 3 },
    { t: "Over 60% — MFA is standard, with passwordless or passkeys actively adopted", s: 4 },
    { t: "Over 85% — passwordless or phishing-resistant MFA is the default experience across all customer journeys", s: 5 },
  ]},
  { dim: "operations", q: "When was the last time someone manually changed a CIAM configuration directly in production — and how would you know if they did?", opts: [
    { t: "Changes are regularly made in production, and there's no reliable audit trail", s: 1 },
    { t: "Some changes go through staging, but urgent fixes are applied directly in production", s: 2 },
    { t: "Most changes go through CI/CD, though admin console changes still happen occasionally", s: 3 },
    { t: "All changes are version-controlled with automated deployment, and direct production edits trigger alerts", s: 4 },
    { t: "Production is fully policy-guarded: all changes are automated, approved, immutable, and continuously monitored for drift", s: 5 },
  ]},
  { dim: "operations", q: "If authentication failure rates doubled overnight, how quickly would your team know — and what would they do?", opts: [
    { t: "We'd likely find out from customer complaints or support tickets", s: 1 },
    { t: "We monitor uptime but don't have specific alerting on authentication failure rates", s: 2 },
    { t: "We'd see it in dashboards within hours and could investigate manually", s: 3 },
    { t: "Automated alerting would trigger within minutes, with runbooks for investigation and response", s: 4 },
    { t: "Detection triggers automated remediation through identity-specific playbooks, executed within minutes and audited end-to-end.", s: 5 },
  ]},
  { dim: "devex", q: "A new product team needs to add customer login to their application. What does that process look like?", opts: [
    { t: "They'll likely build their own auth integration — there's no shared approach", s: 1 },
    { t: "They can reference what other teams have done, but there's no standard pattern or documentation", s: 2 },
    { t: "Standardized SDKs and docs exist, though teams still need identity team support to get started", s: 3 },
    { t: "Self-service — templates, documentation, sandbox environments, and they can ship in a day", s: 4 },
    { t: "Fully productized platform experience — teams integrate through golden paths with automated security and compliance checks by default", s: 5 },
  ]},
  { dim: "devex", q: "How confident are you that every application integrating with your CIAM platform is doing so correctly and securely?", opts: [
    { t: "Not confident — each team implemented their own way and we haven't audited them", s: 1 },
    { t: "We trust the teams that built them, but haven't systematically reviewed integration quality", s: 2 },
    { t: "We've reviewed the major applications, but newer or smaller apps haven't been audited", s: 3 },
    { t: "Automated checks validate integration patterns, and all apps go through identity security review before launch", s: 4 },
    { t: "Continuous compliance validation covers all applications in production with enforced controls and automated remediation workflows", s: 5 },
  ]},
  { dim: "compliance", q: "A customer emails asking for a complete copy of all personal data you hold about them. You have 30 days. What happens?", opts: [
    { t: "It would be a significant scramble — we're not sure we'd find everything in time", s: 1 },
    { t: "We could do it, but it requires manual work across multiple systems and teams", s: 2 },
    { t: "We have a defined process, but it's partially manual and depends on specific people being available", s: 3 },
    { t: "Automated or self-service — the customer can export their data directly, or we can fulfill it within days", s: 4 },
    { t: "End-to-end automated DSR workflows provide complete, verifiable responses within hours across all systems", s: 5 },
  ]},
  { dim: "compliance", q: "If a regulator asked you to prove exactly what customer consent you collected, when, and for what purpose — could you produce that evidence today?", opts: [
    { t: "No — we capture consent at registration but don't maintain a versioned, auditable record", s: 1 },
    { t: "We have consent records, but they may not cover all data processing activities or be easily exportable", s: 2 },
    { t: "Consent is tracked with timestamps and purposes, though producing a complete audit package would take effort", s: 3 },
    { t: "Granular consent records with full audit trail, version history, and export-ready reporting", s: 4 },
    { t: "Regulator-ready evidence is continuously maintained with policy-to-enforcement traceability across all processing activities", s: 5 },
  ]},
];

export const LEVELS = [
  { min: 1, max: 1.5, label: "Initial", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
  { min: 1.5, max: 2.5, label: "Developing", color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.25)" },
  { min: 2.5, max: 3.5, label: "Established", color: "#eab308", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.25)" },
  { min: 3.5, max: 4.5, label: "Advanced", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)" },
  { min: 4.5, max: 5.01, label: "Leading", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" },
];

export const OVERALL_DESC = {
  Initial: "Your responses suggest significant gaps across multiple dimensions that likely expose the organization to security risk, compliance exposure, and poor customer experience. Environments at this level often carry hidden costs in support overhead, incident response, and technical debt.",
  Developing: "Foundations are in place but your environment appears to be reactive rather than proactive. Organizations at this stage typically discover, during an expert review, that the gaps between what they believe is working and what's actually configured are wider than expected — particularly in security and compliance.",
  Established: "Solid practices across most dimensions, with specific areas where automation, enforcement, or coverage gaps may create hidden exposure. At this level, the highest-value insight usually comes from validating whether your actual platform configuration matches your intended policies.",
  Advanced: "Your responses indicate a mature environment. Even at this level, expert-led assessments typically uncover configuration drift, edge cases in compliance enforcement, or optimization opportunities that internal teams don't have the bandwidth to identify.",
  Leading: "Your responses indicate a high-performing identity program with strong operational discipline. Even leading teams benefit from periodic external validation to challenge assumptions, test resilience under stress, and identify optimization opportunities that internal teams may not prioritize.",
};

export const DIM_DETAIL = {
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

export const PERSONAL_EMAIL_DOMAINS = new Set([
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
