import React, { useMemo, useState } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';

function RecordsTable({ records, onEdit, onDelete, user }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return records.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.parentContact?.toLowerCase().includes(q) ||
      r.gender.toLowerCase().includes(q)
    );
  }, [records, query]);

  const canDelete = user && user.role === 'admin';

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="p-4 border-b flex items-center justify-between gap-2">
        <h3 className="font-semibold">Children Records</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            placeholder="Search by name, contact, or gender"
            className="pl-9 pr-3 py-2 border rounded-md w-64 max-w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Age (m)</th>
              <th className="text-left p-3">Gender</th>
              <th className="text-left p-3">Height (cm)</th>
              <th className="text-left p-3">Weight (kg)</th>
              <th className="text-left p-3">BMI</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Parent Contact</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">No records found</td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3">{r.ageMonths}</td>
                <td className="p-3 capitalize">{r.gender}</td>
                <td className="p-3">{r.heightCm}</td>
                <td className="p-3">{r.weightKg}</td>
                <td className="p-3">{r.bmi}</td>
                <td className="p-3 capitalize">{r.status}</td>
                <td className="p-3">{r.parentContact}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(r)} className="px-2 py-1 rounded border bg-amber-50 text-amber-700 hover:bg-amber-100 inline-flex items-center gap-1">
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => canDelete && onDelete(r)}
                      disabled={!canDelete}
                      className={`px-2 py-1 rounded border inline-flex items-center gap-1 ${canDelete ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecordsTable;
