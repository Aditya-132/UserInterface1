import {FileInput} from "../Reusable_components/index";

export const ProfileAndDocuments = ({ formData, handleFileChange, loading }) => (
    <div className="flex flex-col space-y-4 place-items-center">
        <FileInput label="Upload Profile Photo" name="profilePhotoProof" onChange={handleFileChange} disabled={loading} required />
    </div>
);