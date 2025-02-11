import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
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
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
      const { responses } = req.body;

      // Prepare the assessment data for OpenAI analysis
      const prompt = `As an AI readiness assessment expert, analyze the following assessment responses and provide a detailed evaluation of the organization's AI readiness. Score their readiness on a scale of 1-10 and provide specific recommendations for improvement.

Assessment Responses:
${JSON.stringify(responses, null, 2)}

Please provide the analysis in the following JSON format:
{
  "overall_score": number (1-10),
  "readiness_level": "string (one of: 'Not Ready', 'Early Stage', 'Developing', 'Advanced', 'Fully Prepared')",
  "dimension_scores": {
    "data_infrastructure": number (1-10),
    "process_automation": number (1-10),
    "tech_capabilities": number (1-10)
  },
  "key_strengths": ["string"],
  "improvement_areas": ["string"],
  "recommendations": ["string"]
}`;

      const response = await openai.chat.completions.create({
        model: "o1-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert AI readiness assessment analyst. Provide detailed, actionable insights based on the assessment data. The interactive assessment should follow this flow:\n\n- **Welcome & Context Setting:**\nProvide a brief introduction that explains the benefits of generative AI and the importance of assessing readiness.\n\n- **Scoring & Benchmarking:**\nCalculate a readiness score for each dimension and an overall composite score. Compare these scores against industry benchmarks or maturity scales (e.g., Not Ready, Partially Ready, Fully Ready) and display them with visual cues like gauges, heat maps, or scorecards.\n\n- **Personalized Results & Recommendations:**\nBased on the user's answers and scores, generate a tailored report outlining strengths and opportunities for improvement. Provide actionable recommendations (e.g., Invest in data consolidation, Upskill your team on AI tools, Explore process automation in customer service) and a \"next steps\" checklist or roadmap."
          },
          {
            role: "user",
            content: prompt
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