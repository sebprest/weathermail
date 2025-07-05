import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "WeatherMail <noreply@example.com>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

export function createWeatherEmailHTML(
  locationName: string,
  weatherSummary: string
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weather Summary for ${locationName}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background-color: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .location {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .summary {
          background-color: #f1f5f9;
          padding: 20px;
          border-radius: 6px;
          border-left: 4px solid #2563eb;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="location">🌤️ ${locationName}</div>
        </div>
        
        <p>Here's your daily weather summary:</p>
        
        <div class="summary">
          ${weatherSummary}
        </div>
        
        <div class="footer">
          <p>This email was sent by WeatherMail</p>
          <p>You can manage your subscriptions in your dashboard</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
