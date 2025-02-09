import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertCalculatorSchema, insertResultsSchema } from "@shared/schema";
import PDFDocument from "pdfkit";

export function registerRoutes(app: Express) {
  app.post("/api/calculator", async (req, res) => {
    try {
      console.log("Received calculator data:", req.body); // Debug log
      const inputs = insertCalculatorSchema.parse(req.body);
      const calculator = await storage.saveCalculatorInputs(inputs);
      res.json(calculator);
    } catch (error) {
      console.error("Validation error:", error); // Debug log
      res.status(400).json({ error: "Invalid input data", details: error });
    }
  });

  app.post("/api/results", async (req, res) => {
    try {
      const resultsData = insertResultsSchema.parse(req.body);
      const results = await storage.saveResults(resultsData);
      res.json(results);
    } catch (error) {
      console.error("Results validation error:", error);
      res.status(400).json({ error: "Invalid results data", details: error });
    }
  });

  app.get("/api/calculator/:id", async (req, res) => {
    const calculator = await storage.getCalculatorById(parseInt(req.params.id));
    if (!calculator) {
      return res.status(404).json({ error: "Calculator not found" });
    }
    res.json(calculator);
  });

  app.get("/api/results/:id", async (req, res) => {
    const results = await storage.getResultsById(parseInt(req.params.id));
    if (!results) {
      return res.status(404).json({ error: "Results not found" });
    }
    res.json(results);
  });

  app.get("/api/report/:id", async (req, res) => {
    const calculator = await storage.getCalculatorById(parseInt(req.params.id));
    const results = await storage.getResultsById(parseInt(req.params.id));

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
  });

  const httpServer = createServer(app);
  return httpServer;
}