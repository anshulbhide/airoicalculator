import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { InsertCalculator } from "@shared/schema";
import React from "react";

interface ProductSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function ProductSection({ onUpdate }: ProductSectionProps) {
  // Set fixed 20% improvement when component mounts
  React.useEffect(() => {
    onUpdate({ productImprovementPct: "20" });
  }, [onUpdate]);

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

      <p className="text-sm text-muted-foreground">
        AI-powered content generation can reduce product description creation time by 20%
      </p>
    </div>
  );
}