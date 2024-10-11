// Progress Indicator Component

export const ProgressIndicator = ({ currentStep }) => {
  const steps = [
    "Basic Details",
    "Education Details",
    "Previous Education",
    "Internships & Experience",
    "Profile & Documents",
    "Additional Details"
  ];

  return (
    <div className="flex flex-row items-center mb-8 items-center justify-center ">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <div key={index} className="flex-1 flex items-center  justify-center ">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted || isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'} transition-colors`}>
              {stepNumber}
            </div>
            {index !== steps.length - 1 && (
              <div className={`flex-1 w-28 h-1 ${isCompleted ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'} transition-colors`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

