"use client";

import z from "zod";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeClosed, KeyRound, Mail } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LoginBodySchema } from "@/validations/user.validation";
import { login } from "@/services/user.service";

export function Login() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [seePassword, setSeePassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<
    Partial<Record<keyof z.infer<typeof LoginBodySchema> | "general", string>>
  >({});

  const { mutate: handleLogin, isPending: isLogging } = useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      setError({});
      const validation = await LoginBodySchema.parseAsync(params);

      const result = await login(validation);

      if (!result.success) throw result;
    },
    onSuccess: (data) => {
      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });
    },
    onError: (err: unknown) => {
      if (err instanceof z.ZodError) {
        const flatten = z.flattenError<z.infer<typeof LoginBodySchema>>(
          err as z.ZodError<z.infer<typeof LoginBodySchema>>,
        );

        const error = Object.fromEntries(
          Object.entries(flatten.fieldErrors).map(([key, value]) => [
            key,
            value.join(""),
          ]),
        ) as { [key in keyof z.infer<typeof LoginBodySchema>]: string };

        setError(error);
      }
    },
  });

  return (
    <div className="max-w-lg w-full mx-auto my-20 space-y-8">
      <h1 className="text-center text-6xl font-bold text-primary text-shadow-sm text-shadow-primary/70">
        Pneuma
      </h1>
      <div
        className="p-12 bg-white rounded-lg shadow-lg space-y-8"
        onKeyUp={(e) => {
          if (!e.isTrusted || e.key !== "Enter") return;
          if (isLogging || !email.trim() || !password.trim()) return;
          handleLogin({ email, password });
        }}
      >
        <Field>
          <Label
            htmlFor="email"
            className="text-lg font-medium text-shadow-primary"
          >
            Địa chỉ Email
          </Label>
          <InputGroup>
            <InputGroupInput
              disabled={isLogging}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="name@example.com"
              id="email"
              type="email"
              aria-invalid={!!(error.email || error.general)}
            />
            <InputGroupAddon>
              <Mail />
            </InputGroupAddon>
          </InputGroup>
          {(error.general || error.email) && (
            <FieldError>{error.general || error.email}</FieldError>
          )}
        </Field>

        <Field>
          <div className="flex justify-between items-end">
            <Label
              htmlFor="password"
              className="text-lg font-medium text-shadow-primary"
            >
              Mật khẩu
            </Label>
            <Link href="#" className="text-sm text-primary">
              Quên mật khẩu?
            </Link>
          </div>
          <InputGroup>
            <InputGroupInput
              placeholder="&#x2055;&#x2055;&#x2055;&#x2055;&#x2055;&#x2055;&#x2055;&#x2055;&#x2055;&#x2055;"
              id="password"
              disabled={isLogging}
              type={seePassword ? "text" : "password"}
              value={password}
              aria-invalid={!!(error.general || error.password)}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <InputGroupAddon>
              <KeyRound />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton onClick={() => setSeePassword(!seePassword)}>
                {seePassword ? <Eye /> : <EyeClosed />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {(error.general || error.password) && (
            <FieldError>{error.general || error.password}</FieldError>
          )}
        </Field>

        <Button
          onClick={() => handleLogin({ email, password })}
          disabled={isLogging || !email.trim() || !password.trim()}
          size="lg"
          className="w-full h-auto! py-3 text-lg rounded-xl"
        >
          Đăng nhập
          <ArrowRight className="size-5" />
        </Button>

        <p className="text-center text-neutral-500">
          Chưa có tài khoản?{" "}
          <Link className="text-primary" href="#">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
