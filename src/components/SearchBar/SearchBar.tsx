import { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(input);
    }, 700);
    return () => clearTimeout(handler);
  }, [input, onChange]);

  useEffect(() => {
    setInput(value);
  }, [value]);

  return (
    <div className={styles.searchBar}>
      <input
        className={styles.input}
        type="text"
        placeholder="Пошук..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
    </div>
  );
} 