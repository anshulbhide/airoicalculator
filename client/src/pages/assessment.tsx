import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const questions = {
  organizationalReadiness: [
    {
      id: "leadershipAlignment",
      question: "How aligned is your leadership and organizational culture towards embracing AI?",
      options: [
        { value: "1", label: "Leadership is skeptical and reluctant to adopt AI" },
        { value: "2", label: "Some leaders are open, but overall culture is risk-averse" },
        { value: "3", label: "Leadership is supportive, though some internal resistance exists" },
        { value: "4", label: "Strong leadership commitment with a proactive, innovation-driven culture" },
      ],
    },
    {
      id: "llmExperimentation",
      question: "What is your level of experimentation with LLM use cases?",
      options: [
        { value: "1", label: "Haven't explored LLM use cases" },
        { value: "2", label: "Initial exploration phase; piloting a few ideas" },
        { value: "3", label: "Active experimentation with pilot projects underway" },
        { value: "4", label: "Multiple successful LLM implementations driving measurable value" },
      ],
    },
    {
      id: "useCaseVision",
      question: "What specific workflows or processes do you envision automating with LLMs?",
      options: [
        { value: "1", label: "No specific vision yet" },
        { value: "2", label: "Basic automation ideas identified" },
        { value: "3", label: "Clear vision with defined use cases" },
        { value: "4", label: "Comprehensive automation strategy" },
      ],
    },
  ],
  dataInfrastructure: [
    {
      id: "centralizedData",
      question: "Do you have a centralized data repository?",
      options: [
        { value: "1", label: "No centralized data storage" },
        { value: "2", label: "Some data is centralized" },
        { value: "3", label: "Most data is centralized" },
        { value: "4", label: "Fully centralized data infrastructure" },
      ],
    },
    {
      id: "dataQuality",
      question: "How clean and integrated is your customer data?",
      options: [
        { value: "1", label: "Data is scattered and inconsistent" },
        { value: "2", label: "Basic data organization" },
        { value: "3", label: "Well-organized with some integration" },
        { value: "4", label: "Fully integrated and maintained" },
      ],
    },
  ],
  processAutomation: [
    {
      id: "manualTasks",
      question: "Which manual tasks would benefit from automation?",
      options: [
        { value: "1", label: "Most tasks are manual" },
        { value: "2", label: "Some basic automation" },
        { value: "3", label: "Significant automation in place" },
        { value: "4", label: "Highly automated processes" },
      ],
    },
    {
      id: "workflows",
      question: "Do you have standardized workflows?",
      options: [
        { value: "1", label: "No standardized workflows" },
        { value: "2", label: "Some workflows documented" },
        { value: "3", label: "Most workflows standardized" },
        { value: "4", label: "Fully standardized and optimized" },
      ],
    },
  ],
  techCapabilities: [
    {
      id: "digitalTools",
      question: "What percentage of your processes are supported by digital tools?",
      options: [
        { value: "1", label: "Less than 25%" },
        { value: "2", label: "25-50%" },
        { value: "3", label: "50-75%" },
        { value: "4", label: "Over 75%" },
      ],
    },
    {
      id: "apiIntegration",
      question: "Do you leverage APIs and modern integrations?",
      options: [
        { value: "1", label: "No API usage" },
        { value: "2", label: "Limited API integration" },
        { value: "3", label: "Multiple API integrations" },
        { value: "4", label: "Extensive API ecosystem" },
      ],
    },
  ],
};

const formSchema = z.object({
  ...Object.entries(questions).reduce((acc, [section, sectionQuestions]) => {
    sectionQuestions.forEach((q) => {
      acc[q.id] = z.string();
    });
    return acc;
  }, {} as Record<string, z.ZodString>)
});

type FormSchema = z.infer<typeof formSchema>;

// Ensure all form fields are filled before allowing submission
const isFormValid = (data: FormSchema) => {
  return Object.values(data).every(value => value !== "");
};

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
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const searchParams = new URLSearchParams(window.location.search);
      const calculatorId = searchParams.get('calculatorId');
      
      // Map the numeric values to their text labels
      const mappedResponses = Object.entries(data).reduce((acc, [key, value]) => {
        const question = Object.values(questions).flat().find(q => q.id === key);
        const selectedOption = question?.options.find(opt => opt.value === value);
        acc[key] = selectedOption?.label || value;
        return acc;
      }, {} as Record<string, string>);

      const response = await apiRequest("POST", "/api/assessment/analyze", { 
        responses: mappedResponses, 
        calculatorId: calculatorId ? parseInt(calculatorId) : undefined 
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
    defaultValues: Object.entries(questions).reduce((acc, [section, sectionQuestions]) => {
      sectionQuestions.forEach((q) => {
        acc[q.id] = "";
      });
      return acc;
    }, {} as Record<string, string>),
  });

  const progress = ((currentSection + 1) / sections.length) * 100;

  const onSubmit = (data: FormValues) => {
    if (!isFormValid(data)) {
      toast({
        title: "Please complete all sections",
        description: "Make sure to fill out all questions before submitting.",
        variant: "destructive",
      });
      return;
    }
    analyzeMutation.mutate(data);
  };

  const currentQuestions = questions[sections[currentSection] as keyof typeof questions];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Gen AI Readiness Assessment</h1>
          <p className="text-lg text-muted-foreground">
            Evaluate your organization's readiness for AI adoption
          </p>
        </div>

        {!analysisResult ? (
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold capitalize">
                  {sections[currentSection].replace(/([A-Z])/g, " $1").trim()}
                </h2>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Section {currentSection + 1} of {sections.length}
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                </form>
              </Form>
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

              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={() => setAnalysisResult(null)}>
                  Retake Assessment
                </Button>
                <Button size="lg" variant="outline" onClick={() => (window.location.href = "/")}>
                  Return to Calculator
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}