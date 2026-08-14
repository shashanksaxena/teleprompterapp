import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, rgba(104, 174, 255, 0.9), transparent 45%), linear-gradient(180deg, #0e1726 0%, #0a1018 100%)"
        }}
      >
        <div
          style={{
            display: "flex",
            height: 392,
            width: 392,
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 88,
            border: "10px solid rgba(255,255,255,0.16)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
            padding: "48px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "white"
              }}
            >
              FT
            </div>
            <div
              style={{
                height: 18,
                width: 18,
                borderRadius: 999,
                background: "#59d185",
                boxShadow: "0 0 0 10px rgba(89, 209, 133, 0.18)"
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            {[1, 2, 3, 4, 5].map((line) => (
              <div
                key={line}
                style={{
                  height: 18,
                  width: line === 5 ? "62%" : line % 2 === 0 ? "78%" : "100%",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.88)"
                }}
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14
            }}
          >
            <div
              style={{
                height: 14,
                width: 110,
                borderRadius: 999,
                background: "#60a5fa"
              }}
            />
            <div
              style={{
                height: 14,
                width: 62,
                borderRadius: 999,
                background: "rgba(255,255,255,0.28)"
              }}
            />
          </div>
        </div>
      </div>
    ),
    size
  );
}
