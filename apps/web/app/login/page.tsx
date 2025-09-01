'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>('');

  // 既にログイン済みならホームへ
  useEffect(() => {
    const tk = localStorage.getItem('token');
    if (tk) router.replace('/');
  }, [router]);

  const login = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      localStorage.setItem('token', json.accessToken);
      router.replace('/'); // ログイン後に打刻画面へ
    } catch (e) {
      setErr(`ログイン失敗: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-4">
      <h1 className="text-3xl font-bold">Hi! ログイン</h1>

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
        <button
          onClick={login}
          disabled={loading}
          className="mt-2 px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-60"
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>
    </main>
  );
}
