import { useEffect, useState } from "react";
import api from "../api";

function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");
      setData(res.data); // ✅ FIXED: store the response
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = data.filter(item => item.sessionId);

  const getColor = (score) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const grouped = filteredData.reduce((acc, item) => {
    const key = item.sessionId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl mb-6">📊 Interview History</h1>

      {Object.entries(grouped).length === 0 && (
        <p className="text-gray-400">No interview sessions found</p>
      )}

      {Object.entries(grouped).map(([session, items], index) => {
        const avg = items.reduce((a, b) => a + b.score, 0) / items.length;

        return (
          <div key={session} className="mb-6 bg-gray-800 p-5 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-green-400 font-semibold">
                Interview {index + 1}
              </h2>
              <span className="text-yellow-400 font-bold">
                Avg: {avg.toFixed(1)} / 10
              </span>
            </div>

            {items.map((item, i) => (
              <div key={i} className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                <p className="text-blue-400 font-medium">Q{i + 1}: {item.question}</p>
                <p className="mt-2 text-gray-300">{item.answer}</p>
                <p className={`mt-2 font-semibold ${getColor(item.score)}`}>
                  Score: {item.score}/10
                </p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default History;