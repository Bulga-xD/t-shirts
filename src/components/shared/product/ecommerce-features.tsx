import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";

const EcommerceFeatures = () => {
  return (
    <div>
      <Card>
        <CardContent className="flex flex-col sm:flex-row justify-evenly gap-4 p-4">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold">Безплатна доставка</div>
            <div className="text-sm text-muted-foreground">
              Безплатна доставка за поръчки над 100лв.
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign />
            <div className="text-sm font-bold">
              Гаранция за връщане на парите
            </div>
            <div className="text-sm text-muted-foreground">
              В рамките на 30 дни след покупката
            </div>
          </div>

          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">24/7 поддръжка</div>
            <div className="text-sm text-muted-foreground">
              Бърза и ефективна поддържка
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcommerceFeatures;
