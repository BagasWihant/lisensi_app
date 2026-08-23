import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse(null, {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure API"' },
      });
    }

    const authValue = authHeader.split(' ')[1];
    const decodedAuth = Buffer.from(authValue, 'base64').toString('utf-8');
    const [username, ...passwordParts] = decodedAuth.split(':');
    const password = passwordParts.join(':');

    const expectedUsername = process.env.API_USERNAME || process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.API_PASSWORD || process.env.ADMIN_PASSWORD;

    if (!expectedUsername || !expectedPassword || username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { license_id, machine_id, usage, topup } = body;

    if (!license_id || typeof license_id !== 'string') {
      return NextResponse.json({
        valid: false,
        license_id: license_id || null,
        message: "Missing or invalid payload"
      }, { status: 400 });
    }

    const rows = await db.execute(
      'SELECT status, environments, machine_id FROM licenses WHERE license_id = ?',
      [license_id]
    ) as Record<string, unknown>[];

    if (rows && rows.length > 0) {
      const license = rows[0];
      if (license.status === 'on') {
        // Machine ID Binding Logic
        if (machine_id) {
          if (!license.machine_id) {
            // First time use, bind it
            await db.execute(
              'UPDATE licenses SET machine_id = ? WHERE license_id = ?',
              [machine_id, license_id]
            );
          } else if (license.machine_id !== machine_id) {
            // Bound to a different machine
            return NextResponse.json({
              valid: false,
              license_id,
              message: "License already bound to another device."
            }, { status: 403 });
          }
        } else if (license.machine_id) {
          // Request has no machine_id, but license is already bound
          return NextResponse.json({
            valid: false,
            license_id,
            message: "Machine ID is required. License already bound to a device."
          }, { status: 403 });
        }

        let environments: Record<string, any> = {};
        if (license.environments) {
          try {
            environments = typeof license.environments === 'string' ? JSON.parse(license.environments) : license.environments;
          } catch (e) {
            console.error('Failed to parse environments JSON', e);
          }
        }

        // Balance Logic
        let currentBalance = parseFloat(environments['BALANCE'] || '0');
        if (isNaN(currentBalance)) currentBalance = 0;

        const numUsage = parseFloat(usage || '0');
        const numTopup = parseFloat(topup || '0');
        const finalUsage = isNaN(numUsage) ? 0 : numUsage;
        const finalTopup = isNaN(numTopup) ? 0 : numTopup;

        if (finalUsage > 0 || finalTopup > 0) {
          const newBalance = currentBalance + finalTopup - finalUsage;

          if (newBalance < 0) {
            return NextResponse.json({
              valid: false,
              license_id,
              message: "Insufficient balance."
            }, { status: 403 });
          }

          environments['BALANCE'] = newBalance.toFixed(2);

          await db.execute(
            'UPDATE licenses SET environments = ? WHERE license_id = ?',
            [JSON.stringify(environments), license_id]
          );
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
