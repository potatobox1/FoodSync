
import { Router } from "express";
import { addCompletedOrder } from "../controller/completedOrdersController";

const router = Router();


router.post("/add", addCompletedOrder);

export default router;
