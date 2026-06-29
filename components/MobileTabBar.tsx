"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./SideNav";

export default function MobileTabBar() {
  const path = usePathname();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <nav aria-label="메뉴" className="sm:hidden fixed inset-x-0 bottom-0 z-50 grid grid-cols-5"
         style={{ background: "var(--paper)", borderTop: "2.5px solid var(--ink)",
                  paddingBottom: "env(safe-area-inset-bottom)" }}>
      {NAV_ITEMS.map((it) => {
        const on = isActive(it.href);
        return (
          <Link key={it.href} href={it.href} aria-current={on ? "page" : undefined}
            className="flex flex-col items-center justify-center py-2 text-[11px]"
            style={{ background: on ? "var(--mint)" : "transparent",
                     minHeight: 56, borderRight: "1px solid var(--ink)" }}>
            <span aria-hidden style={{ fontSize: 18 }}>{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
