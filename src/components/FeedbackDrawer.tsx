'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { submitFeedbackAction } from '../app/actions/feedback';

export default function FeedbackDrawer() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'Issue' | 'Idea' | 'Other'>('Idea');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      await submitFeedbackAction({
        type,
        message,
        pageUrl: window.location.origin + pathname,
      });

      setStatusMsg({ text: 'THANK YOU! YOUR FEEDBACK HAS BEEN SUBMITTED.', isError: false });
      setMessage('');

      // Auto-close after 2 seconds on success
      setTimeout(() => {
        setIsOpen(false);
        setStatusMsg(null);
      }, 2000);
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to submit feedback', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* STICKY VERTICAL RIGHT BORDER BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Feedback Drawer"
        style={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 9999,
          backgroundColor: '#000000',
          color: '#ffffff',
          border: '2px solid #000000',
          borderRight: 'none',
          padding: '0.75rem 0.4rem',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fontSize: '0.8rem',
          letterSpacing: '2px',
          writingMode: 'vertical-rl',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '-3px 3px 0px 0px #000000',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.color = '#000000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#000000';
          e.currentTarget.style.color = '#ffffff';
        }}
      >
        FEEDBACK
      </button>

      {/* BACKDROP BLUR & DRAWER PANEL */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            style={{
              width: '400px',
              maxWidth: '90vw',
              height: '100%',
              backgroundColor: '#ffffff',
              borderLeft: '4px solid #000000',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0px 0px 0px rgba(0, 0, 0, 0.1)',
              animation: 'slideInRight 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* DRAWER HEADER */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1rem',
                borderBottom: '3px solid #000000',
                marginBottom: '1.5rem',
              }}
            >
              <h2
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  margin: 0,
                  textTransform: 'uppercase',
                }}
              >
                FEEDBACK & IDEAS
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  border: '2px solid #000000',
                  fontWeight: 'bold',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'monospace',
                }}
              >
                ✕
              </button>
            </div>

            {/* FEEDBACK FORM */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* SECTION 1: TYPE TOGGLE */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  WHAT KIND OF FEEDBACK?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {(['Issue', 'Idea', 'Other'] as const).map((t) => {
                    const isSelected = type === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        style={{
                          padding: '0.5rem',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#000000' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#000000',
                          border: '2px solid #000000',
                          boxShadow: isSelected ? 'none' : '2px 2px 0px 0px #000000',
                          transform: isSelected ? 'translate(2px, 2px)' : 'none',
                          transition: 'all 0.1s ease',
                        }}
                      >
                        {t.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: MESSAGE TEXTBOX */}
              <div style={{ marginBottom: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  TELL US MORE
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === 'Issue'
                      ? 'Describe the issue or bug you encountered...'
                      : type === 'Idea'
                      ? 'Share your idea or feature request to improve this app...'
                      : 'Share your thoughts, recommendations, or feedback...'
                  }
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    flex: 1,
                    padding: '0.75rem',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    border: '2px solid #000000',
                    outline: 'none',
                    resize: 'none',
                    boxShadow: 'inset 2px 2px 0px 0px rgba(0,0,0,0.05)',
                  }}
                />
              </div>

              {/* STATUS MESSAGE BANNER */}
              {statusMsg && (
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.6rem',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    border: '2px solid #000000',
                    backgroundColor: statusMsg.isError ? '#ffdddd' : '#ddffdd',
                    color: '#000000',
                  }}
                >
                  {statusMsg.text}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                style={{
                  padding: '0.85rem',
                  backgroundColor: isSubmitting || !message.trim() ? '#cccccc' : '#000000',
                  color: '#ffffff',
                  border: '2px solid #000000',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: isSubmitting || !message.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: isSubmitting || !message.trim() ? 'none' : '4px 4px 0px 0px #000000',
                  marginBottom: '1rem',
                }}
              >
                {isSubmitting ? 'SENDING FEEDBACK...' : 'SEND FEEDBACK'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
