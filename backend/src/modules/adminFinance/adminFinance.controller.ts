import { Request, Response } from "express";
import adminFinanceService from "./adminFinance.service";

class AdminFinanceController {
  async createWithdrawRequest(req: Request, res: Response) {
    try {
      const result = await adminFinanceService.createWithdrawRequest(req.body);

      return res.status(201).json({
        message: "Withdraw request created successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Create withdraw request failed",
      });
    }
  }

  async getAllWithdrawRequests(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const result = await adminFinanceService.getAllWithdrawRequests(
        status as string
      );

      return res.status(200).json({
        message: "Withdraw requests fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Fetch withdraw requests failed",
      });
    }
  }

  async handleWithdrawRequest(req: Request, res: Response) {
    try {
      const { withdrawRequestId, action, rejectionReason } = req.body;

      const adminId = (req as any).user?._id || null;

      const result = await adminFinanceService.handleWithdrawRequest({
        withdrawRequestId,
        action,
        rejectionReason,
        adminId,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Handle withdraw request failed",
      });
    }
  }

  async exportAuditData(req: Request, res: Response) {
    try {
      const format = req.query.format as string;

      const result = await adminFinanceService.exportAuditData(format);

      if (format === "csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=audit-data.csv"
        );
        return res.status(200).send(result);
      }

      return res.status(200).json({
        message: "Audit data exported successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Export audit data failed",
      });
    }
  }
}

export default new AdminFinanceController();