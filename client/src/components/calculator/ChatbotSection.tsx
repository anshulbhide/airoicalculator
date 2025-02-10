import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { InsertCalculator } from "@shared/schema";
import React from 'react';

interface ChatbotSectionProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}

export default function ChatbotSection({ onUpdate }: ChatbotSectionProps) {
  // Improvement percentage will be set based on industry

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-6">
        Integrate LLM-powered chatbots on your website to handle FAQs, product recommendations, and instant B2B inquiries—improving customer experience and lead capture.
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
              onUpdate({ costPerInquiry: e.target.value || "0" })
            }
          />
        </div>
      </div>


    </div>
  );
}