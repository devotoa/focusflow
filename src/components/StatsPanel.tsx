'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Calendar, ListTodo, Clock } from 'lucide-react';
import { Task } from '@/types/task';

interface StatsPanelProps {
  tasks: Task[];
}

export function StatsPanel({ tasks }: StatsPanelProps) {
  const [stats, setStats] = useState({
    completedToday: 0,
    completedThisWeek: 0,
    total: 0,
    pending: 0,
  });

  useEffect(() => {
    const today = new Date().toDateString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const completed = tasks.filter(t => t.status === 'completed');
    const completedToday = completed.filter(t => t.completed_at && new Date(t.completed_at).toDateString() === today).length;
    const completedThisWeek = completed.filter(t => t.completed_at && new Date(t.completed_at) >= weekAgo).length;
    const pending = tasks.filter(t => t.status !== 'completed').length;
    
    setStats({
      completedToday,
      completedThisWeek,
      total: completed.length,
      pending,
    });
  }, [tasks]);

  const statItems = [
    { icon: CheckCircle2, label: 'Completadas Hoy', value: stats.completedToday, color: 'text-green-400' },
    { icon: Calendar, label: 'Esta Semana', value: stats.completedThisWeek, color: 'text-blue-400' },
    { icon: ListTodo, label: 'Total Completadas', value: stats.total, color: 'text-purple-400' },
    { icon: Clock, label: 'Pendientes', value: stats.pending, color: 'text-yellow-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="bg-card rounded-xl p-4 flex items-center gap-3 shadow-lg border border-surface/50">
            <div className={`w-11 h-11 rounded-xl bg-surface flex items-center justify-center ${item.color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-2xl font-bold text-white">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}