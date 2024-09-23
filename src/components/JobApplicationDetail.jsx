import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaSave, FaBars, FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import 'tailwindcss/tailwind.css';

const JobApplicationDetail = ({ email }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const yy = "https://backend1-96bk.onrender.com";
  const [jobApplication, setJobApplication] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [editMode, setEditMode] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState("personal-information");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!email) {
      navigate("/check");
    }

    const fetchJobApplication = async () => {
      try {
        const response = await fetch(`${yy}/api/v1/jobApplication/details/${email}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setJobApplication(data.jobApplication);
        } else {
          throw new Error(data.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching job application details:", error);
        alert("Error fetching job application details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    if (email) {
      fetchJobApplication();
    }
  }, [email, navigate]);

  const openModal = (url) => {
    if (url == null) {
      alert("No URL provided");
      setModalIsOpen(false);
    } else {
      setProofUrl(url);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setProofUrl("");
  };

  const printDocument = () => {
    const iframe = document.getElementById("pdf-iframe");
    if (iframe) {
      iframe.contentWindow.print();
    }
  };

  const toggleEditMode = (field) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [field]: !prevEditMode[field],
    }));
  };

  const handleInputChange = (e, field) => {
    if (jobApplication.status === 'Accepted') {
      alert('You have already been accepted for this job.');
      return;
    }

    const { type, value, files } = e.target;
    setLoading(true);
    if (type === "file" && files && files.length > 0) {
      const file = files[0];
      const fileSize = file.size / 1024 / 1024; // in MB
      const maxSize = field === 'cgpaProof' ? 5 : 1; // 5 MB for cgpaProof, 1 MB for others

      if (fileSize > maxSize) {
        alert(`File size should not exceed ${maxSize} MB.`);
        return;
      }
      setJobApplication({ ...jobApplication, [field]: file });
    } else {
      setJobApplication({ ...jobApplication, [field]: value });
    }
    setLoading(false);
  };

  const saveChanges = async (field) => {
    try {
      const formData = new FormData();
      formData.append(field, jobApplication[field]);

      const endpoint = `${yy}/api/v1/jobApplication/update/${jobApplication._id}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const updatedApplication = await response.json();
        setJobApplication(updatedApplication.jobApplication);
        setEditMode({});
      } else {
        const errorData = await response.json();
        console.error("Error saving changes:", errorData);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen dark:bg-gray-900 dark:text-gray-300">Loading...</div>;
  }

  if (!jobApplication) {
    return <div className="flex justify-center items-center h-screen dark:bg-gray-900 dark:text-gray-300">Error loading job application details.</div>;
  }

  const renderField = (field, label, isEditable, inputType = "text") => (
    <div className="field mb-4 flex flex-col md:flex-row items-start md:items-center overflow-y-auto">
      <strong className="mr-2 w-full md:w-1/4 dark:text-gray-300">{label}:</strong>
      {editMode[field] ? (
        inputType === "select" ? (
          <select
            value={jobApplication[field]}
            onChange={(e) => handleInputChange(e, field)}
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : inputType === "textarea" ? (
          <textarea
            value={jobApplication[field]}
            onChange={(e) => handleInputChange(e, field)}
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800 dark:text-gray-300"
          />
        ) : (
          <input
            type={inputType}
            value={
              inputType === "date"
                ? jobApplication[field].split("T")[0]
                : jobApplication[field]
            }
            onChange={(e) => handleInputChange(e, field)}
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800 dark:text-gray-300"
          />
        )
      ) : (
        <span className="w-full md:w-3/4 dark:text-gray-300">
          {inputType === "date"
            ? new Date(jobApplication[field]).toLocaleDateString()
            : jobApplication[field]}
        </span>
      )}
      {isEditable && (
        <div className="flex mt-2 md:mt-0">
          <FaEdit
            onClick={() => toggleEditMode(field)}
            className="ml-2 cursor-pointer text-gray-500 dark:text-gray-300"
          />
          {editMode[field] && (
            <FaSave
              onClick={() => saveChanges(field)}
              className="ml-2 cursor-pointer text-gray-500 dark:text-gray-300"
            />
          )}
        </div>
      )}
    </div>
  );

  const renderFileField = (field, label, acceptType) => (
    <div className="field mb-4 flex flex-col md:flex-row items-start md:items-center overflow-y-auto">
      <strong className="mr-2 w-full md:w-1/4 dark:text-gray-300">{label} Proof:</strong>
      {editMode[field] ? (
        <div className="w-full md:w-3/4 flex items-center">
          <input
            type="file"
            onChange={(e) => handleInputChange(e, field)}
            accept={acceptType}
            className="border border-gray-300 p-2 rounded w-full dark:bg-gray-800 dark:text-gray-300"
          />
          <FaSave
            onClick={() => saveChanges(field)}
            className="ml-2 cursor-pointer text-gray-500 dark:text-gray-300"
          />
        </div>
      ) : (
        <div className="flex mt-2 md:mt-0">
          <FaEye
            className="ml-2 cursor-pointer text-gray-500 dark:text-gray-300"
            onClick={() => openModal(jobApplication[field]?.url)}
          />
          <FaEdit
            onClick={() => toggleEditMode(field)}
            className="ml-2 cursor-pointer text-gray-500 dark:text-gray-300"
          />
        </div>
      )}
    </div>
  );

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200";
      case "Approved":
        return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 dark:bg-gray-900 dark:text-gray-300">
      <h1 className="text-2xl font-bold mb-4">Job Application Details</h1>

      {/* Section Selection */}
      <div className="flex mb-4">
        <button
          onClick={() => setCurrentSection("personal-information")}
          className={`mr-4 p-2 ${
            currentSection === "personal-information"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
          } rounded`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setCurrentSection("job-information")}
          className={`p-2 ${
            currentSection === "job-information"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
          } rounded`}
        >
          Job Information
        </button>
      </div>

      {/* Current Section */}
      {currentSection === "personal-information" ? (
        <>
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          {renderField("firstName", "First Name", true)}
          {renderField("lastName", "Last Name", true)}
          {renderField("email", "Email", false)}
          {renderField("dateOfBirth", "Date of Birth", true, "date")}
          {renderField("gender", "Gender", true, "select")}
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Job Information</h2>
          {renderField("position", "Position", false)}
          {renderField("status", "Status", false, "text", getStatusStyles(jobApplication.status))}
        </>
      )}

      {/* Modal for proof URL */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Proof Document Modal">
        <div className="flex flex-col items-center dark:bg-gray-800 dark:text-gray-300">
          <iframe
            id="pdf-iframe"
            src={proofUrl}
            width="100%"
            height="600px"
            title="Proof Document"
            className="dark:bg-gray-900"
          />
          <button
            onClick={printDocument}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Print
          </button>
          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default JobApplicationDetail;
