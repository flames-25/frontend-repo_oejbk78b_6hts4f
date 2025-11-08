import React, { useState } from 'react';
import { Shield } from 'lucide-react';

function LoginModal({ open, onClose, onLogin }) {
  const [role, setRole] = useState('worker');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    // Demo-only auth: matching role keywords
    if (!username || !password) {
      alert('Enter username and password');
      return;
    }
    const user = {
      name: username,
      role: role === 'admin' ? 'admin' : 'worker',
    };
    onLogin(user);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-30 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border">
        <div className="p-4 border-b flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <Shield size={16} />
          </div>
          <h3 className="font-semibold">Sign in</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="e.g., admin" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="••••••" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2">
              <option value="admin">Admin</option>
              <option value="worker">Health Worker</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border bg-gray-50 hover:bg-gray-100">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
