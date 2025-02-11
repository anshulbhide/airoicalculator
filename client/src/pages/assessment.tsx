
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Assessment() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Gen AI Readiness Assessment</h1>
          <p className="text-lg text-muted-foreground">
            Evaluate your organization's readiness for AI adoption
          </p>
        </div>

        <Card className="p-6">
          <p className="text-center text-lg mb-8">
            Coming soon! Our comprehensive AI readiness assessment will help you:
          </p>
          <ul className="space-y-4 list-disc pl-6 mb-8">
            <li>Evaluate your data infrastructure</li>
            <li>Assess your team's AI capabilities</li>
            <li>Identify key opportunity areas</li>
            <li>Get personalized recommendations</li>
          </ul>
          <div className="flex justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/'}
            >
              Return to Calculator
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
