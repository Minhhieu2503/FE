import BulkNotification from "../../models/bulkNotification.model";
import UserNotification from "../../models/userNotification.model";
import mongoose from "mongoose";

class NotificationService {
  async sendBulkNotification(data: {
    title: string;
    message: string;
    targetType: "all" | "customers" | "studios";
    adminId?: string;
  }) {
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("Database connection is not ready");
    }

    const userFilter: any = {};

    if (data.targetType === "customers") {
      userFilter.role = "customer";
    }

    if (data.targetType === "studios") {
      userFilter.role = "studio";
    }

    const users = await db.collection("users").find(userFilter).toArray();

    if (!users || users.length === 0) {
      throw new Error("No users found for this target group");
    }

    const bulkNotification = await BulkNotification.create({
      title: data.title,
      message: data.message,
      targetType: data.targetType,
      recipientCount: users.length,
      sentBy: data.adminId || undefined,
      status: "sent",
    });

    const userNotifications = users.map((user: any) => ({
      userId: user._id,
      title: data.title,
      message: data.message,
      type: "bulk",
      isRead: false,
      bulkNotificationId: bulkNotification._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await UserNotification.insertMany(userNotifications);

    return {
      bulkNotification,
      recipientCount: users.length,
    };
  }

  async getBulkNotificationHistory() {
    return await BulkNotification.find()
      .sort({ createdAt: -1 })
      .populate("sentBy", "fullName email role");
  }

  async getUserNotifications(
    userId: string,
    type?: string,
    isRead?: string
  ) {
    const filter: any = { userId };

    if (type) {
      filter.type = type;
    }

    if (isRead !== undefined) {
      if (isRead === "true") {
        filter.isRead = true;
      } else if (isRead === "false") {
        filter.isRead = false;
      }
    }

    return await UserNotification.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email role")
      .populate("bulkNotificationId");
  }

  async getUnreadNotificationCount(userId: string) {
    const unreadCount = await UserNotification.countDocuments({
      userId,
      isRead: false,
    });

    return { unreadCount };
  }

  async markNotificationAsRead(
    notificationId: string,
    userId?: string,
    role?: string
  ) {
    let filter: any = { _id: notificationId };

    if (role !== "admin") {
      if (!userId) {
        throw new Error("Unauthorized");
      }
      filter.userId = userId;
    }

    const notification = await UserNotification.findOne(filter);

    if (!notification) {
      throw new Error("Notification not found or access denied");
    }

    notification.isRead = true;
    await notification.save();

    return notification;
  }

  async markAllNotificationsAsRead(userId: string) {
    await UserNotification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    return { message: "All notifications marked as read successfully" };
  }
}

export default new NotificationService();