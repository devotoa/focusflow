import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);


const DISCORD_CHANNEL_ID = '1467992360599294033';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task } = body;

    // Construir el mensaje para Clippy
    const message = `🤖 **Nueva tarea desde FocusFlow**

📋 **[TASK]**
├─ 🆔 ID: \`${task.id ?? 'auto'}\`
├─ 📝 Título: **${task.title}**
├─ 📂 Categoría: ${task.category}
├─ 🔥 Prioridad: ${task.priority}
├─ 📊 Estado: ${task.status}
└─ 📝 Descripción: ${task.description ?? 'Sin descripción'}

➡️ Por favor, ejecutá esta tarea y reportá el resultado en Discord.`;

    // Enviar a Discord via CLI local (sin HTTP)
    const { stdout } = await execFileAsync('openclaw', [
      'message','send',
      '--channel','discord',
      '--target', DISCORD_CHANNEL_ID,
      '--message', message,
      '--json'
    ]);
    const result = JSON.parse(stdout);
    console.log('Tarea enviada a Discord:', result);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Exception al enviar a Clippy:', error);
    return NextResponse.json(
      { error: 'Exception', message: error.message },
      { status: 500 }
    );
  }
}
