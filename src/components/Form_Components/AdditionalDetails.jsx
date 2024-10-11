import {TextAreaField} from "../Reusable_components/index";

export const AdditionalDetails = ({ formData, handleChange, loading }) => (
    <div className="flex flex-col items-center justify-center ">
        <TextAreaField label="Address" name="address" value={formData.address} onChange={handleChange} disabled={loading} required />
        <TextAreaField label="Skills" name="skills" value={formData.skills} onChange={handleChange} disabled={loading} required />
        <TextAreaField label="References" name="references" value={formData.references} onChange={handleChange} disabled={loading} required />
    </div>
);