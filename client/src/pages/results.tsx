import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ResultsChart from "@/components/calculator/ResultsChart";
import { Download, Mail, RotateCcw } from "lucide-react";
import type { Calculator, Results } from "@shared/schema";

export default function Results() {
  const { id } = useParams();
  const scrollToCalendly = () => {
    document.getElementById('calendly-widget')?.scrollIntoView({ behavior: 'smooth' });
  };

  const { data: calculator } = useQuery<Calculator>({
    queryKey: [`/api/calculator/${id}`],
    enabled: !!id
  });

  const { data: results } = useQuery<Results>({
    queryKey: [`/api/results/${id}`],
    enabled: !!id
  });

  if (!calculator || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Your AI ROI Analysis</h1>
          <p className="text-lg text-muted-foreground">
            Here's how much money adopting a Gen AI Solution could save {calculator.companyName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                ${parseFloat(results.emailRevenue).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Additional Annual Revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Media Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                ${parseFloat(results.socialSavings).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Annual Cost Reduction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chatbot Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                ${parseFloat(results.chatbotSavings).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Annual Support Savings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Description Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                ${parseFloat(results.productSavings).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Annual Content Savings</p>
            </CardContent>
          </Card>
        </div>

        <Card className="p-6">
          <ResultsChart results={results} />
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold">
                  ${parseFloat(results.totalBenefits).toLocaleString()}
                </h3>
                <p className="text-muted-foreground">Total Annual Benefits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={() => window.open(`/api/report/${id}`, '_blank')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Full Report
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToCalendly}
          >
            <span className="mr-2">🕐</span>
            Schedule a Workshop
          </Button>
          <Link href={`/assessment?calculatorId=${id}`}>
            <Button size="lg" variant="outline">
              <span className="mr-2">📋</span>
              Take AI Readiness Assessment
            </Button>
          </Link>
        </div>

        <div id="calendly-widget" className="mt-12">
          <div className="calendly-inline-widget" data-url="https://calendly.com/anshulbhide/30min?hide_event_type_details=1&hide_gdpr_banner=1" style={{minWidth: 320, height: 700}}></div>
        </div>
      </div>
    </div>
  );
}