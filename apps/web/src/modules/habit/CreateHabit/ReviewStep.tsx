import { useContext } from "react";
import { FormDataContext } from "./context/form-data-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { lifeDomainList } from "@/config/life-domain-list";
import { Calendar, Sprout, TrendingDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function ReviewStep() {
  const [formData] = useContext(FormDataContext);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-center text-primary">{formData.name}</h3>
        <p className="text-center">{formData.objective}</p>
        <div className="text-center my-1">
          <Badge
            variant={formData.htype === "HTYPE_235" ? "default" : "outline"}
          >
            {formData.htype === "HTYPE_235" ? <Sprout /> : <TrendingDown />}
            {formData.htype === "HTYPE_235" ? "Đang xây dựng" : "Cần loại bỏ"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Separator />
        <div className="space-y-2">
          <h6 className="font-medium text-base text-neutral-500">Phân loại</h6>
          <div className="flex flex-wrap gap-1 items-center justify-center">
            {formData.domain?.map((d) => {
              const config = lifeDomainList.find((i) => i.value === d);
              if (!config) return;
              return (
                <Badge variant="outline" className="text-sm h-auto">
                  <config.Icon />
                  {config.name}
                </Badge>
              );
            })}
          </div>
        </div>
        {formData.htype === "HTYPE_235" && (
          <div className="space-y-2">
            <h6 className="font-medium text-base text-neutral-500">
              Chỉ tiêu mỗi tuần
            </h6>
            <div className="bg-accent flex px-3 py-4 items-center gap-x-2 rounded-sm">
              <div>
                <Calendar className="size-5" />
              </div>
              <div className="text-base font-medium">
                {formData.weekly} ngày mỗi tuần
              </div>
            </div>
          </div>
        )}
        {formData.statement && (
          <div className="space-y-2">
            <h6 className="font-medium text-base text-neutral-500">
              Lời nhắc nhở
            </h6>
            <div className="border-s-3 border-s-cyan-800 py-1.5 ps-2 italic">
              &ldquo;{formData.statement.statement}&rdquo;{" "}
              {formData.statement.source && (
                <>&ndash; {formData.statement.source}</>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
