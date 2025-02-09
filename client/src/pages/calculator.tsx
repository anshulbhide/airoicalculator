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

export default function Calculator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<InsertCalculator>>({});
  
  const mutation = useMutation({
    mutationFn: async (data: InsertCalculator) => {
      const res = await apiRequest("POST", "/api/calculator", data);
      return res.json();
    },
    onSuccess: (data) => {
      setLocation(`/results/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save calculator data",
        variant: "destructive"
      });
    }
  });

  const updateFormData = (data: Partial<InsertCalculator>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    if (!formData.companyName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill out company details first",
        variant: "destructive"
      });
      return;
    }
    mutation.mutate(formData as InsertCalculator);
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

        <div className="flex justify-end">
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
