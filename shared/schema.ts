import { pgTable, text, serial, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculatorInputs = pgTable("calculator_inputs", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  email: text("email").notNull(),
  
  // Email campaign inputs
  emailListSize: integer("email_list_size"),
  currentOpenRate: decimal("current_open_rate"),
  currentConversionRate: decimal("current_conversion_rate"),
  averageOrderValue: decimal("average_order_value"),
  
  // Social media inputs
  monthlyContentSpend: decimal("monthly_content_spend"),
  contentCreationHours: integer("content_creation_hours"),
  
  // Chatbot inputs
  monthlyVisitors: integer("monthly_visitors"),
  supportTicketVolume: integer("support_ticket_volume"),
  costPerInquiry: decimal("cost_per_inquiry"),
  
  // Product description inputs
  numberOfProducts: integer("number_of_products"),
  descriptionUpdateTime: integer("description_update_time"),
  
  // Improvement assumptions
  emailImprovementPct: decimal("email_improvement_pct"),
  socialImprovementPct: decimal("social_improvement_pct"),
  chatbotImprovementPct: decimal("chatbot_improvement_pct"),
  productImprovementPct: decimal("product_improvement_pct")
});

export const insertCalculatorSchema = createInsertSchema(calculatorInputs);

export type InsertCalculator = z.infer<typeof insertCalculatorSchema>;
export type Calculator = typeof calculatorInputs.$inferSelect;

export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  calculatorId: integer("calculator_id").notNull(),
  emailRevenue: decimal("email_revenue"),
  socialSavings: decimal("social_savings"),
  chatbotSavings: decimal("chatbot_savings"),
  productSavings: decimal("product_savings"),
  totalBenefits: decimal("total_benefits"),
  roi: decimal("roi"),
  paybackMonths: decimal("payback_months")
});

export const insertResultsSchema = createInsertSchema(results);

export type InsertResults = z.infer<typeof insertResultsSchema>;
export type Results = typeof results.$inferSelect;
