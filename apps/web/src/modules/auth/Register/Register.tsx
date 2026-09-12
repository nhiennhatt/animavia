"use client";

import { useState } from "react";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";

export function Register() {
  const [step, setStep] = useState(0);

  return (
    <div className="self-center mx-auto w-full max-w-lg">
      <div className="bg-white p-3 md:px-6 md:py-4 rounded shadow-lg border border-accent flex flex-col gap-y-5">
        {step === 0 && <StepOne toNextStep={() => setStep(1)} />}
        {step === 1 && (
          <StepTwo
            toNextStep={() => setStep(2)}
            toPreviousStep={() => setStep(0)}
          />
        )}
        {step === 2 && <StepThree />}
      </div>
    </div>
  );
}
