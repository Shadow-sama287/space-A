'use client';

import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

interface TldrawCanvasProps {
  problemId: string;
}

export default function TldrawCanvas({ problemId }: TldrawCanvasProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Tldraw persistenceKey={`space_a_scratchpad_${problemId}`} />
    </div>
  );
}
