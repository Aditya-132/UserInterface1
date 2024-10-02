import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "tailwindcss/tailwind.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const PlacementReport = () => {
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://backend1-96bk.onrender.com/api/v1/jobApplication/getall",
          {
            withCredentials: true,
          }
        );

        // Filter and count data for pie chart
        const placed = data.jobApplications.filter(
          (app) => app.placed === "Placed"
        ).length;
        const unplaced = data.jobApplications.filter(
          (app) => app.placed === "Rejected"
        ).length;
        const pending = data.jobApplications.filter(
          (app) => app.status === "Pending"
        ).length;

        // Department-wise count for bar chart
        const departmentWise = data.jobApplications.reduce((acc, app) => {
          acc[app.branch] = (acc[app.branch] || 0) + 1;
          return acc;
        }, {});

        const departmentLabels = Object.keys(departmentWise);
        const departmentData = Object.values(departmentWise);

        setChartData({
          pie: {
            labels: ["Placed", "Unplaced", "Pending"],
            datasets: [
              {
                label: "Placement Status",
                data: [placed, unplaced, pending],
                backgroundColor: ["#4caf50", "#f44336", "#ffeb3b"],
              },
            ],
          },
          bar: {
            labels: departmentLabels,
            datasets: [
              {
                label: "Applications by Department",
                data: departmentData,
                backgroundColor: "#42a5f5",
              },
            ],
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-8">
      {chartData ? (
        <div className="space-y-10">
          <div>
            <h3 className="text-2xl mb-4">Placement Status</h3>
            <div className="relative h-80 bg-gray-800 p-4 rounded-lg shadow-lg">
              <Pie
                data={chartData.pie}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: "white",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div>
            <h3 className="text-2xl mb-4">Department-wise Applications</h3>
            <div className="relative h-80 bg-gray-800 p-4 rounded-lg shadow-lg">
              <Bar
                data={chartData.bar}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: "white",
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          color: "white",
                        },
                      },
                      y: {
                        ticks: {
                          color: "white",
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-lg">Loading charts...</p>
      )}
    </div>
  );
};

export default PlacementReport;
