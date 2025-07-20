import styles from './FilterBar.module.css';
import type { Category } from '../../types/CheatNote';

type Props = {
  selected: Category | 'all' | 'favorite';
  onSelect: (category: Category | 'all' | 'favorite') => void;
};

const allCategories: (Category | 'all' | 'favorite')[] = [
  'all',
  'favorite',
  'functions',
  'arrays',
  'objects',
  'dom',
  'async',
  'other',
  'variables',
  'loops',
  'operators',
];

export default function FilterBar({ selected, onSelect }: Props) {
  return (
    <div className={styles.container}>
      {allCategories.map(category => (
        <button
          key={category}
          className={`${styles.button} ${selected === category ? styles.active : ''}`}
          onClick={() => onSelect(category)}
        >
          {category === 'favorite' ? '★ Обране' : category}
        </button>
      ))}
    </div>
  );
}