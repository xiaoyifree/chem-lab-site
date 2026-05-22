const bubbleSpec = [
  { x: "18%", duration: "2.5s", delay: "-0.2s", size: "16px" },
  { x: "24%", duration: "3s", delay: "-0.8s", size: "12px" },
  { x: "33%", duration: "2.7s", delay: "-1.1s", size: "18px" },
  { x: "58%", duration: "2.8s", delay: "-0.4s", size: "14px" },
  { x: "67%", duration: "3.1s", delay: "-1.6s", size: "20px" },
  { x: "74%", duration: "2.6s", delay: "-0.9s", size: "12px" }
];

const precipitateSpec = [
  { x: "60%", y: "52%" },
  { x: "66%", y: "58%" },
  { x: "73%", y: "48%" },
  { x: "79%", y: "56%" }
];

const hazeSpec = [
  { x: "16%", y: "22%", w: "140px" },
  { x: "42%", y: "8%", w: "120px" },
  { x: "58%", y: "28%", w: "154px" }
];

export function ReactionScene({ variant = "hero" }) {
  const className = variant === "feature" ? "reaction-shell reaction-feature" : "reaction-shell";

  return (
    <div className={className} aria-hidden="true">
      <div className="gas-haze">
        {hazeSpec.map((item, index) => (
          <span
            key={`haze-${index}`}
            style={{ "--x": item.x, "--y": item.y, "--w": item.w }}
          />
        ))}
      </div>
      <div className="liquid-column liquid-left" />
      <div className="liquid-column liquid-right" />
      <div className="bubble-stream">
        {bubbleSpec.map((item, index) => (
          <span
            key={`bubble-${index}`}
            style={{
              "--x": item.x,
              "--duration": item.duration,
              "--delay": item.delay,
              "--size": item.size
            }}
          />
        ))}
      </div>
      <div className="precipitate-cloud">
        {precipitateSpec.map((item, index) => (
          <span key={`cloud-${index}`} style={{ "--x": item.x, "--y": item.y }} />
        ))}
      </div>
      <div className="glow-ring" />
      <div className="spark-core" />
    </div>
  );
}
