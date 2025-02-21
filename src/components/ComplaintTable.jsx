import { useState, useEffect } from "react";
import axios from "axios";

const ComplaintTable = () => {
  const [complaints, setComplaints] = useState([]);
  const [visibleMedia, setVisibleMedia] = useState(null);

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/comall");
        setComplaints(data.complaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="container mx-auto mt-6 p-4 bg-black text-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-center">Complaints</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-600 bg-gray-900 text-white rounded-lg">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 p-3">Description</th>
              <th className="border border-gray-700 p-3">Student Name</th>
              <th className="border border-gray-700 p-3">Email</th>
              <th className="border border-gray-700 p-3">Votes</th>
              <th className="border border-gray-700 p-3">Status</th>
              <th className="border border-gray-700 p-3">Media</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <tr key={complaint._id} className="text-center border border-gray-700">
                  <td className="border border-gray-700 p-3">{complaint.description}</td>
                  <td className="border border-gray-700 p-3">{complaint.studentName}</td>
                  <td className="border border-gray-700 p-3">{complaint.studentEmail}</td>
                  <td className="border border-gray-700 p-3">{complaint.adminVotes}</td>
                  <td className="border border-gray-700 p-3">{complaint.status}</td>
                  <td className="border border-gray-700 p-3">
                    {complaint.media ? (
                      <button
                        onClick={() => setVisibleMedia(visibleMedia === complaint.media ? null : complaint.media)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        View Media
                      </button>
                    ) : (
                      "No Media"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">No Complaints Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Media Preview Section */}
      {visibleMedia && (
        <div className="mt-6 flex justify-center">
          <iframe
            src={visibleMedia}
            className="w-3/4 h-96 border border-gray-700 rounded-lg shadow-lg"
            allow="autoplay"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ComplaintTable;
