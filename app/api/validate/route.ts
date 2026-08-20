import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { license_id } = body;

    if (!license_id || typeof license_id !== 'string') {
      return NextResponse.json({
        valid: false,
        license_id: license_id || null,
        message: "Missing or invalid payload"
      }, { status: 400 });
    }

    const rows = await db.execute(
      'SELECT status, environments FROM licenses WHERE license_id = ?',
      [license_id]
    ) as Record<string, unknown>[];

    if (rows && rows.length > 0) {
      const license = rows[0];
      if (license.status === 'on') {
        let environments = {};
        if (license.environments) {
          try {
            environments = typeof license.environments === 'string' ? JSON.parse(license.environments) : license.environments;
          } catch (e) {
            console.error('Failed to parse environments JSON', e);
          }
        }

        return NextResponse.json({
          valid: true,
          license_id,
          message: "License is valid.",
          environments
        }, { status: 200 });
      } else {
        return NextResponse.json({
          valid: false,
          license_id,
          message: "License is inactive."
        }, { status: 400 });
      }
    }

    // Not found
    return NextResponse.json({
      valid: false,
      license_id,
      message: "License is invalid or does not exist."
    }, { status: 404 });

  } catch (error) {
    return NextResponse.json({
      valid: false,
      message: "Internal Server Error"
    }, { status: 500 });
  }
}
