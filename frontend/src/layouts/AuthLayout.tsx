import { Outlet, Link } from 'react-router';
import { ShieldCheck, Star, Lock } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="auth-glass-page">

      {/* ── Background: richer circuit + dot-grid decorations (edges only) ── */}
      <svg
        className="auth-bg-deco"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ── TOP-LEFT corner circuit board ── */}
        <polyline points="0,60 60,60 60,20 120,20" stroke="rgba(99,147,255,0.30)" strokeWidth="1.2" fill="none" />
        <polyline points="0,100 40,100 40,140 80,140 80,100 160,100" stroke="rgba(99,147,255,0.20)" strokeWidth="1" fill="none" />
        <polyline points="30,0 30,50 90,50 90,90" stroke="rgba(99,147,255,0.22)" strokeWidth="1" fill="none" />
        <circle cx="60" cy="60" r="3.5" fill="rgba(59,130,246,0.40)" />
        <circle cx="120" cy="20" r="2.5" fill="rgba(59,130,246,0.30)" />
        <circle cx="80" cy="140" r="2" fill="rgba(59,130,246,0.28)" />
        <circle cx="30" cy="50" r="2" fill="rgba(99,147,255,0.30)" />
        {/* dot grid top-left */}
        {[0,1,2,3,4].map(row => [0,1,2,3,4,5].map(col => (
          <circle key={`tl-${row}-${col}`} cx={180 + col * 22} cy={20 + row * 22} r="1.5" fill="rgba(37,99,235,0.13)" />
        )))}

        {/* ── TOP-RIGHT corner circuit board ── */}
        <polyline points="1440,60 1380,60 1380,20 1320,20" stroke="rgba(99,147,255,0.30)" strokeWidth="1.2" fill="none" />
        <polyline points="1440,100 1400,100 1400,140 1360,140 1360,100 1280,100" stroke="rgba(99,147,255,0.20)" strokeWidth="1" fill="none" />
        <polyline points="1410,0 1410,50 1350,50 1350,90" stroke="rgba(99,147,255,0.22)" strokeWidth="1" fill="none" />
        <circle cx="1380" cy="60" r="3.5" fill="rgba(59,130,246,0.40)" />
        <circle cx="1320" cy="20" r="2.5" fill="rgba(59,130,246,0.30)" />
        <circle cx="1360" cy="140" r="2" fill="rgba(59,130,246,0.28)" />
        <circle cx="1410" cy="50" r="2" fill="rgba(99,147,255,0.30)" />
        {/* dot grid top-right */}
        {[0,1,2,3,4].map(row => [0,1,2,3,4,5].map(col => (
          <circle key={`tr-${row}-${col}`} cx={1130 + col * 22} cy={20 + row * 22} r="1.5" fill="rgba(37,99,235,0.13)" />
        )))}

        {/* ── BOTTOM-LEFT corner circuit board ── */}
        <polyline points="0,840 60,840 60,880 120,880" stroke="rgba(99,147,255,0.28)" strokeWidth="1.2" fill="none" />
        <polyline points="0,800 40,800 40,760 80,760 80,800 160,800" stroke="rgba(99,147,255,0.18)" strokeWidth="1" fill="none" />
        <polyline points="30,900 30,850 90,850 90,810" stroke="rgba(99,147,255,0.20)" strokeWidth="1" fill="none" />
        <circle cx="60" cy="840" r="3.5" fill="rgba(124,58,237,0.30)" />
        <circle cx="120" cy="880" r="2.5" fill="rgba(124,58,237,0.25)" />
        <circle cx="80" cy="760" r="2" fill="rgba(59,130,246,0.25)" />
        {/* dot grid bottom-left */}
        {[0,1,2,3,4].map(row => [0,1,2,3,4,5].map(col => (
          <circle key={`bl-${row}-${col}`} cx={180 + col * 22} cy={790 + row * 22} r="1.5" fill="rgba(124,58,237,0.11)" />
        )))}

        {/* ── BOTTOM-RIGHT corner circuit board ── */}
        <polyline points="1440,840 1380,840 1380,880 1320,880" stroke="rgba(99,147,255,0.28)" strokeWidth="1.2" fill="none" />
        <polyline points="1440,800 1400,800 1400,760 1360,760 1360,800 1280,800" stroke="rgba(99,147,255,0.18)" strokeWidth="1" fill="none" />
        <polyline points="1410,900 1410,850 1350,850 1350,810" stroke="rgba(99,147,255,0.20)" strokeWidth="1" fill="none" />
        <circle cx="1380" cy="840" r="3.5" fill="rgba(124,58,237,0.30)" />
        <circle cx="1320" cy="880" r="2.5" fill="rgba(124,58,237,0.25)" />
        <circle cx="1360" cy="760" r="2" fill="rgba(59,130,246,0.25)" />
        {/* dot grid bottom-right */}
        {[0,1,2,3,4].map(row => [0,1,2,3,4,5].map(col => (
          <circle key={`br-${row}-${col}`} cx={1130 + col * 22} cy={790 + row * 22} r="1.5" fill="rgba(124,58,237,0.11)" />
        )))}

        {/* ── LEFT EDGE mid circuit ── */}
        <polyline points="0,420 50,420 50,380 100,380 100,450 60,450 60,490" stroke="rgba(99,147,255,0.22)" strokeWidth="1" fill="none" />
        <circle cx="50" cy="420" r="3" fill="rgba(59,130,246,0.28)" />
        <circle cx="100" cy="450" r="2" fill="rgba(59,130,246,0.20)" />

        {/* ── RIGHT EDGE mid circuit ── */}
        <polyline points="1440,420 1390,420 1390,380 1340,380 1340,450 1380,450 1380,490" stroke="rgba(99,147,255,0.22)" strokeWidth="1" fill="none" />
        <circle cx="1390" cy="420" r="3" fill="rgba(124,58,237,0.25)" />
        <circle cx="1340" cy="450" r="2" fill="rgba(124,58,237,0.20)" />

        {/* ── Subtle curved wave lines across the page ── */}
        <path d="M0 680 Q360 600 720 650 Q1080 700 1440 620" stroke="rgba(59,130,246,0.08)" strokeWidth="1.5" fill="none" />
        <path d="M0 720 Q400 640 800 690 Q1100 730 1440 660" stroke="rgba(124,58,237,0.06)" strokeWidth="1" fill="none" />
        <path d="M0 240 Q360 300 720 260 Q1080 220 1440 290" stroke="rgba(59,130,246,0.07)" strokeWidth="1" fill="none" />

        {/* ── Scattered ambient soft dots (mid-area, away from card) ── */}
        <circle cx="170" cy="350" r="4" fill="rgba(59,130,246,0.18)" />
        <circle cx="1270" cy="340" r="4" fill="rgba(124,58,237,0.16)" />
        <circle cx="90" cy="560" r="3" fill="rgba(59,130,246,0.14)" />
        <circle cx="1360" cy="540" r="3" fill="rgba(124,58,237,0.14)" />
        <circle cx="210" cy="680" r="2.5" fill="rgba(59,130,246,0.12)" />
        <circle cx="1230" cy="660" r="2.5" fill="rgba(124,58,237,0.12)" />
      </svg>

      {/* ── InfyBuys Branding ── */}
      <Link to="/" className="auth-brand" style={{ textDecoration: 'none' }}>
        {/* <div className="auth-brand-icon">
          <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div> */}
        <span className="auth-brand-name">InfyBuys</span>
        <span className="auth-brand-tagline">Acquire. Scale. Succeed.</span>
      </Link>

      {/* ── Single Centered Liquid Glass Card ── */}
      <div className="auth-glass-card">
        <Outlet />
      </div>

      {/* ── Benefits Bar ── */}
      <div className="auth-benefits-bar" role="list" aria-label="Platform benefits">
        <div className="auth-benefit-item" role="listitem">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          <span>Secure</span>
        </div>
        <div className="auth-benefit-sep" aria-hidden="true" />
        <div className="auth-benefit-item" role="listitem">
          <Star className="w-4 h-4" aria-hidden="true" />
          <span>Reliable</span>
        </div>
        <div className="auth-benefit-sep" aria-hidden="true" />
        <div className="auth-benefit-item" role="listitem">
          <Lock className="w-4 h-4" aria-hidden="true" />
          <span>Enterprise Security</span>
        </div>
      </div>

      {/* ── Footer ── */}
      <p className="auth-footer">
        © {new Date().getFullYear()} InfyBuys. All rights reserved.
      </p>
    </div>
  );
}
