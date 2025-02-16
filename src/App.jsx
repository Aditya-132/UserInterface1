import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs";
import Register from "./Pages/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import Login from "./Pages/Login";
import JobApplicationDetail from "./components/JobApplicationDetail";
import EmailVerification from "./components/EmailVerification";
import Test from "./components/Test";
import AdminTestManagement from "./components/Admintest";
import Register1 from "./components/Createuser";
import RegisterAndSubmit from "./components/Test";
import TestComponent from "./components/Test";
import PlacementReport from "./components/PlacementReport";
const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767); // Adjust the breakpoint as needed
    };

    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize); // Add event listener

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "  http://localhost:40004/api/v1/user/patient/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  if (isMobile) {
    return (
      <div style={{ textAlign: "center", padding: "20px",justifyContent: "center" }}>
        <h1>
          This website is not accessible on mobile devices due to Development going on . Please open it on
          laptop or PC
        </h1>
      </div>
    );
  }

  return (
    <>
      {/* <Home /> */}
      <Router>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/newApplicant" element={<Appointment />} />
          <Route path="/check" element={<EmailVerification />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<Test />} />
          <Route path="/admin" element={<AdminTestManagement />} />
          <Route path="/reg0" element={<TestComponent />} />
          <Route path="/placement-report" element={<PlacementReport />} />
          {/* <Route index path="/" element={<EmailVerification/>} /> */}
          {/* <Route path="/detail" element={<JobApplicationDetail/>} /> */}
        </Routes>
        {/* <Footer /> */}
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
