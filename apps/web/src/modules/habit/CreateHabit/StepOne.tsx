import { useContext } from "react";
import { Sprout, TrendingDown } from "lucide-react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormDataContext } from "./context/form-data-context";
import { HabitTypeEnum } from "@/helpers/constants";

export function StepOne() {
  const [formData, setFormData, error] = useContext(FormDataContext);
  return (
    <div className="flex flex-col gap-y-4">
      <Field className="[&_label]:text-base">
        <FieldLabel htmlFor="name">Tên thói quen: *</FieldLabel>
        <Input
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          value={formData.name || ""}
          aria-invalid={!!error.name}
          type="text"
          id="name"
        />
        {error.name && <FieldError>{error.name[0]}</FieldError>}
      </Field>
      <Field className="[&_label]:text-base">
        <FieldLabel htmlFor="objective">Mục tiêu:</FieldLabel>
        <Textarea
          onChange={(e) =>
            setFormData({ ...formData, objective: e.target.value })
          }
          value={formData.objective || ""}
          aria-invalid={!!error.objective}
          className="resize-none"
          id="objective"
        />
        {error.objective && <FieldError>{error.objective[0]}</FieldError>}
      </Field>
      <div className="space-y-3">
        <p className="text-base font-medium">Khuynh hướng: *</p>
        <div
          className={cn(
            "flex gap-x-3",
            "[&_button]:transition-colors",
            "[&_button]:py-5 [&_button]:border [&_button]:border-accent [&_button]:hover:bg-accent [&_button]:cursor-pointer [&_button]:flex [&_button]:flex-col [&_button]:flex-1 [&_button]:rounded-md [&_button]:items-center",
            "[&_button]:data-active:bg-primary [&_button]:data-active:text-primary-foreground [&_button]:data-active:hover:bg-primary/80",
          )}
        >
          <button
            onClick={() =>
              setFormData({ ...formData, htype: HabitTypeEnum.CONSTRUCTIVE })
            }
            data-active={formData.htype === HabitTypeEnum.CONSTRUCTIVE}
          >
            <Sprout />
            <span className="text-base font-medium">Xây dựng mới</span>
            <span className="text-xs">Xây dựng nếp sống mới</span>
          </button>
          <button
            onClick={() =>
              setFormData({ ...formData, htype: HabitTypeEnum.DESTRUCTIVE })
            }
            data-active={formData.htype === HabitTypeEnum.DESTRUCTIVE}
          >
            <TrendingDown />
            <span className="text-base font-medium">Cần loại bỏ</span>
            <span className="text-xs">Khép lại một thói quen cũ</span>
          </button>
        </div>
        {error.htype && <p className="text-destructive">{error.htype}</p>}
      </div>
    </div>
  );
}
