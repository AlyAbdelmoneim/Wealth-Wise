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
                        <option value="AED">AED - United Arab Emirates Dirham</option>
                        <option value="AFN">AFN - Afghan Afghani</option>
                        <option value="ALL">ALL - Albanian Lek</option>
                        <option value="AMD">AMD - Armenian Dram</option>
                        <option value="ANG">ANG - Netherlands Antillean Guilder</option>
                        <option value="AOA">AOA - Angolan Kwanza</option>
                        <option value="ARS">ARS - Argentine Peso</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="AWG">AWG - Aruban Florin</option>
                        <option value="AZN">AZN - Azerbaijani Manat</option>
                        <option value="BAM">BAM - Bosnia-Herzegovina Convertible Mark</option>
                        <option value="BBD">BBD - Barbadian Dollar</option>
                        <option value="BDT">BDT - Bangladeshi Taka</option>
                        <option value="BGN">BGN - Bulgarian Lev</option>
                        <option value="BHD">BHD - Bahraini Dinar</option>
                        <option value="BIF">BIF - Burundian Franc</option>
                        <option value="BMD">BMD - Bermudian Dollar</option>
                        <option value="BND">BND - Brunei Dollar</option>
                        <option value="BOB">BOB - Bolivian Boliviano</option>
                        <option value="BRL">BRL - Brazilian Real</option>
                        <option value="BSD">BSD - Bahamian Dollar</option>
                        <option value="BTN">BTN - Bhutanese Ngultrum</option>
                        <option value="BWP">BWP - Botswana Pula</option>
                        <option value="BYN">BYN - Belarusian Ruble</option>
                        <option value="BZD">BZD - Belize Dollar</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="CDF">CDF - Congolese Franc</option>
                        <option value="CHF">CHF - Swiss Franc</option>
                        <option value="CLP">CLP - Chilean Peso</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                        <option value="COP">COP - Colombian Peso</option>
                        <option value="CRC">CRC - Costa Rican Colón</option>
                        <option value="CUP">CUP - Cuban Peso</option>
                        <option value="CVE">CVE - Cape Verdean Escudo</option>
                        <option value="CZK">CZK - Czech Koruna</option>
                        <option value="DJF">DJF - Djiboutian Franc</option>
                        <option value="DKK">DKK - Danish Krone</option>
                        <option value="DOP">DOP - Dominican Peso</option>
                        <option value="DZD">DZD - Algerian Dinar</option>
                        <option value="EGP">EGP - Egyptian Pound</option>
                        <option value="ERN">ERN - Eritrean Nakfa</option>
                        <option value="ETB">ETB - Ethiopian Birr</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="FJD">FJD - Fijian Dollar</option>
                        <option value="FKP">FKP - Falkland Islands Pound</option>
                        <option value="FOK">FOK - Faroese Króna</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="GEL">GEL - Georgian Lari</option>
                        <option value="GHS">GHS - Ghanaian Cedi</option>
                        <option value="GIP">GIP - Gibraltar Pound</option>
                        <option value="GMD">GMD - Gambian Dalasi</option>
                        <option value="GNF">GNF - Guinean Franc</option>
                        <option value="GTQ">GTQ - Guatemalan Quetzal</option>
                        <option value="GYD">GYD - Guyanese Dollar</option>
                        <option value="HKD">HKD - Hong Kong Dollar</option>
                        <option value="HNL">HNL - Honduran Lempira</option>
                        <option value="HRK">HRK - Croatian Kuna</option>
                        <option value="HTG">HTG - Haitian Gourde</option>
                        <option value="HUF">HUF - Hungarian Forint</option>
                        <option value="IDR">IDR - Indonesian Rupiah</option>
                        <option value="ILS">ILS - Israeli New Shekel</option>
                        <option value="INR">INR - Indian Rupee</option>
                        <option value="IQD">IQD - Iraqi Dinar</option>
                        <option value="IRR">IRR - Iranian Rial</option>
                        <option value="ISK">ISK - Icelandic Króna</option>
                        <option value="JMD">JMD - Jamaican Dollar</option>
                        <option value="JOD">JOD - Jordanian Dinar</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="KES">KES - Kenyan Shilling</option>
                        <option value="KGS">KGS - Kyrgyzstani Som</option>
                        <option value="KHR">KHR - Cambodian Riel</option>
                        <option value="KMF">KMF - Comorian Franc</option>
                        <option value="KPW">KPW - North Korean Won</option>
                        <option value="KRW">KRW - South Korean Won</option>
                        <option value="KWD">KWD - Kuwaiti Dinar</option>
                        <option value="KYD">KYD - Cayman Islands Dollar</option>
                        <option value="KZT">KZT - Kazakhstani Tenge</option>
                        <option value="LAK">LAK - Lao Kip</option>
                        <option value="LBP">LBP - Lebanese Pound</option>
                        <option value="LKR">LKR - Sri Lankan Rupee</option>
                        <option value="LRD">LRD - Liberian Dollar</option>
                        <option value="LSL">LSL - Lesotho Loti</option>
                        <option value="LYD">LYD - Libyan Dinar</option>
                        <option value="MAD">MAD - Moroccan Dirham</option>
                        <option value="MDL">MDL - Moldovan Leu</option>
                        <option value="MGA">MGA - Malagasy Ariary</option>
                        <option value="MKD">MKD - Macedonian Denar</option>
                        <option value="MMK">MMK - Myanmar Kyat</option>
                        <option value="MNT">MNT - Mongolian Tögrög</option>
                        <option value="MOP">MOP - Macanese Pataca</option>
                        <option value="MUR">MUR - Mauritian Rupee</option>
                        <option value="MVR">MVR - Maldivian Rufiyaa</option>
                        <option value="MWK">MWK - Malawian Kwacha</option>
                        <option value="MXN">MXN - Mexican Peso</option>
                        <option value="MYR">MYR - Malaysian Ringgit</option>
                        <option value="MZN">MZN - Mozambican Metical</option>
                        <option value="NAD">NAD - Namibian Dollar</option>
                        <option value="NGN">NGN - Nigerian Naira</option>
                        <option value="NOK">NOK - Norwegian Krone</option>
                        <option value="NZD">NZD - New Zealand Dollar</option>
                        <option value="OMR">OMR - Omani Rial</option>
                        <option value="PEN">PEN - Peruvian Sol</option>
                        <option value="PHP">PHP - Philippine Peso</option>
                        <option value="PKR">PKR - Pakistani Rupee</option>
                        <option value="USD">USD - US Dollar</option>
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
