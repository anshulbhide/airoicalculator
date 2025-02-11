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

const questions = {
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

const formSchema = z.object(
  Object.entries(questions).reduce((acc, [section, sectionQuestions]) => {
    sectionQuestions.forEach((q) => {
      acc[q.id] = z.string();
    });
    return acc;
  }, {} as Record<string, z.ZodString>)
);

type FormValues = z.infer<typeof formSchema>;

const sections = Object.keys(questions);

export default function Assessment() {
  const [currentSection, setCurrentSection] = useState(0);

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
    // Calculate scores and generate recommendations
    console.log(data);
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

        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold capitalize">
                {sections[currentSection].replace(/([A-Z])/g, ' $1').trim()}
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
                    onClick={() => setCurrentSection(current => Math.max(0, current - 1))}
                    disabled={currentSection === 0}
                  >
                    Previous
                  </Button>
                  {currentSection < sections.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentSection(current => Math.min(sections.length - 1, current + 1))}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit">
                      Submit Assessment
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}