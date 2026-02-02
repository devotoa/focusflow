import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, message } = body;

    console.log('Recibido:', { task, message });

    const webhookUrl = 'https://discord.com/api/webhooks/1467992560097034252/Y4Ee_Y5HHld0tG-jDd8Y5mOcHVmTGQp_fJji7JtUD6MMmXvA2Bj_uetRiwBov_HUqEbH';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Discord error', status: response.status, details: errorText },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Exception:', error);
    return NextResponse.json(
      { error: 'Exception', message: error.message },
      { status: 500 }
    );
  }
}