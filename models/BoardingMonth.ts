import mongoose, { Schema, model, models } from "mongoose";

const BoardingMonthSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        month: {
            type: Number, // 1-12
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        stayedDates: {
            type: [Number], // Array of days (e.g., [1, 2, 3, ...])
            default: [],
        },
        totalDays: {
            type: Number,
            default: 0,
        },
        rentAmount: {
            type: Number,
            default: 0,
        },
        extraBills: [
            {
                description: String,
                amount: Number,
                date: Date,
            },
        ],
        totalAmount: {
            type: Number,
            default: 0
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "overdue"],
            default: "pending",
        },
        dueDate: {
            type: Date
        },
        paidDate: {
            type: Date
        }
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure one record per user per month/year
BoardingMonthSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

const BoardingMonth =
    models.BoardingMonth || model("BoardingMonth", BoardingMonthSchema);

export default BoardingMonth;
