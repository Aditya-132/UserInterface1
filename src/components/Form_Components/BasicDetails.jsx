// Form Sections Components

import {InputField, SelectField} from "../Reusable_components/index";

export const BasicDetails = ({ formData, handleChange, loading, sendOtp, otpSent, otpVerified }) => (
  <div className=" flex flex-col space-y-4 place-items-center">
    <InputField label="Registration Number" name="reg" value={formData.reg} onChange={handleChange} disabled={loading} required />
    <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} disabled={loading} required />
    <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} disabled={loading} required />
    <button
      type="button"
      onClick={sendOtp}
      disabled={otpSent || otpVerified || loading}
      className={`py-2 px-4 rounded  ${otpVerified ? "bg-green-500" : "bg-blue-500"} text-white w-9/12 hover:bg-blue-700 transition-colors`}
    >
      {otpVerified ? "Verified" : "Verify Email"}
    </button>
    <InputField label="Mobile Number" name="phone" value={formData.phone} onChange={handleChange} disabled={loading} required />
    <InputField label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={loading} required />
    <SelectField label="Gender" name="gender" value={formData.gender} options={["", "Male", "Female", "Other"]} onChange={handleChange} disabled={loading} required />
    <InputField label="parentEmail" type="email" name="parentemail" value={formData.parentemail} onChange={handleChange} disabled={loading} required />
    <InputField label="HeadEmail" type="email" name="heademail" value={formData.heademail} onChange={handleChange} disabled={loading} required />
  </div>
);
