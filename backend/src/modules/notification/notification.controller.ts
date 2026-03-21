import { Request, Response } from "express";
import notificationService from "./notification.service";

class NotificationController {
  // =========================
  // ADMIN
  // =========================
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
      const type = req.query.type as string | undefined;
      const isRead = req.query.isRead as string | undefined;

      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({
          message: "Invalid userId",
        });
      }

      const allowedTypes = ["booking", "payment", "message", "bulk", "system"];
      if (type && !allowedTypes.includes(type)) {
        return res.status(400).json({
          message: "type must be one of: booking, payment, message, bulk, system",
        });
      }

      const result = await notificationService.getUserNotifications(
        userId,
        type,
        isRead
      );

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

  // =========================
  // CUSTOMER
  // =========================
  async viewMyNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user?._id;
      const type = req.query.type as string | undefined;
      const isRead = req.query.isRead as string | undefined;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const allowedTypes = ["booking", "payment", "message", "bulk", "system"];
      if (type && !allowedTypes.includes(type)) {
        return res.status(400).json({
          message: "type must be one of: booking, payment, message, bulk, system",
        });
      }

      const result = await notificationService.getUserNotifications(
        userId,
        type,
        isRead
      );

      return res.status(200).json({
        message: "My notifications fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "View my notifications failed",
      });
    }
  }

  async getUnreadNotificationCount(req: Request, res: Response) {
    try {
      const userId = (req as any).user?._id;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const result = await notificationService.getUnreadNotificationCount(userId);

      return res.status(200).json({
        message: "Unread notification count fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Fetch unread notification count failed",
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

      const userId = (req as any).user?._id;
      const role = (req as any).user?.role;

      const result = await notificationService.markNotificationAsRead(
        notificationId,
        userId,
        role
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

  async markAllNotificationsAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user?._id;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const result = await notificationService.markAllNotificationsAsRead(userId);

      return res.status(200).json({
        message: result.message,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Mark all notifications as read failed",
      });
    }
  }
}

export default new NotificationController();