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
      navigate("/");
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
          setIsLoading(false);

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
    if(url == null){
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
    const { type, value, files } = e.target;
    setLoading(true);
    if (type === "file" && files && files.length > 0) {
      const file = files[0];
      setJobApplication({ ...jobApplication, [field]: file });
    } else {
      setJobApplication({ ...jobApplication, [field]: value });
    }
    setLoading(false);
  };
  
  const saveChanges = async (field) => {
    // Save changes logic here...
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!jobApplication) {
    return <div className="flex justify-center items-center h-screen">Error loading job application details.</div>;
  }

  const renderField = (field, label, isEditable, inputType = "text") => (
    <div className="field mb-4 flex flex-col md:flex-row items-start md:items-center">
      <label className="mr-2 w-full md:w-1/4 font-semibold dark:text-gray-200">{label}:</label>
      {editMode[field] ? (
        <input
          type={inputType}
          value={jobApplication[field]}
          onChange={(e) => handleInputChange(e, field)}
          className="border border-gray-300 p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
        />
      ) : (
        <span className="w-full md:w-3/4 text-gray-700 dark:text-gray-300">
          {jobApplication[field]}
        </span>
      )}
      {isEditable && (
        <div className="flex mt-2 md:mt-0">
          <FaEdit
            onClick={() => toggleEditMode(field)}
            className="ml-2 cursor-pointer text-gray-500"
          />
          {editMode[field] && (
            <FaSave
              onClick={() => saveChanges(field)}
              className="ml-2 cursor-pointer text-gray-500"
            />
          )}
        </div>
      )}
    </div>
  );

  const renderStatus = (status) => (
    <div className={`status-indicator p-2 rounded ${status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {status}
    </div>
  );

  return (
    <>
      <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg max-w-4xl overflow-hidden">
        <div className="header mb-6 text-center flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-3xl font-bold dark:text-white">Job Application Details</h1>
          {renderStatus(jobApplication.status)}
        </div>

        <div className="profile-section flex flex-col md:flex-row items-center mb-6">
          <div className="profile-photo mr-4 mb-4 md:mb-0">
            <img
              src={jobApplication.profilePhotoProof?.url || "default-profile-photo.jpg"}
              alt="Profile"
              className="rounded-full w-24 h-24"
            />
          </div>
          <div className="profile-info text-center md:text-left">
            <h2 className="text-2xl font-semibold dark:text-gray-300">{jobApplication.fullName}</h2>
            <p className="text-gray-600 dark:text-gray-400">{jobApplication.email}</p>
            <p className="text-gray-600 dark:text-gray-400">{jobApplication.phone}</p>
          </div>
        </div>

        <div className="navbar mb-6">
          <ul className="flex space-x-4 justify-center text-lg">
            <li>
              <button
                onClick={() => setCurrentSection("personal-information")}
                className={`px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 ${currentSection === "personal-information" && "bg-gray-300 dark:bg-gray-700"}`}
              >
                Personal Info
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentSection("education")}
                className={`px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 ${currentSection === "education" && "bg-gray-300 dark:bg-gray-700"}`}
              >
                Education
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentSection("experience")}
                className={`px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 ${currentSection === "experience" && "bg-gray-300 dark:bg-gray-700"}`}
              >
                Experience
              </button>
            </li>

            <li>
            <button
                onClick={() => setCurrentSection("additional-information")}
                className={`px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 ${currentSection === "additional-information" && "bg-gray-300 dark:bg-gray-700"}`}
              >
                Additional Info
              </button>
            </li>
          </ul>
        </div>

        {currentSection === "personal-information" && (
          <>
            {renderField("fullName", "Full Name", true)}
            {renderField("email", "Email", false, "email")}
            {renderField("phone", "Phone", true, "tel")}
          </>
        )}

        {currentSection === "education" && (
          <>
            {renderField("branch", "Branch", true)}
            {renderField("cgpa", "CGPA", true)}
          </>
        )}

        {currentSection === "experience" && (
          <>
            {renderField("internship", "Internship", true)}
            {renderField("projects", "Projects", true)}
          </>
        )}

        {currentSection === "additional-information" && (
          <>
            {renderField("gap_year", "Gap Year", true)}
            {renderField("skills", "Skills", true, "textarea")}
            {renderField("references", "References", true)}
          </>
        )}        
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Proof Modal"
        className="bg-white p-4 rounded-lg shadow-lg dark:bg-gray-800"
      >
        <button onClick={closeModal} className="text-red-500">Close</button>
        <div className="proof-content w-full h-full">
          {proofUrl.endsWith(".pdf") ? (
            <iframe id="pdf-iframe" src={proofUrl} className="w-full h-full" />
          ) : (
            <img src={proofUrl} alt="Proof Document" className="w-full h-auto" />
          )}
          {proofUrl.endsWith(".pdf") && (
            <button onClick={printDocument} className="mt-4 text-blue-500">Print</button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default JobApplicationDetail;

