import { Router } from "express";
import { CourseDiscoveryController } from "./course.controller";

const router = Router();

router.get("/", CourseDiscoveryController.getAllCourses);
router.get("/:id", CourseDiscoveryController.getSingleCourse);

export const CourseDiscoveryRoutes = router;
