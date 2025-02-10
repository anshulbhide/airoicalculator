import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { InsertCalculator } from "@shared/schema";
import React from "react";

interface ProductSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function ProductSection({ onUpdate }: ProductSectionProps) {
  // Improvement percentage will be set based on industry

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-6">
        Use LLMs to generate or update product descriptions across multiple channels, ensuring consistency and SEO optimization.
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


    </div>
  );
}