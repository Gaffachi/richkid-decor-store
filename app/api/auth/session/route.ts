import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@/lib/auth/session";

const bodySchema = z.object({ idToken: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing or invalid idToken." }, { status: 400 });
  }

  try {
    const sessionCookie = await getAdminAuth().createSessionCookie(parsed.data.idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Could not create session." }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
