import CommissionSetting from "../../models/commissionSetting.model";
import CommissionHistory from "../../models/commissionHistory.model";

class CommissionService {
  async getCurrentCommissionRate() {
    let setting = await CommissionSetting.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!setting) {
      setting = await CommissionSetting.create({
        commissionRate: 10,
        isActive: true,
      });
    }

    return setting;
  }

  async setCommissionRate(data: {
    commissionRate: number;
    adminId?: string;
    note?: string;
  }) {
    const { commissionRate, adminId, note } = data;

    if (commissionRate < 0 || commissionRate > 100) {
      throw new Error("Commission rate must be between 0 and 100");
    }

    let currentSetting = await CommissionSetting.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!currentSetting) {
      const newSetting = await CommissionSetting.create({
        commissionRate,
        isActive: true,
        updatedBy: adminId || undefined,
      });

      await CommissionHistory.create({
        oldRate: 0,
        newRate: commissionRate,
        changedBy: adminId || undefined,
        note: note || "Initial commission rate created",
      });

      return newSetting;
    }

    const oldRate = currentSetting.commissionRate;

    currentSetting.commissionRate = commissionRate;
    currentSetting.updatedBy = adminId as any;
    await currentSetting.save();

    await CommissionHistory.create({
      oldRate,
      newRate: commissionRate,
      changedBy: adminId || undefined,
      note: note || "Commission rate updated by admin",
    });

    return currentSetting;
  }

  async getCommissionHistory() {
    return await CommissionHistory.find()
      .sort({ createdAt: -1 })
      .populate("changedBy", "name email username role");
  }
}

export default new CommissionService();