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
import "./PlacementReport.css"; // Ensure your styles are applied

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
  const [avgSalaryData, setAvgSalaryData] = useState(null); // New state for average salary chart
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          " https://backend-1-qebm.onrender.com/api/v1/jobApplication/getall",
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

        // Average placement salary department-wise
        const salaryData = data.jobApplications.reduce((acc, app) => {
          if (app.placed === "Placed" && app.branch && app.salary) {
            acc[app.branch] = acc[app.branch] || { totalSalary: 0, count: 0 };
            acc[app.branch].totalSalary += app.salary;
            acc[app.branch].count += 1;
          }
          return acc;
        }, {});

        const avgSalaryLabels = Object.keys(salaryData);
        const avgSalaryData = avgSalaryLabels.map(
          (branch) => salaryData[branch].totalSalary / salaryData[branch].count
        );

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

        // Set average salary data for bar chart
        setAvgSalaryData({
          labels: avgSalaryLabels,
          datasets: [
            {
              label: "Average Placement Salary (LPA)",
              data: avgSalaryData,
              backgroundColor: "#8e44ad",
            },
          ],
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
    <div className="placement-report">
      {chartData ? (
        <>
          <div className="chart-container">
            <h3>Placement Status</h3>
            <div className="chart-wrapper">
              <Pie
                data={chartData.pie}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="chart-container">
            <h3>Department-wise Applications</h3>
            <div className="chart-wrapper">
              <Bar
                data={chartData.bar}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </>
      ) : (
        <p>Loading charts...</p>
      )}
    </div>
  );
};

export default PlacementReport;
