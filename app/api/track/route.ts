import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.ip ?? 'unknown';

  console.log("Visitor IP:", ip); // You can send this to a DB or a log service

  return NextResponse.json({ ip });
}
