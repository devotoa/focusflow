import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CATEGORIES = ['Meta Ads', 'Contenido IG', 'Scripts/Código', 'Estrategia', 'Contabilidad', 'Investigación'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, author } = body;

    if (!message || !message.content) {
      return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 });
    }

    const content = message.content as string;
    
    // Detectar si parece una tarea (contiene palabras clave o está estructurado como tarea)
    const taskKeywords = ['tarea:', 'todo:', 'hacer:', 'pending:', 'task:'];
    const isTask = taskKeywords.some(kw => content.toLowerCase().includes(kw)) || 
                   content.length > 10;

    if (!isTask) {
      return NextResponse.json({ message: 'No es una tarea' }, { status: 200 });
    }

    // Extraer información del mensaje
    let title = content;
    let description = '';
    let category: string = 'Meta Ads';
    let priority: 'high' | 'medium' | 'low' = 'medium';

    // Buscar categoría mencionada
    for (const cat of CATEGORIES) {
      if (content.toLowerCase().includes(cat.toLowerCase()) || 
          content.toLowerCase().includes(`[${cat.toLowerCase()}]`)) {
        category = cat;
        break;
      }
    }

    // Detectar prioridad
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('urgente') || lowerContent.includes('alta') || lowerContent.includes('importante') || lowerContent.includes('!')) {
      priority = 'high';
    } else if (lowerContent.includes('baja') || lowerContent.includes('puede esperar') || lowerContent.includes('cuando puedas')) {
      priority = 'low';
    }

    // Limpiar el título de indicadores de categoría/prioridad
    title = title
      .replace(/\[.*?\]/g, '')
      .replace(/tarea:/gi, '')
      .replace(/todo:/gi, '')
      .replace(/hacer:/gi, '')
      .trim();

    // Si el mensaje es largo, usar primera línea como título y resto como descripción
    const lines = title.split('\n');
    if (lines.length > 1) {
      title = lines[0].trim();
      description = lines.slice(1).join('\n').trim();
    }

    // Limitar título
    if (title.length > 100) {
      description = title.slice(100) + '\n' + description;
      title = title.slice(0, 100) + '...';
    }

    const task = {
      title,
      description: description || null,
      category,
      priority,
      status: 'todo' as const,
      discord_message_id: message.id,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Error guardando tarea' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Tarea creada desde Discord',
      task: data 
    }, { status: 201 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}