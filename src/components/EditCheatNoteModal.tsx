import React, { useState } from 'react';
import type { CheatNote } from '../types/CheatNote';

interface EditCheatNoteModalProps {
  open: boolean;
  onClose: () => void;
  note: CheatNote;
  onSave: (updated: CheatNote) => void;
}

export default function EditCheatNoteModal({ open, onClose, note, onSave }: EditCheatNoteModalProps) {
  const [form, setForm] = useState<CheatNote>({ ...note });

  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (!isLocalhost || !open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', zIndex: 1000, left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(40,44,52,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#23272e', color: '#fff', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: 420, boxShadow: '0 8px 32px #0008', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h2 style={{ margin: 0, color: '#ff79c6' }}>Редагування картки</h2>
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
          <textarea name="answer" value={form.answer || ''} onChange={handleChange} rows={6} style={{ width: '100%' }} />
        </label>
        <label>
          code
          <textarea name="code" value={form.code || ''} onChange={handleChange} rows={3} style={{ width: '100%' }} />
        </label>
        <label>
          category
          <input name="category" value={form.category || ''} onChange={handleChange} required style={{ width: '100%' }} />
        </label>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <button type="button" onClick={onClose} style={{ flex: 1, background: '#393a44', color: '#fff', border: 'none', borderRadius: 8, padding: 10 }}>Скасувати</button>
          <button type="submit" style={{ flex: 1, background: '#ff79c6', color: '#fff', border: 'none', borderRadius: 8, padding: 10 }}>Зберегти</button>
        </div>
      </form>
    </div>
  );
} 