// src/pages/Analytics.js
import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import "./Analytics.css";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [userEmail, setUserEmail] = useState("kareem.elfeel@gmail.com"); // Replace with dynamic user email if needed

    const navigate = useNavigate(); // ✅ Initialize the navigate function

    useEffect(() => {
        fetch(`http://localhost:8000/api/get-financial-data/?user_email=${userEmail}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched Data:", data);
                processData(data);
            })
            .catch((error) => console.error("Error fetching analytics data:", error));
    }, [userEmail]);
    

    const processData = (data) => {
        if (!data) return;

        const monthlyIncome = Math.round(data.annual_income / 12);
        const monthlyExpenses = Math.round(data.expenses.total_expenses / 12);

        const chartData = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString("default", { month: "short" }),
            income: monthlyIncome,
            expenses: monthlyExpenses,
        }));

        setAnalyticsData(chartData);
    };

    return (
        <div className="analytics-container">
            {/* Back Button to Chatbot */}
            <button className="back-button" onClick={() => navigate("/chatbot")}>
    ⬅ Back to Chatbot
</button>


            <h1>📈 Financial Analytics</h1>

            <div className="chart-wrapper">
                {analyticsData ? (
                    <>
                        <div className="chart">
                            <h2>Monthly Income vs Expenses (Line Chart)</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={analyticsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart">
                            <h2>Monthly Income vs Expenses (Bar Chart)</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analyticsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="income" fill="#8884d8" />
                                    <Bar dataKey="expenses" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                ) : (
                    <p>Loading analytics data...</p>
                )}
            </div>
        </div>
    );
};

export default Analytics;
