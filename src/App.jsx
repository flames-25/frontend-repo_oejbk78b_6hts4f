import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChildForm from './components/ChildForm';
import RecordsTable from './components/RecordsTable';
import LoginModal from './components/LoginModal';

function App() {
  // Local state for demo; in full app this would call backend APIs
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  function handleAddOrUpdate(payload) {
    if (editing) {
      setRecords((prev) => prev.map((r) => (r.id === editing.id ? { ...editing, ...payload } : r)));
      setEditing(null);
    } else {
      setRecords((prev) => [{ id: crypto.randomUUID(), createdAt: Date.now(), ...payload }, ...prev]);
    }
  }

  function handleEdit(row) {
    setEditing(row);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(row) {
    if (!confirm(`Delete record for ${row.name}?`)) return;
    setRecords((prev) => prev.filter((r) => r.id !== row.id));
  }

  const stats = useMemo(() => {
    const total = records.length;
    const stunted = records.filter((r) => r.status === 'stunted').length;
    const avgBmi = total ? records.reduce((s, r) => s + (Number(r.bmi) || 0), 0) / total : 0;
    const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const monthlyNew = records.filter((r) => r.createdAt > monthAgo).length;
    return {
      totalChildren: total,
      stuntingRate: total ? Math.round((stunted / total) * 100) : 0,
      avgBmi: avgBmi || 0,
      monthlyNew,
    };
  }, [records]);

  const trendData = useMemo(() => {
    // simple 6-point trend based on average BMI chunks
    const chunks = 6;
    const arr = new Array(chunks).fill(0).map((_, i) => {
      const slice = records.filter((_, idx) => idx % chunks === i);
      if (!slice.length) return 10;
      return Math.min(40, Math.max(8, Math.round(slice.reduce((s, r) => s + (Number(r.bmi) || 0), 0) / slice.length)));
    });
    return arr;
  }, [records]);

  function exportCSV() {
    const headers = ['Name','Age (months)','Gender','Height (cm)','Weight (kg)','BMI','Status','Parent Contact'];
    const rows = records.map(r => [r.name, r.ageMonths, r.gender, r.heightCm, r.weightKg, r.bmi, r.status, r.parentContact]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v ?? '')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'posyandu_records.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    // Lightweight print-to-PDF using browser print
    const w = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
    const tableHtml = `
      <html>
        <head>
          <title>Posyandu Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; }
            h1 { font-size: 18px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 6px; font-size: 12px; }
            th { background: #f7fafc; }
          </style>
        </head>
        <body>
          <h1>Posyandu Growth Report</h1>
          <p>Total children: ${stats.totalChildren} | Stunting rate: ${stats.stuntingRate}% | Avg BMI: ${stats.avgBmi.toFixed(1)}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Age (m)</th><th>Gender</th><th>Height</th><th>Weight</th><th>BMI</th><th>Status</th><th>Parent Contact</th>
              </tr>
            </thead>
            <tbody>
              ${records.map(r => `<tr><td>${r.name}</td><td>${r.ageMonths}</td><td>${r.gender}</td><td>${r.heightCm}</td><td>${r.weightKg}</td><td>${r.bmi}</td><td>${r.status}</td><td>${r.parentContact}</td></tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>`;
    w.document.write(tableHtml);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header
        user={user}
        onLoginClick={() => setLoginOpen(true)}
        onLogout={() => setUser(null)}
        onExportCSV={exportCSV}
        onExportPDF={exportPDF}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Dashboard stats={stats} trendData={trendData} />
        <ChildForm onSubmit={handleAddOrUpdate} editing={Boolean(editing)} initial={editing} />
        <RecordsTable records={records} onEdit={handleEdit} onDelete={handleDelete} user={user} />
      </main>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={(u) => setUser(u)} />

      <footer className="text-center text-xs text-gray-500 py-8">Made for Posyandu officers • Mobile-friendly • Demo UI</footer>
    </div>
  );
}

export default App;
