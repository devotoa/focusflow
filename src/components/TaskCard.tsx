'use client';

import { useState } from 'react';
import { Check, Edit2, Trash2, MessageCircle } from 'lucide-react';
import type { Task } from '@/types/task';
import { CATEGORY_COLORS, CATEGORY_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div
      className="bg-card rounded-xl p-4 shadow-soft transition-all duration-300 hover:shadow-glow hover:scale-[1.02] animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-text-primary font-semibold text-sm leading-tight flex-1 pr-2">
          {task.title}
        </h3>
        {task.discord_message_id && (
          <MessageCircle className="w-4 h-4 text-category-meta flex-shrink-0" />
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-text-secondary text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Category Badge */}
        <span
          className="px-2 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: CATEGORY_COLORS[task.category] }}
        >
          {CATEGORY_LABELS[task.category]}
        </span>

        {/* Priority Indicator */}
        <div className="flex items-center gap-1 px-2 py-1 bg-card-hover rounded-full">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
          />
          <span className="text-xs text-text-secondary">
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-text-muted text-xs">
          {formatDate(task.created_at)}
        </span>

        {/* Action Buttons */}
        <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {task.status !== 'done' && (
            <button
              onClick={() => onComplete(task.id)}
              className="p-1.5 rounded-lg bg-accent-success/20 text-accent-success hover:bg-accent-success/30 transition-colors"
              title="Completar"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30 transition-colors"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg bg-accent-danger/20 text-accent-danger hover:bg-accent-danger/30 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
