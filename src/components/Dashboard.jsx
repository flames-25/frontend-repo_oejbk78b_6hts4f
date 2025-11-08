import React from 'react';
import { BarChart3, Users, Activity, TrendingUp } from 'lucide-react';

function StatCard({ icon: Icon, label, value, hint, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm">
      <div className={`inline-flex p-2 rounded-lg ${colorMap[color]} mb-3`}>
        <Icon size={18} />
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

function Dashboard({ stats, trendData }) {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Children" value={stats.totalChildren} hint="Registered in system" color="blue" />
        <StatCard icon={Activity} label="Stunting Rate" value={`${stats.stuntingRate}%`} hint="Current period" color="red" />
        <StatCard icon={BarChart3} label="Avg. BMI" value={stats.avgBmi.toFixed(1)} hint="All children" color="green" />
        <StatCard icon={TrendingUp} label="Monthly Adds" value={stats.monthlyNew} hint="Last 30 days" color="purple" />
      </div>

      <div className="mt-6 bg-white border rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-2">Growth Trend</h3>
        <div className="w-full h-40 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border flex items-end overflow-hidden">
          {/* Simple bar visualization without external libs */}
          <div className="w-full flex items-end gap-2 p-2">
            {trendData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-500/70 rounded-t" style={{ height: `${Math.max(8, v * 2)}px` }} />
                <span className="text-[10px] text-gray-500 mt-1">M{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
