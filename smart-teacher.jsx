import { useState, useEffect, useRef } from "react";

const PLANS = [
  {
    id: "teacher",
    name: "Teacher",
    price: 10,
    period: "month",
    accounts: "1 account",
    color: "#4ECDC4",
    accent: "#2BB5AC",
    icon: "👩‍🏫",
    features: [
      "1 teacher account",
      "AI assignment generator",
      "Essay AI & plagiarism checker",
      "Up to 30 students per class",
      "Assignment analytics",
      "Email support",
    ],
  },
  {
    id: "group",
    name: "Group",
    price: 40,
    period: "month",
    accounts: "5 accounts",
    color: "#6C63FF",
    accent: "#5A52E0",
    icon: "👥",
    popular: true,
    features: [
      "5 teacher accounts",
      "AI assignment generator",
      "Essay AI & plagiarism checker",
      "Up to 150 students total",
      "Shared assignment library",
      "Priority email support",
      "Department analytics",
    ],
  },
  {
    id: "school",
    name: "School",
    price: 130,
    period: "month",
    accounts: "Up to 50 accounts",
    color: "#FF6B6B",
    accent: "#E55A5A",
    icon: "🏫",
    features: [
      "Up to 50 teacher accounts",
      "AI assignment generator",
      "Essay AI & plagiarism checker",
      "Unlimited students",
      "School-wide analytics",
      "Admin dashboard",
      "Phone & email support",
      "Custom branding",
    ],
  },
  {
    id: "institution",
    name: "Institution",
    price: 400,
    period: "month",
    accounts: "Unlimited accounts",
    color: "#F7B731",
    accent: "#E0A220",
    icon: "🎓",
    features: [
      "Unlimited teacher accounts",
      "AI assignment generator",
      "Essay AI & plagiarism checker",
      "Unlimited students",
      "District-wide analytics",
      "Dedicated account manager",
      "24/7 priority support",
      "API access",
      "SSO integration",
      "Custom AI training",
    ],
  },
];

const FEATURES = [
  {
    icon: "✍️",
    title: "AI Assignment Builder",
    desc: "Generate custom assignments, rubrics, and lesson plans in seconds. Tailored to grade level, subject, and learning objectives.",
  },
  {
    icon: "🔍",
    title: "AI & Plagiarism Detection",
    desc: "Instantly detect AI-generated content and plagiarism across essays and submissions with detailed, citable reports.",
  },
  {
    icon: "📊",
    title: "Student Analytics",
    desc: "Track student performance trends over time and identify who needs help before they fall behind.",
  },
  {
    icon: "📚",
    title: "Assignment Library",
    desc: "Access thousands of pre-built, teacher-approved assignments across all subjects and grade levels.",
  },
  {
    icon: "⚡",
    title: "Instant Feedback",
    desc: "Provide students with structured AI feedback on drafts, freeing you to focus on deeper instruction.",
  },
  {
    icon: "🔗",
    title: "LMS Integration",
    desc: "Seamlessly connect with Google Classroom, Canvas, Schoology, and more with one-click sync.",
  },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [payForm, setPayForm] = useState({ card: "", expiry: "", cvv: "", name: "" });
  const [payError, setPayError] = useState("");
  const [paySuccess, setPaySuccess] = useState(false);
  const [users, setUsers] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
    setAuthError("");
    setPayError("");
    setPaySuccess(false);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (authMode === "register") {
      if (!authForm.name || !authForm.email || !authForm.password) {
        setAuthError("Please fill in all fields.");
        return;
      }
      if (authForm.password.length < 6) {
        setAuthError("Password must be at least 6 characters.");
        return;
      }
      if (users[authForm.email]) {
        setAuthError("An account with this email already exists.");
        return;
      }
      const newUser = { name: authForm.name, email: authForm.email, password: authForm.password, plan: null };
      setUsers((u) => ({ ...u, [authForm.email]: newUser }));
      setUser(newUser);
      navigate(selectedPlan ? "payment" : "home");
    } else {
      const found = users[authForm.email];
      if (!found || found.password !== authForm.password) {
        setAuthError("Invalid email or password.");
        return;
      }
      setUser(found);
      navigate(selectedPlan ? "payment" : found.plan ? "dashboard" : "home");
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!payForm.card || !payForm.expiry || !payForm.cvv || !payForm.name) {
      setPayError("Please fill in all payment fields.");
      return;
    }
    if (payForm.card.replace(/\s/g, "").length < 16) {
      setPayError("Please enter a valid card number.");
      return;
    }
    const updatedUser = { ...user, plan: selectedPlan.id };
    setUser(updatedUser);
    setUsers((u) => ({ ...u, [user.email]: updatedUser }));
    setPaySuccess(true);
    setTimeout(() => navigate("dashboard"), 2000);
  };

  const formatCard = (v) => {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  };
  const formatExpiry = (v) => {
    return v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");
  };

  const activePlan = user?.plan ? PLANS.find((p) => p.id === user.plan) : null;

  // NAV
  const Nav = () => (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(10,12,18,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
      transition: "all 0.3s ease",
      padding: "0 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 68,
    }}>
      <div onClick={() => navigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #4ECDC4, #6C63FF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 900,
        }}>S</div>
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.5px" }}>
          Smart<span style={{ color: "#4ECDC4" }}>Teacher</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {["home", "pricing"].map((p) => (
          <button key={p} onClick={() => navigate(p)} style={{
            background: "none", border: "none", color: page === p ? "#4ECDC4" : "rgba(255,255,255,0.65)",
            fontFamily: "'Sora', sans-serif", fontWeight: 500, fontSize: 14,
            cursor: "pointer", padding: "8px 16px", borderRadius: 8,
            transition: "color 0.2s",
            textTransform: "capitalize",
          }}>{p}</button>
        ))}
        {user ? (
          <div style={{ display: "flex", gap: 8 }}>
            {user.plan && (
              <button onClick={() => navigate("dashboard")} style={{
                background: "rgba(78,205,196,0.15)", border: "1px solid rgba(78,205,196,0.4)",
                color: "#4ECDC4", fontFamily: "'Sora', sans-serif", fontWeight: 600,
                fontSize: 13, cursor: "pointer", padding: "8px 16px", borderRadius: 8,
              }}>Dashboard</button>
            )}
            <button onClick={() => { setUser(null); navigate("home"); }} style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 500,
              fontSize: 13, cursor: "pointer", padding: "8px 14px", borderRadius: 8,
            }}>Log out</button>
          </div>
        ) : (
          <button onClick={() => { setAuthMode("login"); navigate("auth"); }} style={{
            background: "linear-gradient(135deg, #4ECDC4, #6C63FF)",
            border: "none", color: "#fff",
            fontFamily: "'Sora', sans-serif", fontWeight: 700,
            fontSize: 14, cursor: "pointer", padding: "9px 20px", borderRadius: 9,
          }}>Sign In</button>
        )}
      </div>
    </nav>
  );

  // HOME PAGE
  if (page === "home") return (
    <div style={{ minHeight: "100vh", background: "#080B14", color: "#fff", fontFamily: "'Sora', sans-serif", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Nav />

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "120px 24px 80px" }}>
        {/* BG effects */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "15%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(78,205,196,0.12) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: "30%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)" }} />
          {/* Grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
        </div>

        <div style={{ textAlign: "center", maxWidth: 800, position: "relative" }}>
          <div style={{
            display: "inline-block", background: "rgba(78,205,196,0.12)", border: "1px solid rgba(78,205,196,0.3)",
            borderRadius: 100, padding: "6px 18px", fontSize: 13, color: "#4ECDC4", fontWeight: 600,
            marginBottom: 28, letterSpacing: "0.5px",
          }}>
            🎓 AI-Powered Tools for Modern Educators
          </div>
          <h1 style={{
            fontSize: "clamp(42px, 7vw, 80px)", fontWeight: 900, lineHeight: 1.05,
            letterSpacing: "-2px", marginBottom: 24,
            background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Teaching, elevated<br />
            <span style={{
              background: "linear-gradient(135deg, #4ECDC4, #6C63FF)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>by intelligence.</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 44px", fontWeight: 400 }}>
            LessonLift gives educators the AI superpowers to build assignments, detect AI-written essays, and understand student progress — all in one place.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("pricing")} style={{
              background: "linear-gradient(135deg, #4ECDC4, #6C63FF)", border: "none",
              color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 700,
              fontSize: 16, cursor: "pointer", padding: "16px 36px", borderRadius: 12,
              boxShadow: "0 8px 32px rgba(78,205,196,0.3)",
            }}>Start Free Trial →</button>
            <button onClick={() => { const el = document.getElementById("features"); el?.scrollIntoView({ behavior: "smooth" }); }} style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 600,
              fontSize: 16, cursor: "pointer", padding: "16px 36px", borderRadius: 12,
            }}>See Features</button>
          </div>
          <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
            {[["12,000+", "Educators"], ["4.9★", "Average Rating"], ["98%", "Detection Accuracy"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{num}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 16 }}>Everything you need to teach smarter</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 500, margin: "0 auto" }}>One subscription. Every tool. Zero friction.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "28px 28px",
              transition: "border-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(78,205,196,0.3)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#fff" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{
          maxWidth: 700, margin: "0 auto",
          background: "linear-gradient(135deg, rgba(78,205,196,0.1), rgba(108,99,255,0.1))",
          border: "1px solid rgba(78,205,196,0.2)",
          borderRadius: 24, padding: "64px 48px",
        }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-1px", marginBottom: 16 }}>Ready to transform your classroom?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginBottom: 36 }}>Join thousands of educators who save hours every week with LessonLift.</p>
          <button onClick={() => navigate("pricing")} style={{
            background: "linear-gradient(135deg, #4ECDC4, #6C63FF)", border: "none",
            color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 700,
            fontSize: 16, cursor: "pointer", padding: "16px 40px", borderRadius: 12,
            boxShadow: "0 8px 32px rgba(108,99,255,0.3)",
          }}>View Plans & Pricing →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "40px 24px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
        © {new Date().getFullYear()} LessonLift Inc. · All rights reserved.
      </footer>
    </div>
  );

  // PRICING PAGE
  if (page === "pricing") return (
    <div style={{ minHeight: "100vh", background: "#080B14", color: "#fff", fontFamily: "'Sora', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Nav />
      <div style={{ paddingTop: 120, paddingBottom: 80, padding: "120px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-2px", marginBottom: 16 }}>Choose your plan</h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)" }}>Simple, transparent pricing for every school size.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {PLANS.map((plan) => (
            <div key={plan.id} style={{
              position: "relative",
              background: plan.popular ? `linear-gradient(160deg, rgba(108,99,255,0.18), rgba(78,205,196,0.08))` : "rgba(255,255,255,0.03)",
              border: `1px solid ${plan.popular ? "rgba(108,99,255,0.5)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 20, padding: "32px 28px",
              display: "flex", flexDirection: "column",
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #6C63FF, #4ECDC4)",
                  borderRadius: 100, padding: "4px 18px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
                }}>Most Popular</div>
              )}
              <div style={{ fontSize: 36, marginBottom: 12 }}>{plan.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20, fontWeight: 500 }}>{plan.accounts}</div>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: plan.color }}>${plan.price}</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}> / mo</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1 }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", padding: "6px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: plan.color, marginTop: 2 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => {
                setSelectedPlan(plan);
                if (!user) { setAuthMode("register"); navigate("auth"); }
                else navigate("payment");
              }} style={{
                background: plan.popular ? "linear-gradient(135deg, #6C63FF, #4ECDC4)" : `rgba(${plan.id === "teacher" ? "78,205,196" : plan.id === "school" ? "255,107,107" : "247,183,49"},0.15)`,
                border: plan.popular ? "none" : `1px solid ${plan.color}40`,
                color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 700,
                fontSize: 15, cursor: "pointer", padding: "14px", borderRadius: 10, width: "100%",
              }}>
                {user?.plan === plan.id ? "Current Plan ✓" : "Get Started →"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // AUTH PAGE
  if (page === "auth") return (
    <div style={{ minHeight: "100vh", background: "#080B14", color: "#fff", fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Nav />
      {/* bg glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 60%)" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-1px" }}>
            {authMode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          {selectedPlan && (
            <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              You're signing up for the <span style={{ color: selectedPlan.color, fontWeight: 700 }}>{selectedPlan.name}</span> plan
            </div>
          )}
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "36px 32px" }}>
          {authError && (
            <div style={{ background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.4)", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#FF6B6B", marginBottom: 20 }}>
              {authError}
            </div>
          )}
          <form onSubmit={handleAuth}>
            {authMode === "register" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Full Name</label>
                <input value={authForm.name} onChange={e => setAuthForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Smith"
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 15, fontFamily: "'Sora', sans-serif", outline: "none", boxSizing: "border-box" }} />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Email</label>
              <input type="email" value={authForm.email} onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@school.edu"
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 15, fontFamily: "'Sora', sans-serif", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Password</label>
              <input type="password" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 15, fontFamily: "'Sora', sans-serif", outline: "none", boxSizing: "border-box" }} />
            </div>
            <button type="submit" style={{
              width: "100%", background: "linear-gradient(135deg, #4ECDC4, #6C63FF)", border: "none",
              color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 700,
              fontSize: 16, cursor: "pointer", padding: "15px", borderRadius: 10,
              boxShadow: "0 6px 24px rgba(78,205,196,0.25)",
            }}>
              {authMode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
            {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(""); }}
              style={{ color: "#4ECDC4", cursor: "pointer", fontWeight: 600 }}>
              {authMode === "login" ? "Sign up" : "Sign in"}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span onClick={() => navigate("home")} style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>← Back to home</span>
        </div>
      </div>
    </div>
  );

  // PAYMENT PAGE
  if (page === "payment") return (
    <div style={{ minHeight: "100vh", background: "#080B14", color: "#fff", fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Nav />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, rgba(78,205,196,0.1) 0%, transparent 60%)" }} />

      <div style={{ width: "100%", maxWidth: 500, position: "relative", zIndex: 1 }}>
        {paySuccess ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Payment Successful!</h2>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Redirecting to your dashboard...</p>
            <div style={{ marginTop: 24, width: 60, height: 4, background: "linear-gradient(90deg, #4ECDC4, #6C63FF)", borderRadius: 2, margin: "24px auto 0", animation: "grow 2s ease-out forwards" }} />
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-1px" }}>Complete your purchase</h1>
              {selectedPlan && (
                <div style={{ marginTop: 12 }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                    {selectedPlan.icon} {selectedPlan.name} Plan — </span>
                  <span style={{ color: selectedPlan.color, fontWeight: 700 }}>${selectedPlan.price}/month</span>
                </div>
              )}
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "36px 32px" }}>
              {/* Order Summary */}
              {selectedPlan && (
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "16px 18px", marginBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>{selectedPlan.name} Plan ({selectedPlan.accounts})</span>
                    <span>${selectedPlan.price}/mo</span>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                    <span>Total today</span>
                    <span style={{ color: selectedPlan.color }}>${selectedPlan.price}</span>
                  </div>
                </div>
              )}

              {payError && (
                <div style={{ background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.4)", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#FF6B6B", marginBottom: 20 }}>
                  {payError}
                </div>
              )}

              <form onSubmit={handlePayment}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Cardholder Name</label>
                  <input value={payForm.name} onChange={e => setPayForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Jane Smith"
                    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 15, fontFamily: "'Sora', sans-serif", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Card Number</label>
                  <div style={{ position: "relative" }}>
                    <input value={payForm.card} onChange={e => setPayForm(f => ({ ...f, card: formatCard(e.target.value) }))}
                      placeholder="1234 5678 9012 3456" maxLength={19}
                      style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "13px 50px 13px 16px", color: "#fff", fontSize: 15, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }} />
                    <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>💳</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Expiry Date</label>
                    <input value={payForm.expiry} onChange={e => setPayForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY" maxLength={5}
                      style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 15, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>CVV</label>
                    <input value={payForm.cvv} onChange={e => setPayForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      placeholder="•••"
                      style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 15, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <button type="submit" style={{
                  width: "100%", background: "linear-gradient(135deg, #4ECDC4, #6C63FF)", border: "none",
                  color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 700,
                  fontSize: 16, cursor: "pointer", padding: "15px", borderRadius: 10,
                  boxShadow: "0 6px 24px rgba(78,205,196,0.25)",
                }}>
                  🔒 Pay ${selectedPlan?.price}/month
                </button>
              </form>
              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 16 }}>
                Secured with 256-bit SSL encryption · Cancel anytime
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // DASHBOARD
  if (page === "dashboard") return (
    <div style={{ minHeight: "100vh", background: "#080B14", color: "#fff", fontFamily: "'Sora', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Nav />
      <div style={{ paddingTop: 100, padding: "100px 32px 60px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginBottom: 4 }}>Welcome back,</p>
            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1px" }}>{user?.name || "Educator"} 👋</h1>
          </div>
          {activePlan && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 18px" }}>
              <span style={{ fontSize: 20 }}>{activePlan.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>ACTIVE PLAN</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: activePlan.color }}>{activePlan.name}</div>
              </div>
            </div>
          )}
        </div>

        {/* Coming Soon Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(78,205,196,0.1))",
          border: "1px solid rgba(108,99,255,0.3)",
          borderRadius: 20, padding: "48px 40px", textAlign: "center", marginBottom: 36,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)" }} />
          <div style={{ fontSize: 52, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 12 }}>Your AI Dashboard is Coming Soon</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.7 }}>
            We're building powerful AI tools tailored for your <strong style={{ color: activePlan?.color }}>{activePlan?.name}</strong> plan.
            Assignment generators, plagiarism detection, and analytics are on their way.
          </p>
          <div style={{ display: "inline-flex", background: "rgba(108,99,255,0.2)", border: "1px solid rgba(108,99,255,0.4)", borderRadius: 100, padding: "8px 22px", fontSize: 13, fontWeight: 600, color: "#6C63FF" }}>
            Expected Q2 2025
          </div>
        </div>

        {/* Preview Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[
            { icon: "✍️", title: "Assignment Builder", status: "Coming Soon", color: "#4ECDC4" },
            { icon: "🔍", title: "AI Essay Checker", status: "Coming Soon", color: "#6C63FF" },
            { icon: "📊", title: "Student Analytics", status: "Coming Soon", color: "#FF6B6B" },
            { icon: "📚", title: "Assignment Library", status: "Coming Soon", color: "#F7B731" },
          ].map((card, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, padding: "24px", opacity: 0.65,
              display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10,
            }}>
              <div style={{ fontSize: 30 }}>{card.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{card.title}</div>
              <div style={{
                fontSize: 11, background: `rgba(${card.color === "#4ECDC4" ? "78,205,196" : card.color === "#6C63FF" ? "108,99,255" : card.color === "#FF6B6B" ? "255,107,107" : "247,183,49"},0.15)`,
                color: card.color, borderRadius: 100, padding: "4px 12px", fontWeight: 600,
              }}>
                {card.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return null;
}
