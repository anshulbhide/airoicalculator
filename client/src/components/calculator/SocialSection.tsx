import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InsertCalculator } from "@shared/schema";
import React, { useState, useEffect } from 'react';

interface SocialSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function SocialSection({ onUpdate }: SocialSectionProps) {
  const [socialImprovementPct, setSocialImprovementPct] = useState("20"); //default value

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
    onUpdate({ socialImprovementPct });
  }, [socialImprovementPct, onUpdate]);

  const handleIndustryChange = (value: string) => {
    setSocialImprovementPct(industrySavings[value] || "20"); //default to 20 if industry not found
    onUpdate({ industry: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-6">
        Deploy LLMs to craft engaging social media posts and ad copies tailored to both direct consumers and wholesale buyers.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="monthlyContentSpend">Monthly Content Creation Budget ($)</Label>
          <Input
            id="monthlyContentSpend"
            type="number"
            placeholder="e.g. 5000"
            onChange={(e) =>
              onUpdate({ monthlyContentSpend: e.target.value || "0" })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contentCreationHours">Monthly Hours Spent on Content</Label>
          <Input
            id="contentCreationHours"
            type="number"
            placeholder="e.g. 40"
            onChange={(e) =>
              onUpdate({ contentCreationHours: parseInt(e.target.value) || 0 })
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