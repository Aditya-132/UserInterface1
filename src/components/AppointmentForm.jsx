import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";
import "tailwindcss/tailwind.css";
import { FaSun, FaMoon } from "react-icons/fa";
import {
  AdditionalDetails,
  BasicDetails,
  EducationDetails,
  InternshipsExperience,
  PreviousEducationDetails,
  ProfileAndDocuments,
  ProgressIndicator,
} from "./Form_Components/index";

Modal.setAppElement("#root");

const JobApplicationForm = () => {
  const yy = "  http://localhost:4000";
  const [formData, setFormData] = useState({
    reg: "",
    fullName: "",
    email: "",
    parentemail: "",
    heademail: "",
    phone: "",
    cgpa: "",
    cgpaProof: null,
    dob: "",
    gender: "",
    ssc: "",
    sscProof: null,
    hsc: "",
    hscProof: null,
    projects: "",
    internship: "",
    internshipProof: null,
    branch: "CSE",
    gap_year: "",
    gap_yearProof: null,
    address: "",
    skills: "",
    references: "",
    backlogs: "",
    profilePhotoProof: null,
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const branchesArray = [
    "EXTC",
    "Mech",
    "CSE",
    "Civil",
    "Elect",
    "IT",
    "Text",
    "Chem",
    "INST",
    "Prod",
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [theme, setTheme] = useState("dark"); // default theme

  useEffect(() => {
    setOtpSent(false);
    setOtpVerified(false);
  }, [formData.email]);

  useEffect(() => {
    // Apply theme class to body
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    let maxSize = 1 * 1024 * 1024; // 1 MB in bytes for most files
    let allowedTypes = ["application/pdf"]; // Default allowed types for most files

    if (name === "cgpaProof") {
      maxSize = 5 * 1024 * 1024; // 5 MB for CGPA proof
    } else if (name === "profilePhotoProof") {
      maxSize = 5 * 1024 * 1024; // 5 MB for profile photo
      allowedTypes = ["image/jpeg", "image/png"]; // Allowed types for profile photo
    }

    if (file.size > maxSize) {
      toast.error(
        `File size for ${labelFormatter(name)} should be less than ${
          maxSize / (1024 * 1024)
        } MB`
      );
    } else if (!allowedTypes.includes(file.type)) {
      toast.error(
        `Invalid file type for ${labelFormatter(
          name
        )}. Allowed types: ${allowedTypes.join(", ")}`
      );
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    }
  };

  const labelFormatter = (name) => {
    // Convert camelCase or snake_case to Title Case
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const sendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email before sending OTP.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${yy}/api/v1/sendOtp`, {
        email: formData.email,
      });
      setOtpSent(true);
      toast.success("OTP sent to your email");
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${yy}/api/v1/verifyOtp`, {
        email: formData.email,
        otp,
      });
      if (data.success) {
        setOtpVerified(true);
        setIsModalOpen(false);
        toast.success("OTP verified");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid OTP");
    }
    setLoading(false);
  };

  const handleJobApplication = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (!otpVerified) {
      toast.error("Please verify your email with the OTP sent to you");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      const { data } = await axios.post(
        `${yy}/api/v1/jobApplication/post`,
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data.message);
      setFormData({
        reg: "",
        fullName: "",
        email: "",
        parentemail: "",
        heademail: "",
        phone: "",
        cgpa: "",
        cgpaProof: null,
        dob: "",
        gender: "",
        ssc: "",
        sscProof: null,
        hsc: "",
        hscProof: null,
        projects: "",
        internship: "",
        internshipProof: null,
        branch: "CSE",
        gap_year: "",
        gap_yearProof: null,
        address: "",
        skills: "",
        references: "",
        backlogs: "",
        profilePhotoProof: null,
      });
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setFormSubmitted(true);
      setCurrentStep(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    }
    setLoading(false);
  };

  const handleResetForm = () => {
    setFormSubmitted(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOtpSent(false); // Reset otpSent when modal is closed without verifying
  };

  const handleNext = () => {
    // if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    // }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const validateStep = (step) => {
    let isValid = true;
    const requiredFields = getRequiredFields(step);
    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && formData[field].trim() === "")
      ) {
        toast.error(`${labelFormatter(field)} is required`);
        isValid = false;
      } else if (field.includes("Proof") && !formData[field]) {
        toast.error(`${labelFormatter(field)} is required`);
        isValid = false;
      }
    });
    return isValid;
  };

  // Inside JobApplicationForm.jsx

  const getRequiredFields = (step) => {
    switch (step) {
      case 1:
        return ["reg", "fullName", "email", "phone", "dob", "gender","heademail","parentemail"];
      case 2:
        return ["ssc", "sscProof", "hsc", "hscProof", "cgpa", "cgpaProof"];
      case 3:
        return ["backlogs", "gap_year", "gap_yearProof", "projects"];
      case 4:
        return ["internship", "internshipProof"];
      case 5:
        return ["profilePhotoProof"];
      case 6:
        return ["address", "skills", "references"];
      default:
        return [];
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "dark" : "dark"));
    // setOtpVerified(true)
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-900 text-white"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto p-6 shadow-[0_40px_500px_-15px_rgba(255,255,255,0.2)] border-blue-300	 border-2 rounded-3xl flex flex-col w-6/12">
        <div className="flex justify-center items-center mb-6 ">
          <h2 className="text-3xl font-bold">Student Data Form</h2>
        </div>

        {!formSubmitted ? (
          <form onSubmit={handleJobApplication} className="space-y-6">
            {/* Progress Indicator */}
            <ProgressIndicator currentStep={currentStep} className="flex flex-col items-center justify-center" />

            {/* Step Sections */}
            {currentStep === 1 && (
              <BasicDetails
                formData={formData}
                handleChange={handleChange}
                loading={loading}
                sendOtp={sendOtp} // Pass sendOtp function
                otpSent={otpSent} // Pass otpSent state
                otpVerified={otpVerified} // Pass otpVerified state
              />
            )}
            {currentStep === 2 && (
              <EducationDetails
                formData={formData}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                loading={loading}
                branchesArray={branchesArray}
              />
            )}
            {currentStep === 3 && (
              <PreviousEducationDetails
                formData={formData}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                loading={loading}
              />
            )}
            {currentStep === 4 && (
              <InternshipsExperience
                formData={formData}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                loading={loading}
              />
            )}
            {currentStep === 5 && (
              <ProfileAndDocuments
                formData={formData}
                handleFileChange={handleFileChange}
                loading={loading}
              />
            )}
            {currentStep === 6 && (
              <AdditionalDetails
                formData={formData}
                handleChange={handleChange}
                loading={loading}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-row justify-evenly">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-2 px-4 w-56 rounded bg-gray-500 text-white hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
              )}
              {currentStep < 6 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-3  w-56 rounded bg-blue-500 text-white hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              )}
              {currentStep === 6 && (
                <button
                  type="submit"
                  disabled={!otpVerified || loading}
                  className={`py-2 px-4 rounded ${
                    !otpVerified
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-700"
                  } text-white transition-colors`}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-2xl font-semibold">
              Application Submitted Successfully!
            </h3>
            <button
              onClick={handleResetForm}
              className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-700 transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        )}

        {/* OTP Verification Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="OTP Verification"
          className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto outline-none transition-colors duration-300`}
          overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            OTP Verification
          </h2>
          <div className="space-y-4">
            <label className="block dark:text-gray-300">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={verifyOtp}
              disabled={loading}
              className={`w-full py-2 px-4 rounded ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
              } text-white transition-colors`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default JobApplicationForm;
