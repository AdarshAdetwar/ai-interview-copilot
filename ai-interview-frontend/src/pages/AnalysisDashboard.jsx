import { useEffect, useState } from "react";
import api from "../api"; // ✅ FIXED: removed raw axios import
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function AnalysisDashboard() {
  const [analysis, setAnalysis] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      fetchAnalysis(sessionId);
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAnalysis = async (sid) => {
    try {
      const res = await api.get(`/interview/analysis?sessionId=${sid}`);
      setAnalysis(res.data);
    } catch (err) {
      console.error("Failed to fetch analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history"); // ✅ FIXED: use api client, not raw axios
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const chartData = history.map((item, i) => ({
    index: `Q${i + 1}`,
    score: item.score,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl">Loading your interview analysis...</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-white min-h-screen bg-gray-900">
      <h1 className="text-3xl mb-6">📊 Interview Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-xl border-t-4 border-green-500">
          <h2 className="text-green-400 text-xl mb-2">Strengths</h2>
          {analysis.strengths?.length > 0 ? (
            analysis.strengths.map((s, i) => <p key={i}>✔ {s}</p>)
          ) : (
            <p className="text-gray-500 italic">No strengths identified yet</p>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border-t-4 border-yellow-500">
          <h2 className="text-yellow-400 text-xl mb-2">Improving</h2>
          {analysis.improving?.length > 0 ? (
            analysis.improving.map((s, i) => <p key={i}>⚡ {s}</p>)
          ) : (
            <p className="text-gray-500 italic">No mid-level topics</p>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border-t-4 border-red-500">
          <h2 className="text-red-400 text-xl mb-2">Weaknesses</h2>
          {analysis.weaknesses?.length > 0 ? (
            analysis.weaknesses.map((s, i) => <p key={i}>❌ {s}</p>)
          ) : (
            <p className="text-gray-500 italic text-sm">No weaknesses 🎉 Great job!</p>
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <h2 className="text-blue-400 text-xl mb-4">📈 Score Trend</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" stroke="#94a3b8" />
              <YAxis domain={[0, 10]} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                itemStyle={{ color: "#06d6f5" }}
              />
              <Line type="monotone" dataKey="score" stroke="#06d6f5" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-blue-400 text-xl mb-4">📜 Score History</h2>
        {history.length > 0 ? history.map((item, i) => (
          <div key={i} className="mb-3 border-l-2 border-gray-600 pl-3">
            <p className="text-sm text-gray-400">Q{i + 1}: {item.question}</p>
            <p className="text-white">Score: <span className="font-bold">{item.score}/10</span></p>
          </div>
        )) : <p className="text-gray-500 italic">No interview history found.</p>}
      </div>
    </div>
  );
}

export default AnalysisDashboard;