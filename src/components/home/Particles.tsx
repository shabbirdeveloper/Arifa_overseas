/**
 * Floating dust motes over the hero.
 *
 * The legacy script generated these with Math.random() on every load. Fixed
 * values look identical, render on the server (no hydration mismatch, no
 * client JS at all) and keep the markup stable between renders.
 */
const PARTICLES = [
  { size: 4.1, left: 6, duration: 13, delay: 0 },
  { size: 2.4, left: 14, duration: 18, delay: 2.4 },
  { size: 5.8, left: 21, duration: 10, delay: 5.1 },
  { size: 3.2, left: 29, duration: 16, delay: 1.2 },
  { size: 2.1, left: 36, duration: 12, delay: 6.8 },
  { size: 6.4, left: 43, duration: 19, delay: 3.3 },
  { size: 3.7, left: 50, duration: 9, delay: 7.5 },
  { size: 2.8, left: 57, duration: 15, delay: 0.9 },
  { size: 5.2, left: 63, duration: 11, delay: 4.6 },
  { size: 3.4, left: 70, duration: 17, delay: 2.1 },
  { size: 2.2, left: 76, duration: 14, delay: 6.2 },
  { size: 6.1, left: 82, duration: 20, delay: 1.7 },
  { size: 3.9, left: 88, duration: 8, delay: 5.7 },
  { size: 2.6, left: 93, duration: 16, delay: 3.9 },
  { size: 4.8, left: 97, duration: 12, delay: 7.1 },
  { size: 3.1, left: 2, duration: 18, delay: 4.2 },
] as const;

export function Particles() {
  return (
    <div id="particles" aria-hidden="true">
      {PARTICLES.map((particle) => (
        <div
          key={`${particle.left}-${particle.delay}`}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
