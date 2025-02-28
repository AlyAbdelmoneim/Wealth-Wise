import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TutorialQuestions.css";

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde",
    "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (Swaziland)", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
    "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
    "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
    "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Serbia",
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
    "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const TutorialQuestions = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        country: "",
        currency: "",
        savings: "",
        netWorth: "",
        age: "",
        jobDescription: "",
        position: "",
        riskTolerance: "",
        freeTime: "",
        additionalInfo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (Object.values(formData).every(value => value.trim() !== "")) {
            localStorage.setItem("isAuthenticated", "true");
            navigate("/chatbot");
        } else {
            alert("Please fill in all fields before continuing.");
        }
    };

    return (
        <div className="tutorial-page">
            <video autoPlay loop muted className="video-background">
                <source src="/neutral.mp4" type="video/mp4" />
            </video>

            <div className="tutorial-form-container">
                <h2>Tell Us About Yourself</h2>
                <form onSubmit={handleSubmit} className="tutorial-form">
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />

                    {/* Country Dropdown with Full List */}
                    <select name="country" className="currency-select" value={formData.country} onChange={handleChange} required>
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>

                    {/* Currency Dropdown */}
                    <select name="currency" className="currency-select" value={formData.currency} onChange={handleChange} required>
                        <option value="">Select Currency</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                    </select>

                    <input type="number" name="savings" placeholder="Total Savings ($)" value={formData.savings} onChange={handleChange} required />
                    <input type="number" name="netWorth" placeholder="Net Worth ($)" value={formData.netWorth} onChange={handleChange} required />
                    <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
                    <input type="text" name="jobDescription" placeholder="Job Description" value={formData.jobDescription} onChange={handleChange} required />
                    <input type="text" name="position" placeholder="Job Position" value={formData.position} onChange={handleChange} required />

                    {/* Risk Tolerance Dropdown */}
                    <select name="riskTolerance" className="risk-select" value={formData.riskTolerance} onChange={handleChange} required>
                        <option value="">Select Risk Tolerance</option>
                        <option value="1">1 - Low</option>
                        <option value="2">2 - Moderate</option>
                        <option value="3">3 - Balanced</option>
                        <option value="4">4 - High</option>
                        <option value="5">5 - Very High</option>
                    </select>

                    <input type="text" name="freeTime" placeholder="Hobbies / Free Time" value={formData.freeTime} onChange={handleChange} required />
                    <textarea name="additionalInfo" placeholder="Additional Information" value={formData.additionalInfo} onChange={handleChange} required />

                    <button type="submit" className="submit-btn">Continue</button>
                </form>
            </div>
        </div>
    );
};

export default TutorialQuestions;
