import { calculatorInputs, results, type Calculator, type InsertCalculator, type Results, type InsertResults } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  saveCalculatorInputs(inputs: InsertCalculator): Promise<Calculator>;
  saveResults(results: InsertResults): Promise<Results>;
  getCalculatorById(id: number): Promise<Calculator | undefined>;
  getResultsById(id: number): Promise<Results | undefined>;
}

export class DatabaseStorage implements IStorage {
  async saveCalculatorInputs(inputs: InsertCalculator): Promise<Calculator> {
    const [calculator] = await db
      .insert(calculatorInputs)
      .values(inputs)
      .returning();
    return calculator;
  }

  async saveResults(resultsData: InsertResults): Promise<Results> {
    const [result] = await db
      .insert(results)
      .values(resultsData)
      .returning();
    return result;
  }

  async getCalculatorById(id: number): Promise<Calculator | undefined> {
    const [calculator] = await db
      .select()
      .from(calculatorInputs)
      .where(eq(calculatorInputs.id, id));
    return calculator;
  }

  async getResultsById(id: number): Promise<Results | undefined> {
    const [result] = await db
      .select()
      .from(results)
      .where(eq(results.id, id));
    return result;
  }
}

export const storage = new DatabaseStorage();