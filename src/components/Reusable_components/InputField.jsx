// Reusable Input Components with Enhanced Styling and Validation

export const InputField = ({ label, type = "text", name, value, onChange, disabled, required }) => (
    <div className="flex flex-col w-9/12">
        <label className="font-semibold mb-2 text-white">{label}{required && <span className="text-red-500">*</span>}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={label}
            className="p-2 border shadow-md opacity-75 text-white border-gray-600 bg-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500  duration-300"
            required={required}
        />
    </div>
);
