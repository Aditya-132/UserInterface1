export const SelectField = ({ label, name, value, options, onChange, disabled, required }) => (
    <div className="flex flex-col w-9/12">
        <label className="font-semibold mb-2 dark:text-gray-300">{label}{required && <span className="text-red-500">*</span>}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            required={required}
        >
            {options.map((option, index) => (
                <option value={option} key={index}>
                    {option === "" ? "Select" : option}
                </option>
            ))}
        </select>
    </div>
);