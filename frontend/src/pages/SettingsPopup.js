import React from "react";
import "./SettingsPopup.css";

const SettingsPopup = ({ onClose }) => {
    return (
        <div className="settings-popup">
            <div className="settings-content">
                <h2>Settings</h2>
                <label>
                    Dark Mode:
                    <input type="checkbox" onChange={() => document.body.classList.toggle("dark-mode")} />
                </label>
                <button onClick={onClose} className="close-btn">Close</button>
            </div>
        </div>
    );
};

export default SettingsPopup;