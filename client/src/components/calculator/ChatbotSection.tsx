import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { InsertCalculator } from "@shared/schema";

interface ChatbotSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function ChatbotSection({ onUpdate }: ChatbotSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-6">
        Estimate cost savings from implementing AI chatbots for customer support
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="monthlyVisitors">Monthly Website Visitors</Label>
          <Input
            id="monthlyVisitors"
            type="number"
            placeholder="e.g. 50000"
            onChange={(e) =>
              onUpdate({ monthlyVisitors: parseInt(e.target.value) || 0 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supportTicketVolume">Monthly Support Tickets</Label>
          <Input
            id="supportTicketVolume"
            type="number"
            placeholder="e.g. 500"
            onChange={(e) =>
              onUpdate({ supportTicketVolume: parseInt(e.target.value) || 0 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPerInquiry">Cost per Support Ticket ($)</Label>
          <Input
            id="costPerInquiry"
            type="number"
            placeholder="e.g. 15"
            onChange={(e) =>
              onUpdate({ costPerInquiry: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Expected Resolution Rate with AI (%)</Label>
          <span className="text-sm text-muted-foreground" id="chatbot-improvement">
            50%
          </span>
        </div>
        <Slider
          defaultValue={[50]}
          max={80}
          step={1}
          onValueChange={(value) => {
            onUpdate({ chatbotImprovementPct: value[0] });
            const label = document.getElementById("chatbot-improvement");
            if (label) label.textContent = `${value[0]}%`;
          }}
        />
        <p className="text-sm text-muted-foreground">
          AI chatbots can handle 50-80% of routine customer inquiries automatically
        </p>
      </div>
    </div>
  );
}
