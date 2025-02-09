
export function calculateEmailRevenue(
  listSize: number,
  currentConversion: number,
  averageOrder: number,
  improvement: number
): number {
  const additionalConversion = currentConversion * (improvement / 100);
  return listSize * additionalConversion * averageOrder * 12; // Annualized
}

export function calculateSocialSavings(
  monthlySpend: number,
  hours: number, 
  improvement: number
): number {
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
  const monthlySavings = tickets * costPerTicket * (improvement / 100);
  return monthlySavings * 12; // Annualized
}

export function calculateProductSavings(
  products: number,
  hoursPerProduct: number,
  improvement: number
): number {
  const hourlyRate = 50;
  const totalHours = products * hoursPerProduct;
  const annualSavings = totalHours * hourlyRate * (improvement / 100);
  return annualSavings;
}

export function calculateROI(totalBenefits: number, investmentCost: number = 50000): number {
  return ((totalBenefits - investmentCost) / investmentCost) * 100;
}
