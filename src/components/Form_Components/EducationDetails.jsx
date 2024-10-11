import {InputField, SelectField, FileInput} from "../Reusable_components/index";

export const EducationDetails = ({ formData, handleChange, handleFileChange, loading, branchesArray }) => (
  <div className="flex flex-col space-y-4 place-items-center">
    <InputField label="SSC Percentage" type="number" name="ssc" value={formData.ssc} onChange={handleChange} disabled={loading} required />
    <FileInput label="Upload SSC Proof" name="sscProof" onChange={handleFileChange} disabled={loading} required />
    <InputField label="HSC Percentage" type="number" name="hsc" value={formData.hsc} onChange={handleChange} disabled={loading} required />
    <FileInput label="Upload HSC Proof" name="hscProof" onChange={handleFileChange} disabled={loading} required />
    <InputField label="CGPA" type="number" name="cgpa" value={formData.cgpa} onChange={handleChange} disabled={loading} required />
    <FileInput label="Upload CGPA Proof" name="cgpaProof" onChange={handleFileChange} disabled={loading} required />
    <SelectField label="Branch" name="branch" value={formData.branch} options={branchesArray} onChange={handleChange} disabled={loading} required />
  </div>
);