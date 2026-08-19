import { LifeDomainEnum } from "@/helpers/constants";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { FormDataContext } from "./context/form-data-context";
import { lifeDomainList } from "@/config/life-domain-list";

export function StepTwo() {
  const [formData, setFormData, error] = useContext(FormDataContext);

  const handleSelectDomain = (
    domain: (typeof LifeDomainEnum)[keyof typeof LifeDomainEnum],
  ) => {
    if (!formData.domain) {
      setFormData({ ...formData, domain: [domain] });
    } else if (formData.domain.includes(domain)) {
      const newArray = formData.domain.toSpliced(
        formData.domain.indexOf(domain),
        1,
      );
      setFormData({ ...formData, domain: newArray });
    } else {
      setFormData({ ...formData, domain: [...formData.domain, domain] });
    }
  };

  return (
    <div>
      {error.domain && (
        <div className="text-destructive">{error.domain[0]}</div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-3">
        {lifeDomainList.map((d) => (
          <button
            key={d.value}
            className={cn(
              "p-3 text-center flex flex-col items-center border border-accent rounded transition-colors",
              "hover:bg-accent gap-y-1",
              "data-active:bg-primary data-active:text-primary-foreground data-active:hover:bg-primary/80",
            )}
            onClick={() => handleSelectDomain(d.value)}
            data-active={formData.domain?.includes(d.value)}
          >
            <d.Icon width={16} height={16} className="size-7" />
            <p>{d.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
