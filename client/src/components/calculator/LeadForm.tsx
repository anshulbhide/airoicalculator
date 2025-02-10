import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InsertCalculator } from "@shared/schema";

interface LeadFormProps {
  onUpdate: (data: Partial<InsertCalculator>) => void;
}



export default function LeadForm({ onUpdate }: LeadFormProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Enter your company name"
              onChange={(e) => onUpdate({ companyName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Business Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              onChange={(e) => onUpdate({ email: e.target.value })}
            />
          </div>

          
        </div>
      </CardContent>
    </Card>
  );
}