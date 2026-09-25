function Orb({ size = 200 }) {
  return (
    <div
      className="relative flex items-center justify-center pointer-events-none"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute rounded-full animate-orb-pulse"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          background:
            'radial-gradient(circle, var(--color-accent) 0%, transparent 65%)',
          filter: `blur(${size * 0.25}px)`,
          opacity: 0.35,
        }}
      />
      <div
        className="absolute rounded-full animate-orb-pulse"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background: 'radial-gradient(circle, #6366f1 0%, transparent 60%)',
          filter: `blur(${size * 0.2}px)`,
          opacity: 0.25,
          animationDelay: '1s',
        }}
      />
      <div
        className="absolute rounded-full animate-orb-spin"
        style={{
          width: size * 0.55,
          height: size * 0.55,
          background:
            'conic-gradient(from 0deg, var(--color-accent), var(--color-accent-glow), transparent, var(--color-accent))',
          filter: `blur(${size * 0.1}px)`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.32,
          height: size * 0.32,
          background: 'var(--color-bg)',
          filter: `blur(${size * 0.12}px)`,
          opacity: 0.85,
        }}
      />
    </div>
  )
}

export default Orb