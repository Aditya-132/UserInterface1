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

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PlacementReport = () => {
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/jobApplication/getall",
          {
            withCredentials: true,
          }
        );

        // Filter placed students
        const placedStudents = data.jobApplications.filter(
          (app) => app.placed === "Placed"
        );

        // Department-wise count for placed students only
        const departmentWisePlaced = placedStudents.reduce((acc, app) => {
          acc[app.branch] = (acc[app.branch] || 0) + 1;
          return acc;
        }, {});

        const departmentLabels = Object.keys(departmentWisePlaced);
        const departmentData = Object.values(departmentWisePlaced);

        setChartData({
          pie: {
            labels: ["Placed", "Unplaced"],
            datasets: [
              {
                label: "Placement Status",
                data: [placedStudents.length, data.jobApplications.length - placedStudents.length],
                backgroundColor: [
                  "rgba(52, 211, 153, 0.8)",  // Soft green
                  "rgba(239, 68, 68, 0.8)",   // Soft red
                ],
                hoverBackgroundColor: [
                  "rgba(52, 211, 153, 1)",    // Darker green on hover
                  "rgba(239, 68, 68, 1)",     // Darker red on hover
                ],
                borderColor: "#fff",
                borderWidth: 2,
              },
            ],
          },
          bar: {
            labels: departmentLabels,
            datasets: [
              {
                label: "Placed Students by Department",
                data: departmentData,
                backgroundColor: "rgba(96, 165, 250, 0.8)", // Soft blue
                hoverBackgroundColor: "rgba(96, 165, 250, 1)", // Darker blue on hover
                borderColor: "#fff",
                borderWidth: 2,
                barPercentage: 0.5,
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
        <div className="flex flex-wrap justify-around">
          <div className="w-full md:w-1/2 p-4">
            <h3 className="text-2xl mb-4 text-center">Placement Status of 2024-25</h3>
            <div className="relative h-80 bg-gray-800 p-4 rounded-lg shadow-lg">
              <Pie
                data={chartData.pie}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        color: "#fff",
                        font: {
                          size: 14,
                          family: "Arial, sans-serif",
                        },
                        boxWidth: 20,
                      },
                    },
                  },
                  animation: {
                    animateScale: true,
                    animateRotate: true,
                  },
                }}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 p-4">
            <h3 className="text-2xl mb-4 text-center">Placed Students</h3>
            <div className="relative h-80 bg-gray-800 p-4 rounded-lg shadow-lg">
              <Bar
                data={chartData.bar}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        color: "#fff",
                        font: {
                          size: 14,
                          family: "Arial, sans-serif",
                        },
                        boxWidth: 20,
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "white",
                        font: {
                          size: 12,
                        },
                      },
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      ticks: {
                        color: "white",
                        font: {
                          size: 12,
                        },
                        beginAtZero: true,
                      },
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                    },
                  },
                  animation: {
                    duration: 1500,
                    easing: "easeInOutQuart",
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
