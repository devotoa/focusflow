import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { task, message } = await request.json();

    // Discord webhook URL - deberías configurar esto en Vercel
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!discordWebhookUrl) {
      console.error('DISCORD_WEBHOOK_URL no configurado');
      return NextResponse.json(
        { error: 'Discord webhook no configurado' },
        { status: 500 }
      );
    }

    // Enviar mensaje a Discord
    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
        embeds: [
          {
            title: `📋 ${task.title}`,
            description: task.description || 'Sin descripción',
            color: task.priority === 'high' ? 0xff0000 : task.priority === 'medium' ? 0xffaa00 : 0x00ff00,
            fields: [
              { name: 'Categoría', value: task.category, inline: true },
              { name: 'Prioridad', value: task.priority, inline: true },
              { name: 'Estado', value: task.status, inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Error enviando a Discord:', await response.text());
      return NextResponse.json(
        { error: 'Error enviando mensaje a Discord' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en ask-clippy:', error);
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}