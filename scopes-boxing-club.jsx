import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, Plus, X, ChevronRight, Clock, Calendar, Users, DollarSign, ArrowLeft, LogIn, LogOut, MessageCircle } from "lucide-react";

// ---------- seed data ----------
const seedMembers = [
  { id: 1, memberNo: "1001", first: "Marcus", last: "Alvarado", tier: "Rental", joined: "2026-08-01", lastVisit: "2026-08-24", visits: [1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1], coach: "T. Reyes", hoursLogged: 6, checkedInAt: null, balance: 0, nextFeeDate: "2026-08-31", nextFeeAmount: 60, avatar: null, preferredName: null, agreement: null, dailyLog: {}, email: "marcus.alvarado@example.com", emergencyContactName: null, emergencyContactPhone: null, healthCardInfo: null, photoConsent: null },
  { id: 2, memberNo: "1002", first: "Priya", last: "Chandran", tier: "Annual", joined: "2025-11-12", lastVisit: "2026-08-23", visits: [1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1], coach: "D. Okafor", hoursLogged: 9, checkedInAt: null, balance: 0, nextFeeDate: "2026-11-12", nextFeeAmount: 480, avatar: null, preferredName: null, agreement: null, dailyLog: {}, email: "priya.chandran@example.com", emergencyContactName: null, emergencyContactPhone: null, healthCardInfo: null, photoConsent: null },
  { id: 3, memberNo: "1003", first: "Wesley", last: "Doyle", tier: "Monthly", joined: "2026-07-02", lastVisit: "2026-08-20", visits: [1,0,1,1,0,0,1,1,1,0,1,1,1,0,1,0,1,1,0,1,0], coach: "T. Reyes", hoursLogged: 4, checkedInAt: null, balance: 35, nextFeeDate: "2026-09-01", nextFeeAmount: 70, avatar: null, preferredName: null, agreement: null, dailyLog: {}, email: "wesley.doyle@example.com", emergencyContactName: null, emergencyContactPhone: null, healthCardInfo: null, photoConsent: null },
  { id: 4, memberNo: "1004", first: "Aaliyah", last: "Freeman", tier: "Rental", joined: "2026-08-10", lastVisit: "2026-08-25", visits: [1,1,1,1,1,1,1,0,1,1,1], coach: "M. Suarez", hoursLogged: 3, checkedInAt: null, balance: 0, nextFeeDate: "2026-09-09", nextFeeAmount: 60, avatar: null, preferredName: null, agreement: null, dailyLog: {}, email: "aaliyah.freeman@example.com", emergencyContactName: null, emergencyContactPhone: null, healthCardInfo: null, photoConsent: null },
  { id: 5, memberNo: "1005", first: "Ola", last: "Nilsson", tier: "Annual", joined: "2025-05-19", lastVisit: "2026-08-22", visits: [1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1], coach: "D. Okafor", hoursLogged: 11, checkedInAt: null, balance: 0, nextFeeDate: "2026-09-06", nextFeeAmount: 480, avatar: null, preferredName: null, agreement: null, dailyLog: {}, email: "ola.nilsson@example.com", emergencyContactName: null, emergencyContactPhone: null, healthCardInfo: null, photoConsent: null },
  { id: 6, memberNo: "1006", first: "Reggie", last: "Voss", tier: "Monthly", joined: "2026-06-15", lastVisit: "2026-08-18", visits: [1,1,0,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1], coach: "M. Suarez", hoursLogged: 5, checkedInAt: null, balance: 15, nextFeeDate: "2026-09-15", nextFeeAmount: 70, avatar: null, preferredName: null, agreement: null, dailyLog: {}, email: "reggie.voss@example.com", emergencyContactName: null, emergencyContactPhone: null, healthCardInfo: null, photoConsent: null },
];

const seedGroupSessions = [
  { id: 1, date: "2026-08-28", time: "6:00 PM", endTime: "7:00 PM", title: "Cardio Sparring Circuit", coach: "D. Okafor", attendeeIds: [2, 5], capacity: 12, ticketPrice: 20 },
  { id: 2, date: "2026-09-02", time: "7:00 AM", endTime: "8:00 AM", title: "Beginner Fundamentals", coach: "T. Reyes", attendeeIds: [1, 3], capacity: 10, ticketPrice: 15 },
];

const seedCoaches = [
  { id: 1, name: "T. Reyes", code: "5501", rate: null, hoursThisPeriod: 10, hoursPaid: 6, oneOnOneRate: 120, schedule: [], bioKeywords: [], photo: null },
  { id: 2, name: "D. Okafor", code: "5502", rate: null, hoursThisPeriod: 20, hoursPaid: 14, oneOnOneRate: 120, schedule: [], bioKeywords: [], photo: null },
  { id: 3, name: "M. Suarez", code: "5503", rate: null, hoursThisPeriod: 8, hoursPaid: 5, oneOnOneRate: 120, schedule: [], bioKeywords: [], photo: null },
  { id: 4, name: "Scotty", code: "5504", rate: null, hoursThisPeriod: 0, hoursPaid: 0, oneOnOneRate: 120, schedule: [], bioKeywords: [], photo: null },
  { id: 5, name: "Pierre", code: "5505", rate: null, hoursThisPeriod: 0, hoursPaid: 0, oneOnOneRate: 120, schedule: [], bioKeywords: [], photo: null },
  { id: 6, name: "Mark", code: "5506", rate: null, hoursThisPeriod: 0, hoursPaid: 0, oneOnOneRate: 120, schedule: [], bioKeywords: [], photo: null },
  { id: 7, name: "Sam", code: "5507", rate: null, hoursThisPeriod: 0, hoursPaid: 0, oneOnOneRate: 120, schedule: [], bioKeywords: [], photo: null },
  { id: 8, name: "Natasha", code: "6789", rate: null, hoursThisPeriod: 0, hoursPaid: 0, oneOnOneRate: 120, schedule: [], bioKeywords: [], photo: null },
];

const TIER_DAYS = { Rental: 30, Monthly: 30, Quarterly: 90, Annual: 365 };
const ROUND_MINUTES = 3.5; // 3 min round + 30 sec rest
const MAX_SESSION_HOURS = 4; // safety-net auto-checkout if someone forgets to sign out
const ROUND_SET_SIZE = 12;
const DAY_PASS_PRICE = 25;
const DAY_PASS_BUNDLE_PRICE = 60;
const DAY_PASS_BUNDLE_COUNT = 3;

// The 5 core training categories, each represented by a retro/8-bit style animal tile
// ---------- i18n: English / French ----------
const STRINGS = {
  en: {
    tagline: "Platform for Scopes Boxing Club",
    chooseSignIn: "Choose how you're signing in",
    newHere: "New Here? Get Started",
    returning: "Returning? Enter Your Code",
    staffAccess: "Staff & Coach Access",
    clubGuidelines: "Club Guidelines",
    welcome: "WELCOME",
    checkIn: "Check In",
    checkOut: "Check Out",
    onFloorSince: "On the floor since",
    notCheckedIn: "You're not checked in",
    myProfile: "My Profile",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    myMembership: "My Membership",
    myDayPass: "My Day Pass",
    plan: "Plan",
    status: "Status",
    nextFeeDue: "Next Fee Due",
    amountDue: "Amount Due",
    balanceOwed: "Balance Owed",
    referralCredit: "Referral Credit",
    paidUp: "$0 — paid up",
    myDocuments: "My Documents",
    uploadPdf: "+ Upload a PDF",
    view: "View",
    remove: "Remove",
    referFriend: "Refer a Friend",
    referFriendDesc: "Bring a friend in — when they sign up and enter your member code, you get $10 for yourself.",
    yourCodeToShare: "Your code to share",
    suggestionOfWeek: "Suggestion of the Week",
    liveSession: "Live Session",
    roundsCompleted: "rounds completed",
    pearsonsLaw: "Pearson's Law: that which is measured improves — that which is measured and reported improves exponentially.",
    nextCoachingEvent: "Next Coaching Event",
    oneOnOneCoaching: "1-on-1 Coaching",
    imInterested: "I'm Interested in a 1-on-1 Session",
    qanda: "Q&A",
    askQuestion: "Ask a coach anything...",
    ask: "Ask",
    suggestionBox: "Suggestion Box",
    sendSuggestion: "Send Suggestion",
    signOut: "Sign Out",
    myPunchCard: "My Punch Card",
    suggestedDrills: "Suggested Drills",
    memberNumber: "Member",
  },
  fr: {
    tagline: "Pivot pour le club de boxe Scopes",
    chooseSignIn: "Choisissez votre mode de connexion",
    newHere: "Nouveau ici? Commencer",
    returning: "De retour? Entrez votre code",
    staffAccess: "Accès personnel et entraîneurs",
    clubGuidelines: "Règlement du club",
    welcome: "BIENVENUE",
    checkIn: "S'enregistrer",
    checkOut: "Se désinscrire",
    onFloorSince: "Sur le plancher depuis",
    notCheckedIn: "Vous n'êtes pas enregistré",
    myProfile: "Mon profil",
    edit: "Modifier",
    save: "Enregistrer",
    cancel: "Annuler",
    myMembership: "Mon abonnement",
    myDayPass: "Mon laissez-passer journalier",
    plan: "Forfait",
    status: "Statut",
    nextFeeDue: "Prochain paiement",
    amountDue: "Montant dû",
    balanceOwed: "Solde dû",
    referralCredit: "Crédit de référence",
    paidUp: "0 $ — payé au complet",
    myDocuments: "Mes documents",
    uploadPdf: "+ Téléverser un PDF",
    view: "Voir",
    remove: "Retirer",
    referFriend: "Parrainez un ami",
    referFriendDesc: "Amenez un ami — quand il s'inscrit avec votre code de membre, vous recevez 10 $ pour vous-même.",
    yourCodeToShare: "Votre code à partager",
    suggestionOfWeek: "Suggestion de la semaine",
    liveSession: "Séance en direct",
    roundsCompleted: "rounds complétés",
    pearsonsLaw: "Loi de Pearson : ce qui est mesuré s'améliore — ce qui est mesuré et rapporté s'améliore de façon exponentielle.",
    nextCoachingEvent: "Prochain événement d'entraînement",
    oneOnOneCoaching: "Entraînement individuel",
    imInterested: "Je suis intéressé(e) par une séance individuelle",
    qanda: "Questions et réponses",
    askQuestion: "Posez une question à un entraîneur...",
    ask: "Demander",
    suggestionBox: "Boîte à suggestions",
    sendSuggestion: "Envoyer la suggestion",
    signOut: "Se déconnecter",
    myPunchCard: "Ma carte de présence",
    suggestedDrills: "Exercices suggérés",
    memberNumber: "Membre",
  },
};

function t(lang, key) {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
}

function LanguageToggle({ lang, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={lang === "en" ? "Switch to French" : "Switch to English"}
      style={{
        position: "fixed",
        top: 14,
        right: 14,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "#111110",
        border: "1px solid #2A2A28",
        borderRadius: 20,
        padding: "6px 12px",
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 16 }}>🍁</span>
      <span className="oswald" style={{ fontSize: 11, color: "#F2F0EA", letterSpacing: 1 }}>{lang === "en" ? "FR" : "EN"}</span>
    </button>
  );
}

const CORE_CATEGORIES = [
  { key: "upperBody", name: "Upper Body", animal: "Gorilla", emoji: "🦍", color: "#6B4A2A", drills: ["Bag work — 1-2 combos", "Push-ups (3x max reps)"] },
  { key: "breathing", name: "Lungs", animal: "Whale", emoji: "🐋", color: "#2A5F7A", drills: ["Box breathing — steady pace", "Jump rope — consistent, light taps 🥊"] },
  { key: "eyeFocus", name: "Eye Agility & Focus", animal: "Eagle", emoji: "🦅", color: "#7A5A2A", drills: ["Newspaper vowel drill (2 min/round)", "Pad work with your coach", "Defense / slip drills"], detail: "Grab a newspaper from the tables and circle every vowel — a, e, i, o, u — you can find in 2 minutes. Pro boxers average around 500 circles a round; if you're just starting out, aim for about 100. It trains your eyes to scan fast and stay locked on your opponent." },
  { key: "footwork", name: "Footwork & Mobility", animal: "Kangaroo", emoji: "🦘", color: "#8A6A2A", drills: ["Shadow boxing by the mirror", "Ladder / pivot drills"] },
  { key: "strength", name: "Strength Training", animal: "Praying Mantis", emoji: "🦗", color: "#3A6B3A", drills: ["Calisthenics circuit", "Dead hangs (3x30 sec)"] },
];

function isGuestTier(tier) {
  return tier === "Day Pass" || tier === "Day Pass Bundle";
}

const DOOR_PRICE = 25;
const MEMBER_PRICE_ONE_ON_ONE = 120; // 1-on-1 coaching session rate (before HST)
const HST_RATE = 0.13; // Ontario HST

function withHST(rate) {
  return Math.round(rate * (1 + HST_RATE) * 100) / 100;
}
const MEMBER_PRICE = 15;
const DEPOSIT = 5;

function daysLeft(joined, tier) {
  if (isGuestTier(tier)) return Infinity;
  const start = new Date(joined);
  const end = new Date(start);
  end.setDate(end.getDate() + TIER_DAYS[tier]);
  const today = new Date("2026-08-25");
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function statusFor(daysRemaining) {
  if (daysRemaining === Infinity) return { label: "GUEST", color: "#8A8A85" };
  if (daysRemaining < 0) return { label: "EXPIRED", color: "#C81E1E" };
  if (daysRemaining <= 5) return { label: "EXPIRING", color: "#C81E1E" };
  return { label: "ACTIVE", color: "#1F8A3B" };
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatMonthYear(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatTime(d) {
  return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ---------- shell ----------
export default function App() {
  const [language, setLanguage] = useState("en");
  const [members, setMembers] = useState(seedMembers);
  const [coaches, setCoaches] = useState(seedCoaches);
  const [groupSessions, setGroupSessions] = useState(seedGroupSessions);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState("roster"); // roster | coaches | checkin
  const [mode, setMode] = useState("landing"); // landing | staff | coach | member | guidelines
  const [coachSessionId, setCoachSessionId] = useState(null);
  const [guidelinesReturnTo, setGuidelinesReturnTo] = useState("landing");
  const [memberSessionId, setMemberSessionId] = useState(null);
  const [feed, setFeed] = useState([
    { id: 1, text: "Another fighter made its way to the floor: Priya Chandran - 5:58 PM", time: "2026-08-23T17:58:00" },
    { id: 2, text: "Ola Nilsson's Annual membership renews in 12 days", time: "2026-08-22T09:00:00" },
  ]);
  const [showNameSignIn, setShowNameSignIn] = useState(false); // used by kiosk "+ Day Pass" button
  const [oneOnOneRequests, setOneOnOneRequests] = useState([]);
  const [qaThreads, setQaThreads] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [coachNotes, setCoachNotes] = useState([]);
  const [suggestionOfWeek, setSuggestionOfWeekState] = useState(null);
  const [customDrills, setCustomDrills] = useState({});

  const sorted = useMemo(
    () =>
      [...members]
        .filter((m) => `${m.first} ${m.last}`.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => a.last.localeCompare(b.last)),
    [members, query]
  );

  const selected = members.find((m) => m.id === selectedId);

  const activeCount = members.filter((m) => !isGuestTier(m.tier) && daysLeft(m.joined, m.tier) >= 0).length;
  const hoursOwed = coaches.reduce((sum, c) => (c.rate ? sum + (c.hoursThisPeriod - c.hoursPaid) * c.rate : sum), 0);
  const coachesMissingRate = coaches.filter((c) => c.rate === null && c.hoursThisPeriod > 0).length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysVisitors = members.filter((m) => (m.lastVisit || "").slice(0, 10) === todayStr);
  const dailyVisits = todaysVisitors.length;
  const returningToday = todaysVisitors.filter((m) => m.visits.length > 1).length;
  const returningRatio = dailyVisits > 0 ? Math.round((returningToday / dailyVisits) * 100) : 0;

  function addMember(form) {
    const id = Math.max(0, ...members.map((m) => m.id)) + 1;
    const nextNo = String(Math.max(1000, ...members.map((m) => parseInt(m.memberNo, 10))) + 1);
    const now = new Date().toISOString();
    setMembers([
      ...members,
      {
        id,
        memberNo: nextNo,
        first: form.first,
        last: form.last,
        tier: form.tier,
        joined: "2026-08-25",
        lastVisit: "2026-08-25",
        visits: [1],
        coach: form.coach,
        hoursLogged: 0,
        checkedInAt: null,
        balance: 0,
        nextFeeDate: "2026-09-25",
        nextFeeAmount: 60,
        avatar: null,
        preferredName: null,
        agreement: null,
        passesRemaining: null,
        dailyLog: {},
        invoices: [{ id: Date.now(), amount: 60, description: `${form.tier} membership`, issuedAt: now, status: "unpaid" }],
      },
    ]);
    setShowAdd(false);
  }

  function generateInvoice(memberId, amount, description) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, invoices: [...(m.invoices || []), { id: Date.now(), amount, description, issuedAt: new Date().toISOString(), status: "unpaid" }] }
          : m
      )
    );
  }

  function markInvoicePaid(memberId, invoiceId) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, invoices: (m.invoices || []).map((inv) => (inv.id === invoiceId ? { ...inv, status: "paid" } : inv)) }
          : m
      )
    );
  }

  function updateProfile(id, updates) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }

  function reserveSpot(sessionId, memberId) {
    const session = groupSessions.find((s) => s.id === sessionId);
    const m = members.find((x) => x.id === memberId);
    if (!session || !m || session.attendeeIds.includes(memberId)) return;
    setGroupSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, attendeeIds: [...s.attendeeIds, memberId] } : s))
    );
    pushToFeed(`${m.first} ${m.last} saved a spot in "${session.title}" — $${DEPOSIT} deposit, $${MEMBER_PRICE - DEPOSIT} due at check-in`);
  }

  function requestOneOnOne(memberId, coachName, contactMethod, contactInfo) {
    const m = members.find((x) => x.id === memberId);
    if (!m) return;
    const now = new Date().toISOString();
    const entry = {
      id: Math.max(0, ...oneOnOneRequests.map((r) => r.id)) + 1,
      memberId,
      memberName: `${m.first} ${m.last}`,
      memberNo: m.memberNo,
      coachName,
      contactMethod,
      contactInfo,
      time: now,
    };
    setOneOnOneRequests((prev) => [entry, ...prev]);
    pushToFeed(`${m.first} ${m.last} is interested in a 1-on-1 with ${coachName} — follow up by ${contactMethod} at ${contactInfo}`);
    pushToFeed(`📧 Confirmation emailed to ${m.first} ${m.last}: you're on the waiting list for a 1-on-1 with ${coachName} — they'll personally follow up within the next week.`);
  }

  function askQuestion(memberId, question) {
    const m = members.find((x) => x.id === memberId);
    if (!m || !question.trim()) return;
    const now = new Date().toISOString();
    const entry = {
      id: Math.max(0, ...qaThreads.map((q) => q.id)) + 1,
      memberId,
      memberName: `${m.first} ${m.last}`,
      memberNo: m.memberNo,
      question: question.trim(),
      askedAt: now,
      answer: null,
    };
    setQaThreads((prev) => [entry, ...prev]);
  }

  function answerQuestion(threadId, coachName, answerText) {
    if (!answerText.trim()) return;
    const now = new Date().toISOString();
    setQaThreads((prev) =>
      prev.map((q) => (q.id === threadId ? { ...q, answer: { text: answerText.trim(), coachName, answeredAt: now } } : q))
    );
    const thread = qaThreads.find((q) => q.id === threadId);
    if (thread) pushToFeed(`📧 ${coachName} answered ${thread.memberName}'s question — they'll see it on their Main Page.`);
  }

  function submitRecommendation(memberId, text) {
    const m = members.find((x) => x.id === memberId);
    if (!m || !text.trim()) return;
    const now = new Date().toISOString();
    setRecommendations((prev) => [
      { id: Math.max(0, ...prev.map((r) => r.id)) + 1, memberId, memberName: `${m.first} ${m.last}`, memberNo: m.memberNo, text: text.trim(), submittedAt: now },
      ...prev,
    ]);
    pushToFeed(`${m.first} ${m.last} left a suggestion for the club.`);
  }

  function addCoachNote(coachName, memberId, note) {
    const m = members.find((x) => x.id === memberId);
    if (!m || !note.trim()) return;
    const now = new Date().toISOString();
    setCoachNotes((prev) => [
      { id: Math.max(0, ...prev.map((n) => n.id)) + 1, coachName, memberId, memberName: `${m.first} ${m.last}`, note: note.trim(), createdAt: now },
      ...prev,
    ]);
    pushToFeed(`${coachName} left a note for ${m.first} ${m.last}: "${note.trim()}"`);
  }

  function setSuggestionOfWeek(setByName, text) {
    if (!text.trim()) return;
    setSuggestionOfWeekState({ text: text.trim(), setBy: setByName, setAt: new Date().toISOString() });
    pushToFeed(`📌 ${setByName} posted a new Suggestion of the Week — everyone will see it on their Main Page.`);
  }

  function addCustomDrill(categoryKey, drillText) {
    if (!drillText.trim()) return;
    setCustomDrills((prev) => ({
      ...prev,
      [categoryKey]: [...(prev[categoryKey] || []), drillText.trim()],
    }));
  }

  function removeCustomDrill(categoryKey, idx) {
    setCustomDrills((prev) => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] || []).filter((_, i) => i !== idx),
    }));
  }

  function postGroupSession(coachName, form) {
    const id = Math.max(0, ...groupSessions.map((s) => s.id)) + 1;
    const newSession = {
      id,
      date: form.date,
      time: form.time,
      endTime: form.endTime,
      title: form.title.trim() || "Group Coaching Session",
      coach: coachName,
      attendeeIds: [],
      capacity: Number(form.capacity) || 12,
      ticketPrice: MEMBER_PRICE,
    };
    setGroupSessions((prev) => [...prev, newSession]);
    pushToFeed(`New group session posted: "${newSession.title}" with ${coachName} — ${formatDate(form.date)}, ${form.time}–${form.endTime}`);
    pushToFeed(`📧 Confirmation emailed to ${coachName}: your session "${newSession.title}" on ${formatDate(form.date)} has been posted.`);
  }

  function addCoachAvailability(coachId, form) {
    const coach = coaches.find((c) => c.id === coachId);
    if (!coach) return;
    const entryId = Date.now();
    const entry = { id: entryId, date: form.date, startTime: form.startTime, endTime: form.endTime, isEvent: false };
    setCoaches((prev) => prev.map((c) => (c.id === coachId ? { ...c, schedule: [...(c.schedule || []), entry] } : c)));
    pushToFeed(`📧 Confirmation emailed to ${coach.name}: you're marked available ${formatDate(form.date)}, ${form.startTime}–${form.endTime}.`);
  }

  function updateCoachRate(coachId, newRate) {
    setCoaches((prev) => prev.map((c) => (c.id === coachId ? { ...c, oneOnOneRate: newRate } : c)));
  }

  function updateCoachBio(coachId, keywords, photo) {
    setCoaches((prev) => prev.map((c) => (c.id === coachId ? { ...c, bioKeywords: keywords, photo: photo !== undefined ? photo : c.photo } : c)));
  }

  function setHourlyRate(coachId, newRate) {
    setCoaches((prev) => prev.map((c) => (c.id === coachId ? { ...c, rate: newRate } : c)));
  }

  function createCoachProfile(name) {
    const id = Math.max(0, ...coaches.map((c) => c.id)) + 1;
    const nextCode = String(Math.max(5500, ...coaches.map((c) => parseInt(c.code, 10) || 0)) + 1);
    const newCoach = { id, name: name.trim(), code: nextCode, rate: null, hoursThisPeriod: 0, hoursPaid: 0, oneOnOneRate: 120, schedule: [] };
    setCoaches((prev) => [...prev, newCoach]);
    pushToFeed(`📧 Confirmation emailed to ${name.trim()}: your coach profile is set up. Your login code is #${nextCode}.`);
    return id;
  }

  function signAgreement(memberId, typedName) {
    const now = new Date().toISOString();
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, agreement: { signedAt: now, signedName: typedName } } : m))
    );
  }

  function findMemberByName(name) {
    const norm = name.trim().toLowerCase();
    return members.find((m) => `${m.first} ${m.last}`.toLowerCase() === norm);
  }

  function findMemberByEmail(email) {
    const norm = email.trim().toLowerCase();
    return members.find((m) => (m.email || "").toLowerCase() === norm);
  }

  function pushToFeed(text) {
    setFeed((f) => [{ id: Math.max(0, ...f.map((x) => x.id)) + 1, text, time: new Date().toISOString() }, ...f]);
  }

  function checkIn(id) {
    const now = new Date().toISOString();
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, checkedInAt: now, lastVisit: now, visits: [...m.visits, 1] }
          : m
      )
    );
    const m = members.find((x) => x.id === id);
    if (m) pushToFeed(`Another fighter made its way to the floor: ${m.first} ${m.last} - ${formatTime(now)}`);
  }

  // Full "I don't have a code" onboarding: creates either a Day Pass guest or a
  // recurring member, with waivers + emergency contact + health card + payment plan on file.
  function onboardNewUser(form) {
    // form: { first, last, email, becomingMember, plan, emergencyContactName,
    //         emergencyContactPhone, healthCardInfo, photoConsent, liabilitySignature, cardLast4 }
    const id = Math.max(0, ...members.map((m) => m.id)) + 1;
    const nextNo = String(Math.max(1000, ...members.map((m) => parseInt(m.memberNo, 10))) + 1);
    const now = new Date().toISOString();

    let tier, nextFeeDate, nextFeeAmount, passesRemaining, initialAmount, initialDesc;
    if (form.becomingMember) {
      tier = form.plan === "quarterly" ? "Quarterly" : "Monthly";
      const end = new Date();
      end.setDate(end.getDate() + (tier === "Quarterly" ? 90 : 30));
      nextFeeDate = end.toISOString().slice(0, 10);
      nextFeeAmount = tier === "Quarterly" ? 180 : 70;
      passesRemaining = null;
      initialAmount = nextFeeAmount;
      initialDesc = `${tier} membership`;
    } else {
      tier = form.plan === "bundle" ? "Day Pass Bundle" : "Day Pass";
      nextFeeDate = null;
      nextFeeAmount = 0;
      passesRemaining = (form.plan === "bundle" ? DAY_PASS_BUNDLE_COUNT : 1) - 1;
      initialAmount = form.plan === "bundle" ? DAY_PASS_BUNDLE_PRICE : DAY_PASS_PRICE;
      initialDesc = tier;
    }

    const newMember = {
      id,
      memberNo: nextNo,
      first: form.first,
      last: form.last,
      email: form.email,
      tier,
      joined: now.slice(0, 10),
      lastVisit: now,
      visits: [1],
      coach: "Unassigned",
      hoursLogged: 0,
      checkedInAt: now,
      balance: 0,
      nextFeeDate,
      nextFeeAmount,
      avatar: null,
      preferredName: null,
      agreement: { signedAt: now, signedName: form.liabilitySignature },
      passesRemaining,
      dailyLog: {},
      emergencyContactName: form.emergencyContactName,
      emergencyContactPhone: form.emergencyContactPhone,
      healthCardInfo: form.healthCardInfo,
      photoConsent: form.photoConsent,
      invoices: [{ id: Date.now(), amount: initialAmount, description: initialDesc, issuedAt: now, status: "unpaid" }],
    };
    setMembers((prev) => {
      const withNewMember = [...prev, newMember];
      if (form.referredBy) {
        const referrer = prev.find((m) => m.memberNo === form.referredBy.trim());
        if (referrer) {
          pushToFeed(`🎉 ${referrer.first} ${referrer.last} referred ${form.first} ${form.last} — $10 credit applied to their account.`);
          return withNewMember.map((m) => (m.id === referrer.id ? { ...m, balance: Math.round((m.balance - 10) * 100) / 100 } : m));
        }
      }
      return withNewMember;
    });
    pushToFeed(`Another fighter made its way to the floor: ${form.first} ${form.last} - ${formatTime(now)} (${tier} — code #${nextNo})`);
    pushToFeed(`📧 Confirmation emailed to ${form.email}: your email is confirmed. Your code is #${nextNo} — use it (or your email) to sign in next time.`);
    return id;
  }

  // creates a new guest/day-pass record and checks them in immediately; returns the new id
  function createGuestAndCheckIn(name, signature, plan) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0] || name.trim();
    const last = parts.slice(1).join(" ") || "Guest";
    const id = Math.max(0, ...members.map((m) => m.id)) + 1;
    const nextNo = String(Math.max(1000, ...members.map((m) => parseInt(m.memberNo, 10))) + 1);
    const now = new Date().toISOString();
    const passesTotal = plan === "bundle" ? DAY_PASS_BUNDLE_COUNT : 1;
    const newMember = {
      id,
      memberNo: nextNo,
      first,
      last,
      tier: plan === "bundle" ? "Day Pass Bundle" : "Day Pass",
      joined: now.slice(0, 10),
      lastVisit: now,
      visits: [1],
      coach: "Unassigned",
      hoursLogged: 0,
      checkedInAt: now,
      balance: 0,
      nextFeeDate: null,
      nextFeeAmount: 0,
      avatar: null,
      preferredName: null,
      agreement: { signedAt: now, signedName: signature },
      passesRemaining: passesTotal - 1,
      dailyLog: {},
    };
    setMembers((prev) => [...prev, newMember]);
    pushToFeed(`Another fighter made its way to the floor: ${first} ${last} - ${formatTime(now)} (day pass — code #${nextNo})`);
    return id;
  }

  // used when a returning guest/member types their name instead of their code
  function checkInReturningByName(existing) {
    if (!existing.checkedInAt) checkIn(existing.id);
    return existing.id;
  }

  // Simulated quick login — real Google/Apple sign-in needs OAuth credentials and a
  // server to verify tokens, which this browser prototype can't do. This demonstrates
  // the one-tap UX: first tap provisions a demo account tied to the provider, later
  // taps recognize it and check the same person back in.
  function quickLoginWithProvider(provider) {
    const existing = members.find((m) => m.authProvider === provider);
    if (existing) {
      if (!existing.checkedInAt) checkIn(existing.id);
      setMemberSessionId(existing.id);
      setMode("member");
      return;
    }
    const label = provider === "google" ? ["Google", "User"] : ["Apple", "User"];
    const id = Math.max(0, ...members.map((m) => m.id)) + 1;
    const nextNo = String(Math.max(1000, ...members.map((m) => parseInt(m.memberNo, 10))) + 1);
    const now = new Date().toISOString();
    const newMember = {
      id,
      memberNo: nextNo,
      first: label[0],
      last: label[1],
      tier: "Day Pass",
      joined: now.slice(0, 10),
      lastVisit: now,
      visits: [1],
      coach: "Unassigned",
      hoursLogged: 0,
      checkedInAt: now,
      balance: 0,
      nextFeeDate: null,
      nextFeeAmount: 0,
      avatar: null,
      preferredName: null,
      agreement: null,
      passesRemaining: 0,
      authProvider: provider,
      dailyLog: {},
    };
    setMembers((prev) => [...prev, newMember]);
    pushToFeed(`Another fighter made its way to the floor: ${label[0]} ${label[1]} - ${formatTime(now)} (quick login — code #${nextNo})`);
    setMemberSessionId(id);
    setMode("member");
  }

  function checkOut(id) {
    const m = members.find((x) => x.id === id);
    if (!m || !m.checkedInAt) return;
    const now = new Date();
    const inTime = new Date(m.checkedInAt);
    const minutes = Math.max(1, Math.round((now - inTime) / 60000));
    const hrs = Math.round((minutes / 60) * 10) / 10;
    const roundsThisSession = Math.floor(minutes / ROUND_MINUTES);
    const dateKey = inTime.toISOString().slice(0, 10);
    setMembers((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              checkedInAt: null,
              hoursLogged: Math.round((x.hoursLogged + hrs) * 10) / 10,
              dailyLog: { ...(x.dailyLog || {}), [dateKey]: (x.dailyLog?.[dateKey] || 0) + roundsThisSession },
            }
          : x
      )
    );
    pushToFeed(`Checked out — ${m.first} ${m.last} logged ${minutes} min (${roundsThisSession} rounds) with ${m.coach}`);
  }

  // Safety net: if someone forgets to sign out, auto-checkout after MAX_SESSION_HOURS.
  // Real "left the building" detection would need a native app with background GPS or
  // door beacons — not something this browser prototype can do — so this is the practical stand-in.
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      members.forEach((m) => {
        if (m.checkedInAt) {
          const hoursIn = (now - new Date(m.checkedInAt)) / (1000 * 60 * 60);
          if (hoursIn >= MAX_SESSION_HOURS) {
            checkOut(m.id);
            pushToFeed(`Auto-checkout: ${m.first} ${m.last} was signed out automatically after ${MAX_SESSION_HOURS}+ hours (looks like they forgot to check out)`);
          }
        }
      });
    }, 60000); // check once a minute
    return () => clearInterval(interval);
  }, [members]);

  // Live floor-count broadcast — whenever the on-floor headcount changes and is
  // more than 2 people, post an update to the notification feed (WhatsApp-style).
  const floorCount = members.filter((m) => m.checkedInAt).length;
  const prevFloorCountRef = useRef(floorCount);
  useEffect(() => {
    if (floorCount !== prevFloorCountRef.current) {
      if (floorCount > 2) {
        pushToFeed(`🥊 ${floorCount} fighters on the floor right now!`);
      }
      prevFloorCountRef.current = floorCount;
    }
  }, [floorCount]);

  return (
    <div style={{ minHeight: "100vh", background: "#0B0B0B", color: "#F2F0EA", fontFamily: "'Archivo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap');
        * { box-sizing: border-box; }
        .num { font-family: 'Anton', sans-serif; }
        .oswald { font-family: 'Oswald', sans-serif; }
        ::selection { background: #C81E1E; color: #fff; }
      `}</style>

      <LanguageToggle lang={language} onToggle={() => setLanguage((l) => (l === "en" ? "fr" : "en"))} />

      {mode === "landing" ? (
        <LandingGate
          lang={language}
          members={members}
          coaches={coaches}
          onStaff={() => setMode("staff")}
          onCoachLogin={(coachId) => {
            setCoachSessionId(coachId);
            setMode("coach");
          }}
          onCreateCoachProfile={(name) => {
            const id = createCoachProfile(name);
            setCoachSessionId(id);
            setMode("coach");
          }}
          onMemberLogin={(id) => {
            setMemberSessionId(id);
            setMode("member");
          }}
          onGuidelines={() => { setGuidelinesReturnTo("landing"); setMode("guidelines"); }}
          findMemberByName={findMemberByName}
          onCheckInReturning={(existing) => {
            const id = checkInReturningByName(existing);
            setMemberSessionId(id);
            setMode("member");
          }}
          onCreateGuest={(name, signature, plan) => {
            const id = createGuestAndCheckIn(name, signature, plan);
            setMemberSessionId(id);
            setMode("member");
          }}
          onQuickLogin={quickLoginWithProvider}
          findMemberByEmail={findMemberByEmail}
          onOnboard={(form) => {
            const id = onboardNewUser(form);
            setMemberSessionId(id);
            setMode("member");
          }}
        />
      ) : mode === "guidelines" ? (
        <GuidelinesPage onBack={() => setMode(guidelinesReturnTo)} />
      ) : mode === "coach" ? (
        <CoachPortal
          coach={coaches.find((c) => c.id === coachSessionId)}
          groupSessions={groupSessions}
          oneOnOneRequests={oneOnOneRequests}
          members={members}
          qaThreads={qaThreads}
          recommendations={recommendations}
          onAnswerQuestion={(threadId, text) => {
            const coach = coaches.find((c) => c.id === coachSessionId);
            if (coach) answerQuestion(threadId, coach.name, text);
          }}
          onAddCoachNote={(memberId, note) => {
            const coach = coaches.find((c) => c.id === coachSessionId);
            if (coach) addCoachNote(coach.name, memberId, note);
          }}
          onPostSession={(form) => {
            const coach = coaches.find((c) => c.id === coachSessionId);
            if (coach) postGroupSession(coach.name, form);
          }}
          onAddAvailability={(form) => addCoachAvailability(coachSessionId, form)}
          onUpdateRate={(rate) => updateCoachRate(coachSessionId, rate)}
          onUpdateBio={(keywords, photo) => updateCoachBio(coachSessionId, keywords, photo)}
          suggestionOfWeek={suggestionOfWeek}
          onSetSuggestion={(text) => {
            const coach = coaches.find((c) => c.id === coachSessionId);
            if (coach) setSuggestionOfWeek(coach.name, text);
          }}
          customDrills={customDrills}
          onAddCustomDrill={addCustomDrill}
          onRemoveCustomDrill={removeCustomDrill}
          onLogout={() => {
            setCoachSessionId(null);
            setMode("landing");
          }}
        />
      ) : mode === "member" ? (
        <MemberPortal
          lang={language}
          member={members.find((m) => m.id === memberSessionId)}
          groupSessions={groupSessions}
          members={members}
          coaches={coaches}
          qaThreads={qaThreads}
          coachNotes={coachNotes.filter((n) => n.memberId === memberSessionId)}
          suggestionOfWeek={suggestionOfWeek}
          customDrills={customDrills}
          onCheckIn={checkIn}
          onCheckOut={checkOut}
          onUpdateProfile={(updates) => updateProfile(memberSessionId, updates)}
          onReserve={(sessionId) => reserveSpot(sessionId, memberSessionId)}
          onRequestOneOnOne={(coachName, contactMethod, contactInfo) => requestOneOnOne(memberSessionId, coachName, contactMethod, contactInfo)}
          onAskQuestion={(question) => askQuestion(memberSessionId, question)}
          onSubmitRecommendation={(text) => submitRecommendation(memberSessionId, text)}
          onSignAgreement={(name) => signAgreement(memberSessionId, name)}
          onUpdateAvatar={(dataUrl) => updateProfile(memberSessionId, { avatar: dataUrl })}
          onGuidelines={() => { setGuidelinesReturnTo("member"); setMode("guidelines"); }}
          onLogout={() => {
            setMemberSessionId(null);
            setMode("landing");
          }}
        />
      ) : selected ? (
        <MemberDetail member={selected} onBack={() => setSelectedId(null)} />
      ) : view === "coaches" ? (
        <CoachesView coaches={coaches} onBack={() => setView("roster")} onSetRate={setHourlyRate} />
      ) : view === "interest" ? (
        <InterestView
          groupSessions={groupSessions}
          members={members}
          oneOnOneRequests={oneOnOneRequests}
          onBack={() => setView("roster")}
        />
      ) : view === "database" ? (
        <DatabaseView
          members={members}
          onBack={() => setView("roster")}
          onSelect={(id) => { setSelectedId(id); setView("roster"); }}
        />
      ) : view === "checkin" ? (
        <CheckInKiosk
          members={[...members].sort((a, b) => a.last.localeCompare(b.last))}
          feed={feed}
          onCheckIn={checkIn}
          onCheckOut={checkOut}
          onBack={() => setView("roster")}
          onShowDayPass={() => setShowNameSignIn(true)}
        />
      ) : (
        <RosterView
          members={sorted}
          totalMembers={members.length}
          activeCount={activeCount}
          dailyVisits={dailyVisits}
          returningRatio={returningRatio}
          query={query}
          setQuery={setQuery}
          onSelect={setSelectedId}
          onShowCoaches={() => setView("coaches")}
          onShowCheckin={() => setView("checkin")}
          onShowInterest={() => setView("interest")}
          onShowDatabase={() => setView("database")}
          onAdd={() => setShowAdd(true)}
          onExit={() => setMode("landing")}
          suggestionOfWeek={suggestionOfWeek}
          onSetSuggestion={(text) => setSuggestionOfWeek("Front Desk", text)}
          customDrills={customDrills}
          onAddCustomDrill={addCustomDrill}
          onRemoveCustomDrill={removeCustomDrill}
        />
      )}

      {showAdd && <AddMemberModal coaches={coaches} onClose={() => setShowAdd(false)} onSave={addMember} />}
      {showNameSignIn && (
        <NameSignInModal
          findMemberByName={findMemberByName}
          onCheckInReturning={(existing) => {
            checkInReturningByName(existing);
            setShowNameSignIn(false);
          }}
          onCreateGuest={(name, signature, plan) => {
            createGuestAndCheckIn(name, signature, plan);
            setShowNameSignIn(false);
          }}
          onClose={() => setShowNameSignIn(false)}
        />
      )}
    </div>
  );
}

const STAFF_ACCESS_CODE = "4477";
const CLUB_WHATSAPP_LINK = "https://chat.whatsapp.com/ScopesBoxingClubGroup"; // placeholder — replace with your real group link
const DAY_PASS_CONSENT_TEXT = `By entering Scopes Boxing Club today, you agree to use our premises respectfully and gain access to our peer support community here at the gym.

Want to stay in the loop? Join our club WhatsApp group for updates:
${CLUB_WHATSAPP_LINK}`;

// ---------- landing / login gate ----------
// ---------- PIVOT wordmark — the "O" is a rifle-scope crosshair ----------
function PivotLogo({ size = 40 }) {
  const glyphSize = size * 0.72;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'Anton', sans-serif", fontSize: size, letterSpacing: 1, color: "#F2F0EA" }}>
      PIV
      <svg width={glyphSize} height={glyphSize} viewBox="0 0 40 40" style={{ margin: "0 2px" }}>
        <circle cx="20" cy="20" r="15" stroke="#C81E1E" strokeWidth="3" fill="none" />
        <line x1="20" y1="0" x2="20" y2="9" stroke="#C81E1E" strokeWidth="3" />
        <line x1="20" y1="31" x2="20" y2="40" stroke="#C81E1E" strokeWidth="3" />
        <line x1="0" y1="20" x2="9" y2="20" stroke="#C81E1E" strokeWidth="3" />
        <line x1="31" y1="20" x2="40" y2="20" stroke="#C81E1E" strokeWidth="3" />
        <circle cx="20" cy="20" r="2.5" fill="#C81E1E" />
      </svg>
      T
    </span>
  );
}

function LandingGate({ lang, members, coaches, onStaff, onCoachLogin, onCreateCoachProfile, onMemberLogin, onGuidelines, findMemberByName, onCheckInReturning, onCreateGuest, onQuickLogin, findMemberByEmail, onOnboard }) {
  const [screen, setScreen] = useState("home"); // home | member | staff | name
  const [entry, setEntry] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [showNewStaff, setShowNewStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");

  function submitMember() {
    const match = members.find((m) => m.memberNo === entry.trim());
    if (!match) {
      setError("No member found with that number. Ask the front desk for help.");
      return;
    }
    setError("");
    onMemberLogin(match.id);
  }

  function submitStaff() {
    const code = entry.trim();
    if (code === STAFF_ACCESS_CODE) {
      setError("");
      onStaff();
      return;
    }
    const coachMatch = coaches.find((c) => c.code === code);
    if (coachMatch) {
      setError("");
      onCoachLogin(coachMatch.id);
      return;
    }
    setError("Incorrect code.");
  }

  function reset() {
    setScreen("home");
    setEntry("");
    setError("");
    setShowForgot(false);
    setShowNewStaff(false);
    setNewStaffName("");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      <PivotLogo size={44} />
      <div className="oswald" style={{ fontSize: 11, letterSpacing: 3, color: "#8A8A85", textTransform: "uppercase", marginTop: 6, marginBottom: 30 }}>
        {t(lang, "tagline")}
      </div>
      <div className="oswald" style={{ fontSize: 12, letterSpacing: 4, color: "#8A8A85", textTransform: "uppercase", marginBottom: 40 }}>
        {t(lang, "chooseSignIn")}
      </div>

      {screen === "home" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
          <button
            onClick={() => setScreen("nocode")}
            className="oswald"
            style={{ background: "#C81E1E", color: "#fff", border: "none", borderRadius: 6, padding: "16px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 14, textTransform: "uppercase" }}
          >
            {t(lang, "newHere")}
          </button>
          <button
            onClick={() => setScreen("member")}
            className="oswald"
            style={{ background: "#161615", color: "#F2F0EA", border: "1px solid #C81E1E", borderRadius: 6, padding: "16px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 14, textTransform: "uppercase" }}
          >
            {t(lang, "returning")}
          </button>
          <button
            onClick={() => setScreen("staff")}
            className="oswald"
            style={{ background: "#161615", color: "#F2F0EA", border: "1px solid #2A2A28", borderRadius: 6, padding: "16px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 14, textTransform: "uppercase" }}
          >
            {t(lang, "staffAccess")}
          </button>
          <button
            onClick={onGuidelines}
            className="oswald"
            style={{ background: "none", border: "none", color: "#6B6B66", cursor: "pointer", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginTop: 10 }}
          >
            {t(lang, "clubGuidelines")}
          </button>
        </div>
      )}

      {screen === "nocode" && (
        <NoCodeFlow
          onOnboard={onOnboard}
          onClose={reset}
        />
      )}

      {screen === "name" && (
        <NameSignInModal
          inline
          findMemberByName={findMemberByName}
          onCheckInReturning={onCheckInReturning}
          onCreateGuest={onCreateGuest}
          onClose={reset}
        />
      )}

      {screen === "member" && (
        <div style={{ width: "100%", maxWidth: 320 }}>
          <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            Enter your 4-digit member number
          </div>
          <input
            autoFocus
            value={entry}
            onChange={(e) => setEntry(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onKeyDown={(e) => e.key === "Enter" && submitMember()}
            placeholder="1001"
            style={loginInputStyle}
          />
          {error && <div style={{ color: "#C81E1E", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button onClick={submitMember} className="oswald" style={loginButtonStyle}>
            Sign In
          </button>
          <button onClick={reset} className="oswald" style={loginBackStyle}>
            Back
          </button>
          <div className="oswald" style={{ fontSize: 10.5, color: "#5A5A56", marginTop: 14, lineHeight: 1.5 }}>
            Your member number only unlocks your own information — you can't look up anyone else here.
          </div>

          {!showForgot ? (
            <button
              onClick={() => setShowForgot(true)}
              className="oswald"
              style={{ width: "100%", background: "none", border: "none", color: "#8A8A85", cursor: "pointer", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginTop: 18 }}
            >
              Forgot your code?
            </button>
          ) : (
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #2A2A28" }}>
              <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
                Verify your identity to recover your code
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => onQuickLogin("google")}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", color: "#1F1F1F", border: "1px solid #dadce0", borderRadius: 6, padding: "12px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Archivo', sans-serif" }}
                >
                  <GoogleLogo /> Continue with Google
                </button>
                <button
                  onClick={() => onQuickLogin("apple")}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#000", color: "#fff", border: "1px solid #000", borderRadius: 6, padding: "12px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Archivo', sans-serif" }}
                >
                  <AppleLogo /> Continue with Apple
                </button>
              </div>
              <div className="oswald" style={{ fontSize: 10, color: "#5A5A56", marginTop: 10, lineHeight: 1.5 }}>
                Demo only — simulates account recovery; not connected to a real Google or Apple account.
              </div>
            </div>
          )}
        </div>
      )}

      {screen === "staff" && (
        <div style={{ width: "100%", maxWidth: 320 }}>
          <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            Enter your staff or coach code
          </div>
          <input
            autoFocus
            type="password"
            value={entry}
            onChange={(e) => setEntry(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onKeyDown={(e) => e.key === "Enter" && submitStaff()}
            placeholder="••••"
            style={loginInputStyle}
          />
          {error && <div style={{ color: "#C81E1E", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button onClick={submitStaff} className="oswald" style={loginButtonStyle}>
            Sign In
          </button>
          <button onClick={reset} className="oswald" style={loginBackStyle}>
            Back
          </button>
          <div className="oswald" style={{ fontSize: 10.5, color: "#5A5A56", marginTop: 14, lineHeight: 1.5 }}>
            Prototype codes — front desk: {STAFF_ACCESS_CODE} · coach Natasha: 6789
          </div>

          {!showNewStaff ? (
            <button
              onClick={() => setShowNewStaff(true)}
              className="oswald"
              style={{ width: "100%", background: "none", border: "none", color: "#8A8A85", cursor: "pointer", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginTop: 18 }}
            >
              New Coach? Create Your Profile
            </button>
          ) : (
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #2A2A28" }}>
              <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
                What's your name?
              </div>
              <input
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && newStaffName.trim() && onCreateCoachProfile(newStaffName.trim())}
                placeholder="Full name"
                style={{ ...loginInputStyle, textTransform: "none", letterSpacing: 0, fontFamily: "'Archivo', sans-serif", fontSize: 16 }}
              />
              <button
                onClick={() => newStaffName.trim() && onCreateCoachProfile(newStaffName.trim())}
                disabled={!newStaffName.trim()}
                className="oswald"
                style={{ ...loginButtonStyle, background: newStaffName.trim() ? "#C81E1E" : "#5A1414", cursor: newStaffName.trim() ? "pointer" : "not-allowed" }}
              >
                Create Profile &amp; Get My Code
              </button>
              <div className="oswald" style={{ fontSize: 10, color: "#5A5A56", lineHeight: 1.5 }}>
                You'll get a login code immediately — save it for next time. A confirmation is also sent to your email.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.6 0-14.2 4.3-17.6 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.4C29.5 34.6 26.9 35.5 24 35.5c-5.3 0-9.7-3.6-11.3-8.5l-6.5 5C9.7 39.6 16.3 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.5 5.4C40.4 36.4 44 30.9 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.417 2.09-1.25 2.85-.833.76-1.83 1.19-2.99 1.13-.05-1.12.42-2.06 1.25-2.82.83-.76 1.85-1.22 2.99-1.16zM20.15 17.06c-.42.98-.93 1.9-1.55 2.77-.85 1.2-1.95 2.7-3.34 2.72-1.24.02-1.56-.8-3.24-.8-1.68 0-2.05.78-3.24.82-1.34.05-2.35-1.3-3.21-2.5C3.83 17.9 2.5 14 3.5 11.4c.7-1.83 2.3-3.03 4.06-3.05 1.28-.02 2.48.85 3.24.85.76 0 2.22-1.05 3.75-.9.64.03 2.42.26 3.57 1.94-.09.06-2.13 1.24-2.11 3.71.02 2.95 2.6 3.93 2.63 3.95-.02.07-.41 1.4-1.49 2.16z" />
    </svg>
  );
}

const loginInputStyle = {
  width: "100%",
  textAlign: "center",
  letterSpacing: 6,
  background: "#161615",
  border: "1px solid #2A2A28",
  borderRadius: 6,
  padding: "14px",
  color: "#F2F0EA",
  fontFamily: "'Anton', sans-serif",
  fontSize: 24,
  outline: "none",
  marginBottom: 12,
};

const loginButtonStyle = {
  width: "100%",
  background: "#C81E1E",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "14px",
  fontWeight: 700,
  letterSpacing: 1,
  cursor: "pointer",
  fontSize: 14,
  textTransform: "uppercase",
  marginBottom: 10,
};

const loginBackStyle = {
  width: "100%",
  background: "none",
  border: "none",
  color: "#6B6B66",
  cursor: "pointer",
  fontSize: 12,
  letterSpacing: 1,
  textTransform: "uppercase",
};

const nocodeInput = {
  width: "100%",
  background: "#161615",
  border: "1px solid #2A2A28",
  borderRadius: 6,
  padding: "12px 14px",
  color: "#F2F0EA",
  fontFamily: "'Archivo', sans-serif",
  fontSize: 14,
  outline: "none",
  marginBottom: 10,
};

const SAFETY_WAIVER_TEXT = `Sparring at this gym is not full-contact fighting — it's training, done for fun and skill-building, never to hurt each other. No headshots are ever permitted, and there's zero tolerance for anyone who comes in looking to beat someone up rather than train. Coaches supervise all sparring to keep everyone safe.

By continuing, you confirm you understand these risks and agree to follow safe sparring practices at all times.`;

const PHOTO_WAIVER_TEXT = `Scopes Boxing Club may take photos or videos during classes, sparring, and events for promotional or record-keeping purposes.

Do you consent to appearing in these photos/videos? Either choice is fine — this won't affect your access.`;

const LIABILITY_WAIVER_TEXT = `Boxing and combat training carry inherent physical risk. By signing below, you acknowledge this risk and release Scopes Boxing Club, its coaches, and staff from liability for injuries sustained while training here, provided reasonable safety protocols were followed.`;

// ---------- "I don't have a code" onboarding flow ----------
function NoCodeFlow({ onOnboard, onClose }) {
  const [step, setStep] = useState("memberOrDayPass");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [becomingMember, setBecomingMember] = useState(null);
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [healthCardInfo, setHealthCardInfo] = useState("");
  const [safetyAgreed, setSafetyAgreed] = useState(false);
  const [photoConsent, setPhotoConsent] = useState(null);
  const [liabilitySignature, setLiabilitySignature] = useState("");
  const [liabilityAgreed, setLiabilityAgreed] = useState(false);
  const [plan, setPlan] = useState(null);
  const [cardLast4, setCardLast4] = useState("");

  function submitFinal() {
    if (!plan || cardLast4.length !== 4) return;
    onOnboard({
      first: first.trim(),
      last: last.trim(),
      email: email.trim(),
      becomingMember,
      plan,
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      healthCardInfo: healthCardInfo.trim(),
      photoConsent,
      liabilitySignature: liabilitySignature.trim(),
      cardLast4,
      referredBy: referredBy.trim(),
    });
  }

  const stepLabel = {
    memberOrDayPass: "New Here",
    nameEmail: "Your Info",
    waiver1: "Health & Safety",
    waiver2: "Photo & Video",
    waiver3: "Liability Release",
    payment: "Payment",
  }[step];

  return (
    <div style={{ width: "100%", maxWidth: 360, textAlign: "left" }}>
      <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>
        {stepLabel}
      </div>

      {step === "memberOrDayPass" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, color: "#F2F0EA", marginBottom: 18 }}>
            Are you already a member of the gym, or coming in today for a day pass?
          </div>
          <button onClick={() => { setBecomingMember(true); setStep("nameEmail"); }} className="oswald" style={{ ...loginButtonStyle }}>
            I'm Already a Member
          </button>
          <button onClick={() => { setBecomingMember(false); setStep("nameEmail"); }} className="oswald" style={{ ...loginButtonStyle, background: "#161615", border: "1px solid #2A2A28" }}>
            Just a Day Pass Today
          </button>
          <button onClick={onClose} className="oswald" style={{ ...loginBackStyle, marginTop: 6 }}>Back</button>
        </div>
      )}

      {step === "nameEmail" && (
        <div>
          <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First name" style={nocodeInput} />
          <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last name" style={nocodeInput} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" style={nocodeInput} />
          <input value={referredBy} onChange={(e) => setReferredBy(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Referred by? Friend's member code (optional)" style={nocodeInput} />
          <div className="oswald" style={{ fontSize: 10.5, color: "#5A5A56", marginBottom: 12, lineHeight: 1.5 }}>
            We'll email you a code so you can skip this next time. Got referred by a friend? Enter their code above — they'll get $10 for bringing you in.
          </div>
          <button
            onClick={() => setStep("waiver1")}
            disabled={!first.trim() || !last.trim() || !email.trim()}
            className="oswald"
            style={{ ...loginButtonStyle, background: first.trim() && last.trim() && email.trim() ? "#C81E1E" : "#5A1414", cursor: first.trim() && last.trim() && email.trim() ? "pointer" : "not-allowed" }}
          >
            Continue
          </button>
          <button onClick={() => setStep("memberOrDayPass")} className="oswald" style={loginBackStyle}>Back</button>
        </div>
      )}

      {step === "waiver1" && (
        <div>
          <div style={{ fontSize: 12.5, color: "#D8D6CF", lineHeight: 1.7, marginBottom: 14, whiteSpace: "pre-wrap" }}>{SAFETY_WAIVER_TEXT}</div>
          <input value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} placeholder="Emergency contact — full name" style={nocodeInput} />
          <input value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} placeholder="Emergency contact — phone number" style={nocodeInput} />
          <input value={healthCardInfo} onChange={(e) => setHealthCardInfo(e.target.value)} placeholder="Health card number (optional)" style={nocodeInput} />
          <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12, cursor: "pointer" }}>
            <input type="checkbox" checked={safetyAgreed} onChange={(e) => setSafetyAgreed(e.target.checked)} style={{ marginTop: 3 }} />
            <span className="oswald" style={{ fontSize: 11.5, color: "#B8B6AF" }}>I understand the risks and agree to safe sparring practices.</span>
          </label>
          <button
            onClick={() => setStep("waiver2")}
            disabled={!safetyAgreed || !emergencyContactName.trim() || !emergencyContactPhone.trim()}
            className="oswald"
            style={{ ...loginButtonStyle, background: safetyAgreed && emergencyContactName.trim() && emergencyContactPhone.trim() ? "#C81E1E" : "#5A1414", cursor: safetyAgreed && emergencyContactName.trim() && emergencyContactPhone.trim() ? "pointer" : "not-allowed" }}
          >
            Continue
          </button>
        </div>
      )}

      {step === "waiver2" && (
        <div>
          <div style={{ fontSize: 12.5, color: "#D8D6CF", lineHeight: 1.7, marginBottom: 16, whiteSpace: "pre-wrap" }}>{PHOTO_WAIVER_TEXT}</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button onClick={() => setPhotoConsent(true)} className="oswald" style={{ flex: 1, background: photoConsent === true ? "#C81E1E" : "#161615", color: "#fff", border: `1px solid ${photoConsent === true ? "#C81E1E" : "#2A2A28"}`, borderRadius: 6, padding: "12px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 13, textTransform: "uppercase" }}>Yes, I Consent</button>
            <button onClick={() => setPhotoConsent(false)} className="oswald" style={{ flex: 1, background: photoConsent === false ? "#C81E1E" : "#161615", color: "#fff", border: `1px solid ${photoConsent === false ? "#C81E1E" : "#2A2A28"}`, borderRadius: 6, padding: "12px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 13, textTransform: "uppercase" }}>No Thanks</button>
          </div>
          <button
            onClick={() => setStep("waiver3")}
            disabled={photoConsent === null}
            className="oswald"
            style={{ ...loginButtonStyle, background: photoConsent !== null ? "#C81E1E" : "#5A1414", cursor: photoConsent !== null ? "pointer" : "not-allowed" }}
          >
            Continue
          </button>
        </div>
      )}

      {step === "waiver3" && (
        <div>
          <div style={{ fontSize: 12.5, color: "#D8D6CF", lineHeight: 1.7, marginBottom: 14, whiteSpace: "pre-wrap" }}>{LIABILITY_WAIVER_TEXT}</div>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={liabilityAgreed} onChange={(e) => setLiabilityAgreed(e.target.checked)} style={{ marginTop: 3 }} />
            <span className="oswald" style={{ fontSize: 11.5, color: "#B8B6AF" }}>I have read and agree to this liability release.</span>
          </label>
          <input value={liabilitySignature} onChange={(e) => setLiabilitySignature(e.target.value)} placeholder="Type your full name to sign" style={nocodeInput} />
          <button
            onClick={() => setStep("payment")}
            disabled={!liabilityAgreed || !liabilitySignature.trim()}
            className="oswald"
            style={{ ...loginButtonStyle, background: liabilityAgreed && liabilitySignature.trim() ? "#C81E1E" : "#5A1414", cursor: liabilityAgreed && liabilitySignature.trim() ? "pointer" : "not-allowed" }}
          >
            Continue
          </button>
        </div>
      )}

      {step === "payment" && (
        <div>
          <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            {becomingMember ? "Choose Your Membership" : "Choose Your Pass"}
          </div>
          {becomingMember ? (
            <>
              <PlanOption label="Monthly" price={70} selected={plan === "monthly"} onClick={() => setPlan("monthly")} sub="Billed every 30 days" />
              <PlanOption label="Quarterly" price={180} selected={plan === "quarterly"} onClick={() => setPlan("quarterly")} sub="Billed every 3 months" />
            </>
          ) : (
            <>
              <PlanOption label="Single Day Pass" price={DAY_PASS_PRICE} selected={plan === "single"} onClick={() => setPlan("single")} sub="Good for today only" />
              <PlanOption label={`Bundle of ${DAY_PASS_BUNDLE_COUNT}`} price={DAY_PASS_BUNDLE_PRICE} selected={plan === "bundle"} onClick={() => setPlan("bundle")} sub="Use any day" />
            </>
          )}
          <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", margin: "14px 0 8px" }}>
            Pre-Authorized Payment
          </div>
          <input
            value={cardLast4}
            onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="Last 4 digits of card"
            style={nocodeInput}
          />
          <div className="oswald" style={{ fontSize: 10.5, color: "#5A5A56", marginBottom: 14, lineHeight: 1.5 }}>
            Demo only — no real payment is processed or stored. {becomingMember ? "This authorizes recurring charges on your billing date." : "This authorizes a one-time charge for today's pass."}
          </div>
          <button
            onClick={submitFinal}
            disabled={!plan || cardLast4.length !== 4}
            className="oswald"
            style={{ ...loginButtonStyle, background: plan && cardLast4.length === 4 ? "#C81E1E" : "#5A1414", cursor: plan && cardLast4.length === 4 ? "pointer" : "not-allowed" }}
          >
            Finish &amp; Get My Code
          </button>
        </div>
      )}
    </div>
  );
}

function PlanOption({ label, price, sub, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="oswald"
      style={{
        width: "100%", textAlign: "left", background: selected ? "#1B0E0E" : "#161615",
        border: `1px solid ${selected ? "#C81E1E" : "#2A2A28"}`, borderRadius: 6, padding: "12px 14px", marginBottom: 8, cursor: "pointer", color: "#F2F0EA",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>{label}</span>
        <span className="num" style={{ fontSize: 17, color: "#C81E1E" }}>${price}</span>
      </div>
      <div style={{ fontSize: 10.5, color: "#8A8A85", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{sub}</div>
    </button>
  );
}

// ---------- club guidelines one-pager ----------
function GuidelinesPage({ onBack }) {
  return (
    <div style={{ minHeight: "100vh", padding: "32px 24px", maxWidth: 640, margin: "0 auto" }}>
      <button
        onClick={onBack}
        className="oswald"
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#8A8A85", cursor: "pointer", fontSize: 13, letterSpacing: 1, marginBottom: 28, padding: 0, textTransform: "uppercase" }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="num" style={{ fontSize: 32, letterSpacing: 1, marginBottom: 4, borderBottom: "4px solid #C81E1E", paddingBottom: 16 }}>
        CLUB GUIDELINES
      </div>

      <div style={{ fontSize: 14, lineHeight: 1.8, color: "#D8D6CF", marginTop: 24, whiteSpace: "pre-wrap" }}>
        {AGREEMENT_TEXT}
      </div>

      <button
        onClick={() => window.print()}
        className="oswald"
        style={{ marginTop: 28, background: "#161615", color: "#F2F0EA", border: "1px solid #2A2A28", borderRadius: 4, padding: "12px 18px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
      >
        Print / Save as PDF
      </button>
    </div>
  );
}

// ---------- coach portal (post group sessions) ----------
// ---------- 4-week visual calendar (always visible, tap a day to act) ----------
function FourWeekCalendar({ markedDates, selectedDate, onSelect }) {
  const today = new Date("2026-08-25");
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // back up to Sunday

  const days = [];
  for (let i = 0; i < 28; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d);
  }

  function keyOf(d) {
    return d.toISOString().slice(0, 10);
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
        Next 4 Weeks — tap a day
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="oswald" style={{ textAlign: "center", fontSize: 10, color: "#5A5A56", textTransform: "uppercase" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {days.map((d, i) => {
          const key = keyOf(d);
          const isPast = d < today;
          const isToday = key === keyOf(today);
          const isSelected = key === selectedDate;
          const mark = markedDates.find((m) => m.date === key);
          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onSelect(key)}
              style={{
                aspectRatio: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                border: isSelected ? "2px solid #C81E1E" : isToday ? "1.5px solid #F2F0EA" : "1px solid #2A2A28",
                background: isPast ? "#0B0B0B" : mark ? "#1B0E0E" : "#111110",
                cursor: isPast ? "default" : "pointer",
                opacity: isPast ? 0.35 : 1,
                padding: 0,
              }}
            >
              <span className="oswald" style={{ fontSize: 10, color: "#F2F0EA" }}>{d.getDate()}</span>
              {mark && <div style={{ width: 5, height: 5, borderRadius: "50%", background: mark.color, marginTop: 2 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CoachPortal({ coach, groupSessions, oneOnOneRequests, members, qaThreads, recommendations, onAnswerQuestion, onAddCoachNote, onPostSession, onAddAvailability, onUpdateRate, onUpdateBio, suggestionOfWeek, onSetSuggestion, customDrills, onAddCustomDrill, onRemoveCustomDrill, onLogout }) {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [title, setTitle] = useState("");
  const [capacity, setCapacity] = useState("12");
  const [hostAsEvent, setHostAsEvent] = useState(true);
  const [rateInput, setRateInput] = useState(String(coach?.oneOnOneRate ?? 50));
  const [editingRate, setEditingRate] = useState(false);
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [noteDrafts, setNoteDrafts] = useState({});
  const [noteSentId, setNoteSentId] = useState(null);
  const [keywordDraft, setKeywordDraft] = useState("");
  const [localKeywords, setLocalKeywords] = useState(coach?.bioKeywords || []);
  const [editingSuggestion, setEditingSuggestion] = useState(false);
  const [suggestionDraft, setSuggestionDraft] = useState(suggestionOfWeek?.text || "");
  const [showDrillManager, setShowDrillManager] = useState(false);

  if (!coach) return null;

  const myUpcoming = groupSessions
    .filter((s) => s.coach === coach.name && new Date(s.date) >= new Date("2026-08-25"))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const myAvailability = (coach.schedule || [])
    .filter((a) => new Date(a.date) >= new Date("2026-08-25"))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const myLeads = oneOnOneRequests.filter((r) => r.coachName === coach.name);
  const onFloor = members.filter((m) => m.checkedInAt);

  function submit() {
    if (!date || !startTime || !endTime) return;
    if (hostAsEvent) {
      onPostSession({ date, time: startTime, endTime, title, capacity });
    } else {
      onAddAvailability({ date, startTime, endTime });
    }
    setShowForm(false);
    setDate(""); setStartTime(""); setEndTime(""); setTitle(""); setCapacity("12"); setHostAsEvent(true);
  }

  function saveRate() {
    const n = Number(rateInput);
    if (!n || n <= 0) return;
    onUpdateRate(n);
    setEditingRate(false);
  }

  function addKeyword() {
    const kw = keywordDraft.trim();
    if (!kw || localKeywords.length >= 8 || localKeywords.includes(kw)) return;
    const updated = [...localKeywords, kw];
    setLocalKeywords(updated);
    setKeywordDraft("");
    onUpdateBio(updated, undefined);
  }

  function removeKeyword(kw) {
    const updated = localKeywords.filter((k) => k !== kw);
    setLocalKeywords(updated);
    onUpdateBio(updated, undefined);
  }

  function handleCoachPhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpdateBio(localKeywords, reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ padding: "24px", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 3, color: "#8A8A85", textTransform: "uppercase" }}>Coach Access</div>
        <button onClick={onLogout} className="oswald" style={{ background: "none", border: "none", color: "#6B6B66", cursor: "pointer", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
          Sign Out
        </button>
      </div>

      <div className="num" style={{ fontSize: 30, marginBottom: 4 }}>
        WELCOME, {coach.name.toUpperCase()}
      </div>
      <div className="oswald" style={{ fontSize: 11, color: "#5A5A56", marginBottom: 20, lineHeight: 1.5 }}>
        📧 A confirmation is emailed to you whenever you post a session or availability, so you always have a record.
      </div>

      {/* bio: photo + keywords */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>My Bio</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <label style={{ cursor: "pointer", flexShrink: 0 }}>
            <input type="file" accept="image/*" onChange={handleCoachPhotoUpload} style={{ display: "none" }} />
            {coach.photo ? (
              <img src={coach.photo} alt={coach.name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid #C81E1E" }} />
            ) : (
              <div className="num" style={{ width: 56, height: 56, borderRadius: "50%", background: "#161615", border: "2px solid #2A2A28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#8A8A85" }}>
                {coach.name[0]}
              </div>
            )}
            <div className="oswald" style={{ fontSize: 8, color: "#6B6B66", textAlign: "center", marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Upload Photo</div>
          </label>
          <div style={{ flex: 1 }}>
            <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
              Keywords ({localKeywords.length}/8 — pick 5 to 8)
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {localKeywords.map((kw) => (
                <span key={kw} className="oswald" style={{ fontSize: 11, background: "#1B0E0E", border: "1px solid #C81E1E", color: "#F2F0EA", padding: "4px 9px", borderRadius: 12, display: "flex", alignItems: "center", gap: 5 }}>
                  {kw}
                  <button onClick={() => removeKeyword(kw)} style={{ background: "none", border: "none", color: "#C81E1E", cursor: "pointer", padding: 0, fontSize: 12, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            value={keywordDraft}
            onChange={(e) => setKeywordDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            placeholder="e.g. footwork, patient, high-energy"
            disabled={localKeywords.length >= 8}
            style={{ ...selectStyle, flex: 1, marginBottom: 0 }}
          />
          <button
            onClick={addKeyword}
            disabled={localKeywords.length >= 8 || !keywordDraft.trim()}
            className="oswald"
            style={{ background: keywordDraft.trim() && localKeywords.length < 8 ? "#C81E1E" : "#5A1414", color: "#fff", border: "none", borderRadius: 4, padding: "0 16px", fontWeight: 700, letterSpacing: 1, cursor: keywordDraft.trim() && localKeywords.length < 8 ? "pointer" : "not-allowed", fontSize: 11, textTransform: "uppercase" }}
          >
            Add
          </button>
        </div>
        {localKeywords.length > 0 && localKeywords.length < 5 && (
          <div className="oswald" style={{ fontSize: 10.5, color: "#8A8A85", marginTop: 8 }}>Add {5 - localKeywords.length} more to reach the 5-word minimum.</div>
        )}
      </div>

      {/* 1-on-1 rate */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 4 }}>Your 1-on-1 Rate</div>
          {editingRate ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="num" style={{ fontSize: 18 }}>$</span>
              <input value={rateInput} onChange={(e) => setRateInput(e.target.value.replace(/\D/g, ""))} style={{ ...selectStyle, width: 80 }} />
            </div>
          ) : (
            <div>
              <div className="num" style={{ fontSize: 22, color: "#C81E1E" }}>${coach.oneOnOneRate.toFixed(2)}</div>
              <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", marginTop: 2 }}>+ HST = ${withHST(coach.oneOnOneRate).toFixed(2)}</div>
            </div>
          )}
        </div>
        {editingRate ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={saveRate} className="oswald" style={{ background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "8px 12px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}>Save</button>
            <button onClick={() => { setEditingRate(false); setRateInput(String(coach.oneOnOneRate)); }} className="oswald" style={{ background: "none", border: "1px solid #2A2A28", color: "#8A8A85", borderRadius: 4, padding: "8px 12px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditingRate(true)} className="oswald" style={{ background: "none", border: "1px solid #2A2A28", color: "#F2F0EA", borderRadius: 4, padding: "8px 12px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}>Edit</button>
        )}
      </div>

      {/* suggestion of the week */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase" }}>📌 Suggestion of the Week</div>
          {!editingSuggestion && (
            <button onClick={() => { setEditingSuggestion(true); setSuggestionDraft(suggestionOfWeek?.text || ""); }} className="oswald" style={{ background: "none", border: "none", color: "#C81E1E", cursor: "pointer", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>
              {suggestionOfWeek ? "Edit" : "Set One"}
            </button>
          )}
        </div>
        {editingSuggestion ? (
          <div>
            <textarea
              value={suggestionDraft}
              onChange={(e) => setSuggestionDraft(e.target.value)}
              rows={2}
              placeholder="e.g. This week, focus on footwork before every sparring round."
              style={{ ...selectStyle, resize: "vertical", marginBottom: 8 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { onSetSuggestion(suggestionDraft); setEditingSuggestion(false); }} className="oswald" style={{ background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "8px 14px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}>Post</button>
              <button onClick={() => setEditingSuggestion(false)} className="oswald" style={{ background: "none", border: "1px solid #2A2A28", color: "#8A8A85", borderRadius: 4, padding: "8px 14px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}>Cancel</button>
            </div>
          </div>
        ) : suggestionOfWeek ? (
          <div>
            <div style={{ fontSize: 14, color: "#F2F0EA" }}>{suggestionOfWeek.text}</div>
            <div className="oswald" style={{ fontSize: 10.5, color: "#6B6B66", marginTop: 6 }}>— {suggestionOfWeek.setBy}, {formatMonthYear(suggestionOfWeek.setAt)}</div>
          </div>
        ) : (
          <div style={{ fontSize: 13, color: "#6B6B66" }}>Nothing posted yet — set one and it'll show on every member's Main Page.</div>
        )}
      </div>

      <button
        onClick={() => setShowDrillManager(true)}
        className="oswald"
        style={{ width: "100%", background: "none", border: "1px dashed #2A2A28", color: "#8A8A85", borderRadius: 6, padding: "12px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase", marginBottom: 16 }}
      >
        Manage Drills &amp; Exercises
      </button>
      {showDrillManager && (
        <DrillManagerModal customDrills={customDrills} onAdd={onAddCustomDrill} onRemove={onRemoveCustomDrill} onClose={() => setShowDrillManager(false)} />
      )}

      {/* schedule */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 14 }}>Your Schedule</div>

        <FourWeekCalendar
          markedDates={[
            ...myUpcoming.map((s) => ({ date: s.date, color: "#C81E1E" })),
            ...myAvailability.map((a) => ({ date: a.date, color: "#8A8A85" })),
          ]}
          selectedDate={date}
          onSelect={(d) => { setDate(d); setShowForm(true); }}
        />

        {myUpcoming.length === 0 && myAvailability.length === 0 && !showForm && (
          <div style={{ color: "#6B6B66", fontSize: 13, marginBottom: 10 }}>Nothing on your calendar yet — tap a day above to add something.</div>
        )}

        {myUpcoming.map((s) => (
          <div key={`e-${s.id}`} style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{s.title}</div>
              <span className="oswald" style={{ fontSize: 10, background: "#C81E1E", color: "#fff", padding: "2px 7px", borderRadius: 3, textTransform: "uppercase", height: "fit-content" }}>Group Event</span>
            </div>
            <div className="oswald" style={{ fontSize: 12, color: "#B8B6AF", marginTop: 4 }}>
              {formatDate(s.date)} &nbsp;·&nbsp; {s.time}–{s.endTime}
            </div>
            <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", marginTop: 4, textTransform: "uppercase" }}>
              {s.attendeeIds.length}/{s.capacity} spots reserved
            </div>
          </div>
        ))}

        {myAvailability.map((a) => (
          <div key={`a-${a.id}`} style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: "12px 14px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Available at the Club</div>
              <span className="oswald" style={{ fontSize: 10, background: "#161615", border: "1px solid #2A2A28", color: "#8A8A85", padding: "2px 7px", borderRadius: 3, textTransform: "uppercase", height: "fit-content" }}>Availability</span>
            </div>
            <div className="oswald" style={{ fontSize: 12, color: "#B8B6AF", marginTop: 4 }}>
              {formatDate(a.date)} &nbsp;·&nbsp; {a.startTime}–{a.endTime}
            </div>
          </div>
        ))}

        {showForm && (
          <div style={{ background: "#161615", border: "1px solid #2A2A28", borderRadius: 6, padding: 16, marginTop: myUpcoming.length || myAvailability.length ? 10 : 0 }}>
            <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
              Selected day: {date ? formatDate(date) : "tap a day above"}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button
                onClick={() => setHostAsEvent(true)}
                className="oswald"
                style={{ flex: 1, background: hostAsEvent ? "#C81E1E" : "#0B0B0B", color: "#fff", border: `1px solid ${hostAsEvent ? "#C81E1E" : "#2A2A28"}`, borderRadius: 4, padding: "10px", fontWeight: 600, letterSpacing: 0.5, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}
              >
                Create Next Coaching Event
              </button>
              <button
                onClick={() => setHostAsEvent(false)}
                className="oswald"
                style={{ flex: 1, background: !hostAsEvent ? "#C81E1E" : "#0B0B0B", color: "#fff", border: `1px solid ${!hostAsEvent ? "#C81E1E" : "#2A2A28"}`, borderRadius: 4, padding: "10px", fontWeight: 600, letterSpacing: 0.5, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}
              >
                Share When You'll Be On The Floor
              </button>
            </div>

            {hostAsEvent && (
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Session name (e.g. Cardio Sparring Circuit)" style={{ ...selectStyle, marginBottom: 10 }} />
            )}
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ ...selectStyle, flex: 1 }} />
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ ...selectStyle, flex: 1 }} />
            </div>
            {hostAsEvent && (
              <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Capacity" style={{ ...selectStyle, marginBottom: 14 }} />
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={submit}
                disabled={!date || !startTime || !endTime}
                className="oswald"
                style={{ flex: 1, background: date && startTime && endTime ? "#C81E1E" : "#5A1414", color: "#fff", border: "none", borderRadius: 4, padding: "11px", fontWeight: 700, letterSpacing: 1, cursor: date && startTime && endTime ? "pointer" : "not-allowed", fontSize: 12, textTransform: "uppercase" }}
              >
                {hostAsEvent ? "Post Event" : "Save Availability"}
              </button>
              <button onClick={() => { setShowForm(false); setDate(""); }} className="oswald" style={{ flex: 1, background: "none", border: "1px solid #2A2A28", color: "#8A8A85", borderRadius: 4, padding: "11px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}>
                Cancel
              </button>
            </div>
            <div className="oswald" style={{ fontSize: 10.5, color: "#5A5A56", marginTop: 10, lineHeight: 1.5 }}>
              {hostAsEvent
                ? `Posted as ${coach.name} — members will see this as the next coaching event on their Main Page and can reserve a spot.`
                : "This just marks you as at the club — it won't show as a bookable event to members."}
            </div>
          </div>
        )}
      </div>

      {/* dashboard: reservations + 1-on-1 leads */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 14 }}>Your Dashboard</div>

        <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Event Reservations</div>
        {myUpcoming.every((s) => s.attendeeIds.length === 0) ? (
          <div style={{ color: "#6B6B66", fontSize: 13, marginBottom: 16 }}>No one's reserved a spot yet.</div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            {myUpcoming.map((s) =>
              s.attendeeIds.map((aid) => {
                const m = members.find((x) => x.id === aid);
                if (!m) return null;
                return (
                  <div key={`${s.id}-${aid}`} style={{ display: "flex", justifyContent: "space-between", background: "#161615", borderRadius: 4, padding: "8px 10px", marginBottom: 6 }}>
                    <span style={{ fontSize: 13 }}>{m.first} {m.last} <span style={{ color: "#6B6B66" }}>reserved "{s.title}"</span></span>
                    <span className="oswald" style={{ fontSize: 12, color: "#6B6B66" }}>#{m.memberNo}</span>
                  </div>
                );
              })
            )}
          </div>
        )}

        <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>1-on-1 Leads</div>
        {myLeads.length === 0 ? (
          <div style={{ color: "#6B6B66", fontSize: 13 }}>No one's asked for a 1-on-1 with you yet.</div>
        ) : (
          myLeads.map((r) => (
            <div key={r.id} style={{ background: "#161615", borderRadius: 4, padding: "10px 12px", marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.memberName} <span style={{ color: "#6B6B66", fontWeight: 400 }}>#{r.memberNo}</span></div>
              <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", marginTop: 2 }}>Follow up by {r.contactMethod}: {r.contactInfo}</div>
            </div>
          ))
        )}
      </div>

      {/* on the floor — add notes/advice */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>On The Floor</div>
        {onFloor.length === 0 ? (
          <div style={{ color: "#6B6B66", fontSize: 13 }}>Nobody's checked in right now.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {onFloor.map((m) => (
              <div key={m.id} style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{m.first} {m.last} <span style={{ color: "#6B6B66", fontWeight: 400 }}>#{m.memberNo}</span></span>
                  <span className="oswald" style={{ fontSize: 10, background: "#1F8A3B", color: "#0B0B0B", padding: "2px 7px", borderRadius: 3, fontWeight: 700, textTransform: "uppercase" }}>On Floor</span>
                </div>
                {noteSentId === m.id ? (
                  <div className="oswald" style={{ fontSize: 11, color: "#7FCB8E" }}>Note saved ✓ — they'll see it on their Main Page.</div>
                ) : (
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      value={noteDrafts[m.id] || ""}
                      onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))}
                      placeholder="What do you notice? Any advice?"
                      style={{ ...selectStyle, flex: 1, marginBottom: 0 }}
                    />
                    <button
                      onClick={() => {
                        const text = noteDrafts[m.id];
                        if (text && text.trim()) {
                          onAddCoachNote(m.id, text);
                          setNoteDrafts((prev) => ({ ...prev, [m.id]: "" }));
                          setNoteSentId(m.id);
                          setTimeout(() => setNoteSentId(null), 3000);
                        }
                      }}
                      className="oswald"
                      style={{ background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "0 14px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Q&A — answer member questions */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>Q&amp;A</div>
        {!qaThreads || qaThreads.length === 0 ? (
          <div style={{ color: "#6B6B66", fontSize: 13 }}>No questions yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {qaThreads.map((q) => (
              <div key={q.id} style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{q.memberName} <span style={{ color: "#6B6B66", fontWeight: 400 }}>asked:</span></div>
                <div style={{ fontSize: 13, color: "#D8D6CF", marginTop: 2, marginBottom: 4 }}>{q.question}</div>
                <div className="oswald" style={{ fontSize: 10, color: "#5A5A56", marginBottom: 8 }}>{formatMonthYear(q.askedAt)}</div>
                {q.answer ? (
                  <div style={{ paddingTop: 8, borderTop: "1px solid #2A2A28" }}>
                    <div className="oswald" style={{ fontSize: 11, color: "#7FCB8E", textTransform: "uppercase", marginBottom: 2 }}>{q.answer.coachName} answered <span style={{ color: "#6B6B66", textTransform: "none", fontSize: 10 }}>({formatMonthYear(q.answer.answeredAt)})</span></div>
                    <div style={{ fontSize: 13, color: "#F2F0EA" }}>{q.answer.text}</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      value={answerDrafts[q.id] || ""}
                      onChange={(e) => setAnswerDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Type your answer..."
                      style={{ ...selectStyle, flex: 1, marginBottom: 0 }}
                    />
                    <button
                      onClick={() => {
                        const text = answerDrafts[q.id];
                        if (text && text.trim()) {
                          onAnswerQuestion(q.id, text);
                          setAnswerDrafts((prev) => ({ ...prev, [q.id]: "" }));
                        }
                      }}
                      className="oswald"
                      style={{ background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "0 14px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}
                    >
                      Answer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* member suggestions */}
      {recommendations && recommendations.length > 0 && (
        <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18 }}>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>Member Suggestions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recommendations.map((r) => (
              <div key={r.id} style={{ background: "#161615", borderRadius: 4, padding: "10px 12px" }}>
                <div style={{ fontSize: 13, color: "#D8D6CF" }}>{r.text}</div>
                <div className="oswald" style={{ fontSize: 10.5, color: "#6B6B66", marginTop: 4 }}>— {r.memberName}, {formatMonthYear(r.submittedAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- member self-service portal ----------
// ---------- monthly calendar: active days & rounds ----------
function MonthlyRoundsCalendar({ dailyLog }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0=Sun
  const todayDate = now.getDate();

  const days = [];
  for (let i = 0; i < firstWeekday; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const activeDays = Object.keys(dailyLog).filter((k) => k.startsWith(monthPrefix) && dailyLog[k] > 0).length;

  return (
    <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase" }}>{monthName}</div>
        <div className="num" style={{ fontSize: 15, color: "#C81E1E" }}>{activeDays} active day{activeDays === 1 ? "" : "s"}</div>
      </div>
      <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", marginBottom: 12 }}>
        Each dot = rounds completed that day
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="oswald" style={{ textAlign: "center", fontSize: 10, color: "#5A5A56", textTransform: "uppercase" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {days.map((d, i) => {
          if (d === null) return <div key={i} />;
          const key = `${monthPrefix}-${String(d).padStart(2, "0")}`;
          const rounds = dailyLog[key] || 0;
          const isToday = d === todayDate;
          return (
            <div
              key={i}
              title={rounds > 0 ? `${rounds} rounds` : "No activity"}
              style={{
                aspectRatio: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                border: isToday ? "1.5px solid #C81E1E" : "1px solid #2A2A28",
                background: rounds > 0 ? "#1B0E0E" : "#111110",
              }}
            >
              <span className="oswald" style={{ fontSize: 10, color: isToday ? "#F2F0EA" : "#6B6B66" }}>{d}</span>
              {rounds > 0 && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C81E1E", marginTop: 2 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- suggested drills based on the 5 core categories ----------
function NewspaperDrillVisual() {
  // Simple illustration of the newspaper vowel-circling drill — a page of text
  // with a handful of letters circled in red, evoking the actual exercise.
  const lines = [60, 70, 45, 65, 55, 68, 50];
  return (
    <svg viewBox="0 0 220 130" width="100%" style={{ maxWidth: 220, marginTop: 10, display: "block" }}>
      <rect x="2" y="2" width="216" height="126" rx="4" fill="#161615" stroke="#2A2A28" strokeWidth="2" />
      {lines.map((w, i) => (
        <rect key={i} x="14" y={14 + i * 15} width={w * 2.4} height="6" rx="2" fill="#3A3A37" />
      ))}
      {/* circled vowels scattered across the "text" */}
      <circle cx="40" cy="17" r="7" fill="none" stroke="#C81E1E" strokeWidth="2" />
      <circle cx="120" cy="32" r="7" fill="none" stroke="#C81E1E" strokeWidth="2" />
      <circle cx="70" cy="47" r="7" fill="none" stroke="#C81E1E" strokeWidth="2" />
      <circle cx="160" cy="62" r="7" fill="none" stroke="#C81E1E" strokeWidth="2" />
      <circle cx="95" cy="77" r="7" fill="none" stroke="#C81E1E" strokeWidth="2" />
      <circle cx="55" cy="92" r="7" fill="none" stroke="#C81E1E" strokeWidth="2" />
      <text x="14" y="118" fontFamily="'Oswald', sans-serif" fontSize="10" fill="#6B6B66" letterSpacing="1">
        CIRCLE EVERY A · E · I · O · U
      </text>
    </svg>
  );
}

// ---------- staff: manage drills & exercises ----------
function DrillManagerModal({ customDrills, onAdd, onRemove, onClose }) {
  const [drafts, setDrafts] = useState({});

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 30 }}>
      <div style={{ background: "#111110", border: "1px solid #2A2A28", borderRadius: 6, width: "100%", maxWidth: 500, maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid #2A2A28" }}>
          <div className="num" style={{ fontSize: 18 }}>MANAGE DRILLS</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8A8A85", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: "20px", overflowY: "auto" }}>
          {CORE_CATEGORIES.map((c) => (
            <div key={c.key} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{c.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span>
                <span className="oswald" style={{ fontSize: 11, color: "#6B6B66" }}>({c.animal})</span>
              </div>
              <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", marginBottom: 6 }}>Built-in: {c.drills.join(" · ")}</div>
              {(customDrills[c.key] || []).map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#161615", borderRadius: 4, padding: "8px 10px", marginBottom: 6 }}>
                  <span style={{ fontSize: 13 }}>{d}</span>
                  <button onClick={() => onRemove(c.key, i)} className="oswald" style={{ background: "none", border: "none", color: "#6B6B66", fontSize: 11, textTransform: "uppercase", cursor: "pointer" }}>Remove</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  value={drafts[c.key] || ""}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [c.key]: e.target.value }))}
                  placeholder="Add a new drill..."
                  style={{ ...selectStyle, flex: 1, marginBottom: 0 }}
                />
                <button
                  onClick={() => {
                    if (drafts[c.key]?.trim()) {
                      onAdd(c.key, drafts[c.key]);
                      setDrafts((prev) => ({ ...prev, [c.key]: "" }));
                    }
                  }}
                  className="oswald"
                  style={{ background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "0 14px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SuggestedDrills({ customDrills }) {
  const [activeIdx, setActiveIdx] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % CORE_CATEGORIES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const c = CORE_CATEGORIES[activeIdx];
  const allDrills = [...c.drills, ...((customDrills && customDrills[c.key]) || [])];

  return (
    <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
      <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 4 }}>
        Suggested Drills
      </div>
      <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", marginBottom: 14 }}>
        Based on the 5 core training categories — rotates every 8 sec
      </div>

      <div key={c.key} style={{ display: "flex", gap: 12, alignItems: "flex-start", border: `2px solid ${c.color}`, borderRadius: 6, padding: "12px 14px", background: "#111110" }}>
        <div
          style={{
            width: 44,
            height: 44,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            background: c.color,
            borderRadius: 4,
            border: "2px solid #0B0B0B",
            boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15)",
          }}
        >
          {c.emoji}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{c.name} <span style={{ color: "#6B6B66", fontWeight: 400 }}>({c.animal})</span></div>
          <div className="oswald" style={{ fontSize: 12, color: "#B8B6AF", marginTop: 3, lineHeight: 1.5 }}>
            {allDrills.join(" · ")}
          </div>
          {c.detail && (
            <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", marginTop: 6, lineHeight: 1.6, fontStyle: "italic" }}>
              {c.detail}
            </div>
          )}
          {c.key === "eyeFocus" && <NewspaperDrillVisual />}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
        {CORE_CATEGORIES.map((cat, i) => (
          <button
            key={cat.key}
            onClick={() => setActiveIdx(i)}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: i === activeIdx ? "#C81E1E" : "#2A2A28",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MemberPortal({ lang, member, groupSessions, members, coaches, qaThreads, coachNotes, suggestionOfWeek, customDrills, onCheckIn, onCheckOut, onUpdateProfile, onReserve, onRequestOneOnOne, onAskQuestion, onSubmitRecommendation, onSignAgreement, onUpdateAvatar, onGuidelines, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [first, setFirst] = useState(member?.first || "");
  const [last, setLast] = useState(member?.last || "");
  const [preferredName, setPreferredName] = useState(member?.preferredName || "");
  const [showReserve, setShowReserve] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showOneOnOne, setShowOneOnOne] = useState(false);
  const [selectedCoachName, setSelectedCoachName] = useState(null);
  const [oneOnOneMethod, setOneOnOneMethod] = useState("text");
  const [oneOnOneContact, setOneOnOneContact] = useState("");
  const [oneOnOneSent, setOneOnOneSent] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [tick, setTick] = useState(0);
  const [newQuestion, setNewQuestion] = useState("");
  const [questionSent, setQuestionSent] = useState(false);
  const [recommendationText, setRecommendationText] = useState("");
  const [recommendationSent, setRecommendationSent] = useState(false);
  const [showEventPopup, setShowEventPopup] = useState(true);

  React.useEffect(() => {
    if (!member?.checkedInAt) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [member?.checkedInAt]);

  if (!member) return null;

  const remaining = daysLeft(member.joined, member.tier);
  const status = statusFor(remaining);
  const visitCount = member.visits.filter(Boolean).length;
  const displayName = member.preferredName || member.first;
  const isGuest = isGuestTier(member.tier);

  let elapsedSeconds = 0;
  let roundsCompleted = 0;
  if (member.checkedInAt) {
    elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(member.checkedInAt).getTime()) / 1000));
    roundsCompleted = Math.floor(elapsedSeconds / 60 / ROUND_MINUTES);
  }
  const elapsedH = Math.floor(elapsedSeconds / 3600);
  const elapsedM = Math.floor((elapsedSeconds % 3600) / 60);
  const elapsedS = elapsedSeconds % 60;
  const elapsedLabel = elapsedH > 0
    ? `${elapsedH}h ${elapsedM}m ${elapsedS}s`
    : `${elapsedM}m ${elapsedS}s`;
  const roundSets = [];
  for (let i = 0; i < roundsCompleted; i += ROUND_SET_SIZE) {
    roundSets.push(Math.min(ROUND_SET_SIZE, roundsCompleted - i));
  }

  const upcoming = [...groupSessions]
    .filter((s) => new Date(s.date) >= new Date("2026-08-25"))
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  function saveProfile() {
    onUpdateProfile({ first, last, preferredName: preferredName.trim() || null });
    setEditing(false);
  }

  function handleAvatarFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpdateAvatar(reader.result);
    reader.readAsDataURL(file);
  }

  function handlePdfUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const doc = { id: Date.now(), name: file.name, dataUrl: reader.result, uploadedAt: new Date().toISOString() };
      onUpdateProfile({ documents: [...(member.documents || []), doc] });
    };
    reader.readAsDataURL(file);
  }

  function removeDocument(docId) {
    onUpdateProfile({ documents: (member.documents || []).filter((d) => d.id !== docId) });
  }

  function confirmSignature() {
    if (!agreed || !signature.trim()) return;
    onSignAgreement(signature.trim());
    setShowAgreement(false);
    setSignature("");
    setAgreed(false);
  }

  function submitOneOnOne() {
    if (!oneOnOneContact.trim() || !selectedCoachName) return;
    onRequestOneOnOne(selectedCoachName, oneOnOneMethod, oneOnOneContact.trim());
    setOneOnOneSent(true);
  }

  const showPopup = showEventPopup && upcoming && !upcoming.attendeeIds.includes(member.id);

  return (
    <div style={{ padding: "24px", maxWidth: 560, margin: "0 auto" }}>
      {showPopup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 30 }}>
          <div style={{ background: "#111110", border: "2px solid #C81E1E", borderRadius: 8, width: "100%", maxWidth: 360, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 34, marginBottom: 8 }}>🥊</div>
            <div className="num" style={{ fontSize: 20, marginBottom: 6 }}>UPCOMING EVENT</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{upcoming.title}</div>
            <div className="oswald" style={{ fontSize: 13, color: "#B8B6AF", marginBottom: 18 }}>
              {formatDate(upcoming.date)} &nbsp;·&nbsp; {upcoming.time}{upcoming.endTime ? `–${upcoming.endTime}` : ""} &nbsp;·&nbsp; Coach {upcoming.coach}
            </div>
            <button
              onClick={() => { onReserve(upcoming.id); setShowEventPopup(false); }}
              className="oswald"
              style={{ width: "100%", background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "13px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 13, textTransform: "uppercase", marginBottom: 10 }}
            >
              Reserve My Spot
            </button>
            <button
              onClick={() => setShowEventPopup(false)}
              className="oswald"
              style={{ width: "100%", background: "none", border: "none", color: "#8A8A85", cursor: "pointer", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 3, color: "#8A8A85", textTransform: "uppercase" }}>
          {t(lang, "memberNumber")} #{member.memberNo}
        </div>
        <button
          onClick={onLogout}
          className="oswald"
          style={{ background: "none", border: "none", color: "#6B6B66", cursor: "pointer", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}
        >
          {t(lang, "signOut")}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <label style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}>
            <input type="file" accept="image/*,.gif" onChange={handleAvatarFile} style={{ display: "none" }} />
            {member.avatar ? (
              <img src={member.avatar} alt="Profile" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid #C81E1E" }} />
            ) : (
              <div className="num" style={{ width: 56, height: 56, borderRadius: "50%", background: "#161615", border: "2px solid #2A2A28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#8A8A85" }}>
                {member.first[0]}
              </div>
            )}
            <div className="oswald" style={{ fontSize: 8, color: "#6B6B66", textAlign: "center", marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Change</div>
          </label>
          <div className="num" style={{ fontSize: 30 }}>
            {t(lang, "welcome")}, {displayName.toUpperCase()}
          </div>
        </div>
        {member.checkedInAt && (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div className="num" style={{ fontSize: 20, color: "#C81E1E" }}>{roundsCompleted} 🥊</div>
            <div className="oswald" style={{ fontSize: 10, color: "#8A8A85", textTransform: "uppercase", letterSpacing: 0.5 }}>rounds · {elapsedLabel}</div>
          </div>
        )}
      </div>
      <button
        onClick={onGuidelines}
        className="oswald"
        style={{ background: "none", border: "none", color: "#6B6B66", cursor: "pointer", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", padding: 0, marginBottom: 16, display: "block" }}
      >
        View Club Guidelines →
      </button>

      {/* check in / out */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", background: member.checkedInAt ? "#12190F" : "#111110" }}>
        <div>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 1, color: "#8A8A85", textTransform: "uppercase" }}>
            {member.checkedInAt ? `${t(lang, "onFloorSince")} ${formatTime(member.checkedInAt)}` : t(lang, "notCheckedIn")}
          </div>
        </div>
        {member.checkedInAt ? (
          <button onClick={() => onCheckOut(member.id)} className="oswald" style={{ display: "flex", alignItems: "center", gap: 6, background: "#1F8A3B", color: "#0B0B0B", border: "none", borderRadius: 4, padding: "10px 16px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}>
            <LogOut size={14} /> {t(lang, "checkOut")}
          </button>
        ) : (
          <button onClick={() => onCheckIn(member.id)} className="oswald" style={{ display: "flex", alignItems: "center", gap: 6, background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "10px 16px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}>
            <LogIn size={14} /> {t(lang, "checkIn")}
          </button>
        )}
      </div>

      {/* live round tracker */}
      {member.checkedInAt && (
        <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase" }}>{t(lang, "liveSession")}</div>
            <div className="num" style={{ fontSize: 15, color: "#C81E1E" }}>{elapsedLabel}</div>
          </div>
          <div className="oswald" style={{ fontSize: 12, color: "#B8B6AF", marginBottom: 14 }}>
            {roundsCompleted} {t(lang, "roundsCompleted")} <span style={{ color: "#6B6B66" }}>(3 min + 30 sec rest per round)</span>
          </div>
          {roundsCompleted === 0 ? (
            <div style={{ fontSize: 12, color: "#6B6B66" }}>Your first round dot lights up at {ROUND_MINUTES} minutes in.</div>
          ) : (
            <div>
              {roundSets.map((count, setIdx) => (
                <div key={setIdx} style={{ marginBottom: 8 }}>
                  <div className="oswald" style={{ fontSize: 10, color: "#5A5A56", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                    Set {setIdx + 1} {count < ROUND_SET_SIZE ? `(${count}/${ROUND_SET_SIZE})` : ""}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {Array.from({ length: ROUND_SET_SIZE }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: `1.5px solid ${i < count ? "#C81E1E" : "#3A3A37"}`,
                          background: i < count ? "#C81E1E" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="oswald" style={{ fontSize: 10.5, color: "#5A5A56", marginTop: 12, paddingTop: 12, borderTop: "1px solid #2A2A28", lineHeight: 1.6, fontStyle: "italic" }}>
            {t(lang, "pearsonsLaw")}
          </div>
        </div>
      )}

      {/* monthly calendar — active days & rounds this month */}
      {suggestionOfWeek && (
        <div style={{ border: "1px solid #C81E1E", borderRadius: 6, padding: 16, marginBottom: 16, background: "#1B0E0E" }}>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#C81E1E", textTransform: "uppercase", marginBottom: 6 }}>📌 {t(lang, "suggestionOfWeek")}</div>
          <div style={{ fontSize: 14, color: "#F2F0EA", lineHeight: 1.5 }}>{suggestionOfWeek.text}</div>
          <div className="oswald" style={{ fontSize: 10.5, color: "#8A8A85", marginTop: 6 }}>— {suggestionOfWeek.setBy}, {formatMonthYear(suggestionOfWeek.setAt)}</div>
        </div>
      )}

      <MonthlyRoundsCalendar dailyLog={member.dailyLog || {}} />

      {/* suggested drills based on the 5 core categories */}
      <SuggestedDrills customDrills={customDrills} />

      {/* profile */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase" }}>{t(lang, "myProfile")}</div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="oswald" style={{ background: "none", border: "none", color: "#C81E1E", cursor: "pointer", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
              {t(lang, "edit")}
            </button>
          )}
        </div>
        {editing ? (
          <div>
            <input value={first} onChange={(e) => setFirst(e.target.value)} style={{ ...portalInput, marginBottom: 8 }} placeholder="First name" />
            <input value={last} onChange={(e) => setLast(e.target.value)} style={{ ...portalInput, marginBottom: 8 }} placeholder="Last name" />
            <input value={preferredName} onChange={(e) => setPreferredName(e.target.value)} style={{ ...portalInput, marginBottom: 12 }} placeholder="Preferred name / what should we call you? (optional)" />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveProfile} className="oswald" style={{ flex: 1, background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "10px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}>{t(lang, "save")}</button>
              <button onClick={() => { setEditing(false); setFirst(member.first); setLast(member.last); setPreferredName(member.preferredName || ""); }} className="oswald" style={{ flex: 1, background: "none", border: "1px solid #2A2A28", color: "#8A8A85", borderRadius: 4, padding: "10px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}>{t(lang, "cancel")}</button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{member.first} {member.last}</div>
            {member.preferredName && (
              <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", marginTop: 2 }}>Goes by "{member.preferredName}"</div>
            )}
          </div>
        )}
      </div>

      {/* documents — PDF uploads */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>
          {t(lang, "myDocuments")}
        </div>
        {(member.documents || []).length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {member.documents.map((doc) => (
              <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#161615", border: "1px solid #2A2A28", borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</div>
                  <div className="oswald" style={{ fontSize: 10.5, color: "#6B6B66", marginTop: 2 }}>Uploaded {formatDate(doc.uploadedAt)}</div>
                </div>
                <div style={{ display: "flex", gap: 10, flexShrink: 0, marginLeft: 10 }}>
                  <a href={doc.dataUrl} target="_blank" rel="noopener noreferrer" className="oswald" style={{ color: "#C81E1E", fontSize: 11, textTransform: "uppercase", textDecoration: "none" }}>{t(lang, "view")}</a>
                  <button onClick={() => removeDocument(doc.id)} className="oswald" style={{ background: "none", border: "none", color: "#6B6B66", fontSize: 11, textTransform: "uppercase", cursor: "pointer" }}>{t(lang, "remove")}</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <label style={{ display: "block" }}>
          <input type="file" accept="application/pdf,.pdf" onChange={handlePdfUpload} style={{ display: "none" }} />
          <span
            className="oswald"
            style={{ display: "block", textAlign: "center", background: "none", border: "1px dashed #2A2A28", color: "#8A8A85", borderRadius: 4, padding: "12px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
          >
            {t(lang, "uploadPdf")}
          </span>
        </label>
        <div className="oswald" style={{ fontSize: 10, color: "#5A5A56", marginTop: 8, lineHeight: 1.5 }}>
          Kept on your profile for this session only — stored in your browser, not on a server.
        </div>
      </div>

      {/* financial agreement & safety guidelines — signed record */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>
          Financial Agreement &amp; Safety Guidelines
        </div>
        {member.agreement ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ color: "#1F8A3B", fontSize: 14, fontWeight: 700 }}>✓ Signed</span>
              <span className="oswald" style={{ fontSize: 12, color: "#8A8A85" }}>
                by {member.agreement.signedName} on {formatDate(member.agreement.signedAt)}
              </span>
            </div>
            <button
              onClick={() => setShowAgreement(true)}
              className="oswald"
              style={{ background: "none", border: "1px solid #2A2A28", color: "#F2F0EA", borderRadius: 4, padding: "9px 14px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
            >
              View / Re-print Document
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 13, color: "#B8B6AF", marginBottom: 12, lineHeight: 1.6 }}>
              You haven't signed the club's financial agreement and safety guidelines yet. Please review and sign so you have it on file in your profile.
            </div>
            <button
              onClick={() => setShowAgreement(true)}
              className="oswald"
              style={{ width: "100%", background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "11px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
            >
              Review &amp; Sign
            </button>
          </div>
        )}
      </div>

      {/* membership */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>
          {isGuest ? t(lang, "myDayPass") : t(lang, "myMembership")}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: isGuest ? 0 : 14 }}>
          <Fact label={t(lang, "plan")} value={member.tier} />
          <Fact label={t(lang, "status")} value={status.label} color={status.color} />
          {isGuest ? (
            member.tier === "Day Pass Bundle" && (
              <Fact label="Passes Remaining" value={member.passesRemaining} />
            )
          ) : (
            <>
              <Fact label={t(lang, "nextFeeDue")} value={`${formatDate(member.nextFeeDate)}`} />
              <Fact label={t(lang, "amountDue")} value={`$${member.nextFeeAmount}`} />
            </>
          )}
        </div>
        {!isGuest && (
          <div style={{ borderTop: "1px solid #2A2A28", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="oswald" style={{ fontSize: 12, color: "#8A8A85", textTransform: "uppercase", letterSpacing: 1 }}>
              {member.balance < 0 ? t(lang, "referralCredit") : t(lang, "balanceOwed")}
            </span>
            <span className="num" style={{ fontSize: 20, color: member.balance > 0 ? "#C81E1E" : "#1F8A3B" }}>
              {member.balance > 0 ? `$${member.balance}` : member.balance < 0 ? `$${Math.abs(member.balance)} credit` : t(lang, "paidUp")}
            </span>
          </div>
        )}
        {!isGuest && member.balance > 0 && (
          <div className="oswald" style={{ fontSize: 11.5, color: "#C81E1E", marginTop: 10, paddingTop: 10, borderTop: "1px solid #2A2A28", lineHeight: 1.5 }}>
            Please come to the front desk to process your payment.
          </div>
        )}
      </div>

      {/* invoices */}
      {(member.invoices || []).length > 0 && (
        <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>
            Invoices — Member #{member.memberNo}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {member.invoices.map((inv) => (
              <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#161615", border: "1px solid #2A2A28", borderRadius: 6, padding: "10px 12px" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.description}</div>
                  <div className="oswald" style={{ fontSize: 10.5, color: "#6B6B66", marginTop: 2 }}>{formatDate(inv.issuedAt)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="num" style={{ fontSize: 16, color: inv.status === "paid" ? "#1F8A3B" : "#C81E1E" }}>${inv.amount}</div>
                  <div className="oswald" style={{ fontSize: 10, color: inv.status === "paid" ? "#1F8A3B" : "#C81E1E", textTransform: "uppercase" }}>{inv.status === "paid" ? "Paid" : "Unpaid"}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => window.print()}
            className="oswald"
            style={{ width: "100%", marginTop: 12, background: "#161615", color: "#F2F0EA", border: "1px solid #2A2A28", borderRadius: 4, padding: "11px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
          >
            Print / Save as PDF
          </button>
        </div>
      )}

      {/* refer a friend */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 8 }}>
          {t(lang, "referFriend")}
        </div>
        <div style={{ fontSize: 13, color: "#B8B6AF", lineHeight: 1.6, marginBottom: 10 }}>
          {t(lang, "referFriendDesc")}
        </div>
        <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase" }}>{t(lang, "yourCodeToShare")}</div>
        <div className="num" style={{ fontSize: 24, color: "#C81E1E" }}>#{member.memberNo}</div>
      </div>

      {/* visits */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginBottom: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 10 }}>
          {t(lang, "myPunchCard")} ({visitCount} rounds logged)
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {member.visits.map((v, i) => (
            <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${v ? "#C81E1E" : "#3A3A37"}`, background: v ? "#C81E1E" : "transparent" }} />
          ))}
        </div>
      </div>

      {/* group session — hidden entirely if nothing's posted */}
      {upcoming && (
        <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18 }}>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>{t(lang, "nextCoachingEvent")}</div>
          {(() => {
            const isReserved = upcoming.attendeeIds.includes(member.id);
            const shareLink = `scopesboxing.club/join/${upcoming.id}?ref=${member.memberNo}`;
            return (
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{upcoming.title}</div>
                <div className="oswald" style={{ fontSize: 13, color: "#B8B6AF", marginBottom: 10 }}>
                  {formatDate(upcoming.date)} &nbsp;·&nbsp; {upcoming.time}{upcoming.endTime ? `–${upcoming.endTime}` : ""} &nbsp;·&nbsp; Coach {upcoming.coach}
                </div>
                <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                  Attending ({upcoming.attendeeIds.length}/{upcoming.capacity})
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {upcoming.attendeeIds.map((aid) => {
                    const a = members.find((m) => m.id === aid);
                    if (!a) return null;
                    return (
                      <span key={aid} className="oswald" style={{ fontSize: 12, background: "#1B1B19", border: "1px solid #2A2A28", padding: "4px 9px", borderRadius: 3 }}>
                        {a.first} {a.last[0]}.
                      </span>
                    );
                  })}
                </div>

                {isReserved ? (
                  <div style={{ background: "#12190F", border: "1px solid #274A1F", borderRadius: 6, padding: "12px 14px", marginBottom: 14 }}>
                    <div className="oswald" style={{ fontSize: 12, color: "#7FCB8E", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Spot Saved ✓</div>
                    <div style={{ fontSize: 13, color: "#B8B6AF" }}>${DEPOSIT} deposit paid — ${MEMBER_PRICE - DEPOSIT} due at check-in (${MEMBER_PRICE} total, member rate)</div>
                  </div>
                ) : showReserve ? (
                  <div style={{ background: "#161615", border: "1px solid #2A2A28", borderRadius: 6, padding: "14px", marginBottom: 14 }}>
                    <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Confirm Your Spot</div>
                    <div style={{ fontSize: 13, color: "#B8B6AF", marginBottom: 12, lineHeight: 1.6 }}>
                      Member rate: <strong style={{ color: "#F2F0EA" }}>${MEMBER_PRICE}</strong> (${DOOR_PRICE} at the door for non-members)<br />
                      Pay <strong style={{ color: "#F2F0EA" }}>${DEPOSIT}</strong> now to hold your spot — the remaining ${MEMBER_PRICE - DEPOSIT} is due when you check in.
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => { onReserve(upcoming.id); setShowReserve(false); }}
                        className="oswald"
                        style={{ flex: 1, background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "12px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
                      >
                        Confirm — ${DEPOSIT}
                      </button>
                      <button
                        onClick={() => setShowReserve(false)}
                        className="oswald"
                        style={{ flex: 1, background: "none", border: "1px solid #2A2A28", color: "#8A8A85", borderRadius: 4, padding: "12px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowReserve(true)}
                    className="oswald"
                    style={{ width: "100%", background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "12px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 13, textTransform: "uppercase", marginBottom: 14 }}
                  >
                    Interested? Save a Spot — ${DEPOSIT}
                  </button>
                )}

                {showShare ? (
                  <div style={{ background: "#161615", border: "1px solid #2A2A28", borderRadius: 6, padding: "14px" }}>
                    <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Share With a Friend</div>
                    <div style={{ fontSize: 13, color: "#B8B6AF", marginBottom: 10, lineHeight: 1.6 }}>
                      Your guest pays just <strong style={{ color: "#F2F0EA" }}>$10</strong> through your link — reference your code, code #{member.memberNo} — instead of ${DOOR_PRICE} walking in at the door.
                    </div>
                    <div className="oswald" style={{ fontSize: 12, color: "#C81E1E", background: "#0B0B0B", border: "1px solid #2A2A28", borderRadius: 4, padding: "10px 12px", wordBreak: "break-all" }}>
                      {shareLink}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowShare(true)}
                    className="oswald"
                    style={{ width: "100%", background: "none", border: "1px solid #2A2A28", color: "#F2F0EA", borderRadius: 4, padding: "11px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
                  >
                    Share Link With a Non-Member
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* 1-on-1 coaching interest */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginTop: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>
          1-on-1 Coaching
        </div>

        {oneOnOneSent ? (
          <div style={{ background: "#12190F", border: "1px solid #274A1F", borderRadius: 6, padding: "12px 14px" }}>
            <div className="oswald" style={{ fontSize: 12, color: "#7FCB8E", letterSpacing: 1, textTransform: "uppercase" }}>You're On the Waiting List ✓</div>
            <div style={{ fontSize: 13, color: "#B8B6AF", marginTop: 4, lineHeight: 1.6 }}>
              {selectedCoachName} will personally follow up with you by {oneOnOneMethod} at {oneOnOneContact} within the upcoming week.
            </div>
            <div className="oswald" style={{ fontSize: 11, color: "#5A5A56", marginTop: 8 }}>
              📧 A confirmation has also been emailed to you.
            </div>
          </div>
        ) : showOneOnOne && selectedCoachName ? (
          <div>
            <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
              How should {selectedCoachName} follow up?
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <button
                onClick={() => setOneOnOneMethod("text")}
                className="oswald"
                style={{ flex: 1, background: oneOnOneMethod === "text" ? "#C81E1E" : "#161615", color: "#fff", border: `1px solid ${oneOnOneMethod === "text" ? "#C81E1E" : "#2A2A28"}`, borderRadius: 4, padding: "10px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
              >
                Text
              </button>
              <button
                onClick={() => setOneOnOneMethod("email")}
                className="oswald"
                style={{ flex: 1, background: oneOnOneMethod === "email" ? "#C81E1E" : "#161615", color: "#fff", border: `1px solid ${oneOnOneMethod === "email" ? "#C81E1E" : "#2A2A28"}`, borderRadius: 4, padding: "10px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
              >
                Email
              </button>
            </div>
            <input
              value={oneOnOneContact}
              onChange={(e) => setOneOnOneContact(e.target.value)}
              placeholder={oneOnOneMethod === "text" ? "Phone number" : "Email address"}
              style={{ ...portalInput, marginBottom: 12 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={submitOneOnOne}
                disabled={!oneOnOneContact.trim()}
                className="oswald"
                style={{ flex: 1, background: oneOnOneContact.trim() ? "#C81E1E" : "#5A1414", color: "#fff", border: "none", borderRadius: 4, padding: "12px", fontWeight: 700, letterSpacing: 1, cursor: oneOnOneContact.trim() ? "pointer" : "not-allowed", fontSize: 12, textTransform: "uppercase" }}
              >
                Send Request
              </button>
              <button
                onClick={() => setSelectedCoachName(null)}
                className="oswald"
                style={{ background: "none", border: "1px solid #2A2A28", color: "#8A8A85", borderRadius: 4, padding: "12px 14px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
              >
                Back
              </button>
            </div>
          </div>
        ) : showOneOnOne ? (
          <div>
            <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
              Pick a coach
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {coaches.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCoachName(c.name)}
                  className="oswald"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#161615", border: "1px solid #2A2A28", borderRadius: 6, padding: "12px 14px", cursor: "pointer", color: "#F2F0EA", textAlign: "left" }}
                >
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                  <span style={{ textAlign: "right" }}>
                    <span className="num" style={{ fontSize: 16, color: "#C81E1E", display: "block" }}>${c.oneOnOneRate.toFixed(2)}</span>
                    <span style={{ fontSize: 10, color: "#6B6B66", display: "block", marginTop: 2 }}>+ HST = ${withHST(c.oneOnOneRate).toFixed(2)}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowOneOnOne(true)}
            className="oswald"
            style={{ width: "100%", background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "12px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 13, textTransform: "uppercase" }}
          >
            I'm Interested in a 1-on-1 Session
          </button>
        )}
      </div>

      {/* coach notes for this member */}
      {coachNotes && coachNotes.length > 0 && (
        <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginTop: 16 }}>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>
            Coach Notes For You
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {coachNotes.map((n) => (
              <div key={n.id} style={{ background: "#161615", border: "1px solid #2A2A28", borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ fontSize: 13, color: "#F2F0EA", lineHeight: 1.5 }}>{n.note}</div>
                <div className="oswald" style={{ fontSize: 10.5, color: "#6B6B66", marginTop: 6 }}>— {n.coachName}, {formatMonthYear(n.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Q&A */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginTop: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>
          Q&amp;A
        </div>
        {questionSent ? (
          <div style={{ background: "#12190F", border: "1px solid #274A1F", borderRadius: 6, padding: "10px 12px", marginBottom: 14 }}>
            <div className="oswald" style={{ fontSize: 12, color: "#7FCB8E" }}>Question sent ✓ — a coach will answer here soon.</div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask a coach anything..."
              style={{ ...portalInput, marginBottom: 0, flex: 1 }}
            />
            <button
              onClick={() => { if (newQuestion.trim()) { onAskQuestion(newQuestion); setNewQuestion(""); setQuestionSent(true); setTimeout(() => setQuestionSent(false), 4000); } }}
              disabled={!newQuestion.trim()}
              className="oswald"
              style={{ background: newQuestion.trim() ? "#C81E1E" : "#5A1414", color: "#fff", border: "none", borderRadius: 4, padding: "0 16px", fontWeight: 700, letterSpacing: 1, cursor: newQuestion.trim() ? "pointer" : "not-allowed", fontSize: 12, textTransform: "uppercase" }}
            >
              Ask
            </button>
          </div>
        )}

        {qaThreads && qaThreads.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {qaThreads.map((q) => (
              <div key={q.id} style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{q.memberName} <span style={{ color: "#6B6B66", fontWeight: 400 }}>asked:</span></div>
                <div style={{ fontSize: 13, color: "#D8D6CF", marginTop: 2 }}>{q.question}</div>
                <div className="oswald" style={{ fontSize: 10, color: "#5A5A56", marginTop: 2 }}>{formatMonthYear(q.askedAt)}</div>
                {q.answer ? (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #2A2A28" }}>
                    <div className="oswald" style={{ fontSize: 11, color: "#7FCB8E", textTransform: "uppercase", marginBottom: 2 }}>{q.answer.coachName} answered <span style={{ color: "#6B6B66", textTransform: "none", fontSize: 10 }}>({formatMonthYear(q.answer.answeredAt)})</span></div>
                    <div style={{ fontSize: 13, color: "#F2F0EA" }}>{q.answer.text}</div>
                  </div>
                ) : (
                  <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", marginTop: 6, textTransform: "uppercase" }}>Awaiting an answer...</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#6B6B66", fontSize: 13 }}>No questions yet — be the first to ask.</div>
        )}
      </div>

      {/* suggestion box */}
      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 18, marginTop: 16 }}>
        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 12 }}>
          Suggestion Box
        </div>
        {recommendationSent ? (
          <div style={{ background: "#12190F", border: "1px solid #274A1F", borderRadius: 6, padding: "10px 12px" }}>
            <div className="oswald" style={{ fontSize: 12, color: "#7FCB8E" }}>Thanks — sent to the team ✓</div>
          </div>
        ) : (
          <div>
            <textarea
              value={recommendationText}
              onChange={(e) => setRecommendationText(e.target.value)}
              placeholder="Got an idea to make the club better? Tell us."
              rows={3}
              style={{ ...portalInput, resize: "vertical", fontFamily: "'Archivo', sans-serif" }}
            />
            <button
              onClick={() => { if (recommendationText.trim()) { onSubmitRecommendation(recommendationText); setRecommendationText(""); setRecommendationSent(true); setTimeout(() => setRecommendationSent(false), 4000); } }}
              disabled={!recommendationText.trim()}
              className="oswald"
              style={{ width: "100%", background: recommendationText.trim() ? "#C81E1E" : "#5A1414", color: "#fff", border: "none", borderRadius: 4, padding: "11px", fontWeight: 700, letterSpacing: 1, cursor: recommendationText.trim() ? "pointer" : "not-allowed", fontSize: 12, textTransform: "uppercase" }}
            >
              Send Suggestion
            </button>
          </div>
        )}
      </div>

      {showAgreement && (
        <AgreementModal
          existing={member.agreement}
          signature={signature}
          setSignature={setSignature}
          agreed={agreed}
          setAgreed={setAgreed}
          onConfirm={confirmSignature}
          onClose={() => setShowAgreement(false)}
        />
      )}
    </div>
  );
}

const AGREEMENT_TEXT = `Scopes Boxing Club — Financial Agreement & Safety Guidelines

FINANCIAL AGREEMENT
By signing below, you agree to pay all membership fees, day-pass fees, and any outstanding balance on the schedule presented at sign-up. Rental and Monthly memberships run on a 30-day term; Annual memberships run 365 days. Fees do not carry over as refunds for unused time.

SAFETY & ASSUMPTION OF RISK
Boxing and combat training carry inherent physical risk, and Scopes Boxing Club is not responsible for injuries sustained while training, provided reasonable safety protocols were followed. That said, safety is our top priority. Sparring at this gym is conducted strictly for training purposes, under coach supervision, and headshots are never permitted — which keeps real risk to a minimum.

There is zero tolerance for anyone who comes in looking to hurt another person rather than train. That is not why people come to a boxing gym, and it will not be allowed here. Anyone who violates this will be removed from the club.

By typing your name below, you confirm you have read and agree to this Financial Agreement & Safety Guidelines.`;

function AgreementModal({ existing, signature, setSignature, agreed, setAgreed, onConfirm, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 20 }}>
      <div style={{ background: "#111110", border: "1px solid #2A2A28", borderRadius: 6, width: "100%", maxWidth: 480, maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid #2A2A28" }}>
          <div className="num" style={{ fontSize: 18 }}>AGREEMENT</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8A8A85", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: "18px 20px", overflowY: "auto", fontSize: 13, lineHeight: 1.7, color: "#D8D6CF", whiteSpace: "pre-wrap" }}>
          {AGREEMENT_TEXT}
        </div>
        {!existing && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid #2A2A28" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
              <span className="oswald" style={{ fontSize: 12, color: "#B8B6AF" }}>I have read and agree to the Financial Agreement &amp; Safety Guidelines above.</span>
            </label>
            <input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Type your full name to sign"
              style={{ ...portalInput, marginBottom: 12 }}
            />
            <button
              onClick={onConfirm}
              disabled={!agreed || !signature.trim()}
              className="oswald"
              style={{ width: "100%", background: agreed && signature.trim() ? "#C81E1E" : "#5A1414", color: "#fff", border: "none", borderRadius: 4, padding: "12px", fontWeight: 700, letterSpacing: 1, cursor: agreed && signature.trim() ? "pointer" : "not-allowed", fontSize: 13, textTransform: "uppercase" }}
            >
              Sign &amp; Save to My Profile
            </button>
          </div>
        )}
        {existing && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid #2A2A28" }}>
            <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", marginBottom: 12 }}>
              Signed by {existing.signedName} on {formatDate(existing.signedAt)}
            </div>
            <button
              onClick={() => window.print()}
              className="oswald"
              style={{ width: "100%", background: "#161615", color: "#F2F0EA", border: "1px solid #2A2A28", borderRadius: 4, padding: "12px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
            >
              Print / Save as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const portalInput = {
  width: "100%",
  background: "#161615",
  border: "1px solid #2A2A28",
  borderRadius: 4,
  padding: "10px 12px",
  color: "#F2F0EA",
  fontFamily: "'Archivo', sans-serif",
  fontSize: 14,
  outline: "none",
};

// ---------- header bell/stripe ----------
function TopBar() {
  return (
    <div style={{ borderBottom: "6px solid #C81E1E", background: "#0B0B0B", padding: "28px 24px 20px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <PivotLogo size={30} />
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", marginTop: 4, textTransform: "uppercase" }}>
            Platform for Scopes Boxing Club
          </div>
          <div className="oswald" style={{ fontSize: 12, letterSpacing: 4, color: "#8A8A85", marginTop: 6, textTransform: "uppercase" }}>
            Member Roster &amp; Coaching Ledger
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- roster ----------
function RosterView({ members, totalMembers, activeCount, dailyVisits, returningRatio, query, setQuery, onSelect, onShowCoaches, onShowCheckin, onShowInterest, onShowDatabase, onAdd, onExit, suggestionOfWeek, onSetSuggestion, customDrills, onAddCustomDrill, onRemoveCustomDrill }) {
  const [editingSuggestion, setEditingSuggestion] = useState(false);
  const [suggestionDraft, setSuggestionDraft] = useState(suggestionOfWeek?.text || "");
  const [showDrillManager, setShowDrillManager] = useState(false);
  return (
    <div>
      <TopBar />
      <div style={{ padding: "10px 24px 0", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onExit}
          className="oswald"
          style={{ background: "none", border: "none", color: "#6B6B66", cursor: "pointer", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}
        >
          ⤺ Exit Staff View
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#2A2A28", margin: "0 24px", marginTop: -1 }}>
        <StatBlock label="Fighters on Roster" value={totalMembers} />
        <StatBlock label="Active Memberships" value={activeCount} accent />
        <StatBlock label="Daily Visits" value={dailyVisits} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 1, background: "#2A2A28", margin: "1px 24px 0", marginTop: 1 }}>
        <StatBlock label="Returning Ratio" value={`${returningRatio}%`} accent={returningRatio >= 50} />
      </div>

      <div style={{ padding: "20px 24px 0", maxWidth: 880, margin: "0 auto" }}>
        <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 16, marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase" }}>📌 Suggestion of the Week</div>
            {!editingSuggestion && (
              <button onClick={() => { setEditingSuggestion(true); setSuggestionDraft(suggestionOfWeek?.text || ""); }} className="oswald" style={{ background: "none", border: "none", color: "#C81E1E", cursor: "pointer", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>
                {suggestionOfWeek ? "Edit" : "Set One"}
              </button>
            )}
          </div>
          {editingSuggestion ? (
            <div>
              <textarea
                value={suggestionDraft}
                onChange={(e) => setSuggestionDraft(e.target.value)}
                rows={2}
                placeholder="e.g. This week, focus on footwork before every sparring round."
                style={{ width: "100%", background: "#161615", border: "1px solid #2A2A28", borderRadius: 4, padding: "10px 12px", color: "#F2F0EA", fontFamily: "'Archivo', sans-serif", fontSize: 13, outline: "none", resize: "vertical", marginBottom: 8 }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { onSetSuggestion(suggestionDraft); setEditingSuggestion(false); }} className="oswald" style={{ background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "8px 14px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}>Post</button>
                <button onClick={() => setEditingSuggestion(false)} className="oswald" style={{ background: "none", border: "1px solid #2A2A28", color: "#8A8A85", borderRadius: 4, padding: "8px 14px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 11, textTransform: "uppercase" }}>Cancel</button>
              </div>
            </div>
          ) : suggestionOfWeek ? (
            <div>
              <div style={{ fontSize: 14, color: "#F2F0EA" }}>{suggestionOfWeek.text}</div>
              <div className="oswald" style={{ fontSize: 10.5, color: "#6B6B66", marginTop: 6 }}>— {suggestionOfWeek.setBy}, {formatMonthYear(suggestionOfWeek.setAt)}</div>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#6B6B66" }}>Nothing posted yet — set one and it'll show on every member's Main Page.</div>
          )}
        </div>

        <button
          onClick={() => setShowDrillManager(true)}
          className="oswald"
          style={{ width: "100%", background: "none", border: "1px dashed #2A2A28", color: "#8A8A85", borderRadius: 6, padding: "12px", fontWeight: 600, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase", margin: "12px 0 8px" }}
        >
          Manage Drills &amp; Exercises
        </button>
      </div>

      {showDrillManager && (
        <DrillManagerModal customDrills={customDrills} onAdd={onAddCustomDrill} onRemove={onRemoveCustomDrill} onClose={() => setShowDrillManager(false)} />
      )}

      <div style={{ padding: "24px", maxWidth: 880, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#6B6B66" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              style={{
                width: "100%",
                background: "#161615",
                border: "1px solid #2A2A28",
                borderRadius: 4,
                padding: "10px 12px 10px 36px",
                color: "#F2F0EA",
                fontFamily: "'Archivo', sans-serif",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={onShowCheckin}
            className="oswald"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#161615",
              color: "#F2F0EA",
              border: "1px solid #2A2A28",
              borderRadius: 4,
              padding: "11px 16px",
              fontWeight: 600,
              letterSpacing: 1,
              cursor: "pointer",
              fontSize: 13,
              textTransform: "uppercase",
            }}
          >
            <LogIn size={16} /> Check-In Kiosk
          </button>
          <button
            onClick={onShowCoaches}
            className="oswald"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#161615",
              color: "#F2F0EA",
              border: "1px solid #2A2A28",
              borderRadius: 4,
              padding: "11px 16px",
              fontWeight: 600,
              letterSpacing: 1,
              cursor: "pointer",
              fontSize: 13,
              textTransform: "uppercase",
            }}
          >
            <Clock size={16} /> Coaching Ledger
          </button>
          <button
            onClick={onShowInterest}
            className="oswald"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#161615",
              color: "#F2F0EA",
              border: "1px solid #2A2A28",
              borderRadius: 4,
              padding: "11px 16px",
              fontWeight: 600,
              letterSpacing: 1,
              cursor: "pointer",
              fontSize: 13,
              textTransform: "uppercase",
            }}
          >
            <Users size={16} /> Event Interest
          </button>
          <button
            onClick={onShowDatabase}
            className="oswald"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#161615",
              color: "#F2F0EA",
              border: "1px solid #2A2A28",
              borderRadius: 4,
              padding: "11px 16px",
              fontWeight: 600,
              letterSpacing: 1,
              cursor: "pointer",
              fontSize: 13,
              textTransform: "uppercase",
            }}
          >
            <Search size={16} /> Full Database
          </button>
          <button
            onClick={onAdd}
            className="oswald"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#C81E1E",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "11px 16px",
              fontWeight: 600,
              letterSpacing: 1,
              cursor: "pointer",
              fontSize: 13,
              textTransform: "uppercase",
            }}
          >
            <Plus size={16} /> Add Member
          </button>
        </div>

        <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#6B6B66", padding: "0 4px 10px", textTransform: "uppercase", borderBottom: "1px solid #2A2A28" }}>
          Fighter (Last, First) &nbsp;·&nbsp; sorted by last name
        </div>

        {members.length === 0 && (
          <div style={{ padding: "40px 4px", color: "#6B6B66", fontStyle: "italic" }}>No fighter matches that name. Try another search.</div>
        )}

        {members.map((m) => {
          const remaining = daysLeft(m.joined, m.tier);
          const status = statusFor(remaining);
          return (
            <div
              key={m.id}
              onClick={() => onSelect(m.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 4px",
                borderBottom: "1px solid #1D1D1B",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  className="num"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "#161615",
                    border: `2px solid ${status.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    color: status.color,
                  }}
                >
                  {m.last[0]}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>
                    {m.last}, {m.first}
                  </div>
                  <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", marginTop: 2 }}>
                    #{m.memberNo} &nbsp;·&nbsp; {m.tier} &nbsp;·&nbsp; last visit {formatDate(m.lastVisit)}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {m.checkedInAt && (
                  <span
                    className="oswald"
                    style={{ fontSize: 11, letterSpacing: 1, padding: "4px 9px", borderRadius: 3, color: "#0B0B0B", background: "#1F8A3B", textTransform: "uppercase" }}
                  >
                    On Floor
                  </span>
                )}
                <span
                  className="oswald"
                  style={{
                    fontSize: 11,
                    letterSpacing: 1,
                    padding: "4px 9px",
                    borderRadius: 3,
                    color: status.color,
                    border: `1px solid ${status.color}`,
                    textTransform: "uppercase",
                  }}
                >
                  {status.label}
                </span>
                <ChevronRight size={18} color="#6B6B66" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBlock({ label, value, accent, clickable, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#0B0B0B",
        padding: "18px 20px",
        cursor: clickable ? "pointer" : "default",
      }}
    >
      <div className="num" style={{ fontSize: 30, color: accent ? "#C81E1E" : "#F2F0EA" }}>
        {value}
      </div>
      <div className="oswald" style={{ fontSize: 11, letterSpacing: 1.5, color: "#8A8A85", textTransform: "uppercase", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
        {label} {clickable && <ChevronRight size={12} />}
      </div>
    </div>
  );
}

// ---------- member detail: "tale of the tape" ----------
function MemberDetail({ member, onBack }) {
  const remaining = daysLeft(member.joined, member.tier);
  const status = statusFor(remaining);
  const visitCount = member.visits.filter(Boolean).length;

  return (
    <div style={{ padding: "24px", maxWidth: 640, margin: "0 auto" }}>
      <button
        onClick={onBack}
        className="oswald"
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#8A8A85", cursor: "pointer", fontSize: 13, letterSpacing: 1, marginBottom: 20, padding: 0, textTransform: "uppercase" }}
      >
        <ArrowLeft size={15} /> Back to Roster
      </button>

      <div style={{ border: "1px solid #2A2A28", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ background: "#C81E1E", padding: "18px 22px" }}>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 3, color: "#FCE1E1", textTransform: "uppercase" }}>Tale of the Tape</div>
          <div className="num" style={{ fontSize: 30, color: "#fff", marginTop: 4 }}>
            {member.first} {member.last.toUpperCase()}
          </div>
          <div className="oswald" style={{ fontSize: 12, color: "#FCE1E1", letterSpacing: 1, marginTop: 4 }}>
            MEMBER #{member.memberNo}
          </div>
        </div>

        <div style={{ padding: "22px", background: "#111110" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 22 }}>
            <Fact label="Membership" value={member.tier} />
            <Fact label="Status" value={status.label} color={status.color} />
            <Fact label="Joined" value={formatDate(member.joined)} />
            <Fact label="Last Visit" value={formatDate(member.lastVisit)} />
            <Fact label={member.tier === "Annual" ? "Renews In" : "Term Ends In"} value={remaining === Infinity ? "N/A — guest pass" : `${remaining} day${remaining === 1 ? "" : "s"}`} color={status.color} />
            <Fact label="Assigned Coach" value={member.coach} />
          </div>

          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 8 }}>
            Visit Punch Card ({visitCount} rounds logged)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 22 }}>
            {member.visits.map((v, i) => (
              <div
                key={i}
                title={v ? "Attended" : "Missed"}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `1.5px solid ${v ? "#C81E1E" : "#3A3A37"}`,
                  background: v ? "#C81E1E" : "transparent",
                }}
              />
            ))}
          </div>

          <div style={{ borderTop: "1px solid #2A2A28", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: (member.invoices || []).length > 0 ? 20 : 0 }}>
            <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", textTransform: "uppercase", letterSpacing: 1 }}>
              Coaching Hours Logged
            </div>
            <div className="num" style={{ fontSize: 22 }}>{member.hoursLogged} hrs</div>
          </div>

          {(member.invoices || []).length > 0 && (
            <div style={{ borderTop: "1px solid #2A2A28", paddingTop: 16 }}>
              <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                Invoices on File — Member #{member.memberNo}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {member.invoices.map((inv) => (
                  <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#161615", border: "1px solid #2A2A28", borderRadius: 6, padding: "10px 12px" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.description}</div>
                      <div className="oswald" style={{ fontSize: 10.5, color: "#6B6B66", marginTop: 2 }}>{formatDate(inv.issuedAt)}</div>
                    </div>
                    <div className="num" style={{ fontSize: 15, color: inv.status === "paid" ? "#1F8A3B" : "#C81E1E" }}>
                      ${inv.amount} <span className="oswald" style={{ fontSize: 10, textTransform: "uppercase" }}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value, color }) {
  return (
    <div>
      <div className="oswald" style={{ fontSize: 11, letterSpacing: 1.5, color: "#6B6B66", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: color || "#F2F0EA", marginTop: 2 }}>{value}</div>
    </div>
  );
}

// ---------- check-in kiosk ----------
function CheckInKiosk({ members, feed, onCheckIn, onCheckOut, onBack, onShowDayPass }) {
  const [query, setQuery] = useState("");
  const filtered = members.filter(
    (m) => `${m.first} ${m.last}`.toLowerCase().includes(query.toLowerCase()) || m.memberNo.includes(query)
  );
  const onFloor = members.filter((m) => m.checkedInAt);
  const guestsToday = members.filter((m) => isGuestTier(m.tier) && m.checkedInAt);

  return (
    <div>
      <button
        onClick={onBack}
        className="oswald"
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#8A8A85", cursor: "pointer", fontSize: 13, letterSpacing: 1, margin: "24px 0 0 24px", padding: 0, textTransform: "uppercase" }}
      >
        <ArrowLeft size={15} /> Back to Roster
      </button>

      <div style={{ padding: "16px 24px 24px", maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div className="num" style={{ fontSize: 26 }}>WALK-IN KIOSK</div>
            <button
              onClick={onShowDayPass}
              className="oswald"
              style={{ background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "9px 14px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 11, textTransform: "uppercase", whiteSpace: "nowrap" }}
            >
              + Day Pass
            </button>
          </div>
          <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", letterSpacing: 1, marginBottom: 18, textTransform: "uppercase" }}>
            Tap your name to check in or check out
          </div>

          {guestsToday.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
                Today's Day Passes
              </div>
              {guestsToday.map((d) => (
                <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #2A2A28", borderRadius: 6, padding: "10px 12px", marginBottom: 6, background: "#12190F" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{d.first} {d.last} <span style={{ color: "#6B6B66", fontWeight: 400 }}>#{d.memberNo}</span></div>
                    <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", textTransform: "uppercase" }}>
                      {d.tier === "Day Pass Bundle" ? `Bundle — ${d.passesRemaining} pass${d.passesRemaining === 1 ? "" : "es"} left` : "Single day pass"}
                    </div>
                  </div>
                  <span className="oswald" style={{ fontSize: 11, background: "#1F8A3B", color: "#0B0B0B", padding: "4px 9px", borderRadius: 3, fontWeight: 700, textTransform: "uppercase" }}>On Floor</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ position: "relative", marginBottom: 16 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#6B6B66" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find your name or 4-digit member #"
              style={{
                width: "100%",
                background: "#161615",
                border: "1px solid #2A2A28",
                borderRadius: 4,
                padding: "10px 12px 10px 36px",
                color: "#F2F0EA",
                fontFamily: "'Archivo', sans-serif",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 8, maxHeight: 460, overflowY: "auto" }}>
            {filtered.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #2A2A28",
                  borderRadius: 6,
                  padding: "12px 14px",
                  background: m.checkedInAt ? "#12190F" : "#111110",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{m.first} {m.last} <span style={{ color: "#6B6B66", fontWeight: 400 }}>#{m.memberNo}</span></div>
                  <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>
                    {m.checkedInAt ? `On floor since ${formatTime(m.checkedInAt)}` : `Coach: ${m.coach}`}
                  </div>
                </div>
                {m.checkedInAt ? (
                  <button
                    onClick={() => onCheckOut(m.id)}
                    className="oswald"
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "#1F8A3B", color: "#0B0B0B", border: "none", borderRadius: 4, padding: "9px 14px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
                  >
                    <LogOut size={14} /> Check Out
                  </button>
                ) : (
                  <button
                    onClick={() => onCheckIn(m.id)}
                    className="oswald"
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "9px 14px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 12, textTransform: "uppercase" }}
                  >
                    <LogIn size={14} /> Check In
                  </button>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div style={{ color: "#6B6B66", fontStyle: "italic", padding: "12px 2px" }}>No match. Ask the front desk for help.</div>}
          </div>
        </div>

        <div>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 10 }}>
            On the Floor Now ({onFloor.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
            {onFloor.length === 0 && <div style={{ color: "#6B6B66", fontSize: 13 }}>Nobody checked in yet.</div>}
            {onFloor.map((m) => (
              <span key={m.id} className="oswald" style={{ fontSize: 12, background: "#1F8A3B", color: "#0B0B0B", padding: "5px 10px", borderRadius: 3, fontWeight: 700 }}>
                {m.first} {m.last[0]}.
              </span>
            ))}
          </div>

          <div className="oswald" style={{ fontSize: 11, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <MessageCircle size={13} /> Synced to WhatsApp
          </div>
          <div style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 12, maxHeight: 360, overflowY: "auto", background: "#111110" }}>
            {feed.map((f) => (
              <div key={f.id} style={{ background: "#1B2416", border: "1px solid #274A1F", borderRadius: 8, padding: "8px 10px", marginBottom: 8, fontSize: 13 }}>
                {f.text}
                <div className="oswald" style={{ fontSize: 10, color: "#6B6B66", marginTop: 4 }}>{formatTime(f.time)}</div>
              </div>
            ))}
          </div>
          <div className="oswald" style={{ fontSize: 10.5, color: "#5A5A56", marginTop: 8, lineHeight: 1.5 }}>
            Preview only — connecting this to real WhatsApp messages requires the WhatsApp Business API wired up on your server.
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- coaches / payroll ----------
function CoachesView({ coaches, onBack, onSetRate }) {
  const [editingId, setEditingId] = useState(null);
  const [rateInput, setRateInput] = useState("");

  return (
    <div style={{ padding: "24px", maxWidth: 720, margin: "0 auto" }}>
      <button
        onClick={onBack}
        className="oswald"
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#8A8A85", cursor: "pointer", fontSize: 13, letterSpacing: 1, marginBottom: 20, padding: 0, textTransform: "uppercase" }}
      >
        <ArrowLeft size={15} /> Back to Roster
      </button>

      <div className="num" style={{ fontSize: 26, marginBottom: 4 }}>COACHING LEDGER</div>
      <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", letterSpacing: 1, marginBottom: 20, textTransform: "uppercase" }}>
        Hours logged this period &amp; balance due
      </div>

      {coaches.map((c) => {
        const owedHours = c.hoursThisPeriod - c.hoursPaid;
        const hasRate = c.rate !== null && c.rate !== undefined;
        const owedAmount = hasRate ? owedHours * c.rate : null;
        const isEditing = editingId === c.id;
        return (
          <div key={c.id} style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: "18px 20px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{c.name}</div>
              <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
                {isEditing ? (
                  <>
                    <span>$</span>
                    <input
                      autoFocus
                      value={rateInput}
                      onChange={(e) => setRateInput(e.target.value.replace(/\D/g, ""))}
                      style={{ width: 60, background: "#161615", border: "1px solid #2A2A28", borderRadius: 4, padding: "4px 6px", color: "#F2F0EA", fontFamily: "'Archivo', sans-serif", fontSize: 13 }}
                    />
                    <button
                      onClick={() => { if (rateInput) { onSetRate(c.id, Number(rateInput)); setEditingId(null); } }}
                      style={{ background: "#C81E1E", color: "#fff", border: "none", borderRadius: 3, padding: "3px 8px", fontSize: 11, cursor: "pointer", textTransform: "uppercase" }}
                    >
                      Save
                    </button>
                  </>
                ) : hasRate ? (
                  <span>
                    ${c.rate}/hr &nbsp;·&nbsp; {c.hoursThisPeriod} hrs logged &nbsp;·&nbsp; {c.hoursPaid} hrs paid
                    <button onClick={() => { setEditingId(c.id); setRateInput(String(c.rate)); }} style={{ background: "none", border: "none", color: "#6B6B66", textDecoration: "underline", cursor: "pointer", fontSize: 11, marginLeft: 8 }}>edit</button>
                  </span>
                ) : (
                  <span>
                    <span style={{ color: "#C81E1E" }}>Rate TBD</span> &nbsp;·&nbsp; {c.hoursThisPeriod} hrs logged &nbsp;·&nbsp; {c.hoursPaid} hrs paid
                    <button onClick={() => { setEditingId(c.id); setRateInput(""); }} style={{ background: "none", border: "none", color: "#8A8A85", textDecoration: "underline", cursor: "pointer", fontSize: 11, marginLeft: 8 }}>set rate</button>
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              {hasRate ? (
                <>
                  <div className="num" style={{ fontSize: 22, color: owedAmount > 0 ? "#C81E1E" : "#1F8A3B" }}>${owedAmount}</div>
                  <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", textTransform: "uppercase", letterSpacing: 1 }}>
                    {owedHours} hr{owedHours === 1 ? "" : "s"} owed
                  </div>
                </>
              ) : (
                <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", textTransform: "uppercase", letterSpacing: 1 }}>
                  {owedHours} hr{owedHours === 1 ? "" : "s"} logged<br />no rate set
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- staff: event interest & 1-on-1 leads ----------
function InterestView({ groupSessions, members, oneOnOneRequests, onBack }) {
  const upcoming = [...groupSessions]
    .filter((s) => new Date(s.date) >= new Date("2026-08-25"))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={{ padding: "24px", maxWidth: 720, margin: "0 auto" }}>
      <button
        onClick={onBack}
        className="oswald"
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#8A8A85", cursor: "pointer", fontSize: 13, letterSpacing: 1, marginBottom: 20, padding: 0, textTransform: "uppercase" }}
      >
        <ArrowLeft size={15} /> Back to Roster
      </button>

      <div className="num" style={{ fontSize: 26, marginBottom: 4 }}>EVENT INTEREST</div>
      <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", letterSpacing: 1, marginBottom: 24, textTransform: "uppercase" }}>
        Who's reserved a spot &amp; who wants a 1-on-1
      </div>

      <div className="oswald" style={{ fontSize: 12, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", marginBottom: 10 }}>
        Upcoming Coaching Events
      </div>
      {upcoming.length === 0 && (
        <div style={{ color: "#6B6B66", fontSize: 13, marginBottom: 24 }}>Nothing posted yet.</div>
      )}
      {upcoming.map((s) => (
        <div key={s.id} style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.title}</div>
          <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", marginBottom: 12 }}>
            {formatDate(s.date)} &nbsp;·&nbsp; {s.time}{s.endTime ? `–${s.endTime}` : ""} &nbsp;·&nbsp; Coach {s.coach}
          </div>
          <div className="oswald" style={{ fontSize: 11, color: "#6B6B66", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
            Reserved ({s.attendeeIds.length}/{s.capacity})
          </div>
          {s.attendeeIds.length === 0 ? (
            <div style={{ color: "#6B6B66", fontSize: 13 }}>No one's reserved a spot yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {s.attendeeIds.map((aid) => {
                const m = members.find((x) => x.id === aid);
                if (!m) return null;
                return (
                  <div key={aid} style={{ display: "flex", justifyContent: "space-between", background: "#161615", borderRadius: 4, padding: "8px 10px" }}>
                    <span style={{ fontSize: 13 }}>{m.first} {m.last}</span>
                    <span className="oswald" style={{ fontSize: 12, color: "#6B6B66" }}>#{m.memberNo}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div className="oswald" style={{ fontSize: 12, letterSpacing: 2, color: "#8A8A85", textTransform: "uppercase", margin: "24px 0 10px" }}>
        1-on-1 Session Leads
      </div>
      {oneOnOneRequests.length === 0 ? (
        <div style={{ color: "#6B6B66", fontSize: 13 }}>No 1-on-1 requests yet.</div>
      ) : (
        oneOnOneRequests.map((r) => (
          <div key={r.id} style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: "14px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{r.memberName} <span style={{ color: "#6B6B66", fontWeight: 400 }}>#{r.memberNo}</span></div>
              <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", marginTop: 2 }}>
                Wants {r.coachName} &nbsp;·&nbsp; Follow up by {r.contactMethod}: {r.contactInfo}
              </div>
            </div>
            <span className="oswald" style={{ fontSize: 11, color: "#6B6B66" }}>{formatDate(r.time)}</span>
          </div>
        ))
      )}
    </div>
  );
}

// ---------- staff: full member database ----------
function DatabaseView({ members, onBack, onSelect }) {
  const [query, setQuery] = useState("");
  const filtered = members
    .filter((m) => `${m.first} ${m.last} ${m.memberNo}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.last.localeCompare(b.last));

  return (
    <div style={{ padding: "24px" }}>
      <button
        onClick={onBack}
        className="oswald"
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#8A8A85", cursor: "pointer", fontSize: 13, letterSpacing: 1, marginBottom: 20, padding: 0, textTransform: "uppercase" }}
      >
        <ArrowLeft size={15} /> Back to Roster
      </button>

      <div className="num" style={{ fontSize: 26, marginBottom: 4 }}>FULL DATABASE</div>
      <div className="oswald" style={{ fontSize: 12, color: "#8A8A85", letterSpacing: 1, marginBottom: 20, textTransform: "uppercase" }}>
        Every user on file — members, guests &amp; day passes ({members.length} total)
      </div>

      <div style={{ position: "relative", marginBottom: 18, maxWidth: 360 }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "#6B6B66" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or member #"
          style={{
            width: "100%",
            background: "#161615",
            border: "1px solid #2A2A28",
            borderRadius: 4,
            padding: "10px 12px 10px 36px",
            color: "#F2F0EA",
            fontFamily: "'Archivo', sans-serif",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>

      <div style={{ overflowX: "auto", border: "1px solid #2A2A28", borderRadius: 6 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr className="oswald" style={{ background: "#161615", textTransform: "uppercase", fontSize: 11, letterSpacing: 1, color: "#8A8A85" }}>
              {["#", "Name", "Tier", "Status", "Coach", "Joined", "Last Visit", "Balance", "Next Fee", "Agreement", "Auth"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", borderBottom: "1px solid #2A2A28", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const remaining = daysLeft(m.joined, m.tier);
              const status = statusFor(remaining);
              return (
                <tr
                  key={m.id}
                  onClick={() => onSelect(m.id)}
                  style={{ borderBottom: "1px solid #1D1D1B", cursor: "pointer" }}
                >
                  <td style={{ padding: "10px 14px", color: "#6B6B66" }}>#{m.memberNo}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>{m.first} {m.last}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>{m.tier}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span className="oswald" style={{ fontSize: 10.5, letterSpacing: 0.5, color: status.color, border: `1px solid ${status.color}`, padding: "2px 7px", borderRadius: 3, textTransform: "uppercase" }}>
                      {status.label}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#B8B6AF", whiteSpace: "nowrap" }}>{m.coach}</td>
                  <td style={{ padding: "10px 14px", color: "#8A8A85", whiteSpace: "nowrap" }}>{formatDate(m.joined)}</td>
                  <td style={{ padding: "10px 14px", color: "#8A8A85", whiteSpace: "nowrap" }}>{formatDate(m.lastVisit)}</td>
                  <td style={{ padding: "10px 14px", color: m.balance > 0 ? "#C81E1E" : "#1F8A3B", whiteSpace: "nowrap" }}>
                    {m.balance > 0 ? `$${m.balance}` : "$0"}
                  </td>
                  <td style={{ padding: "10px 14px", color: "#8A8A85", whiteSpace: "nowrap" }}>
                    {m.nextFeeDate ? `${formatDate(m.nextFeeDate)} · $${m.nextFeeAmount}` : "—"}
                  </td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    {m.agreement ? <span style={{ color: "#1F8A3B" }}>✓ Signed</span> : <span style={{ color: "#6B6B66" }}>—</span>}
                  </td>
                  <td style={{ padding: "10px 14px", color: "#8A8A85", whiteSpace: "nowrap", textTransform: "capitalize" }}>
                    {m.authProvider || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: "30px", textAlign: "center", color: "#6B6B66" }}>No matches.</div>
        )}
      </div>
    </div>
  );
}


function AddMemberModal({ coaches, onClose, onSave }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [tier, setTier] = useState("Rental");
  const [coach, setCoach] = useState(coaches[0]?.name || "");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 10 }}>
      <div style={{ background: "#111110", border: "1px solid #2A2A28", borderRadius: 6, width: "100%", maxWidth: 420, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div className="num" style={{ fontSize: 20 }}>NEW FIGHTER</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8A8A85", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <Field label="First Name" value={first} onChange={setFirst} />
        <Field label="Last Name" value={last} onChange={setLast} />

        <div style={{ marginBottom: 14 }}>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 1, color: "#8A8A85", textTransform: "uppercase", marginBottom: 6 }}>Membership</div>
          <select value={tier} onChange={(e) => setTier(e.target.value)} style={selectStyle}>
            <option value="Rental">Rental (30 days)</option>
            <option value="Monthly">Monthly (30 days)</option>
            <option value="Quarterly">Quarterly (90 days)</option>
            <option value="Annual">Annual (365 days)</option>
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="oswald" style={{ fontSize: 11, letterSpacing: 1, color: "#8A8A85", textTransform: "uppercase", marginBottom: 6 }}>Assigned Coach</div>
          <select value={coach} onChange={(e) => setCoach(e.target.value)} style={selectStyle}>
            {coaches.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <button
          disabled={!first || !last}
          onClick={() => onSave({ first, last, tier, coach })}
          className="oswald"
          style={{
            width: "100%",
            background: !first || !last ? "#5A1414" : "#C81E1E",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "12px",
            fontWeight: 600,
            letterSpacing: 1,
            cursor: !first || !last ? "not-allowed" : "pointer",
            textTransform: "uppercase",
            fontSize: 13,
          }}
        >
          Add to Roster
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="oswald" style={{ fontSize: 11, letterSpacing: 1, color: "#8A8A85", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle} />
    </div>
  );
}

// ---------- name sign-in (new guest or returning by name) ----------
function NameSignInModal({ inline, findMemberByName, onCheckInReturning, onCreateGuest, onClose }) {
  const [step, setStep] = useState("info"); // info | waiver | plan
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState("");
  const [plan, setPlan] = useState("single");
  const [notFoundNotice, setNotFoundNotice] = useState(false);

  function handleContinueFromName() {
    if (!name.trim()) return;
    const match = findMemberByName(name);
    if (match) {
      onCheckInReturning(match);
      return;
    }
    setNotFoundNotice(true);
    setStep("waiver");
  }

  function confirm() {
    onCreateGuest(name.trim(), signature.trim(), plan);
  }

  const body = (
    <>
      {step === "info" && (
        <div>
          <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            Type your full name
          </div>
          <input
            autoFocus={inline}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleContinueFromName()}
            placeholder="First and last name"
            style={{ ...selectStyle, marginBottom: 6, textAlign: inline ? "center" : "left" }}
          />
          <div className="oswald" style={{ fontSize: 10.5, color: "#5A5A56", marginBottom: 16, lineHeight: 1.5 }}>
            Already been here before? Typing the same name checks you right in. First time? We'll get you set up and give you a code for next visit.
          </div>
          <button
            onClick={handleContinueFromName}
            disabled={!name.trim()}
            className="oswald"
            style={{ width: "100%", background: name.trim() ? "#C81E1E" : "#5A1414", color: "#fff", border: "none", borderRadius: 4, padding: "12px", fontWeight: 700, letterSpacing: 1, cursor: name.trim() ? "pointer" : "not-allowed", fontSize: 13, textTransform: "uppercase", marginBottom: 10 }}
          >
            Continue
          </button>
          {inline && (
            <button onClick={onClose} className="oswald" style={loginBackStyle}>Back</button>
          )}
        </div>
      )}

      {step === "waiver" && (
        <div>
          {notFoundNotice && (
            <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Looks like you're new — quick waiver, then you're set.
            </div>
          )}
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "#D8D6CF", whiteSpace: "pre-wrap", marginBottom: 16, maxHeight: 240, overflowY: "auto", border: "1px solid #2A2A28", borderRadius: 4, padding: 12, textAlign: "left" }}>
            {AGREEMENT_TEXT}
          </div>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12, cursor: "pointer", textAlign: "left" }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
            <span className="oswald" style={{ fontSize: 12, color: "#B8B6AF" }}>I have read and agree to the Financial Agreement &amp; Safety Guidelines above.</span>
          </label>
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Type your full name to sign"
            style={{ ...selectStyle, marginBottom: 14 }}
          />
          <button
            onClick={() => setStep("plan")}
            disabled={!agreed || !signature.trim()}
            className="oswald"
            style={{ width: "100%", background: agreed && signature.trim() ? "#C81E1E" : "#5A1414", color: "#fff", border: "none", borderRadius: 4, padding: "12px", fontWeight: 700, letterSpacing: 1, cursor: agreed && signature.trim() ? "pointer" : "not-allowed", fontSize: 13, textTransform: "uppercase" }}
          >
            Continue
          </button>
        </div>
      )}

      {step === "plan" && (
        <div>
          <div className="oswald" style={{ fontSize: 11, color: "#8A8A85", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
            Choose a Plan
          </div>
          <button
            onClick={() => setPlan("single")}
            className="oswald"
            style={{
              width: "100%", textAlign: "left", background: plan === "single" ? "#1B0E0E" : "#161615",
              border: `1px solid ${plan === "single" ? "#C81E1E" : "#2A2A28"}`, borderRadius: 6, padding: "14px", marginBottom: 10, cursor: "pointer", color: "#F2F0EA",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Single Day Pass</span>
              <span className="num" style={{ fontSize: 20, color: "#C81E1E" }}>${DAY_PASS_PRICE}</span>
            </div>
            <div style={{ fontSize: 11, color: "#8A8A85", marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Good for today only</div>
          </button>
          <button
            onClick={() => setPlan("bundle")}
            className="oswald"
            style={{
              width: "100%", textAlign: "left", background: plan === "bundle" ? "#1B0E0E" : "#161615",
              border: `1px solid ${plan === "bundle" ? "#C81E1E" : "#2A2A28"}`, borderRadius: 6, padding: "14px", marginBottom: 18, cursor: "pointer", color: "#F2F0EA",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Bundle of {DAY_PASS_BUNDLE_COUNT}</span>
              <span className="num" style={{ fontSize: 20, color: "#C81E1E" }}>${DAY_PASS_BUNDLE_PRICE}</span>
            </div>
            <div style={{ fontSize: 11, color: "#8A8A85", marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
              ${(DAY_PASS_BUNDLE_PRICE / DAY_PASS_BUNDLE_COUNT).toFixed(2)}/visit — use any day
            </div>
          </button>
          <button
            onClick={confirm}
            className="oswald"
            style={{ width: "100%", background: "#C81E1E", color: "#fff", border: "none", borderRadius: 4, padding: "13px", fontWeight: 700, letterSpacing: 1, cursor: "pointer", fontSize: 13, textTransform: "uppercase" }}
          >
            Confirm — ${plan === "bundle" ? DAY_PASS_BUNDLE_PRICE : DAY_PASS_PRICE}
          </button>
        </div>
      )}
    </>
  );

  if (inline) {
    return <div style={{ width: "100%", maxWidth: 320 }}>{body}</div>;
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 20 }}>
      <div style={{ background: "#111110", border: "1px solid #2A2A28", borderRadius: 6, width: "100%", maxWidth: 460, maxHeight: "88vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid #2A2A28" }}>
          <div className="num" style={{ fontSize: 18 }}>SIGN IN</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8A8A85", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: "20px", overflowY: "auto" }}>{body}</div>
      </div>
    </div>
  );
}

const selectStyle = {
  width: "100%",
  background: "#161615",
  border: "1px solid #2A2A28",
  borderRadius: 4,
  padding: "10px 12px",
  color: "#F2F0EA",
  fontFamily: "'Archivo', sans-serif",
  fontSize: 14,
  outline: "none",
};
