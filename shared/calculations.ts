import { pgTable, text, serial, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export function calculateEmailRevenue(
  listSize: number,
  currentConversion: number,
  averageOrder: number,
  improvement: number
): number {
  // Ensure all inputs are valid numbers and not NaN
  if (!listSize || !currentConversion || !averageOrder || !improvement) {
    return 0;
  }
  const additionalConversion = (currentConversion / 100) * (improvement / 100);
  return listSize * additionalConversion * averageOrder * 12; // Annualized
}

export function calculateSocialSavings(
  monthlySpend: number,
  hours: number, 
  improvement: number
): number {
  if (!monthlySpend || !hours || !improvement) {
    return 0;
  }
  const hourlyRate = 50; // Assumed average hourly rate
  const monthlySavings = (monthlySpend * (improvement / 100)) + 
                        (hours * hourlyRate * (improvement / 100));
  return monthlySavings * 12; // Annualized
}

export function calculateChatbotSavings(
  tickets: number,
  costPerTicket: number,
  improvement: number
): number {
  if (!tickets || !costPerTicket || !improvement) {
    return 0;
  }
  const monthlySavings = tickets * costPerTicket * (improvement / 100);
  return monthlySavings * 12; // Annualized
}

export function calculateProductSavings(
  products: number,
  hoursPerProduct: number,
  improvement: number
): number {
  if (!products || !hoursPerProduct || !improvement) {
    return 0;
  }
  const hourlyRate = 50;
  const totalHours = products * (hoursPerProduct / 60); // Convert minutes to hours
  const annualSavings = totalHours * hourlyRate * (improvement / 100);
  return annualSavings;
}

export function calculateROI(totalBenefits: number, investmentCost: number = 50000): number {
  if (!totalBenefits) return -100; // Return -100% ROI if no benefits
  return ((totalBenefits - investmentCost) / investmentCost) * 100;
}

export function calculatePaybackPeriod(totalBenefits: number, investmentCost: number = 50000): number {
  if (!totalBenefits || totalBenefits <= 0) return 999; // Return large number if no benefits
  const monthlyBenefits = totalBenefits / 12;
  return investmentCost / monthlyBenefits;
}
const INDUSTRY_IMPROVEMENTS: { [key: string]: number } = {
  'Retail': 20,
  'E-commerce': 25,
  'Technology': 32.5,
  'Manufacturing': 15,
  'Healthcare': 22.5,
  'Education': 25,
  'Financial Services': 20,
  'Professional Services': 32.5
};

export function getImprovementPercentage(industry: string): number {
  return INDUSTRY_IMPROVEMENTS[industry] || 20; // Default to 20% if industry not found
}
