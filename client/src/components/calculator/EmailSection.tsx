import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { InsertCalculator } from "@shared/schema";
import React, {useEffect} from 'react';

interface EmailSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function EmailSection({ onUpdate }: EmailSectionProps) {
  // Set fixed 20% improvement when component mounts
  useEffect(() => {
    onUpdate({ emailImprovementPct: "20" });
  }, [onUpdate]);

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
      </div>

      
    </div>
  );
}