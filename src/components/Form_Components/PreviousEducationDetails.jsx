import {InputField, FileInput} from "../Reusable_components/index";

export const PreviousEducationDetails = ({ formData, handleChange, handleFileChange, loading }) => (
    <div className="flex flex-col space-y-4 place-items-center">
        <InputField label="No of Backlogs" type="number" name="backlogs" value={formData.backlogs} onChange={handleChange} disabled={loading} required />
        <InputField label="Gap Year" type="number" name="gap_year" value={formData.gap_year} onChange={handleChange} disabled={loading} />
        <FileInput label="Upload Gap Year Proof" name="gap_yearProof" onChange={handleFileChange} disabled={loading}  />
        <InputField label="Projects" name="projects" value={formData.projects} onChange={handleChange} disabled={loading} required />
    </div>
);
