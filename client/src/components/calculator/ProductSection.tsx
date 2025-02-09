import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { InsertCalculator } from "@shared/schema";

interface ProductSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function ProductSection({ onUpdate }: ProductSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-6">
        Calculate potential savings in product description management with AI
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="numberOfProducts">Number of Products (SKUs)</Label>
          <Input
            id="numberOfProducts"
            type="number"
            placeholder="e.g. 1000"
            onChange={(e) =>
              onUpdate({ numberOfProducts: parseInt(e.target.value) || 0 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descriptionUpdateTime">
            Minutes per Description Update
          </Label>
          <Input
            id="descriptionUpdateTime"
            type="number"
            placeholder="e.g. 30"
            onChange={(e) =>
              onUpdate({ descriptionUpdateTime: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Expected Time Savings with AI (%)</Label>
          <span className="text-sm text-muted-foreground" id="product-improvement">
            60%
          </span>
        </div>
        <Slider
          defaultValue={[60]}
          max={90}
          step={1}
          onValueChange={(value) => {
            onUpdate({ productImprovementPct: value[0] });
            const label = document.getElementById("product-improvement");
            if (label) label.textContent = `${value[0]}%`;
          }}
        />
        <p className="text-sm text-muted-foreground">
          AI-powered content generation can reduce product description creation time by 60-90%
        </p>
      </div>
    </div>
  );
}
