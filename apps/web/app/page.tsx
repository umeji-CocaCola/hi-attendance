'use client';

import { useState } from 'react';

export default function Page() {
  const [clockInResult, setClockInResult] = useState<string>('');
  const [clockOutResult, setClockOutResult] = useState<string>('');
  const [breakStartResult, setBreakStartResult] = useState<string>('');
  const [breakEndResult, setBreakEndResult] = useState<string>('');

  const clockIn = async () => {
    try {
      const res = await fetch('http://localhost:3001/attendance/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'u001' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setClockInResult(JSON.stringify(json));
    } catch (e) {
      setClockInResult(`error: ${(e as Error).message}`);
    }
  };

  const clockOut = async () => {
    try {
      const res = await fetch('http://localhost:3001/attendance/clock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'u001' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setClockOutResult(JSON.stringify(json));
    } catch (e) {
      setClockOutResult(`error: ${(e as Error).message}`);
    }
  };

  const breakStart = async () => {
    try {
      const res = await fetch('http://localhost:3001/attendance/break-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'u001' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setBreakStartResult(JSON.stringify(json));
    } catch (e) {
      setBreakStartResult(`error: ${(e as Error).message}`);
    }
  };

  const breakEnd = async () => {
    try {
      const res = await fetch('http://localhost:3001/attendance/break-end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'u001' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setBreakEndResult(JSON.stringify(json));
    } catch (e) {
      setBreakEndResult(`error: ${(e as Error).message}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Hi!</h1>

      {/* 出勤打刻 */}
      <div className="mt-4 flex items-center gap-4">
        <button onClick={clockIn} className="px-4 py-2 rounded border hover:bg-gray-50">
          出勤打刻 (API)
        </button>
        <span className="text-sm text-gray-600">clock-in: {clockInResult}</span>
      </div>

      {/* 退勤打刻 */}
      <div className="mt-6 flex items-center gap-4">
        <button onClick={clockOut} className="px-4 py-2 rounded border hover:bg-gray-50">
          退勤打刻 (API)
        </button>
        <span className="text-sm text-gray-600">clock-out: {clockOutResult}</span>
      </div>

      {/* 休憩開始 */}
      <div className="mt-6 flex items-center gap-4">
        <button onClick={breakStart} className="px-4 py-2 rounded border hover:bg-gray-50">
          休憩開始 (API)
        </button>
        <span className="text-sm text-gray-600">break-start: {breakStartResult}</span>
      </div>

      {/* 休憩終了 */}
      <div className="mt-6 flex items-center gap-4">
        <button onClick={breakEnd} className="px-4 py-2 rounded border hover:bg-gray-50">
          休憩終了 (API)
        </button>
        <span className="text-sm text-gray-600">break-end: {breakEndResult}</span>
      </div>
    </main>
  );
}
