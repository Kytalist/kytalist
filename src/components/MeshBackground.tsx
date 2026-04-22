export function MeshBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-linear-to-b from-[#F9F8F6] via-[#F9F8F6]/80 to-transparent" />
      <div
        className="mesh-blob blob-1 absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full opacity-60 mix-blend-multiply blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, #FFE4C4 0%, rgba(255, 228, 196, 0) 70%)",
        }}
      />
      <div
        className="mesh-blob blob-2 absolute -right-[5%] top-[20%] h-[60vw] w-[60vw] rounded-full opacity-60 mix-blend-multiply blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, #A3E4D7 0%, rgba(163, 228, 215, 0) 70%)",
        }}
      />
      <div
        className="mesh-blob blob-3 absolute bottom-[-20%] left-[20%] h-[45vw] w-[45vw] rounded-full opacity-60 mix-blend-multiply blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, #FFDAB9 0%, rgba(255, 218, 185, 0) 70%)",
        }}
      />
    </div>
  );
}
