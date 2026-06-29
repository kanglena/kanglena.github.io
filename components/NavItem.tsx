import Link from "next/link";

export type NavData = { href: string; label: string; icon: string; desc: string };

export default function NavItem({
  item, active,
}: { item: NavData; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="nb-border flex items-center gap-2 rounded-[9px] px-3 py-2 text-[13px]"
      style={{
        background: active ? "var(--mint)" : "var(--paper)",
        boxShadow: active ? "3px 3px 0 var(--ink)" : "none",
        color: "var(--ink)",
      }}
    >
      <span aria-hidden style={{ width: 18, textAlign: "center" }}>{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
}
