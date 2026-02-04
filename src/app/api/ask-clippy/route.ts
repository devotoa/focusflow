import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1467992560097034252/Y4Ee_Y5HHld0tG-jDd8Y5mOcHVmTGQp_fJji7JtUD6MMmXvA2Bj_uetRiwBov_HUqEbH';

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

    // Discord webhook responde 204 No Content (sin body)
    // o a veces JSON con info del mensaje
    let result = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { raw: responseText };
      }
    }
    
    console.log('Tarea enviada a Discord:', response.status, result);

    return NextResponse.json({ 
      success: true, 
      message: 'Tarea enviada a Clippy',
      result 
    });
  } catch (error: any) {
    console.error('Exception al enviar a Discord:', error);
    return NextResponse.json(
      { error: 'Exception', message: error.message },
      { status: 500 }
    );
  }
}
