import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware.js";
import {
  fetchBalance,
  transactionHistory,
} from "../../controllers/v1/goldController.js";
import { getGoldBuyPrice } from "../../controllers/v1/buyController.js";

const goldRoutes = Router();

goldRoutes.get("/fetch-balance", authenticate, fetchBalance);
goldRoutes.get("/transaction-history", authenticate, transactionHistory);
goldRoutes.get("/gold-price", getGoldBuyPrice);

export default goldRoutes;
