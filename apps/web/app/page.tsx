'use client';

import { useState } from 'react';

export default function Page() {
  const [healthStatus, setHealthStatus] = useState<string>('(not checked)');
  const [clockInResult, setClockInResult] = useState<string>('');

  // /health を叩く
  const ping = async () => {
    try {
      const res = await fetch('http://localhost:3001/health');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setHealthStatus(JSON.stringify(json));
      console.log('API health:', json);
    } catch (err) {
      console.error('API error:', err);
      setHealthStatus(`error: ${(err as Error).message}`);
    }
  };

  // /attendance/clock-in を叩く
  const clockIn = async () => {
    try {
      const res = await fetch('http://localhost:3001/attendance/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'u001' }), // 仮のユーザーID
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setClockInResult(JSON.stringify(json));
      console.log('Clock-in response:', json);
    } catch (err) {
      console.error('Clock-in error:', err);
      setClockInResult(`error: ${(err as Error).message}`);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Hi!</h1>

      {/* 打刻ボタン（ダミー、今はフロント側だけ） */}
      <button className="px-4 py-2 rounded border hover:bg-gray-50">
        出勤打刻（フロントのみ）
      </button>

      {/* API動作確認 */}
      <div className="mt-6 flex items-center gap-4">
        <button onClick={ping} className="px-4 py-2 rounded border hover:bg-gray-50">
          API動作確認
        </button>
        <span className="text-sm text-gray-600">status: {healthStatus}</span>
      </div>

      {/* 出勤打刻(API) */}
      <div className="mt-6 flex items-center gap-4">
        <button onClick={clockIn} className="px-4 py-2 rounded border hover:bg-gray-50">
          出勤打刻(API)
        </button>
        <span className="text-sm text-gray-600">clock-in: {clockInResult}</span>
      </div>
    </main>
  );
}
