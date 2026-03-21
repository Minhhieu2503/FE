import { Router } from "express";
import notificationController from "./notification.controller";
import {requireAdmin} from "../../middlewares/admin.middleware";

const router = Router();

/*
  POST /notification/bulk
  GET  /notification/bulk-history
  GET  /notification/user/:userId
  PATCH /notification/read/:notificationId
*/

router.post("/bulk", requireAdmin, notificationController.sendBulkNotification);

router.get(
  "/bulk-history",
  requireAdmin,
  notificationController.getBulkNotificationHistory
);

router.get("/user/:userId", notificationController.getUserNotifications);

router.patch(
  "/read/:notificationId",
  notificationController.markNotificationAsRead
);

export default router;