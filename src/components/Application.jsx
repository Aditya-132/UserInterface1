import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApplicationTable from "./ApplicationTable";

const API_URL = "http://localhost:4000";

const Application = () => {
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    email: "",
    name: "",
    profession: "",
    pdfs: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_URL}/list`);
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      } else {
        toast.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Error fetching applications");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, pdfs: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "pdfs" && formData.pdfs) {
        for (let file of formData.pdfs) {
          formDataObj.append("pdfs", file);
        }
      } else {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(editingId ? `${API_URL}/edit/${editingId}` : `${API_URL}/submit1`, {
        method: editingId ? "PUT" : "POST",
        body: formDataObj,
      });
      const data = await response.json();
      if (data.success) {
        toast.success(editingId ? "Application updated successfully!" : "Application submitted successfully!");
        fetchApplications();
        setEditingId(null);
        setFormData({ title: "", description: "", category: "", email: "", name: "", profession: "", pdfs: null });
      } else {
        toast.error(data.message || "Error submitting application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Error submitting application");
    }
  };

  return (
    <>
    <div className="container mx-auto p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">{editingId ? "Edit Application" : "Submit Application"}</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border border-gray-600 rounded bg-gray-700" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border border-gray-600 rounded bg-gray-700" required />
        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-600 rounded bg-gray-700" required>
          <option value="">Select Category</option>
          <option value="Event">Event</option>
          <option value="Budget">Budget</option>
          <option value="Sponsorship">Sponsorship</option>
        </select>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border border-gray-600 rounded bg-gray-700" required />
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="w-full p-2 border border-gray-600 rounded bg-gray-700" required />
        <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Profession" className="w-full p-2 border border-gray-600 rounded bg-gray-700" required />
        <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border border-gray-600 rounded bg-gray-700" />
        <button type="submit" className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded font-bold text-white">{editingId ? "Update Application" : "Submit Application"}</button>
      </form>

      <ToastContainer />
    </div>
    <ApplicationTable/>
    </>
  );
};

export default Application;
