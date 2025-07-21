import React from 'react';

interface FooterProps {
  visible: boolean;
}

const Footer: React.FC<FooterProps> = ({ visible }) => (
  <footer
    style={{
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100vw',
      height: 100,
      background: '#23272e',
      color: '#ff79c6',
      textAlign: 'center',
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: 2,
      lineHeight: '100px',
      boxShadow: '0 -4px 32px #0004',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      zIndex: 1000,
      transform: visible ? 'translateY(0)' : 'translateY(120%)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.6s cubic-bezier(.4,2,.6,1), opacity 0.4s',
      pointerEvents: visible ? 'auto' : 'none',
      userSelect: 'none',
    }}
  >
    нехай щастить!
  </footer>
);

export default Footer; 