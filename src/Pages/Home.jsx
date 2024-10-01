import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaEdit, FaBars } from "react-icons/fa";
import { MdOutlineQuiz, MdWorkOutline, MdAssessment, MdWeb, MdEventAvailable } from "react-icons/md";
import EmailVerification from "../components/EmailVerification";
import PlacementReport from "../components/PlacementReport"; // Import the PlacementReport component

const Home = () => {
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar starts closed on mobile
    const [activeComponent, setActiveComponent] = useState(null); // State to manage the active component

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case "placementReport":
                return <PlacementReport />;
            case "newApplication":
                return <div>New Application Component</div>; // Replace with actual component
            case "changeView":
                return <div>Change/View Application Component</div>; // Replace with actual component
            default:
                return <div>    <img src="/home.jpg" alt="Home Illustration" className="rounded-lg shadow-lg max-w-full max-h-full" /></div>; // Default content
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <div
                className={`bg-gray-800 flex flex-col justify-between transition-all duration-300 ${
                    isSidebarOpen ? "w-64" : "w-20"
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
                    <div className={`p-6 text-center font-bold text-2xl ${isSidebarOpen ? "block" : "hidden"} md:block`}>
                        SGGSIE&T Data Collection Portal
                    </div>

                    {/* Navigation Links with Tooltips */}
                    <nav className="mt-10 flex flex-col items-center md:items-start w-full space-y-2">
                        <div className="relative group w-full">
                            <div
                                onClick={() => {
                                    setActiveComponent("newApplication");
                                    setShowEmailVerification(false);
                                }}
                                className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded-md cursor-pointer"
                            >
                                <FaUserPlus />
                                <span className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>New Application</span>
                            </div>
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 bg-gray-800 text-gray-200 text-sm rounded-md p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                Create a new application form
                            </div>
                        </div>

                        <div className="relative group w-full">
                            <div
                                onClick={() => setShowEmailVerification(true)}
                                className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded-md cursor-pointer"
                            >
                                <FaEdit />
                                <span className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>Change / View Application</span>
                            </div>
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 bg-gray-800 text-gray-200 text-sm rounded-md p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                Edit or view your application
                            </div>
                        </div>

                        <div className="relative group w-full">
                            <Link to="/aptitude-test" className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded-md">
                                <MdOutlineQuiz />
                                <span className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>Aptitude Test</span>
                            </Link>
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 bg-gray-800 text-gray-200 text-sm rounded-md p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                Take the aptitude test
                            </div>
                        </div>

                        <div className="relative group w-full">
                            <a
                                href="https://www.glassdoor.co.in/Community/index.html"
                                className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded-md"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MdWorkOutline />
                                <span className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>Internships</span>
                            </a>
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 bg-gray-800 text-gray-200 text-sm rounded-md p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                Explore internship opportunities
                            </div>
                        </div>

                        <div className="relative group w-full">
                            <div
                                onClick={() => {
                                    setActiveComponent("placementReport");
                                    setShowEmailVerification(false);
                                }}
                                className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded-md cursor-pointer"
                            >
                                <MdAssessment />
                                <span className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>Placement Report</span>
                            </div>
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 bg-gray-800 text-gray-200 text-sm rounded-md p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                View placement reports
                            </div>
                        </div>

                        <div className="relative group w-full">
                            <a
                                href="https://iccpm.com/training-development/online-workshop-webinars/"
                                className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded-md"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MdWeb />
                                <span className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>Workshop/Webinar</span>
                            </a>
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 bg-gray-800 text-gray-200 text-sm rounded-md p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                Join our workshops/webinars
                            </div>
                        </div>

                        <div className="relative group w-full">
                            <Link to="/events" className="w-full flex items-center space-x-2 p-3 hover:bg-gray-700 rounded-md">
                                <MdEventAvailable />
                                <span className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>Events</span>
                            </Link>
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-48 bg-gray-800 text-gray-200 text-sm rounded-md p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                Check out upcoming events
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center bg-gray-900 p-5 md:p-20">
                {showEmailVerification ? (
                    <EmailVerification />
                    
                ) : (
                    renderActiveComponent() // Render the active component based on state
                )}
            </div>
        </div>
    );
};

export default Home;
