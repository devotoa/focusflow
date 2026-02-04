import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task } = body;

    if (!DISCORD_WEBHOOK_URL) {
      return NextResponse.json(
        { error: 'Webhook no configurado', message: 'Falta DISCORD_WEBHOOK_URL en variables de entorno' },
        { status: 500 }
      );
    }

    // Construir el mensaje para Discord
    const content = `🤖 **Nueva tarea desde FocusFlow**

📋 **[TASK]**
├─ 🆔 ID: \`${task.id ?? 'auto'}\`
├─ 📝 Título: **${task.title}**
├─ 📂 Categoría: ${task.category}
├─ 🔥 Prioridad: ${task.priority}
├─ 📊 Estado: ${task.status}
└─ 📝 Descripción: ${task.description ?? 'Sin descripción'}

➡️ @Clippy ejecutá esta tarea y reportá el resultado.`;

    // Enviar a Discord via Webhook
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
        allowed_mentions: {
          parse: ['users']
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de Discord Webhook:', response.status, errorText);
      return NextResponse.json(
        { error: 'Discord error', status: response.status, details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('Tarea enviada a Discord:', result);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Exception al enviar a Discord:', error);
    return NextResponse.json(
      { error: 'Exception', message: error.message },
      { status: 500 }
    );
  }
}
