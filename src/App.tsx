import { useState, useCallback } from 'react';
import { useCheatNotes } from './hooks/useCheatNotes';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Category, CheatNote } from './types/CheatNote';
import CheatCard from './components/CheatCard/CheatCard';
import FilterBar from './components/FilterBar/FilterBar';
import SearchBar from './components/SearchBar/SearchBar';
import styles from './App.module.css';

function App() {
  const { data, isLoading, error } = useCheatNotes();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all' | 'favorite'>('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useLocalStorage<number[]>('favorites', []);
  const [mode, setMode] = useState<'all' | 'random'>('all');

  // Збираємо всі картки
  const cheatnotes = (data ?? []) as CheatNote[];
  cheatnotes.sort((a, b) => Number(a.id) - Number(b.id));

  const handleToggleFavorite = (id: number) => {
    setFavorites((favs) => (favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]));
  };

  const filteredNotes = cheatnotes
    .filter(note => {
      const isFav = favorites.includes(note.id!);
      if (selectedCategory === 'favorite') return isFav;
      const categoryMatch = selectedCategory === 'all' || note.category === (selectedCategory || '');
      const text = [
        note.question || '',
        note.answer || '',
        note.codeExample || ''
      ].join(' ').toLowerCase();
      const searchMatch = search.trim() === '' || text.includes(search.trim().toLowerCase());
      return categoryMatch && searchMatch;
    })
   .map(note => ({ ...note, isFavorite: favorites.includes(note.id!) })); 

  // Перевірка дублікатів id
  const ids = cheatnotes.map(n => n.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) {
    console.warn('🔴 Duplicate IDs found:', duplicates);
  }

  // Вибір 3 випадкових карток
  const getRandomNotes = useCallback(() => {
    if (cheatnotes.length <= 3) return cheatnotes;
    const arr = [...cheatnotes];
    const res = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      res.push(arr[idx]);
      arr.splice(idx, 1);
    }
    return res;
  }, [cheatnotes]);

  const notesToShow = mode === 'random' ? getRandomNotes() : filteredNotes;

  return (
    <div className={styles.app}>
      <h1 className={styles.heading}>JS Cheats</h1>
      <div className={styles.modeButtons}>
        <button
          className={styles.modeBtn + (mode === 'random' ? ' ' + styles.active : '')}
          onClick={() => setMode('random')}
        >
          random
        </button>
        <button
          className={styles.modeBtn + (mode === 'all' ? ' ' + styles.active : '')}
          onClick={() => setMode('all')}
        >
          all items
        </button>
      </div>
      <FilterBar selected={selectedCategory} onSelect={setSelectedCategory} />
      <SearchBar value={search} onChange={setSearch} />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching notes</p>}
      <div className="cheatCardGrid">
        {notesToShow.map(note => (
          <CheatCard key={note.id} note={note} onToggleFavorite={handleToggleFavorite} />
        ))}
        {mode === 'all' && cheatnotes.length > 0 && (
          <div style={{ height: 100, background: '#ccc' }}>🔚 Це все</div>
        )}
      </div>
    </div>
  );
}

export default App;
