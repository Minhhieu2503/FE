import { Request, Response } from "express";
import policyService from "./policy.service";

class PolicyController {
  async createPolicy(req: Request, res: Response) {
    try {
      const { policyType, title, description, rules, note } = req.body;

      if (!policyType || !title || !description) {
        return res.status(400).json({
          message: "policyType, title, description are required",
        });
      }

      const allowedTypes = ["cancellation", "refund", "financial"];
      if (!allowedTypes.includes(policyType)) {
        return res.status(400).json({
          message: "policyType must be one of: cancellation, refund, financial",
        });
      }

      const adminId = (req as any).user?._id || null;

      const result = await policyService.createPolicy({
        policyType,
        title,
        description,
        rules,
        adminId,
        note,
      });

      return res.status(201).json({
        message: "Policy created successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Create policy failed",
      });
    }
  }

  async updatePolicy(req: Request, res: Response) {
    try {
      const { policyType, title, description, rules, note } = req.body;

      if (!policyType || !title || !description) {
        return res.status(400).json({
          message: "policyType, title, description are required",
        });
      }

      const allowedTypes = ["cancellation", "refund", "financial"];
      if (!allowedTypes.includes(policyType)) {
        return res.status(400).json({
          message: "policyType must be one of: cancellation, refund, financial",
        });
      }

      const adminId = (req as any).user?._id || null;

      const result = await policyService.updatePolicy({
        policyType,
        title,
        description,
        rules,
        adminId,
        note,
      });

      return res.status(200).json({
        message: "Policy updated successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Update policy failed",
      });
    }
  }

  async getAllPolicies(req: Request, res: Response) {
    try {
      const result = await policyService.getAllPolicies();

      return res.status(200).json({
        message: "Policies fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Fetch policies failed",
      });
    }
  }

  async getPolicyByType(req: Request, res: Response) {
    try {
      const { policyType } = req.params;

      if (!policyType || Array.isArray(policyType)) {
        return res.status(400).json({
          message: "Invalid policyType",
        });
      }

      const result = await policyService.getPolicyByType(policyType);

      return res.status(200).json({
        message: "Policy fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || "Fetch policy failed",
      });
    }
  }

  async getPolicyHistory(req: Request, res: Response) {
    try {
      const policyType = req.query.policyType as string | undefined;

      const result = await policyService.getPolicyHistory(policyType);

      return res.status(200).json({
        message: "Policy history fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Fetch policy history failed",
      });
    }
  }
}

export default new PolicyController();