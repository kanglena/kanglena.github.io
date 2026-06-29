export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="nb-card p-6 text-center" style={{ color: "var(--muted)" }}>{message}</div>
  );
}
