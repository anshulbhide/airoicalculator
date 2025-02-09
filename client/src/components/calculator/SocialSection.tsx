import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { InsertCalculator } from "@shared/schema";

interface SocialSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function SocialSection({ onUpdate }: SocialSectionProps) {
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

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Expected Efficiency Improvement (%)</Label>
          <span className="text-sm text-muted-foreground" id="social-improvement">
            40%
          </span>
        </div>
        <Slider
          defaultValue={[40]}
          max={70}
          step={1}
          onValueChange={(value) => {
            onUpdate({ socialImprovementPct: value[0].toString() });
            const label = document.getElementById("social-improvement");
            if (label) label.textContent = `${value[0]}%`;
          }}
        />
        <p className="text-sm text-muted-foreground">
          AI-powered content creation tools typically reduce content creation time and costs by 40-70%
        </p>
      </div>
    </div>
  );
}