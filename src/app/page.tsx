'use client';

import { useActionState, useState } from 'react';
import { login, signup } from './auth-actions';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginState, loginAction, isPendingLogin] = useActionState(login, null);
  const [signupState, signupAction, isPendingSignup] = useActionState(signup, null);

  const activeState = isLogin ? loginState : signupState;
  const isPending = isLogin ? isPendingLogin : isPendingSignup;

  return (
    <main className="app-container" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        
        {/* BIG BRUTALIST BRAND BLOCK */}
        <div className="card text-center" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', marginBottom: '2rem', padding: '2rem 1.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-1px', lineHeight: '1' }}>
            SPACE A
          </h1>
          <p className="mt-1" style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '1px' }}>
            Spaced Repetition Engine for DSA Sheets
          </p>
        </div>

        {/* AUTH CARD */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          {/* TAB HEADERS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '3px solid var(--border-color)', margin: '-1.5rem -1.5rem 1.5rem -1.5rem' }}>
            <button
              onClick={() => setIsLogin(true)}
              type="button"
              className="btn btn-outline"
              style={{
                border: 'none',
                borderRight: '3px solid var(--border-color)',
                backgroundColor: isLogin ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontWeight: isLogin ? '900' : 'normal',
                textTransform: 'uppercase',
              }}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              type="button"
              className="btn btn-outline"
              style={{
                border: 'none',
                backgroundColor: !isLogin ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontWeight: !isLogin ? '900' : 'normal',
                textTransform: 'uppercase',
              }}
            >
              Sign Up
            </button>
          </div>

          {/* FORM */}
          <form action={isLogin ? loginAction : signupAction}>
            <div className="mb-2">
              <label style={{ display: 'block', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className="input"
                placeholder="developer@dsa.com"
              />
            </div>

            <div className="mb-3">
              <label style={{ display: 'block', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="input"
                placeholder="********"
              />
            </div>

            {activeState?.error && (
              <div className="mb-2" style={{ border: '3px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', padding: '0.5rem', fontWeight: 'bold', fontSize: '0.8rem' }}>
                [ERR] {activeState.error}
              </div>
            )}

            <button type="submit" disabled={isPending} className="btn btn-black" style={{ width: '100%', textTransform: 'uppercase' }}>
              {isPending ? 'Processing...' : isLogin ? 'Enter Dashboard' : 'Create Profile'}
            </button>
          </form>
        </div>

        <div className="text-center" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          * built in monochrome brutalism. no animations, just logic.
        </div>
      </div>
    </main>
  );
}
