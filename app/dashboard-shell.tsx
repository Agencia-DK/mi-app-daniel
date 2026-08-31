'use client';

import { useEffect, useState, type ComponentType } from 'react';

export default function DashboardShell() {
  const [Dashboard, setDashboard] = useState<ComponentType | null>(null);

  useEffect(() => {
    import('./dashboard').then((module) => setDashboard(() => module.default));
  }, []);

  return Dashboard ? <Dashboard /> : <main aria-busy="true" />;
}
