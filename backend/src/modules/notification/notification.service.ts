import BulkNotification from "../../models/bulkNotification.model";
import UserNotification from "../../models/userNotification.model";
import mongoose from "mongoose";

/*
  Vì bạn chưa gửi user model, nên mình dùng mongoose connection đọc trực tiếp collection users.
  Cách này vẫn chạy được nếu collection của bạn tên là "users".
*/

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

    let userFilter: any = {};

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
      .populate("sentBy", "name email username role");
  }

  async getUserNotifications(userId: string) {
    return await UserNotification.find({ userId })
      .sort({ createdAt: -1 })
      .populate("bulkNotificationId");
  }

  async markNotificationAsRead(notificationId: string) {
    const notification = await UserNotification.findById(notificationId);

    if (!notification) {
      throw new Error("Notification not found");
    }

    notification.isRead = true;
    await notification.save();

    return notification;
  }
}

export default new NotificationService();