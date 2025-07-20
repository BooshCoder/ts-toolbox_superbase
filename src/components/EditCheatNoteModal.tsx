import React, { useState } from 'react';
import type { CheatNote } from '../types/CheatNote';

interface EditCheatNoteModalProps {
  open: boolean;
  onClose: () => void;
  note: CheatNote;
  onSave: (updated: CheatNote) => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function EditCheatNoteModal({ open, onClose, note, onSave }: EditCheatNoteModalProps) {
  const [form, setForm] = useState<CheatNote>({ ...note });

  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (!isLocalhost || !open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, question, answer, codeExample, category, isFavorite } = form;
    if (!id || !question || !category) {
      alert('id, question і category не можуть бути порожніми!');
      return;
    }
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cheatnotes?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ question, answer, codeExample, category, isFavorite }),
      }
    );
    if (!res.ok) throw new Error('Помилка збереження');
    const updated = await res.json();
    onSave(updated[0]);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', zIndex: 1000, left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(40,44,52,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{
        background: '#23272e',
        color: '#fff',
        borderRadius: 16,
        padding: 32,
        minWidth: 320,
        maxWidth: '95vw',
        width: '100%',
        maxHeight: '95vh',
        boxShadow: '0 8px 32px #0008',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        overflowY: 'auto',
      }}>
        <h2 style={{ margin: 0, color: '#ff79c6', fontSize: 24 }}>Редагування картки</h2>
        <label>
          id
          <input name="id" value={form.id || ''} onChange={handleChange} required style={{ width: '100%' }} />
        </label>
        <label>
          question
          <input name="question" value={form.question || ''} onChange={handleChange} required style={{ width: '100%' }} />
        </label>
        <label>
          answer
          <textarea
            name="answer"
            value={form.answer || ''}
            onChange={handleChange}
            rows={8}
            style={{
              width: '100%',
              minHeight: 120,
              maxHeight: '40vh',
              fontSize: 16,
              padding: 14,
              resize: 'vertical',
              lineHeight: 1.6,
            }}
          />
        </label>
        <label>
          code
          <textarea name="codeExample" value={form.codeExample || ''} onChange={handleChange} rows={4} style={{ width: '100%', fontSize: 15, padding: 10, resize: 'vertical' }} />
        </label>
        <label>
          category
          <select name="category" value={form.category || ''} onChange={handleChange} required style={{ width: '100%', fontSize: 15, padding: 8, borderRadius: 7, background: '#23272e', color: '#fff', border: '1.5px solid #444' }}>
            <option value="">Оберіть категорію…</option>
            <option value="functions">functions</option>
            <option value="arrays">arrays</option>
            <option value="objects">objects</option>
            <option value="dom">dom</option>
            <option value="async">async</option>
            <option value="other">other</option>
            <option value="variables">variables</option>
            <option value="loops">loops</option>
            <option value="operators">operators</option>
          </select>
        </label>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <button type="button" onClick={onClose} style={{ flex: 1, background: '#393a44', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontSize: 16 }}>Скасувати</button>
          <button type="submit" style={{ flex: 1, background: '#ff79c6', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontSize: 16 }}>Зберегти</button>
        </div>
      </form>
    </div>
  );
} 