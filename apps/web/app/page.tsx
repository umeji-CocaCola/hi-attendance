'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  // 未ログインなら /login へ
  useEffect(() => {
    const tk = localStorage.getItem('token');
    if (!tk) router.replace('/login');
  }, [router]);

  // 表示用
  const [me, setMe] = useState<string>('');
  const [clockInResult, setClockInResult] = useState('');
  const [clockOutResult, setClockOutResult] = useState('');
  const [breakStartResult, setBreakStartResult] = useState('');
  const [breakEndResult, setBreakEndResult] = useState('');

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

  const authed = async (path: string, init?: RequestInit) => {
    const tk = localStorage.getItem('token');
    if (!tk) throw new Error('未ログインです');
    const res = await fetch(`http://localhost:3001${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tk}`,
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const fetchMe = async () => {
    try {
      const json = await authed('/auth/me', { method: 'GET' });
      setMe(JSON.stringify(json));
    } catch (e) {
      setMe(`error: ${(e as Error).message}`);
    }
  };

  const clockIn = async () => {
    try {
      const json = await authed('/attendance/clock-in', { method: 'POST' });
      setClockInResult(JSON.stringify(json));
    } catch (e) {
      setClockInResult(`error: ${(e as Error).message}`);
    }
  };

  const clockOut = async () => {
    try {
      const json = await authed('/attendance/clock-out', { method: 'POST' });
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
      const json = await authed('/attendance/break-start', { method: 'POST' });
      setBreakStartResult(JSON.stringify(json));
    } catch (e) {
      setBreakStartResult(`error: ${(e as Error).message}`);
    }
  };

  const breakEnd = async () => {
    try {
      const json = await authed('/attendance/break-end', { method: 'POST' });
      setBreakEndResult(JSON.stringify(json));
    } catch (e) {
      setBreakEndResult(`error: ${(e as Error).message}`);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-6">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold">Hi!</h1>
        <button onClick={logout} className="px-3 py-2 rounded border hover:bg-gray-50">
          ログアウト
        </button>
        <button onClick={fetchMe} className="px-3 py-2 rounded border hover:bg-gray-50">
          ログイン確認（/auth/me）
        </button>
        <span className="text-sm text-gray-600">{me}</span>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={clockIn} className="px-4 py-2 rounded border hover:bg-gray-50">
          出勤打刻
        </button>
        <span className="text-sm text-gray-600">{clockInResult}</span>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={breakStart} className="px-4 py-2 rounded border hover:bg-gray-50">
          休憩開始
        </button>
        <span className="text-sm text-gray-600">{breakStartResult}</span>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={breakEnd} className="px-4 py-2 rounded border hover:bg-gray-50">
          休憩終了
        </button>
        <span className="text-sm text-gray-600">{breakEndResult}</span>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={clockOut} className="px-4 py-2 rounded border hover:bg-gray-50">
          退勤打刻
        </button>
        <span className="text-sm text-gray-600">{clockOutResult}</span>
      </div>
    </main>
  );
}
