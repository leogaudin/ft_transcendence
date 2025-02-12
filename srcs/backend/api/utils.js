import {
  createUser,
  getUserByUsername,
  getUserByEmail,
  getUserByID,
} from "./models/userModel.js";
import bcrypt from "bcryptjs";
import fastify from "./index.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    res.code(500).send({ error: err.message });
  }
};

export function validateInput(req, res, requiredFields) {
  if (!req.body)
    return res.code(400).send({ error: "Body of request not found" });
  if (Object.keys(req.body).length === 0)
    return res.code(400).send({ error: "At least one field required" });
  const missingFields = requiredFields.filter((field) => !(field in req.body));
  if (missingFields.length > 0) {
    return res.code(400).send({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  return true;
}

export async function loginUser(data) {
  const user = await getUserByUsername(data.username);
  if (!user) return null;
  const isAuthorized = await bcrypt.compare(data.password, user.password);
  if (!isAuthorized) return false;
  const token = fastify.jwt.sign({ user: user.id });
  const result = Object.assign({}, user, { token });
  delete result.password;
  return result;
}

export async function registerUser(data) {
  const user = await createUser(data);
  const token = fastify.jwt.sign({ user: user.id });
  const result = Object.assign({}, user, { token });
  return result;
}

// TODO: This
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
  patchUser({ reset_token: hash });
  const link = `http://localhost:9000/resetToken?token=${resetToken}&id=${user.id}`;
  const info = await transporter.sendMail({
    from: `"Transcendence" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Password Reset Request",
    text: link,
    html: link,
  });

  return info;
}

export async function verifyUserResetToken(token, id) {
  const user = await getUserByID(id);
  if (!user) return null;
  const isAuthorized = await bcrypt.compare(token, user.reset_token);
  if (!isAuthorized) return false;
  console.log("User is able to reset password");
  // Reset password logic
  // patchUser(id, {password: newPassword})
  return true;
}
