import React from 'react';
import { Home, BarChart3, LogIn, LogOut, FileDown, Shield } from 'lucide-react';

function Header({ user, onLoginClick, onLogout, onExportCSV, onExportPDF }) {
  const roleLabel = user ? (user.role === 'admin' ? 'Admin' : 'Health Worker') : 'Guest';
  const canExport = user && user.role === 'admin';

  return (
    <header className="w-full bg-white/80 backdrop-blur border-b sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <Home size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Posyandu Growth Monitor</h1>
            <p className="text-xs text-gray-500">Track children’s growth and detect potential stunting</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-sm text-gray-600 px-2 py-1 rounded border">
            <Shield size={14} /> {roleLabel}
          </span>

          <div className="relative">
            <button
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm ${canExport ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}
              disabled={!canExport}
              onClick={() => canExport && onExportCSV()}
              title={canExport ? 'Export CSV' : 'Only admin can export'}
            >
              <FileDown size={16} /> CSV
            </button>
            <button
              className={`ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm ${canExport ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}
              disabled={!canExport}
              onClick={() => canExport && onExportPDF()}
              title={canExport ? 'Export PDF' : 'Only admin can export'}
            >
              <FileDown size={16} /> PDF
            </button>
          </div>

          {user ? (
            <button onClick={onLogout} className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-sm">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <button onClick={onLoginClick} className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm">
              <LogIn size={16} /> Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
