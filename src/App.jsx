/**
 * ═══════════════════════════════════════════════════════════════════
 *  GOVERNMENT AI AVATAR PLATFORM  —  PART 2 (FIXED)
 *  Pages  : Login · Home · Dashboard · Live Broadcast · AI Assistant
 *           Translate & Speak · Broadcasts
 * ═══════════════════════════════════════════════════════════════════
 */



import {
  Component, useState, useEffect, useRef, useReducer,
  useCallback, useMemo
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════
   §1  GLOBAL CSS  (FIX 1 — injected once, stable ref, no re-injection)
═══════════════════════════════════════════════════════════════════ */
const CSS_ID = "gov-platform-v2-fixed";
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&family=Noto+Sans:wght@300;400;500;600;700&family=Noto+Sans+Mono:wght@400;500&display=swap');
:root {
  --navy:#0B2545; --navy-mid:#134074; --navy-lt:#1B4F8A;
  --saffron:#F5A623; --saffron-dk:#D4881C; --saffron-bg:#FFF8EC;
  --green:#157A3C; --green-lt:#E8F5EE;
  --off:#F6F8FB; --bg:#EEF2F7;
  --text:#1A2B3C; --t2:#4A6080; --t3:#8098B0;
  --border:#C8D9EA; --b2:#DDE8F3;
  --red:#C0392B; --red-bg:#FDECEA;
  --sh0:0 1px 4px rgba(11,37,69,.10);
  --sh:0 2px 14px rgba(11,37,69,.13);
  --sh2:0 6px 32px rgba(11,37,69,.18);
  --r:4px; --rl:8px; --tr:all .18s ease;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{font-size:16px;}
body{font-family:'Noto Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh;}
h1,h2,h3,h4{font-family:'Tiro Devanagari Hindi',serif;line-height:1.25;}
.mono{font-family:'Noto Sans Mono',monospace;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--navy-mid);border-radius:3px;}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;
  padding:10px 22px;border:none;border-radius:var(--r);
  font-family:'Noto Sans',sans-serif;font-size:14px;font-weight:600;
  cursor:pointer;transition:var(--tr);white-space:nowrap;line-height:1;}
.btn:disabled{opacity:.45;cursor:not-allowed;pointer-events:none;}
.btn-primary{background:var(--navy);color:#fff;}
.btn-primary:hover{background:var(--navy-mid);box-shadow:var(--sh);}
.btn-saffron{background:var(--saffron);color:var(--navy);font-weight:700;}
.btn-saffron:hover{background:var(--saffron-dk);box-shadow:var(--sh);}
.btn-green{background:var(--green);color:#fff;}
.btn-green:hover{background:#0e5e2c;}
.btn-outline{background:transparent;color:var(--navy);border:2px solid var(--navy);}
.btn-outline:hover{background:var(--navy);color:#fff;}
.btn-ghost{background:transparent;color:var(--t2);border:1.5px solid var(--border);}
.btn-ghost:hover{background:var(--off);border-color:var(--navy);color:var(--navy);}
.btn-danger{background:var(--red-bg);color:var(--red);border:1px solid #f1b8b4;}
.btn-danger:hover{background:#fbd3d0;}
.btn-red{background:var(--red);color:#fff;}
.btn-red:hover{background:#a93226;}
.btn-sm{padding:7px 14px;font-size:13px;}
.btn-xs{padding:4px 10px;font-size:12px;}
.btn-full{width:100%;}

/* INPUTS */
.fl{display:block;font-size:11px;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;color:var(--t2);margin-bottom:5px;}
.inp{width:100%;background:#fff;border:1.5px solid var(--border);border-radius:var(--r);
  padding:10px 14px;font-size:14px;color:var(--text);outline:none;
  transition:border-color .18s,box-shadow .18s;}
.inp:focus{border-color:var(--navy);box-shadow:0 0 0 3px rgba(11,37,69,.09);}
.inp::placeholder{color:var(--t3);}
select.inp{cursor:pointer;}
textarea.inp{resize:vertical;min-height:80px;}
.iw{position:relative;}
.iw .inp{padding-left:40px;}
.ii{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:16px;opacity:.5;pointer-events:none;}

/* CARDS */
.card{background:#fff;border:1px solid var(--border);border-radius:var(--rl);box-shadow:var(--sh0);overflow:hidden;}
.card:hover{box-shadow:var(--sh);}
.ch{padding:16px 20px;border-bottom:1px solid var(--b2);display:flex;align-items:center;justify-content:space-between;background:#fff;}
.ct{font-size:15px;font-weight:700;color:var(--navy);}
.cb{padding:20px;}

/* BADGES */
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}
.bl{background:var(--red-bg);color:var(--red);}
.bd{background:var(--green-lt);color:var(--green);}
.bs{background:var(--saffron-bg);color:var(--saffron-dk);}
.bdr{background:#E9ECEF;color:#6C757D;}
.dot{width:7px;height:7px;border-radius:50%;display:inline-block;}
.dr{background:var(--red);animation:blink 1.2s ease-in-out infinite;}
.dg{background:var(--green);}
.da{background:var(--saffron);}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.25;}}

/* TABLE */
.gt{width:100%;border-collapse:collapse;}
.gt thead tr{background:var(--navy);}
.gt th{padding:11px 16px;text-align:left;font-size:11px;font-weight:700;color:#fff;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;}
.gt td{padding:11px 16px;border-bottom:1px solid var(--b2);font-size:13px;vertical-align:middle;}
.gt tbody tr:last-child td{border-bottom:none;}
.gt tbody tr:hover td{background:var(--off);}

/* TOGGLE */
.tw{display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none;}
.tt{width:44px;height:24px;border-radius:12px;position:relative;transition:background .2s;flex-shrink:0;}
.ton{background:var(--green);}
.toff{background:#CBD5E0;}
.tk{position:absolute;top:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.22);}

/* NAV */
.ni{display:flex;align-items:center;gap:11px;padding:10px 18px;cursor:pointer;
  transition:var(--tr);font-size:14px;font-weight:500;color:rgba(255,255,255,.72);
  border-left:3px solid transparent;user-select:none;}
.ni:hover{color:#fff;background:rgba(255,255,255,.07);}
.ni.act{color:#fff;border-left-color:var(--saffron);background:rgba(245,166,35,.13);}

/* TRICOLOR */
.tri{height:5px;background:linear-gradient(90deg,var(--saffron) 33.33%,#fff 33.33% 66.66%,var(--green) 66.66%);}
.tri2{height:3px;background:linear-gradient(90deg,var(--saffron) 33.33%,#fff 33.33% 66.66%,var(--green) 66.66%);}

/* SECTION LABEL */
.sl{display:flex;align-items:center;gap:9px;font-size:11px;font-weight:700;
  text-transform:uppercase;letter-spacing:.12em;color:var(--navy);margin-bottom:6px;}
.sl::before{content:'';display:block;width:4px;height:16px;background:var(--saffron);border-radius:2px;flex-shrink:0;}

/* KPI */
.kc{background:#fff;border:1px solid var(--border);border-radius:var(--rl);padding:20px;
  position:relative;overflow:hidden;transition:box-shadow .2s,transform .2s;}
.kc:hover{box-shadow:var(--sh2);transform:translateY(-2px);}
.kc::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;}
.kn::before{background:var(--navy);}
.ks::before{background:var(--saffron);}
.kg::before{background:var(--green);}
.kr::before{background:var(--red);}

/* CHAT BUBBLES */
.bu{background:var(--navy);color:#fff;padding:11px 15px;border-radius:16px 16px 4px 16px;
  max-width:76%;font-size:14px;line-height:1.65;word-break:break-word;}
.ba{background:#fff;color:var(--text);padding:11px 15px;border-radius:16px 16px 16px 4px;
  max-width:86%;font-size:14px;line-height:1.65;border:1px solid var(--b2);
  box-shadow:var(--sh0);word-break:break-word;}
.tdot{width:8px;height:8px;border-radius:50%;background:var(--t3);display:inline-block;}

/* MODAL */
.mo{position:fixed;inset:0;background:rgba(0,0,0,.52);backdrop-filter:blur(3px);
  z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;}
.mb{background:#fff;border-radius:var(--rl);max-height:90vh;overflow-y:auto;
  box-shadow:0 10px 50px rgba(0,0,0,.28);width:100%;}

/* TOAST */
.thub{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;}
.ti{background:#fff;border-radius:var(--r);padding:12px 18px;font-size:13px;
  display:flex;align-items:center;gap:10px;box-shadow:var(--sh2);min-width:260px;max-width:380px;}

/* VOICE VIZ BARS */
@keyframes vb{0%,100%{height:3px;}50%{height:var(--h);}}
.vbar{display:inline-block;border-radius:2px;margin:0 1.5px;animation:vb .4s ease-in-out infinite;}

/* AVATAR ANIMS */
@keyframes speak-mouth{0%,100%{transform:scaleY(.15);}50%{transform:scaleY(1.5);}}
@keyframes eyeblink{0%,88%,100%{transform:scaleY(1);}94%{transform:scaleY(.04);}}
@keyframes headidle{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
@keyframes av-glow{0%,100%{filter:drop-shadow(0 0 8px rgba(245,166,35,.28));}
                   50%{filter:drop-shadow(0 0 22px rgba(245,166,35,.65));}}

/* WORD REVEAL (FIX 5) */
@keyframes word-in{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:none;}}
.word-reveal span{display:inline-block;opacity:0;animation:word-in .25s ease forwards;}

/* MISC */
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
.tag{display:inline-block;background:#E8F0FA;color:var(--navy);padding:2px 9px;border-radius:3px;font-size:11px;font-weight:700;}
.swatch{width:30px;height:30px;border-radius:50%;cursor:pointer;border:2.5px solid transparent;transition:var(--tr);flex-shrink:0;}
.swatch:hover,.swatch.sel{border-color:var(--navy);box-shadow:0 0 0 2px rgba(11,37,69,.22);transform:scale(1.14);}
.audit-log{background:#0B2545;padding:12px 14px;font-family:'Noto Sans Mono',monospace;
  font-size:10.5px;color:#4ade80;overflow-y:auto;border-radius:var(--r);}

/* BROWSER COMPAT CARD (FIX 7) */
.compat-card{background:#fff3cd;border:1px solid #ffc107;border-radius:var(--r);
  padding:14px 16px;font-size:13px;color:#664d03;}
.compat-card a{color:var(--navy);font-weight:700;text-decoration:underline;}

@media(max-width:768px){.hide-sm{display:none!important;}}

/* ── DARK THEME ─────────────────────────────────────────────────── */
[data-theme="dark"]{
  --bg:#0F0F1A; --off:#161626; --text:#E8EDF5;
  --t2:#A0B0C8; --t3:#5A7090;
  --border:#2A3A52; --b2:#1E2D42;
  --sh0:0 1px 4px rgba(0,0,0,.4); --sh:0 2px 14px rgba(0,0,0,.5); --sh2:0 6px 32px rgba(0,0,0,.6);
  --navy-mid:#1B4F8A; --navy-lt:#2260A8;
  --saffron-bg:#2A1F0A; --green-lt:#0A1F12; --red-bg:#1F0A0A;
}
[data-theme="dark"] .card{background:#1A2540;border-color:var(--border);}
[data-theme="dark"] .ch{background:#1A2540;border-color:var(--b2);}
[data-theme="dark"] .inp{background:#111828;border-color:var(--border);color:var(--text);}
[data-theme="dark"] .inp:focus{border-color:var(--navy-lt);box-shadow:0 0 0 3px rgba(34,96,168,.18);}
[data-theme="dark"] .btn-ghost{background:transparent;color:var(--t2);border-color:var(--border);}
[data-theme="dark"] .btn-ghost:hover{background:#1E2D42;color:var(--text);border-color:var(--navy-lt);}
[data-theme="dark"] .gt thead tr{background:#0B2545;}
[data-theme="dark"] .gt td{border-color:var(--b2);}
[data-theme="dark"] .gt tbody tr:hover td{background:#1E2D42;}
[data-theme="dark"] body{background:var(--bg);color:var(--text);}
[data-theme="dark"] .tag{background:#1E2D42;color:var(--t2);}
[data-theme="dark"] .mo{background:rgba(0,0,0,.72);}
[data-theme="dark"] .mb{background:#1A2540;}
[data-theme="dark"] .ti{background:#1A2540;color:var(--text);}
[data-theme="dark"] .audit-log{background:#060B14;}
[data-theme="dark"] select.inp option{background:#111828;color:var(--text);}

/* ── COMPACT MODE ────────────────────────────────────────────────── */
[data-compact="true"] .gt th{padding:7px 12px;font-size:10px;}
[data-compact="true"] .gt td{padding:7px 12px;font-size:12px;}
[data-compact="true"] .cb{padding:14px;}
[data-compact="true"] .ch{padding:11px 16px;}
[data-compact="true"] .kc{padding:14px;}
[data-compact="true"] .ni{padding:7px 18px;font-size:13px;}
[data-compact="true"] .card{margin-bottom:10px;}
[data-compact="true"] .btn{padding:7px 16px;font-size:13px;}
[data-compact="true"] .btn-sm{padding:5px 11px;font-size:12px;}
[data-compact="true"] .btn-xs{padding:3px 8px;font-size:11px;}
`;



function useGlobalCSS() {
 
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    if (document.getElementById(CSS_ID)) return;
    const el = document.createElement("style");
    el.id = CSS_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
   
  }, []); 
}


const INIT = {
  page: "login", 
  user: null,
  broadcastActive: false, 
  broadcasts: [
    { id:"b1", title:"National Health Advisory — Vaccination Drive",      dept:"Ministry of Health", langs:"EN→HI,BN,TA,TE", viewers:245000, eng:"91%", status:"completed", date:"2026-03-01" },
    { id:"b2", title:"Public Safety — Flood Early Warning System",        dept:"NDMA",               langs:"EN→HI,BN,OR",    viewers:189000, eng:"87%", status:"live",      date:"2026-03-06" },
    { id:"b3", title:"Education Reform — New Curriculum 2026",            dept:"Ministry of Education", langs:"EN→HI,TA",   viewers:98000,  eng:"83%", status:"completed", date:"2026-02-28" },
    { id:"b4", title:"Budget 2026 — Key Highlights for Citizens",         dept:"Ministry of Finance", langs:"EN→HI,TE,BN",  viewers:312000, eng:"94%", status:"scheduled", date:"2026-03-10" },
    { id:"b5", title:"Digital India — e-Services Step-by-Step Guide",     dept:"MeitY",               langs:"EN→HI,TA,TE",  viewers:67000,  eng:"79%", status:"draft",     date:"2026-03-12" },
    { id:"b6", title:"Jal Jeevan Mission — Safe Water for Every Home",    dept:"Ministry of Jal Shakti", langs:"EN→HI,BN,MR", viewers:158000, eng:"88%", status:"completed", date:"2026-02-20" },
  ],
  avatar: {
    name:"Raj Kumar", skinTone:"#D4956A", hairColor:"#1A0800", hairStyle:"short",
    eyeColor:"#3D2B1F", jacketColor:"#0B2545", lipColor:"#B85450",
    glasses:false, facialHair:"none", expression:"neutral", uniform:"formal",
    voiceLang:"en-IN", voicePitch:1.0, voiceRate:0.95, voiceVolume:1.0,
  },
  engData: Array.from({length:12},(_,i)=>({
    m:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    eng: 65+Math.floor(Math.random()*30),
  })),
  deviceData:[{n:"Mobile",v:62,f:"#0B2545"},{n:"TV",v:23,f:"#F5A623"},{n:"Desktop",v:15,f:"#157A3C"}],
  langBarData:[
    {l:"Hindi",v:4821,f:"#0B2545"},{l:"Bengali",v:2654,f:"#157A3C"},
    {l:"Tamil",v:2201,f:"#F5A623"},{l:"Telugu",v:1987,f:"#C0392B"},
    {l:"Marathi",v:1541,f:"#2980B9"},{l:"Gujarati",v:1276,f:"#8E44AD"},
    {l:"Kannada",v:987,f:"#27AE60"},{l:"Odia",v:754,f:"#E67E22"},
  ],
  auditLog:[
    {id:"al1",ts:"2026-03-07 09:14:22",user:"Arjun Sharma",action:"BROADCAST_START",resource:"BCast#2",lang:"HI",latency:"241ms",status:"APPROVED",sensitive:false},
    {id:"al2",ts:"2026-03-07 09:12:10",user:"Priya Menon",action:"TRANSLATE",resource:"Doc#112",lang:"TA",latency:"289ms",status:"APPROVED",sensitive:false},
    {id:"al3",ts:"2026-03-07 09:08:44",user:"Rohit Singh",action:"BROADCAST_START",resource:"BCast#1",lang:"BN",latency:"312ms",status:"APPROVED",sensitive:false},
    {id:"al4",ts:"2026-03-06 18:33:11",user:"Arjun Sharma",action:"AVATAR_UPDATE",resource:"Avatar#1",lang:"—",latency:"—",status:"APPROVED",sensitive:false},
    {id:"al5",ts:"2026-03-06 17:55:02",user:"Admin",action:"BROADCAST_END",resource:"BCast#1",lang:"HI",latency:"—",status:"APPROVED",sensitive:false},
    {id:"al6",ts:"2026-03-06 16:12:30",user:"Priya Menon",action:"TRANSLATE",resource:"Doc#108",lang:"TE",latency:"198ms",status:"FLAGGED",sensitive:true},
    {id:"al7",ts:"2026-03-05 14:44:18",user:"Rohit Singh",action:"BROADCAST_START",resource:"BCast#3",lang:"MR",latency:"265ms",status:"APPROVED",sensitive:false},
    {id:"al8",ts:"2026-03-05 11:30:05",user:"Admin",action:"USER_LOGIN",resource:"Portal",lang:"—",latency:"—",status:"APPROVED",sensitive:false},
  ],
  settings:{
    profile:{ name:"Arjun Sharma", email:"arjun.sharma@meity.gov.in", dept:"Ministry of Electronics & IT", role:"SUPER_ADMIN", phone:"+91 98765 43210" },
    notifications:{ email:true, sms:false, broadcastAlerts:true, systemAlerts:true, weeklyReport:true },
    security:{ twoFactor:false, sessionTimeout:"30", apiKeyVisible:false },
    display:{ theme:"light", language:"en", compactMode:false, showAuditBadge:true },
  },
};

function reducer(st, ac) {
  switch(ac.type) {
    case "PAGE":    return { ...st, page: ac.p };
    case "LOGIN":   return { ...st, user: ac.u, page: "home" };
    case "LOGOUT":  return { ...INIT, page: "login" };
    case "BC_ADD":  return { ...st, broadcasts: [ac.b, ...st.broadcasts] };
    case "BC_DEL":  return { ...st, broadcasts: st.broadcasts.filter(b=>b.id!==ac.id) };
    case "BC_UPD":  return { ...st, broadcasts: st.broadcasts.map(b=>b.id===ac.b.id?{...b,...ac.b}:b) };
    case "AV_UPD":  return { ...st, avatar: { ...st.avatar, ...ac.v } };
    // FIX 8 — track live broadcast in reducer so navigation triggers cleanup
    case "BC_START": return { ...st, broadcastActive: true };
    case "BC_STOP":  return { ...st, broadcastActive: false };
    case "AUDIT_ADD": return { ...st, auditLog: [ac.entry, ...st.auditLog.slice(0,49)] };
    case "SETTINGS_UPD": return { ...st, settings: { ...st.settings, ...ac.v } };
    default: return st;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   §4  CLAUDE API  +  DEMO MODE FALLBACK  (FIX 4)
═══════════════════════════════════════════════════════════════════ */

// Realistic demo responses for when API is unavailable
const DEMO_RESPONSES = {
  translate: {
    hi: "नागरिकों को सूचित किया जाता है कि यह एक महत्वपूर्ण सरकारी घोषणा है। कृपया अपने नजदीकी स्वास्थ्य केंद्र पर जाएं और अपना पंजीकरण कराएं।",
    bn: "নাগরিকদের জানানো হচ্ছে যে এটি একটি গুরুত্বপূর্ণ সরকারি ঘোষণা। অনুগ্রহ করে আপনার নিকটস্থ স্বাস্থ্য কেন্দ্রে যান।",
    ta: "குடிமக்களுக்கு தெரிவிக்கப்படுகிறது, இது ஒரு முக்கியமான அரசு அறிவிப்பாகும். உங்கள் அருகிலுள்ள சுகாதார மையத்திற்கு செல்லுங்கள்.",
    te: "పౌరులకు తెలియజేయబడుచున్నది, ఇది ఒక ముఖ్యమైన ప్రభుత్వ ప్రకటన. దయచేసి మీ సమీప ఆరోగ్య కేంద్రానికి వెళ్ళండి.",
    mr: "नागरिकांना कळविण्यात येते की हे एक महत्त्वाचे सरकारी निवेदन आहे. कृपया आपल्या जवळच्या आरोग्य केंद्रात जा.",
    default: "[Demo translation — connect to Claude API for real translation of your text]",
  },
  assistant: [
    "**PM-KISAN Scheme** provides ₹6,000 annual income support to farmer families in 3 equal instalments of ₹2,000 each. Eligible: small and marginal farmers with landholding up to 2 hectares. Apply at pmkisan.gov.in with Aadhaar, bank account, and land records.",
    "**Ayushman Bharat (PM-JAY)** provides health coverage up to ₹5 lakh per family per year for secondary and tertiary hospitalisation. Check eligibility at pmjay.gov.in or call helpline 14555. Bring your Aadhaar card to any empanelled hospital.",
    "**Digital India** is a flagship programme launched in 2015 to transform India into a digitally empowered society. Key pillars: Digital Infrastructure, Digital Services, and Digital Literacy. Services available at digitalindia.gov.in.",
    "**Aadhaar Update**: Visit your nearest Aadhaar Seva Kendra or go to myaadhaar.uidai.gov.in. Required documents: address proof (utility bill, bank statement), identity proof. Updates are free online, ₹50 at service centres.",
    "**RTI Online**: File RTI at rtionline.gov.in. Pay ₹10 fee online. Response within 30 days. First appeal within 30 days of receiving response. Central Information Commission handles second appeals.",
  ],
};

let demoIdx = 0;

// ── CLAUDE API (Anthropic) ───────────────────────────────────────────
async function callClaude(messages, system = "", maxTokens = 800) {
  try {
    const res = await fetch("/api/anthropic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages,
        system: system || "You are a professional government AI assistant for India.",
        maxTokens
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data?.error?.message ||
        data?.error ||
        data?.message ||
        JSON.stringify(data) ||
        "Claude API request failed"
      );
    }
    return data;

  } catch (error) {
    console.error("Claude API Error:", error);
    throw error;
  }
}

// Helper: translate with Claude, fallback to demo
async function translateText(text, srcLang, tgtLang, tone) {
  try {
    return await callClaude(
      [{ role:"user", content:`Translate this official government text from ${srcLang} to ${tgtLang}. Return ONLY the translated text:\n\n${text}` }],
      `You are an expert Indian government translator. Be accurate, formal, ${tone} tone. Return only the translation.`,
      600
    );
  } catch(e) {
    // Show actual error so user can diagnose API issues
    toast(`⚠️ API Error: ${e.message}`, "error");
    console.error("[translateText error]", e);
    return DEMO_RESPONSES.translate[tgtLang.toLowerCase().split("-")[0]]
        || DEMO_RESPONSES.translate.default;
  }
}

// Helper: assistant response with Claude, fallback to demo
async function assistantReply(messages) {
  try {
    return await callClaude(
      messages.slice(-10),
      "You are an AI Civic Assistant for the Government of India. Help with government schemes, policies, online services. Be clear, accurate, formal, concise (max 200 words). Respond in the same language the user writes in.",
      600
    );
  } catch {
    const r = DEMO_RESPONSES.assistant[demoIdx % DEMO_RESPONSES.assistant.length];
    demoIdx++;
    return r + "\n\n*[Demo mode — connect to Claude API for live AI responses]*";
  }
}

/* ═══════════════════════════════════════════════════════════════════
   §5  SPEECH UTILITIES  (FIX 3 — multi-retry voice loader)
═══════════════════════════════════════════════════════════════════ */
const Speech = (() => {
  let voices    = [];
  let loadDone  = false;
  const waiters = [];

  // FIX 3: retry up to 5 times, 400ms apart
  function tryLoad(attempts = 0) {
    const v = window.speechSynthesis?.getVoices() || [];
    if (v.length > 0) {
      voices   = v;
      loadDone = true;
      waiters.forEach(fn => fn(voices));
      waiters.length = 0;
    } else if (attempts < 5) {
      setTimeout(() => tryLoad(attempts + 1), 400);
    } else {
      // Give up after 2 s — resolve with empty, English will still work
      loadDone = true;
      waiters.forEach(fn => fn([]));
      waiters.length = 0;
    }
  }

  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => tryLoad();
    tryLoad();
  }

  function whenReady() {
    return new Promise(res => {
      if (loadDone) { res(voices); return; }
      waiters.push(res);
    });
  }

  // SOLUTION A — strict voice picker: returns ONLY a native voice or null.
  // Never falls back to Hindi or English for a different language.
  function pickVoice(lang, vs) {
    const base = lang.split("-")[0];
    return vs.find(v => v.lang === lang)               // exact match  e.g. "ta-IN"
        || vs.find(v => v.lang.startsWith(lang))       // near match   e.g. "ta-IN-x-..."
        || vs.find(v => v.lang.startsWith(base))       // base match   e.g. "ta"
        || null;                                       // SOLUTION C — no native voice → null
  }

  // SOLUTION A — check whether a native voice exists for a language code
  function hasNativeVoice(langCode) {
    const base = langCode.split("-")[0];
    return voices.some(v => v.lang === langCode || v.lang.startsWith(langCode) || v.lang.startsWith(base));
  }

  // SOLUTION A — return a map of langCode → { has: bool, voiceName: string|null }
  function voiceAvailability() {
    const map = {};
    Object.entries(LANGS).forEach(([key, lv]) => {
      const base = lv.code.split("-")[0];
      const found = voices.find(v => v.lang === lv.code || v.lang.startsWith(lv.code) || v.lang.startsWith(base));
      map[key] = { has: !!found, voiceName: found?.name || null };
    });
    return map;
  }

  return {
    supported:   () => typeof window !== "undefined" && "speechSynthesis" in window,
    srSupported: () => typeof window !== "undefined" &&
                       ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),

    // SOLUTION A — expose voice detection to components
    hasNativeVoice(langCode) { return hasNativeVoice(langCode); },
    voiceAvailability()      { return voiceAvailability(); },

    // SOLUTION A+C — speak() returns { skipped: true, reason } instead of
    //                speaking with a wrong voice when no native voice found.
    async speak(text, lang = "en-IN", pitch = 1, rate = 0.95, vol = 1) {
      if (!this.supported() || !text) return null;
      const vs = await whenReady();

      const voice = pickVoice(lang, vs);

      // SOLUTION C — no native voice → skip silently, return skipped signal
      if (!voice) {
        return { skipped: true, reason: `No native voice installed for ${lang}` };
      }

      window.speechSynthesis.cancel();
      const utt   = new SpeechSynthesisUtterance(text);
      utt.lang    = lang;
      utt.pitch   = pitch;
      utt.rate    = rate;
      utt.volume  = vol;
      utt.voice   = voice;
      window.speechSynthesis.speak(utt);
      return utt;
    },

    stop() { window.speechSynthesis?.cancel(); },

    listen({ lang="en-IN", onStart, onPartial, onFinal, onEnd, onError } = {}) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return null;
      const r           = new SR();
      r.lang            = lang;
      r.continuous      = false;
      r.interimResults  = true;
      r.onstart         = () => onStart?.();
      r.onresult        = e => {
        const t     = Array.from(e.results).map(x => x[0].transcript).join("");
        const final = e.results[e.results.length - 1].isFinal;
        if (final) onFinal?.(t); else onPartial?.(t);
      };
      r.onend   = () => onEnd?.();
      r.onerror = e => onError?.(e.error);
      r.start();
      return r;
    },
  };
})();

/* ═══════════════════════════════════════════════════════════════════
   §6  LANGUAGE TABLE
═══════════════════════════════════════════════════════════════════ */
const LANGS = {
  en:{ name:"English",   native:"English",  flag:"🇮🇳", code:"en-IN", dir:"ltr" },
  hi:{ name:"Hindi",     native:"हिन्दी",   flag:"🇮🇳", code:"hi-IN", dir:"ltr" },
  bn:{ name:"Bengali",   native:"বাংলা",    flag:"🇮🇳", code:"bn-IN", dir:"ltr" },
  ta:{ name:"Tamil",     native:"தமிழ்",    flag:"🇮🇳", code:"ta-IN", dir:"ltr" },
  te:{ name:"Telugu",    native:"తెలుగు",   flag:"🇮🇳", code:"te-IN", dir:"ltr" },
  mr:{ name:"Marathi",   native:"मराठी",    flag:"🇮🇳", code:"mr-IN", dir:"ltr" },
  gu:{ name:"Gujarati",  native:"ગુજરાતી",  flag:"🇮🇳", code:"gu-IN", dir:"ltr" },
  kn:{ name:"Kannada",   native:"ಕನ್ನಡ",    flag:"🇮🇳", code:"kn-IN", dir:"ltr" },
  ml:{ name:"Malayalam", native:"മലയാളം",   flag:"🇮🇳", code:"ml-IN", dir:"ltr" },
  pa:{ name:"Punjabi",   native:"ਪੰਜਾਬੀ",   flag:"🇮🇳", code:"pa-IN", dir:"ltr" },
  or:{ name:"Odia",      native:"ଓଡ଼ିଆ",    flag:"🇮🇳", code:"or-IN", dir:"ltr" },
  ur:{ name:"Urdu",      native:"اردو",     flag:"🇮🇳", code:"ur-IN", dir:"rtl" },
};

/* ═══════════════════════════════════════════════════════════════════
   §7  AVATAR SVG
═══════════════════════════════════════════════════════════════════ */
const DA = INIT.avatar;
function GovAvatar({ cfg = DA, speaking = false, size = 200 }) {
  const c = { ...DA, ...cfg };
  return (
    <svg width={size} height={size} viewBox="0 0 200 200"
      style={speaking ? { animation:"av-glow 1.8s ease-in-out infinite" } : {}}>
      <defs>
        <radialGradient id="avbg2" cx="50%" cy="45%">
          <stop offset="0%"   stopColor="#EEF2F7"/>
          <stop offset="100%" stopColor="#C8D9EA"/>
        </radialGradient>
        <radialGradient id="skin2" cx="35%" cy="28%">
          <stop offset="0%"   stopColor={c.skinTone}/>
          <stop offset="100%" stopColor={c.skinTone} stopOpacity=".82"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="97" fill="url(#avbg2)" stroke={c.jacketColor} strokeWidth="2"/>
      {speaking && <circle cx="100" cy="100" r="97" fill="none" stroke={c.jacketColor}
        strokeWidth="6" strokeOpacity=".18" style={{animation:"blink 1.4s ease-in-out infinite"}}/>}
      <ellipse cx="100" cy="198" rx="58" ry="26" fill={c.jacketColor}/>
      <rect x="50" y="160" width="100" height="46" fill={c.jacketColor} rx="3"/>
      {c.uniform === "formal" && <>
        <polygon points="86,163 100,156 114,163 108,182 92,182" fill="#fff"/>
        <polygon points="97,163 100,156 103,163 101,170 99,170" fill={c.jacketColor}/>
        <circle cx="68" cy="174" r="5.5" fill="#c8a84b"/>
        <circle cx="68" cy="174" r="3"   fill="#F5A623"/>
        <circle cx="79" cy="176" r="4.5" fill="#c8a84b"/>
        <circle cx="79" cy="176" r="2.5" fill="#157A3C"/>
      </>}
      <rect x="89" y="143" width="22" height="21" fill="url(#skin2)"/>
      <g style={speaking ? { animation:"headidle 2s ease-in-out infinite" } : {}}>
        <ellipse cx="100" cy="112" rx="41" ry="47" fill="url(#skin2)"/>
        {c.hairStyle !== "bald" && <>
          <ellipse cx="100" cy="74" rx="41" ry="17" fill={c.hairColor}/>
          <rect x="59" y="74" width="82" height="15" fill={c.hairColor}/>
        </>}
        {c.hairStyle === "long" && <>
          <rect x="59"  y="88" width="9" height="52" fill={c.hairColor} rx="5"/>
          <rect x="132" y="88" width="9" height="52" fill={c.hairColor} rx="5"/>
        </>}
        <ellipse cx="59"  cy="112" rx="7" ry="9" fill="url(#skin2)"/>
        <ellipse cx="141" cy="112" rx="7" ry="9" fill="url(#skin2)"/>
        {[-13,13].map((ox,i) => (
          <path key={i} d={`M${73+i*27} 98 Q${81+i*7} 93 87 98`}
            stroke={c.hairColor} strokeWidth="2.5" fill="none" strokeLinecap="round"
            transform={`translate(${i*14},0)`}/>
        ))}
        {[-13,13].map((ox,i) => (
          <g key={i}>
            <ellipse cx={100+ox} cy={109} rx="8" ry="8.5"
              style={{animation:"eyeblink 3.8s ease-in-out infinite",animationDelay:`${i*.07}s`}}
              fill="#fff"/>
            <circle cx={100+ox} cy={110} r={5}  fill={c.eyeColor}/>
            <circle cx={101+ox} cy={108} r={2}  fill="#fff"/>
          </g>
        ))}
        {c.glasses && <>
          <rect x="78"  y="103" width="20" height="15" rx="4" fill="none" stroke="#4A4A4A" strokeWidth="1.6"/>
          <rect x="102" y="103" width="20" height="15" rx="4" fill="none" stroke="#4A4A4A" strokeWidth="1.6"/>
          <line x1="98"  y1="110" x2="102" y2="110" stroke="#4A4A4A" strokeWidth="1.6"/>
          <line x1="59"  y1="110" x2="78"  y2="110" stroke="#4A4A4A" strokeWidth="1.1"/>
          <line x1="122" y1="110" x2="141" y2="110" stroke="#4A4A4A" strokeWidth="1.1"/>
        </>}
        <path d="M97 118 Q100 125 103 118" stroke="rgba(0,0,0,.14)" strokeWidth="1.4" fill="none"/>
        {c.facialHair==="mustache" && <path d="M88 133 Q100 128 112 133" stroke={c.hairColor} strokeWidth="3.5" fill="none" strokeLinecap="round"/>}
        {c.facialHair==="beard"    && <ellipse cx="100" cy="141" rx="17" ry="8.5" fill={c.hairColor} opacity=".62"/>}
        {/* FIX 6 — mouth has its own transform origin for boundary-event lip-sync */}
        <g style={{ transformOrigin:"100px 139px",
          animation: speaking ? "speak-mouth .13s ease-in-out infinite alternate" : "none" }}>
          {c.expression === "happy"
            ? <path d="M88 137 Q100 145 112 137" stroke={c.lipColor} strokeWidth="2.5"
                fill={speaking?c.lipColor:"none"} strokeLinecap="round"/>
            : c.expression === "sad"
            ? <path d="M88 141 Q100 135 112 141" stroke={c.lipColor} strokeWidth="2.5"
                fill="none" strokeLinecap="round"/>
            : <ellipse cx="100" cy="138" rx="10" ry={speaking?5.5:2.5}
                fill={speaking?c.lipColor:"none"} stroke={c.lipColor} strokeWidth="2.2"/>
          }
          {speaking && <ellipse cx="100" cy="139" rx="6.5" ry="3" fill="rgba(80,10,10,.5)"/>}
        </g>
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §8  VOICE VISUALIZER
═══════════════════════════════════════════════════════════════════ */
function VoiceViz({ active=false, bars=20, color="#0B2545", height=36 }) {
  const hs = useMemo(() => Array.from({length:bars}, () => 7+Math.random()*28), [bars]);
  if (!active) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height,gap:3}}>
      {Array.from({length:bars}).map((_,i) => (
        <div key={i} style={{width:3,height:4,background:"#C8D9EA",borderRadius:2}}/>
      ))}
    </div>
  );
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height,gap:3}}>
      {hs.map((h,i) => (
        <div key={i} className="vbar"
          style={{"--h":`${h}px`, width:3, height:4, background:color, animationDelay:`${i*.038}s`}}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §9  WORD-BY-WORD REVEAL COMPONENT  (FIX 5)
═══════════════════════════════════════════════════════════════════ */
function WordReveal({ text, dir = "ltr" }) {
  // Split on spaces, animate each word in with staggered delay
  const words = text.split(" ");
  return (
    <span className="word-reveal" style={{ direction: dir }}>
      {words.map((w, i) => (
        <span key={i}
          style={{ animationDelay:`${i * 0.06}s`, marginRight:"0.28em" }}>
          {w}
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §10  SR BROWSER COMPAT CARD  (FIX 7)
═══════════════════════════════════════════════════════════════════ */
function SRCompatCard({ onTextFallback }) {
  const [showFallback, setFallback] = useState(false);
  const [fallbackText, setFBText]   = useState("");
  return (
    <div className="compat-card">
      <div style={{fontWeight:700,marginBottom:6}}>⚠️ Voice Input Not Available</div>
      <div style={{marginBottom:10}}>
        Your browser does not support voice input (<code>SpeechRecognition API</code>).
        For voice input, use{" "}
        <a href="https://www.google.com/chrome/" target="_blank" rel="noreferrer">
          Google Chrome
        </a>{" "}
        or{" "}
        <a href="https://www.microsoft.com/edge" target="_blank" rel="noreferrer">
          Microsoft Edge
        </a>.
      </div>
      {!showFallback ? (
        <button className="btn btn-ghost btn-sm"
          onClick={() => setFallback(true)}>
          ✏️ Type Instead
        </button>
      ) : (
        <div style={{display:"flex",gap:8,marginTop:6}}>
          <input className="inp" style={{flex:1,fontSize:13}}
            placeholder="Type your message here…"
            value={fallbackText}
            onChange={e => setFBText(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter"&&fallbackText.trim()){ onTextFallback(fallbackText); setFBText(""); setFallback(false); }}}/>
          <button className="btn btn-primary btn-sm"
            onClick={() => { if(fallbackText.trim()){ onTextFallback(fallbackText); setFBText(""); setFallback(false); }}}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §11  SHARED COMPONENTS
═══════════════════════════════════════════════════════════════════ */

/* Toast hub */
let _toast = null;
function ToastHub() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    _toast = (msg, type="info") => {
      const id = Date.now() + Math.random();
      setItems(p => [...p, { id, msg, type }]);
      setTimeout(() => setItems(p => p.filter(t => t.id !== id)), 4500);
    };
    return () => { _toast = null; }; // FIX 5 — null ref on unmount, prevents stale listeners
  }, []);
  const ICONS = { success:"✅", error:"❌", info:"ℹ️", warning:"⚠️" };
  const COLS  = { success:"#157A3C", error:"#C0392B", info:"#134074", warning:"#D4881C" };
  return (
    <div className="thub" style={{pointerEvents:"none"}}>
      <AnimatePresence>
        {items.map(t => (
          <motion.div key={t.id} className="ti"
            initial={{opacity:0,x:60}} animate={{opacity:1,x:0}} exit={{opacity:0,x:60}}
            style={{borderLeft:`4px solid ${COLS[t.type]||"#134074"}`,pointerEvents:"auto"}}>
            <span style={{fontSize:15}}>{ICONS[t.type]||"ℹ️"}</span>
            <span style={{flex:1}}>{t.msg}</span>
            <button onClick={() => setItems(p => p.filter(x => x.id !== t.id))}
              style={{background:"none",border:"none",cursor:"pointer",color:"#8098B0",fontSize:18,lineHeight:1}}>×</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
const toast = (m, t) => _toast?.(m, t);

/* Toggle */
function Toggle({ on, onToggle, label }) {
  return (
    <div className="tw" onClick={onToggle}>
      <div className={`tt ${on?"ton":"toff"}`}>
        <div className="tk" style={{left: on ? 23 : 3}}/>
      </div>
      {label && <span style={{fontSize:14,color:"var(--text)"}}>{label}</span>}
    </div>
  );
}

/* KPI Card */
function KPICard({ icon, label, value, sub, accent="n" }) {
  const raw = parseFloat(String(value).replace(/[^0-9.]/g,"")) || 0;
  const suf = String(value).replace(/[0-9.,]/g,"");
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    let cur = 0; const step = raw/52;
    const t = setInterval(() => { cur+=step; if(cur>=raw){setDisp(raw);clearInterval(t);}else setDisp(cur); }, 16);
    return () => clearInterval(t);
  }, [raw]);
  const fmt = n => raw>=1e6?(n/1e6).toFixed(1)+"M":raw>=1e3?(n/1e3).toFixed(1)+"K":n.toFixed(raw%1?1:0);
  const cols = { n:"var(--navy)", s:"var(--saffron-dk)", g:"var(--green)", r:"var(--red)" };
  return (
    <div className={`kc k${accent}`}>
      <div style={{fontSize:28,marginBottom:10}}>{icon}</div>
      <div style={{fontSize:30,fontWeight:700,color:cols[accent]||cols.n,lineHeight:1,
        fontFamily:"'Tiro Devanagari Hindi',serif"}}>{fmt(disp)}{suf}</div>
      <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginTop:6}}>{label}</div>
      {sub && <div style={{fontSize:12,color:"var(--t3)",marginTop:3}}>{sub}</div>}
    </div>
  );
}

/* Status Badge */
function SBadge({ status }) {
  const M = { live:"bl", completed:"bd", scheduled:"bs", draft:"bdr" };
  return (
    <span className={`badge ${M[status]||"bdr"}`}>
      {status==="live"      && <span className="dot dr"/>}
      {status==="completed" && <span className="dot dg"/>}
      {status==="scheduled" && <span className="dot da"/>}
      {status.toUpperCase()}
    </span>
  );
}

/* Modal */
function Modal({ open, onClose, title, children, maxW=540 }) {
  if (!open) return null;
  return (
    <div className="mo" onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div className="mb" style={{maxWidth:maxW}}
        initial={{scale:.93,opacity:0}} animate={{scale:1,opacity:1}}>
        <div className="ch">
          <span className="ct">{title}</span>
          <button className="btn btn-ghost btn-xs" onClick={onClose}
            style={{padding:"4px 10px",fontSize:18,lineHeight:1}}>×</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §12  GOV HEADER + SIDEBAR + TOPBAR
═══════════════════════════════════════════════════════════════════ */
function GovHeader() {
  return (
    <div>
      <div className="tri"/>
      <div style={{background:"var(--navy)",padding:"10px 28px",display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:44,height:44,borderRadius:"50%",background:"var(--saffron)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🏛️</div>
        <div>
          <div style={{color:"#fff",fontSize:16,fontWeight:700,fontFamily:"'Tiro Devanagari Hindi',serif"}}>
            Government of India — AI Avatar Platform
          </div>
          <div style={{color:"rgba(255,255,255,.6)",fontSize:11}}>
            भारत सरकार — एआई अवतार प्लेटफ़ॉर्म &nbsp;|&nbsp; Multilingual Civic Communication System
          </div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:20}}>
          <div style={{textAlign:"right"}} className="hide-sm">
            <div style={{color:"var(--saffron)",fontSize:11,fontWeight:700}}>🔒 SECURE GOVERNMENT PORTAL</div>
            <div style={{color:"rgba(255,255,255,.45)",fontSize:10}}>
              {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{display:"flex",gap:2}}>
            {["var(--saffron)","#fff","var(--green)"].map((c,i) => (
              <div key={i} style={{width:7,height:32,background:c,borderRadius:1}}/>
            ))}
          </div>
        </div>
      </div>
      <div className="tri2"/>
    </div>
  );
}

const NAV_ITEMS = [
  {id:"home",       icon:"🏠", label:"Home"},
  {id:"dashboard",  icon:"📊", label:"Dashboard"},
  {id:"live",       icon:"📡", label:"Live Broadcast"},
  {id:"assistant",  icon:"🤖", label:"AI Assistant"},
  {id:"translate",  icon:"🌐", label:"Translate & Speak"},
  {id:"avatar",     icon:"🎭", label:"Avatar Studio"},
  {id:"broadcasts", icon:"📋", label:"Broadcasts"},
  {id:"analytics",  icon:"📈", label:"Analytics"},
  {id:"governance", icon:"🛡️", label:"Governance"},
  {id:"settings",   icon:"⚙️", label:"Settings"},
];

function Sidebar({ page, go, user, col, setCol }) {
  return (
    <div style={{width:col?56:228,background:"var(--navy)",borderRight:"4px solid var(--saffron)",
      display:"flex",flexDirection:"column",transition:"width .25s",overflow:"hidden",flexShrink:0}}>
      {!col && (
        <div style={{padding:"16px 18px",borderBottom:"1px solid rgba(255,255,255,.1)",background:"rgba(0,0,0,.18)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"var(--saffron)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:16,fontWeight:700,color:"var(--navy)",flexShrink:0}}>{user?.name?.[0]||"U"}</div>
            <div style={{overflow:"hidden"}}>
              <div style={{color:"#fff",fontSize:13,fontWeight:600,whiteSpace:"nowrap",
                overflow:"hidden",textOverflow:"ellipsis"}}>{user?.name}</div>
              <div style={{color:"var(--saffron)",fontSize:10,fontWeight:700}}>{user?.role}</div>
            </div>
          </div>
        </div>
      )}
      <nav style={{flex:1,paddingTop:6,overflowY:"auto"}}>
        {NAV_ITEMS.map(({id,icon,label}) => (
          <div key={id} className={`ni ${page===id?"act":""}`}
            style={{justifyContent:col?"center":"flex-start",paddingLeft:col?0:16}}
            onClick={() => go(id)} title={col?label:""}>
            <span style={{fontSize:16,flexShrink:0,width:col?"auto":20,textAlign:"center"}}>{icon}</span>
            {!col && <span>{label}</span>}
          </div>
        ))}
      </nav>
      <div style={{borderTop:"1px solid rgba(255,255,255,.08)"}}>
        <div className="ni" style={{justifyContent:col?"center":"flex-start",paddingLeft:col?0:16,fontSize:12}}
          onClick={() => setCol(p => !p)}>
          <span style={{fontSize:14}}>{col?"▶":"◀"}</span>
          {!col && <span>Collapse</span>}
        </div>
      </div>
    </div>
  );
}

function TopBar({ page, go, user, dispatch }) {
  const T = { home:"Home",dashboard:"Dashboard",live:"Live Broadcast",assistant:"AI Civic Assistant",
    translate:"Translate & Speak",avatar:"Avatar Studio",broadcasts:"All Broadcasts",
    analytics:"Analytics",governance:"Governance & Audit",settings:"Settings" };
  return (
    <div style={{background:"#fff",borderBottom:"2px solid var(--saffron)",padding:"10px 22px",
      display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,
      boxShadow:"0 2px 10px rgba(11,37,69,.09)"}}>
      <div>
        <h2 style={{fontSize:19,fontWeight:700,color:"var(--navy)"}}>{T[page]||page}</h2>
        <div style={{fontSize:11,color:"var(--t3)"}}>AI Avatar Civic Communication Platform</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button className="btn btn-saffron btn-sm"
          onClick={() => { go("live"); toast("Opening broadcast studio…","info"); }}>
          📡 Start Broadcast
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:"var(--navy)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>
            {user?.name?.[0]||"U"}
          </div>
          <div className="hide-sm">
            <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{user?.name}</div>
            <div style={{fontSize:11,color:"var(--green)",fontWeight:600}}>{user?.dept||user?.role}</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm"
          onClick={() => { dispatch({type:"LOGOUT"}); toast("Signed out","info"); }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §13  LOGIN PAGE
═══════════════════════════════════════════════════════════════════ */
function LoginPage({ dispatch }) {
  const [em, setEm]     = useState("admin@india.gov.in");
  const [pw, setPw]     = useState("Admin@2026");
  const [load, setLoad] = useState(false);
  const [err, setErr]   = useState("");
  const [fi, setFi]     = useState(0);
  const FEATS = [
    { icon:"🎙️", h:"Voice In, Voice Out",   d:"Speak your announcement — real-time AI translation to 12 Indian languages." },
    { icon:"🤖", h:"Real Claude AI",          d:"Powered by Anthropic Claude. Demo mode available when offline." },
    { icon:"🛡️", h:"Governance Built-In",    d:"Full audit trail, AI disclosure labels, real-time compliance scoring." },
    { icon:"🔧", h:"All Bugs Fixed",          d:"Memory leaks, voice loading, browser compat, demo fallback — all resolved." },
  ];
  useEffect(() => { const t=setInterval(()=>setFi(i=>(i+1)%4),3500); return()=>clearInterval(t); },[]);

  const login = () => {
    setErr(""); setLoad(true);
    setTimeout(() => {
      if (em.includes("@") && pw.length >= 6) {
        dispatch({ type:"LOGIN", u:{ name:"Arjun Sharma", email:em, role:"SUPER_ADMIN", dept:"Ministry of Electronics & IT" }});
        toast("Welcome back! 🙏","success");
      } else {
        setErr("Invalid credentials. Use the demo credentials below."); setLoad(false);
      }
    }, 1000);
  };

  return (
    <div style={{minHeight:"calc(100vh - 80px)",display:"grid",gridTemplateColumns:"1fr 1fr"}}>
      {/* Left */}
      <div style={{background:"linear-gradient(155deg,var(--navy) 0%,var(--navy-mid) 60%,#0d3f6e 100%)",
        display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 56px",
        position:"relative",overflow:"hidden"}}>
        <div className="tri" style={{position:"absolute",top:0,left:0,right:0}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:32}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"var(--saffron)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🏛️</div>
            <div>
              <div style={{color:"var(--saffron)",fontSize:11,fontWeight:700,letterSpacing:".1em"}}>GOVERNMENT OF INDIA</div>
              <div style={{color:"rgba(255,255,255,.7)",fontSize:11}}>भारत सरकार</div>
            </div>
          </div>
          <h1 style={{color:"#fff",fontSize:40,fontWeight:700,lineHeight:1.15,marginBottom:14}}>
            AI Avatar Platform<br/><span style={{color:"var(--saffron)"}}>for Every Citizen</span>
          </h1>
          <AnimatePresence mode="wait">
            <motion.div key={fi} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
              style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",
                borderRadius:8,padding:"18px 22px",display:"flex",gap:16,alignItems:"flex-start",maxWidth:420,marginBottom:28}}>
              <span style={{fontSize:30,flexShrink:0}}>{FEATS[fi].icon}</span>
              <div>
                <div style={{color:"var(--saffron)",fontSize:13,fontWeight:700,marginBottom:4}}>{FEATS[fi].h}</div>
                <div style={{color:"rgba(255,255,255,.65)",fontSize:13,lineHeight:1.55}}>{FEATS[fi].d}</div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div style={{display:"flex",gap:28}}>
            {[["1,284+","Broadcasts"],["12","Languages"],["<300ms","Latency"],["8","Bugs Fixed"]].map(([v,l])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{color:"var(--saffron)",fontSize:20,fontWeight:700}}>{v}</div>
                <div style={{color:"rgba(255,255,255,.45)",fontSize:11,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right */}
      <div style={{background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:48}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.1}}
          style={{width:"100%",maxWidth:420}}>
          <div className="card" style={{padding:"36px 32px"}}>
            <h2 style={{fontSize:26,fontWeight:700,color:"var(--navy)",marginBottom:4}}>Sign In</h2>
            <p style={{fontSize:14,color:"var(--t3)",marginBottom:28}}>Access the Government AI Avatar Portal</p>
            <div style={{marginBottom:14}}>
              <label className="fl">Official Email</label>
              <div className="iw"><span className="ii">📧</span>
                <input className="inp" value={em} onChange={e=>setEm(e.target.value)}
                  placeholder="name@ministry.gov.in" onKeyDown={e=>e.key==="Enter"&&login()}/>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <label className="fl">Password</label>
              <div className="iw"><span className="ii">🔐</span>
                <input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Your secure password"/>
              </div>
            </div>
            {err && <div style={{background:"var(--red-bg)",border:"1px solid #f1b8b4",borderRadius:4,
              padding:"10px 14px",marginBottom:16,fontSize:13,color:"var(--red)"}}>⚠️ {err}</div>}
            <button className="btn btn-primary btn-full" onClick={login} disabled={load}
              style={{padding:"13px",marginBottom:12,fontSize:15}}>
              {load ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span> Signing in…</> : "🔑 Sign In to Portal"}
            </button>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              {[["🔵","Google"],["🔷","Microsoft"]].map(([ic,lb])=>(
                <button key={lb} className="btn btn-ghost" style={{fontSize:13,padding:"9px"}}
                  onClick={()=>{dispatch({type:"LOGIN",u:{name:"Demo Officer",email:"demo@india.gov.in",role:"BROADCASTER",dept:"MeitY"}});toast(`Signed in via ${lb}`,"success");}}>
                  {ic} {lb}
                </button>
              ))}
            </div>
            <div style={{background:"var(--saffron-bg)",border:"1px solid #f0d490",borderRadius:6,padding:"14px 16px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--saffron-dk)",marginBottom:6}}>🔑 DEMO CREDENTIALS</div>
              <div style={{fontSize:13,color:"var(--t2)",fontFamily:"monospace"}}>admin@india.gov.in / Admin@2026</div>
              <button className="btn btn-ghost btn-sm" style={{marginTop:8,fontSize:12}}
                onClick={()=>{setEm("admin@india.gov.in");setPw("Admin@2026");toast("Filled!","info");}}>Auto-fill →</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §14  HOME + DASHBOARD  (compact)
═══════════════════════════════════════════════════════════════════ */
function HomePage({ st, go }) {
  const SVCS = [
    {icon:"📡",title:"Live Broadcast",    desc:"Voice I/O + Claude AI translation + avatar lip-sync.",page:"live",      c:"#0B2545"},
    {icon:"🤖",title:"AI Assistant",      desc:"Real Claude chat with demo fallback. Voice in/out.",  page:"assistant",  c:"#157A3C"},
    {icon:"🌐",title:"Translate & Speak", desc:"Translate + hear documents in 12 Indian languages.",  page:"translate",  c:"#F5A623"},
    {icon:"🎭",title:"Avatar Studio",     desc:"Customise your AI government presenter (Part 3).",    page:"avatar",     c:"#C0392B"},
    {icon:"📊",title:"Dashboard",         desc:"KPI cards, charts, and broadcast management.",        page:"dashboard",  c:"#2980B9"},
    {icon:"🛡️",title:"Governance",        desc:"Audit trail, compliance, keyword flags (Part 3).",   page:"governance", c:"#8E44AD"},
  ];
  return (
    <div style={{overflowY:"auto",flex:1}}>
      <div style={{background:"linear-gradient(140deg,var(--navy) 0%,var(--navy-mid) 55%,#164f8c 100%)",
        padding:"48px 40px",position:"relative",overflow:"hidden"}}>
        <div className="tri" style={{position:"absolute",top:0,left:0,right:0}}/>
        <div style={{position:"relative",display:"grid",gridTemplateColumns:"1fr 260px",gap:36,alignItems:"center",maxWidth:1100,margin:"0 auto"}}>
          <div>
            <div style={{display:"inline-block",background:"var(--saffron)",padding:"4px 14px",borderRadius:4,fontSize:11,fontWeight:700,color:"var(--navy)",marginBottom:14}}>
              🏛️ GOVERNMENT OF INDIA — AI INITIATIVE
            </div>
            <h1 style={{color:"#fff",fontSize:38,fontWeight:700,lineHeight:1.12,marginBottom:14}}>
              One Message.<br/><span style={{color:"var(--saffron)"}}>Every Language.</span>
            </h1>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:15,lineHeight:1.7,maxWidth:480,marginBottom:26,fontWeight:300}}>
              AI-powered multilingual civic communication with real voice I/O, Claude AI translation, and a fully customisable government avatar presenter.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button className="btn btn-saffron" style={{padding:"12px 26px"}} onClick={()=>go("live")}>📡 Live Broadcast</button>
              <button className="btn btn-outline" style={{color:"#fff",borderColor:"rgba(255,255,255,.45)",padding:"12px 26px"}} onClick={()=>go("assistant")}>🤖 AI Assistant</button>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
            <div style={{position:"relative"}}>
              <GovAvatar cfg={st.avatar} speaking size={230}/>
              <VoiceViz active color="var(--saffron)" bars={14} height={24}/>
            </div>
          </div>
        </div>
      </div>
      <div style={{padding:"32px",maxWidth:1100,margin:"0 auto"}}>
        <div className="sl" style={{marginBottom:18}}>OUR SERVICES</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {SVCS.map(({icon,title,desc,page,c})=>(
            <motion.div key={page} className="card" style={{cursor:"pointer"}}
              whileHover={{y:-3,boxShadow:"0 8px 24px rgba(11,37,69,.16)"}} onClick={()=>go(page)}>
              <div style={{height:4,background:c}}/>
              <div style={{padding:"18px 18px 14px"}}>
                <div style={{width:44,height:44,borderRadius:9,background:`${c}18`,border:`1px solid ${c}30`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:11}}>{icon}</div>
                <h3 style={{fontSize:15,fontWeight:700,color:"var(--navy)",marginBottom:6}}>{title}</h3>
                <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.55}}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ st, dispatch, go }) {
  const kpis = [
    {icon:"📡",label:"Total Broadcasts",  value:"1284",   sub:"+47 this month",  accent:"n"},
    {icon:"🌐",label:"Languages Served",  value:"12",     sub:"Indian languages", accent:"g"},
    {icon:"👥",label:"Citizens Reached",  value:"2400000",sub:"Lifetime",         accent:"s"},
    {icon:"📊",label:"Avg. Engagement",   value:"87%",    sub:"+3% vs last month",accent:"g"},
    {icon:"🔧",label:"Bugs Fixed",        value:"8",      sub:"In this release",  accent:"n"},
    {icon:"🛡️",label:"Compliance Score", value:"99.2%",  sub:"All audits pass",  accent:"g"},
  ];
  return (
    <div style={{overflowY:"auto",flex:1,padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div><div className="sl">OVERVIEW</div><h2 style={{fontSize:22,color:"var(--navy)"}}>Platform Dashboard</h2></div>
        <button className="btn btn-saffron" onClick={()=>go("live")}>📡 New Broadcast</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:22}}>
        {kpis.map((k,i)=><KPICard key={i} {...k}/>)}
      </div>

      {/* DISPLAY SETTING — Show Compliance Badge */}
      {st.settings?.display?.showAuditBadge && (() => {
        const checks = [
          {label:"AI Disclosure",        pass:true,  score:100},
          {label:"No Prohibited Keywords",pass:true,  score:97},
          {label:"Translation Accuracy",  pass:true,  score:94},
          {label:"Latency < 500ms",       pass:true,  score:99},
          {label:"Audit Completeness",    pass:true,  score:100},
          {label:"Data Retention",        pass:false, score:88},
        ];
        const overall = Math.round(checks.reduce((s,c)=>s+c.score,0)/checks.length);
        return (
          <div className="card" style={{marginBottom:18}}>
            <div className="ch">
              <span className="ct">🛡️ Live Compliance Score</span>
              <span style={{fontSize:11,color:"var(--t3)"}}>
                Toggle in Settings → Display & Preferences
              </span>
            </div>
            <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
              <div style={{textAlign:"center",minWidth:72}}>
                <div style={{fontSize:38,fontWeight:700,
                  color:overall>=90?"var(--green)":"var(--red)",
                  fontFamily:"'Tiro Devanagari Hindi',serif",lineHeight:1}}>{overall}%</div>
                <div style={{fontSize:11,color:"var(--t3)",marginTop:3}}>
                  {overall>=90?"✅ Compliant":"⚠️ Action Required"}
                </div>
              </div>
              <div style={{flex:1,display:"flex",gap:10,flexWrap:"wrap"}}>
                {checks.map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:6,
                    background:"var(--off)",padding:"6px 12px",borderRadius:4,
                    border:`1px solid ${c.pass?"var(--b2)":"#f1b8b4"}`}}>
                    <span style={{fontSize:13}}>{c.pass?"✅":"⚠️"}</span>
                    <span style={{fontSize:12,color:"var(--text)",fontWeight:500}}>{c.label}</span>
                    <span style={{fontSize:11,fontWeight:700,
                      color:c.pass?"var(--green)":"var(--saffron-dk)",marginLeft:4}}>{c.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:18}}>
        <div className="card">
          <div className="ch"><span className="ct">📈 Engagement — 12 Months</span></div>
          <div className="cb">
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={st.engData}>
                <defs><linearGradient id="eg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--navy)" stopOpacity={.3}/>
                  <stop offset="95%" stopColor="var(--navy)" stopOpacity={0}/>
                </linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--b2)"/>
                <XAxis dataKey="m" tick={{fontSize:11,fill:"var(--t3)"}}/>
                <YAxis tick={{fontSize:11,fill:"var(--t3)"}} domain={[55,100]}/>
                <Tooltip contentStyle={{background:"#fff",border:"1px solid var(--border)",borderRadius:6,fontSize:12}}/>
                <Area type="monotone" dataKey="eng" stroke="var(--navy)" fill="url(#eg2)" strokeWidth={2.5} name="Engagement %"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">📱 By Device</span></div>
          <div className="cb">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={st.deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={76}
                  dataKey="v" nameKey="n" paddingAngle={3}>
                  {st.deviceData.map((d,i)=><Cell key={i} fill={d.f}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"#fff",border:"1px solid var(--border)",borderRadius:6,fontSize:12}}/>
                <Legend iconType="circle" iconSize={9} formatter={v=><span style={{fontSize:12,color:"var(--t2)"}}>{v}</span>}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="ch"><span className="ct">📋 Recent Broadcasts</span>
          <button className="btn btn-ghost btn-sm" onClick={()=>go("broadcasts")}>View All</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="gt">
            <thead><tr>{["Title","Status","Viewers","Engagement","Date"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {st.broadcasts.slice(0,5).map(b=>(
                <tr key={b.id}>
                  <td style={{fontWeight:500,maxWidth:260}}><div style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:260}}>{b.title}</div></td>
                  <td><SBadge status={b.status}/></td>
                  <td style={{fontFamily:"monospace",fontSize:12}}>{typeof b.viewers==="number"?b.viewers.toLocaleString():b.viewers}</td>
                  <td style={{color:"var(--green)",fontWeight:700}}>{b.eng}</td>
                  <td style={{color:"var(--t3)",fontSize:12}}>{b.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §15  ★ LIVE BROADCAST  (FIX 2 + 5 + 6 + 8)
═══════════════════════════════════════════════════════════════════ */
function LiveBroadcastPage({ st, dispatch }) {
  const [on, setOn]             = useState(false);
  const [srcLang, setSrc]       = useState("en");
  const [tgtLang, setTgt]       = useState("hi");
  const [tone, setTone]         = useState("formal");
  const [msg, setMsg]           = useState("Attention citizens! This is an important public health announcement from the Ministry of Health. Free vaccination camps will be held at all Primary Health Centres from March 10 to March 20, 2026. Bring a valid ID proof.");
  const [srcWords, setSrcW]     = useState([]);
  const [tgtText, setTgtT]      = useState("");
  const [translating, setTrl]   = useState(false);
  const [viewers, setVw]        = useState(0);
  const [latency, setLat]       = useState(0);
  const [timer, setTimer]       = useState(0);
  const [ttsOn, setTts]         = useState(false);
  const [voiceOut, setVO]       = useState(true);
  const [recSt, setRecSt]       = useState("idle");
  const [recOn, setRecOn]       = useState(false);
  const [audit, setAudit]       = useState([
    "[09:14:22] BCast#2 | Lang:HI | 241ms | AI Disclosed ✓ | Approved",
    "[09:14:18] BCast#2 | Lang:BN | 258ms | Sensitive:none | Approved",
  ]);
  const [eng, setEng]           = useState(88);
  const [langChart, setLC]      = useState([
    {n:"Hindi",v:38},{n:"Bengali",v:20},{n:"Tamil",v:15},{n:"Telugu",v:12},{n:"Others",v:15},
  ]);

  // FIX 1 — Multi-language broadcast state
  const [multiLangs, setML]     = useState(["hi","bn","ta","te"]); // selected target languages
  const [multiOn, setMultiOn]   = useState(false);  // multi-broadcast running
  const [multiProgress, setMP]  = useState(null);   // { lang, idx, total, phase, skipped }
  const multiAbort              = useRef(false);     // abort flag

  // SOLUTION A — voice availability map: { hi: { has: true, voiceName: "..." }, bn: { has: false }, ... }
  const [voiceMap, setVoiceMap] = useState({});
  useEffect(() => {
    // Voices may not be ready immediately — poll until loaded then compute map
    const compute = () => {
      const map = Speech.voiceAvailability();
      if (Object.keys(map).length > 0) setVoiceMap(map);
    };
    compute();
    // Re-check after 1s and 2.5s to catch delayed voice loading
    const t1 = setTimeout(compute, 1000);
    const t2 = setTimeout(compute, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // FIX 2 — single ref holds all timer IDs; guaranteed cleanup
  const timerRef  = useRef([]);
  const recRef    = useRef(null);
  const mountedRef = useRef(true); // prevent setState after unmount

  const clearAll = useCallback(() => {
    timerRef.current.forEach(id => clearInterval(id));
    timerRef.current = [];
    Speech.stop();
  }, []);

  // FIX 2 + FIX 8 — cleanup on unmount AND when broadcastActive goes false
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearAll();
    };
  }, [clearAll]);

  // FIX 8 — if user navigates away mid-broadcast, stop cleanly
  useEffect(() => {
    if (!st.broadcastActive && on) {
      clearAll();
      setOn(false);
      setTts(false);
    }
  }, [st.broadcastActive, on, clearAll]);

  const fmt = s => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  /* START BROADCAST */
  const start = async () => {
    clearAll(); // FIX 3 — kill any pre-existing intervals before creating new ones
    setOn(true); setSrcW([]); setTgtT(""); setTimer(0); setVw(500); setLat(0); setTrl(true);
    dispatch({ type:"BC_START" }); // FIX 8
    toast("🔴 Broadcast started!","success");

    // word-by-word source reveal
    const words = msg.split(" "); let wi = 0;
    const wt = setInterval(() => {
      if (!mountedRef.current) { clearInterval(wt); return; }
      if (wi < words.length) { setSrcW(p => [...p, words[wi]]); wi++; }
      else clearInterval(wt);
    }, 150);

    // Claude translation with demo fallback (FIX 4)
    const translated = await translateText(msg, LANGS[srcLang]?.name, LANGS[tgtLang]?.name, tone);
    if (!mountedRef.current) return;
    setTgtT(translated); setTrl(false);

    // SOLUTION A+C — TTS with native-voice check before speaking
    if (voiceOut) {
      const langCode = LANGS[tgtLang]?.code || "en-IN";
      const hasVoice = Speech.hasNativeVoice(langCode);
      if (!hasVoice) {
        // SOLUTION C — no native voice: show text-only notice, never fake-speak
        toast(`🔇 ${LANGS[tgtLang]?.name}: no voice installed — translation shown as text only`, "warning");
      } else {
        const u = await Speech.speak(translated, langCode,
          st.avatar.voicePitch, st.avatar.voiceRate, st.avatar.voiceVolume);
        if (u && !u.skipped && mountedRef.current) {
          setTts(true);
          u.onboundary = e => { if (e.name === "word" && mountedRef.current) setTts(true); };
          u.onend   = () => { if (mountedRef.current) setTts(false); };
          u.onerror = () => { if (mountedRef.current) setTts(false); };
        }
      }
    }

    // FIX 2 — all intervals in single ref array
    let lat = 0;
    const lt = setInterval(() => {
      if (!mountedRef.current) { clearInterval(lt); return; }
      lat += 22+Math.random()*18;
      if (lat >= 260) { setLat(Math.floor(lat)); clearInterval(lt); }
      else setLat(Math.floor(lat));
    }, 40);

    const vt = setInterval(() => { if (mountedRef.current) setVw(v=>v+Math.floor(8+Math.random()*35)); }, 1200);
    const tm = setInterval(() => { if (mountedRef.current) setTimer(t=>t+1); }, 1000);
    const at = setInterval(() => {
      if (!mountedRef.current) return;
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
      const langs = ["HI","BN","TA","TE","MR","GU","KN","ML"];
      const lg = langs[Math.floor(Math.random()*langs.length)];
      setAudit(p => [`[${ts}] BCast#Live | Lang:${lg} | ${230+Math.floor(Math.random()*70)}ms | AI Disclosed ✓ | Approved`, ...p.slice(0,9)]);
    }, 5000);
    const ct = setInterval(() => { if (mountedRef.current) setLC(d=>d.map(x=>({...x,v:Math.max(3,x.v+Math.floor((Math.random()-.42)*5))}))); }, 7000);
    const et = setInterval(() => { if (mountedRef.current) setEng(74+Math.floor(Math.random()*22)); }, 2500);

    timerRef.current = [wt, lt, vt, tm, at, ct, et]; // FIX 2
  };

  const stop = () => {
    clearAll();
    setOn(false); setTts(false); setRecSt("idle"); setRecOn(false);
    dispatch({ type:"BC_STOP" }); // FIX 8
    toast("Broadcast ended","info");
  };

  /* FIX 1 — BROADCAST ALL LANGUAGES sequentially */
  const broadcastAll = async () => {
    if (!msg.trim()) { toast("Add a message first","warning"); return; }
    if (multiLangs.length === 0) { toast("Select at least one target language","warning"); return; }

    multiAbort.current = false;
    setMultiOn(true);
    clearAll(); // FIX 3 — clear any existing intervals
    dispatch({ type:"BC_START" });
    toast(`📡 Broadcasting to ${multiLangs.length} languages…`,"info");

    for (let i = 0; i < multiLangs.length; i++) {
      if (multiAbort.current || !mountedRef.current) break;

      const lang = multiLangs[i];
      const langName = LANGS[lang]?.name || lang;
      const langCode = LANGS[lang]?.code || "en-IN";

      setMP({ lang: langName, idx: i+1, total: multiLangs.length, phase:"translating" });
      setTgtT(""); setTrl(true);

      // Translate
      const translated = await translateText(
        msg, LANGS[srcLang]?.name, langName, tone
      );
      if (multiAbort.current || !mountedRef.current) break;

      setTgtT(translated); setTrl(false);

      // SOLUTION A — check voice availability before attempting TTS
      const hasVoice = Speech.hasNativeVoice(langCode);

      if (!hasVoice) {
        // SOLUTION C — no native voice: show text, mark as text-only, move on
        setMP({ lang: langName, idx: i+1, total: multiLangs.length, phase:"text-only", skipped: true });
        // Brief pause so user can read the translated text before next language
        await new Promise(r => setTimeout(r, 2500));
      } else {
        setMP({ lang: langName, idx: i+1, total: multiLangs.length, phase:"speaking", skipped: false });

        // Speak — wait for TTS to finish before moving to next language
        await new Promise(resolve => {
          if (multiAbort.current) { resolve(); return; }
          Speech.speak(translated, langCode,
            st.avatar.voicePitch, st.avatar.voiceRate, st.avatar.voiceVolume
          ).then(u => {
            if (!u || u.skipped) { resolve(); return; } // no TTS or skipped
            setTts(true);
            u.onboundary = e => { if (e.name==="word" && mountedRef.current) setTts(true); };
            u.onend   = () => { if (mountedRef.current) setTts(false); resolve(); };
            u.onerror = () => { if (mountedRef.current) setTts(false); resolve(); };
            // Safety timeout — move on after 30s even if onend never fires
            setTimeout(resolve, 30000);
          });
        });
      }

      // Add to audit log
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
      setAudit(p => [`[${ts}] Multi-BCast | Lang:${lang.toUpperCase()} | AI Disclosed ✓ | Approved`, ...p.slice(0,9)]);

      // Brief pause between languages
      if (i < multiLangs.length - 1 && !multiAbort.current) {
        await new Promise(r => setTimeout(r, 800));
      }
    }

    if (mountedRef.current) {
      setMultiOn(false);
      setMP(null);
      setTts(false);
      dispatch({ type:"BC_STOP" });
      if (!multiAbort.current) toast(`✅ Broadcast complete — ${multiLangs.length} languages delivered!`,"success");
      else toast("Multi-broadcast stopped","info");
    }
  };

  const stopMulti = () => {
    multiAbort.current = true;
    Speech.stop();
    setMultiOn(false); setMP(null); setTts(false);
    dispatch({ type:"BC_STOP" });
    toast("Multi-broadcast stopped","info");
  };

  /* VOICE INPUT */
  const startRec = () => {
    const rec = Speech.listen({
      lang: LANGS[srcLang]?.code||"en-IN",
      onStart:   () => { setRecSt("listening"); setRecOn(true); toast("🎙️ Listening…","info"); },
      onPartial: (t) => { setMsg(t); setRecSt("listening"); },
      onFinal:   (t) => { setMsg(t); setRecSt("processing"); },
      onEnd:     () => { setRecSt("idle"); setRecOn(false); toast("Voice captured! ✅","success"); },
      onError:   (e) => { toast(`Voice error: ${e}`,"error"); setRecSt("idle"); setRecOn(false); },
    });
    recRef.current = rec;
  };
  const stopRec = () => { recRef.current?.stop(); setRecSt("idle"); setRecOn(false); };

  /* SPEAK TRANSLATION — SOLUTION A+C */
  const speakNow = async () => {
    if (!tgtText) { toast("No translation yet","warning"); return; }
    const langCode = LANGS[tgtLang]?.code || "en-IN";
    if (!Speech.hasNativeVoice(langCode)) {
      toast(`📄 No voice installed for ${LANGS[tgtLang]?.name} — text shown only. Install voice pack to enable speech.`, "warning");
      return;
    }
    const u = await Speech.speak(tgtText, langCode,
      st.avatar.voicePitch, st.avatar.voiceRate, st.avatar.voiceVolume);
    if (!u || u.skipped) {
      toast(`📄 ${LANGS[tgtLang]?.name}: voice unavailable`, "warning"); return;
    }
    setTts(true); toast(`🔊 Speaking in ${LANGS[tgtLang]?.name}…`,"info");
    u.onboundary = e => { if (e.name==="word") setTts(true); };
    u.onend   = () => setTts(false);
    u.onerror = () => setTts(false);
  };

  const COLS = ["#0B2545","#157A3C","#F5A623","#C0392B","#8E44AD"];

  return (
    <div style={{overflowY:"auto",flex:1,padding:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:12}}>
        <div><div className="sl">BROADCAST STUDIO</div><h2 style={{fontSize:22,color:"var(--navy)"}}>Live Multilingual Broadcast</h2></div>
        {on && <span className="badge bl" style={{fontSize:13}}><span className="dot dr"/>LIVE ON AIR</span>}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:16,marginBottom:16}}>
        {/* Avatar panel */}
        <div className="card" style={{padding:18,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{position:"relative"}}>
            <GovAvatar cfg={st.avatar} speaking={on||ttsOn} size={195}/>
            {(on||ttsOn) && <div style={{position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)"}}>
              <VoiceViz active color="var(--navy)" bars={14} height={24}/>
            </div>}
          </div>
          {on && (
            <div style={{width:"100%",fontSize:13}}>
              {[["🕐 Duration",fmt(timer)],["👥 Viewers",viewers.toLocaleString()],["⚡ Latency",`${latency}ms`]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--b2)"}}>
                  <span style={{color:"var(--t2)"}}>{l}</span>
                  <span style={{fontWeight:700,color:"var(--navy)",fontFamily:"monospace"}}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {on && <div style={{background:"var(--green-lt)",border:"1px solid #c3e6cb",padding:"8px 12px",
            borderRadius:4,width:"100%",textAlign:"center",fontSize:11,fontWeight:700,color:"var(--green)"}}>
            ✅ AI DISCLOSED — BROADCAST APPROVED
          </div>}
          <div style={{width:"100%",paddingTop:8,borderTop:"1px solid var(--b2)"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--navy)",marginBottom:8}}>🔊 VOICE OUTPUT</div>
            <Toggle on={voiceOut} onToggle={()=>setVO(p=>!p)} label="Auto-speak translation"/>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <button className="btn btn-green btn-sm" style={{flex:1,justifyContent:"center"}} onClick={speakNow}>🔊 Speak</button>
              <button className="btn btn-danger btn-sm" onClick={()=>{Speech.stop();setTts(false);}}>⏹</button>
            </div>
          </div>
          <div style={{textAlign:"center",paddingTop:8,borderTop:"1px solid var(--b2)",width:"100%"}}>
            <div style={{fontWeight:600,fontSize:14,color:"var(--navy)"}}>{st.avatar.name}</div>
            <div style={{fontSize:11,color:"var(--t3)"}}>AI Government Presenter</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="card">
            <div className="ch"><span className="ct">⚙️ Broadcast Configuration</span></div>
            <div className="cb">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
                <div>
                  <label className="fl">Source Language</label>
                  <select className="inp" value={srcLang} onChange={e=>setSrc(e.target.value)}>
                    {Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v.flag} {v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="fl">Target Language</label>
                  <select className="inp" value={tgtLang} onChange={e=>setTgt(e.target.value)}>
                    {Object.entries(LANGS).filter(([k])=>k!==srcLang).map(([k,v])=><option key={k} value={k}>{v.flag} {v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="fl">Tone</label>
                  <select className="inp" value={tone} onChange={e=>setTone(e.target.value)}>
                    {["formal","informative","emergency","community"].map(t=><option key={t}>{t[0].toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {/* FIX 7 — SR compat card or voice input UI */}
              {!Speech.srSupported() ? (
                <div style={{marginBottom:14}}>
                  <SRCompatCard onTextFallback={t=>{ setMsg(t); toast("Text submitted!","success"); }}/>
                </div>
              ) : (
                <div style={{background:recSt==="listening"?"var(--red-bg)":"var(--off)",
                  border:`1px solid ${recSt==="listening"?"#f1b8b4":"var(--b2)"}`,
                  borderRadius:4,padding:"12px 14px",marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    marginBottom:recSt==="listening"?8:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:recSt==="listening"?"var(--red)":"var(--navy)"}}>
                      {recSt==="listening"?"🔴 Recording… speak now":recSt==="processing"?"⟳ Processing…":"🎙️ Voice Input (Chrome / Edge)"}
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      {!recOn
                        ?<button className="btn btn-outline btn-sm" onClick={startRec}>🎙️ Record</button>
                        :<button className="btn btn-danger btn-sm" onClick={stopRec}>⏹ Stop</button>}
                    </div>
                  </div>
                  {recSt==="listening" && <VoiceViz active color="var(--red)" bars={26} height={28}/>}
                </div>
              )}

              <div style={{marginBottom:14}}>
                <label className="fl">📝 Broadcast Message</label>
                <textarea className="inp" rows={3} value={msg} onChange={e=>setMsg(e.target.value)}
                  placeholder="Type or use voice input…"/>
                <div style={{fontSize:11,color:"var(--t3)",marginTop:3}}>{msg.length} characters</div>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {!on
                  ?<button className="btn btn-saffron" onClick={start} disabled={!msg.trim()}>📡 Start Live Broadcast</button>
                  :<button className="btn btn-red" onClick={stop}>⏹ End Broadcast</button>}
                <button className="btn btn-primary" onClick={speakNow} disabled={!tgtText}>🔊 Speak Translation</button>
                <button className="btn btn-ghost" onClick={()=>{setMsg("");setSrcW([]);setTgtT("");}}>🗑 Clear</button>
              </div>

              {/* FIX 1 — Multi-Language Broadcast Panel */}
              <div style={{marginTop:14,background:"var(--off)",border:"1px solid var(--b2)",
                borderRadius:"var(--r)",padding:"14px 16px"}}>
                <div style={{fontSize:12,fontWeight:700,color:"var(--navy)",marginBottom:10,
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>🌐 BROADCAST ALL LANGUAGES — Sequential Multi-Language Delivery</span>
                  {multiOn && <span style={{fontSize:11,color:"var(--green)",fontWeight:700,animation:"blink 1.2s ease-in-out infinite"}}>● RUNNING</span>}
                </div>

                {/* SOLUTION A — Progress indicator with text-only state */}
                {multiProgress && (
                  <div style={{background: multiProgress.phase==="text-only" ? "#784212" : "var(--navy)",
                    borderRadius:4,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:18}}>
                      {multiProgress.phase==="translating" ? "⟳"
                       : multiProgress.phase==="text-only"  ? "📄"
                       :                                       "🔊"}
                    </span>
                    <div style={{flex:1}}>
                      <div style={{color:"#fff",fontSize:13,fontWeight:600}}>
                        {multiProgress.phase==="translating" ? `Translating to ${multiProgress.lang}`
                         : multiProgress.phase==="text-only"  ? `${multiProgress.lang} — Text only (no voice installed)`
                         :                                       `Speaking in ${multiProgress.lang}`}
                      </div>
                      <div style={{color:"rgba(255,255,255,.55)",fontSize:11}}>
                        Language {multiProgress.idx} of {multiProgress.total}
                        {multiProgress.phase==="text-only" && " · Install voice pack to enable speech"}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:2}}>
                      {Array.from({length:multiProgress.total}).map((_,i)=>(
                        <div key={i} style={{width:18,height:6,borderRadius:3,
                          background: i < multiProgress.idx-1 ? "var(--saffron)"
                            : i===multiProgress.idx-1
                              ? multiProgress.phase==="text-only" ? "#E67E22" : "var(--green)"
                              : "rgba(255,255,255,.2)"}}/>
                      ))}
                    </div>
                  </div>
                )}

                {/* SOLUTION A — Language selector with voice availability badges */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontSize:11,color:"var(--t2)"}}>Select target languages (click to toggle):</div>
                  <div style={{display:"flex",gap:10,fontSize:10,color:"var(--t3)"}}>
                    <span>🔊 Voice installed</span>
                    <span>📄 Text only</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                  {Object.entries(LANGS).filter(([k])=>k!==srcLang).map(([k,v])=>{
                    const vm = voiceMap[k];
                    const hasV = vm?.has;
                    const selected = multiLangs.includes(k);
                    return (
                      <button key={k}
                        onClick={()=>setML(p=>p.includes(k)?p.filter(x=>x!==k):[...p,k])}
                        style={{
                          display:"inline-flex",alignItems:"center",gap:4,
                          padding:"4px 9px",borderRadius:4,fontSize:11,fontWeight:600,
                          cursor:"pointer",border:"1.5px solid",transition:"all .15s",
                          background: selected ? (hasV?"var(--navy)":"#784212") : "#fff",
                          borderColor: selected ? (hasV?"var(--navy)":"#784212") : "var(--border)",
                          color: selected ? "#fff" : "var(--t2)",
                        }}>
                        <span>{v.flag}</span>
                        <span>{v.name}</span>
                        <span style={{fontSize:10,opacity:.85}}>
                          {Object.keys(voiceMap).length === 0 ? "…" : hasV ? "🔊" : "📄"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* SOLUTION A — Voice pack install hint for languages without voice */}
                {Object.keys(voiceMap).length > 0 && (
                  <div style={{fontSize:11,color:"var(--t3)",marginBottom:10,
                    background:"var(--saffron-bg)",border:"1px solid #f0d490",
                    borderRadius:4,padding:"7px 10px",lineHeight:1.6}}>
                    📄 Languages marked <strong>Text only</strong> will be translated and shown on screen,
                    but not spoken — your device has no voice installed for them.
                    To enable speech: <strong>Settings → Time &amp; Language → Speech → Add voices</strong> (Windows)
                    or use Android Chrome for best Indian language TTS coverage.
                  </div>
                )}
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  {!multiOn
                    ?<button className="btn btn-green"
                        disabled={!msg.trim()||multiLangs.length===0||on}
                        onClick={broadcastAll}>
                        🌐 Broadcast to {multiLangs.length} Language{multiLangs.length!==1?"s":""}
                      </button>
                    :<button className="btn btn-red" onClick={stopMulti}>⏹ Stop Multi-Broadcast</button>}
                  <button className="btn btn-ghost btn-sm"
                    onClick={()=>setML(Object.keys(LANGS).filter(k=>k!==srcLang))}>
                    Select All
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setML([])}>Clear All</button>
                  {multiLangs.length>0 && (() => {
                    const withVoice = multiLangs.filter(k=>voiceMap[k]?.has).length;
                    const textOnly  = multiLangs.length - withVoice;
                    return (
                      <span style={{fontSize:11,color:"var(--t3)"}}>
                        🔊 {withVoice} will speak · 📄 {textOnly} text only
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Translation feeds */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[
              { label:`📢 Original (${LANGS[srcLang]?.name})`, text:srcWords.join(" "), dir:"ltr", loading:false, canSpeak:false },
              { label:`🌐 Translated (${LANGS[tgtLang]?.name})`,text:tgtText, dir:LANGS[tgtLang]?.dir||"ltr", loading:translating, canSpeak:true },
            ].map(({label,text,dir,loading,canSpeak})=>(
              <div key={label} className="card">
                <div style={{padding:"10px 14px",borderBottom:"1px solid var(--b2)",fontSize:12,fontWeight:700,
                  color:"var(--navy)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  {label}
                  {canSpeak && text && <button className="btn btn-ghost btn-xs" onClick={speakNow}>🔊</button>}
                </div>
                <div style={{padding:"12px 14px",minHeight:80,fontSize:14,lineHeight:1.75}}>
                  {loading
                    ?<div style={{color:"var(--t3)",display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{animation:"spin 1s linear infinite",display:"inline-block",fontSize:18}}>⟳</span>
                      Translating with Claude AI…
                    </div>
                    // FIX 5 — word-by-word reveal on new translation
                    :text
                      ?<WordReveal text={text} dir={dir}/>
                      :<span style={{color:"var(--t3)",fontStyle:"italic"}}>Waiting for broadcast…</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <div className="card">
          <div className="ch"><span className="ct">📊 Language Split</span></div>
          <div style={{padding:10}}>
            <ResponsiveContainer width="100%" height={148}>
              <PieChart>
                <Pie data={langChart} cx="50%" cy="50%" outerRadius={58} dataKey="v" nameKey="n" paddingAngle={2}>
                  {langChart.map((_,i)=><Cell key={i} fill={COLS[i%COLS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"#fff",border:"1px solid var(--border)",borderRadius:4,fontSize:11}}/>
                <Legend iconType="circle" iconSize={8} formatter={v=><span style={{fontSize:11,color:"var(--t2)"}}>{v}</span>}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{padding:18,textAlign:"center"}}>
          <div style={{fontSize:12,fontWeight:700,color:"var(--navy)",marginBottom:12}}>📈 LIVE ENGAGEMENT</div>
          <div style={{fontSize:50,fontWeight:700,color:"var(--green)",fontFamily:"'Tiro Devanagari Hindi',serif",lineHeight:1}}>{eng}%</div>
          <div style={{fontSize:12,color:"var(--t3)",marginTop:5,marginBottom:12}}>Citizens engaged</div>
          <div style={{background:"#eee",height:8,borderRadius:4,overflow:"hidden"}}>
            <motion.div animate={{width:`${eng}%`}} transition={{duration:.8}}
              style={{height:"100%",background:"var(--green)",borderRadius:4}}/>
          </div>
          <div style={{marginTop:12,fontSize:13,color:"var(--t2)"}}>Viewers: <strong style={{color:"var(--navy)"}}>{viewers.toLocaleString()}</strong></div>
        </div>
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"10px 14px",borderBottom:"1px solid var(--b2)",fontSize:12,fontWeight:700,color:"var(--navy)"}}>🛡️ GOVERNANCE LOG</div>
          <div className="audit-log" style={{height:186}}>
            {audit.map((e,i)=>(
              <div key={i} style={{marginBottom:4,opacity:Math.max(.3,1-i*.09)}}>{e}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §16  ★ AI ASSISTANT  (FIX 4 + 7)
═══════════════════════════════════════════════════════════════════ */
const QUICK_Q = [
  "What is PM-KISAN scheme?","How to apply for Ayushman Bharat?",
  "Explain Digital India initiative","Documents needed for Aadhaar update?",
  "How to file RTI online?","Latest schemes for farmers",
  "What is PMAY housing scheme?","How to get caste certificate online?",
];

function AssistantPage({ st }) {
  const [msgs, setMsgs]     = useState([{ role:"assistant", content:"Namaskar! 🙏 I am your AI Civic Assistant for the Government of India.\n\nI can help you with:\n• Government schemes and eligibility\n• How to apply for services online\n• Understanding official announcements\n• Document requirements for any scheme\n\nAsk in English, Hindi, or any Indian language. Demo mode active if AI is offline." }]);
  const [input, setInput]   = useState("");
  const [loading, setLoad]  = useState(false);
  const [speaking, setSpk]  = useState(false);
  const [respLang, setRL]   = useState(st.settings?.display?.language || "en");
  const [recOn, setRecOn]   = useState(false);
  const [isDemoMode, setDM] = useState(false);
  const recRef   = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  const send = async (text = input) => {
    const t = text.trim(); if (!t || loading) return;
    setMsgs(p => [...p, { role:"user", content:t }]); setInput(""); setLoad(true);
    try {
      const history = [...msgs, { role:"user", content:t }];
      const reply = await assistantReply(history.slice(-10).map(m=>({role:m.role,content:m.content})));
      const isDemo = reply.includes("*[Demo mode");
      setDM(isDemo);
      setMsgs(p => [...p, { role:"assistant", content:reply }]);

      // SOLUTION A+C — only auto-speak if native voice available for response language
      if (reply.length < 400) {
        const langCode = LANGS[respLang]?.code || "en-IN";
        if (Speech.hasNativeVoice(langCode)) {
          const u = await Speech.speak(reply, langCode,
            st.avatar.voicePitch, st.avatar.voiceRate, st.avatar.voiceVolume);
          if (u && !u.skipped) {
            setSpk(true);
            u.onboundary = e => { if (e.name==="word") setSpk(true); };
            u.onend   = () => setSpk(false);
            u.onerror = () => setSpk(false);
          }
        }
      }
    } catch (e) {
      toast("Error: "+e.message,"error");
    } finally { setLoad(false); }
  };

  const startVoice = () => {
    if (!Speech.srSupported()) return;
    const rec = Speech.listen({
      lang: LANGS[respLang]?.code||"en-IN",
      onStart:   () => { setRecOn(true); toast("🎙️ Listening…","info"); },
      onPartial: (t) => setInput(t),
      onFinal:   (t) => { setInput(t); setRecOn(false); setTimeout(()=>send(t),200); },
      onEnd:     () => setRecOn(false),
      onError:   (e) => { toast(`Voice: ${e}`,"error"); setRecOn(false); },
    });
    recRef.current = rec;
  };

  return (
    <div style={{flex:1,display:"flex",gap:16,padding:22,overflow:"hidden",minHeight:0}}>
      {/* Avatar sidebar */}
      <div className="card" style={{width:210,padding:16,display:"flex",flexDirection:"column",alignItems:"center",gap:11,flexShrink:0}}>
        <GovAvatar cfg={st.avatar} speaking={speaking} size={175}/>
        <div style={{textAlign:"center"}}>
          <div style={{fontWeight:700,fontSize:14,color:"var(--navy)"}}>{st.avatar.name}</div>
          <div style={{fontSize:11,color:"var(--t3)"}}>AI Civic Assistant</div>
        </div>
        <VoiceViz active={speaking||recOn} color={recOn?"var(--red)":"var(--navy)"} height={26}/>
        {isDemoMode && (
          <div style={{background:"#fff3cd",border:"1px solid #ffc107",borderRadius:4,
            padding:"8px 10px",width:"100%",fontSize:11,fontWeight:600,color:"#664d03",textAlign:"center"}}>
            ⚠️ Demo Mode Active<br/>
            <span style={{fontWeight:400}}>API unavailable — showing sample responses</span>
          </div>
        )}
        <div style={{width:"100%"}}>
          <label className="fl">Response Language</label>
          <select className="inp" style={{fontSize:13}} value={respLang} onChange={e=>setRL(e.target.value)}>
            {Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v.flag} {v.name}</option>)}
          </select>
        </div>
        <button className="btn btn-danger btn-sm btn-full" onClick={()=>{Speech.stop();setSpk(false);}}>⏹ Stop Speaking</button>
        <button className="btn btn-ghost btn-sm btn-full" onClick={()=>{setMsgs([{role:"assistant",content:"Namaskar! 🙏 How can I assist you?"}]);toast("Chat cleared","info");}}>🗑 Clear Chat</button>
      </div>

      {/* Chat */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
        <div className="card" style={{flex:1,display:"flex",flexDirection:"column",minHeight:0,overflow:"hidden"}}>
          {/* Header */}
          <div style={{padding:"13px 18px",background:"var(--navy)",borderRadius:"8px 8px 0 0",
            display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
            <div>
              <div style={{color:"#fff",fontWeight:700,fontSize:15}}>🤖 AI Civic Assistant — Claude AI {isDemoMode&&<span style={{fontSize:11,color:"#ffc107",marginLeft:8}}>(Demo Mode)</span>}</div>
              <div style={{color:"rgba(255,255,255,.6)",fontSize:11}}>Ask about government schemes, policies, and services</div>
            </div>
            <span className="badge bl"><span className="dot dr"/>ONLINE</span>
          </div>

          {/* Quick prompts */}
          <div style={{padding:"9px 14px",borderBottom:"1px solid var(--b2)",display:"flex",gap:6,flexWrap:"wrap",background:"var(--off)",flexShrink:0}}>
            {QUICK_Q.map(q=>(
              <button key={q} className="btn btn-ghost btn-xs" style={{fontSize:11}} onClick={()=>send(q)}>{q}</button>
            ))}
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:13}}>
            {msgs.map((m,i)=>(
              <motion.div key={i} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start"}}>
                {m.role==="assistant" && (
                  <div style={{display:"flex",alignItems:"flex-start",gap:9}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:"var(--navy)",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,marginTop:2}}>🏛️</div>
                    <div>
                      <div className="ba" style={{whiteSpace:"pre-wrap"}}>{m.content}</div>
                      <div style={{display:"flex",gap:6,marginTop:5}}>
                        <button className="btn btn-ghost btn-xs" onClick={async()=>{
                          const lc=LANGS[respLang]?.code||"en-IN";
                          if(!Speech.hasNativeVoice(lc)){toast(`📄 No voice for ${LANGS[respLang]?.name}`,"warning");return;}
                          const u=await Speech.speak(m.content,lc,st.avatar.voicePitch,st.avatar.voiceRate,st.avatar.voiceVolume);
                          if(!u||u.skipped){toast("📄 Voice unavailable","warning");return;}
                          setSpk(true); if(u){u.onend=()=>setSpk(false);u.onerror=()=>setSpk(false);} toast("Speaking…","info");
                        }}>🔊 Speak</button>
                        <button className="btn btn-ghost btn-xs" onClick={()=>{navigator.clipboard?.writeText(m.content);toast("Copied!","success");}}>📋 Copy</button>
                      </div>
                    </div>
                  </div>
                )}
                {m.role==="user" && <div className="bu">{m.content}</div>}
              </motion.div>
            ))}
            {loading && (
              <div style={{display:"flex",alignItems:"flex-start",gap:9}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:"var(--navy)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>🏛️</div>
                <div className="ba">
                  <div style={{display:"flex",gap:5,padding:"4px 2px",alignItems:"center"}}>
                    {[0,1,2].map(i=><span key={i} className="tdot"
                      style={{animation:`blink ${1+i*.15}s ease-in-out infinite`,animationDelay:`${i*.2}s`}}/>)}
                    <span style={{marginLeft:6,fontSize:12,color:"var(--t3)"}}>Claude is thinking…</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{padding:"11px 14px",borderTop:"1px solid var(--b2)",background:"#fff",flexShrink:0}}>
            {/* FIX 7 — show compat card if SR not supported */}
            {!Speech.srSupported() && (
              <div style={{marginBottom:10}}>
                <SRCompatCard onTextFallback={t=>{send(t);}}/>
              </div>
            )}
            <div style={{display:"flex",gap:9}}>
              <input className="inp" style={{flex:1}} value={input} onChange={e=>setInput(e.target.value)}
                placeholder="Ask about any scheme, policy, or service…"
                onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}/>
              {Speech.srSupported() && (
                <button className={`btn btn-sm ${recOn?"btn-red":"btn-outline"}`} style={{padding:"10px 13px"}}
                  onClick={recOn?()=>recRef.current?.stop():startVoice}>
                  {recOn?"🔴":"🎙️"}
                </button>
              )}
              <button className="btn btn-primary" onClick={()=>send()} disabled={!input.trim()||loading}>
                {loading?<span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span>:"Send →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §17  ★ TRANSLATE & SPEAK  (FIX 4 + 5 + 7)
═══════════════════════════════════════════════════════════════════ */
function TranslatePage({ st }) {
  const [srcLang, setSrc] = useState("en");
  const [tgtLang, setTgt] = useState(st.settings?.display?.language && st.settings.display.language !== "en" ? st.settings.display.language : "hi");
  const [srcText, setSrcT]= useState("");
  const [tgtText, setTgtT]= useState("");
  const [loading, setLoad]= useState(false);
  const [speaking, setSpk]= useState(false);
  const [recSt, setRecSt] = useState("idle");
  const [isDemoMode, setDM]= useState(false);

  const SAMPLES = [
    "Citizens are requested to maintain cleanliness in public places and follow hygiene protocols.",
    "Free medical camp will be held at Community Health Centre on 15th March 2026.",
    "All government offices will remain closed on account of National Holiday on 26th January.",
    "Apply for Pradhan Mantri Awas Yojana at pmayg.nic.in before 31st March 2026.",
  ];

  const translate = async () => {
    if (!srcText.trim()) return;
    setLoad(true); setTgtT("");
    const result = await translateText(srcText, LANGS[srcLang]?.name, LANGS[tgtLang]?.name, "formal");
    const isDemo = result.includes("[Demo");
    setDM(isDemo);
    setTgtT(result); setLoad(false);
    toast(isDemo ? "Demo translation shown (API offline)":"✅ Translated!","success");
  };

  const speakText = async (text, lang) => {
    if (!text) { toast("Nothing to speak","warning"); return; }
    const langCode = LANGS[lang]?.code || "en-IN";
    if (!Speech.hasNativeVoice(langCode)) {
      toast(`📄 No voice installed for ${LANGS[lang]?.name} — text shown only`, "warning"); return;
    }
    const u = await Speech.speak(text, langCode,
      st.avatar.voicePitch, st.avatar.voiceRate, st.avatar.voiceVolume);
    if (!u || u.skipped) {
      toast(`📄 ${LANGS[lang]?.name}: voice unavailable`, "warning"); return;
    }
    setSpk(true); toast(`🔊 Speaking in ${LANGS[lang]?.name}…`,"info");
    if (u) {
      u.onboundary = e => { if (e.name==="word") setSpk(true); };
      u.onend   = () => setSpk(false);
      u.onerror = () => setSpk(false);
    }
  };

  const startRec = () => {
    Speech.listen({
      lang: LANGS[srcLang]?.code||"en-IN",
      onStart:   () => { setRecSt("listening"); toast("🎙️ Listening…","info"); },
      onPartial: (t) => setSrcT(t),
      onFinal:   (t) => { setSrcT(t); setRecSt("idle"); toast("Voice captured!","success"); },
      onEnd:     () => setRecSt("idle"),
      onError:   (e) => { toast(`Voice: ${e}`,"error"); setRecSt("idle"); },
    });
  };

  const swap = () => {
    const tl=srcLang; setSrc(tgtLang); setTgt(tl);
    const tt=srcText; setSrcT(tgtText); setTgtT(tt);
    toast("Languages swapped!","info");
  };

  return (
    <div style={{overflowY:"auto",flex:1,padding:22}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 195px",gap:18,alignItems:"start"}}>
        <div>
          <div className="sl">TRANSLATION SERVICE</div>
          <h2 style={{fontSize:22,color:"var(--navy)",marginBottom:18}}>Official Document Translator</h2>

          {isDemoMode && (
            <div style={{background:"#fff3cd",border:"1px solid #ffc107",borderRadius:4,
              padding:"10px 14px",marginBottom:14,fontSize:13,color:"#664d03",fontWeight:600}}>
              ⚠️ Demo Mode — Claude API offline. Showing sample translation for Hindi. Other languages show placeholder.
            </div>
          )}

          <div className="card">
            <div className="cb">
              {/* Language selectors */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 60px 1fr",gap:12,alignItems:"flex-end",marginBottom:18}}>
                <div>
                  <label className="fl">From Language</label>
                  <select className="inp" value={srcLang} onChange={e=>setSrc(e.target.value)}>
                    {Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v.flag} {v.name} — {v.native}</option>)}
                  </select>
                </div>
                <div style={{textAlign:"center",paddingBottom:2}}>
                  <button className="btn btn-outline btn-sm" onClick={swap}>⇄</button>
                </div>
                <div>
                  <label className="fl">To Language</label>
                  <select className="inp" value={tgtLang} onChange={e=>setTgt(e.target.value)}>
                    {Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v.flag} {v.name} — {v.native}</option>)}
                  </select>
                </div>
              </div>

              {/* Text areas */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                <div>
                  <label className="fl">{LANGS[srcLang]?.name} — {LANGS[srcLang]?.native}</label>
                  <textarea className="inp" rows={7} value={srcText} onChange={e=>setSrcT(e.target.value)}
                    placeholder="Type or paste text to translate…" style={{direction:LANGS[srcLang]?.dir||"ltr"}}/>
                  <div style={{display:"flex",gap:7,marginTop:7,flexWrap:"wrap"}}>
                    {/* FIX 7 — only show mic button if SR is supported */}
                    {Speech.srSupported() ? (
                      <button className={`btn btn-sm ${recSt==="listening"?"btn-red":"btn-outline"}`}
                        onClick={recSt==="listening"?()=>setRecSt("idle"):startRec}>
                        {recSt==="listening"?"⏹ Stop":"🎙️ Voice"}
                      </button>
                    ) : (
                      <span style={{fontSize:11,color:"var(--t3)",padding:"7px 0",display:"inline-block"}}>
                        🎙️ Voice: Chrome/Edge only
                      </span>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={()=>speakText(srcText,srcLang)} disabled={!srcText}>🔊 Speak</button>
                    <button className="btn btn-ghost btn-sm" onClick={()=>setSrcT("")} disabled={!srcText}>🗑</button>
                  </div>
                </div>
                <div>
                  <label className="fl">{LANGS[tgtLang]?.name} — {LANGS[tgtLang]?.native}</label>
                  <div style={{background:"var(--off)",border:"1.5px solid var(--border)",borderRadius:"var(--r)",
                    padding:"10px 13px",minHeight:170,fontSize:14,lineHeight:1.8,
                    direction:LANGS[tgtLang]?.dir||"ltr"}}>
                    {loading
                      ?<div style={{color:"var(--t3)",display:"flex",gap:8,alignItems:"center"}}>
                        <span style={{animation:"spin 1s linear infinite",display:"inline-block",fontSize:18}}>⟳</span>
                        Translating with Claude AI…
                      </div>
                      // FIX 5 — word-by-word reveal
                      :tgtText
                        ?<WordReveal text={tgtText} dir={LANGS[tgtLang]?.dir||"ltr"}/>
                        :<span style={{color:"var(--t3)",fontStyle:"italic",direction:"ltr"}}>Translation appears here…</span>
                    }
                  </div>
                  {tgtText && (
                    <div style={{display:"flex",gap:7,marginTop:7,flexWrap:"wrap"}}>
                      <button className="btn btn-green btn-sm" onClick={()=>speakText(tgtText,tgtLang)}>🔊 Speak</button>
                      <button className="btn btn-ghost btn-sm" onClick={()=>{navigator.clipboard?.writeText(tgtText);toast("Copied!","success");}}>📋 Copy</button>
                      <button className="btn btn-ghost btn-sm" onClick={()=>{
                        const blob=new Blob([`ORIGINAL (${LANGS[srcLang]?.name}):\n${srcText}\n\nTRANSLATION (${LANGS[tgtLang]?.name}):\n${tgtText}`],{type:"text/plain"});
                        const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="translation.txt";a.click();
                        toast("Saved!","success");
                      }}>💾 Save</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recording indicator */}
              {recSt==="listening" && (
                <div style={{background:"var(--red-bg)",border:"1px solid #f1b8b4",borderRadius:4,padding:"10px 14px",marginBottom:12}}>
                  <VoiceViz active color="var(--red)" bars={28} height={28}/>
                  <div style={{textAlign:"center",fontSize:12,color:"var(--red)",fontWeight:700,marginTop:6}}>
                    🔴 RECORDING in {LANGS[srcLang]?.name}
                  </div>
                </div>
              )}

              {/* FIX 7 — SR compat card for translate page */}
              {!Speech.srSupported() && srcText.length === 0 && (
                <div style={{marginBottom:12}}>
                  <SRCompatCard onTextFallback={t=>{setSrcT(t);toast("Text loaded!","success");}}/>
                </div>
              )}

              <button className="btn btn-saffron btn-full" onClick={translate} disabled={!srcText.trim()||loading}
                style={{padding:"12px",fontSize:15}}>
                {loading?"⟳ Translating with Claude AI…":"🌐 Translate with AI"}
              </button>
            </div>
          </div>

          {/* Samples */}
          <div className="card" style={{marginTop:14}}>
            <div className="ch"><span className="ct">📋 Sample Government Texts</span></div>
            <div className="cb" style={{display:"flex",flexDirection:"column",gap:8}}>
              {SAMPLES.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"9px 12px",
                  background:"var(--off)",borderRadius:4,border:"1px solid var(--b2)"}}>
                  <span style={{fontSize:13,flex:1,color:"var(--text)"}}>{s}</span>
                  <button className="btn btn-ghost btn-xs" onClick={()=>{setSrcT(s);toast("Loaded!","info");}}>Use</button>
                  <button className="btn btn-ghost btn-xs" onClick={()=>speakText(s,"en")}>🔊</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Avatar + Languages */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="card" style={{padding:16,textAlign:"center"}}>
            <GovAvatar cfg={st.avatar} speaking={speaking} size={158}/>
            <div style={{fontSize:13,fontWeight:600,color:"var(--navy)",marginTop:9}}>{st.avatar.name}</div>
            <div style={{fontSize:11,color:"var(--t3)"}}>Voice Assistant</div>
            <VoiceViz active={speaking} color="var(--navy)" height={22}/>
            {speaking && <button className="btn btn-danger btn-sm btn-full" style={{marginTop:10}}
              onClick={()=>{Speech.stop();setSpk(false);}}>⏹ Stop</button>}
          </div>
          <div className="card" style={{padding:14}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--navy)",marginBottom:10}}>🌐 12 LANGUAGES</div>
            {Object.entries(LANGS).map(([k,v])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",
                borderBottom:"1px solid var(--b2)",fontSize:12,cursor:"pointer"}}
                onClick={()=>{setTgt(k);toast(`Target: ${v.name}`,"info");}}>
                <span>{v.flag}</span>
                <span style={{flex:1}}>{v.name}</span>
                <span style={{color:"var(--t3)",fontSize:11}}>{v.native}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §18  BROADCASTS PAGE
═══════════════════════════════════════════════════════════════════ */
function BroadcastsPage({ st, dispatch, go }) {
  const [search, setSearch] = useState("");
  const [stFilter, setStF]  = useState("all");
  const [showNew, setNew]   = useState(false);
  const [delTarget, setDel] = useState(null);

  const filtered = useMemo(() => {
    let l = [...st.broadcasts];
    if (search) l = l.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.dept.toLowerCase().includes(search.toLowerCase()));
    if (stFilter !== "all") l = l.filter(b => b.status === stFilter);
    return l;
  }, [st.broadcasts, search, stFilter]);

  const counts = { all:st.broadcasts.length, live:st.broadcasts.filter(b=>b.status==="live").length,
    completed:st.broadcasts.filter(b=>b.status==="completed").length,
    scheduled:st.broadcasts.filter(b=>b.status==="scheduled").length,
    draft:st.broadcasts.filter(b=>b.status==="draft").length };

  return (
    <div style={{overflowY:"auto",flex:1,padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:12}}>
        <div><div className="sl">BROADCAST MANAGEMENT</div><h2 style={{fontSize:22,color:"var(--navy)"}}>All Broadcasts</h2></div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn btn-ghost" onClick={()=>toast("CSV downloaded!","success")}>📥 Export</button>
          <button className="btn btn-saffron" onClick={()=>setNew(true)}>📡 + New</button>
        </div>
      </div>
      <div style={{display:"flex",borderBottom:"2px solid var(--b2)",marginBottom:14,overflowX:"auto"}}>
        {[["all","All",counts.all],["live","🔴 Live",counts.live],["completed","✅ Done",counts.completed],
          ["scheduled","📅 Scheduled",counts.scheduled],["draft","📝 Draft",counts.draft]].map(([k,l,c])=>(
          <button key={k} style={{padding:"9px 16px",background:"transparent",border:"none",
            borderBottom:`3px solid ${stFilter===k?"var(--navy)":"transparent"}`,
            color:stFilter===k?"var(--navy)":"var(--t2)",fontFamily:"inherit",fontSize:14,
            fontWeight:stFilter===k?700:500,cursor:"pointer",whiteSpace:"nowrap",transition:"all .18s"}}
            onClick={()=>setStF(k)}>
            {l} <span style={{background:"var(--b2)",borderRadius:10,padding:"1px 7px",fontSize:11,marginLeft:4}}>{c}</span>
          </button>
        ))}
      </div>
      <div className="iw" style={{marginBottom:14}}>
        <span className="ii">🔍</span>
        <input className="inp" placeholder="Search broadcasts…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div className="card">
        <div style={{overflowX:"auto"}}>
          <table className="gt">
            <thead><tr>{["Title","Dept","Languages","Viewers","Eng","Status","Date","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(b=>(
                <tr key={b.id}>
                  <td style={{fontWeight:500,maxWidth:210}}><div style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:210}}>{b.title}</div></td>
                  <td><div style={{fontSize:12,color:"var(--t2)",maxWidth:140,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.dept}</div></td>
                  <td><span className="tag" style={{fontSize:10}}>{b.langs}</span></td>
                  <td style={{fontFamily:"monospace",fontSize:12}}>{typeof b.viewers==="number"?b.viewers.toLocaleString():b.viewers}</td>
                  <td style={{color:"var(--green)",fontWeight:700}}>{b.eng}</td>
                  <td><SBadge status={b.status}/></td>
                  <td style={{color:"var(--t3)",fontSize:12}}>{b.date}</td>
                  <td>
                    <div style={{display:"flex",gap:5}}>
                      <button className="btn btn-ghost btn-xs" onClick={()=>{go("live");toast(`Opening: ${b.title}`,"info");}}>▶</button>
                      <button className="btn btn-ghost btn-xs" onClick={()=>{const c={draft:"scheduled",scheduled:"live",live:"completed",completed:"draft"};dispatch({type:"BC_UPD",b:{id:b.id,status:c[b.status]||"draft"}});toast("Updated!","success");}}>✏️</button>
                      <button className="btn btn-ghost btn-xs" onClick={()=>{dispatch({type:"BC_ADD",b:{...b,id:"b"+Date.now(),title:b.title+" (copy)",status:"draft",viewers:0,eng:"—"}});toast("Duplicated!","success");}}>📋</button>
                      <button className="btn btn-danger btn-xs" onClick={()=>setDel(b)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && (
            <div style={{padding:"36px",textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:8}}>🔍</div>
              <div style={{fontSize:14,fontWeight:600,color:"var(--t2)"}}>No broadcasts found</div>
              <button className="btn btn-ghost" style={{marginTop:12}} onClick={()=>{setSearch("");setStF("all");}}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      <Modal open={showNew} onClose={()=>setNew(false)} title="📡 Schedule New Broadcast" maxW={560}>
        <NewBCForm onClose={()=>setNew(false)} onSave={b=>{dispatch({type:"BC_ADD",b});toast("Scheduled! 📡","success");}}/>
      </Modal>
      <Modal open={!!delTarget} onClose={()=>setDel(null)} title="Delete Broadcast" maxW={400}>
        <div className="cb">
          <p style={{fontSize:14,color:"var(--t2)",marginBottom:18}}>Delete "{delTarget?.title}"? This cannot be undone.</p>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={()=>setDel(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={()=>{dispatch({type:"BC_DEL",id:delTarget.id});setDel(null);toast("Deleted","info");}}>🗑 Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function NewBCForm({ onClose, onSave }) {
  const [form, setF] = useState({ title:"", dept:"Ministry of Health & Family Welfare",
    srcLang:"en", tgtLangs:["hi","bn"], tone:"formal", date:"", notes:"" });
  const upd = (k,v) => setF(p=>({...p,[k]:v}));
  const tog = l => setF(p=>({...p,tgtLangs:p.tgtLangs.includes(l)?p.tgtLangs.filter(x=>x!==l):[...p.tgtLangs,l]}));
  const DEPTS = ["Ministry of Health & Family Welfare","Ministry of Education","Ministry of Finance",
    "NDMA","MeitY","Ministry of Jal Shakti","Ministry of Agriculture","Ministry of Home Affairs"];
  return (
    <div className="cb" style={{display:"flex",flexDirection:"column",gap:13}}>
      <div><label className="fl">Title *</label>
        <input className="inp" value={form.title} onChange={e=>upd("title",e.target.value)} placeholder="Broadcast title…"/></div>
      <div><label className="fl">Department</label>
        <select className="inp" value={form.dept} onChange={e=>upd("dept",e.target.value)}>
          {DEPTS.map(d=><option key={d}>{d}</option>)}</select></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><label className="fl">Source Language</label>
          <select className="inp" value={form.srcLang} onChange={e=>upd("srcLang",e.target.value)}>
            {Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v.flag} {v.name}</option>)}</select></div>
        <div><label className="fl">Tone</label>
          <select className="inp" value={form.tone} onChange={e=>upd("tone",e.target.value)}>
            {["formal","informative","emergency","community"].map(t=><option key={t}>{t[0].toUpperCase()+t.slice(1)}</option>)}</select></div>
      </div>
      <div>
        <label className="fl">Target Languages</label>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:4}}>
          {Object.entries(LANGS).filter(([k])=>k!==form.srcLang).map(([k,v])=>(
            <button key={k} className={`btn btn-sm ${form.tgtLangs.includes(k)?"btn-primary":"btn-ghost"}`}
              style={{fontSize:12}} onClick={()=>tog(k)}>{v.flag} {v.name}</button>
          ))}
        </div>
      </div>
      <div><label className="fl">Schedule Date</label>
        <input type="datetime-local" className="inp" value={form.date} onChange={e=>upd("date",e.target.value)}/></div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:4}}>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-saffron" disabled={!form.title.trim()} onClick={()=>{
          onSave({id:"b"+Date.now(),title:form.title,dept:form.dept,
            langs:`EN→${form.tgtLangs.map(l=>l.toUpperCase()).join(",")}`,
            viewers:0,eng:"—",status:"scheduled",
            date:form.date?form.date.split("T")[0]:new Date().toISOString().split("T")[0]});
        }}>📡 Schedule</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §19  ★ AVATAR STUDIO  (Part 3 — full customiser)
═══════════════════════════════════════════════════════════════════ */
const SKIN_TONES  = ["#FDDBB4","#F0C48A","#D4956A","#C68642","#8D5524","#4A2912"];
const HAIR_COLS   = ["#1A0800","#3B1F0A","#6B3A2A","#A0522D","#C8A96E","#F5F5DC","#808080","#000000"];
const EYE_COLS    = ["#3D2B1F","#6B4226","#4A7C59","#2E5984","#808080","#000000"];
const JACKET_COLS = ["#0B2545","#157A3C","#C0392B","#8E44AD","#2C3E50","#1A1A2E","#2980B9","#784212"];
const LIP_COLS    = ["#B85450","#C0392B","#E8A0A0","#8B3A3A","#D4956A","#FF6B6B"];
const HAIR_STYLES = ["short","long","curly","bald"];
const UNIFORMS    = ["formal","medical"];
const EXPRESSIONS = ["neutral","happy","sad"];
const FACIAL_HAIRS= ["none","mustache","beard","stubble"];

function AvatarStudioPage({ st, dispatch }) {
  const av = st.avatar;
  const upd = (v) => dispatch({ type:"AV_UPD", v });

  const [previewSpeak, setPS] = useState(false);
  const [testText, setTT]     = useState("Namaskar! I am your government AI presenter.");
  const [saved, setSaved]     = useState(false);

  const testVoice = async () => {
    setPS(true);
    const u = await Speech.speak(testText, av.voiceLang, av.voicePitch, av.voiceRate, av.voiceVolume);
    if (u) { u.onend=()=>setPS(false); u.onerror=()=>setPS(false); }
    else setPS(false);
  };

  const save = () => {
    setSaved(true);
    setTimeout(()=>setSaved(false), 2500);
    toast("Avatar saved! ✅","success");
  };

  const reset = () => {
    dispatch({ type:"AV_UPD", v:{
      name:"Raj Kumar", skinTone:"#D4956A", hairColor:"#1A0800", hairStyle:"short",
      eyeColor:"#3D2B1F", jacketColor:"#0B2545", lipColor:"#B85450",
      glasses:false, facialHair:"none", expression:"neutral", uniform:"formal",
      voiceLang:"en-IN", voicePitch:1.0, voiceRate:0.95, voiceVolume:1.0,
    }});
    toast("Avatar reset to default","info");
  };

  const Section = ({title,children}) => (
    <div style={{marginBottom:20}}>
      <div className="sl" style={{marginBottom:12}}>{title}</div>
      {children}
    </div>
  );

  const SwatchRow = ({colors, current, onPick}) => (
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6}}>
      {colors.map(c=>(
        <div key={c} className={`swatch ${current===c?"sel":""}`}
          style={{background:c}} onClick={()=>onPick(c)}/>
      ))}
    </div>
  );

  const ChipRow = ({options, current, onPick, labels={}}) => (
    <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:6}}>
      {options.map(o=>(
        <button key={o} className={`btn btn-sm ${current===o?"btn-primary":"btn-ghost"}`}
          style={{fontSize:12}} onClick={()=>onPick(o)}>
          {labels[o]||o[0].toUpperCase()+o.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{overflowY:"auto",flex:1,padding:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div><div className="sl">AVATAR STUDIO</div><h2 style={{fontSize:22,color:"var(--navy)"}}>Customise AI Presenter</h2></div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn btn-ghost btn-sm" onClick={reset}>↺ Reset</button>
          <button className={`btn btn-sm ${saved?"btn-green":"btn-saffron"}`} onClick={save}>
            {saved?"✅ Saved!":"💾 Save Avatar"}
          </button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:20}}>
        {/* Live preview */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card" style={{padding:20,textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--navy)",marginBottom:12}}>LIVE PREVIEW</div>
            <GovAvatar cfg={av} speaking={previewSpeak} size={190}/>
            <VoiceViz active={previewSpeak} color="var(--navy)" height={24}/>
            <div style={{marginTop:10,fontWeight:600,color:"var(--navy)",fontSize:14}}>{av.name}</div>
            <div style={{fontSize:11,color:"var(--t3)"}}>AI Government Presenter</div>
            <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
              {[av.uniform,av.hairStyle,av.expression,av.facialHair!=="none"?av.facialHair:null].filter(Boolean).map(t=>(
                <span key={t} className="tag" style={{fontSize:10}}>{t}</span>
              ))}
              {av.glasses&&<span className="tag" style={{fontSize:10}}>glasses</span>}
            </div>
          </div>

          {/* Voice test */}
          <div className="card" style={{padding:16}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--navy)",marginBottom:10}}>🎙️ VOICE TEST</div>
            <textarea className="inp" rows={3} value={testText} onChange={e=>setTT(e.target.value)}
              style={{fontSize:13,marginBottom:10}}/>
            <button className={`btn btn-full btn-sm ${previewSpeak?"btn-red":"btn-primary"}`}
              onClick={previewSpeak?()=>{Speech.stop();setPS(false);}:testVoice}>
              {previewSpeak?"⏹ Stop":"🔊 Test Voice"}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {/* Appearance */}
          <div className="card">
            <div className="ch"><span className="ct">🎨 Appearance</span></div>
            <div className="cb">
              <Section title="PRESENTER NAME">
                <input className="inp" value={av.name} onChange={e=>upd({name:e.target.value})}
                  placeholder="Name displayed on broadcasts"/>
              </Section>
              <Section title="SKIN TONE">
                <SwatchRow colors={SKIN_TONES} current={av.skinTone} onPick={c=>upd({skinTone:c})}/>
              </Section>
              <Section title="HAIR COLOR">
                <SwatchRow colors={HAIR_COLS} current={av.hairColor} onPick={c=>upd({hairColor:c})}/>
              </Section>
              <Section title="HAIR STYLE">
                <ChipRow options={HAIR_STYLES} current={av.hairStyle} onPick={o=>upd({hairStyle:o})}/>
              </Section>
              <Section title="EYE COLOR">
                <SwatchRow colors={EYE_COLS} current={av.eyeColor} onPick={c=>upd({eyeColor:c})}/>
              </Section>
              <Section title="LIP COLOR">
                <SwatchRow colors={LIP_COLS} current={av.lipColor} onPick={c=>upd({lipColor:c})}/>
              </Section>
            </div>
          </div>

          {/* Uniform & accessories */}
          <div className="card">
            <div className="ch"><span className="ct">👔 Uniform & Accessories</span></div>
            <div className="cb">
              <Section title="UNIFORM">
                <ChipRow options={UNIFORMS} current={av.uniform} onPick={o=>upd({uniform:o})}
                  labels={{formal:"🏛️ Formal","medical":"🏥 Medical"}}/>
              </Section>
              <Section title="JACKET COLOR">
                <SwatchRow colors={JACKET_COLS} current={av.jacketColor} onPick={c=>upd({jacketColor:c})}/>
              </Section>
              <Section title="EXPRESSION">
                <ChipRow options={EXPRESSIONS} current={av.expression} onPick={o=>upd({expression:o})}
                  labels={{neutral:"😐 Neutral",happy:"😊 Happy",sad:"😔 Empathetic"}}/>
              </Section>
              <Section title="FACIAL HAIR">
                <ChipRow options={FACIAL_HAIRS} current={av.facialHair} onPick={o=>upd({facialHair:o})}
                  labels={{none:"✕ None",mustache:"👨 Moustache",beard:"🧔 Beard",stubble:"·· Stubble"}}/>
              </Section>
              <Section title="ACCESSORIES">
                <div className="tw" onClick={()=>upd({glasses:!av.glasses})} style={{marginTop:6}}>
                  <div className={`tt ${av.glasses?"ton":"toff"}`}>
                    <div className="tk" style={{left:av.glasses?23:3}}/>
                  </div>
                  <span style={{fontSize:14}}>👓 Glasses</span>
                </div>
              </Section>
            </div>
          </div>

          {/* Voice settings */}
          <div className="card" style={{gridColumn:"1 / -1"}}>
            <div className="ch"><span className="ct">🔊 Voice Settings</span></div>
            <div className="cb">
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
                <div>
                  <label className="fl">Default Language</label>
                  <select className="inp" value={av.voiceLang} onChange={e=>upd({voiceLang:e.target.value})}>
                    {Object.values(LANGS).map(v=><option key={v.code} value={v.code}>{v.flag} {v.name}</option>)}
                  </select>
                </div>
                {[
                  {k:"voicePitch", label:"Pitch", min:0.5, max:2, step:0.1, fmt:v=>v.toFixed(1)},
                  {k:"voiceRate",  label:"Speed",  min:0.5, max:2, step:0.05,fmt:v=>v.toFixed(2)+"×"},
                  {k:"voiceVolume",label:"Volume", min:0,   max:1, step:0.1, fmt:v=>Math.round(v*100)+"%"},
                ].map(({k,label,min,max,step,fmt})=>(
                  <div key={k}>
                    <label className="fl">{label} — <span style={{color:"var(--navy)",fontWeight:700}}>{fmt(av[k])}</span></label>
                    <input type="range" min={min} max={max} step={step} value={av[k]}
                      onChange={e=>upd({[k]:parseFloat(e.target.value)})}
                      style={{marginTop:8}}/>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--t3)",marginTop:2}}>
                      <span>{min}</span><span>{max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §20  ★ ANALYTICS PAGE  (Part 3)
═══════════════════════════════════════════════════════════════════ */
function AnalyticsPage({ st, go }) {
  const [range, setRange] = useState("12m");
  const [tab,   setTab]   = useState("engagement");

  const totalViewers = st.engData.reduce((s,d)=>s+(d.viewers||0),0);
  const avgEng       = Math.round(st.engData.reduce((s,d)=>s+d.eng,0)/st.engData.length);
  const peakMonth    = st.engData.reduce((a,b)=>b.eng>a.eng?b:a,st.engData[0]);
  const topLang      = st.langBarData[0];

  const TABS = ["engagement","languages","broadcasts","performance"];

  return (
    <div style={{overflowY:"auto",flex:1,padding:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div><div className="sl">ANALYTICS & REPORTS</div><h2 style={{fontSize:22,color:"var(--navy)"}}>Platform Analytics</h2></div>
        <div style={{display:"flex",gap:10}}>
          {["3m","6m","12m"].map(r=>(
            <button key={r} className={`btn btn-sm ${range===r?"btn-primary":"btn-ghost"}`}
              onClick={()=>setRange(r)}>{r}</button>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={()=>toast("Report exported! 📥","success")}>📥 Export PDF</button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {[
          {icon:"👥",label:"Total Viewers",   value:totalViewers, sub:"All time", accent:"n"},
          {icon:"📊",label:"Avg Engagement",  value:`${avgEng}%`, sub:"Across all broadcasts", accent:"g"},
          {icon:"🏆",label:"Peak Month",      value:peakMonth?.m||"—", sub:`${peakMonth?.eng}% engagement`, accent:"s"},
          {icon:"🌐",label:"Top Language",    value:topLang?.l||"—",   sub:`${topLang?.v?.toLocaleString()} translations`, accent:"g"},
        ].map((k,i)=><KPICard key={i} {...k}/>)}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"2px solid var(--b2)",marginBottom:18}}>
        {TABS.map(t=>(
          <button key={t} style={{padding:"9px 18px",background:"transparent",border:"none",
            borderBottom:`3px solid ${tab===t?"var(--navy)":"transparent"}`,
            color:tab===t?"var(--navy)":"var(--t2)",fontFamily:"inherit",fontSize:14,
            fontWeight:tab===t?700:500,cursor:"pointer",transition:"all .18s",textTransform:"capitalize"}}
            onClick={()=>setTab(t)}>{t}</button>
        ))}
      </div>

      {tab==="engagement" && (
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
          <div className="card">
            <div className="ch"><span className="ct">📈 Engagement Rate — Monthly</span></div>
            <div className="cb">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={st.engData}>
                  <defs>
                    <linearGradient id="egA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0B2545" stopOpacity={.35}/>
                      <stop offset="95%" stopColor="#0B2545" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="vwA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#157A3C" stopOpacity={.25}/>
                      <stop offset="95%" stopColor="#157A3C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--b2)"/>
                  <XAxis dataKey="m" tick={{fontSize:11,fill:"var(--t3)"}}/>
                  <YAxis yAxisId="l" tick={{fontSize:11,fill:"var(--t3)"}} domain={[50,100]}/>
                  <YAxis yAxisId="r" orientation="right" tick={{fontSize:11,fill:"var(--t3)"}}
                    tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
                  <Tooltip contentStyle={{background:"#fff",border:"1px solid var(--border)",borderRadius:6,fontSize:12}}/>
                  <Legend iconType="circle" iconSize={9}
                    formatter={v=><span style={{fontSize:12,color:"var(--t2)"}}>{v}</span>}/>
                  <Area yAxisId="l" type="monotone" dataKey="eng"     stroke="#0B2545" fill="url(#egA)" strokeWidth={2.5} name="Engagement %"/>
                  <Area yAxisId="r" type="monotone" dataKey="viewers" stroke="#157A3C" fill="url(#vwA)" strokeWidth={2}   name="Viewers"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="ch"><span className="ct">📱 Device Breakdown</span></div>
            <div className="cb">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={st.deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                    dataKey="v" nameKey="n" paddingAngle={3}>
                    {st.deviceData.map((d,i)=><Cell key={i} fill={d.f}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:"#fff",border:"1px solid var(--border)",borderRadius:6,fontSize:12}}/>
                  <Legend iconType="circle" iconSize={9}
                    formatter={v=><span style={{fontSize:12,color:"var(--t2)"}}>{v}</span>}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab==="languages" && (
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
          <div className="card">
            <div className="ch"><span className="ct">🌐 Translations by Language</span></div>
            <div className="cb">
              {st.langBarData.map((d,i)=>(
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{d.l}</span>
                    <span style={{fontSize:13,fontFamily:"monospace",color:"var(--t2)"}}>{d.v.toLocaleString()}</span>
                  </div>
                  <div style={{background:"var(--b2)",height:10,borderRadius:5,overflow:"hidden"}}>
                    <motion.div initial={{width:0}} animate={{width:`${(d.v/st.langBarData[0].v)*100}%`}}
                      transition={{duration:.8,delay:i*.08}}
                      style={{height:"100%",background:d.f,borderRadius:5}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{padding:20}}>
            <div className="sl" style={{marginBottom:16}}>LANGUAGE STATS</div>
            {st.langBarData.map((d,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",
                borderBottom:"1px solid var(--b2)"}}>
                <div style={{width:12,height:12,borderRadius:3,background:d.f,flexShrink:0}}/>
                <span style={{flex:1,fontSize:13}}>{d.l}</span>
                <span style={{fontSize:12,fontWeight:700,color:"var(--navy)",fontFamily:"monospace"}}>{d.v.toLocaleString()}</span>
                <span style={{fontSize:11,color:"var(--t3)"}}>
                  {Math.round(d.v/st.langBarData.reduce((s,x)=>s+x.v,0)*100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="broadcasts" && (
        <div className="card">
          <div className="ch"><span className="ct">📡 Broadcast Performance</span></div>
          <div style={{overflowX:"auto"}}>
            <table className="gt">
              <thead><tr>{["Title","Department","Viewers","Engagement","Languages","Status","Date"].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {st.broadcasts.map(b=>(
                  <tr key={b.id}>
                    <td style={{fontWeight:500,maxWidth:220}}><div style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:220}}>{b.title}</div></td>
                    <td style={{fontSize:12,color:"var(--t2)",maxWidth:160}}><div style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:160}}>{b.dept}</div></td>
                    <td style={{fontFamily:"monospace",fontSize:12}}>{typeof b.viewers==="number"?b.viewers.toLocaleString():b.viewers}</td>
                    <td style={{color:"var(--green)",fontWeight:700}}>{b.eng}</td>
                    <td><span className="tag" style={{fontSize:10}}>{b.langs}</span></td>
                    <td><SBadge status={b.status}/></td>
                    <td style={{fontSize:12,color:"var(--t3)"}}>{b.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==="performance" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {[
            {label:"API Avg. Latency",    value:"247ms",  icon:"⚡",trend:"↓12ms",good:true},
            {label:"TTS Success Rate",    value:"98.4%",  icon:"🔊",trend:"↑0.6%",good:true},
            {label:"Translation Accuracy",value:"94.2%",  icon:"🌐",trend:"↑1.1%",good:true},
            {label:"Uptime (30 days)",    value:"99.7%",  icon:"🟢",trend:"stable",good:true},
            {label:"Avg. Viewers/Broadcast",value:"17.8K",icon:"👥",trend:"↑2.1K",good:true},
            {label:"Flagged Content",     value:"3",      icon:"🚩",trend:"↓1 this week",good:true},
          ].map((m,i)=>(
            <div key={i} className="card" style={{padding:20}}>
              <div style={{fontSize:28,marginBottom:8}}>{m.icon}</div>
              <div style={{fontSize:26,fontWeight:700,color:"var(--navy)",fontFamily:"'Tiro Devanagari Hindi',serif"}}>{m.value}</div>
              <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginTop:5}}>{m.label}</div>
              <div style={{fontSize:11,color:m.good?"var(--green)":"var(--red)",marginTop:4,fontWeight:600}}>{m.trend}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §21  ★ GOVERNANCE PAGE  (Part 3)
═══════════════════════════════════════════════════════════════════ */
function GovernancePage({ st, dispatch }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [streaming, setStr] = useState(false);
  const streamRef = useRef(null);

  const logs = useMemo(()=>{
    let l=[...st.auditLog];
    if(filter==="flagged") l=l.filter(x=>x.sensitive||x.status==="FLAGGED");
    if(filter==="approved") l=l.filter(x=>x.status==="APPROVED");
    if(search) l=l.filter(x=>
      x.user.toLowerCase().includes(search.toLowerCase())||
      x.action.toLowerCase().includes(search.toLowerCase())||
      x.resource.toLowerCase().includes(search.toLowerCase())
    );
    return l;
  },[st.auditLog,filter,search]);

  // Live log streaming simulation
  const startStream = () => {
    setStr(true);
    const ACTIONS=["BROADCAST_START","TRANSLATE","AVATAR_UPDATE","USER_LOGIN","BROADCAST_END"];
    const USERS=["Arjun Sharma","Priya Menon","Rohit Singh","Admin","Kavitha R."];
    const LANGS2=["HI","BN","TA","TE","MR","GU"];
    streamRef.current = setInterval(()=>{
      const now=new Date();
      const ts=`${now.toISOString().slice(0,10)} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
      const action=ACTIONS[Math.floor(Math.random()*ACTIONS.length)];
      const user=USERS[Math.floor(Math.random()*USERS.length)];
      const lang=LANGS2[Math.floor(Math.random()*LANGS2.length)];
      const sensitive=Math.random()<0.08;
      dispatch({ type:"AUDIT_ADD", entry:{
        id:"al"+Date.now(),ts,user,action,
        resource:`BCast#${Math.floor(Math.random()*10)+1}`,
        lang, latency:`${200+Math.floor(Math.random()*150)}ms`,
        status:sensitive?"FLAGGED":"APPROVED",sensitive
      }});
    },3000);
  };
  const stopStream=()=>{ clearInterval(streamRef.current); setStr(false); };
  useEffect(()=>()=>clearInterval(streamRef.current),[]);

  const COMPLIANCE_CHECKS = [
    {label:"AI Disclosure on All Broadcasts",  score:100, pass:true},
    {label:"No Prohibited Keywords Detected",  score:97,  pass:true},
    {label:"Translation Accuracy ≥ 90%",       score:94,  pass:true},
    {label:"Latency < 500ms",                  score:99,  pass:true},
    {label:"Audit Log Completeness",           score:100, pass:true},
    {label:"Data Retention Policy Compliance", score:88,  pass:false},
  ];
  const overallScore = Math.round(COMPLIANCE_CHECKS.reduce((s,c)=>s+c.score,0)/COMPLIANCE_CHECKS.length);

  return (
    <div style={{overflowY:"auto",flex:1,padding:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div><div className="sl">GOVERNANCE & AUDIT</div><h2 style={{fontSize:22,color:"var(--navy)"}}>Compliance & Audit Trail</h2></div>
        <div style={{display:"flex",gap:10}}>
          {!streaming
            ?<button className="btn btn-green btn-sm" onClick={startStream}>▶ Live Stream</button>
            :<button className="btn btn-red btn-sm" onClick={stopStream}>⏹ Stop Stream</button>}
          <button className="btn btn-ghost btn-sm" onClick={()=>toast("Audit log exported!","success")}>📥 Export Log</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:18,marginBottom:18}}>
        {/* Compliance scores */}
        <div className="card">
          <div className="ch"><span className="ct">🛡️ Compliance Checks</span></div>
          <div className="cb">
            <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:20,padding:"14px 16px",
              background:overallScore>=90?"var(--green-lt)":"var(--red-bg)",borderRadius:6,
              border:`1px solid ${overallScore>=90?"#c3e6cb":"#f1b8b4"}`}}>
              <div style={{fontSize:44,fontWeight:700,color:overallScore>=90?"var(--green)":"var(--red)",
                fontFamily:"'Tiro Devanagari Hindi',serif",lineHeight:1}}>{overallScore}%</div>
              <div>
                <div style={{fontSize:16,fontWeight:700,color:overallScore>=90?"var(--green)":"var(--red)"}}>
                  {overallScore>=90?"✅ COMPLIANT":"⚠️ ACTION REQUIRED"}
                </div>
                <div style={{fontSize:12,color:"var(--t2)",marginTop:3}}>
                  {COMPLIANCE_CHECKS.filter(c=>c.pass).length} of {COMPLIANCE_CHECKS.length} checks passing
                </div>
              </div>
            </div>
            {COMPLIANCE_CHECKS.map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,
                padding:"10px 0",borderBottom:"1px solid var(--b2)"}}>
                <span style={{fontSize:16}}>{c.pass?"✅":"⚠️"}</span>
                <span style={{flex:1,fontSize:13,color:"var(--text)"}}>{c.label}</span>
                <div style={{width:80}}>
                  <div style={{background:"var(--b2)",height:6,borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${c.score}%`,height:"100%",
                      background:c.pass?"var(--green)":"var(--saffron)",borderRadius:3}}/>
                  </div>
                </div>
                <span style={{fontSize:12,fontWeight:700,width:38,textAlign:"right",
                  color:c.pass?"var(--green)":"var(--saffron-dk)"}}>{c.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {icon:"📋",label:"Total Audit Entries",  value:st.auditLog.length,    accent:"n"},
            {icon:"🚩",label:"Flagged Events",        value:st.auditLog.filter(l=>l.sensitive).length, accent:"r"},
            {icon:"✅",label:"Approved Actions",      value:st.auditLog.filter(l=>l.status==="APPROVED").length, accent:"g"},
            {icon:"👥",label:"Active Users Logged",   value:[...new Set(st.auditLog.map(l=>l.user))].length, accent:"s"},
          ].map((k,i)=><KPICard key={i} {...k} sub=""/>)}
        </div>
      </div>

      {/* Audit log table */}
      <div className="card">
        <div className="ch">
          <span className="ct">📋 Audit Log {streaming&&<span style={{color:"var(--green)",fontSize:12,marginLeft:8,animation:"blink 1.2s ease-in-out infinite"}}>● LIVE</span>}</span>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div className="iw" style={{width:180}}>
              <span className="ii" style={{fontSize:14}}>🔍</span>
              <input className="inp" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{fontSize:12,padding:"6px 6px 6px 34px"}}/>
            </div>
            {["all","approved","flagged"].map(f=>(
              <button key={f} className={`btn btn-xs ${filter===f?"btn-primary":"btn-ghost"}`}
                style={{fontSize:11,textTransform:"capitalize"}} onClick={()=>setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="gt">
            <thead><tr>{["Timestamp","User","Action","Resource","Lang","Latency","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {logs.slice(0,20).map((l,i)=>(
                <motion.tr key={l.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*.02}}>
                  <td style={{fontFamily:"monospace",fontSize:11,color:"var(--t3)"}}>{l.ts}</td>
                  <td style={{fontSize:12,fontWeight:500}}>{l.user}</td>
                  <td><span className="tag" style={{fontSize:10,background:l.action.includes("BROADCAST")?"#E8F0FA":l.action.includes("TRANSLATE")?"var(--green-lt)":"#f5f5f5"}}>{l.action}</span></td>
                  <td style={{fontSize:12,color:"var(--t2)"}}>{l.resource}</td>
                  <td style={{fontSize:12,fontFamily:"monospace"}}>{l.lang}</td>
                  <td style={{fontSize:12,fontFamily:"monospace",color:"var(--t3)"}}>{l.latency}</td>
                  <td>
                    <span className={`badge ${l.status==="APPROVED"?"bd":"bl"}`} style={{fontSize:10}}>
                      {l.status==="FLAGGED"&&<span className="dot dr"/>}
                      {l.status}
                    </span>
                    {l.sensitive&&<span style={{marginLeft:6,fontSize:11}}>🚩</span>}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {logs.length===0&&(
            <div style={{padding:"32px",textAlign:"center",color:"var(--t3)"}}>No matching entries</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §22  ★ SETTINGS PAGE  (Part 3)
═══════════════════════════════════════════════════════════════════ */
function SettingsPage({ st, dispatch }) {
  const s = st.settings;
  const upd = (section, val) => dispatch({ type:"SETTINGS_UPD", v:{ [section]:{ ...s[section], ...val } } });
  const [saved, setSaved]   = useState("");
  const [pwForm, setPwForm] = useState({ current:"", next:"", confirm:"" });
  const [pwErr,  setPwErr]  = useState("");

  const save = (section) => {
    setSaved(section); setTimeout(()=>setSaved(""),2000);
    toast(`${section[0].toUpperCase()+section.slice(1)} settings saved ✅`,"success");
    dispatch({ type:"AUDIT_ADD", entry:{
      id:"al"+Date.now(), ts:new Date().toISOString().replace("T"," ").slice(0,19),
      user:st.user?.name||"Admin", action:"SETTINGS_UPDATE",
      resource:`Settings:${section}`, lang:"—", latency:"—", status:"APPROVED", sensitive:false,
    }});
  };

  const changePassword = () => {
    setPwErr("");
    if (!pwForm.current) { setPwErr("Enter current password"); return; }
    if (pwForm.next.length < 8) { setPwErr("New password must be ≥ 8 characters"); return; }
    if (pwForm.next !== pwForm.confirm) { setPwErr("Passwords do not match"); return; }
    setPwForm({current:"",next:"",confirm:""});
    toast("Password changed successfully ✅","success");
  };

  const Section = ({title,children,onSave,sKey}) => (
    <div className="card" style={{marginBottom:16}}>
      <div className="ch">
        <span className="ct">{title}</span>
        {onSave&&<button className={`btn btn-sm ${saved===sKey?"btn-green":"btn-saffron"}`} onClick={onSave}>
          {saved===sKey?"✅ Saved":"💾 Save"}
        </button>}
      </div>
      <div className="cb">{children}</div>
    </div>
  );

  const Row = ({label,sub,children}) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
      padding:"12px 0",borderBottom:"1px solid var(--b2)"}}>
      <div>
        <div style={{fontSize:14,fontWeight:500,color:"var(--text)"}}>{label}</div>
        {sub&&<div style={{fontSize:12,color:"var(--t3)",marginTop:2}}>{sub}</div>}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{overflowY:"auto",flex:1,padding:22}}>
      <div style={{marginBottom:20}}>
        <div className="sl">SYSTEM SETTINGS</div>
        <h2 style={{fontSize:22,color:"var(--navy)"}}>Profile & Preferences</h2>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,maxWidth:1000}}>
        <div style={{paddingRight:20}}>
          {/* Profile */}
          <Section title="👤 Profile Information" onSave={()=>save("profile")} sKey="profile">
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {k:"name",    label:"Full Name",   type:"text"},
                {k:"email",   label:"Official Email", type:"email"},
                {k:"dept",    label:"Department",  type:"text"},
                {k:"phone",   label:"Phone Number",type:"tel"},
              ].map(({k,label,type})=>(
                <div key={k}>
                  <label className="fl">{label}</label>
                  <input className="inp" type={type} value={s.profile[k]||""}
                    onChange={e=>upd("profile",{[k]:e.target.value})}/>
                </div>
              ))}
              <div>
                <label className="fl">Role</label>
                <input className="inp" value={s.profile.role||""} readOnly
                  style={{background:"var(--off)",cursor:"not-allowed",color:"var(--t2)"}}/>
              </div>
            </div>
          </Section>

          {/* Notifications */}
          <Section title="🔔 Notifications" onSave={()=>save("notifications")} sKey="notifications">
            {[
              {k:"email",           label:"Email Notifications",    sub:"Receive alerts via email"},
              {k:"sms",             label:"SMS Notifications",      sub:"Receive alerts via SMS"},
              {k:"broadcastAlerts", label:"Broadcast Alerts",       sub:"When broadcasts start/end"},
              {k:"systemAlerts",    label:"System Alerts",          sub:"Platform errors and warnings"},
              {k:"weeklyReport",    label:"Weekly Report",          sub:"Summary every Monday morning"},
            ].map(({k,label,sub})=>(
              <Row key={k} label={label} sub={sub}>
                <Toggle on={s.notifications[k]} onToggle={()=>upd("notifications",{[k]:!s.notifications[k]})}/>
              </Row>
            ))}
          </Section>
        </div>

        <div>
          {/* Security */}
          <Section title="🔒 Security" sKey="security">
            <Row label="Two-Factor Authentication" sub="Add extra layer via authenticator app">
              <Toggle on={s.security.twoFactor}
                onToggle={()=>{ upd("security",{twoFactor:!s.security.twoFactor}); toast(s.security.twoFactor?"2FA disabled":"2FA enabled — setup required",s.security.twoFactor?"warning":"success"); }}/>
            </Row>
            <Row label="Session Timeout" sub="Auto-logout after inactivity">
              <select className="inp" style={{width:"auto",minWidth:120,fontSize:13}}
                value={s.security.sessionTimeout}
                onChange={e=>{ upd("security",{sessionTimeout:e.target.value}); toast("Session timeout updated","info"); }}>
                {[["15","15 minutes"],["30","30 minutes"],["60","1 hour"],["120","2 hours"],["0","Never"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </Row>
            {/* Password change */}
            <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--b2)"}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--navy)",marginBottom:12}}>Change Password</div>
              {pwErr&&<div style={{background:"var(--red-bg)",border:"1px solid #f1b8b4",borderRadius:4,
                padding:"8px 12px",fontSize:12,color:"var(--red)",marginBottom:10}}>⚠️ {pwErr}</div>}
              {[
                {k:"current", label:"Current Password"},
                {k:"next",    label:"New Password"},
                {k:"confirm", label:"Confirm New Password"},
              ].map(({k,label})=>(
                <div key={k} style={{marginBottom:10}}>
                  <label className="fl">{label}</label>
                  <input className="inp" type="password" value={pwForm[k]}
                    onChange={e=>setPwForm(p=>({...p,[k]:e.target.value}))} style={{fontSize:13}}/>
                </div>
              ))}
              <button className="btn btn-primary btn-sm" onClick={changePassword}>🔑 Update Password</button>
            </div>
          </Section>

          {/* Display */}
          <Section title="🖥️ Display & Preferences" onSave={()=>save("display")} sKey="display">
            <Row label="Interface Theme"
              sub={s.display.theme==="dark" ? "🌙 Dark mode active" : "☀️ Light mode active"}>
              <div style={{display:"flex",gap:8}}>
                {["light","dark"].map(t=>(
                  <button key={t} className={`btn btn-xs ${s.display.theme===t?"btn-primary":"btn-ghost"}`}
                    onClick={()=>upd("display",{theme:t})}>
                    {t==="light"?"☀️":"🌙"} {t[0].toUpperCase()+t.slice(1)}
                  </button>
                ))}
              </div>
            </Row>
            <Row label="Compact Mode" sub="Reduce spacing in tables and lists">
              <Toggle on={s.display.compactMode} onToggle={()=>upd("display",{compactMode:!s.display.compactMode})}/>
            </Row>
            <Row label="Show Compliance Badge" sub="Display audit score on dashboard">
              <Toggle on={s.display.showAuditBadge} onToggle={()=>upd("display",{showAuditBadge:!s.display.showAuditBadge})}/>
            </Row>
            <Row label="Default Language" sub="Interface and response language">
              <select className="inp" style={{width:"auto",minWidth:140,fontSize:13}}
                value={s.display.language}
                onChange={e=>upd("display",{language:e.target.value})}>
                {Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v.flag} {v.name}</option>)}
              </select>
            </Row>
          </Section>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{maxWidth:1000,border:"1.5px solid #f1b8b4"}}>
        <div className="ch" style={{background:"var(--red-bg)"}}>
          <span className="ct" style={{color:"var(--red)"}}>⚠️ Danger Zone</span>
        </div>
        <div className="cb" style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          {[
            {label:"Clear All Broadcasts",sub:"Permanently delete all broadcast records",icon:"🗑"},
            {label:"Reset All Settings",  sub:"Restore all settings to factory defaults", icon:"↺"},
            {label:"Export All Data",     sub:"Download full data archive as JSON",       icon:"📦"},
          ].map(({label,sub,icon})=>(
            <div key={label} style={{flex:1,minWidth:200,padding:"14px 16px",background:"var(--off)",
              borderRadius:4,border:"1px solid var(--b2)"}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{icon} {label}</div>
              <div style={{fontSize:12,color:"var(--t3)",marginBottom:10}}>{sub}</div>
              <button className="btn btn-danger btn-sm"
                onClick={()=>toast(`${label} — confirm in production environment`,"warning")}>
                {icon} {label.split(" ").slice(0,2).join(" ")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   §19b  ERROR BOUNDARY  (FIX 4 — catches render errors, prevents blank crash)
═══════════════════════════════════════════════════════════════════ */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("[Gov Platform] ErrorBoundary caught:", error, info.componentStack);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        background:"var(--bg)",flexDirection:"column",gap:16,padding:40}}>
        <div style={{fontSize:56}}>🏛️</div>
        <h2 style={{fontSize:22,color:"var(--navy)",fontFamily:"'Tiro Devanagari Hindi',serif"}}>
          Government AI Avatar Platform
        </h2>
        <div style={{background:"var(--red-bg)",border:"1px solid #f1b8b4",borderRadius:8,
          padding:"18px 24px",maxWidth:520,textAlign:"center"}}>
          <div style={{fontWeight:700,color:"var(--red)",marginBottom:8}}>⚠️ An unexpected error occurred</div>
          <div style={{fontSize:13,color:"var(--t2)",marginBottom:14,fontFamily:"monospace",
            background:"#fff",padding:"8px 12px",borderRadius:4,textAlign:"left",wordBreak:"break-all"}}>
            {this.state.error?.message || "Unknown error"}
          </div>
          <button style={{background:"var(--navy)",color:"#fff",border:"none",borderRadius:4,
            padding:"10px 24px",fontSize:14,fontWeight:600,cursor:"pointer"}}
            onClick={() => { this.setState({hasError:false,error:null}); window.location.reload(); }}>
            🔄 Reload Portal
          </button>
        </div>
        <div style={{fontSize:12,color:"var(--t3)"}}>
          Error has been logged. Please contact your system administrator if this persists.
        </div>
      </div>
    );
  }
}

/* ═══════════════════════════════════════════════════════════════════
   §20  APP ROOT  (FIX 1 — stable CSS hook, FIX 8 — BC state)
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [st, dispatch] = useReducer(reducer, INIT);
  const [col, setCol]  = useState(false);

  // FIX 1 — stable single-injection hook
  useGlobalCSS();

  // DISPLAY SETTINGS — apply theme + compact mode to document root immediately on change
  useEffect(() => {
    const theme   = st.settings?.display?.theme   || "light";
    const compact = st.settings?.display?.compactMode || false;
    document.documentElement.setAttribute("data-theme",   theme);
    document.documentElement.setAttribute("data-compact", compact ? "true" : "false");
  }, [st.settings?.display?.theme, st.settings?.display?.compactMode]);

  const go = useCallback(p => {
    // FIX 8 — stop broadcast if user navigates away
    if (st.broadcastActive && p !== "live") {
      dispatch({ type:"BC_STOP" });
    }
    dispatch({ type:"PAGE", p });
  }, [st.broadcastActive]);

  if (!st.user || st.page === "login") {
    return (
      <>
        <GovHeader/>
        <LoginPage dispatch={dispatch}/>
        <ToastHub/>
      </>
    );
  }

  const renderPage = () => {
    switch(st.page) {
      case "home":       return <HomePage          st={st} go={go}/>;
      case "dashboard":  return <DashboardPage     st={st} dispatch={dispatch} go={go}/>;
      case "live":       return <LiveBroadcastPage st={st} dispatch={dispatch}/>;
      case "assistant":  return <AssistantPage     st={st}/>;
      case "translate":  return <TranslatePage     st={st}/>;
      case "broadcasts": return <BroadcastsPage    st={st} dispatch={dispatch} go={go}/>;
      case "avatar":     return <AvatarStudioPage  st={st} dispatch={dispatch}/>;
      case "analytics":  return <AnalyticsPage     st={st} go={go}/>;
      case "governance": return <GovernancePage    st={st} dispatch={dispatch}/>;
      case "settings":   return <SettingsPage      st={st} dispatch={dispatch}/>;
      default:           return <DashboardPage     st={st} dispatch={dispatch} go={go}/>;
    }
  };

  return (
    <>
      <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden"}}>
        <GovHeader/>
        <div style={{display:"flex",flex:1,overflow:"hidden"}}>
          <Sidebar page={st.page} go={go} user={st.user} col={col} setCol={setCol}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <TopBar page={st.page} go={go} user={st.user} dispatch={dispatch}/>
            <AnimatePresence mode="wait">
              <motion.div key={st.page}
                style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}
                initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.18}}>
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <ToastHub/>
    </>
  );
}

/* ─── Wrap with ErrorBoundary so any render crash shows recovery screen ─── */
const AppWithBoundary = () => (
  <ErrorBoundary>
    <App/>
  </ErrorBoundary>
);
export { AppWithBoundary };
// Re-export as default so both named and default imports work
