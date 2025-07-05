import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { getWeatherData } from "./get-weather-data";
import { sendEmail, createWeatherEmailHTML } from "@/lib/email";
import type { NextRequest } from "next/server";

const llm = new ChatOpenAI({
  model: "gpt-4.1-nano",
  temperature: 0.8,
});

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "active",
      },
      include: {
        location: {
          select: {
            name: true,
            latitude: true,
            longitude: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (activeSubscriptions.length === 0) {
      return NextResponse.json(
        { error: "No active subscriptions found" },
        { status: 404 }
      );
    }

    const emailResults = await Promise.all(
      activeSubscriptions.map(async (subscription) => {
        try {
          const weatherData = {
            location: subscription.location,
            ...(await getWeatherData({
              latitude: subscription.location.latitude,
              longitude: subscription.location.longitude,
            })),
          };

          const summaryResponse = await llm.invoke(
            `You are a weather reporter.
            You are given a weather report for a location. You need to summarize the weather data in a warm and inviting way.
            The report contains the following data. You must use the following context to inform your summary:
            - Location name: ${weatherData.location.name}
            - Hourly weather data ${JSON.stringify(weatherData.hourly)}
            
            Please provide a concise, friendly weather summary that includes:
            - Current conditions
            - Temperature trends
            - Any notable weather events
            - A brief recommendation for the day
            
            Keep it under 150 words and make it personal and engaging.`
          );

          const weatherSummary = summaryResponse.content as string;

          const emailHTML = createWeatherEmailHTML(
            weatherData.location.name,
            weatherSummary
          );

          await sendEmail({
            to: subscription.user.email,
            subject: `🌤️ Your Weather Summary for ${weatherData.location.name}`,
            html: emailHTML,
          });

          return {
            success: true,
            subscriptionId: subscription.id,
            location: weatherData.location.name,
            email: subscription.user.email,
          };
        } catch (error) {
          console.error(
            `Failed to process subscription ${subscription.id}:`,
            error
          );
          return {
            success: false,
            subscriptionId: subscription.id,
            location: subscription.location.name,
            email: subscription.user.email,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      })
    );

    const successfulEmails = emailResults.filter((result) => result.success);
    const failedEmails = emailResults.filter((result) => !result.success);

    return NextResponse.json({
      message: "Weather summary job completed",
      totalSubscriptions: activeSubscriptions.length,
      successfulEmails: successfulEmails.length,
      failedEmails: failedEmails.length,
      results: emailResults,
    });
  } catch (error) {
    console.error("Weather summary job failed:", error);
    return NextResponse.json(
      {
        error: "Failed to process weather summaries",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
