import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware.js";
import {
  fetchBalance,
  transactionHistory,
} from "../../controllers/v1/goldController.js";
import {
  buyGoldConfirm,
  buyGoldVerify,
  getGoldBuyPrice,
  buyGoldStatus,
  invoice,
} from "../../controllers/v1/buyController.js";

const goldRoutes = Router();

goldRoutes.get("/fetch-balance", authenticate, fetchBalance);
goldRoutes.get("/transaction-history", authenticate, transactionHistory);

goldRoutes.get("/gold-buy-price", getGoldBuyPrice);
goldRoutes.post("/gold-buy-verify", authenticate, buyGoldVerify);
goldRoutes.post("/gold-buy-confirm", authenticate, buyGoldConfirm);
goldRoutes.post("/gold-buy-status", authenticate, buyGoldStatus);
goldRoutes.post("/gold-buy-invoice", authenticate, invoice);

export default goldRoutes;
