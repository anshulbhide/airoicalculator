import { pgTable, text, serial, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculatorInputs = pgTable("calculator_inputs", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  email: text("email").notNull(),

  // Email campaign inputs
  emailListSize: integer("email_list_size").notNull(),
  currentOpenRate: decimal("current_open_rate", { precision: 5, scale: 2 }).notNull(),
  currentConversionRate: decimal("current_conversion_rate", { precision: 5, scale: 2 }).notNull(),
  averageOrderValue: decimal("average_order_value", { precision: 10, scale: 2 }).notNull(),

  // Social media inputs
  monthlyContentSpend: decimal("monthly_content_spend", { precision: 10, scale: 2 }).notNull(),
  contentCreationHours: integer("content_creation_hours").notNull(),

  // Chatbot inputs
  monthlyVisitors: integer("monthly_visitors").notNull(),
  supportTicketVolume: integer("support_ticket_volume").notNull(),
  costPerInquiry: decimal("cost_per_inquiry", { precision: 10, scale: 2 }).notNull(),

  // Product description inputs
  numberOfProducts: integer("number_of_products").notNull(),
  descriptionUpdateTime: integer("description_update_time").notNull(),

  // Improvement assumptions
  emailImprovementPct: decimal("email_improvement_pct", { precision: 5, scale: 2 }).notNull(),
  socialImprovementPct: decimal("social_improvement_pct", { precision: 5, scale: 2 }).notNull(),
  chatbotImprovementPct: decimal("chatbot_improvement_pct", { precision: 5, scale: 2 }).notNull(),
  productImprovementPct: decimal("product_improvement_pct", { precision: 5, scale: 2 }).notNull()
});

export const insertCalculatorSchema = createInsertSchema(calculatorInputs);

export type InsertCalculator = z.infer<typeof insertCalculatorSchema>;
export type Calculator = typeof calculatorInputs.$inferSelect;

export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  calculatorId: integer("calculator_id").notNull(),
  emailRevenue: decimal("email_revenue", { precision: 10, scale: 2 }).notNull(),
  socialSavings: decimal("social_savings", { precision: 10, scale: 2 }).notNull(),
  chatbotSavings: decimal("chatbot_savings", { precision: 10, scale: 2 }).notNull(),
  productSavings: decimal("product_savings", { precision: 10, scale: 2 }).notNull(),
  totalBenefits: decimal("total_benefits", { precision: 10, scale: 2 }).notNull(),
  roi: decimal("roi", { precision: 10, scale: 2 }).notNull(),
  paybackMonths: decimal("payback_months", { precision: 10, scale: 2 }).notNull()
});

export const insertResultsSchema = createInsertSchema(results);

export type InsertResults = z.infer<typeof insertResultsSchema>;
export type Results = typeof results.$inferSelect;