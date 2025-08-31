'use client';

export default function Page() {
  const handleClick = (msg: string) => {
    console.log(msg);
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Hi!</h1>
      <p className="mb-4">勤怠管理アプリへようこそ</p>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => handleClick('出勤!')}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          出勤
        </button>
        <button
          onClick={() => handleClick('退勤!')}
          className="px-4 py-2 rounded bg-red-500 text-white"
        >
          退勤
        </button>
        <button
          onClick={() => handleClick('休憩開始!')}
          className="px-4 py-2 rounded bg-yellow-500 text-black"
        >
          休憩開始
        </button>
        <button
          onClick={() => handleClick('休憩終了!')}
          className="px-4 py-2 rounded bg-blue-500 text-white"
        >
          休憩終了
        </button>
      </div>
    </main>
  );
}
