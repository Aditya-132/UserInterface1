import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://localhost:4000"; // Backend API URL

const Facility = () => {
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentFacilityIndex, setCurrentFacilityIndex] = useState(0);

  useEffect(() => {
    fetchFacilities();
    fetchAllBookings();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await axios.get(`${API_URL}/getfacilities`);
      setFacilities(res.data);
    } catch (error) {
      toast.error("Failed to load facilities");
    }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/bookings`);
      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to load bookings");
    }
  };

  const generateTimeSlots = () => {
    return Array.from({ length: 13 }, (_, i) => ({
      time: `${9 + i}:00`,
      status: "available",
    }));
  };

  const formatTimeSlots = (facilityBookings) => {
    let slots = generateTimeSlots();
    const filteredBookings = facilityBookings.filter(
      (booking) => booking.date === selectedDate
    );

    filteredBookings.forEach((booking) => {
      let startHour = parseInt(booking.startTime.split(":")[0]);
      let endHour = parseInt(booking.endTime.split(":")[0]);

      slots = slots.map((slot) =>
        parseInt(slot.time) >= startHour && parseInt(slot.time) < endHour
          ? { ...slot, status: "booked" }
          : slot
      );
    });

    return slots.map((slot) => ({
      time: slot.time,
      available: slot.status === "available" ? 1 : 0,
      booked: slot.status === "booked" ? 1 : 0,
    }));
  };

  const nextFacility = () => {
    setCurrentFacilityIndex((prevIndex) => (prevIndex + 1) % facilities.length);
  };

  const prevFacility = () => {
    setCurrentFacilityIndex(
      (prevIndex) => (prevIndex - 1 + facilities.length) % facilities.length
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">🏫 Facility Management</h2>

        {facilities.length === 0 ? (
          <p className="text-gray-400 text-center">No facilities added yet.</p>
        ) : (
          <div className="relative">
            <div className="overflow-hidden">
              {facilities.slice(currentFacilityIndex, currentFacilityIndex + 1).map((facility) => {
                const facilityBookings = bookings.filter(
                  (booking) => booking.facilityName === facility.name
                );

                return (
                  <div
                    key={facility._id}
                    className="p-4 border border-gray-600 rounded-lg bg-gray-700 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-center">{facility.name}</h3>

                    <div className="mt-4">
                      <label className="font-semibold">Select Date:</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 border border-gray-500 bg-gray-800 rounded-lg mt-2 text-white"
                      />
                    </div>

                    {selectedDate && facilityBookings.length > 0 && (
                      <div className="mt-4 text-center">
                        <h4 className="text-md font-semibold mb-2">⏳ Availability Timeline</h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={formatTimeSlots(facilityBookings)} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="time" type="category" width={50} />
                            <Tooltip />
                            <Bar dataKey="available" stackId="a" fill="#32CD32" />
                            <Bar dataKey="booked" stackId="a" fill="#FF6347" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={prevFacility}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
              >
                ◀ Prev
              </button>
              <button
                onClick={nextFacility}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
              >
                Next ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Facility;
