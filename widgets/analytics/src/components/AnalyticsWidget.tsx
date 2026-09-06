import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const monthlyRevenue = [
  { month: 'Apr', revenue: 5200, invoiced: 4900, target: 6000 },
  { month: 'May', revenue: 6800, invoiced: 6800, target: 6000 },
  { month: 'Jun', revenue: 5900, invoiced: 5600, target: 6000 },
  { month: 'Jul', revenue: 7400, invoiced: 7100, target: 6500 },
  { month: 'Aug', revenue: 8100, invoiced: 7800, target: 7000 },
  { month: 'Sep', revenue: 9200, invoiced: 8500, target: 8000 }
];

const clientBreakdown = [
  { client: 'Acme', value: 3400 },
  { client: 'Zenith', value: 2800 },
  { client: 'Nexus', value: 1900 },
  { client: 'Orbit', value: 1100 }
];

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ReactNode;
  accentClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, delta, positive, icon, accentClass }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm">
    <div className={`p-2 rounded-lg ${accentClass}`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-widest text-textMuted-light dark:text-textMuted-dark font-medium">{label}</p>
      <p className="text-sm font-bold text-textPrimary-light dark:text-textPrimary-dark mt-0.5">{value}</p>
      <div className={`flex items-center gap-0.5 text-[10px] font-medium mt-0.5 ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {delta}
      </div>
    </div>
  </div>
);

type ViewType = 'revenue' | 'clients';

const CHART_COLORS = {
  revenue: '#7c3aed',
  invoiced: '#a78bfa',
  target: '#d1d5db',
  clientBar: '#2563eb'
};

export const AnalyticsWidget: React.FC = () => {
  const [view, setView] = useState<ViewType>('revenue');
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('soloops.theme');
    const startDark = savedTheme === 'dark';
    setIsDark(startDark);
    if (startDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'soloops:themechange') return;
      const nextDark = event.data.theme === 'dark';
      setIsDark(nextDark);
      if (nextDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'soloops.theme') return;
      const nextDark = event.newValue === 'dark';
      setIsDark(nextDark);
      if (nextDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const tooltipStyle = {
    backgroundColor: isDark ? '#111827' : '#ffffff',
    border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: '8px',
    fontSize: '11px'
  };

  const currentRevenue = monthlyRevenue[monthlyRevenue.length - 1].revenue;
  const prevRevenue = monthlyRevenue[monthlyRevenue.length - 2].revenue;
  const revDelta = (((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1);
  const revPositive = currentRevenue >= prevRevenue;

  const ytdRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalClients = clientBreakdown.length;

  return (
    <div className="h-full w-full p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm flex flex-col transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          <h2 className="font-semibold text-textPrimary-light dark:text-textPrimary-dark">Revenue Analytics</h2>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border-light dark:border-border-dark p-0.5 text-[11px]">
          <button
            onClick={() => setView('revenue')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${view === 'revenue' ? 'bg-violet-600 text-white' : 'text-textSecondary-light dark:text-textSecondary-dark hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Trend
          </button>
          <button
            onClick={() => setView('clients')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${view === 'clients' ? 'bg-violet-600 text-white' : 'text-textSecondary-light dark:text-textSecondary-dark hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Clients
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
        <StatCard
          label="This Month"
          value={`$${currentRevenue.toLocaleString()}`}
          delta={`${revPositive ? '+' : ''}${revDelta}% vs last`}
          positive={revPositive}
          icon={<DollarSign className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />}
          accentClass="bg-violet-100 dark:bg-violet-900/30"
        />
        <StatCard
          label="YTD Revenue"
          value={`$${(ytdRevenue / 1000).toFixed(1)}k`}
          delta="+18.3% vs prior year"
          positive={true}
          icon={<TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          accentClass="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          label="Active Clients"
          value={`${totalClients}`}
          delta="+1 this month"
          positive={true}
          icon={<Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
          accentClass="bg-blue-100 dark:bg-blue-900/30"
        />
      </div>

      <div className="flex-1 mt-3 min-h-[140px]">
        {view === 'revenue' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.revenue} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS.revenue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradInvoiced" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.invoiced} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.invoiced} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#1e293b' : '#e2e8f0'}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, '']} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={CHART_COLORS.revenue}
                strokeWidth={2}
                fill="url(#gradRevenue)"
              />
              <Area
                type="monotone"
                dataKey="invoiced"
                name="Invoiced"
                stroke={CHART_COLORS.invoiced}
                strokeWidth={1.5}
                strokeDasharray="4 2"
                fill="url(#gradInvoiced)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clientBreakdown} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#1e293b' : '#e2e8f0'}
                vertical={false}
              />
              <XAxis
                dataKey="client"
                tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Bar
                dataKey="value"
                fill={CHART_COLORS.clientBar}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between text-[11px] text-textMuted-light dark:text-textMuted-dark border-t border-border-light dark:border-border-dark mt-2">
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Apr – Sep 2026
        </span>
        <span>Target: $8,000/mo</span>
      </div>
    </div>
  );
};

export default AnalyticsWidget;
