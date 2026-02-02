import { createClient } from '@supabase/supabase-js';
import { Task, TaskStatus } from '@/types/task';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

export async function moveTask(id: string, newStatus: TaskStatus): Promise<Task> {
  const updates: Partial<Task> = { status: newStatus };
  if (newStatus === 'completed') {
    updates.completed_at = new Date().toISOString();
  } else {
    updates.completed_at = null;
  }
  return updateTask(id, updates);
}

export function subscribeToTasks(callback: (tasks: Task[]) => void) {
  const subscription = supabase
    .channel('tasks-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, async () => {
      const tasks = await getTasks();
      callback(tasks);
    })
    .subscribe();
  return subscription;
}

export async function getTaskStats(): Promise<{ completedToday: number; completedThisWeek: number; total: number; pending: number }> {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) throw error;
  
  const tasks = data || [];
  const today = new Date().toDateString();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const completed = tasks.filter(t => t.status === 'completed');
  const completedToday = completed.filter(t => t.completed_at && new Date(t.completed_at).toDateString() === today).length;
  const completedThisWeek = completed.filter(t => t.completed_at && new Date(t.completed_at) >= weekAgo).length;
  const pending = tasks.filter(t => t.status !== 'completed').length;
  
  return {
    completedToday,
    completedThisWeek,
    total: completed.length,
    pending,
  };
}