import styles from './CheatCard.module.css';
import type { CheatNote } from '../../types/CheatNote';

type Props = {
  note: CheatNote;
  onToggleFavorite: (id: string) => void;
};

export default function CheatCard({ note, onToggleFavorite }: Props) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{note.title || note.question}</h2>
      <p className={styles.description}>{note.description || note.answer}</p>
      <pre className={styles.code}>
        <code>{note.code || note.codeExample}</code>
      </pre>
      <div className={styles.metaRow}>
        <span className={styles.category}>{note.category}</span>
        <button
          className={note.isFavorite ? styles.starActive : styles.star}
          onClick={() => onToggleFavorite(note.id)}
          aria-label={note.isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
        >
          {note.isFavorite ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
}
