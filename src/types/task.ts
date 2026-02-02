export type TaskCategory = 'Meta Ads' | 'Contenido IG' | 'Scripts/Código' | 'Estrategia' | 'Contabilidad' | 'Investigación';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  discord_message_id: string | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  completed_at?: string | null;
  discord_message_id?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export const CATEGORIES: TaskCategory[] = ['Meta Ads', 'Contenido IG', 'Scripts/Código', 'Estrategia', 'Contabilidad', 'Investigación'];

export const PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'high', label: 'Urgente', color: '#ef4444' },
  { value: 'medium', label: 'Importante', color: '#eab308' },
  { value: 'low', label: 'Puede esperar', color: '#22c55e' },
];

export const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'Pendiente' },
  { value: 'in-progress', label: 'En Progreso' },
  { value: 'blocked', label: 'Bloqueado' },
  { value: 'completed', label: 'Completado' },
];

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  'Meta Ads': '#3b82f6',
  'Contenido IG': '#ec4899',
  'Scripts/Código': '#22c55e',
  'Estrategia': '#a855f7',
  'Contabilidad': '#eab308',
  'Investigación': '#6366f1',
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  'Meta Ads': 'Meta Ads',
  'Contenido IG': 'Contenido IG',
  'Scripts/Código': 'Scripts',
  'Estrategia': 'Estrategia',
  'Contabilidad': 'Contabilidad',
  'Investigación': 'Investigación',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'Urgente',
  medium: 'Importante',
  low: 'Puede esperar',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Pendiente',
  'in-progress': 'En Progreso',
  blocked: 'Bloqueado',
  completed: 'Completado',
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: '#ef4444',
  medium: '#eab308',
  low: '#22c55e',
};