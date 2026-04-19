import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex flex-col gap-6">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? '#10B981' : isActive ? '#3E63F5' : '#E5E7EB',
                  borderColor: isCompleted ? '#10B981' : isActive ? '#3E63F5' : '#E5E7EB',
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300 relative`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={`text-[13px] font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {index + 1}
                  </span>
                )}
                {isActive && (
                  <div className="absolute inset-0 rounded-full border-2 border-[#3E63F5] animate-ping opacity-20" />
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="w-0.5 h-full bg-[#E5E7EB] mt-2 mb-2 rounded-full overflow-hidden">
                  <motion.div
                    className="w-full bg-[#10B981]"
                    initial={{ height: "0%" }}
                    animate={{ height: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
            
            <div className={`pb-8 ${index === steps.length - 1 ? 'pb-0' : ''}`}>
              <motion.h4 
                animate={{ color: isActive || isCompleted ? '#1F2430' : '#9CA3AF' }}
                className="text-[16px] font-bold font-[Manrope,sans-serif] leading-tight mb-1"
              >
                {step.title}
              </motion.h4>
              <motion.p 
                animate={{ color: isActive || isCompleted ? 'rgba(31,36,48,0.7)' : '#9CA3AF' }}
                className="text-[14px] font-medium leading-relaxed"
              >
                {step.description}
              </motion.p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
