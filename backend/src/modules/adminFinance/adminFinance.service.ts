import Wallet from "../../models/wallet.model";
import WithdrawRequest from "../../models/withdrawRequest.model";
import WalletTransaction from "../../models/walletTransaction.model";

class AdminFinanceService {
  async createWithdrawRequest(data: {
    userId: string;
    amount: number;
    bankName: string;
    bankAccountNumber: string;
    accountHolderName: string;
    note?: string;
  }) {
    const wallet = await Wallet.findOne({ userId: data.userId });

    if (!wallet) {
      throw new Error("Wallet not found for this user");
    }

    if (!wallet.isActive) {
      throw new Error("Wallet is inactive");
    }

    if (wallet.balance < data.amount) {
      throw new Error("Insufficient wallet balance");
    }

    const withdrawRequest = await WithdrawRequest.create({
      userId: data.userId,
      walletId: wallet._id,
      amount: data.amount,
      bankName: data.bankName,
      bankAccountNumber: data.bankAccountNumber,
      accountHolderName: data.accountHolderName,
      note: data.note,
      status: "pending",
    });

    return withdrawRequest;
  }

  async getAllWithdrawRequests(status?: string) {
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    return await WithdrawRequest.find(filter)
      .populate("userId", "name email username role")
      .populate("walletId")
      .sort({ createdAt: -1 });
  }

  async handleWithdrawRequest(data: {
    withdrawRequestId: string;
    action: "approved" | "rejected";
    adminId?: string;
    rejectionReason?: string;
  }) {
    const withdrawRequest = await WithdrawRequest.findById(data.withdrawRequestId);

    if (!withdrawRequest) {
      throw new Error("Withdraw request not found");
    }

    if (withdrawRequest.status !== "pending") {
      throw new Error("This withdraw request has already been processed");
    }

    const wallet = await Wallet.findById(withdrawRequest.walletId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (data.action === "approved") {
      if (wallet.balance < withdrawRequest.amount) {
        throw new Error("Insufficient wallet balance at approval time");
      }

      const balanceBefore = wallet.balance;
      wallet.balance -= withdrawRequest.amount;
      const balanceAfter = wallet.balance;

      await wallet.save();

      withdrawRequest.status = "approved";
      withdrawRequest.reviewedAt = new Date();
      if (data.adminId) {
        withdrawRequest.reviewedBy = data.adminId as any;
      }
      await withdrawRequest.save();

      await WalletTransaction.create({
        userId: withdrawRequest.userId,
        walletId: withdrawRequest.walletId,
        type: "withdraw",
        amount: withdrawRequest.amount,
        balanceBefore,
        balanceAfter,
        status: "success",
        referenceId: withdrawRequest._id,
        description: "Admin approved withdraw request",
        createdBy: data.adminId,
      });

      return {
        message: "Withdraw request approved successfully",
        withdrawRequest,
        wallet,
      };
    }

    withdrawRequest.status = "rejected";
    withdrawRequest.reviewedAt = new Date();
    withdrawRequest.rejectionReason = data.rejectionReason || "Rejected by admin";
    if (data.adminId) {
      withdrawRequest.reviewedBy = data.adminId as any;
    }
    await withdrawRequest.save();

    await WalletTransaction.create({
      userId: withdrawRequest.userId,
      walletId: withdrawRequest.walletId,
      type: "withdraw",
      amount: withdrawRequest.amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance,
      status: "failed",
      referenceId: withdrawRequest._id,
      description: `Withdraw request rejected: ${withdrawRequest.rejectionReason}`,
      createdBy: data.adminId,
    });

    return {
      message: "Withdraw request rejected successfully",
      withdrawRequest,
    };
  }

  async exportAuditData(format?: string) {
    const transactions = await WalletTransaction.find()
      .populate("userId", "name email username role")
      .populate("walletId")
      .sort({ createdAt: -1 })
      .lean();

    const withdrawRequests = await WithdrawRequest.find()
      .populate("userId", "name email username role")
      .populate("walletId")
      .sort({ createdAt: -1 })
      .lean();

    if (format === "csv") {
      const rows: string[] = [];
      rows.push(
        [
          "recordType",
          "id",
          "user",
          "amount",
          "status",
          "type",
          "description",
          "createdAt",
        ].join(",")
      );

      transactions.forEach((item: any) => {
        rows.push(
          [
            "transaction",
            item._id,
            item.userId?.email || item.userId?.username || "",
            item.amount,
            item.status,
            item.type,
            `"${(item.description || "").replace(/"/g, '""')}"`,
            item.createdAt,
          ].join(",")
        );
      });

      withdrawRequests.forEach((item: any) => {
        rows.push(
          [
            "withdraw_request",
            item._id,
            item.userId?.email || item.userId?.username || "",
            item.amount,
            item.status,
            "withdraw_request",
            `"${(item.rejectionReason || item.note || "").replace(/"/g, '""')}"`,
            item.createdAt,
          ].join(",")
        );
      });

      return rows.join("\n");
    }

    return {
      exportedAt: new Date(),
      totalTransactions: transactions.length,
      totalWithdrawRequests: withdrawRequests.length,
      transactions,
      withdrawRequests,
    };
  }
}

export default new AdminFinanceService();