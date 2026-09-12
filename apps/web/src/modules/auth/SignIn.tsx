"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { SquareArrowRightEnterIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { GoogleIcon } from "@/components/icons/google-icon";
import { PasswordInput } from "@/components/common/PasswordInput";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

import { signIn } from "@/services/auth-service";
import { validateSchema } from "@/libs/utils/validate-schema";
import { FlattenValidationError } from "@/libs/types/flatten-validation-error";
import { QueryError } from "@/errors/QueryError";
import { signInSchema } from "@/validations/auth.validation";

type SignInFlattenValidationError = FlattenValidationError<typeof signInSchema>;

export function SignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignInFlattenValidationError | null>(
    null,
  );

  const resetErrors = useCallback(
    (...fields: ("email" | "password")[]) => {
      if (errors)
        setErrors({
          ...errors,
          fieldErrors: {
            ...errors?.fieldErrors,
            ...Object.fromEntries(fields.map((f) => [f, undefined])),
          },
        });
    },
    [errors],
  );

  const { mutate: handleSignIn, isPending: isSigningIn } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const validation = await validateSchema(
        { email, password },
        signInSchema,
      );

      if (!validation.success)
        throw new QueryError("VALIDATION_FAILED", validation.error);

      const res = await signIn(email, password);
      if (!res.success) throw new QueryError(res.code, res.error);
    },
    onError: (error) => {
      if (error instanceof QueryError) {
        if (error.code === "VALIDATION_FAILED") {
          return setErrors(
            error.error as FlattenValidationError<typeof signInSchema>,
          );
        }
        toast.error("Email hoặc mật khẩu không hợp lệ");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userInform"],
      });
      toast.success("Mừng bạn trở về.", {
        description:
          "Không cần vội vã, cứ chầm chậm yêu thương bản thân từng chút một.",
      });
      router.replace("/");
    },
  });

  const validToSubmit = useMemo(() => {
    return email.trim() && password.trim() && !isSigningIn;
  }, [email, password, isSigningIn]);

  return (
    <div
      className="self-center mx-auto w-full max-w-lg"
      onKeyDown={(e) => {
        if (e.key === "Enter" && validToSubmit) {
          handleSignIn({ email, password });
        }
      }}
    >
      <div className="bg-white p-3 md:px-6 md:py-4 rounded shadow-lg border border-accent flex flex-col gap-y-4">
        <div className="space-y-2 mb-2">
          <h1 className="text-center text-2xl md:text-4xl font-bold text-primary">
            Đăng nhập
          </h1>
          <p className="font-light text-center text-sm px-2">
            Dừng lại một chút để thở, gọi tên những cảm xúc và gom góp những
            điều bạn thầm biết ơn.
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
            hoặc với địa chỉ email
          </MarkerContent>
        </Marker>
        <div className="flex flex-col gap-y-3">
          <Field>
            <FieldLabel htmlFor="email">Địa chỉ Email</FieldLabel>
            <Input
              disabled={isSigningIn}
              autoFocus
              type="email"
              id="email"
              value={email}
              placeholder="email@example.com"
              onChange={(e) => {
                setEmail(e.currentTarget.value);
                resetErrors("email");
              }}
            />
            {errors?.fieldErrors.email && (
              <FieldError>{errors.fieldErrors.email}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
            <PasswordInput
              disabled={isSigningIn}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.currentTarget.value);
                resetErrors("password");
              }}
              placeholder="Nhập mật khẩu"
            />
            {errors?.fieldErrors.password && (
              <FieldError>{errors.fieldErrors.password}</FieldError>
            )}
          </Field>
        </div>
        <Button
          className="text-lg rounded-sm"
          disabled={!validToSubmit}
          onClick={() => handleSignIn({ email, password })}
        >
          Đăng nhập <SquareArrowRightEnterIcon />
        </Button>
        <p className="text-center">
          Bạn mới ghé thăm lần đầu?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Bắt đầu tại đây
          </Link>
        </p>
      </div>
      <Dialog open={isSigningIn} onOpenChange={() => {}}>
        <DialogContent
          className="w-auto bg-transparent ring-0"
          showCloseButton={false}
        >
          <div>
            <Spinner className="size-16 text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
