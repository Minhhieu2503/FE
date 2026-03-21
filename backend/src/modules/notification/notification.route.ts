import { Router } from "express";
import notificationController from "./notification.controller";
import { requireAdmin } from "../../middlewares/admin.middleware";
import customerMiddleware from "../../middlewares/customer.middleware";

const router = Router();

/*
  =========================
  ADMIN
  =========================
*/
router.post("/bulk", requireAdmin, notificationController.sendBulkNotification);

router.get(
  "/bulk-history",
  requireAdmin,
  notificationController.getBulkNotificationHistory
);

router.get(
  "/user/:userId",
  requireAdmin,
  notificationController.getUserNotifications
);

/*
  =========================
  CUSTOMER
  =========================
*/
router.get(
  "/my-notifications",
  customerMiddleware,
  notificationController.viewMyNotifications
);

router.get(
  "/my-notifications/unread-count",
  customerMiddleware,
  notificationController.getUnreadNotificationCount
);

router.patch(
  "/my-notifications/:notificationId/read",
  customerMiddleware,
  notificationController.markNotificationAsRead
);

router.patch(
  "/my-notifications/read-all",
  customerMiddleware,
  notificationController.markAllNotificationsAsRead
);

/*
  =========================
  ADMIN or CUSTOMER
  =========================
*/
router.patch(
  "/read/:notificationId",
  notificationController.markNotificationAsRead
);

export default router;