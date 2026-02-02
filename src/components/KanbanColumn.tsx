'use client';

import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Circle, Play, Ban, CheckCircle } from 'lucide-react';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<TaskStatus, { icon: typeof Circle; color: string; borderColor: string; title: string }> = {
  todo: { icon: Circle, color: 'text-gray-400', borderColor: 'border-gray-600', title: 'Pendiente' },
  'in-progress': { icon: Play, color: 'text-blue-500', borderColor: 'border-blue-500', title: 'En Progreso' },
  blocked: { icon: Ban, color: 'text-red-500', borderColor: 'border-red-500', title: 'Bloqueado' },
  completed: { icon: CheckCircle, color: 'text-green-500', borderColor: 'border-green-500', title: 'Completado' },
};

export function KanbanColumn({ status, tasks, onComplete, onEdit, onDelete }: KanbanColumnProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="bg-surface rounded-xl p-4 min-h-[500px] flex flex-col">
      <div className={`flex justify-between items-center mb-4 pb-3 border-b-2 ${config.borderColor}`}>
        <div className={`flex items-center gap-2 font-semibold ${config.color}`}>
          <Icon size={16} />
          <span>{config.title}</span>
        </div>
        <span className="bg-background px-3 py-1 rounded-full text-xs font-semibold text-gray-400">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs">Sin tareas</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onComplete={onComplete} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))
        )}
      </div>
    </div>
  );
}