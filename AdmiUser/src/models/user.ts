import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Define role types
export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

// User Interface for TypeScript
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

// User Schema
const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password match method
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export Model
export const User = mongoose.model<IUser>("User", UserSchema);
