import React, { useState, useEffect } from 'react';

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

function calculateBMI(weightKg, heightCm) {
  const h = Number(heightCm) / 100;
  if (!h || !weightKg) return 0;
  return Number(weightKg) / (h * h);
}

// Simplified stunting detection: height-for-age z-score proxy by BMI and height thresholds.
// In real systems, use WHO L/M/S tables. Here we approximate for demo UI.
function estimateStuntingStatus(ageMonths, gender, heightCm, bmi) {
  if (!ageMonths || !heightCm) return 'unknown';
  const lowHeight = ageMonths < 24 ? 75 : ageMonths < 60 ? 95 : 110; // rough thresholds
  if (heightCm < lowHeight) return 'stunted';
  if (bmi < 13.5) return 'at-risk';
  return 'normal';
}

function ChildForm({ onSubmit, editing, initial }) {
  const [form, setForm] = useState({
    name: '',
    ageMonths: '',
    gender: 'male',
    heightCm: '',
    weightKg: '',
    parentContact: '',
  });

  useEffect(() => {
    if (initial) setForm({
      name: initial.name || '',
      ageMonths: initial.ageMonths?.toString() || '',
      gender: initial.gender || 'male',
      heightCm: initial.heightCm?.toString() || '',
      weightKg: initial.weightKg?.toString() || '',
      parentContact: initial.parentContact || '',
    });
  }, [initial]);

  const bmi = calculateBMI(form.weightKg, form.heightCm);
  const status = estimateStuntingStatus(Number(form.ageMonths), form.gender, Number(form.heightCm), bmi);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // simple validations
    if (!form.name || !form.ageMonths || !form.heightCm || !form.weightKg) {
      alert('Please fill all required fields');
      return;
    }
    if (Number(form.ageMonths) <= 0 || Number(form.heightCm) <= 0 || Number(form.weightKg) <= 0) {
      alert('Values must be positive');
      return;
    }
    onSubmit({
      ...form,
      ageMonths: Number(form.ageMonths),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      bmi: Number(bmi.toFixed(1)),
      status,
    });
  }

  const statusColor = status === 'stunted' ? 'text-red-700 bg-red-50 border-red-200' : status === 'at-risk' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-green-700 bg-green-50 border-green-200';

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Child Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="e.g., Asep" required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Age (months)</label>
          <input type="number" name="ageMonths" value={form.ageMonths} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" min={1} required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2">
            {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Height (cm)</label>
          <input type="number" name="heightCm" value={form.heightCm} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" min={30} required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Weight (kg)</label>
          <input type="number" name="weightKg" value={form.weightKg} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" min={1} step="0.1" required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Parent Contact</label>
          <input name="parentContact" value={form.parentContact} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="Phone or address" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className={`px-3 py-2 rounded-md border text-sm ${statusColor}`}>
          Status: <strong className="ml-1 capitalize">{status}</strong>
        </div>
        <div className="px-3 py-2 rounded-md border text-sm bg-blue-50 text-blue-700 border-blue-200">
          BMI: <strong className="ml-1">{bmi ? bmi.toFixed(1) : '-'}</strong>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
          {editing ? 'Update Record' : 'Add Child'}
        </button>
      </div>
    </form>
  );
}

export default ChildForm;
