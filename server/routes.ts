import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertCalculatorSchema, insertResultsSchema } from "@shared/schema";
import PDFDocument from "pdfkit";
import { 
  calculateEmailRevenue,
  calculateSocialSavings,
  calculateChatbotSavings,
  calculateProductSavings,
  calculateROI,
  calculatePaybackPeriod
} from "@shared/calculations";

export function registerRoutes(app: Express) {
  app.post("/api/calculator", async (req, res) => {
    try {
      console.log("Received calculator data:", req.body); // Debug log
      const inputs = insertCalculatorSchema.parse(req.body);
      const calculator = await storage.saveCalculatorInputs(inputs);

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

      res.json({ id: calculator.id, results: results.id });
    } catch (error) {
      console.error("Validation error:", error); // Debug log
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

  const httpServer = createServer(app);
  return httpServer;
}