'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskCategory, TaskPriority, TaskStatus } from '@/types/task';
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTaskInput | UpdateTaskInput) => void;
  task?: Task | null;
}

const CATEGORIES: TaskCategory[] = ['Meta Ads', 'Contenido IG', 'Scripts/Código', 'Estrategia', 'Contabilidad', 'Investigación'];
const PRIORITIES: TaskPriority[] = ['high', 'medium', 'low'];
const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'blocked', 'completed'];

export function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Estrategia');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category);
      setPriority(task.priority);
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setCategory('strategy');
      setPriority('medium');
      setStatus('todo');
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const data: CreateTaskInput | UpdateTaskInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      status,
    };

    onSave(data);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-card w-full max-w-lg rounded-2xl shadow-2xl animate-slide-up border border-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card-hover">
          <h2 className="text-xl font-bold text-text-primary">
            {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-card-hover transition-colors text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Título <span className="text-accent-danger">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="¿Qué necesitas hacer?"
              className="w-full px-4 py-2.5 bg-background rounded-xl border border-card-hover text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-accent-danger">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Añade más detalles..."
              rows={3}
              className="w-full px-4 py-2.5 bg-background rounded-xl border border-card-hover text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all resize-none"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-4 py-2.5 bg-background rounded-xl border border-card-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-4 py-2.5 bg-background rounded-xl border border-card-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all appearance-none cursor-pointer"
              >
                {PRIORITIES.map((pri) => (
                  <option key={pri} value={pri}>
                    {PRIORITY_LABELS[pri]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Estado
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-4 py-2.5 bg-background rounded-xl border border-card-hover text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all appearance-none cursor-pointer"
            >
              {STATUSES.map((stat) => (
                <option key={stat} value={stat}>
                  {STATUS_LABELS[stat]}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-card-hover transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-accent-primary text-white font-medium hover:bg-accent-primary/90 transition-colors shadow-glow"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
