import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InsertCalculator } from "@shared/schema";
import React, { useState, useEffect } from 'react';

interface ProductSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function ProductSection({ onUpdate }: ProductSectionProps) {
  const [productImprovementPct, setProductImprovementPct] = useState("20"); //default value

  const industrySavings: { [key: string]: string } = {
    "Retail": "20",
    "E-commerce": "25",
    "Technology": "32.5",
    "Manufacturing": "15",
    "Healthcare": "22.5",
    "Education": "25",
    "Financial Services": "20",
    "Professional Services": "32.5",
    "Other": "20"
  };

  useEffect(() => {
    onUpdate({ productImprovementPct });
  }, [productImprovementPct, onUpdate]);

  const handleIndustryChange = (value: string) => {
    setProductImprovementPct(industrySavings[value] || "20"); //default to 20 if industry not found
    onUpdate({ industry: value });
  };

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

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select onValueChange={handleIndustryChange}>
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="E-commerce">E-commerce</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Financial Services">Financial Services</SelectItem>
              <SelectItem value="Professional Services">Professional Services</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}