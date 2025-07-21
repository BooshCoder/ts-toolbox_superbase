import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useCheatNotes } from './hooks/useCheatNotes';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Category, CheatNote } from './types/CheatNote';
import CheatCard from './components/CheatCard/CheatCard';
import FilterBar from './components/FilterBar/FilterBar';
import SearchBar from './components/SearchBar/SearchBar';
import Footer from './components/Footer';
import styles from './App.module.css';

function App() {
  const { data, isLoading, error } = useCheatNotes();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all' | 'favorite'>('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useLocalStorage<number[]>('favorites', []);
  const [mode, setMode] = useState<'all' | 'random'>('all');
  const lastCardRef = useRef<HTMLDivElement | null>(null);
  const [footerVisible, setFooterVisible] = useState(false);
  const stopperRef = useRef<HTMLDivElement | null>(null);

  // Збираємо всі картки
  const cheatnotes = useMemo(() => {
    const arr = (data ?? []) as CheatNote[];
    return [...arr].sort((a, b) => Number(a.id) - Number(b.id));
  }, [data]);

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

  // IntersectionObserver для останньої картки
  useEffect(() => {
    const node = lastCardRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [notesToShow.length]);

  // Блокування тільки скролу вниз, коли футер видимий
  useEffect(() => {
    if (!footerVisible) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        e.preventDefault();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if ([
        'ArrowDown',
        'PageDown',
        ' '
      ].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [footerVisible]);

  useEffect(() => {
    if (!footerVisible) return;
    // Після активації футера — підтягуємо сторінку до футера
    setTimeout(() => {
      stopperRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }, 0);
  }, [footerVisible]);

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
        {notesToShow.map((note, idx) =>
          idx === notesToShow.length - 1 ? (
            <div ref={lastCardRef} key={note.id}>
              <CheatCard note={note} onToggleFavorite={handleToggleFavorite} />
            </div>
          ) : (
            <CheatCard key={note.id} note={note} onToggleFavorite={handleToggleFavorite} />
          )
        )}
        <Footer visible={footerVisible} />
        <div ref={stopperRef} style={{ height: 1 }} />
      </div>
    </div>
  );
}

export default App;
