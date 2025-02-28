import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UpdateData.css";

const UpdateData = () => {
    const navigate = useNavigate();

    // State for handling input values
    const [jobDescription, setJobDescription] = useState("");
    const [monthlySalary, setMonthlySalary] = useState("");
    const [yearlyBonus, setYearlyBonus] = useState("");

    // States for Variable Salary
    const [variableAmount, setVariableAmount] = useState("");
    const [variableDescription, setVariableDescription] = useState("");
    const [customerNumber, setCustomerNumber] = useState("");

    // States for Luxury Expenses
    const [luxuryDescription, setLuxuryDescription] = useState("");
    const [luxuryAmount, setLuxuryAmount] = useState("");
    const [luxuryFrequency, setLuxuryFrequency] = useState("monthly");

    // New states for Living Expenses
    const [livingDescription, setLivingDescription] = useState("");
    const [livingAmount, setLivingAmount] = useState("");
    const [livingFrequency, setLivingFrequency] = useState("monthly");

    // New states for Work Expenses
    const [workDescription, setWorkDescription] = useState("");
    const [workAmount, setWorkAmount] = useState("");
    const [workFrequency, setWorkFrequency] = useState("monthly");

    return (
        <div className="update-data-container">
            {/* Video Background */}
            <video className="video-background" autoPlay loop muted>
                <source src="/neutral.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="content-overlay">
                {/* Header */}
                <h2>Monthly Reminder of Expenses / Yearly</h2>

                {/* Fixed Salary Section */}
                <div className="section-container">
                    <div className="section-title">Fixed Salary</div>
                    <div className="input-container">
                        <label>Job Description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Enter your job description..."
                        />

                        <label>Monthly Salary</label>
                        <textarea
                            value={monthlySalary}
                            onChange={(e) => setMonthlySalary(e.target.value)}
                            placeholder="Enter your monthly salary..."
                        />

                        <label>Yearly Bonus</label>
                        <textarea
                            value={yearlyBonus}
                            onChange={(e) => setYearlyBonus(e.target.value)}
                            placeholder="Enter your yearly bonus..."
                        />
                    </div>
                </div>

                {/* Variable Salary Section */}
                <div className="section-container">
                    <div className="section-title">Variable Salary</div>
                    <div className="horizontal-inputs">
                        <div className="input-field">
                            <label>Amount</label>
                            <input
                                type="text"
                                value={variableAmount}
                                onChange={(e) => setVariableAmount(e.target.value)}
                                placeholder="Amount"
                            />
                        </div>
                        <div className="input-field">
                            <label>Description</label>
                            <input
                                type="text"
                                value={variableDescription}
                                onChange={(e) => setVariableDescription(e.target.value)}
                                placeholder="Description"
                            />
                        </div>
                        <div className="input-field">
                            <label>Customer Number</label>
                            <input
                                type="text"
                                value={customerNumber}
                                onChange={(e) => setCustomerNumber(e.target.value)}
                                placeholder="Customer #"
                            />
                        </div>
                    </div>
                </div>

                {/* Luxury Expenses Section */}
                <div className="section-container">
                    <div className="section-title">Luxury Expenses</div>
                    <div className="horizontal-inputs">
                        <div className="input-field">
                            <label>Description</label>
                            <input
                                type="text"
                                value={luxuryDescription}
                                onChange={(e) => setLuxuryDescription(e.target.value)}
                                placeholder="Description"
                            />
                        </div>
                        <div className="input-field">
                            <label>Amount</label>
                            <input
                                type="text"
                                value={luxuryAmount}
                                onChange={(e) => setLuxuryAmount(e.target.value)}
                                placeholder="Amount"
                            />
                        </div>
                        <div className="input-field">
                            <label>Frequency</label>
                            <select
                                value={luxuryFrequency}
                                onChange={(e) => setLuxuryFrequency(e.target.value)}
                                className="frequency-select"
                            >
                                <option value="yearly">Yearly</option>
                                <option value="monthly">Monthly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Living Expenses Section */}
                <div className="section-container">
                    <div className="section-title">Living Expenses</div>
                    <div className="horizontal-inputs">
                        <div className="input-field">
                            <label>Description</label>
                            <input
                                type="text"
                                value={livingDescription}
                                onChange={(e) => setLivingDescription(e.target.value)}
                                placeholder="Description"
                            />
                        </div>
                        <div className="input-field">
                            <label>Amount</label>
                            <input
                                type="text"
                                value={livingAmount}
                                onChange={(e) => setLivingAmount(e.target.value)}
                                placeholder="Amount"
                            />
                        </div>
                        <div className="input-field">
                            <label>Frequency</label>
                            <select
                                value={livingFrequency}
                                onChange={(e) => setLivingFrequency(e.target.value)}
                                className="frequency-select"
                            >
                                <option value="yearly">Yearly</option>
                                <option value="monthly">Monthly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Work Expenses Section */}
                <div className="section-container">
                    <div className="section-title">Work Expenses</div>
                    <div className="horizontal-inputs">
                        <div className="input-field">
                            <label>Description</label>
                            <input
                                type="text"
                                value={workDescription}
                                onChange={(e) => setWorkDescription(e.target.value)}
                                placeholder="Description"
                            />
                        </div>
                        <div className="input-field">
                            <label>Amount</label>
                            <input
                                type="text"
                                value={workAmount}
                                onChange={(e) => setWorkAmount(e.target.value)}
                                placeholder="Amount"
                            />
                        </div>
                        <div className="input-field">
                            <label>Frequency</label>
                            <select
                                value={workFrequency}
                                onChange={(e) => setWorkFrequency(e.target.value)}
                                className="frequency-select"
                            >
                                <option value="yearly">Yearly</option>
                                <option value="monthly">Monthly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Done Button */}
                <button className="done-btn" onClick={() => navigate("/chatbot")}>
                    Done
                </button>
            </div>
        </div>
    );
};

export default UpdateData;

