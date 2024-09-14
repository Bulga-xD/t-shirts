import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import {
  DollarSign,
  Headset,
  ShoppingBag,
  Medal,
  Sparkles,
} from "lucide-react";

const EcommerceFeatures = () => {
  return (
    <div>
      <Card>
        <CardTitle className="text-center my-4">
          Защо да изберете продуктите на{" "}
          <span className="font-another-danger font-normal">{APP_NAME}</span>
        </CardTitle>

        <CardContent className="flex flex-col sm:flex-row justify-center gap-4 p-4">
          <div className="space-y-2">
            <ShoppingBag size={40} />
            <div className="text-sm font-bold">Безплатна доставка</div>
            <div className="text-sm text-muted-foreground">
              Безплатна доставка за поръчки над 199лв.
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign size={40} />
            <div className="text-sm font-bold">Покупка без риск</div>
            <div className="text-sm text-muted-foreground">
              Замени или Върни до 14 дни след покупка
            </div>
          </div>

          <div className="space-y-2">
            <Medal size={40} />
            <div className="text-sm font-bold">Световни качество</div>
            <div className="text-sm text-muted-foreground">
              Избработени от лидери в индустрията
            </div>
          </div>

          <div className="space-y-2">
            <Sparkles size={40} />
            <div className="text-sm font-bold">Премиум материали</div>
            <div className="text-sm text-muted-foreground">
              100% Първокласни и поръчкови материали
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcommerceFeatures;
