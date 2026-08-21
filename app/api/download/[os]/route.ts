import { NextRequest, NextResponse } from "next/server";

const INSTALLERS: Record<string, string> = {
  windows: "https://cdn.prowler.io/installers/Prowler.io-Setup.exe",
  mac: "https://cdn.prowler.io/installers/Prowler.io.dmg",
  linux: "https://cdn.prowler.io/installers/prowler-io.deb",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ os: string }> }
) {
  // Await the asynchronous params object in Next.js 15/16
  const { os } = await params;
  const targetOs = os.toLowerCase();
  const url = INSTALLERS[targetOs];

  if (!url) {
    return NextResponse.json({ error: "Invalid OS" }, { status: 400 });
  }

  return NextResponse.json(
    {
      message:
        "Installers will be available once uploaded. Check your email after purchase for the download link.",
      os: targetOs,
    },
    { status: 200 }
  );
}