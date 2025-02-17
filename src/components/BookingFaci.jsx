import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function BookingForm() {
  const API_URL = "http://localhost:4000"; // Backend URL

  // State for Email & OTP Verification
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // State for Booking
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  /** ✅ Fetch Facilities on Component Load */
  useEffect(() => {
    async function fetchFacilities() {
      try {
        const res = await axios.get(`${API_URL}/getfacilities`);
        setFacilities(res.data);
      } catch (error) {
        toast.error("Failed to load facilities");
      }
    }
    fetchFacilities();
  }, []);

  /** ✅ Send OTP */
  const sendOtp = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/v1/sendOtp`, { email });
      if (res.data.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    }
  };

  /** ✅ Verify OTP */
  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/v1/verifyOtp`, { email, otp });
      if (res.data.success) {
        setIsVerified(true);
        toast.success("Email verified!");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Error verifying OTP");
    }
  };

  /** ✅ Handle Booking */
  const handleBooking = async () => {
     // Debugging step
  
    if (!isVerified) return toast.error("Email verification required!");
    if (!selectedFacility || !date || !startTime || !endTime) return toast.error("All fields are required!");
  
    try {
      console.log("Sending booking request..."); // Debugging step
  
      const response = await axios.post(`${API_URL}/requestBooking`, {
        email,
        facilityName: selectedFacility,
        date,
        startTime,
        endTime,
      });
  
      console.log("Response:", response.data); // Debugging step
      toast.success("Booking request sent!");
  
      // ✅ Reset form fields after successful booking
      setSelectedFacility("");
      setDate("");
      setStartTime("");
      setEndTime("");
      alert("Booking done ");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Booking failed!");
    }
  };
  
  

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg text-gray-600">
      <h2 className="text-xl font-bold mb-4 text-gray-600">🏫 Book a Facility</h2>

      {!isVerified ? (
        <>
          {/* ✅ Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg mb-3 text-gray-600"
          />

          {/* ✅ OTP Verification */}
          {otpSent ? (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded-lg mb-3 text-gray-600"
              />
              <button onClick={verifyOtp} className="w-full bg-green-600 text-white py-2 rounded-lg">
                ✅ Verify OTP
              </button>
            </>
          ) : (
            <button onClick={sendOtp} className="w-full bg-blue-600 text-white py-2 rounded-lg">
              📩 Send OTP
            </button>
          )}
        </>
      ) : (
        <>
          {/* ✅ Select Facility */}
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="w-full p-2 border rounded-lg mb-3 text-gray-600"
          >
            <option value="">Select Facility</option>
            {facilities.map((facility) => (
              <option key={facility._id} value={facility.name}>
                {facility.name}
              </option>
            ))}
          </select>

          {/* ✅ Select Date */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-lg mb-3 text-gray-600"
          />

          {/* ✅ Select Time */}
          <div className="flex gap-3">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-1/2 p-2 border rounded-lg text-gray-600"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-1/2 p-2 border rounded-lg text-gray-600"
            />
          </div>

          {/* ✅ Submit Booking */}
          <button onClick={handleBooking} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">
            🚀 Send Booking Request
          </button>
        </>
      )}
    </div>
  );
}
