import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InsertCalculator } from "@shared/schema";
import React, { useState, useEffect } from 'react';

interface EmailSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function EmailSection({ onUpdate }: EmailSectionProps) {
  const [emailImprovementPct, setEmailImprovementPct] = useState("20"); //default value

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
    onUpdate({ emailImprovementPct });
  }, [emailImprovementPct, onUpdate]);

  const handleIndustryChange = (value: string) => {
    setEmailImprovementPct(industrySavings[value] || "20"); //default to 20 if industry not found
    onUpdate({ industry: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-6">
        Use AI to automatically generate personalized emails for different customer segments, increasing open and click-through rates.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="emailListSize">Email List Size</Label>
          <Input
            id="emailListSize"
            type="number"
            placeholder="e.g. 10000"
            onChange={(e) =>
              onUpdate({ emailListSize: parseInt(e.target.value) || 0 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentOpenRate">Current Open Rate (%)</Label>
          <Input
            id="currentOpenRate"
            type="number"
            placeholder="e.g. 20"
            onChange={(e) =>
              onUpdate({ currentOpenRate: e.target.value || "0" })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentConversionRate">Current Conversion Rate (%)</Label>
          <Input
            id="currentConversionRate"
            type="number"
            placeholder="e.g. 2"
            onChange={(e) =>
              onUpdate({ currentConversionRate: e.target.value || "0" })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="averageOrderValue">Average Order Value ($)</Label>
          <Input
            id="averageOrderValue"
            type="number"
            placeholder="e.g. 100"
            onChange={(e) =>
              onUpdate({ averageOrderValue: e.target.value || "0" })
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