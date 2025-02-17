import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VotingPortal = () => {
  const API_URL = "http://localhost:4000/api/v1";
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all candidates dynamically
  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${API_URL}/candidates`);
      const data = await response.json();
      if (data.success) {
        setCandidates(data.candidates || []);
      } else {
        toast.error("Failed to fetch candidates.");
      }
    } catch (error) {
      console.error("Error fetching candidates:", error.message);
      toast.error("Error fetching candidates.");
    }
  };

  // Check voting status for the user
  const checkVotingStatus = async () => {
    try {
      const response = await fetch(
        `${API_URL}/ch?identifier=${email}`
      );
      const data = await response.json();
      if (response.ok) {
        if (data.hasVoted) {
          setIsLocked(true);
          toast.info("You have already voted. Portal is locked.");
        }
      } else {
        toast.error(data.message || "Failed to check vote status.");
      }
    } catch (error) {
      console.error("Error checking vote status:", error.message);
      toast.error("Error checking vote status.");
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      toast.error("Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(`${API_URL}/verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.success) {
        setIsVerified(true);
        toast.success("OTP verified.");
        await checkVotingStatus();
        fetchCandidates();
      } else {
        toast.error("Invalid OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      toast.error("Error verifying OTP.");
    }
  };

  const submitVote = async () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate before submitting.");
      return;
    }
  
    try {
      const voteResponse = await fetch(`${API_URL}/candidate/vote/${selectedCandidate}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteCount: 1 }),
      });
  
      const voteData = await voteResponse.json();
  
      if (voteData.success) {
        const statusResponse = await fetch(`${API_URL}/up`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: email }),
        });
  
        const statusData = await statusResponse.json();
  
        if (statusData.success) {
          toast.success("Vote submitted successfully, and your voting status is updated!");
          setIsLocked(true); // Lock the portal after updating the voting status
        } else {
          toast.error(statusData.message || "Failed to update voting status.");
        }
      } else {
        toast.error(voteData.message || "Failed to submit vote.");
      }
    } catch (error) {
      console.error("Error submitting vote:", error.message);
      toast.error("Error submitting vote.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-6 bg-gray-800 shadow-lg rounded-lg w-full max-w-md">
        {!isVerified ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-200 text-center">
              {otpSent ? "Enter OTP" : "Enter Your Email"}
            </h2>
            {!otpSent ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4 p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
                <button
                  onClick={sendOtp}
                  disabled={loading || otpSent}
                  className={`w-full bg-blue-600 text-white px-4 py-2 rounded ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mb-4 p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                />
                <button
                  onClick={verifyOtp}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Verify OTP
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-200 text-center">
              Voting Portal
            </h2>
            {isLocked ? (
              <p className="text-center text-green-400">
                Voting completed. Portal is locked.
              </p>
            ) : (
              <>
                <div className="mb-4">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate._id}
                      className="flex items-center mb-2 bg-gray-700 p-2 rounded"
                    >
                      <input
                        type="radio"
                        id={candidate._id}
                        name="candidate"
                        value={candidate._id}
                        onChange={(e) => setSelectedCandidate(e.target.value)}
                        disabled={isLocked}
                        className="mr-2"
                      />
                      <label
                        htmlFor={candidate._id}
                        className="text-gray-200 cursor-pointer"
                      >
                        {candidate.name}
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  onClick={submitVote}
                  disabled={isLocked}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit Vote
                </button>
              </>
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default VotingPortal;
