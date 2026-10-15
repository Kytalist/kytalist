export function MeshBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#F9F8F6]" />
      <div className="absolute inset-x-0 top-0 h-[55vh] bg-linear-to-b from-[#EFEDE7] to-transparent" />
    </div>
  );
}
