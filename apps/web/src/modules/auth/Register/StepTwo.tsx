import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export function StepTwo({
  toNextStep,
  toPreviousStep,
}: {
  toNextStep: () => void;
  toPreviousStep: () => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-y-3 mb-2">
        <h1 className="text-center text-2xl md:text-4xl font-bold text-primary">
          Xác nhận Email
        </h1>
        <p className="font-light text-center text-sm">
          Mã xác thực gồm 6 chữ số đã được gửi đến hộp thư của bạn.
        </p>
        <div className="mt-5">
          <InputOTP
            maxLength={6}
            containerClassName="gap-x-1 md:gap-x-2 justify-center"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={4} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-center">
            Bạn chưa nhận được mã?{" "}
            <Button className="text-sm mx-0 px-0" variant="link">
              Yêu cầu gửi lại
            </Button>
          </p>
        </div>
      </div>
      <Button className="text-lg rounded-sm" onClick={() => toNextStep()}>
        Xác nhận <ShieldCheck />
      </Button>
      <Button
        variant="link"
        onClick={() => toPreviousStep()}
      >
        <ArrowLeft /> Quay lại
      </Button>
    </>
  );
}
