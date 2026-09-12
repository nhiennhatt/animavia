"use client";

import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { Eye, EyeClosed } from "lucide-react";

export function PasswordInput(props: React.ComponentProps<"input">) {
  const [isShow, setIsShow] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput {...props} type={isShow ? "text" : "password"} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={() => setIsShow(!isShow)}>
          {isShow ? <Eye /> : <EyeClosed />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
