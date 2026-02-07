"use client";

import { cn } from "@/lib/utils";

interface Step {
  number: number;
  label: string;
  href: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  ariaLabel?: string;
}

export default function Stepper({ steps, currentStep, ariaLabel = "Fortschritt" }: StepperProps) {
  return (
    <nav aria-label={ariaLabel} className="w-full">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li key={step.number} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 border-4 border-black flex items-center justify-center font-bold text-sm shrink-0",
                  currentStep === step.number && "bg-black text-white",
                  currentStep > step.number && "bg-accent text-black",
                  currentStep < step.number && "bg-white text-black"
                )}
                aria-current={currentStep === step.number ? "step" : undefined}
              >
                {currentStep > step.number ? "✓" : step.number}
              </div>
              <span
                className={cn(
                  "text-xs font-bold uppercase tracking-wider hidden sm:block",
                  currentStep === step.number && "text-black",
                  currentStep !== step.number && "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-1 mx-2 border-t-4 border-black",
                  currentStep > step.number
                    ? "border-accent"
                    : "border-gray-300"
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
