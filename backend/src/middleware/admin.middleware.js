export const protectAdminRoute = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - Access denied" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }

  next();
};

export const requireAdmin = protectAdminRoute;
