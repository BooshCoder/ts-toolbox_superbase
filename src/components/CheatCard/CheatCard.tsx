import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import styles from './CheatCard.module.css';
import type { CheatNote } from '../../types/CheatNote';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

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
        <h2 className={styles.title}>{note.title || note.question}</h2>
        <div className={styles.lines}>
          <div className={styles.lineWhite}></div>
          <svg className={styles.codeIcon} width="24" height="24" style={{ position: 'absolute', right: 0, top: '10px' }}>
            <use xlinkHref="/sprite.svg#icon-code" />
          </svg>
        </div>
        <div style={{ flex: 1 }} />
        <div className={styles.metaRow}>
          <span className={styles.category}>{note.category}</span>
          <button
            className={note.isFavorite ? styles.starActive : styles.star}
            onClick={e => { e.stopPropagation(); onToggleFavorite(note.id); }}
            aria-label={note.isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
          >
            {note.isFavorite ? '★' : '☆'}
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
              {preprocessMarkdown(note.description || note.answer || '')}
            </ReactMarkdown>
          </div>
          {(note.code || note.codeExample) && (
            <pre className={styles.code}>
              <code>{preprocessMarkdown(note.code || note.codeExample || '')}</code>
            </pre>
          )}
        </div>
        <div className={styles.metaRow}>
          <span className={styles.category}>{note.category}</span>
          <button
            className={note.isFavorite ? styles.starActive : styles.star}
            onClick={e => { e.stopPropagation(); onToggleFavorite(note.id); }}
            aria-label={note.isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
          >
            {note.isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  );
}
