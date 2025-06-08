import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware.js";
import {
  fetchBalance,
  invoicePdf,
  transactionHistory,
} from "../../controllers/v1/goldController.js";
import {
  buyGoldConfirm,
  buyGoldVerify,
  getGoldBuyPrice,
  buyGoldStatus,
  invoice,
  getGoldSellPrice,
  sellGoldVerify,
  sellGoldConfirm,
  sellGoldStatus,
} from "../../controllers/v1/buyController.js";

const goldRoutes = Router();

goldRoutes.get("/fetch-balance", authenticate, fetchBalance);
goldRoutes.get("/transaction-history", authenticate, transactionHistory);

goldRoutes.get("/gold-buy-price", getGoldBuyPrice);
goldRoutes.post("/gold-buy-verify", authenticate, buyGoldVerify);
goldRoutes.post("/gold-buy-confirm", authenticate, buyGoldConfirm);
goldRoutes.post("/gold-buy-status", authenticate, buyGoldStatus);
goldRoutes.get("/gold-buy-invoice", authenticate, invoice);

goldRoutes.get("/invoice-pdf/:txId", authenticate, invoicePdf);

goldRoutes.get("/gold-sell-price", getGoldSellPrice);
goldRoutes.post("/gold-sell-verify", authenticate, sellGoldVerify);
goldRoutes.post("/gold-sell-confirm", authenticate, sellGoldConfirm);
goldRoutes.post("/gold-sell-status", authenticate, sellGoldStatus);
// goldRoutes.post("/gold-sell-invoice", authenticate, invoice);

export default goldRoutes;
