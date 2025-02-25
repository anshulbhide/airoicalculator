import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Download, RotateCcw, Calendar, Calculator } from 'lucide-react';
import React from 'react';

const questions = {
  companyContext: [
    {
      id: "companyDescription",
      question: "Write 2-3 lines about your company and who your customers are.",
      type: "textarea"
    },
    {
      id: "coreOfferings",
      question: "Core Offerings or Business Model",
      options: [
        { value: "productSales", label: "Product Sales" },
        { value: "subscription", label: "Subscription Service" },
        { value: "consulting", label: "Consulting/Services" },
        { value: "marketplace", label: "Marketplace/Platform" }
      ]
    }
  ],
  businessGoal: [
    {
      id: "aiPriority",
      question: "What is your top priority for AI implementation?",
      options: [
        { value: "customerSupport", label: "Improving customer support" },
        { value: "workflows", label: "Streamlining internal workflows" },
        { value: "marketing", label: "Enhancing marketing & personalization" },
        { value: "costs", label: "Reducing operational costs" },
        { value: "revenue", label: "Generating new revenue streams" },
        { value: "other", label: "Other" }
      ],
      hasOther: true
    }
  ],
  useCases: [
    {
      id: "relevantUseCases",
      question: "Which of these use cases are most appealing or relevant?",
      type: "multiselect",
      options: [
        { value: "chatbots", label: "Automated customer-service chatbots" },
        { value: "recommendations", label: "Content or product recommendation" },
        { value: "documents", label: "Document processing & summarization" },
        { value: "sales", label: "Sales enablement" },
        { value: "analytics", label: "Intelligent analytics" },
        { value: "hr", label: "HR & recruitment automation" },
        { value: "other", label: "Other" }
      ],
      hasOther: true
    }
  ],
  dataAvailability: [
    {
      id: "availableData",
      question: "Which types of data do you have readily available?",
      type: "multiselect",
      options: [
        { value: "customerInteractions", label: "Customer interaction logs" },
        { value: "transactions", label: "Transaction/sales data" },
        { value: "product", label: "Product or inventory data" },
        { value: "marketing", label: "Marketing content and/or user behavior data" },
        { value: "hr", label: "HR or internal documents" },
        { value: "none", label: "None or limited data" }
      ]
    },
    {
      id: "dataQuality",
      question: "How well-structured and accessible is your data?",
      options: [
        { value: "highly", label: "Highly structured and organized" },
        { value: "somewhat", label: "Somewhat organized, but multiple sources" },
        { value: "unstructured", label: "Mostly unstructured or scattered across departments" },
        { value: "limited", label: "Limited data or not sure" }
      ]
    }
  ],
  techMaturity: [
    {
      id: "aiTools",
      question: "Are you already using any AI tools or advanced analytics?",
      options: [
        { value: "inhouse", label: "Yes, we have in-house AI/ML tools" },
        { value: "thirdParty", label: "We use some third-party AI services" },
        { value: "experimental", label: "We have experimented, but no formal deployment" },
        { value: "none", label: "No AI usage yet" }
      ]
    }
  ],
  budget: [
    {
      id: "budgetView",
      question: "How do you view your budget for AI initiatives?",
      options: [
        { value: "significant", label: "Significant investment is possible" },
        { value: "moderate", label: "Moderate budget—looking for high ROI" },
        { value: "limited", label: "Limited budget—must be cost-effective" },
        { value: "uncertain", label: "Uncertain or exploratory" }
      ]
    }
  ]
};

const formSchema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  ...Object.entries(questions).reduce((acc, [section, sectionQuestions]) => {
    sectionQuestions.forEach((q) => {
      acc[q.id] = z.string();
    });
    return acc;
  }, {} as Record<string, z.ZodString>),
  useCaseVision: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type AnalysisResult = {
  overall_score: number;
  readiness_level: string;
  dimension_scores: {
    data_infrastructure: number;
    process_automation: number;
    tech_capabilities: number;
  };
  key_strengths: string[];
  improvement_areas: string[];
  recommendations: string[];
};

const sections = Object.keys(questions);

export default function Assessment() {
  const [currentSection, setCurrentSection] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [calculatorId, setCalculatorId] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string>("");
  const { toast } = useToast();

  // Get calculatorId from URL when component mounts
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("calculatorId");
    setCalculatorId(id);
  }, []);

  const analyzeMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const mappedResponses = Object.entries(data).reduce((acc, [key, value]) => {
        const question = Object.values(questions).flat().find((q) => q.id === key);
        const selectedOption = question?.options.find((opt) => opt.value === value);
        acc[key] = selectedOption?.label || value;
        return acc;
      }, {} as Record<string, string>);

      const response = await apiRequest("POST", "/api/assessment/analyze", {
        responses: mappedResponses,
        calculatorId: calculatorId ? parseInt(calculatorId) : undefined,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Assessment Complete",
        description: "Your AI readiness analysis is ready!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to analyze assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      ...Object.entries(questions).reduce((acc, [section, sectionQuestions]) => {
        sectionQuestions.forEach((q) => {
          acc[q.id] = "";
        });
        return acc;
      }, {} as Record<string, string>),
      useCaseVision: "",
    },
  });

  const progress = ((currentSection + 1) / sections.length) * 100;

  const onSubmit = (data: FormValues) => {
    if (!form.formState.isSubmitted) return;

    const currentSectionQuestions = questions[sections[currentSection] as keyof typeof questions];
    const currentSectionFields = currentSectionQuestions.map((q) => q.id);
    const isCurrentSectionValid = currentSectionFields.every((field) => data[field as keyof FormValues] !== "");

    if (currentSection === sections.length - 1) {
      if (!isFormValid(data)) {
        toast({
          title: "Please complete all sections",
          description: "Make sure to fill out all questions before submitting.",
          variant: "destructive",
        });
        return;
      }
      analyzeMutation.mutate(data);
    } else if (!isCurrentSectionValid) {
      toast({
        title: "Please complete current section",
        description: "Make sure to answer all questions in this section.",
        variant: "destructive",
      });
      return;
    }
  };

  const currentQuestions = questions[sections[currentSection] as keyof typeof questions];

  // Add function to handle calculator navigation
  const navigateToCalculator = () => {
    window.location.href = "/calculator";
  };

  // Add function to handle calendar scrolling
  const scrollToCalendly = () => {
    document.getElementById("calendly-widget")?.scrollIntoView({ behavior: "smooth" });
  };

  // Ensure all form fields are filled before allowing submission
  const isFormValid = (data: FormValues) => {
    const requiredFields = Object.entries(questions).flatMap(([_, sectionQuestions]) =>
      sectionQuestions.map((q) => q.id)
    );
    return requiredFields.every((field) => data[field as keyof FormValues] !== "");
  };


  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">AI Readiness Assessment</h1>
          <p className="text-lg text-muted-foreground">
            Evaluate your organization's readiness for AI adoption
          </p>
        </div>

        {!analysisResult ? (
          <Card className="p-6">
            <div className="space-y-6">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Your Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="E-commerce">E-commerce</SelectItem>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Financial Services">Financial Services</SelectItem>
                            <SelectItem value="Professional Services">Professional Services</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {currentQuestions.map((q) => (
                    <FormField
                      key={q.id}
                      control={form.control}
                      name={q.id}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{q.question}</FormLabel>
                          {q.type === "textarea" ? (
                            <FormControl>
                              <textarea
                                {...field}
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Your answer here..."
                              />
                            </FormControl>
                          ) : q.type === "multiselect" ? (
                            <FormControl>
                              <div>
                                {q.options.map((option) => (
                                  <label key={option.value} className="flex items-center space-x-2">
                                    <input type="checkbox" {...field} value={option.value} />
                                    {option.label}
                                  </label>
                                ))}
                                {q.hasOther && (
                                  <div>
                                    <label className="flex items-center space-x-2">
                                      <input type="checkbox" {...field} value="other" />Other:
                                    </label>
                                    <input type="text" {...field} className="ml-2" />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                          ) : (
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-2"
                              >
                                {q.options.map((option) => (
                                  <FormItem
                                    key={option.value}
                                    className="flex items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <RadioGroupItem value={option.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentSection((current) => Math.max(0, current - 1))}
                      disabled={currentSection === 0}
                    >
                      Previous
                    </Button>
                    {currentSection < sections.length - 1 ? (
                      <Button
                        type="button"
                        onClick={() => setCurrentSection((current) => Math.min(sections.length - 1, current + 1))}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" disabled={analyzeMutation.isPending}>
                        {analyzeMutation.isPending ? "Analyzing..." : "Submit Assessment"}
                      </Button>
                    )}
                  </div>

                  
                </form>
              </FormProvider>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Your AI Readiness Score: {analysisResult.overall_score}%</h2>
                <p className="text-xl text-primary">{analysisResult.readiness_level}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Data Infrastructure</h3>
                  <div className="text-2xl text-primary">{analysisResult.dimension_scores.data_infrastructure}%</div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Process Automation</h3>
                  <div className="text-2xl text-primary">{analysisResult.dimension_scores.process_automation}%</div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Tech Capabilities</h3>
                  <div className="text-2xl text-primary">{analysisResult.dimension_scores.tech_capabilities}%</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Strengths</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysisResult.key_strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Areas for Improvement</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysisResult.improvement_areas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  size="lg"
                  onClick={() => calculatorId && window.open(`/api/report/${calculatorId}`, '_blank')}
                  disabled={!calculatorId}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Report
                </Button>
                <Button
                  size="lg"
                  onClick={() => setAnalysisResult(null)}
                  variant="outline"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToCalendly}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule a Workshop
                </Button>
                <Button
                  size="lg"
                  onClick={navigateToCalculator}
                  variant="outline"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate ROI
                </Button>
              </div>

              {/* Add Calendly widget */}
              <div id="calendly-widget" className="mt-12">
                <div
                  className="calendly-inline-widget"
                  data-url="https://calendly.com/your-calendar-url/30min?hide_event_type_details=1&hide_gdpr_banner=1"
                  style={{ minWidth: 320, height: 700 }}
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}