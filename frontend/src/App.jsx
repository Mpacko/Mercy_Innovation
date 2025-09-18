import React, { useEffect, useState, useMemo } from 'react';

// ---------- Utilities ----------
const uid = () => Math.random().toString(36).slice(2, 9);
const todayISO = () => new Date().toISOString().slice(0, 10);
const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const loadFromStorage = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Seed data if none
const seedData = () => [
  { id: uid(), name: 'Amina T.', email: 'amina@mercylab.com', start: '2025-07-01', end: '2025-09-30', status: 'Active', role: 'Frontend Intern', notes: 'Très motivée' },
  { id: uid(), name: 'David N.', email: 'david@mercylab.com', start: '2025-06-01', end: '2025-08-31', status: 'Graduated', role: 'Backend Intern', notes: 'Bon travail' },
  { id: uid(), name: 'Lucie M.', email: 'lucie@mercylab.com', start: '2025-08-15', end: '2025-11-15', status: 'Active', role: 'Data Science Intern', notes: '' },
];

// ---------- Components ----------
function Header({ onNavigate, active }) {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-6 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-md flex items-center justify-center font-bold">MIL</div>
          <div>
            <h1 className="text-xl font-semibold">Mercy Innovation Lab</h1>
            <p className="text-sm opacity-90">Gestion des stagiaires</p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className={`px-4 py-2 rounded-md ${active==='home' ? 'bg-white/20' : 'hover:bg-white/10'}`}>Accueil</button>
          <button onClick={() => onNavigate('dashboard')} className={`px-4 py-2 rounded-md ${active==='dashboard' ? 'bg-white/20' : 'hover:bg-white/10'}`}>Dashboard</button>
          <button onClick={() => onNavigate('about')} className={`px-4 py-2 rounded-md ${active==='about' ? 'bg-white/20' : 'hover:bg-white/10'}`}>À propos</button>
        </nav>
      </div>
    </header>
  );
}

function Landing({ onStart }) {
  return (
    <main className="min-h-[60vh] flex items-center">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-extrabold mb-4">Simplifiez la gestion des stagiaires</h2>
          <p className="text-lg mb-6">Suivez les candidatures, l'avancement, les contrats et les encadrements — toute la gestion centralisée pour Mercy Innovation Lab.</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3"><span className="font-bold">•</span> Tableau de bord clair et responsive</li>
            <li className="flex items-start gap-3"><span className="font-bold">•</span> CRUD rapide, export & import</li>
            <li className="flex items-start gap-3"><span className="font-bold">•</span> Stockage local pour test immédiat</li>
          </ul>
          <div className="flex gap-3">
            <button onClick={onStart} className="px-6 py-3 bg-white text-indigo-700 rounded-md font-semibold shadow">Accéder au dashboard</button>
            <a className="px-6 py-3 border border-white/30 rounded-md text-white/90" href="#features">Fonctionnalités</a>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-6 shadow-inner">
          <div className="bg-gradient-to-br from-white/5 to-white/3 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Aperçu rapide</h3>
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Stagiaires" value="12" />
              <StatCard title="Actifs" value="8" />
              <StatCard title="Gradués" value="4" />
              <StatCard title="Offres ouvertes" value="2" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white/5 p-4 rounded-md">
      <div className="text-sm text-white/80">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function About() {
  return (
    <section className="max-w-4xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">À propos</h2>
      <p className="mb-3">Mercy Innovation Lab — une start-up qui soutient l'innovation et la formation pratique. Cette application vise à faciliter le suivi des stagiaires, la communication et l'évaluation.</p>
      <p className="text-sm text-muted">Contact: hello@mercylab.com</p>
    </section>
  );
}

function Dashboard({ interns, setInterns }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('start');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setPage(1); }, [q, filter, sortBy]);

  const filtered = useMemo(() => {
    let arr = interns.slice();
    if (q) arr = arr.filter(i => (i.name + ' ' + i.email + ' ' + i.role).toLowerCase().includes(q.toLowerCase()));
    if (filter !== 'All') arr = arr.filter(i => i.status === filter);
    arr.sort((a,b) => {
      if (sortBy === 'start') return (a.start||'').localeCompare(b.start||'');
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
    return arr;
  }, [interns, q, filter, sortBy]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page-1)*pageSize, page*pageSize);

  const handleDelete = id => {
    if (!confirm('Supprimer ce stagiaire ?')) return;
    const next = interns.filter(i => i.id !== id);
    setInterns(next);
  };

  const openEdit = (item) => { setEditing(item); setShowForm(true); };
  const openNew = () => { setEditing(null); setShowForm(true); };

  const exportCSV = () => {
    const header = ['id','name','email','role','start','end','status','notes'];
    const rows = interns.map(i => header.map(h => '\"'+((i[h]||'')+'').replace(/\"/g,'\"\"')+'\"').join(','));
    const csv = [header.join(','), ...rows].join('\\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'interns.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const importJSON = (ev) => {
    const f = ev.target.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arr = JSON.parse(reader.result);
        if (!Array.isArray(arr)) throw new Error('Not array');
        const merged = [...interns, ...arr.map(x => ({...x, id: x.id || uid()}))];
        setInterns(merged);
      } catch (e) { alert('Import failed: '+e.message); }
    };
    reader.readAsText(f);
  };

  const stats = useMemo(() => {
    const total = interns.length;
    const active = interns.filter(i => i.status === 'Active').length;
    const grad = interns.filter(i => i.status === 'Graduated').length;
    return { total, active, grad };
  }, [interns]);

  return (
    <section className="max-w-6xl mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard des stagiaires</h2>
        <div className="flex gap-3">
          <button onClick={openNew} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Nouveau stagiaire</button>
          <button onClick={exportCSV} className="px-4 py-2 border rounded-md">Exporter CSV</button>
          <label className="px-4 py-2 border rounded-md cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" onChange={importJSON} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-3 bg-white/5 p-4 rounded-md">
          <div className="flex gap-3 items-center mb-4">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher par nom, email, rôle..." className="flex-1 bg-transparent border border-white/10 p-2 rounded" />
            <select value={filter} onChange={e=>setFilter(e.target.value)} className="p-2 rounded border border-white/10">
              <option>All</option>
              <option>Active</option>
              <option>Graduated</option>
              <option>Inactive</option>
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="p-2 rounded border border-white/10">
              <option value="start">Trier par début</option>
              <option value="name">Trier par nom</option>
            </select>
          </div>

          <div className="grid gap-3">
            {visible.length===0 && <div className="p-6 text-center text-sm text-white/80">Aucun résultat</div>}
            {visible.map(i => (
              <div key={i.id} className="p-4 bg-white/3 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{i.name} <span className="text-sm text-white/70">• {i.role}</span></div>
                  <div className="text-sm text-white/60">{i.email} — {i.start} → {i.end} • {i.status}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>openEdit(i)} className="px-3 py-1 border rounded">Éditer</button>
                  <button onClick={()=>handleDelete(i.id)} className="px-3 py-1 bg-red-600 text-white rounded">Supprimer</button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-white/70">Page {page} / {pages}</div>
            <div className="flex gap-2">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 border rounded">Préc.</button>
              <button onClick={()=>setPage(p=>Math.min(pages,p+1))} className="px-3 py-1 border rounded">Suiv.</button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Statistiques</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Total</span><strong>{stats.total}</strong></div>
            <div className="flex justify-between"><span>Actifs</span><strong>{stats.active}</strong></div>
            <div className="flex justify-between"><span>Gradués</span><strong>{stats.grad}</strong></div>
          </div>
        </div>
      </div>

      {showForm && <InternForm
        initial={editing}
        onClose={() => setShowForm(false)}
        onSave={(payload) => {
          if (editing) {
            setInterns(interns.map(it => it.id === editing.id ? {...it, ...payload} : it));
          } else {
            setInterns([{ id: uid(), ...payload }, ...interns]);
          }
          setShowForm(false);
        }}
      />}

    </section>
  );
}

function InternForm({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name||'');
  const [email, setEmail] = useState(initial?.email||'');
  const [role, setRole] = useState(initial?.role||'');
  const [start, setStart] = useState(initial?.start||todayISO());
  const [end, setEnd] = useState(initial?.end||'');
  const [status, setStatus] = useState(initial?.status||'Active');
  const [notes, setNotes] = useState(initial?.notes||'');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return alert('Nom et email requis');
    onSave({ name, email, role, start, end, status, notes });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded-md w-[720px] max-w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{initial ? 'Éditer' : 'Nouveau'} stagiaire</h3>
          <button type="button" onClick={onClose} className="text-sm text-gray-600">Fermer</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nom complet" className="p-2 border rounded" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="p-2 border rounded" />
          <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Rôle" className="p-2 border rounded" />
          <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="p-2 border rounded" />
          <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="p-2 border rounded" />
          <select value={status} onChange={e=>setStatus(e.target.value)} className="p-2 border rounded">
            <option>Active</option>
            <option>Graduated</option>
            <option>Inactive</option>
          </select>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes" className="col-span-2 p-2 border rounded" />
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Annuler</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Sauvegarder</button>
        </div>
      </form>
    </div>
  );
}

// ---------- Main App ----------
export default function App() {
  const [route, setRoute] = useState('home');
  const [interns, setInterns] = useState(() => loadFromStorage('mercy.interns', seedData()));

  useEffect(() => saveToStorage('mercy.interns', interns), [interns]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-slate-800 text-white">
      <Header onNavigate={setRoute} active={route} />
      <div className="py-8">
        {route === 'home' && <Landing onStart={() => setRoute('dashboard')} />}
        {route === 'dashboard' && <Dashboard interns={interns} setInterns={setInterns} />}
        {route === 'about' && <About />}
      </div>

      <footer className="text-center py-6 text-sm text-white/60">
        © {new Date().getFullYear()} Mercy Innovation Lab — Built with ❤️
      </footer>
    </div>
  );
}
