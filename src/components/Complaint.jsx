import { useState, useEffect } from "react";
import axios from "axios";

export default function ComplaintForm() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    description: "",
    isAnonymous: false,
    media: null,
  });
  const API_URL = "http://localhost:4000";

  // Fetch Complaints
  useEffect(() => {
    axios.get(`${API_URL}/comall`)
      .then((res) => setComplaints(res.data.complaints))
      .catch((err) => console.error("Error fetching complaints:", err));
  }, []);

  // Handle Form Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setForm({ ...form, media: e.target.files[0] });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      await axios.post(`${API_URL}/crecom`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Complaint Submitted!");
      setForm({
        studentName: "",
        studentEmail: "",
        description: "",
        isAnonymous: false,
        media: null,
      });
      
      
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Error submitting complaint!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Complaint Form */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Create Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="studentName"
            placeholder="Your Name"
            className="w-full p-2 border rounded"
            value={form.studentName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="studentEmail"
            placeholder="Your Email"
            className="w-full p-2 border rounded"
            value={form.studentEmail}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Describe your complaint..."
            className="w-full p-2 border rounded"
            rows="3"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input type="file" name="media" onChange={handleFileChange} className="w-full p-2 border rounded" />
          <label className="flex items-center">
            <input type="checkbox" name="isAnonymous" className="mr-2" checked={form.isAnonymous} onChange={handleChange} />
            Submit as Anonymous
          </label>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Submit Complaint
          </button>
        </form>
      </div>

      {/* Complaint List */}
      
    </div>
  );
}
