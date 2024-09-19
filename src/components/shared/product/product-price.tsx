import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
  withText,
}: {
  value: number;
  className?: string;
  withText?: boolean;
}) => {
  const stringValue = value.toString();
  const [intValue, floatValue] = stringValue.includes(".")
    ? stringValue.split(".")
    : [stringValue, ""];
  return (
    <div className="flex items-center gap-1">
      <p className={cn("text-2xl flex", className)}>
        {intValue}
        <span className="text-xs align-super">{floatValue}</span>
      </p>
      {withText && <span className="text-base">лв.</span>}
    </div>
  );
};

export default ProductPrice;
