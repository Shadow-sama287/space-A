'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleSheetAction, resetSheetProgressAction, updatePreferencesAction } from '@/app/actions/sheet-actions';
import { logout } from '@/app/auth-actions';
import BrutalistToggle from '@/components/BrutalistToggle';

interface SheetProgress {
  sheetId: string;
  label: string;
  totalCount: number;
  solvedCount: number;
}

import { calculateAchievements } from '@/lib/achievements';

interface SettingsClientProps {
  userEmail: string;
  joinedDate: string;
  streak: number;
  maxStreak: number;
  solvedCount: number;
  masteredCount: number;
  enabledSheets: string[];
  defaultSheet: string;
  dailyGoal: number;
  currentTheme: string;
  sheetProgressList: SheetProgress[];
}

type CategoryTab = 'sheets' | 'preferences' | 'themes' | 'achievements' | 'account' | 'developer';

const THEMES = [
  {
    id: 'monochrome',
    name: 'MONOCHROME LIGHT',
    desc: 'Stark White & Jet Black Brutalism',
    bg: '#ffffff',
    card: '#f3f3f3',
    accent: '#000000',
    text: '#000000',
  },
  {
    id: 'monochrome_dark',
    name: 'MONOCHROME DARK',
    desc: 'Main Base Dark Mode (Jet Black & White)',
    bg: '#0a0a0a',
    card: '#181818',
    accent: '#ffffff',
    text: '#ffffff',
  },
  {
    id: 'cyberpunk',
    name: 'CYBERPUNK NEON',
    desc: 'Electric Neon Yellow on Midnight Void Black',
    bg: '#0a0a0c',
    card: '#16161a',
    accent: '#ffef00',
    text: '#ffef00',
  },
  {
    id: 'dracula',
    name: 'DRACULA DARK',
    desc: 'Vibrant Coral Pink & Soft Cyan Slate',
    bg: '#282a36',
    card: '#44475a',
    accent: '#ff79c6',
    text: '#f8f8f2',
  },
  {
    id: 'matrix',
    name: 'MATRIX TERMINAL',
    desc: 'Retro CRT Neon Green & Deep Charcoal',
    bg: '#0d1117',
    card: '#161b22',
    accent: '#00ff66',
    text: '#00ff66',
  },
  {
    id: 'solarized',
    name: 'SOLARIZED AMBER',
    desc: 'Warm Paper Cream, Indigo & Burnt Orange',
    bg: '#fdf6e3',
    card: '#eee8d5',
    accent: '#cb4b16',
    text: '#073642',
  },
  {
    id: 'abyss',
    name: 'ABYSS VOID',
    desc: 'Deep Void Navy & Electric Cyan',
    bg: '#050814',
    card: '#0e162d',
    accent: '#00f0ff',
    text: '#e0f7fc',
  },
  {
    id: 'tokyo_night',
    name: 'TOKYO NIGHT',
    desc: 'Dark Indigo, Slate & Electric Purple',
    bg: '#1a1b26',
    card: '#24283b',
    accent: '#bb9af7',
    text: '#c0caf5',
  },
  {
    id: 'grayscale',
    name: 'GRAYSCALE NEUTRAL',
    desc: 'Eye-Care Muted Paper Slate Gray',
    bg: '#181818',
    card: '#262626',
    accent: '#737373',
    text: '#e5e5e5',
  },
  {
    id: 'nord',
    name: 'NORD ARCTIC',
    desc: 'Eye-Care Arctic Ice Blue & Slate',
    bg: '#2e3440',
    card: '#3b4252',
    accent: '#88c0d0',
    text: '#eceff4',
  },
  {
    id: 'gruvbox',
    name: 'GRUVBOX WARM',
    desc: 'Eye-Care Warm Retro Amber & Dark Cream',
    bg: '#282828',
    card: '#3c3836',
    accent: '#fe8019',
    text: '#ebdbb2',
  },
  {
    id: 'catppuccin',
    name: 'CATPPUCCIN MOCHA',
    desc: 'Eye-Care Soft Pastel Mauve & Slate',
    bg: '#1e1e2e',
    card: '#313244',
    accent: '#cba6f7',
    text: '#cdd6f4',
  },
];

export default function SettingsClient({
  userEmail,
  joinedDate,
  streak,
  maxStreak,
  solvedCount,
  masteredCount,
  enabledSheets: initialEnabledSheets,
  defaultSheet: initialDefaultSheet,
  dailyGoal: initialDailyGoal,
  currentTheme: initialTheme,
  sheetProgressList,
}: SettingsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const achievements = calculateAchievements({ solvedCount, masteredCount, streak, maxStreak });
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  // Navigation & Search State
  const [activeTab, setActiveTab] = useState<CategoryTab>('sheets');
  const [searchQuery, setSearchQuery] = useState('');

  // Setting States
  const [enabledSheets, setEnabledSheets] = useState<string[]>(initialEnabledSheets);
  const [defaultSheet, setDefaultSheet] = useState<string>(initialDefaultSheet);
  const [dailyGoal, setDailyGoal] = useState<number>(initialDailyGoal);
  const [activeTheme, setActiveTheme] = useState<string>(initialTheme);
  const [togglingSheet, setTogglingSheet] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Toggle Sheet Handler
  async function handleToggleSheet(sheetId: string, currentEnabled: boolean) {
    setTogglingSheet(sheetId);
    setStatusMsg(null);
    try {
      const result = await toggleSheetAction(sheetId, !currentEnabled);
      setEnabledSheets(result.enabledSheets);
      setStatusMsg({ text: `SETTING UPDATED: ${sheetId.toUpperCase()} IS NOW ${!currentEnabled ? 'ENABLED' : 'DISABLED'}`, isError: false });
      startTransition(() => {
        router.refresh();
      });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ text: `ERROR: ${err.message}`, isError: true });
    } finally {
      setTogglingSheet(null);
    }
  }

  // Reset Sheet Progress Handler
  async function handleResetProgress(sheetId: string, sheetLabel: string) {
    const confirmed = window.confirm(
      `ARE YOU SURE YOU WANT TO CLEAR ALL REVIEW PROGRESS FOR "${sheetLabel.toUpperCase()}"?\n\nThis will reset your SM-2 repetitions, ease factors, and scheduled review dates for this sheet. Action cannot be undone.`
    );
    if (!confirmed) return;

    setTogglingSheet(sheetId);
    try {
      await resetSheetProgressAction(sheetId);
      setStatusMsg({ text: `PROGRESS CLEARED FOR ${sheetLabel.toUpperCase()}`, isError: false });
      startTransition(() => {
        router.refresh();
      });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ text: `ERROR: ${err.message}`, isError: true });
    } finally {
      setTogglingSheet(null);
    }
  }

  // Theme Select Handler
  async function handleThemeSelect(themeId: string) {
    setActiveTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('space_a_theme', themeId);

    try {
      const res = await updatePreferencesAction({ theme: themeId });
      if (res?.warning) {
        setStatusMsg({ text: `THEME ACTIVATED: ${themeId.toUpperCase()} (SAVED LOCALLY)`, isError: false });
      } else {
        setStatusMsg({ text: `THEME ACTIVATED: ${themeId.toUpperCase()}`, isError: false });
      }
      startTransition(() => {
        router.refresh();
      });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      // Even if server sync fails, theme is active locally in localStorage & DOM
      setStatusMsg({ text: `THEME ACTIVATED LOCALLY: ${themeId.toUpperCase()}`, isError: false });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  }

  // Update Preferences Handler
  async function handlePreferenceChange(updates: { defaultSheet?: string; dailyGoal?: number }) {
    setStatusMsg(null);
    if (updates.defaultSheet !== undefined) setDefaultSheet(updates.defaultSheet);
    if (updates.dailyGoal !== undefined) setDailyGoal(updates.dailyGoal);

    try {
      await updatePreferencesAction({
        defaultSheet: updates.defaultSheet !== undefined ? updates.defaultSheet : defaultSheet,
        dailyGoal: updates.dailyGoal !== undefined ? updates.dailyGoal : dailyGoal,
      });
      setStatusMsg({ text: 'PREFERENCE SAVED!', isError: false });
      startTransition(() => {
        router.refresh();
      });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ text: `ERROR: ${err.message}`, isError: true });
    }
  }

  const matchesSearch = (title: string, desc: string) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* VS CODE TOP SEARCH BAR */}
      <div className="card" style={{ padding: '0.75rem 1rem', marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search settings (e.g. Cyberpunk, SDE Sheet, Daily Goal)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{
              flex: 1,
              height: '38px',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              padding: '0.4rem 0.75rem',
              border: '2px solid var(--border-color)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-sm btn-black"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', fontFamily: 'monospace' }}
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* GLOBAL STATUS BANNER */}
      {statusMsg && (
        <div
          style={{
            padding: '0.65rem 1rem',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            border: '2px solid var(--border-color)',
            backgroundColor: statusMsg.isError ? '#ffdddd' : 'var(--bg-secondary)',
            boxShadow: '3px 3px 0px 0px var(--shadow-color)',
          }}
        >
          {statusMsg.text}
        </div>
      )}

      {/* MAIN VS CODE TWO-COLUMN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* LEFT SIDEBAR CATEGORIES COLUMN */}
        <div className="card" style={{ padding: '0.75rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
            CATEGORIES
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {/* TAB 1: SHEETS */}
            <button
              onClick={() => setActiveTab('sheets')}
              style={{
                textAlign: 'left',
                padding: '0.65rem 0.85rem',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                backgroundColor: activeTab === 'sheets' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'sheets' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: activeTab === 'sheets' ? '2px solid var(--border-color)' : '2px solid transparent',
                boxShadow: activeTab === 'sheets' ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.1s ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              SHEETS & DATASETS
            </button>

            {/* TAB 2: PREFERENCES */}
            <button
              onClick={() => setActiveTab('preferences')}
              style={{
                textAlign: 'left',
                padding: '0.65rem 0.85rem',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                backgroundColor: activeTab === 'preferences' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'preferences' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: activeTab === 'preferences' ? '2px solid var(--border-color)' : '2px solid transparent',
                boxShadow: activeTab === 'preferences' ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.1s ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              PREFERENCES
            </button>

            {/* TAB 3: THEMES */}
            <button
              onClick={() => setActiveTab('themes')}
              style={{
                textAlign: 'left',
                padding: '0.65rem 0.85rem',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                backgroundColor: activeTab === 'themes' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'themes' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: activeTab === 'themes' ? '2px solid var(--border-color)' : '2px solid transparent',
                boxShadow: activeTab === 'themes' ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.1s ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor"/>
              </svg>
              COLOR THEMES
            </button>

            {/* TAB 4: ACHIEVEMENTS (WIP) */}
            <button
              onClick={() => setActiveTab('achievements')}
              style={{
                textAlign: 'left',
                padding: '0.65rem 0.85rem',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                backgroundColor: activeTab === 'achievements' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'achievements' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: activeTab === 'achievements' ? '2px solid var(--border-color)' : '2px solid transparent',
                boxShadow: activeTab === 'achievements' ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.1s ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
              </svg>
              ACHIEVEMENTS (WIP)
            </button>

            {/* TAB 4: ACCOUNT */}
            <button
              onClick={() => setActiveTab('account')}
              style={{
                textAlign: 'left',
                padding: '0.65rem 0.85rem',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                backgroundColor: activeTab === 'account' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'account' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: activeTab === 'account' ? '2px solid var(--border-color)' : '2px solid transparent',
                boxShadow: activeTab === 'account' ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.1s ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              PROFILE & ACCOUNT
            </button>

            {/* TAB 5: DEVELOPER */}
            <button
              onClick={() => setActiveTab('developer')}
              style={{
                textAlign: 'left',
                padding: '0.65rem 0.85rem',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                backgroundColor: activeTab === 'developer' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'developer' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: activeTab === 'developer' ? '2px solid var(--border-color)' : '2px solid transparent',
                boxShadow: activeTab === 'developer' ? '2px 2px 0px 0px var(--shadow-color)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.1s ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              FEEDBACK & DEV
            </button>
          </div>
        </div>

        {/* RIGHT SETTINGS PANEL (INDEPENDENTLY SCROLLABLE CONTAINER) */}
        <div
          style={{
            maxHeight: 'calc(100vh - 210px)',
            overflowY: 'auto',
            paddingRight: '0.4rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          
          {/* CATEGORY 1: SHEETS & DATASETS */}
          {(activeTab === 'sheets' || searchQuery) && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                <h3 className="card-title" style={{ margin: 0, fontSize: '1rem' }}>
                  SHEETS & CONTENT DATASETS
                </h3>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {enabledSheets.length} / {sheetProgressList.length} ENABLED
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {sheetProgressList.map((sp) => {
                  const isEnabled = enabledSheets.includes(sp.sheetId);
                  const isWorking = togglingSheet === sp.sheetId || isPending;
                  const pct = sp.totalCount > 0 ? Math.round((sp.solvedCount / sp.totalCount) * 100) : 0;
                  const title = `Sheets: ${sp.label}`;
                  const desc = `Enable or disable ${sp.label} (${sp.totalCount} problems). Current completion: ${sp.solvedCount}/${sp.totalCount} (${pct}%).`;

                  if (!matchesSearch(title, desc)) return null;

                  return (
                    <div
                      key={sp.sheetId}
                      style={{
                        border: '2px solid var(--border-color)',
                        padding: '1rem',
                        backgroundColor: isEnabled ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                        boxShadow: isEnabled ? '3px 3px 0px 0px var(--shadow-color)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* SETTING ROW TITLE & DUAL-SEGMENT LIGHT SWITCH TOGGLE */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 900, fontSize: '0.9rem', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                            {sp.label}
                          </div>
                          <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {sp.solvedCount} / {sp.totalCount} Problems Solved ({pct}%)
                          </div>
                        </div>

                        {/* PHYSICAL DUAL SEGMENT LIGHT SWITCH */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <BrutalistToggle
                            checked={isEnabled}
                            onChange={() => handleToggleSheet(sp.sheetId, isEnabled)}
                            disabled={isWorking}
                          />

                          {isEnabled && sp.solvedCount > 0 && (
                            <button
                              onClick={() => handleResetProgress(sp.sheetId, sp.label)}
                              disabled={isWorking}
                              title="Reset progress for this sheet"
                              style={{
                                background: '#fff0f0',
                                border: '1px solid #ff3333',
                                color: '#ff3333',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                padding: '0.35rem 0.5rem',
                                cursor: 'pointer',
                                fontFamily: 'monospace',
                              }}
                            >
                              CLEAR
                            </button>
                          )}
                        </div>
                      </div>

                      {/* PROGRESS BAR */}
                      <div className="progress-bar-container" style={{ height: '8px', marginTop: '0.75rem' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${pct}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CATEGORY 2: COLOR THEMES */}
          {(activeTab === 'themes' || searchQuery) && (
            <div className="card">
              <h3 className="card-title mb-3" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', fontSize: '1rem' }}>
                COLOR THEMES COLLECTION
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {THEMES.map((theme) => {
                  const isCurrent = activeTheme === theme.id;
                  if (!matchesSearch(theme.name, theme.desc)) return null;

                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      style={{
                        border: '2px solid var(--border-color)',
                        padding: '1rem',
                        backgroundColor: theme.bg,
                        color: theme.text,
                        boxShadow: isCurrent ? `4px 4px 0px 0px ${theme.accent}` : '2px 2px 0px 0px var(--shadow-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <span style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '0.85rem', color: theme.text }}>
                            {theme.name}
                          </span>
                          {isCurrent && (
                            <span style={{ fontSize: '0.65rem', fontWeight: 900, fontFamily: 'monospace', backgroundColor: theme.accent, color: theme.bg, padding: '0.15rem 0.4rem', border: `1px solid ${theme.text}` }}>
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', opacity: 0.85, color: theme.text }}>
                          {theme.desc}
                        </div>
                      </div>

                      {/* MINI COLOR SWATCHES PREVIEW */}
                      <div style={{ display: 'flex', gap: '6px', borderTop: `1px solid ${theme.accent}`, paddingTop: '0.6rem' }}>
                        <div title="Background" style={{ width: '22px', height: '22px', backgroundColor: theme.bg, border: `1px solid ${theme.text}` }} />
                        <div title="Card Fill" style={{ width: '22px', height: '22px', backgroundColor: theme.card, border: `1px solid ${theme.text}` }} />
                        <div title="Accent Color" style={{ width: '22px', height: '22px', backgroundColor: theme.accent, border: `1px solid ${theme.text}` }} />
                        <div title="Text Color" style={{ width: '22px', height: '22px', backgroundColor: theme.text, border: `1px solid ${theme.accent}` }} />
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleThemeSelect(theme.id);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          backgroundColor: isCurrent ? theme.accent : 'transparent',
                          color: isCurrent ? theme.bg : theme.text,
                          border: `2px solid ${theme.text}`,
                          cursor: 'pointer',
                          marginTop: '0.2rem',
                        }}
                      >
                        {isCurrent ? 'SELECTED THEME' : 'SELECT THEME'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CATEGORY 3: PREFERENCES */}
          {(activeTab === 'preferences' || searchQuery) && (
            <div className="card">
              <h3 className="card-title mb-3" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', fontSize: '1rem' }}>
                PREFERENCES & SM-2 ENGINE
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* ROW 1: DEFAULT SHEET */}
                {matchesSearch('Default Explorer Sheet', 'Select which DSA sheet loads first when opening Explorer') && (
                  <div style={{ border: '2px solid var(--border-color)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 900, fontSize: '0.85rem', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                        Default Explorer Sheet
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'monospace' }}>
                        Sets the active sheet pre-selected when opening the Explorer tab.
                      </div>
                    </div>

                    <select
                      value={defaultSheet}
                      onChange={(e) => handlePreferenceChange({ defaultSheet: e.target.value })}
                      className="input"
                      style={{ height: '36px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 'bold', padding: '0.35rem' }}
                    >
                      <option value="striver_sde">STRIVER SDE SHEET (191)</option>
                      <option value="striver_a2z">STRIVER A2Z SHEET (474)</option>
                    </select>
                  </div>
                )}

                {/* ROW 2: DAILY GOAL */}
                {matchesSearch('Daily Review Target Goal', 'Set target number of due problems to complete per day') && (
                  <div style={{ border: '2px solid var(--border-color)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 900, fontSize: '0.85rem', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                        Daily Review Target Goal
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'monospace' }}>
                        Target number of spaced repetition reviews to solve each day.
                      </div>
                    </div>

                    <select
                      value={dailyGoal}
                      onChange={(e) => handlePreferenceChange({ dailyGoal: Number(e.target.value) })}
                      className="input"
                      style={{ height: '36px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 'bold', padding: '0.35rem' }}
                    >
                      <option value={5}>5 PROBLEMS / DAY</option>
                      <option value={10}>10 PROBLEMS / DAY (RECOMMENDED)</option>
                      <option value={15}>15 PROBLEMS / DAY</option>
                      <option value={20}>20 PROBLEMS / DAY</option>
                    </select>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* CATEGORY 4: ACHIEVEMENTS (WIP) */}
          {(activeTab === 'achievements' || searchQuery) && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                <h3 className="card-title" style={{ margin: 0, fontSize: '1rem' }}>
                  ACHIEVEMENTS & BADGES (WIP)
                </h3>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 900 }}>
                  {unlockedCount} / {achievements.length} UNLOCKED
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {achievements.map((ach) => {
                  if (!matchesSearch(ach.name, ach.desc)) return null;

                  const pct = Math.min(Math.round((ach.current / ach.target) * 100), 100);

                  return (
                    <div
                      key={ach.id}
                      style={{
                        border: ach.isUnlocked ? '2px solid var(--border-color)' : '2px dashed var(--border-color)',
                        padding: '1rem',
                        backgroundColor: ach.isUnlocked ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                        boxShadow: ach.isUnlocked ? '3px 3px 0px 0px var(--shadow-color)' : 'none',
                        opacity: ach.isUnlocked ? 1 : 0.75,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 900, color: 'var(--text-secondary)' }}>
                            {ach.badgeCode}
                          </span>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontFamily: 'monospace',
                              fontWeight: 900,
                              padding: '0.15rem 0.4rem',
                              border: '1px solid var(--border-color)',
                              backgroundColor: ach.isUnlocked ? 'var(--text-primary)' : 'transparent',
                              color: ach.isUnlocked ? 'var(--bg-primary)' : 'var(--text-primary)',
                            }}
                          >
                            {ach.isUnlocked ? '[ UNLOCKED ]' : '[ LOCKED ]'}
                          </span>
                        </div>

                        <div style={{ fontWeight: 900, fontSize: '0.85rem', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                          {ach.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {ach.desc}
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 'bold', marginBottom: '3px' }}>
                          <span>PROGRESS</span>
                          <span>{ach.current} / {ach.target} ({pct}%)</span>
                        </div>
                        <div className="progress-bar-container" style={{ height: '6px' }}>
                          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CATEGORY 4: PROFILE & ACCOUNT */}
          {(activeTab === 'account' || searchQuery) && (
            <div className="card">
              <h3 className="card-title mb-3" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', fontSize: '1rem' }}>
                PROFILE & ACCOUNT SETTINGS
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ border: '2px solid var(--border-color)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>User Email</div>
                    <div style={{ fontWeight: 900, fontSize: '0.85rem', marginTop: '2px' }}>{userEmail}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.2rem 0.5rem' }}>AUTHENTICATED</span>
                </div>

                <div style={{ border: '2px solid var(--border-color)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Solve Streak</div>
                    <div style={{ fontWeight: 900, fontSize: '0.85rem', marginTop: '2px' }}>{streak} Days Active</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Member Since</div>
                    <div style={{ fontWeight: 900, fontSize: '0.85rem', marginTop: '2px' }}>
                      {new Date(joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '0.5rem' }}>
                  <form action={logout}>
                    <button type="submit" className="btn btn-black" style={{ width: '100%', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'monospace' }}>
                      LOGOUT OF SPACE A
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 5: FEEDBACK & DEVELOPER */}
          {(activeTab === 'developer' || searchQuery) && (
            <div className="card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h3 className="card-title mb-2" style={{ fontSize: '1rem' }}>
                FEEDBACK & DEVELOPER TRANSPARENCY
              </h3>
              <ul style={{ fontSize: '0.75rem', paddingLeft: '1.25rem', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Your submission (Bug, Idea, or Suggestion) is saved to the Supabase database.</li>
                <li>If configured, a real-time notification alert is sent directly to the developer's Slack channel.</li>
                <li>Your review progress and profile data remain completely secure.</li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
