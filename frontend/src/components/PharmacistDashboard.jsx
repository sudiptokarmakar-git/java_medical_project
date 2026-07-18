import { useState } from 'react';
import { InventoryView, MedicinesView, SuppliersView, SalesView } from './DashboardViews';

export default function PharmacistDashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState('medicine');

  const navItems = [
    { label: 'Medicines', icon: '💊', view: 'medicine' },
    { label: 'Inventory', icon: '📦', view: 'inventory' },
    { label: 'Sales/ Purchase', icon: '🧾', view: 'sales' },
    { label: 'Suppliers', icon: '🚚', view: 'suppliers' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'inventory':
        return <InventoryView role="PHARMACIST" />;
      case 'suppliers':
        return <SuppliersView role="PHARMACIST" />;
      case 'sales':
        return <SalesView role="PHARMACIST" />;
      case 'medicine':
      default:
        return <MedicinesView role="PHARMACIST" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-10 bg-white/80 backdrop-blur border-b border-slate-200 z-50">
        <div className="h-full flex items-center justify-between px-4 md:px-8">
          <h1 className="font-bold text-lg text-slate-900">OM Medical</h1>
          <button type="button" className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1 rounded-xl" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="flex flex-1 pt-8">
        <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${activeView === item.view ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-slate-700">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-5">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Pharmacist Dashboard</h2>
              <p className="text-sm text-slate-500 mt-1">Welcome, {user.sub}</p>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
