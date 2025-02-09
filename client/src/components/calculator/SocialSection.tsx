import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { InsertCalculator } from "@shared/schema";
import React from "react";

interface SocialSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function SocialSection({ onUpdate }: SocialSectionProps) {
  // Set fixed 20% improvement when component mounts
  React.useEffect(() => {
    onUpdate({ socialImprovementPct: "20" });
  }, [onUpdate]);

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-6">
        Calculate potential savings in social media content creation with AI assistance
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
      </div>

      <p className="text-sm text-muted-foreground">
        Our AI-powered content creation tools reduce content creation time and costs by 20%
      </p>
    </div>
  );
}