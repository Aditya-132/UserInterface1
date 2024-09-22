import {FileInput} from "../Reusable_components/index";

export const ProfileAndDocuments = ({ formData, handleFileChange, loading }) => (
    <div className="space-y-4">
        <FileInput label="Upload Profile Photo" name="profilePhotoProof" onChange={handleFileChange} disabled={loading} required />
    </div>
);