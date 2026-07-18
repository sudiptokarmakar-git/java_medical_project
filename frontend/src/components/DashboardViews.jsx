import { useEffect, useState } from 'react';

export function UsersView() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'STAFF' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const loadUsers = () => {
    const token = localStorage.getItem('om_token');
    if (!token) return;
    setLoading(true);
    fetch('http://localhost:8080/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load users');
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error('Users load error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('om_token');
    if (!token) return;
    
    const url = editingId 
      ? `http://localhost:8080/api/admin/users/${editingId}`
      : 'http://localhost:8080/api/admin/users';
      
    const method = editingId ? 'PUT' : 'POST';
    const payload = { ...form };
    if (editingId && !payload.password.trim()) {
      delete payload.password;
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    
    if (response.ok) {
      setForm({ name: '', username: '', password: '', role: 'STAFF' });
      setEditingId(null);
      loadUsers();
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, username: user.username, password: '', role: user.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', username: '', password: '', role: 'STAFF' });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('om_token');
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) loadUsers();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Users</h3>
          <p className="text-sm text-slate-500">Manage accounts, roles, and access.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-4 grid gap-3 md:grid-cols-4">
        <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder={editingId ? "Password (leave blank to keep)" : "Password"} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} />
        <select className="rounded-xl border border-slate-200 px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="STAFF">STAFF</option>
          <option value="PHARMACIST">PHARMACIST</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <div className="md:col-span-4 flex gap-2">
          <button type="submit" className="flex-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            {editingId ? 'Update User' : 'Add User'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="4" className="px-4 py-3 text-slate-500">Loading users…</td></tr> : users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.username}</td>
                <td className="px-4 py-3 text-slate-600">{user.role}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-slate-200 px-3 py-1 text-slate-700" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="rounded-lg border border-rose-200 px-3 py-1 text-rose-600" onClick={() => handleDelete(user.id)}>Delete</button>
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

export function MedicinesView({ role = 'ADMIN' }) {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: '', batch: '', manufacturing_date: '', expiration_date: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const loadMedicines = () => {
    const token = localStorage.getItem('om_token');
    if (!token) {
      setLoading(false);
      return;
    }
    const endpoint = role === 'PHARMACIST' ? 'http://localhost:8080/api/pharmacy/medicines' : 'http://localhost:8080/api/admin/medicines';
    setLoading(true);
    fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load medicines');
        return res.json();
      })
      .then((data) => setMedicines(data))
      .catch((err) => console.error('Medicines load error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMedicines();
  }, [role]);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('om_token');
    if (!token) return;
    
    const url = editingId
      ? `http://localhost:8080/api/admin/medicines/${editingId}`
      : 'http://localhost:8080/api/admin/medicines';
      
    const method = editingId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    
    if (response.ok) {
      setForm({ name: '', batch: '', manufacturing_date: '', expiration_date: '', category: '' });
      setEditingId(null);
      loadMedicines();
    }
  };

  const handleEdit = (medicine) => {
    setEditingId(medicine.id);
    setForm({
      name: medicine.name,
      batch: medicine.batch,
      manufacturing_date: medicine.manufacturing_date || '',
      expiration_date: medicine.expiration_date || '',
      category: medicine.category || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', batch: '', manufacturing_date: '', expiration_date: '', category: '' });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('om_token');
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    const response = await fetch(`http://localhost:8080/api/admin/medicines/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) loadMedicines();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Medicines</h3>
          <p className="text-sm text-slate-500">{role === 'PHARMACIST' ? 'View stock and dispensing items.' : 'Manage medicine catalog and stock.'}</p>
        </div>
      </div>

      {role === 'ADMIN' && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-4 grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Batch" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" type="date" value={form.manufacturing_date} onChange={(e) => setForm({ ...form, manufacturing_date: e.target.value })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" type="date" value={form.expiration_date} onChange={(e) => setForm({ ...form, expiration_date: e.target.value })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2 md:col-span-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
              {editingId ? 'Update Medicine' : 'Add Medicine'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading medicines…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {medicines.length > 0 ? medicines.map((medicine) => (
            <div key={medicine.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">{medicine.name}</h4>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{medicine.batch}</span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>Category: {medicine.category || '—'}</p>
                  <p>Manufactured: {medicine.manufacturing_date || '—'}</p>
                  <p>Expires: {medicine.expiration_date || '—'}</p>
                </div>
              </div>
              {role === 'ADMIN' && (
                <div className="mt-4 flex gap-2">
                  <button className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700" onClick={() => handleEdit(medicine)}>Edit</button>
                  <button className="rounded-lg border border-rose-200 px-3 py-1 text-sm text-rose-600" onClick={() => handleDelete(medicine.id)}>Delete</button>
                </div>
              )}
            </div>
          )) : <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No medicines found.</div>}
        </div>
      )}
    </div>
  );
}

export function InventoryView({ role = 'ADMIN' }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ medicine_name: '', batch: '', available_qty: 0, supplier: '' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const loadInventory = () => {
    const token = localStorage.getItem('om_token');
    if (!token) {
      setLoading(false);
      return;
    }
    const endpoint = role === 'PHARMACIST' ? 'http://localhost:8080/api/pharmacy/inventory' : 'http://localhost:8080/api/admin/inventory';
    setLoading(true);
    fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load inventory');
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => console.error('Inventory load error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInventory();
  }, [role]);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('om_token');
    if (!token) return;
    
    const url = editingId
      ? `http://localhost:8080/api/admin/inventory/${editingId}`
      : 'http://localhost:8080/api/admin/inventory';
      
    const method = editingId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      setForm({ medicine_name: '', batch: '', available_qty: 0, supplier: '' });
      setEditingId(null);
      loadInventory();
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      medicine_name: item.medicine_name,
      batch: item.batch,
      available_qty: item.available_qty,
      supplier: item.supplier,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ medicine_name: '', batch: '', available_qty: 0, supplier: '' });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('om_token');
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
    const response = await fetch(`http://localhost:8080/api/admin/inventory/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) loadInventory();
  };

  // Both Admin and Pharmacist are allowed to manage inventory
  const canManage = role === 'ADMIN' || role === 'PHARMACIST';

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-900">Inventory</h3>
      
      {canManage && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-4 grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Medicine Name" value={form.medicine_name} onChange={(e) => setForm({ ...form, medicine_name: e.target.value })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Batch" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" placeholder="Available Qty" value={form.available_qty} onChange={(e) => setForm({ ...form, available_qty: Number(e.target.value) })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Supplier" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} required />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="flex-1 rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white">
              {editingId ? 'Update Inventory Item' : 'Add Inventory Item'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading inventory…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.length > 0 ? items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between">
              <div>
                <p className="font-semibold text-slate-900">{item.medicine_name}</p>
                <p className="text-sm text-slate-600">Batch: {item.batch}</p>
                <p className="text-sm text-slate-600">Qty: {item.available_qty}</p>
                <p className="text-sm text-slate-600">Supplier: {item.supplier}</p>
              </div>
              {canManage && (
                <div className="mt-3 flex gap-2">
                  <button className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="rounded-lg border border-rose-200 px-3 py-1 text-sm text-rose-600" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              )}
            </div>
          )) : <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No inventory items found.</div>}
        </div>
      )}
    </div>
  );
}

export function SuppliersView({ role = 'ADMIN' }) {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', joinedfrom: '', contact: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const loadSuppliers = () => {
    const token = localStorage.getItem('om_token');
    if (!token) return;
    setLoading(true);
    const endpoint = role === 'PHARMACIST' ? 'http://localhost:8080/api/pharmacy/suppliers' : 'http://localhost:8080/api/admin/suppliers';
    fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load suppliers');
        return res.json();
      })
      .then((data) => setSuppliers(data))
      .catch((err) => console.error('Suppliers load error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSuppliers();
  }, [role]);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('om_token');
    if (!token) return;
    
    const url = editingId
      ? `http://localhost:8080/api/admin/suppliers/${editingId}`
      : 'http://localhost:8080/api/admin/suppliers';
      
    const method = editingId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, contact: Number(form.contact) }),
    });
    if (response.ok) {
      setForm({ name: '', address: '', joinedfrom: '', contact: '', email: '' });
      setEditingId(null);
      loadSuppliers();
    }
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier.id);
    setForm({
      name: supplier.name,
      address: supplier.address,
      joinedfrom: supplier.joinedfrom || '',
      contact: supplier.contact || '',
      email: supplier.email,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', address: '', joinedfrom: '', contact: '', email: '' });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('om_token');
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    const response = await fetch(`http://localhost:8080/api/admin/suppliers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) loadSuppliers();
  };

  // Both Admin and Pharmacist are allowed to manage suppliers
  const canManage = role === 'ADMIN' || role === 'PHARMACIST';

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-900">Suppliers</h3>
      
      {canManage && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-4 grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" type="date" value={form.joinedfrom} onChange={(e) => setForm({ ...form, joinedfrom: e.target.value })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="flex-1 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white">
              {editingId ? 'Update Supplier' : 'Add Supplier'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading suppliers…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {suppliers.length > 0 ? suppliers.map((supplier) => (
            <div key={supplier.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between">
              <div>
                <p className="font-semibold text-slate-900">{supplier.name}</p>
                <p className="text-sm text-slate-600">{supplier.email}</p>
                <p className="text-sm text-slate-600">{supplier.address}</p>
                <p className="text-sm text-slate-600">Contact: {supplier.contact}</p>
              </div>
              {canManage && (
                <div className="mt-3 flex gap-2">
                  <button className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700" onClick={() => handleEdit(supplier)}>Edit</button>
                  <button className="rounded-lg border border-rose-200 px-3 py-1 text-sm text-rose-600" onClick={() => handleDelete(supplier.id)}>Delete</button>
                </div>
              )}
            </div>
          )) : <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No suppliers found.</div>}
        </div>
      )}
    </div>
  );
}

export function SalesView({ role = 'ADMIN' }) {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ medicineName: '', quantity: 0, amount: 0.0, date: '', type: 'SALE' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const loadSalesPurchases = () => {
    const token = localStorage.getItem('om_token');
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch('http://localhost:8080/api/admin/sales', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load sales and purchase records');
        return res.json();
      })
      .then((data) => setRecords(data))
      .catch((err) => console.error('Sales records load error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSalesPurchases();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('om_token');
    if (!token) return;
    
    const url = editingId
      ? `http://localhost:8080/api/admin/sales/${editingId}`
      : 'http://localhost:8080/api/admin/sales';
      
    const method = editingId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    
    if (response.ok) {
      setForm({ medicineName: '', quantity: 0, amount: 0.0, date: '', type: 'SALE' });
      setEditingId(null);
      loadSalesPurchases();
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setForm({
      medicineName: record.medicineName,
      quantity: record.quantity,
      amount: record.amount,
      date: record.date || '',
      type: record.type,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ medicineName: '', quantity: 0, amount: 0.0, date: '', type: 'SALE' });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('om_token');
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    const response = await fetch(`http://localhost:8080/api/admin/sales/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) loadSalesPurchases();
  };

  const canManage = role === 'ADMIN' || role === 'PHARMACIST';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Sales / Purchase Records</h3>
          <p className="text-sm text-slate-500">Track drug transactions, purchases and sales.</p>
        </div>
      </div>

      {canManage && (
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-4 grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Medicine Name" value={form.medicineName} onChange={(e) => setForm({ ...form, medicineName: e.target.value })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" step="0.01" placeholder="Amount ($)" value={form.amount} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })} required />
          <input className="rounded-xl border border-slate-200 px-3 py-2" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <select className="rounded-xl border border-slate-200 px-3 py-2 md:col-span-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="SALE">SALE</option>
            <option value="PURCHASE">PURCHASE</option>
          </select>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="flex-1 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white">
              {editingId ? 'Update Record' : 'Add Record'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading records…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {records.length > 0 ? records.map((record) => (
            <div key={record.id} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">{record.medicineName}</h4>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${record.type === 'SALE' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{record.type}</span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>Quantity: {record.quantity}</p>
                  <p>Amount: ${record.amount}</p>
                  <p>Date: {record.date || '—'}</p>
                </div>
              </div>
              {canManage && (
                <div className="mt-3 flex gap-2">
                  <button className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700" onClick={() => handleEdit(record)}>Edit</button>
                  <button className="rounded-lg border border-rose-200 px-3 py-1 text-sm text-rose-600" onClick={() => handleDelete(record.id)}>Delete</button>
                </div>
              )}
            </div>
          )) : <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No records found.</div>}
        </div>
      )}
    </div>
  );
}
