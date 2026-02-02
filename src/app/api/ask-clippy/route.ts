import { NextRequest, NextResponse } from 'next/server';

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const CHANNEL_ID = '1467992360599294033'; // focus-flow channel
const CLIPPY_USER_ID = '1467274104791896187';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, message } = body;

    if (!DISCORD_BOT_TOKEN) {
      return NextResponse.json(
        { error: 'Bot token no configurado' },
        { status: 500 }
      );
    }

    // Enviar mensaje usando el Bot de Discord
    const discordApiUrl = `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`;
    
    const messageWithMention = `${message}\n\n<@${CLIPPY_USER_ID}> por favor, hacé esta tarea.`;

    const response = await fetch(discordApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: messageWithMention,
        allowed_mentions: {
          users: [CLIPPY_USER_ID]
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Discord API error', status: response.status, details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('Mensaje enviado:', data.id);

    return NextResponse.json({ success: true, messageId: data.id });
  } catch (error: any) {
    console.error('Exception:', error);
    return NextResponse.json(
      { error: 'Exception', message: error.message },
      { status: 500 }
    );
  }
}