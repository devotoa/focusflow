import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, message } = body;

    console.log('Recibido:', { task, message });

    // Webhook de Discord
    const webhookUrl = 'https://discord.com/api/webhooks/1467992560097034252/Y4Ee_Y5HHld0tG-jDd8Y5mOcHVmTGQp_fJji7JtUD6MMmXvA2Bj_uetRiwBov_HUqEbH';

    // Mensaje con mención a Clippy para activarlo
    // ID de Clippy: 1467274104791896187
    const messageWithMention = `${message}\n\n<@1467274104791896187> por favor, hacé esta tarea.`;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: messageWithMention,
        username: 'FocusFlow',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        allowed_mentions: {
          users: ['1467274104791896187']
        }
      }),
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