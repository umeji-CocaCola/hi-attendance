'use client';

import { useState } from 'react';

export default function Page() {
  // ログイン用
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo');
  const [token, setToken] = useState<string | null>(null);

  // 打刻結果
  const [clockInResult, setClockInResult] = useState('');
  const [clockOutResult, setClockOutResult] = useState('');
  const [breakStartResult, setBreakStartResult] = useState('');
  const [breakEndResult, setBreakEndResult] = useState('');

  // JSTフォーマッタ
  const fmtJST = (iso?: string) => {
    if (!iso) return '';
    return new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(iso));
  };

  // ログイン処理
  const login = async () => {
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      localStorage.setItem('token', json.accessToken);
      setToken(json.accessToken);
      alert('ログイン成功');
    } catch (e) {
      alert(`ログイン失敗: ${(e as Error).message}`);
    }
  };

  // 認証付き fetch ヘルパー
  const authedFetch = async (path: string, setter: (v: string) => void) => {
    try {
      const tk = token ?? localStorage.getItem('token');
      if (!tk) throw new Error('ログインしてください');
      const res = await fetch(`http://localhost:3001${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tk}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setter(JSON.stringify(json));
    } catch (e) {
      setter(`error: ${(e as Error).message}`);
    }
  };

  // 打刻操作
  const clockIn = () => authedFetch('/attendance/clock-in', setClockInResult);
  const clockOut = async () => {
    try {
      const tk = token ?? localStorage.getItem('token');
      if (!tk) throw new Error('ログインしてください');
      const res = await fetch('http://localhost:3001/attendance/clock-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tk}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const nice =
        `${fmtJST(json.clockInAt)} → ${fmtJST(json.clockOutAt)} / ` +
        `実働${json.workedMinutes ?? '?'}分（休憩${json.breakMinutes ?? '?'}分）`;
      setClockOutResult(nice);
    } catch (e) {
      setClockOutResult(`error: ${(e as Error).message}`);
    }
  };
  const breakStart = () => authedFetch('/attendance/break-start', setBreakStartResult);
  const breakEnd = () => authedFetch('/attendance/break-end', setBreakEndResult);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-6">
      <h1 className="text-4xl font-bold mb-8">Hi!</h1>

      {/* ログインフォーム */}
      <div className="flex flex-col gap-2 border p-4 rounded w-80">
        <label className="text-sm">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-2 py-1 border rounded"
        />
        <label className="text-sm">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-2 py-1 border rounded"
        />
        <button onClick={login} className="mt-2 px-4 py-2 rounded border hover:bg-gray-50">
          ログイン
        </button>
      </div>

      {/* 出勤 */}
      <div className="flex items-center gap-4">
        <button onClick={clockIn} className="px-4 py-2 rounded border hover:bg-gray-50">
          出勤打刻
        </button>
        <span className="text-sm text-gray-600">{clockInResult}</span>
      </div>

      {/* 休憩開始 */}
      <div className="flex items-center gap-4">
        <button onClick={breakStart} className="px-4 py-2 rounded border hover:bg-gray-50">
          休憩開始
        </button>
        <span className="text-sm text-gray-600">{breakStartResult}</span>
      </div>

      {/* 休憩終了 */}
      <div className="flex items-center gap-4">
        <button onClick={breakEnd} className="px-4 py-2 rounded border hover:bg-gray-50">
          休憩終了
        </button>
        <span className="text-sm text-gray-600">{breakEndResult}</span>
      </div>

      {/* 退勤 */}
      <div className="flex items-center gap-4">
        <button onClick={clockOut} className="px-4 py-2 rounded border hover:bg-gray-50">
          退勤打刻
        </button>
        <span className="text-sm text-gray-600">{clockOutResult}</span>
      </div>
    </main>
  );
}
