import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #f7fbff 0%, #dcecff 100%)"
        }}
      >
        <div
          style={{
            display: "flex",
            height: 148,
            width: 148,
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 34,
            background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
            boxShadow: "0 16px 40px rgba(17, 24, 39, 0.2)",
            padding: "20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ color: "white", fontSize: 22, fontWeight: 800 }}>FT</div>
            <div style={{ height: 10, width: 10, borderRadius: 999, background: "#60a5fa" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map((line) => (
              <div
                key={line}
                style={{
                  height: 9,
                  width: line === 3 ? "70%" : "100%",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.9)"
                }}
              />
            ))}
          </div>

          <div style={{ height: 8, width: "52%", borderRadius: 999, background: "#60a5fa" }} />
        </div>
      </div>
    ),
    size
  );
}
