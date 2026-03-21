import Policy from "../../models/policy.model";
import PolicyHistory from "../../models/policyHistory.model";

class PolicyService {
  async createPolicy(data: {
    policyType: "cancellation" | "refund" | "financial";
    title: string;
    description: string;
    rules?: string[];
    adminId?: string;
    note?: string;
  }) {
    const existingPolicy = await Policy.findOne({
      policyType: data.policyType,
      isActive: true,
    });

    if (existingPolicy) {
      throw new Error(
        `Policy for type '${data.policyType}' already exists. Use update instead.`
      );
    }

    const newPolicy = await Policy.create({
      policyType: data.policyType,
      title: data.title,
      description: data.description,
      rules: data.rules || [],
      isActive: true,
      updatedBy: data.adminId || undefined,
    });

    await PolicyHistory.create({
      policyId: newPolicy._id,
      policyType: data.policyType,
      oldTitle: "",
      newTitle: data.title,
      oldDescription: "",
      newDescription: data.description,
      oldRules: [],
      newRules: data.rules || [],
      changedBy: data.adminId || undefined,
      note: data.note || "Initial policy created",
    });

    return newPolicy;
  }

  async updatePolicy(data: {
    policyType: "cancellation" | "refund" | "financial";
    title: string;
    description: string;
    rules?: string[];
    adminId?: string;
    note?: string;
  }) {
    const policy = await Policy.findOne({
      policyType: data.policyType,
      isActive: true,
    });

    if (!policy) {
      throw new Error("Policy not found");
    }

    const oldTitle = policy.title;
    const oldDescription = policy.description;
    const oldRules = policy.rules || [];

    policy.title = data.title;
    policy.description = data.description;
    policy.rules = data.rules || [];
    policy.updatedBy = data.adminId as any;

    await policy.save();

    await PolicyHistory.create({
      policyId: policy._id,
      policyType: data.policyType,
      oldTitle,
      newTitle: data.title,
      oldDescription,
      newDescription: data.description,
      oldRules,
      newRules: data.rules || [],
      changedBy: data.adminId || undefined,
      note: data.note || "Policy updated by admin",
    });

    return policy;
  }

  async getAllPolicies() {
    return await Policy.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate("updatedBy", "name email username role");
  }

  async getPolicyByType(policyType: string) {
    const policy = await Policy.findOne({
      policyType,
      isActive: true,
    }).populate("updatedBy", "name email username role");

    if (!policy) {
      throw new Error("Policy not found");
    }

    return policy;
  }

  async getPolicyHistory(policyType?: string) {
    const filter: any = {};

    if (policyType) {
      filter.policyType = policyType;
    }

    return await PolicyHistory.find(filter)
      .sort({ createdAt: -1 })
      .populate("changedBy", "name email username role")
      .populate("policyId");
  }
}

export default new PolicyService();