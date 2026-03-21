import { Request, Response, NextFunction } from "express";

const customerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const role = req.headers["x-role"];
  const userId = req.headers["x-user-id"];

  if (role !== "customer") {
    return res.status(403).json({
      message: "Access denied. Customer only.",
    });
  }

  (req as any).user = {
    _id: userId || "65f111111111111111111111",
    role: "customer",
  };

  next();
};

export default customerMiddleware;