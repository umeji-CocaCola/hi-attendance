'use client';

import { useEffect, useState } from 'react';

type DayRow = { date: string; workedMinutes: number; breakMinutes: number };
type Summary = {
  userId: string;
  month: string;
  days: DayRow[];
  totalWorkedMinutes: number;
  totalBreakMinutes: number;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';

export default function SummaryPage() {
  const [month, setMonth] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
  });
  const [data, setData] = useState<Summary | null>(null);
  const [err, setErr] = useState<string>('');

  const fetchSummary = async () => {
    setErr('');
    setData(null);
    try {
      const tk = localStorage.getItem('token');
      if (!tk) throw new Error('未ログインです');
      const res = await fetch(`${apiBase}/attendance/summary?month=${month}`, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: Summary = await res.json();
      setData(json);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  useEffect(() => {
    fetchSummary(); /* 初回自動 */
  }, []); // eslint-disable-line

  const toHHMM = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${String(m).padStart(2, '0')}m`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-6">
      <h1 className="text-3xl font-bold">Hi! 月次サマリ</h1>

      <div className="flex items-center gap-2">
        <label className="text-sm">月 (YYYY-MM):</label>
        <input
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-2 py-1 border rounded"
          placeholder="2025-09"
        />
        <button onClick={fetchSummary} className="px-3 py-2 rounded border hover:bg-gray-50">
          取得
        </button>
        <a href="/" className="ml-4 text-blue-600 underline">
          打刻へ戻る
        </a>
      </div>

      {err && <p className="text-sm text-red-600">error: {err}</p>}

      {data && (
        <div className="w-full max-w-3xl">
          <div className="mb-2 text-sm text-gray-600">
            {data.month} / 合計 実働 {toHHMM(data.totalWorkedMinutes)}（休憩{' '}
            {toHHMM(data.totalBreakMinutes)}）
          </div>
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 border-b">日付 (JST)</th>
                <th className="text-right p-2 border-b">実働</th>
                <th className="text-right p-2 border-b">休憩</th>
              </tr>
            </thead>
            <tbody>
              {data.days.map((d) => (
                <tr key={d.date} className="border-b">
                  <td className="p-2">{d.date}</td>
                  <td className="p-2 text-right">{toHHMM(d.workedMinutes)}</td>
                  <td className="p-2 text-right">{toHHMM(d.breakMinutes)}</td>
                </tr>
              ))}
              {data.days.length === 0 && (
                <tr>
                  <td className="p-2 text-center text-gray-500" colSpan={3}>
                    データなし
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
