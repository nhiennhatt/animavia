import { Slider } from "@/components/ui/slider";
import { useContext } from "react";
import { FormDataContext } from "./context/form-data-context";

export function StepThree() {
  const [formData, setFormData] = useContext(FormDataContext);

  return (
    <div className="my-4">
      <div className="space-y-4">
        <h4 className="text-xl font-medium">Tần suất mỗi tuần bạn mong muốn? *</h4>
        <div className="space-y-2 mx-4">
          <div className="flex items-baseline justify-between gap-x-4">
            <span className="text-9xl font-mono">{formData.weekly}</span>
            <span className="text-lg">ngày mỗi tuần</span>
          </div>
          <Slider
            onValueChange={(e) => setFormData({ ...formData, weekly: e[0] })}
            value={[formData.weekly || 1]}
            min={1}
            max={7}
            step={1}
            colorRange={false}
          />
          <div className="flex justify-between *:px-2">
            <span
              className="cursor-default"
              onClick={() => setFormData({ ...formData, weekly: 1 })}
            >
              1
            </span>
            <span
              className="cursor-default"
              onClick={() => setFormData({ ...formData, weekly: 2 })}
            >
              2
            </span>
            <span
              className="cursor-default"
              onClick={() => setFormData({ ...formData, weekly: 3 })}
            >
              3
            </span>
            <span
              className="cursor-default"
              onClick={() => setFormData({ ...formData, weekly: 4 })}
            >
              4
            </span>
            <span
              className="cursor-default"
              onClick={() => setFormData({ ...formData, weekly: 5 })}
            >
              5
            </span>
            <span
              className="cursor-default"
              onClick={() => setFormData({ ...formData, weekly: 6 })}
            >
              6
            </span>
            <span
              className="cursor-default"
              onClick={() => setFormData({ ...formData, weekly: 7 })}
            >
              7
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
