import { NextRequest, NextResponse } from "next/server";

const INSTALLERS: Record<string, string> = {
  windows: "https://cdn.prowler.io/installers/Prowler.io-Setup.exe",
  mac: "https://cdn.prowler.io/installers/Prowler.io.dmg",
  linux: "https://cdn.prowler.io/installers/prowler-io.deb",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { os: string } }
) {
  const os = params.os.toLowerCase();
  const url = INSTALLERS[os];

  if (!url) {
    return NextResponse.json({ error: "Invalid OS" }, { status: 400 });
  }

  // When you have real installer URLs, this will redirect
  // For now return a helpful message
  return NextResponse.json(
    {
      message:
        "Installers will be available once uploaded. Check your email after purchase for the download link.",
      os,
    },
    { status: 200 }
  );
}