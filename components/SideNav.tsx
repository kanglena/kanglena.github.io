"use client";
import { usePathname } from "next/navigation";
import NavItem, { NavData } from "./NavItem";

export const NAV_ITEMS: NavData[] = [
  { href: "/", label: "홈", icon: "⌂", desc: "처음으로" },
  { href: "/about", label: "소개", icon: "👤", desc: "나는 누구?" },
  { href: "/projects", label: "프로젝트", icon: "🗂", desc: "내가 만든 것들" },
  { href: "/blog", label: "블로그", icon: "✎", desc: "요즘 끄적이는 글" },
  { href: "/contact", label: "연락처", icon: "✉", desc: "말 걸어 주세요" },
];

export default function SideNav() {
  const path = usePathname();
  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);
  return (
    <nav aria-label="메뉴" className="flex flex-col gap-2 p-3 sm:p-4">
      {NAV_ITEMS.map((it) => (
        <NavItem key={it.href} item={it} active={isActive(it.href)} />
      ))}
    </nav>
  );
}
