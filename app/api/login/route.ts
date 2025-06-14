import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const { email, password } = data;

  // Here you can do your authentication logic, DB check, etc.
  if (email === "jad.madi@net.usj.edu.lb" && password === "Jad1@34") {
    return NextResponse.json({ success: true, message: "Login successful" });
  }

  return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
}
