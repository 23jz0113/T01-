import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-700 text-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* 左上タイトル */}
        <h1 className="text-xl font-bold tracking-wide">管理システム</h1>

        {/* ハンバーガーボタン（スマホ） */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <span className="text-3xl">&times;</span> // ×
          ) : (
            <span className="text-3xl">&#9776;</span> // ☰
          )}
        </button>

        {/* PCメニュー */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/ranking" className="hover:text-gray-200 transition">
              ランキング
            </Link>
          </li>
          <li>
            <Link to="/event-edit" className="hover:text-gray-200 transition">
              イベント編集
            </Link>
          </li>
          <li>
            <Link to="/user-edit" className="hover:text-gray-200 transition">
              ユーザー編集
            </Link>
          </li>
          <li>
            <Link to="/logout" className="hover:text-gray-200 transition">
              ログアウト
            </Link>
          </li>
        </ul>
      </div>

      {/* スマホメニュー */}
      {isOpen && (
        <ul className="md:hidden bg-blue-600 px-4 pb-3 space-y-2 text-center">
          <li>
            <Link
              to="/ranking"
              className="block py-2 hover:bg-blue-500 rounded"
              onClick={() => setIsOpen(false)}
            >
              ランキング
            </Link>
          </li>
          <li>
            <Link
              to="/event-edit"
              className="block py-2 hover:bg-blue-500 rounded"
              onClick={() => setIsOpen(false)}
            >
              イベント編集
            </Link>
          </li>
          <li>
            <Link
              to="/user-edit"
              className="block py-2 hover:bg-blue-500 rounded"
              onClick={() => setIsOpen(false)}
            >
              ユーザー編集
            </Link>
          </li>
          <li>
            <Link
              to="/logout"
              className="block py-2 hover:bg-blue-500 rounded"
              onClick={() => setIsOpen(false)}
            >
              ログアウト
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
