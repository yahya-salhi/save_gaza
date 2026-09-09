import { Router } from "express";
import { successResponse } from "../middlewares/envelope.js";
import { GetSummaryUseCase } from "../application/use-cases/GetSummaryUseCase.js";
import { TechForPalestineSummaryClient } from "../infrastructure/external/TechForPalestineSummaryClient.js";

export const summaryRouter = Router();

const summaryClient = new TechForPalestineSummaryClient();
const getSummaryUseCase = new GetSummaryUseCase(summaryClient);

summaryRouter.get("/summary", async (_req, res, next) => {
  try {
    const summary = await getSummaryUseCase.execute();
    res.json(successResponse(summary));
  } catch (err) {
    next(err);
  }
});
