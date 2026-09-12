import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/common/PasswordInput";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { CircleCheck } from "lucide-react";

export function StepThree() {
  return (
    <>
      <div className="space-y-2 mb-2">
        <h1 className="text-center text-2xl md:text-4xl font-bold text-primary">
          Hoàn tất
        </h1>
        <p className="font-light text-center text-sm">
          Nhập họ tên và mật khẩu an toàn để bảo mật không gian riêng tư của
          bạn.
        </p>
      </div>
      <div className="flex flex-col gap-y-3">
        <Field>
          <FieldLabel htmlFor="given_name">Tên</FieldLabel>
          <Input type="text" id="given_name" />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
          <PasswordInput id="password" />
        </Field>
      </div>
      <Button className="text-lg rounded-sm">
        Hoàn tất <CircleCheck />
      </Button>
    </>
  );
}
