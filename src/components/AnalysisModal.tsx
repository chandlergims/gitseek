import { useEffect, useState, useRef } from 'react';
import './AnalysisModal.css';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    isLarp: boolean;
    confidence: number;
    explanation: string;
  } | null;
}

export function AnalysisModal({ isOpen, onClose, result }: AnalysisModalProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && result) {
      setIsTyping(true);
      setDisplayedText('');
      let currentText = '';
      const fullText = result.explanation;
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          // Type multiple characters at once for faster typing
          const charsToAdd = Math.min(10, fullText.length - currentIndex);
          currentText += fullText.slice(currentIndex, currentIndex + charsToAdd);
          setDisplayedText(currentText);
          currentIndex += charsToAdd;

          // Auto-scroll to bottom
          if (textRef.current) {
            textRef.current.scrollTop = textRef.current.scrollHeight;
          }
          if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
          }
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 5); // Even faster interval

      return () => clearInterval(typingInterval);
    }
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  return (
    <div className="analysis-modal-overlay">
      <div className="analysis-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="modal-content" ref={contentRef}>
          <div className="modal-header">
            <h2>Analysis Result</h2>
            <div className={`verdict ${result.isLarp ? 'larp' : 'genuine'}`}>
              {result.isLarp ? 'LARP Detected' : 'Genuine Project'}
            </div>
          </div>
          <div className="analysis-text" ref={textRef}>
            {displayedText}
            {isTyping && <span className="typing-cursor">|</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
