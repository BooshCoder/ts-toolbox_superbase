import { useState } from 'react';
import { useCheatNotes } from './hooks/useCheatNotes';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Category } from './types/CheatNote';
import CheatCard from './components/CheatCard/CheatCard';
import FilterBar from './components/FilterBar/FilterBar';
import AddForm from './components/AddForm/AddForm';
import SearchBar from './components/SearchBar/SearchBar';
import styles from './App.module.css';

function App() {
  const { data: cheatnotes = [], isLoading, error } = useCheatNotes();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all' | 'favorite'>('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);

  const handleToggleFavorite = (id: string) => {
    setFavorites(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };

  const filteredNotes = cheatnotes
    .filter(note => {
      const isFav = favorites.includes(note.id);
      if (selectedCategory === 'favorite') return isFav;
      const categoryMatch = selectedCategory === 'all' || note.category === selectedCategory;
      const text = [
        note.question || note.title || '',
        note.answer || note.description || '',
        note.codeExample || note.code || ''
      ].join(' ').toLowerCase();
      const searchMatch = search.trim() === '' || text.includes(search.trim().toLowerCase());
      return categoryMatch && searchMatch;
    })
    .map(note => ({ ...note, isFavorite: favorites.includes(note.id) }));

  // Перевірка дублікатів id
  const ids = cheatnotes.map(n => n.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    console.warn('🔴 Duplicate IDs found:', duplicates);
  }

  return (
    <div className={styles.app}>
      <h1 className={styles.heading}>JS Cheats</h1>
      <FilterBar selected={selectedCategory} onSelect={setSelectedCategory} />
      <SearchBar value={search} onChange={setSearch} />
      <AddForm />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching notes</p>}
      {filteredNotes.map(note => (
        <CheatCard key={note.id} note={note} onToggleFavorite={handleToggleFavorite} />
      ))}
    </div>
  );
}

export default App;
