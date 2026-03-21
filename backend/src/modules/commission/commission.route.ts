import { requireAdmin } from './../../middlewares/admin.middleware';
import { Router } from "express";
import commissionController from "./commission.controller";


const router = Router();

/*
  GET  /commission/current
  PATCH /commission/set-rate
  GET  /commission/history
*/

router.get("/current", requireAdmin, commissionController.getCurrentCommissionRate);

router.patch("/set-rate", requireAdmin, commissionController.setCommissionRate);

router.get("/history", requireAdmin, commissionController.getCommissionHistory);

export default router;