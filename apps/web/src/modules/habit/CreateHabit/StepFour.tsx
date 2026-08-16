import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useContext } from "react";
import { FormDataContext } from "./context/form-data-context";

export function StepFour() {
  const [formData, setFormData, error] = useContext(FormDataContext);

  return (
    <div>
      <Field>
        <FieldLabel htmlFor="quote">
          Lời nhắc nhở hoặc trích dẫn cảm hứng
        </FieldLabel>
        <div className="border border-accent has-focus-visible:ring-2 has-focus-visible:ring-primary/90 rounded-sm m-0 p-0 flex flex-col">
          <textarea
            value={formData.statement?.statement || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                statement: {
                  ...(formData.statement ? formData.statement : {}),
                  statement: e.currentTarget.value,
                },
              })
            }
            id="quote"
            className="w-full m-0 p-2 resize-none h-16 outline-none"
            placeholder="Một câu nói dịu dàng tiếp thêm động lực cho bạn mỗi ngày..."
          />
          <div className="px-1">
            <Separator className="bg-accent" />
          </div>
          <div className="flex items-center px-1 gap-x-1">
            <span>&mdash;</span>
            <input
              onChange={(e) =>
                setFormData({
                  ...formData,
                  statement: {
                    ...(formData.statement
                      ? formData.statement
                      : { statement: "" }),
                    source: e.currentTarget.value,
                  },
                })
              }
              placeholder="Tên tác giả hoặc nguồn trích dẫn... (tuỳ chọn)"
              className="flex-1 outline-none py-1"
            />
          </div>
        </div>
        {error.statement && <FieldError>{error.statement[0]}</FieldError>}
      </Field>
    </div>
  );
}
