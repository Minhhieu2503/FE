import { Request, Response } from "express";
import notificationService from "./notification.service";

class NotificationController {
  async sendBulkNotification(req: Request, res: Response) {
    try {
      const { title, message, targetType } = req.body;

      if (!title || !message || !targetType) {
        return res.status(400).json({
          message: "title, message, targetType are required",
        });
      }

      const allowedTargets = ["all", "customers", "studios"];
      if (!allowedTargets.includes(targetType)) {
        return res.status(400).json({
          message: "targetType must be one of: all, customers, studios",
        });
      }

      const adminId = (req as any).user?._id || null;

      const result = await notificationService.sendBulkNotification({
        title,
        message,
        targetType,
        adminId,
      });

      return res.status(201).json({
        message: "Bulk notification sent successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Send bulk notification failed",
      });
    }
  }

  async getBulkNotificationHistory(req: Request, res: Response) {
    try {
      const result = await notificationService.getBulkNotificationHistory();

      return res.status(200).json({
        message: "Bulk notification history fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Fetch bulk notification history failed",
      });
    }
  }

 async getUserNotifications(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }

    const result = await notificationService.getUserNotifications(userId);

    return res.status(200).json({
      message: "User notifications fetched successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Fetch user notifications failed",
    });
  }
}

  async markNotificationAsRead(req: Request, res: Response) {
  try {
    const { notificationId } = req.params;

    if (!notificationId || Array.isArray(notificationId)) {
      return res.status(400).json({
        message: "Invalid notificationId",
      });
    }

    const result = await notificationService.markNotificationAsRead(
      notificationId
    );

    return res.status(200).json({
      message: "Notification marked as read successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Mark notification as read failed",
    });
  }
}
}

export default new NotificationController();