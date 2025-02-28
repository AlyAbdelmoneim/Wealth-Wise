import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpdateData.css";

const UpdateData = () => {
    const navigate = useNavigate();

    // State for handling fixed income
    const [fixedIncome, setFixedIncome] = useState({
        jobDescription: "",
        monthlySalary: "",
        yearlyBonus: "",
    });

    // State for handling variable salary
    const [variableIncome, setVariableIncome] = useState({
        amount: "",
        description: "",
        customerNumber: "",
    });

    // State for handling expenses
    const [expenses, setExpenses] = useState({
        luxury: { description: "", amount: "", frequency: "monthly" },
        living: { description: "", amount: "", frequency: "monthly" },
        work: { description: "", amount: "", frequency: "monthly" },
    });

    // Generic handler for input changes
    const handleInputChange = (section, field, value) => {
        if (section === "fixedIncome") {
            setFixedIncome((prev) => ({ ...prev, [field]: value }));
        } else if (section === "variableIncome") {
            setVariableIncome((prev) => ({ ...prev, [field]: value }));
        } else {
            setExpenses((prev) => ({
                ...prev,
                [section]: { ...prev[section], [field]: value },
            }));
        }
    };

    return (
        <div className="update-data-container">
            {/* Video Background */}
            <video className="video-background" autoPlay loop muted>
                <source src="/neutral.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="content-overlay">
                <h2>Monthly & Yearly Financial Data</h2>

                {/* Fixed Salary Section */}
                <div className="section-container">
                    <div className="section-title">Fixed Salary</div>
                    <label>Job Description</label>
                    <textarea
                        value={fixedIncome.jobDescription}
                        onChange={(e) => handleInputChange("fixedIncome", "jobDescription", e.target.value)}
                        placeholder="Enter job description..."
                    />
                    <label>Monthly Salary</label>
                    <input
                        type="text"
                        value={fixedIncome.monthlySalary}
                        onChange={(e) => handleInputChange("fixedIncome", "monthlySalary", e.target.value)}
                        placeholder="Enter monthly salary..."
                    />
                    <label>Yearly Bonus</label>
                    <input
                        type="text"
                        value={fixedIncome.yearlyBonus}
                        onChange={(e) => handleInputChange("fixedIncome", "yearlyBonus", e.target.value)}
                        placeholder="Enter yearly bonus..."
                    />
                </div>

                {/* Variable Salary Section */}
                <div className="section-container">
                    <div className="section-title">Variable Salary</div>
                    <label>Amount</label>
                    <input
                        type="text"
                        value={variableIncome.amount}
                        onChange={(e) => handleInputChange("variableIncome", "amount", e.target.value)}
                        placeholder="Enter amount..."
                    />
                    <label>Description</label>
                    <input
                        type="text"
                        value={variableIncome.description}
                        onChange={(e) => handleInputChange("variableIncome", "description", e.target.value)}
                        placeholder="Enter description..."
                    />
                    <label>Customer Number</label>
                    <input
                        type="text"
                        value={variableIncome.customerNumber}
                        onChange={(e) => handleInputChange("variableIncome", "customerNumber", e.target.value)}
                        placeholder="Enter customer number..."
                    />
                </div>

                {/* Expenses Sections (Luxury, Living, Work) */}
                {["luxury", "living", "work"].map((expenseType) => (
                    <div key={expenseType} className="section-container">
                        <div className="section-title">{expenseType.charAt(0).toUpperCase() + expenseType.slice(1)} Expenses</div>
                        <label>Description</label>
                        <input
                            type="text"
                            value={expenses[expenseType].description}
                            onChange={(e) => handleInputChange(expenseType, "description", e.target.value)}
                            placeholder="Enter description..."
                        />
                        <label>Amount</label>
                        <input
                            type="text"
                            value={expenses[expenseType].amount}
                            onChange={(e) => handleInputChange(expenseType, "amount", e.target.value)}
                            placeholder="Enter amount..."
                        />
                        <label>Frequency</label>
                        <select
                            value={expenses[expenseType].frequency}
                            onChange={(e) => handleInputChange(expenseType, "frequency", e.target.value)}
                            className="frequency-select"
                        >
                            <option value="yearly">Yearly</option>
                            <option value="monthly">Monthly</option>
                            <option value="daily">Daily</option>
                        </select>
                    </div>
                ))}

                {/* Done Button */}
                <button className="done-btn" onClick={() => navigate("/chatbot")}>
                    Done
                </button>
            </div>
        </div>
    );
};

export default UpdateData;
