'use client';

import { useState } from 'react';

export default function Page() {
  const [userId, setUserId] = useState<string>('u001');

  const [clockInResult, setClockInResult] = useState<string>('');
  const [clockOutResult, setClockOutResult] = useState<string>('');
  const [breakStartResult, setBreakStartResult] = useState<string>('');
  const [breakEndResult, setBreakEndResult] = useState<string>('');

  const fmtJST = (iso?: string) => {
    if (!iso) return '';
    return new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  };

  const clockIn = async () => {
    try {
      const res = await fetch('http://localhost:3001/attendance/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
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
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // 例: "09/01 18:05 → 09/01 19:10 / 実働65分（休憩10分）"
      const nice =
        `${fmtJST(json.clockInAt)} → ${fmtJST(json.clockOutAt)} / ` +
        `実働${json.workedMinutes ?? '?'}分（休憩${json.breakMinutes ?? '?'}分）`;
      setClockOutResult(nice);
    } catch (e) {
      setClockOutResult(`error: ${(e as Error).message}`);
    }
  };

  const breakStart = async () => {
    try {
      const res = await fetch('http://localhost:3001/attendance/break-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
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
        body: JSON.stringify({ userId }),
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

      {/* userId 入力 */}
      <div className="mb-6 flex items-center gap-2">
        <label className="text-sm text-gray-600">userId:</label>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="px-2 py-1 border rounded"
          placeholder="u001"
        />
      </div>

      {/* 出勤打刻 */}
      <div className="mt-2 flex items-center gap-4">
        <button onClick={clockIn} className="px-4 py-2 rounded border hover:bg-gray-50">
          出勤打刻 (API)
        </button>
        <span className="text-sm text-gray-600">clock-in: {clockInResult}</span>
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

      {/* 退勤打刻 */}
      <div className="mt-6 flex items-center gap-4">
        <button onClick={clockOut} className="px-4 py-2 rounded border hover:bg-gray-50">
          退勤打刻 (API)
        </button>
        <span className="text-sm text-gray-600">clock-out: {clockOutResult}</span>
      </div>
    </main>
  );
}
