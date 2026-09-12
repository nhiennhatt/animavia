import Link from "next/link";
import { Info, SendHorizonal, SquareArrowRightEnterIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { GoogleIcon } from "@/components/icons/google-icon";

export function StepOne({ toNextStep }: { toNextStep: () => void }) {
  return (
    <>
      <div className="space-y-2 mb-2">
        <h1 className="text-center text-2xl md:text-4xl font-bold text-primary">
          Đăng ký
        </h1>
        <p className="font-light text-center text-sm">
          Đồng hành cùng chúng mình để gọi tên những cảm xúc, nuôi dưỡng sự trắc
          ẩn và lưu giữ từng khoảnh khắc đáng giá.
        </p>
      </div>
      <Button
        variant="outline"
        size="default"
        className="text-lg font-normal text-center border border-accent rounded-lg flex gap-x-3 justify-center items-center"
      >
        <GoogleIcon className="size-5" />
        Tiếp tục với Google
      </Button>
      <Marker variant="separator">
        <MarkerContent className="font-mono text-xs">
          hoặc đăng ký với địa chỉ email
        </MarkerContent>
      </Marker>
      <div className="flex flex-col gap-y-3">
        <Field>
          <FieldLabel htmlFor="email">Địa chỉ Email</FieldLabel>
          <Input type="email" id="email" />
          <FieldDescription className="flex items-center text-xs gap-x-1 text-neutral-500">
            <Info className="size-3 self-center-safe" /> Mã xác thực gồm 6 chữ
            số sẽ được gửi đến hộp thư của bạn.
          </FieldDescription>
        </Field>
      </div>
      <Button className="text-lg rounded-sm" onClick={() => toNextStep()}>
        Gửi mã OTP <SendHorizonal />
      </Button>
      <p className="text-center">
        Tiếp tục hành trình của bạn chứ?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:underline"
        >
          Đăng nhập ngay
        </Link>
      </p>
    </>
  );
}
