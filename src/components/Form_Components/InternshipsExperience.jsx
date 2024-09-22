import {InputField, FileInput} from "../Reusable_components/index";

export const InternshipsExperience = ({ formData, handleChange, handleFileChange, loading }) => (
    <div className="space-y-4">
        <InputField label="Internships" name="internship" value={formData.internship} onChange={handleChange} disabled={loading} required />
        <FileInput label="Upload Internship Proof" name="internshipProof" onChange={handleFileChange} disabled={loading} required />
    </div>
);