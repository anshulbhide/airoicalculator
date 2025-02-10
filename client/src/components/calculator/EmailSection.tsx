import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InsertCalculator } from "@shared/schema";
import React, { useState, useEffect } from 'react';

interface EmailSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function EmailSection({ onUpdate }: EmailSectionProps) {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [emailImprovementPct, setEmailImprovementPct] = useState("20"); //default value

  const industrySavings = {
    "Retail": "20",
    "Ecommerce": "25",
    "Tech": "32.5",
    "Manufacturing": "15",
    "Healthcare": "22.5",
    "Education": "25",
    "Financial Services": "20",
    "Professional Services": "32.5"
  };


  useEffect(() => {
    onUpdate({ emailImprovementPct });
  }, [emailImprovementPct, onUpdate]);

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndustry = e.target.value;
    setSelectedIndustry(selectedIndustry);
    setEmailImprovementPct(industrySavings[selectedIndustry] || "20"); //default to 20 if industry not found
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-6">
        Input your current email marketing metrics to calculate potential AI-driven improvements
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
              <SelectItem value="">Select Industry</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Ecommerce">Ecommerce</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Financial Services">Financial Services</SelectItem>
              <SelectItem value="Professional Services">Professional Services</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


    </div>
  );
}