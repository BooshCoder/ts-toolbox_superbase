
import { useState } from 'react';
import type { Category } from '../../types/CheatNote';
import styles from './AddForm.module.css';

const allCategories: Category[] = [
  'functions', 'arrays', 'objects', 'dom', 'async', 'other',
];

export default function AddForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<Category>('functions');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();



    // Очистка полів
    setTitle('');
    setDescription('');
    setCode('');
    setCategory('functions');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Питання"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        className={styles.input}
        placeholder="Відповідь"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <textarea
        className={styles.textarea}
        placeholder="Код"
        value={code}
        onChange={e => setCode(e.target.value)}
        required
      />
      <select
        className={styles.select}
        value={category}
        onChange={e => setCategory(e.target.value as Category)}
      >
        {allCategories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button type="submit" className={styles.button}>+ Додати</button>
    </form>
  );
}