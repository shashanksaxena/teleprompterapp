import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "radial-gradient(circle at top left, rgba(96, 165, 250, 0.35), transparent 30%), radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.18), transparent 24%), linear-gradient(135deg, #0f172a 0%, #111827 55%, #030712 100%)",
          color: "white",
          padding: "52px 60px"
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: 32
          }}
        >
          <div
            style={{
              display: "flex",
              maxWidth: 720,
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div
                style={{
                  display: "flex",
                  width: 260,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.06)",
                  padding: "10px 18px",
                  fontSize: 24,
                  fontWeight: 700
                }}
              >
                FreeTeleprompter.in
              </div>
              <div
                style={{
                  fontSize: 72,
                  lineHeight: 1.06,
                  fontWeight: 800,
                  letterSpacing: "-0.045em"
                }}
              >
                Free online teleprompter for videos, reels and presentations
              </div>
              <div
                style={{
                  maxWidth: 640,
                  fontSize: 30,
                  lineHeight: 1.35,
                  color: "rgba(255,255,255,0.82)"
                }}
              >
                Smooth scrolling, mirror mode, voice scroll, saved scripts, and camera-ready recording in one fast
                browser app.
              </div>
            </div>

            <div style={{ display: "flex", gap: 18, fontSize: 24, color: "rgba(255,255,255,0.9)" }}>
              <div>Voice scroll</div>
              <div>Mirror mode</div>
              <div>Video recording</div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: 320,
              flexShrink: 0,
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 42,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
              boxShadow: "0 28px 80px rgba(0,0,0,0.28)",
              padding: "28px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800 }}>FT</div>
              <div style={{ height: 14, width: 14, borderRadius: 999, background: "#60a5fa" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[1, 2, 3, 4, 5, 6].map((line) => (
                <div
                  key={line}
                  style={{
                    height: 14,
                    width: line === 6 ? "58%" : line % 2 === 0 ? "76%" : "100%",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.92)"
                  }}
                />
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ height: 12, width: "60%", borderRadius: 999, background: "#60a5fa" }} />
              <div
                style={{
                  height: 12,
                  width: "92%",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.24)"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
