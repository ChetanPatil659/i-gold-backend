import { Router } from "express";
import userRouter from "./userRoutes.js";
import goldRoutes from "./goldRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = Router();

// Mount the imported routes under their respective paths
router.use("/auth", userRouter);
router.use("/gold", goldRoutes);
router.use("/payments", paymentRoutes);
// router.use("/user", userRoutes);

export default router;
