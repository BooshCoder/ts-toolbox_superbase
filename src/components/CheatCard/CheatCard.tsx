import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import styles from './CheatCard.module.css';
import type { CheatNote } from '../../types/CheatNote';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import EditCheatNoteModal from '../EditCheatNoteModal';

type Props = {
  note: CheatNote;
  onToggleFavorite: (id: string) => void;
};

export default function CheatCard({ note, onToggleFavorite }: Props) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(220);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [localNote, setLocalNote] = useState<CheatNote>(note);

  // Динамічна висота для плавної анімації
  useLayoutEffect(() => {
    if (flipped && backRef.current) {
      setHeight(backRef.current.scrollHeight);
    } else if (!flipped && frontRef.current) {
      setHeight(frontRef.current.scrollHeight);
    }
  }, [flipped, note]);

  // Автофліп назад, якщо картка сховалася за межі екрану
  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && flipped) {
          setFlipped(false);
        }
      },
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [flipped]);

  function preprocessMarkdown(text: string): string {
    if (!text) return '';
    // Замінити всі =&gt; на =>
    text = text.replace(/=&gt;/g, '=>');
    // Додати перенос перед і після ``` або ```javascript, якщо його немає
    text = text.replace(/([^\n])(```(javascript)?)/g, '$1\n$2'); // перед
    text = text.replace(/(```(javascript)?)([^\n])/g, '$1\n$3'); // після
    // Також додати перенос після ``` якщо він зразу не йде
    text = text.replace(/(```(javascript)?\n[\s\S]*?)(```)([^\n])/g, '$1$3\n$4');
    return text;
  }

  return (
    <div
      className={styles.flipContainer}
      style={{ height }}
      ref={cardRef}
      onClick={() => setFlipped(f => !f)}
    >
      {/* FRONT SIDE */}
      <div
        className={
          flipped ? styles.frontSlideOut : styles.frontSlideIn
        }
        ref={frontRef}
      >
        <h2 className={styles.title}>{localNote.title || localNote.question}</h2>
        <div className={styles.lines}>
          <div className={styles.lineWhite}></div>
          <button
            type="button"
            style={{ background: 'none', border: 'none', padding: 0, position: 'absolute', right: 0, top: '10px', cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); setEditOpen(true); }}
            aria-label="Редагувати картку"
          >
            <svg className={styles.codeIcon} width="24" height="24">
              <use xlinkHref="/sprite.svg#icon-code" />
            </svg>
          </button>
        </div>
        <div style={{ flex: 1 }} />
        <div className={styles.metaRow}>
          <span className={styles.category}>{localNote.category}</span>
          <button
            className={localNote.isFavorite ? styles.starActive : styles.star}
            onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(localNote.id!);
          }}
            aria-label={localNote.isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
          >
            {localNote.isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>
      {/* BACK SIDE */}
      <div
        className={
          flipped ? styles.backSlideIn : styles.backSlideOut
        }
        ref={backRef}
      >
        <div>
          <div className={styles.description}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {preprocessMarkdown((localNote.description ?? localNote.answer) ?? '')}
            </ReactMarkdown>
          </div>
          {(localNote.code || localNote.codeExample) && (
            <pre className={styles.code}>
              <code>{preprocessMarkdown((localNote.code ?? localNote.codeExample) ?? '')}</code>
            </pre>
          )}
        </div>
        <div className={styles.metaRow}>
          <span className={styles.category}>{localNote.category}</span>
          <button
            className={localNote.isFavorite ? styles.starActive : styles.star}
            onClick={e => { e.stopPropagation(); onToggleFavorite(localNote.id!); }}
            aria-label={localNote.isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
          >
            {localNote.isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>
      <EditCheatNoteModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        note={localNote}
        onSave={(updated: CheatNote) => setLocalNote(updated)}
      />
    </div>
  );
}
