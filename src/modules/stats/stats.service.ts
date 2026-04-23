import { prisma } from "../../lib/prisma";
import { CourseStatus, UsersStatus } from "../../generated/prisma/client";

const getAdminStats = async () => {
    const [
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalQuizAttempts,
        pendingUsers,
        pendingCourses,
        recentUsers,
        recentCourses,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.course.count({ where: { isDeleted: false } }),
        prisma.enrollment.count(),
        prisma.quizAttempt.count(),
        prisma.user.count({ where: { status: UsersStatus.PENDING } }),
        prisma.course.count({ where: { status: CourseStatus.PENDING, isDeleted: false } }),
        prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: { id: true, name: true, email: true, createdAt: true },
        }),
        prisma.course.findMany({
            take: 5,
            where: { isDeleted: false },
            orderBy: { createdAt: "desc" },
            select: { id: true, title: true, status: true, createdAt: true },
        }),
    ]);

    return {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalQuizAttempts,
        pendingApprovals: {
            users: pendingUsers,
            courses: pendingCourses,
        },
        recentActivity: {
            newUsers: recentUsers,
            newCourses: recentCourses,
        },
    };
};

const getInstructorStats = async (instructorId: string) => {
    const [courses, totalStudentsResult, avgQuizScoreResult] = await Promise.all([
        prisma.course.findMany({
            where: { instructorId, isDeleted: false },
            select: {
                id: true,
                title: true,
                status: true,
                _count: {
                    select: { enrollments: true },
                },
            },
        }),
        prisma.enrollment.count({
            where: {
                course: { instructorId },
            },
        }),
        prisma.quizAttempt.aggregate({
            where: {
                quiz: {
                    course: { instructorId },
                },
            },
            _avg: {
                score: true,
            },
        }),
    ]);

    return {
        totalCourses: courses.length,
        totalStudents: totalStudentsResult,
        averageQuizScore: Math.round(avgQuizScoreResult._avg.score || 0),
        courses: courses.map((course) => ({
            title: course.title,
            status: course.status,
            enrolledStudents: course._count.enrollments,
        })),
    };
};

const getStudentStats = async (studentId: string) => {
    const [enrolledCourses, recentQuizzes, lastAccessedEnrollment] = await Promise.all([
        prisma.enrollment.findMany({
            where: { studentId },
            include: {
                course: {
                    select: { title: true },
                },
            },
        }),
        prisma.quizAttempt.findMany({
            where: { studentId },
            take: 5,
            orderBy: { submittedAt: "desc" },
            include: {
                quiz: {
                    select: { title: true },
                },
            },
        }),
        prisma.enrollment.findFirst({
            where: { studentId },
            orderBy: { updatedAt: "desc" },
            include: {
                course: {
                    select: { title: true },
                },
            },
        }),
    ]);

    return {
        enrolledCourses: enrolledCourses.map((e) => ({
            title: e.course.title,
            progressPercent: e.progressPercent,
        })),
        recentQuizzes: recentQuizzes.map((q) => ({
            quizTitle: q.quiz.title,
            score: q.score,
            isPassed: q.isPassed,
        })),
        lastAccessedCourse: lastAccessedEnrollment
            ? { title: lastAccessedEnrollment.course.title }
            : null,
    };
};

const getDashboardStats = async (user: any) => {
    const { id: userId, role } = user;


    if (role === "ADMIN" || role === "SUPER ADMIN") {
        return await getAdminStats();
    } else if (role === "INSTRUCTOR") {
        return await getInstructorStats(userId);
    } else if (role === "STUDENT") {
        return await getStudentStats(userId);
    } else {
        throw new Error("Invalid role");
    }
};

export const StatsService = {
    getDashboardStats,
};
