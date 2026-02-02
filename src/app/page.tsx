'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, RefreshCw, LayoutGrid } from 'lucide-react';
import { KanbanColumn } from '@/components/KanbanColumn';
import { TaskModal } from '@/components/TaskModal';
import { StatsPanel } from '@/components/StatsPanel';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskCategory, TaskPriority, TaskStatus } from '@/types/task';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/types/task';
import { getTasks, createTask, updateTask, deleteTask, subscribeToTasks } from '@/lib/supabase';

const CATEGORIES: TaskCategory[] = ['Meta Ads', 'Contenido IG', 'Scripts/Código', 'Estrategia', 'Contabilidad', 'Investigación'];
const PRIORITIES: TaskPriority[] = ['high', 'medium', 'low'];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    const unsubscribe = subscribeToTasks(() => fetchTasks());
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === 'todo'),
    'in-progress': filteredTasks.filter((t) => t.status === 'in-progress'),
    blocked: filteredTasks.filter((t) => t.status === 'blocked'),
    completed: filteredTasks.filter((t) => t.status === 'completed'),
  };

  const handleCreateTask = async (data: CreateTaskInput) => {
    try {
      await createTask(data);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (data: UpdateTaskInput) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, data);
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      await updateTask(id, { status: 'completed', completed_at: new Date().toISOString() });
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAskClippy = async (task: Task) => {
    const message = `🤖 **Nueva tarea para Clippy**\n\n**Título:** ${task.title}\n**Categoría:** ${task.category}\n**Prioridad:** ${task.priority}\n**Estado:** ${task.status}\n${task.description ? `**Descripción:** ${task.description}` : ''}\n\n<@1467274104791896187> por favor, ¿podés hacer esta tarea?`;
    
    // Copiar al portapapeles
    try {
      await navigator.clipboard.writeText(message);
      alert('✅ Mensaje copiado al portapapeles. Pegalo en Discord con Ctrl+V.');
    } catch (err) {
      // Fallback: mostrar el mensaje para copiar manualmente
      const textarea = document.createElement('textarea');
      textarea.value = message;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('✅ Mensaje copiado. Pegalo en Discord con Ctrl+V.');
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSave = (data: CreateTaskInput | UpdateTaskInput) => {
    if (editingTask) {
      handleUpdateTask(data as UpdateTaskInput);
    } else {
      handleCreateTask(data as CreateTaskInput);
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-xl">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">FocusFlow</h1>
              <p className="text-gray-400 text-sm">Gestión de tareas ADHD-friendly</p>
            </div>
          </div>
          
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-opacity-90 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Tarea</span>
          </button>
        </header>

        <div className="mb-6">
          <StatsPanel tasks={tasks} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-card rounded-xl border border-surface text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TaskCategory | 'all')}
              className="pl-11 pr-10 py-2.5 bg-card rounded-xl border border-surface text-white focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">Todas las categorías</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as TaskPriority | 'all')}
              className="px-4 py-2.5 bg-card rounded-xl border border-surface text-white focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="all">Todas las prioridades</option>
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri}>
                  {PRIORITY_LABELS[pri]}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchTasks}
            disabled={loading}
            className="p-2.5 bg-card rounded-xl border border-surface text-gray-400 hover:text-white hover:border-primary transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KanbanColumn
            status="todo"
            tasks={tasksByStatus.todo}
            onComplete={handleCompleteTask}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onAskClippy={handleAskClippy}
          />
          <KanbanColumn
            status="in-progress"
            tasks={tasksByStatus['in-progress']}
            onComplete={handleCompleteTask}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onAskClippy={handleAskClippy}
          />
          <KanbanColumn
            status="blocked"
            tasks={tasksByStatus.blocked}
            onComplete={handleCompleteTask}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onAskClippy={handleAskClippy}
          />
          <KanbanColumn
            status="completed"
            tasks={tasksByStatus.completed}
            onComplete={handleCompleteTask}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onAskClippy={handleAskClippy}
          />
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        task={editingTask}
      />
    </main>
  );
}