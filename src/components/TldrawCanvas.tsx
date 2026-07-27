'use client';

import { Tldraw, Editor } from 'tldraw';
import 'tldraw/tldraw.css';
import { useEffect, useState, useRef } from 'react';
import { loadScratchpad, saveScratchpad } from '@/app/actions/scratchpad';

interface TldrawCanvasProps {
  problemId: string;
}

export default function TldrawCanvas({ problemId }: TldrawCanvasProps) {
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [snapshot, setSnapshot] = useState<any>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await loadScratchpad(problemId);
        if (data) {
          setSnapshot(data);
        }
      } catch (err) {
        console.error('Failed to load scratchpad', err);
      } finally {
        setInitialDataLoaded(true);
      }
    }
    loadData();
  }, [problemId]);

  const handleMount = (editor: Editor) => {
    if (snapshot) {
      try {
        editor.loadSnapshot(snapshot);
      } catch (err) {
        console.error('Failed to load snapshot into tldraw', err);
      }
    }

    editor.store.listen(() => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(async () => {
        const currentState = editor.getSnapshot();
        try {
          await saveScratchpad(problemId, currentState);
        } catch (err) {
          console.error('Failed to save scratchpad', err);
        }
      }, 2500);
    });
  };

  if (!initialDataLoaded) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="font-mono text-sm uppercase">Loading scratchpad...</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Tldraw
        onMount={handleMount}
        licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
      />
    </div>
  );
}
