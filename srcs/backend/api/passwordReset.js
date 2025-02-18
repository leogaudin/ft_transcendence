import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getUserByEmail, getUserByID, patchUser } from "./models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function resetUserPassword(data) {
  const user = await getUserByEmail(data.email);
  if (!user) return null;
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 10);
  await patchUser(user.id, { reset_token: hash });
  // This should go to the frontend, and after the user
  // fills a form, the new password gets sent to /resetToken endpoint
  const link = `http://localhost:9000/resetToken?token=${resetToken}&id=${user.id}`;
  const template = await fs.promises.readFile(
    path.resolve(__dirname, "./templates/passwordReset.html"),
    "utf-8",
  );
  const compiledTemplate = handlebars.compile(template);
  const html = compiledTemplate({ userName: user.username, resetLink: link });

  const info = await transporter.sendMail({
    from: `"Transcendence" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Password Reset Request",
    text: link,
    html: html,
  });

  return info;
}

export async function verifyUserResetToken(token, id) {
  const user = await getUserByID(id);
  if (!user) return null;
  if (!user.reset_token) return false;
  const isAuthorized = await bcrypt.compare(token, user.reset_token);
  if (!isAuthorized) return false;
  console.log("User is able to reset password");
  // Reset password logic
  // patchUser(id, {password: newPassword})
  patchUser(user.id, { reset_token: null }); // Null the reset_token after changin pass
  return true;
}
