import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { RESPONSE_CATEGORIES } from "@/lib/constants";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all email logs with related data
    const emailLogs = await prisma.emailLog.findMany({
      include: {
        recipient: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    });

    // Overall stats
    const totalEmails = emailLogs.length;
    const sentEmails = emailLogs.filter((log) => log.status === "SENT").length;
    const failedEmails = emailLogs.filter(
      (log) => log.status === "FAILED",
    ).length;
    const responseCount = emailLogs.filter(
      (log) => log.responseReceived,
    ).length;
    const responseRate =
      sentEmails > 0 ? ((responseCount / sentEmails) * 100).toFixed(1) : "0";

    // Template performance
    const templateStats = emailLogs.reduce(
      (acc, log) => {
        const template = log.templateUsed || "UNKNOWN";
        if (!acc[template]) {
          acc[template] = {
            total: 0,
            sent: 0,
            responses: 0,
            failed: 0,
          };
        }
        acc[template].total++;
        if (log.status === "SENT") acc[template].sent++;
        if (log.status === "FAILED") acc[template].failed++;
        if (log.responseReceived) acc[template].responses++;
        return acc;
      },
      {} as Record<
        string,
        { total: number; sent: number; responses: number; failed: number }
      >,
    );

    // Company performance
    const companyStats = emailLogs.reduce(
      (acc, log) => {
        const company = log.recipient.company.companyName;
        if (!acc[company]) {
          acc[company] = {
            total: 0,
            sent: 0,
            responses: 0,
            failed: 0,
          };
        }
        acc[company].total++;
        if (log.status === "SENT") acc[company].sent++;
        if (log.status === "FAILED") acc[company].failed++;
        if (log.responseReceived) acc[company].responses++;
        return acc;
      },
      {} as Record<
        string,
        { total: number; sent: number; responses: number; failed: number }
      >,
    );

    // Top companies by email count
    const topCompanies = Object.entries(companyStats)
      .map(([company, stats]) => ({
        company,
        ...stats,
        responseRate:
          stats.sent > 0
            ? ((stats.responses / stats.sent) * 100).toFixed(1)
            : "0",
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Timeline data - emails sent per day (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailyStats = emailLogs
      .filter((log) => new Date(log.sentAt) >= thirtyDaysAgo)
      .reduce(
        (acc, log) => {
          const date = new Date(log.sentAt).toISOString().split("T")[0];
          if (!acc[date]) {
            acc[date] = { sent: 0, responses: 0, failed: 0 };
          }
          if (log.status === "SENT") acc[date].sent++;
          if (log.status === "FAILED") acc[date].failed++;
          if (log.responseReceived) acc[date].responses++;
          return acc;
        },
        {} as Record<
          string,
          { sent: number; responses: number; failed: number }
        >,
      );

    const timelineData = Object.entries(dailyStats)
      .map(([date, stats]) => ({
        date,
        ...stats,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Day of week performance
    const dayOfWeekStats = emailLogs.reduce(
      (acc, log) => {
        const dayOfWeek = new Date(log.sentAt).getDay();
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const day = days[dayOfWeek];
        if (!acc[day]) {
          acc[day] = { sent: 0, responses: 0 };
        }
        if (log.status === "SENT") acc[day].sent++;
        if (log.responseReceived) acc[day].responses++;
        return acc;
      },
      {} as Record<string, { sent: number; responses: number }>,
    );

    const dayOfWeekData = Object.entries(dayOfWeekStats).map(
      ([day, stats]) => ({
        day,
        ...stats,
        responseRate:
          stats.sent > 0
            ? ((stats.responses / stats.sent) * 100).toFixed(1)
            : "0",
      }),
    );

    // Hour of day performance
    const hourStats = emailLogs.reduce(
      (acc, log) => {
        const hour = new Date(log.sentAt).getHours();
        if (!acc[hour]) {
          acc[hour] = { sent: 0, responses: 0 };
        }
        if (log.status === "SENT") acc[hour].sent++;
        if (log.responseReceived) acc[hour].responses++;
        return acc;
      },
      {} as Record<number, { sent: number; responses: number }>,
    );

    const hourData = Object.entries(hourStats)
      .map(([hour, stats]) => ({
        hour: parseInt(hour),
        ...stats,
        responseRate:
          stats.sent > 0
            ? ((stats.responses / stats.sent) * 100).toFixed(1)
            : "0",
      }))
      .sort((a, b) => a.hour - b.hour);

    // Alumni vs Non-alumni performance
    const alumniStats = {
      alumni: {
        sent: emailLogs.filter(
          (log) => log.recipient.isAlumni && log.status === "SENT",
        ).length,
        responses: emailLogs.filter(
          (log) => log.recipient.isAlumni && log.responseReceived,
        ).length,
      },
      nonAlumni: {
        sent: emailLogs.filter(
          (log) => !log.recipient.isAlumni && log.status === "SENT",
        ).length,
        responses: emailLogs.filter(
          (log) => !log.recipient.isAlumni && log.responseReceived,
        ).length,
      },
    };

    // Response Type Breakdown
    const responseTypeBreakdown = {
      positive: 0,
      neutral: 0,
      negative: 0,
      special: 0,
      unspecified: 0,
    };

    const responsesByType: Record<string, number> = {};

    emailLogs.forEach((log) => {
      if (log.responseReceived && log.responseType) {
        responsesByType[log.responseType] =
          (responsesByType[log.responseType] || 0) + 1;

        // Categorize by sentiment
        let categorized = false;
        for (const [category, data] of Object.entries(RESPONSE_CATEGORIES)) {
          if (data.types.some((t: string) => t === log.responseType)) {
            responseTypeBreakdown[
              category.toLowerCase() as keyof typeof responseTypeBreakdown
            ]++;
            categorized = true;
            break;
          }
        }
        if (!categorized) {
          responseTypeBreakdown.unspecified++;
        }
      } else if (log.responseReceived) {
        responseTypeBreakdown.unspecified++;
      }
    });

    // Conversion Funnel
    const funnelStats = {
      emailsSent: sentEmails,
      responsesReceived: responseCount,
      positiveResponses: responseTypeBreakdown.positive,
      interviews: emailLogs.filter(
        (log) =>
          log.responseType === "Interview Scheduled" ||
          log.responseType === "Networking Call Scheduled",
      ).length,
    };

    // Average Response Time
    const responseTimes = emailLogs
      .filter((log) => log.responseReceived && log.responseDate)
      .map((log) => {
        const sentDate = new Date(log.sentAt);
        const responseDate = new Date(log.responseDate!);
        return (
          (responseDate.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24)
        ); // days
      });

    const avgResponseTime =
      responseTimes.length > 0
        ? (
            responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          ).toFixed(1)
        : "0";

    // Company Performance with Response Quality
    const companyQualityStats = Object.entries(companyStats).map(
      ([company, stats]) => {
        const companyLogs = emailLogs.filter(
          (log) => log.recipient.company.companyName === company,
        );
        const positiveResponses = companyLogs.filter((log) => {
          if (!log.responseType) return false;
          return RESPONSE_CATEGORIES.POSITIVE.types.some(
            (t: string) => t === log.responseType,
          );
        }).length;

        return {
          company,
          ...stats,
          positiveResponses,
          responseRate:
            stats.sent > 0
              ? ((stats.responses / stats.sent) * 100).toFixed(1)
              : "0",
          positiveRate:
            stats.responses > 0
              ? ((positiveResponses / stats.responses) * 100).toFixed(1)
              : "0",
        };
      },
    );

    // Template Performance with Response Quality
    const templateQualityStats = Object.entries(templateStats).map(
      ([name, stats]) => {
        const templateLogs = emailLogs.filter(
          (log) => (log.templateUsed || "UNKNOWN") === name,
        );
        const positiveResponses = templateLogs.filter((log) => {
          if (!log.responseType) return false;
          return RESPONSE_CATEGORIES.POSITIVE.types.some(
            (t: string) => t === log.responseType,
          );
        }).length;

        return {
          name,
          ...stats,
          positiveResponses,
          responseRate:
            stats.sent > 0
              ? ((stats.responses / stats.sent) * 100).toFixed(1)
              : "0",
          positiveRate:
            stats.responses > 0
              ? ((positiveResponses / stats.responses) * 100).toFixed(1)
              : "0",
        };
      },
    );

    return NextResponse.json({
      overview: {
        totalEmails,
        sentEmails,
        failedEmails,
        responseCount,
        responseRate,
        avgResponseTime,
      },
      responseTypeBreakdown,
      responsesByType: Object.entries(responsesByType)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      funnelStats,
      templateStats: templateQualityStats,
      topCompanies: companyQualityStats
        .sort((a, b) => b.total - a.total)
        .slice(0, 10),
      timelineData,
      dayOfWeekData,
      hourData,
      alumniStats: {
        alumni: {
          ...alumniStats.alumni,
          responseRate:
            alumniStats.alumni.sent > 0
              ? (
                  (alumniStats.alumni.responses / alumniStats.alumni.sent) *
                  100
                ).toFixed(1)
              : "0",
        },
        nonAlumni: {
          ...alumniStats.nonAlumni,
          responseRate:
            alumniStats.nonAlumni.sent > 0
              ? (
                  (alumniStats.nonAlumni.responses /
                    alumniStats.nonAlumni.sent) *
                  100
                ).toFixed(1)
              : "0",
        },
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 },
    );
  }
}
