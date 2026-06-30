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
      year: "2026 — 준비 중",
      solo: "1인 개발",
      title: "Gaon Care",
      subtitle: "학생회 우산 대여, 수기에서 디지털로.",
      surfaces: [
        { k: "FO", v: "학생 키오스크" },
        { k: "BO", v: "학생회 대시보드" },
      ],
      feat: ["QR 대여·반납", "연체 자동 감지", "QR 라벨 출력"],
      stack: "Next.js 16 · React 19 · TypeScript · Supabase · Tailwind",
      builtWith: "Claude Design · Claude Code",
      desc: "우산 QR을 찍고 5자리 학번만 누르면 대여, 반납은 QR만 다시 찍으면 끝. 학생회는 재고·대여 현황·3일 초과 연체를 한 화면에서 관리합니다.",
    },
    contact: { tag: "$ ./contact.sh", heading: "공모전·대회, 같이 나가요", body: "공모전이나 대회 같이 나갈 사람, 협업하고 싶은 사람 찾고 있어요. 그냥 궁금한 것도 편하게 연락 주세요!", email: "lenakang0002@gmail.com", github: "github.com/kanglena", status: "공모전 · 협업 같이 할 사람 찾는 중" },
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
      year: "2026 — in progress",
      solo: "solo build",
      title: "Gaon Care",
      subtitle: "Student-council umbrella rental, from paper to digital.",
      surfaces: [
        { k: "FO", v: "student kiosk" },
        { k: "BO", v: "council dashboard" },
      ],
      feat: ["QR rent / return", "Overdue alerts", "QR label print"],
      stack: "Next.js 16 · React 19 · TypeScript · Supabase · Tailwind",
      builtWith: "Claude Design · Claude Code",
      desc: "Scan an umbrella's QR and tap a 5-digit student ID to rent; return is just one more scan. The council tracks stock, active rentals, and 3-day overdue items on one screen.",
    },
    contact: { tag: "$ ./contact.sh", heading: "Let's team up", body: "Looking for people to enter contests and competitions with — collabs and questions welcome too. Reach out anytime!", email: "lenakang0002@gmail.com", github: "github.com/kanglena", status: "looking for contest & collab teammates" },
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
            <article className="lp-proj" data-reveal data-reveal-delay="100" style={{ ...reveal, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden", display: "flex", flexWrap: "wrap", boxShadow: "0 20px 55px rgba(26,26,21,0.09)" }}>
              <div style={{ flex: "1 1 380px", background: "linear-gradient(140deg,#e8f1ec,#f4f2eb)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(20px,3vw,36px)", minHeight: 248 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/projects/gaon-care-hero.png" alt="가온케어 — 우산 대여·반납 서비스" loading="lazy" style={{ width: "100%", maxWidth: 440, height: "auto", display: "block" }} />
              </div>
              <div style={{ flex: "1 1 400px", padding: "clamp(26px,3.4vw,40px)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: "clamp(12px,1.6vw,18px)", alignItems: "flex-start" }}>
                  <div style={{ fontFamily: MONO, fontSize: "clamp(38px,5vw,54px)", fontWeight: 700, lineHeight: 0.82, color: "rgba(16,134,75,0.18)", flex: "none" }}>01</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <h3 style={{ fontSize: "clamp(32px,4.6vw,46px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 0.95, margin: 0 }}>{t.proj.title}</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 12, color: "var(--muted)", border: "1px solid var(--line)", borderRadius: 999, padding: "4px 11px" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#c8a93a" }} />{t.proj.year}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 12, color: "var(--accent)", background: "var(--accent-soft)", borderRadius: 999, padding: "4px 12px", fontWeight: 600 }}>{t.proj.solo}</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "clamp(16px,1.6vw,18px)", fontWeight: 600, color: "var(--ink)", margin: "22px 0 0", letterSpacing: "-0.01em", lineHeight: 1.4 }}>{t.proj.subtitle}</p>

                <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                  {t.proj.surfaces.map((s, i) => (
                    <span key={s.k} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {i > 0 && <span style={{ color: "var(--muted)", fontFamily: MONO }}>+</span>}
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 12px", border: "1px solid var(--line)", borderRadius: 10, background: "var(--paper)" }}>
                        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>{s.k}</span>
                        <span style={{ fontSize: 13, color: "var(--ink)" }}>{s.v}</span>
                      </span>
                    </span>
                  ))}
                </div>

                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--muted)", margin: "16px 0 0", maxWidth: "56ch", textWrap: "pretty" }}>{t.proj.desc}</p>

                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px dashed var(--line)", display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 16px", fontFamily: MONO, fontSize: 12.5, alignItems: "start" }}>
                  <span style={{ color: "var(--accent)" }}>features</span>
                  <span style={{ color: "var(--ink)" }}>{t.proj.feat.join(" · ")}</span>
                  <span style={{ color: "var(--accent)" }}>stack</span>
                  <span style={{ color: "var(--ink)" }}>{t.proj.stack}</span>
                  <span style={{ color: "var(--accent)" }}>built with</span>
                  <span style={{ color: "var(--ink)" }}>{t.proj.builtWith}</span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginTop: 18, fontFamily: MONO, fontSize: 13 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--muted)" }} aria-label="GitHub — 준비 중">
                    <svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    GitHub
                  </span>
                  <span style={{ fontSize: 11, border: "1px solid var(--line)", borderRadius: 6, padding: "2px 7px", color: "var(--muted)" }}>준비 중</span>
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
          <div data-reveal style={{ ...reveal, maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontFamily: MONO, fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>{t.contact.tag}</div>
            <h2 style={{ fontSize: "clamp(26px,3.8vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "14px 0 12px" }}>{t.contact.heading}</h2>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "var(--muted)", margin: "0 auto", maxWidth: "44ch" }}>{t.contact.body}</p>
          </div>
          <div data-reveal data-reveal-delay="120" style={{ ...reveal, margin: "clamp(28px,4vw,42px) auto 0", maxWidth: 560, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", boxShadow: "0 14px 50px rgba(26,26,21,0.05)" }}>
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
                <span style={{ color: "var(--ink)", display: "inline-flex", alignItems: "center", gap: 7 }}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  {t.contact.github}
                </span>
                <span style={{ fontSize: 11, border: "1px solid var(--line)", borderRadius: 6, padding: "2px 7px", color: "var(--muted)", justifySelf: "end" }}>준비 중</span>
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
