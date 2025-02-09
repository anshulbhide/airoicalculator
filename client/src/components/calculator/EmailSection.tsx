import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { InsertCalculator } from "@shared/schema";

interface EmailSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function EmailSection({ onUpdate }: EmailSectionProps) {
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

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Expected Improvement with AI (%)</Label>
          <span className="text-sm text-muted-foreground" id="improvement-value">
            15%
          </span>
        </div>
        <Slider
          defaultValue={[15]}
          max={30}
          step={1}
          onValueChange={(value) => {
            onUpdate({ emailImprovementPct: value[0].toString() });
            const label = document.getElementById("improvement-value");
            if (label) label.textContent = `${value[0]}%`;
          }}
        />
        <p className="text-sm text-muted-foreground">
          Based on industry averages, AI-powered email campaigns typically see 10-30% improvement in conversion rates
        </p>
      </div>
    </div>
  );
}