import React from "react";

const sampleData = [
  {
    id: 1,
    user: "Alice",
    image: "https://via.placeholder.com/150", // サンプル画像
    outfit: "カジュアルコーデ",
    score: 4.5,
  },
  {
    id: 2,
    user: "Bob",
    image: "https://via.placeholder.com/150",
    outfit: "モード系コーデ",
    score: 4.2,
  },
  {
    id: 3,
    user: "Charlie",
    image: "https://via.placeholder.com/150",
    outfit: "スポーティコーデ",
    score: 4.8,
  },
];

const Ranking = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">コーデランキング</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleData.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={item.image}
                alt={item.outfit}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="font-bold text-lg">{item.user}</h2>
                <p className="text-gray-700">{item.outfit}</p>
                <p className="text-yellow-500 font-semibold mt-2">
                  ⭐ {item.score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ranking;
