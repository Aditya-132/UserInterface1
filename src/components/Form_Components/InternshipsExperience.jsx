import {InputField, FileInput} from "../Reusable_components/index";

export const InternshipsExperience = ({ formData, handleChange, handleFileChange, loading }) => (
    <div className="flex flex-col space-y-4 place-items-center">
        <InputField label="Internships" name="internship" value={formData.internship} onChange={handleChange} disabled={loading} />
        <FileInput label="Upload Internship Proof" name="internshipProof" onChange={handleFileChange} disabled={loading}  />
    </div>
);
