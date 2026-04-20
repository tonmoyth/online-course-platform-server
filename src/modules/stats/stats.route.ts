import { Router } from "express";
import chackAuth from "../../middlewares/checkAuth";
import { StatsController } from "./stats.controller";

const router = Router();

router.get(
    "/stats",
    chackAuth("ADMIN", "SUPER ADMIN", "INSTRUCTOR", "STUDENT"),
    StatsController.getDashboardStats,
);

export const DashboardStatsRoutes = router;
