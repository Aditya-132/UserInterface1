import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { AlertCircle } from "lucide-react";
import { IconName } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ElectionResult = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const yy = "http://localhost:4000";

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${yy}/api/v1/candidates`);
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to fetch candidates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const data = {
    labels: candidates.map((candidate) => candidate.name),
    datasets: [
      {
        label: "Votes",
        data: candidates.map((candidate) => candidate.votes),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-4xl mx-auto">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-center">Election Results</h2>
        </div>
        <div>
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
            </div>
          ) : error ? (
            <div className="p-4 border border-red-500 text-red-500 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <strong>Error:</strong>
              </div>
              <p>{error}</p>
            </div>
          ) : candidates.length > 0 ? (
            <div className="h-[400px]">
              <Bar data={data} options={options} />
            </div>
          ) : (
            <div className="p-4 border border-gray-500 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <strong>No Data</strong>
              </div>
              <p>No candidates available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectionResult;
