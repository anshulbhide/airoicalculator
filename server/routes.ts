import dotenv from 'dotenv';
dotenv.config();
import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { Client } from "langsmith";
import { getEnvironmentVariables } from "langsmith/utils";
// Initialize LangSmith client
const client = new Client();

import { insertCalculatorSchema } from "@shared/schema";
import PDFDocument from "pdfkit";
import { 
  calculateEmailRevenue,
  calculateSocialSavings,
  calculateChatbotSavings,
  calculateProductSavings,
  calculateROI,
  calculatePaybackPeriod,
  getImprovementPercentage
} from "@shared/calculations";
import { OpenAI } from "openai";
import { traceable } from "langsmith/traceable";
import { wrapOpenAI } from "langsmith/wrappers";

const LANGSMITH_TRACING = true;
const LANGSMITH_ENDPOINT = "https://api.smith.langchain.com";
const LANGSMITH_API_KEY = process.env['LANGSMITH_API_KEY'];
const LANGSMITH_PROJECT = "airoicalculator";
const OPENAI_API_KEY = process.env['OPENAI_API_KEY'];

// part of langchain trace
const OpenAIClient = wrapOpenAI(new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}));

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function registerRoutes(app: Express) {
  app.post("/api/calculator", async (req, res) => {
    try {
      console.log("Received calculator data:", req.body); // Debug log
      const inputs = insertCalculatorSchema.parse(req.body);
      const calculator = await storage.saveCalculatorInputs(inputs);

      const improvementPct = getImprovementPercentage(inputs.industry);
      inputs.emailImprovementPct = improvementPct.toString();
      inputs.socialImprovementPct = improvementPct.toString();
      inputs.chatbotImprovementPct = improvementPct.toString();
      inputs.productImprovementPct = improvementPct.toString();

      // Calculate all the results
      const emailRevenue = calculateEmailRevenue(
        inputs.emailListSize,
        parseFloat(inputs.currentConversionRate),
        parseFloat(inputs.averageOrderValue),
        parseFloat(inputs.emailImprovementPct)
      );

      const socialSavings = calculateSocialSavings(
        parseFloat(inputs.monthlyContentSpend),
        inputs.contentCreationHours,
        parseFloat(inputs.socialImprovementPct)
      );

      const chatbotSavings = calculateChatbotSavings(
        inputs.supportTicketVolume,
        parseFloat(inputs.costPerInquiry),
        parseFloat(inputs.chatbotImprovementPct)
      );

      const productSavings = calculateProductSavings(
        inputs.numberOfProducts,
        inputs.descriptionUpdateTime,
        parseFloat(inputs.productImprovementPct)
      );

      const totalBenefits = emailRevenue + socialSavings + chatbotSavings + productSavings;
      const roi = calculateROI(totalBenefits);
      const paybackMonths = calculatePaybackPeriod(totalBenefits);

      console.log("Saving results:", {
        calculatorId: calculator.id,
        emailRevenue,
        socialSavings,
        chatbotSavings,
        productSavings,
        totalBenefits,
        roi,
        paybackMonths
      }); // Debug log

      // Save results
      const results = await storage.saveResults({
        calculatorId: calculator.id,
        emailRevenue: emailRevenue.toFixed(2),
        socialSavings: socialSavings.toFixed(2),
        chatbotSavings: chatbotSavings.toFixed(2),
        productSavings: productSavings.toFixed(2),
        totalBenefits: totalBenefits.toFixed(2),
        roi: roi.toFixed(2),
        paybackMonths: paybackMonths.toFixed(2)
      });

      res.json({ id: calculator.id });

    } catch (error) {
      console.error("Error processing calculator:", error); // Debug log
      res.status(400).json({ error: "Invalid input data", details: error });
    }
  });

  app.get("/api/calculator/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const calculator = await storage.getCalculatorById(id);
      if (!calculator) {
        return res.status(404).json({ error: "Calculator not found" });
      }
      res.json(calculator);
    } catch (error) {
      console.error("Error fetching calculator:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/results/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const results = await storage.getResultsById(id);
      if (!results) {
        return res.status(404).json({ error: "Results not found" });
      }
      res.json(results);
    } catch (error) {
      console.error("Error fetching results:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/report/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const calculator = await storage.getCalculatorById(id);
      const results = await storage.getResultsById(id);

      if (!calculator || !results) {
        return res.status(404).json({ error: "Data not found" });
      }

      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      doc.pipe(res);

      // Generate PDF report
      doc.fontSize(25).text("AI ROI Calculator Results", 100, 80);
      doc.fontSize(12);

      doc.text(`Company: ${calculator.companyName}`, 100, 150);
      doc.text(`Industry: ${calculator.industry}`, 100, 170);

      doc.text("Annual Benefits:", 100, 220);
      doc.text(`Email Revenue: $${results.emailRevenue}`, 120, 240);
      doc.text(`Social Media Savings: $${results.socialSavings}`, 120, 260);
      doc.text(`Chatbot Savings: $${results.chatbotSavings}`, 120, 280);
      doc.text(`Product Description Savings: $${results.productSavings}`, 120, 300);

      doc.text(`Total Benefits: $${results.totalBenefits}`, 100, 340);
      doc.text(`ROI: ${results.roi}%`, 100, 360);
      doc.text(`Payback Period: ${results.paybackMonths} months`, 100, 380);

      doc.end();
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: "Error generating report" });
    }
  });

  app.post("/api/assessment/analyze", async (req, res) => {
    try {
      const { responses, calculatorId } = req.body;
      let industryContext = responses.industry || 'unspecified';
      
      try {
        if (calculatorId) {
          const calculatorData = await storage.getCalculatorById(calculatorId);
          if (calculatorData) {
            industryContext = calculatorData.industry;
          }
        }
      } catch (error) {
        console.error("Error fetching calculator data:", error);
      }

      // Ensure responses is not null and stringify with a default empty object if needed
      const responsesJson = JSON.stringify(responses ?? {}, null, 2);

      // Prepare the assessment data for analysis
      const prompt = `As an AI readiness assessment expert, analyze the following assessment responses and provide a detailed evaluation of the organization's AI readiness. Score their readiness on a scale of 1-10 and provide specific recommendations for improvement.

  Assessment Responses:
  ${responsesJson}

  Industry Context:
  The organization is in the ${industryContext} industry.

  Use Case Vision:
  The organization's specific automation goals: ${responses.useCaseVision || "No specific use cases provided"}

  Please analyze the responses where each answer is scored 1-4, with 4 being the highest. Consider the specific challenges and opportunities of their industry. Also take into account the specific use case that they want to explore and provide advice about that. Mention common challenges faced in their industry. Convert these scores to percentages where:
  - Score of 1 = 25%
  - Score of 2 = 50%
  - Score of 3 = 75%
  - Score of 4 = 100%

  Please provide the analysis in the following JSON format below:
  {
    "overall_score": number (0-100),
    "readiness_level": "string (one of: 'Not Ready', 'Early Stage', 'Developing', 'Advanced', 'Fully Prepared')",
    "dimension_scores": {
      "data_infrastructure": number (0-100),
      "process_automation": number (0-100),
      "tech_capabilities": number (0-100)
    },
    "key_strengths": ["string"],
    "improvement_areas": ["string"],
    "recommendations": ["string"]
  }`;

      const response = await OpenAIClient.chat.completions.create({
        model: "o3-mini",
        reasoning_effort: "medium",
        messages: [
          {
            role: "user",
            content: "You are an expert AI readiness assessment analyst. Provide detailed, actionable insights based on the assessment data. The interactive assessment should follow this flow:\n\n- **Welcome & Context Setting:**\nProvide a brief introduction that explains the benefits of generative AI and the importance of assessing readiness.\n\n- **Scoring & Benchmarking:**\nCalculate a readiness score for each dimension and an overall composite score. Compare these scores against industry benchmarks or maturity scales (e.g., Not Ready, Partially Ready, Fully Ready) and display them with visual cues like gauges, heat maps, or scorecards.\n\n- **Personalized Results & Recommendations:**\nBased on the user's answers and scores, generate a tailored report outlining strengths and opportunities for improvement. Provide actionable recommendations (e.g., Invest in data consolidation, Upskill your team on AI tools, Explore process automation in customer service) and a \"next steps\" checklist or roadmap."
          },
          {
            role: "user",
            content: prompt as string  // Type assertion to ensure string type
          }
        ],
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing assessment:", error);
      res.status(500).json({ error: "Failed to analyze assessment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}