'use client';

interface BrutalistToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function BrutalistToggle({
  checked,
  onChange,
  disabled = false,
}: BrutalistToggleProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        border: '2px solid #000000',
        boxShadow: disabled ? 'none' : '2px 2px 0px 0px #000000',
        backgroundColor: '#ffffff',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.1s ease',
      }}
    >
      {/* OFF SEGMENT */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(false)}
        style={{
          border: 'none',
          borderRight: '1px solid #000000',
          backgroundColor: !checked ? '#000000' : '#ffffff',
          color: !checked ? '#ffffff' : '#777777',
          padding: '0.3rem 0.6rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          fontWeight: 900,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.1s ease',
        }}
      >
        OFF
      </button>

      {/* ON SEGMENT */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(true)}
        style={{
          border: 'none',
          backgroundColor: checked ? '#000000' : '#ffffff',
          color: checked ? '#ffffff' : '#777777',
          padding: '0.3rem 0.6rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          fontWeight: 900,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.1s ease',
        }}
      >
        ON
      </button>
    </div>
  );
}
