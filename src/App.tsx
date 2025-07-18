import { useState, useRef, useEffect, useCallback } from 'react';
import { useInfiniteCheatNotes } from './hooks/useCheatNotes';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Category } from './types/CheatNote';
import CheatCard from './components/CheatCard/CheatCard';
import FilterBar from './components/FilterBar/FilterBar';
import SearchBar from './components/SearchBar/SearchBar';
import styles from './App.module.css';

function App() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCheatNotes();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all' | 'favorite'>('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<'all' | 'random'>('all');

  // Збираємо всі картки з усіх сторінок
  const cheatnotes = data ? data.pages.flat() : [];

  // IntersectionObserver для автодогрузки
  useEffect(() => {
    if (!hasNextPage || isLoading) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    }, { threshold: 1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchNextPage, hasNextPage, isLoading]);

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
      {/* <AddForm /> */}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching notes</p>}
      <div className="cheatCardGrid">
        {notesToShow.map(note => (
          <CheatCard key={note.id} note={note} onToggleFavorite={handleToggleFavorite} />
        ))}
        {mode === 'all' && <>
          <div ref={loaderRef} style={{ height: 32 }} />
          {isFetchingNextPage && <p style={{ textAlign: 'center', color: '#888' }}>Завантаження...</p>}
          {!hasNextPage && cheatnotes.length > 0 && <p style={{ textAlign: 'center', color: '#888' }}>Всі картки завантажено</p>}
        </>}
      </div>
    </div>
  );
}

export default App;
