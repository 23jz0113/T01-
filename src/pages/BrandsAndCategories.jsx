import React, { useState, useEffect } from "react";
import api from "../api/api.jsx";

/* --- トースト通知 --- */
const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  const bgColor = type === "success" ? "bg-emerald-500" : "bg-rose-500";
  return <div className={`fixed top-5 right-5 z-[100] rounded-lg px-4 py-3 text-white shadow-lg ${bgColor}`}>{message}</div>;
};

const BrandsAndCategories = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("brands");
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
  };

  const fetchBrands = async () => {
    try {
      const res = await api.get("/brands");
      setBrands(res.data);
    } catch (err) {
      console.error("Error fetching brands:", err);
      showToast("ブランドの取得に失敗しました", "error");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      showToast("カテゴリーの取得に失敗しました", "error");
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`${type === 'brands' ? 'ブランド' : 'カテゴリー'}を削除しますか？`)) {
      return;
    }

    try {
      await api.post(`/${type}/${id}`, { _method: "DELETE" });

      showToast(`${type === 'brands' ? 'ブランド' : 'カテゴリー'}を削除しました`);
      if (type === "brands") {
        setBrands(brands.filter((brand) => brand.id !== id));
      } else {
        setCategories(categories.filter((category) => category.id !== id));
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      let errorMessage = "削除中にエラーが発生しました";
      if (err.response) {
        switch (err.response.status) {
          case 404:
            errorMessage = "アイテムはすでに削除されています。";
            if (type === "brands") fetchBrands();
            else fetchCategories();
            break;
          case 405:
            errorMessage = "サーバーがこの操作を許可していません。";
            break;
          case 403:
            errorMessage = "権限がありません。";
            break;
          default:
            errorMessage = "削除に失敗しました";
        }
      }
      showToast(errorMessage, "error");
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const listItems = activeTab === "brands" ? brands : categories;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {toast.visible && <Toast {...toast} onDismiss={() => setToast({ ...toast, visible: false })} />}

      <div className="mx-auto max-w-7xl bg-white rounded-2xl p-6 shadow-lg sm:p-8">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold text-slate-900">ブランド・カテゴリー管理</h1>
          <p className="text-slate-500 mt-1">ブランドとカテゴリーの一覧です。</p>
        </div>

        <div className="my-6 flex justify-center">
          <div className="tab-group">
            <button
              onClick={() => setActiveTab("brands")}
              className={`tab-item ${activeTab === "brands" ? "tab-item-active" : "tab-item-inactive"}`}
            >
              ブランド
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`tab-item ${activeTab === "categories" ? "tab-item-active" : "tab-item-inactive"}`}
            >
              カテゴリー
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {listItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listItems.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-slate-50 flex justify-between items-center">
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <button
                    onClick={() => handleDelete(item.id, activeTab)}
                    className="text-rose-500 hover:text-rose-700 font-bold"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-10 border-2 border-dashed rounded-lg text-slate-500">
              <p className="font-bold">{activeTab === 'brands' ? 'ブランド' : 'カテゴリー'}がありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandsAndCategories;
