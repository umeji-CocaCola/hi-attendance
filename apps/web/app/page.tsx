'use client';
import { useState } from 'react';

export default function Page() {
  const [status, setStatus] = useState<string>('(not checked)');

  const ping = async () => {
    try {
      const res = await fetch('http://localhost:3001/health');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setStatus(JSON.stringify(json)); // => {"ok":true}
      console.log('API health:', json);
    } catch (err) {
      console.error('API error:', err);
      setStatus(`error: ${(err as Error).message}`);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Hi!</h1>

      {/* 既存の打刻ボタンはそのまま */}

      <div className="mt-6 flex items-center gap-4">
        <button onClick={ping} className="px-4 py-2 rounded border hover:bg-gray-50">
          API動作確認
        </button>
        <span className="text-sm text-gray-600">status: {status}</span>
      </div>
    </main>
  );
}
