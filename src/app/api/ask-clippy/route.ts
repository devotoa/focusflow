import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1467992560097034252/Y4Ee_Y5HHld0tG-jDd8Y5mOcHVmTGQp_fJji7JtUD6MMmXvA2Bj_uetRiwBov_HUqEbH';
const CLIPPY_ROLE_ID = '1467276913201381572';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task } = body;

    const message = `🤖 **Nueva tarea para Clippy**\n\n**Título:** ${task.title}\n**Categoría:** ${task.category}\n**Prioridad:** ${task.priority}\n**Estado:** ${task.status}\n${task.description ? `**Descripción:** ${task.description}` : ''}\n\n<@&${CLIPPY_ROLE_ID}> por favor, hacé esta tarea.`;

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: message,
        allowed_mentions: { 
          parse: ['everyone', 'users', 'roles']
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Webhook error', status: response.status, details: errorText },
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