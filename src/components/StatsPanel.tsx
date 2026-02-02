'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Calendar, ListTodo, Clock } from 'lucide-react';
import { getTaskStats } from '@/lib/supabase';

interface StatsData {
  completedToday: number;
  completedThisWeek: number;
  total: number;
  pending: number;
}

export function StatsPanel() {
  const [stats, setStats] = useState<StatsData>({
    completedToday: 0,
    completedThisWeek: 0,
    total: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await getTaskStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statsItems = [
    {
      label: 'Completadas Hoy',
      value: stats.completedToday,
      icon: CheckCircle2,
      color: 'text-accent-success',
      bgColor: 'bg-accent-success/10',
    },
    {
      label: 'Esta Semana',
      value: stats.completedThisWeek,
      icon: Calendar,
      color: 'text-accent-primary',
      bgColor: 'bg-accent-primary/10',
    },
    {
      label: 'Total Tareas',
      value: stats.total,
      icon: ListTodo,
      color: 'text-accent-secondary',
      bgColor: 'bg-accent-secondary/10',
    },
    {
      label: 'Pendientes',
      value: stats.pending,
      icon: Clock,
      color: 'text-accent-warning',
      bgColor: 'bg-accent-warning/10',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-4 animate-pulse-soft">
            <div className="h-10 bg-card-hover rounded-lg mb-2" />
            <div className="h-4 bg-card-hover rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsItems.map((item) => (
        <div
          key={item.label}
          className="bg-card rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{item.value}</p>
              <p className="text-sm text-text-secondary">{item.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
