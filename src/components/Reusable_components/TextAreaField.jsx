export const TextAreaField = ({ label, name, value, onChange, disabled, required }) => (
    <div className="flex flex-col justify-center items-center w-11/12">
        <label className="font-semibold mb-2 dark:text-gray-300">{label}{required && <span className="text-red-500">*</span>}</label>
        <textarea
            rows="4"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={label}
            disabled={disabled}
            className="p-3 border w-9/12 border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            required={required}
        />
    </div>
);
