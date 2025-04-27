import React, { useEffect, useRef } from 'react';
import styles from '../../assets/styles/Popup.module.scss';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  closeOnOutsideClick?: boolean;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  children,
  title,
  closeOnOutsideClick = true,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnOutsideClick &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, closeOnOutsideClick]);

  if (!isOpen) return null;

  return (
    <div className={styles.popup__overlay}>
      <div className={styles.popup__container} ref={popupRef}>
        <div className={styles.popup__header}>
          {title && <h2 className={styles.popup__title}>{title}</h2>}
          <button
            className={styles.popup__closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className={styles.popup__content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;