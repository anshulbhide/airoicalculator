import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailSection from "@/components/calculator/EmailSection";
import SocialSection from "@/components/calculator/SocialSection";
import ChatbotSection from "@/components/calculator/ChatbotSection";
import ProductSection from "@/components/calculator/ProductSection";
import LeadForm from "@/components/calculator/LeadForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InsertCalculator } from "@shared/schema";
import { RotateCcw } from "lucide-react";

// Initial form state
const initialFormState: Partial<InsertCalculator> = {
  emailListSize: 0,
  currentOpenRate: "0",
  currentConversionRate: "0",
  averageOrderValue: "0",
  monthlyContentSpend: "0",
  contentCreationHours: 0,
  monthlyVisitors: 0,
  supportTicketVolume: 0,
  costPerInquiry: "0",
  numberOfProducts: 0,
  descriptionUpdateTime: 0,
  emailImprovementPct: "15",
  socialImprovementPct: "40",
  chatbotImprovementPct: "50",
  productImprovementPct: "60"
};

export default function Calculator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<InsertCalculator>>(initialFormState);

  const mutation = useMutation({
    mutationFn: async (data: InsertCalculator) => {
      console.log("Submitting data:", data);
      const res = await apiRequest("POST", "/api/calculator", data);
      return res.json();
    },
    onSuccess: (data) => {
      setLocation(`/results/${data.id}`);
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Failed to save calculator data. Please make sure all fields are filled.",
        variant: "destructive"
      });
    }
  });

  const updateFormData = (data: Partial<InsertCalculator>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleReset = () => {
    setFormData(initialFormState);
    toast({
      title: "Reset Complete",
      description: "All calculator inputs have been cleared."
    });
  };

  const handleSubmit = () => {
    if (!formData.companyName || !formData.email || !formData.industry) {
      toast({
        title: "Missing Information",
        description: "Please fill out company details first",
        variant: "destructive"
      });
      return;
    }

    const submitData = {
      ...formData,
      currentOpenRate: formData.currentOpenRate || "0",
      currentConversionRate: formData.currentConversionRate || "0",
      averageOrderValue: formData.averageOrderValue || "0",
      monthlyContentSpend: formData.monthlyContentSpend || "0",
      costPerInquiry: formData.costPerInquiry || "0",
      emailImprovementPct: formData.emailImprovementPct || "15",
      socialImprovementPct: formData.socialImprovementPct || "40",
      chatbotImprovementPct: formData.chatbotImprovementPct || "50",
      productImprovementPct: formData.productImprovementPct || "60",
    } as InsertCalculator;

    console.log("Form data before submission:", submitData);
    mutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Solutions ROI Calculator
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover the potential impact of AI on your business across four key areas
          </p>
        </div>

        <LeadForm onUpdate={updateFormData} />

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="email" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="email">Email Campaigns</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
                <TabsTrigger value="product">Product Descriptions</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <EmailSection onUpdate={updateFormData} />
              </TabsContent>

              <TabsContent value="social">
                <SocialSection onUpdate={updateFormData} />
              </TabsContent>

              <TabsContent value="chatbot">
                <ChatbotSection onUpdate={updateFormData} />
              </TabsContent>

              <TabsContent value="product">
                <ProductSection onUpdate={updateFormData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Start Over
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            Calculate ROI
          </Button>
        </div>
      </div>
    </div>
  );
}