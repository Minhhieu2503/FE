import { Request, Response } from "express";
import commissionService from "./commission.service";

class CommissionController {
  async getCurrentCommissionRate(req: Request, res: Response) {
    try {
      const result = await commissionService.getCurrentCommissionRate();

      return res.status(200).json({
        message: "Current commission rate fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Fetch current commission rate failed",
      });
    }
  }

  async setCommissionRate(req: Request, res: Response) {
    try {
      const { commissionRate, note } = req.body;

      if (commissionRate === undefined || commissionRate === null) {
        return res.status(400).json({
          message: "commissionRate is required",
        });
      }

      if (typeof commissionRate !== "number") {
        return res.status(400).json({
          message: "commissionRate must be a number",
        });
      }

      const adminId = (req as any).user?._id || null;

      const result = await commissionService.setCommissionRate({
        commissionRate,
        adminId,
        note,
      });

      return res.status(200).json({
        message: "Commission rate updated successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Set commission rate failed",
      });
    }
  }

  async getCommissionHistory(req: Request, res: Response) {
    try {
      const result = await commissionService.getCommissionHistory();

      return res.status(200).json({
        message: "Commission history fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Fetch commission history failed",
      });
    }
  }
}

export default new CommissionController();