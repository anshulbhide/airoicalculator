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
import { Download, RotateCcw, Calendar, Calculator } from 'lucide-react'; // Assuming these icons are from lucide-react
import React from 'react';

const questions = {
  dataReadiness: [
    {
      id: "dataStrategy",
      question: "Do you have a clear data strategy and governance framework?",
      options: [
        { value: "1", label: "No formal data strategy or governance" },
        { value: "2", label: "Basic data policies in place" },
        { value: "3", label: "Comprehensive data strategy but gaps in implementation" },
        { value: "4", label: "Well-defined and implemented data strategy and governance" }
      ]
    },
    {
      id: "dataQuality",
      question: "How would you rate your data quality and accessibility?",
      options: [
        { value: "1", label: "Poor data quality, difficult to access" },
        { value: "2", label: "Inconsistent quality, limited accessibility" },
        { value: "3", label: "Good quality but some silos exist" },
        { value: "4", label: "High-quality, easily accessible data" }
      ]
    }
  ],
  technicalCapability: [
    {
      id: "infrastructure",
      question: "How mature is your technical infrastructure?",
      options: [
        { value: "1", label: "Basic/legacy systems" },
        { value: "2", label: "Mix of modern and legacy systems" },
        { value: "3", label: "Mostly modern, cloud-based systems" },
        { value: "4", label: "Fully modernized, cloud-native infrastructure" }
      ]
    },
    {
      id: "aiExperience",
      question: "What is your organization's experience with AI/ML?",
      options: [
        { value: "1", label: "No experience" },
        { value: "2", label: "Limited pilot projects" },
        { value: "3", label: "Several successful implementations" },
        { value: "4", label: "Advanced AI/ML capabilities" }
      ]
    }
  ],
  businessAlignment: [
    {
      id: "strategy",
      question: "How well-defined are your AI use cases and success metrics?",
      options: [
        { value: "1", label: "No clear use cases identified" },
        { value: "2", label: "Basic use cases, no metrics" },
        { value: "3", label: "Well-defined cases, basic metrics" },
        { value: "4", label: "Clear cases with comprehensive metrics" }
      ]
    },
    {
      id: "budget",
      question: "Do you have dedicated budget and resources for AI initiatives?",
      options: [
        { value: "1", label: "No dedicated resources" },
        { value: "2", label: "Limited budget allocation" },
        { value: "3", label: "Moderate budget and resources" },
        { value: "4", label: "Significant investment committed" }
      ]
    }
  ],
  peopleAndProcesses: [
    {
      id: "skills",
      question: "How would you rate your team's AI/ML skills and expertise?",
      options: [
        { value: "1", label: "No relevant skills" },
        { value: "2", label: "Basic understanding" },
        { value: "3", label: "Good expertise in some areas" },
        { value: "4", label: "Strong expertise across team" }
      ]
    },
    {
      id: "changeManagement",
      question: "How effective is your change management process?",
      options: [
        { value: "1", label: "No formal process" },
        { value: "2", label: "Basic change management" },
        { value: "3", label: "Structured process with some gaps" },
        { value: "4", label: "Comprehensive change management" }
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

                  <div className="space-y-4 mt-8">
                    <h3 className="text-lg font-semibold">Additional Information</h3>
                    <FormField
                      control={form.control}
                      name="useCaseVision"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What specific workflows or processes do you envision automating with LLMs?</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Describe your automation goals and use cases..."
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
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