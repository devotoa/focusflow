import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1467992560097034252/Y4Ee_Y5HHld0tG-jDd8Y5mOcHVmTGQp_fJji7JtUD6MMmXvA2Bj_uetRiwBov_HUqEbH';

export async function POST(request: NextRequest) {
  try {
    const { task, message } = await request.json();

    // Enviar mensaje a Discord
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error enviando a Discord:', errorText);
      return NextResponse.json(
        { error: 'Error enviando mensaje a Discord', details: errorText },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en ask-clippy:', error);
    return NextResponse.json(
      { error: 'Error interno', details: String(error) },
      { status: 500 }
    );
  }
}