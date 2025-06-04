import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "LocaleLoop";
  const description =
    searchParams.get("description") || "Curated City Guides by Locals";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "48px",
            margin: "48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            maxWidth: "90%",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: "24px",
            }}
          >
            LocaleLoop
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "#1f2937",
              marginBottom: "16px",
              maxWidth: "800px",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#6b7280",
              maxWidth: "600px",
              lineHeight: 1.3,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
