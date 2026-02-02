import { NextRequest, NextResponse } from 'next/server';

// URL de ngrok (la vas a obtener cuando corras: ngrok http 18789)
const OPENCLAW_GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789/v1/sessions/send';
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || 'f7a0e919f5098185130307ba888aadd525fa3a5657048850';
const DISCORD_CHANNEL_ID = '1467992360599294033';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task } = body;

    const message = `🤖 **Nueva tarea desde FocusFlow**\n\n**Título:** ${task.title}\n**Categoría:** ${task.category}\n**Prioridad:** ${task.priority}\n**Estado:** ${task.status}\n${task.description ? `**Descripción:** ${task.description}` : ''}\n\nPor favor, ejecutá esta tarea y reportá el resultado.`;

    // Enviar directamente al Gateway de OpenClaw
    const response = await fetch(OPENCLAW_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      },
      body: JSON.stringify({
        sessionKey: `agent:main:discord:channel:${DISCORD_CHANNEL_ID}`,
        message: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gateway error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Gateway error', status: response.status, details: errorText },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Tarea enviada a Clippy' });
  } catch (error: any) {
    console.error('Exception:', error);
    return NextResponse.json(
      { error: 'Exception', message: error.message },
      { status: 500 }
    );
  }
}