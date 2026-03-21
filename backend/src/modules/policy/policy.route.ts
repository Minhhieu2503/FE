import { requireAdmin } from './../../middlewares/admin.middleware';
import { Router } from "express";
import policyController from "./policy.controller";


const router = Router();

/*
  POST  /policy/create
  PATCH /policy/update
  GET   /policy
  GET   /policy/:policyType
  GET   /policy-history
*/

router.post("/create", requireAdmin, policyController.createPolicy);

router.patch("/update", requireAdmin, policyController.updatePolicy);

router.get("/", requireAdmin, policyController.getAllPolicies);

router.get("/history", requireAdmin, policyController.getPolicyHistory);

router.get("/:policyType", requireAdmin, policyController.getPolicyByType);

export default router;