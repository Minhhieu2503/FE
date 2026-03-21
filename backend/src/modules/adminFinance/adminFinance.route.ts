import { Router } from "express";
import adminFinanceController from "./adminFinance.controller";
import { requireAdmin  } from "../../middlewares/admin.middleware";

const router = Router();

/*
  POST   /admin-finance/withdraw-request
  GET    /admin-finance/withdraw-requests
  PATCH  /admin-finance/withdraw-request/handle
  GET    /admin-finance/export-audit
*/

router.post(
  "/withdraw-request",
  requireAdmin,
  adminFinanceController.createWithdrawRequest
);

router.get(
  "/withdraw-requests",
  requireAdmin,
  adminFinanceController.getAllWithdrawRequests
);

router.patch(
  "/withdraw-request/handle",
  requireAdmin,
  adminFinanceController.handleWithdrawRequest
);

router.get(
  "/export-audit",
  requireAdmin,
  adminFinanceController.exportAuditData
);

export default router;