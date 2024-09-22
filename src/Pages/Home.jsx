import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaEdit, FaBars } from 'react-icons/fa';
import { MdOutlineQuiz, MdWorkOutline, MdAssessment, MdWeb, MdEventAvailable } from 'react-icons/md';
import EmailVerification from "../components/EmailVerification";
import SidebarLink from '../components/SidebarLink';

const Home = () => {
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar starts closed on mobile

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 flex flex-col justify-between transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } md:w-64`}
      >
        {/* Hamburger Menu (always visible on mobile) */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars size={20} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col items-center md:items-start flex-grow">
          {/* Logo / Title */}
          <div
            className={`p-6 text-center font-bold text-2xl ${
              isSidebarOpen ? 'block' : 'hidden'
            } md:block`}
          >
            SGGSIE&T Data Collection Portal
          </div>

          {/* Navigation Links */}
          <nav className="mt-10 flex flex-col items-center md:items-start w-full space-y-2">
            <SidebarLink
              to="/newApplicant"
              icon={FaUserPlus}
              label="New Application"
              tooltip="Create a new application form to get started with your verification process."
            />
            <SidebarLink
              to="#"
              icon={FaEdit}
              label="Change / View Application"
              tooltip="Edit your application details or view the current status of your submission."
            />
            <SidebarLink
              to="/aptitude-test"
              icon={MdOutlineQuiz}
              label="Aptitude Test"
              tooltip="Access the aptitude test to evaluate your skills as part of the application process."
            />
            <SidebarLink
              to="https://www.glassdoor.co.in/Community/index.html"
              icon={MdWorkOutline}
              label="Internships"
              tooltip="Explore available internships and apply directly through our platform."
            />
            <SidebarLink
              to="https://sggsplacements.in/"
              icon={MdAssessment}
              label="Placement Report"
              tooltip="View detailed placement reports and statistics of previous applicants."
            />
            <SidebarLink
              to="https://iccpm.com/training-development/online-workshop-webinars/"
              icon={MdWeb}
              label="Workshop/Webinar"
              tooltip="Join our online workshops and webinars to enhance your skills and knowledge."
            />
            <SidebarLink
              to="https://www.sggs.ac.in/"
              icon={MdEventAvailable}
              label="Achievements"
              tooltip="Check out the latest achievements and milestones of our application portal."
            />
          </nav>
        </div>

        {/* Footer */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block p-6 text-sm text-center text-gray-500`}>
          &copy; 2024 SGGSIE&T | T&P Cell | All Rights Reserved
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 p-5 md:p-20">
        {showEmailVerification ? (
          <EmailVerification />
        ) : (
          <img
            src="/home.jpg"
            alt="Home Illustration"
            className="rounded-lg shadow-lg max-w-full max-h-full"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
