import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

interface AuthRequest extends Request {
  user?: any;
}

// Middleware to verify JWT token and validate user
export const protect = async (req: AuthRequest, res: Response, next: NextFunction):Promise<any> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // Fetch user and exclude password
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token, authentication failed" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// Middleware to check role-based access
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Access denied: Admins only" });
    return; // Ensure function exits after sending response
  }
  next();
};