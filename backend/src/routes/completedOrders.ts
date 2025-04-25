// routes/completedOrders.ts
// has a controller now
import { Router } from "express";
import { addCompletedOrder } from "../controller/completedOrdersController";

const router = Router();

// now simply reference the controller
router.post("/add", addCompletedOrder);

export default router;
