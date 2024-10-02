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
                backgroundColor: ["#34d399", "#ef4444", "#fbbf24"],
              },
            ],
          },
          bar: {
            labels: departmentLabels,
            datasets: [
              {
                label: "Applications by Department",
                data: departmentData,
                backgroundColor: "#60a5fa",
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
        <div className="flex flex-wrap justify-around space-y-10">
          <div className="w-full md:w-1/2 lg:w-1/3 mb-10">
            <h3 className="text-2xl mb-4 text-center">Placement Status</h3>
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
          <div className="w-full md:w-1/2 lg:w-1/3 mb-10">
            <h3 className="text-2xl mb-4 text-center">Department-wise Applications</h3>
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
