import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddMembers.css";

const AddMembers = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState(["member1@example.com", "member2@example.com"]);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("https://api.example.com/members");
                const data = await response.json();
                setMembers(data.members);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        fetchMembers();
    }, []);

    const handleAddMember = () => {
        if (newMemberEmail.trim() === "") {
            alert("Please enter a valid email.");
            return;
        }

        setMembers((prevMembers) => [...prevMembers, newMemberEmail.trim()]);
        setNewMemberEmail("");
    };

    useEffect(() => {
        console.log("Updated members list:", members);
    }, [members]);

    return (
        <div className="add-members-container">
            <video className="video-background" autoPlay loop muted>
                <source src="/neutral.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="content-overlay">
                <h2>Account Members</h2>

                <div className="members-list">
                    {members.map((member, index) => (
                        <div key={`${member}-${index}`} className="member-item">
                            {member}
                        </div>
                    ))}
                </div>

                <div className="add-member-section">
                    <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="Enter new member's email"
                        className="add-member-input"
                    />
                    <button onClick={handleAddMember} className="add-member-btn">
                        Add Member
                    </button>
                </div>

                <button className="done-btn" onClick={() => navigate("/chatbot")}>
                    Done
                </button>
            </div>
        </div>
    );
};

export default AddMembers;
