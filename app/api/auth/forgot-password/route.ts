import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Email is not Registered to this Platform" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token to database
    await PasswordReset.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
    });

    // Create reset URL - use environment variable or safely extract from request headers
    // SECURITY: In production, NEXT_PUBLIC_APP_URL should always be set explicitly
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    if (!baseUrl) {
      console.warn('NEXT_PUBLIC_APP_URL not set. Using request headers as fallback. This should be set explicitly in production.');
      
      // Try to get from origin or referer header
      const origin = req.headers.get('origin');
      const referer = req.headers.get('referer');
      
      if (origin) {
        baseUrl = origin;
      } else if (referer) {
        try {
          // Safely extract origin from referer URL
          const refererUrl = new URL(referer);
          baseUrl = refererUrl.origin;
        } catch (error) {
          // Invalid referer URL, ignore and log for debugging
          console.warn('Invalid referer URL:', referer, error);
        }
      }
      
      // Fallback to localhost for development
      if (!baseUrl) {
        baseUrl = 'http://localhost:3000';
      }
    }
    
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // Check if email credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn("Email credentials not configured");
      return NextResponse.json(
        { 
          message: "Reset token created. Email configuration pending.",
          resetUrl: resetUrl // Remove this in production!
        },
        { status: 200 }
      );
    }

    try {
      // Send email (configure nodemailer)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request - BoardWise",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Password Reset Request</h1>
            <p>You requested to reset your password for BoardWise.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
              Reset Password
            </a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${resetUrl}</p>
            <p style="color: #999; font-size: 14px;">This link expires in 1 hour.</p>
            <p style="color: #999; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });

    } catch (emailError: any) {
      console.error("Email sending failed:", emailError.message);
      // Still return success but log the error
      return NextResponse.json(
        { 
          message: "Reset token created but email failed to send. Check console.",
          resetUrl: resetUrl // Remove this in production!
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Reset link sent to email" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}

export {};