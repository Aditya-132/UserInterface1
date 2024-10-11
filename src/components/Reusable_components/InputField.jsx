// Reusable Input Components with Enhanced Styling and Validation

export const InputField = ({ label, type = "text", name, value, onChange, disabled, required }) => (
    <div className="flex flex-col w-9/12">
        <label className="font-semibold mb-2 dark:text-gray-300">{label}{required && <span className="text-red-500">*</span>}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={label}
            className="p-2 border shadow-md opacity-75 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            required={required}
        />
    </div>
);
