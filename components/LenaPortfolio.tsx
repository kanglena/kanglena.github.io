"use client";

import { useEffect, useRef, useState } from "react";

const SANS = "var(--font-space), 'Space Grotesk', sans-serif";
const MONO = "var(--font-mono), 'JetBrains Mono', monospace";

type Lang = "ko" | "en";
type Hero = "terminal" | "editorial" | "code";

type TermStep = { prompt?: string; cmd?: string; out?: string; accent?: boolean };
type CodeSeg = { t: string; c: string };

const COLORS: Record<string, string> = {
  com: "#a8a69b",
  key: "#a626a4",
  cls: "#2e6fe0",
  prop: "#1a1a15",
  ink: "#1a1a15",
  str: "#0f8a4c",
  num: "#b26a00",
};

const heroData: Record<Lang, { terminal: TermStep[]; edi: { kicker: string; name: string; tag: string }; code: CodeSeg[][] }> = {
  ko: {
    terminal: [
      { prompt: "lena@gaon ~ %", cmd: "whoami" },
      { out: "강인아 · Lena" },
      { prompt: "lena@gaon ~ %", cmd: "cat profile.txt" },
      { out: "대치중학교 2학년 — 학생 개발자" },
      { out: "stack: Python · JavaScript · AI" },
      { prompt: "lena@gaon ~ %", cmd: "ls ~/projects" },
      { out: "가온케어/", accent: true },
    ],
    edi: { kicker: "// 학생 개발자 · 대치중학교", name: "강인아", tag: "불편함을 코드로 푸는 사람." },
    code: [
      [{ t: "# developer.py", c: "com" }],
      [{ t: "class ", c: "key" }, { t: "Developer", c: "cls" }, { t: ":", c: "ink" }],
      [{ t: "    name  ", c: "prop" }, { t: "= ", c: "ink" }, { t: '"강인아"', c: "str" }],
      [{ t: "    alias ", c: "prop" }, { t: "= ", c: "ink" }, { t: '"Lena"', c: "str" }],
      [{ t: "    grade ", c: "prop" }, { t: "= ", c: "ink" }, { t: '"대치중 2학년"', c: "str" }],
      [{ t: "    stack ", c: "prop" }, { t: "= ", c: "ink" }, { t: "[", c: "ink" }, { t: '"Python"', c: "str" }, { t: ", ", c: "ink" }, { t: '"JavaScript"', c: "str" }, { t: ", ", c: "ink" }, { t: '"AI"', c: "str" }, { t: "]", c: "ink" }],
      [{ t: "    motto ", c: "prop" }, { t: "= ", c: "ink" }, { t: '"불편함을 코드로 푼다"', c: "str" }],
    ],
  },
  en: {
    terminal: [
      { prompt: "lena@gaon ~ %", cmd: "whoami" },
      { out: "강인아 · Lena" },
      { prompt: "lena@gaon ~ %", cmd: "cat profile.txt" },
      { out: "Daechi Middle School, grade 8 — student developer" },
      { out: "stack: Python · JavaScript · AI" },
      { prompt: "lena@gaon ~ %", cmd: "ls ~/projects" },
      { out: "gaon-care/", accent: true },
    ],
    edi: { kicker: "// student developer · Daechi MS", name: "Lena", tag: "I turn friction into code." },
    code: [
      [{ t: "# developer.py", c: "com" }],
      [{ t: "class ", c: "key" }, { t: "Developer", c: "cls" }, { t: ":", c: "ink" }],
      [{ t: "    name  ", c: "prop" }, { t: "= ", c: "ink" }, { t: '"Lena"', c: "str" }],
      [{ t: "    alias ", c: "prop" }, { t: "= ", c: "ink" }, { t: '"강인아"', c: "str" }],
      [{ t: "    grade ", c: "prop" }, { t: "= ", c: "ink" }, { t: '"Daechi MS, grade 8"', c: "str" }],
      [{ t: "    stack ", c: "prop" }, { t: "= ", c: "ink" }, { t: "[", c: "ink" }, { t: '"Python"', c: "str" }, { t: ", ", c: "ink" }, { t: '"JavaScript"', c: "str" }, { t: ", ", c: "ink" }, { t: '"AI"', c: "str" }, { t: "]", c: "ink" }],
      [{ t: "    motto ", c: "prop" }, { t: "= ", c: "ink" }, { t: '"turn friction into code"', c: "str" }],
    ],
  },
};

const I18N = {
  ko: {
    nav: { about: "소개", work: "프로젝트", contact: "연락처" },
    hero: { hint: "아래로 스크롤" },
    about: {
      tag: "$ cat about.md",
      heading: "코드로 학교의 불편을 푸는 학생 개발자",
      p1: "대치중학교 2학년 강인아(Lena)입니다. 학생회 활동을 하며 마주친 진짜 불편함을, 직접 만든 서비스로 풀어내는 걸 좋아합니다.",
      p2: "Python과 JavaScript를 주력으로 쓰고, 필요한 곳에는 AI를 얹어 더 똑똑한 경험을 만듭니다. 기획부터 배포, 운영까지 끝까지 끌고 가는 걸 즐깁니다.",
      stat: { statusK: "status", statusV: "프로젝트 빌드 중", locK: "location", locV: "서울 · 대치중", focusK: "focus", focusV: "web · kiosk · AI" },
      skillsLabel: "// 기술 스택",
    },
    work: { tag: "$ ls ~/projects", heading: "대표 프로젝트", sub: "직접 기획하고 배포해 실제로 쓰이는 서비스.", next: "다음 프로젝트 커밋 준비 중…" },
    proj: {
      year: "2025 — 운영 중",
      role: "기획 · 개발 · 배포",
      title: "가온케어",
      subtitle: "학생회 우산 대여, 수기에서 디지털로.",
      feat: ["키오스크", "대시보드", "재고 관리", "QR 라벨"],
      desc: "대치중학교 학생회 「가온」의 우산 대여는 종이 장부로 관리되어 분실과 누락이 잦았습니다. 가온케어는 이 과정을 웹 서비스로 옮겨, 학생은 태블릿 키오스크에서 직접 빌리고 반납하고, 학생회는 백오피스에서 재고와 대여 현황을 한눈에 관리합니다.",
    },
    contact: { tag: "$ ./contact.sh", heading: "언제든 연락 주세요", body: "프로젝트 제안, 협업, 또는 그냥 궁금한 점이든 편하게 연락 주세요.", email: "lena@example.com", github: "github.com/lena", githubUrl: "https://github.com", insta: "@lena", instaUrl: "https://instagram.com", status: "새 프로젝트 · 협업 받는 중" },
    footer: "강인아 (Lena) · 직접 디자인하고 코딩함 · 2026",
  },
  en: {
    nav: { about: "About", work: "Work", contact: "Contact" },
    hero: { hint: "scroll down" },
    about: {
      tag: "$ cat about.md",
      heading: "A student developer solving school problems with code",
      p1: "I’m Lena (강인아), an 8th grader at Daechi Middle School. I love turning the real friction I run into through student-council work into services I build myself.",
      p2: "I work mainly in Python and JavaScript, adding AI where it makes the experience smarter. I enjoy taking a project all the way — from idea to deployment to keeping it running.",
      stat: { statusK: "status", statusV: "building projects", locK: "location", locV: "Seoul · Daechi MS", focusK: "focus", focusV: "web · kiosk · AI" },
      skillsLabel: "// tech stack",
    },
    work: { tag: "$ ls ~/projects", heading: "Featured work", sub: "Services I designed, shipped, and people actually use.", next: "next project — committing soon…" },
    proj: {
      year: "2025 — live",
      role: "design · dev · deploy",
      title: "Gaon Care",
      subtitle: "Student-council umbrella rental, from paper to digital.",
      feat: ["Kiosk", "Dashboard", "Inventory", "QR labels"],
      desc: "The umbrella rental run by Daechi Middle School’s student council “Gaon” was tracked on paper, so umbrellas went missing and records slipped. Gaon Care moves the whole flow onto the web: students borrow and return on a tablet kiosk, while the council manages stock and rentals from a back office.",
    },
    contact: { tag: "$ ./contact.sh", heading: "Always open to a chat", body: "Project ideas, collaborations, or just a question — feel free to reach out.", email: "lena@example.com", github: "github.com/lena", githubUrl: "https://github.com", insta: "@lena", instaUrl: "https://instagram.com", status: "open to new projects & collabs" },
    footer: "강인아 (Lena) · designed & coded by me · 2026",
  },
};

const SKILLS = ["Python", "JavaScript", "AI", "HTML / CSS", "React", "Web Deploy", "Kiosk UX", "Back-office"];

export default function LenaPortfolio() {
  const [lang, setLang] = useState<Lang>("ko");
  const [hero, setHero] = useState<Hero>("terminal");

  const rootRef = useRef<HTMLDivElement>(null);
  const heroBodyRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);

  const t = I18N[lang];

  // scroll progress + parallax + mouse glow + reveal-on-scroll (mount once)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;

    const upd = () => {
      const p = progressRef.current;
      const h = document.documentElement;
      const sc = h.scrollTop || document.body.scrollTop || 0;
      const max = h.scrollHeight - h.clientHeight || 1;
      if (p) p.style.width = Math.min(100, (sc / max) * 100) + "%";
      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const s = parseFloat(el.getAttribute("data-parallax") || "0") || 0;
        el.style.transform = "translateY(" + sc * s + "px)";
      });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        upd();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    upd();

    const g = glowRef.current;
    const heroEl = root.querySelector<HTMLElement>("#top");
    if (g && heroEl) {
      const r = heroEl.getBoundingClientRect();
      g.style.transform = "translate(" + (r.width / 2 - 280) + "px," + (r.height * 0.4 - 280) + "px)";
    }
    const onMouse = (e: MouseEvent) => {
      const gg = glowRef.current;
      const h = root.querySelector<HTMLElement>("#top");
      if (!gg || !h) return;
      const rect = h.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      gg.style.transform = "translate(" + (e.clientX - rect.left - 280) + "px," + (e.clientY - rect.top - 280) + "px)";
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const nodes = root.querySelectorAll<HTMLElement>("[data-reveal]");
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              const el = en.target as HTMLElement;
              const d = el.getAttribute("data-reveal-delay");
              if (d) el.style.transitionDelay = d + "ms";
              el.style.opacity = "1";
              el.style.transform = "none";
              io?.unobserve(el);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      nodes.forEach((el) => io!.observe(el));
    } else {
      nodes.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, []);

  // hero typing animation — rebuilds on lang/hero change
  useEffect(() => {
    const box = heroBodyRef.current;
    const title = heroTitleRef.current;
    if (!box) return;

    let cancelled = false;
    const timers = new Set<number>();
    const setT = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!cancelled) fn();
      }, ms);
      timers.add(id);
      return id;
    };
    const cps = (base: number) => base;
    const dly = (ms: number) => ms;

    const makeCursor = () => {
      const c = document.createElement("span");
      c.textContent = "▋";
      c.style.cssText = "display:inline-block;color:var(--accent);animation:blink 1s steps(1) infinite;margin-left:1px;";
      return c;
    };
    let cursor = makeCursor();

    const typeText = (el: HTMLElement, text: string, cpsv: number, done?: () => void) => {
      let i = 0;
      if (!text || text.length === 0) {
        done?.();
        return;
      }
      const step = () => {
        if (cancelled) return;
        i++;
        el.textContent = text.slice(0, i);
        if (i < text.length) setT(step, 1000 / cpsv);
        else done?.();
      };
      step();
    };

    const buildTerminal = () => {
      const steps = heroData[lang].terminal;
      box.style.fontFamily = MONO;
      box.style.fontSize = "clamp(14px,1.7vw,17px)";
      box.style.lineHeight = "1.95";
      box.style.color = "var(--ink)";
      let i = 0;
      const mkline = () => {
        const d = document.createElement("div");
        d.style.cssText = "display:flex;flex-wrap:wrap;white-space:pre-wrap;word-break:break-word;";
        box.appendChild(d);
        return d;
      };
      const next = () => {
        if (cancelled) return;
        if (i >= steps.length) {
          const line = mkline();
          const p = document.createElement("span");
          p.textContent = "lena@gaon ~ % ";
          p.style.color = "var(--accent)";
          p.style.fontWeight = "600";
          line.appendChild(p);
          line.appendChild(cursor);
          return;
        }
        const s = steps[i];
        i++;
        const line = mkline();
        if (s.cmd !== undefined) {
          const p = document.createElement("span");
          p.textContent = s.prompt + " ";
          p.style.color = "var(--accent)";
          p.style.fontWeight = "600";
          const c = document.createElement("span");
          c.style.color = "var(--ink)";
          line.appendChild(p);
          line.appendChild(c);
          line.appendChild(cursor);
          typeText(c, s.cmd, cps(24), () => setT(next, dly(280)));
        } else {
          line.style.color = s.accent ? "var(--accent)" : "var(--muted)";
          if (s.accent) line.style.fontWeight = "600";
          line.style.opacity = "0";
          line.style.transition = "opacity .35s ease";
          line.textContent = s.out || "";
          requestAnimationFrame(() => {
            if (!cancelled) line.style.opacity = "1";
          });
          setT(next, dly(150));
        }
      };
      next();
    };

    const buildEditorial = () => {
      const e = heroData[lang].edi;
      box.style.display = "flex";
      box.style.flexDirection = "column";
      box.style.justifyContent = "center";
      box.style.gap = "clamp(14px,2vw,22px)";
      const kicker = document.createElement("div");
      kicker.style.cssText = "font-family:" + MONO + ";font-size:13px;letter-spacing:0.03em;color:var(--accent);min-height:1.2em;";
      const h1 = document.createElement("div");
      h1.style.cssText = "font-family:" + SANS + ";font-weight:600;font-size:clamp(48px,9vw,104px);line-height:0.98;letter-spacing:-0.04em;color:var(--ink);min-height:0.98em;";
      const tagWrap = document.createElement("div");
      tagWrap.style.cssText = "font-family:" + MONO + ";font-size:clamp(15px,2vw,20px);color:var(--muted);display:flex;align-items:center;flex-wrap:wrap;min-height:1.4em;";
      const tagSpan = document.createElement("span");
      tagWrap.appendChild(tagSpan);
      const idx = document.createElement("div");
      idx.style.cssText = "display:flex;flex-wrap:wrap;gap:20px;font-family:" + MONO + ";font-size:12px;color:var(--muted);margin-top:6px;opacity:0;transition:opacity .5s ease;";
      ([["01", "about"], ["02", "work"], ["03", "contact"]] as const).forEach((p) => {
        const it = document.createElement("span");
        const n = document.createElement("span");
        n.textContent = p[0] + " ";
        n.style.color = "var(--accent)";
        it.appendChild(n);
        it.appendChild(document.createTextNode(p[1]));
        idx.appendChild(it);
      });
      box.appendChild(kicker);
      box.appendChild(h1);
      box.appendChild(tagWrap);
      box.appendChild(idx);
      typeText(kicker, e.kicker, cps(42), () => {
        typeText(h1, e.name, cps(11), () => {
          tagWrap.appendChild(cursor);
          typeText(tagSpan, e.tag, cps(24), () => {
            if (!cancelled) idx.style.opacity = "1";
          });
        });
      });
    };

    const buildCode = () => {
      const lines = heroData[lang].code;
      box.style.fontFamily = MONO;
      box.style.fontSize = "clamp(13px,1.55vw,16px)";
      box.style.lineHeight = "2";
      box.style.color = "var(--ink)";
      let li = 0;
      const runLine = () => {
        if (cancelled) return;
        if (li >= lines.length) return;
        const segs = lines[li];
        const num = li + 1;
        li++;
        const row = document.createElement("div");
        row.style.cssText = "display:flex;gap:18px;align-items:flex-start;";
        const g = document.createElement("span");
        g.textContent = String(num);
        g.style.cssText = "flex:none;width:20px;text-align:right;color:var(--muted);opacity:.45;user-select:none;";
        const code = document.createElement("span");
        code.style.cssText = "white-space:pre-wrap;word-break:break-word;";
        row.appendChild(g);
        row.appendChild(code);
        box.appendChild(row);
        let si = 0;
        const runSeg = () => {
          if (cancelled) return;
          if (si >= segs.length) {
            setT(runLine, dly(70));
            return;
          }
          const sg = segs[si];
          si++;
          const sp = document.createElement("span");
          sp.style.color = COLORS[sg.c] || "var(--ink)";
          sp.style.whiteSpace = "pre";
          if (sg.c === "com") sp.style.fontStyle = "italic";
          code.appendChild(sp);
          code.appendChild(cursor);
          typeText(sp, sg.t, cps(46), runSeg);
        };
        runSeg();
      };
      runLine();
    };

    // start
    box.innerHTML = "";
    (["display", "flexDirection", "justifyContent", "gap", "fontFamily", "fontSize", "lineHeight", "color"] as const).forEach((k) => {
      box.style[k] = "";
    });
    cursor = makeCursor();
    if (title) title.textContent = hero === "terminal" ? "zsh — lena@gaon: ~" : hero === "code" ? "developer.py — ~/portfolio" : "~/portfolio/index";
    const startId = setT(() => {
      if (hero === "terminal") buildTerminal();
      else if (hero === "code") buildCode();
      else buildEditorial();
    }, 380);
    timers.add(startId);

    return () => {
      cancelled = true;
      timers.forEach((id) => clearTimeout(id));
    };
  }, [lang, hero]);

  const copyEmail = () => {
    try {
      navigator.clipboard.writeText(I18N[lang].contact.email);
    } catch {}
    const b = copyBtnRef.current;
    if (b) {
      b.textContent = "copied!";
      b.style.color = "#10864b";
      b.style.borderColor = "#10864b";
      setTimeout(() => {
        b.textContent = "copy";
        b.style.color = "";
        b.style.borderColor = "";
      }, 1400);
    }
  };

  const reveal: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(28px)",
    transition: "opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)",
  };

  const switchBtn = (mode: Hero, label: string) => {
    const on = hero === mode;
    return (
      <button
        onClick={() => setHero(mode)}
        style={{ fontFamily: MONO, fontSize: 12, border: "none", background: on ? "var(--accent)" : "transparent", color: on ? "#fff" : "var(--muted)", padding: "6px 13px", borderRadius: 999, cursor: "pointer", transition: "all .2s", fontWeight: on ? 600 : 500 }}
      >
        {label}
      </button>
    );
  };

  return (
    <div ref={rootRef} style={{ background: "var(--paper)", color: "var(--ink)", fontFamily: SANS, minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <div ref={progressRef} style={{ position: "fixed", top: 0, left: 0, height: 3, width: "0%", background: "linear-gradient(90deg,var(--accent),var(--accent2))", zIndex: 60, transition: "width .08s linear" }} />

      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px clamp(18px,3vw,34px)", background: "rgba(242,241,234,0.72)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)", fontFamily: MONO }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, textDecoration: "none", color: "var(--ink)" }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent)", animation: "dotpulse 2.4s infinite" }} />
          <span style={{ fontWeight: 600 }}>lena</span>
          <span style={{ color: "var(--muted)" }}>@portfolio</span>
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2vw,26px)", fontSize: 13 }}>
          <a className="lp-navlink" href="#about" style={{ textDecoration: "none", color: "var(--muted)" }}>{t.nav.about}</a>
          <a className="lp-navlink" href="#work" style={{ textDecoration: "none", color: "var(--muted)" }}>{t.nav.work}</a>
          <a className="lp-navlink" href="#contact" style={{ textDecoration: "none", color: "var(--muted)" }}>{t.nav.contact}</a>
          <button className="lp-langbtn" onClick={() => setLang((l) => (l === "ko" ? "en" : "ko"))} style={{ fontFamily: MONO, fontSize: 12, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>
            {lang === "ko" ? "EN" : "KR"}
          </button>
        </nav>
      </header>

      <section id="top" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", padding: "130px 28px 90px", overflow: "hidden" }}>
        <div data-parallax="0.14" aria-hidden="true" style={{ position: "absolute", inset: "-15%", backgroundImage: "linear-gradient(rgba(26,26,21,0.055) 1px,transparent 1px),linear-gradient(90deg,rgba(26,26,21,0.055) 1px,transparent 1px)", backgroundSize: "46px 46px", WebkitMaskImage: "radial-gradient(circle at 50% 40%,#000,transparent 70%)", maskImage: "radial-gradient(circle at 50% 40%,#000,transparent 70%)", pointerEvents: "none" }} />
        <div ref={glowRef} aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,134,75,0.18),transparent 66%)", filter: "blur(8px)", pointerEvents: "none", transition: "transform .22s ease-out", willChange: "transform" }} />
        <div style={{ position: "relative", width: "100%", maxWidth: 980, margin: "0 auto" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, boxShadow: "0 34px 90px rgba(26,26,21,0.10)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: "1px solid var(--line)", background: "rgba(26,26,21,0.018)" }}>
              <div style={{ display: "flex", gap: 7 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#e5564b" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#e8b23a" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#3bb665" }} />
              </div>
              <div ref={heroTitleRef} style={{ fontFamily: MONO, fontSize: 12, color: "var(--muted)" }} />
            </div>
            <div ref={heroBodyRef} style={{ padding: "clamp(26px,3.6vw,42px)", minHeight: "clamp(300px,40vh,400px)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, justifyContent: "center", marginTop: 26, fontFamily: MONO, fontSize: 12, color: "var(--muted)" }}>
            <span style={{ display: "inline-block", animation: "bob 1.6s ease-in-out infinite" }}>↓</span>
            {t.hero.hint}
          </div>
        </div>
      </section>

      <section id="about" style={{ scrollMarginTop: 90, padding: "clamp(70px,10vw,120px) 28px", position: "relative" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div data-reveal style={reveal}>
            <div style={{ fontFamily: MONO, fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>{t.about.tag}</div>
            <h2 style={{ fontSize: "clamp(28px,4.4vw,50px)", fontWeight: 600, letterSpacing: "-0.032em", lineHeight: 1.08, maxWidth: "19ch", margin: "18px 0 0", textWrap: "pretty" }}>{t.about.heading}</h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(32px,5vw,56px)", marginTop: "clamp(34px,5vw,54px)" }}>
            <div data-reveal data-reveal-delay="80" style={{ ...reveal, flex: "2 1 380px" }}>
              <p style={{ fontSize: "clamp(16px,1.7vw,20px)", lineHeight: 1.7, color: "var(--ink)", margin: "0 0 20px", textWrap: "pretty", maxWidth: "60ch" }}>{t.about.p1}</p>
              <p style={{ fontSize: "clamp(16px,1.7vw,20px)", lineHeight: 1.7, color: "var(--muted)", margin: 0, textWrap: "pretty", maxWidth: "60ch" }}>{t.about.p2}</p>
              <div style={{ marginTop: 34 }}>
                <div style={{ fontFamily: MONO, fontSize: 12, color: "var(--accent)", marginBottom: 14 }}>{t.about.skillsLabel}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9, fontFamily: MONO, fontSize: 13 }}>
                  {SKILLS.map((s) => (
                    <span key={s} style={{ padding: "6px 13px", border: "1px solid var(--line)", borderRadius: 999, background: "var(--card)" }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div data-reveal data-reveal-delay="160" style={{ ...reveal, flex: "1 1 280px" }}>
              <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 40px rgba(26,26,21,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 16px", borderBottom: "1px solid var(--line)", fontFamily: MONO, fontSize: 11.5, color: "var(--muted)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
                  profile.json
                </div>
                <div style={{ padding: "8px 18px 14px", fontFamily: MONO, fontSize: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "11px 0", borderBottom: "1px dashed var(--line)" }}>
                    <span style={{ color: "var(--muted)" }}>{t.about.stat.statusK}</span>
                    <span style={{ color: "var(--accent)", fontWeight: 600 }}>{t.about.stat.statusV}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "11px 0", borderBottom: "1px dashed var(--line)" }}>
                    <span style={{ color: "var(--muted)" }}>{t.about.stat.locK}</span>
                    <span style={{ color: "var(--ink)" }}>{t.about.stat.locV}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "11px 0" }}>
                    <span style={{ color: "var(--muted)" }}>{t.about.stat.focusK}</span>
                    <span style={{ color: "var(--ink)" }}>{t.about.stat.focusV}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" style={{ scrollMarginTop: 90, padding: "clamp(60px,8vw,100px) 28px", position: "relative" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div data-reveal style={{ ...reveal, marginBottom: "clamp(28px,4vw,44px)" }}>
            <div style={{ fontFamily: MONO, fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>{t.work.tag}</div>
            <h2 style={{ fontSize: "clamp(28px,4.4vw,50px)", fontWeight: 600, letterSpacing: "-0.032em", lineHeight: 1.08, margin: "16px 0 8px" }}>{t.work.heading}</h2>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "var(--muted)", margin: 0, maxWidth: "50ch" }}>{t.work.sub}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <article className="lp-proj" data-reveal data-reveal-delay="100" style={{ ...reveal, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden", display: "flex", flexWrap: "wrap", boxShadow: "0 14px 50px rgba(26,26,21,0.05)" }}>
              <div style={{ flex: "1 1 380px", background: "linear-gradient(140deg,#e8f1ec,#f4f2eb)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(20px,3vw,36px)", minHeight: 248 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/projects/gaon-care-hero.png" alt="가온케어 — 우산 대여·반납 서비스" loading="lazy" style={{ width: "100%", maxWidth: 440, height: "auto", display: "block" }} />
              </div>
              <div style={{ flex: "1 1 360px", padding: "clamp(24px,3.4vw,38px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 13, fontFamily: MONO, fontSize: 12 }}>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>01</span>
                  <span style={{ color: "var(--muted)" }}>{t.proj.year}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--accent)" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", animation: "dotpulse 2.4s infinite" }} />live
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 11, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1, margin: 0 }}>{t.proj.title}</h3>
                  <span style={{ fontFamily: MONO, fontSize: 14, color: "var(--accent)" }}>gaon-care</span>
                </div>
                <p style={{ fontSize: "clamp(15px,1.5vw,17px)", fontWeight: 500, color: "var(--ink)", margin: 0, letterSpacing: "-0.01em" }}>{t.proj.subtitle}</p>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--muted)", margin: 0, maxWidth: "54ch", textWrap: "pretty" }}>{t.proj.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, fontFamily: MONO, fontSize: 12, marginTop: 2 }}>
                  {t.proj.feat.map((f) => (
                    <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", border: "1px solid var(--line)", borderRadius: 8, background: "var(--paper)" }}>
                      <span style={{ color: "var(--accent)" }}>▸</span>{f}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18, marginTop: 8, fontFamily: MONO, fontSize: 13 }}>
                  <a className="lp-link" href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid var(--line)", paddingBottom: 2 }}>
                    GitHub <span style={{ color: "var(--accent)" }}>↗</span>
                  </a>
                  <span style={{ color: "var(--muted)" }}>{t.proj.role}</span>
                </div>
              </div>
            </article>
            <div data-reveal data-reveal-delay="160" style={{ ...reveal, border: "1px dashed var(--line)", borderRadius: 20, padding: "20px 26px", display: "flex", alignItems: "center", gap: 9, fontFamily: MONO, fontSize: 13, color: "var(--muted)" }}>
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>$</span>
              {t.work.next}
              <span style={{ display: "inline-block", width: 7, height: "1.05em", background: "var(--accent)", animation: "blink 1s steps(1) infinite", verticalAlign: -2, borderRadius: 1, marginLeft: 1 }} />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" style={{ scrollMarginTop: 90, padding: "clamp(70px,10vw,130px) 28px clamp(50px,6vw,80px)", position: "relative" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div data-reveal style={{ ...reveal, maxWidth: 640 }}>
            <div style={{ fontFamily: MONO, fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>{t.contact.tag}</div>
            <h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "14px 0 12px" }}>{t.contact.heading}</h2>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "var(--muted)", margin: 0, maxWidth: "44ch" }}>{t.contact.body}</p>
          </div>
          <div data-reveal data-reveal-delay="120" style={{ ...reveal, marginTop: "clamp(28px,4vw,42px)", maxWidth: 560, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", boxShadow: "0 14px 50px rgba(26,26,21,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderBottom: "1px solid var(--line)", background: "rgba(26,26,21,0.018)", fontFamily: MONO, fontSize: 11.5, color: "var(--muted)" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#e5564b" }} />
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#e8b23a" }} />
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#3bb665" }} />
              </div>
              contact.sh
            </div>
            <div style={{ padding: "20px 22px 22px", fontFamily: MONO, fontSize: 13.5, lineHeight: 1.5 }}>
              <div style={{ marginBottom: 16 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>guest@lena</span>
                <span style={{ color: "var(--muted)" }}> ~ % ./contact.sh</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "11px 16px", alignItems: "center" }}>
                <span style={{ color: "var(--muted)" }}>email</span>
                <a className="lp-link" href={`mailto:${t.contact.email}`} style={{ color: "var(--ink)", textDecoration: "none" }}>{t.contact.email}</a>
                <button ref={copyBtnRef} className="lp-copy" onClick={copyEmail} style={{ fontFamily: MONO, fontSize: 11.5, border: "1px solid var(--line)", background: "var(--paper)", color: "var(--muted)", padding: "3px 11px", borderRadius: 7, cursor: "pointer", justifySelf: "end" }}>copy</button>
                <span style={{ color: "var(--muted)" }}>github</span>
                <a className="lp-link" href={t.contact.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "none" }}>{t.contact.github}</a>
                <a href={t.contact.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none", justifySelf: "end" }}>↗</a>
                <span style={{ color: "var(--muted)" }}>insta</span>
                <a className="lp-link" href={t.contact.instaUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "none" }}>{t.contact.insta}</a>
                <a href={t.contact.instaUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none", justifySelf: "end" }}>↗</a>
              </div>
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--line)", display: "flex", alignItems: "center", gap: 9, color: "var(--muted)", fontSize: 12.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 3px var(--accent-soft)" }} />
                {t.contact.status}
              </div>
              <div style={{ marginTop: 13, color: "var(--muted)" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>guest@lena</span> ~ %{" "}
                <span style={{ display: "inline-block", width: 7, height: "1.05em", background: "var(--accent)", animation: "blink 1s steps(1) infinite", verticalAlign: -2, borderRadius: 1 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--line)", padding: 28, textAlign: "center", fontFamily: MONO, fontSize: 12, color: "var(--muted)" }}>{t.footer}</footer>

      <div style={{ position: "fixed", bottom: 22, right: 22, zIndex: 55, display: "flex", alignItems: "center", gap: 3, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 999, padding: "6px 8px", boxShadow: "0 8px 30px rgba(26,26,21,0.13)" }}>
        <span style={{ fontFamily: MONO, color: "var(--muted)", fontSize: 11, padding: "0 7px" }}>hero</span>
        {switchBtn("terminal", "term")}
        {switchBtn("editorial", "edit")}
        {switchBtn("code", "code")}
      </div>
    </div>
  );
}
