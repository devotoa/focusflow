'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, RefreshCw, LayoutGrid } from 'lucide-react';
import { KanbanColumn } from '@/components/KanbanColumn';
import { TaskModal } from '@/components/TaskModal';
import { StatsPanel } from '@/components/StatsPanel';
import { getTasks, createTask, updateTask, deleteTask, subscribeToTasks } from '@/lib/supabase';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskCategory, TaskPriority } from '@/types/task';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/types/task';

const CATEGORIES: TaskCategory[] = ['meta_ads', 'content_ig', 'scripts', 'strategy', 'accounting', 'research'];
const PRIORITIES: TaskPriority[] = ['high', 'medium', 'low'];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks
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

  // Initial load and polling
  useEffect(() => {
    fetchTasks();

    // Polling every 5 seconds
    const interval = setInterval(fetchTasks, 5000);

    // Real-time subscription
    const unsubscribe = subscribeToTasks((payload) => {
      if (payload.eventType === 'INSERT') {
        setTasks((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setTasks((prev) =>
          prev.map((t) => (t.id === payload.new.id ? payload.new : t))
        );
      } else if (payload.eventType === 'DELETE') {
        setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [fetchTasks]);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Group tasks by status
  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === 'todo'),
    in_progress: filteredTasks.filter((t) => t.status === 'in_progress'),
    review: filteredTasks.filter((t) => t.status === 'review'),
    done: filteredTasks.filter((t) => t.status === 'done'),
  };

  // Handlers
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
      await updateTask(id, { status: 'done' });
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
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-primary rounded-xl shadow-glow">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">FocusFlow</h1>
              <p className="text-text-secondary text-sm">Gestión de tareas ADHD-friendly</p>
            </div>
          </div>
          
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-accent-primary text-white rounded-xl font-medium hover:bg-accent-primary/90 transition-all shadow-glow hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Tarea</span>
          </button>
        </header>

        {/* Stats */}
        <StatsPanel />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-card rounded-xl border border-card-hover text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TaskCategory | 'all')}
              className="pl-11 pr-10 py-2.5 bg-card rounded-xl border border-card-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">Todas las categorías</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as TaskPriority | 'all')}
              className="px-4 py-2.5 bg-card rounded-xl border border-card-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="all">Todas las prioridades</option>
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri}>
                  {PRIORITY_LABELS[pri]}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="p-2.5 bg-card rounded-xl border border-card-hover text-text-secondary hover:text-text-primary hover:border-accent-primary/50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KanbanColumn
            status="todo"
            tasks={tasksByStatus.todo}
            onComplete={handleCompleteTask}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
          />
          <KanbanColumn
            status="in_progress"
            tasks={tasksByStatus.in_progress}
            onComplete={handleCompleteTask}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
          />
          <KanbanColumn
            status="review"
            tasks={tasksByStatus.review}
            onComplete={handleCompleteTask}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
          />
          <KanbanColumn
            status="done"
            tasks={tasksByStatus.done}
            onComplete={handleCompleteTask}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
          />
        </div>
      </div>

      {/* Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        task={editingTask}
      />
    </main>
  );
}
