import { calculatorInputs, results, type Calculator, type InsertCalculator, type Results, type InsertResults } from "@shared/schema";

export interface IStorage {
  saveCalculatorInputs(inputs: InsertCalculator): Promise<Calculator>;
  saveResults(results: InsertResults): Promise<Results>;
  getCalculatorById(id: number): Promise<Calculator | undefined>;
  getResultsById(id: number): Promise<Results | undefined>;
}

export class MemStorage implements IStorage {
  private calculators: Map<number, Calculator>;
  private resultsList: Map<number, Results>;
  private currentCalcId: number;
  private currentResultId: number;

  constructor() {
    this.calculators = new Map();
    this.resultsList = new Map();
    this.currentCalcId = 1;
    this.currentResultId = 1;
  }

  async saveCalculatorInputs(inputs: InsertCalculator): Promise<Calculator> {
    const id = this.currentCalcId++;
    const calculator: Calculator = { ...inputs, id };
    this.calculators.set(id, calculator);
    return calculator;
  }

  async saveResults(resultsData: InsertResults): Promise<Results> {
    const id = this.currentResultId++;
    const results: Results = { ...resultsData, id };
    this.resultsList.set(id, results);
    return results;
  }

  async getCalculatorById(id: number): Promise<Calculator | undefined> {
    return this.calculators.get(id);
  }

  async getResultsById(id: number): Promise<Results | undefined> {
    return this.resultsList.get(id);
  }
}

export const storage = new MemStorage();
