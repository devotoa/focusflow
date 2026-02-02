# FocusFlow - Dashboard ADHD

Gestión de tareas diseñada específicamente para personas con ADHD. Dashboard Kanban con prioridades visuales, categorías por proyecto y sincronización con Discord.

## Características

- **Vista Kanban**: 4 columnas (Pendiente, En Progreso, Bloqueado, Completado)
- **Prioridades visuales**: Rojo (Urgente), Amarillo (Importante), Verde (Puede esperar)
- **Categorías**: Meta Ads, Contenido IG, Scripts/Código, Estrategia, Contabilidad, Investigación
- **Webhook Discord**: Crea tareas automáticamente desde mensajes de Discord
- **Métricas**: Completadas hoy, esta semana, total y pendientes
- **Diseño ADHD-friendly**: Tema oscuro, alto contraste, sin distracciones
- **Actualización en tiempo real**: Polling cada 5 segundos

## Setup

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. En el SQL Editor, ejecuta:

```sql
create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text not null default 'Meta Ads',
  priority text not null default 'medium',
  status text not null default 'todo',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone,
  discord_message_id text
);

-- Enable RLS
alter table tasks enable row level security;

-- Create policy for all operations (para desarrollo)
create policy "Allow all" on tasks for all using (true) with check (true);
```

### 2. Configurar variables de entorno

1. Copia `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

2. Completa las variables con tus credenciales de Supabase (Settings > API)

### 3. Instalar dependencias

```bash
npm install
```

### 4. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Deploy en Vercel

### 1. Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tuusuario/focusflow.git
git push -u origin main
```

### 2. Deploy en Vercel

1. Ve a [vercel.com](https://vercel.com) e importa tu repo
2. Configura las variables de entorno de Supabase
3. Deploy!

## Webhook de Discord

Para recibir mensajes de Discord y crear tareas automáticamente:

1. En tu server de Discord, crea un webhook (Server Settings > Integrations > Webhooks)
2. Configura el webhook para enviar POST a: `https://tu-app.vercel.app/api/webhook/discord`
3. O usa un servicio como Zapier/Make para conectar Discord con tu API

El webhook detecta automáticamente:
- Categorías mencionadas en el mensaje
- Prioridad según palabras clave (urgente, importante, etc.)
- Crea la tarea en estado "Pendiente"

## Estructura del proyecto

```
focusflow/
├── src/
│   ├── app/
│   │   ├── api/webhook/discord/   # API route para webhook
│   │   ├── page.tsx               # Dashboard principal
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Estilos globales
│   ├── components/
│   │   ├── TaskCard.tsx           # Tarjeta de tarea
│   │   ├── KanbanColumn.tsx       # Columna del kanban
│   │   ├── TaskModal.tsx          # Modal crear/editar
│   │   └── StatsPanel.tsx         # Métricas
│   ├── lib/
│   │   └── supabase.ts            # Cliente Supabase
│   └── types/
│       └── task.ts                # Tipos TypeScript
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── .env.example
```

## Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Realtime)
- Lucide React (iconos)

## Licencia

MIT