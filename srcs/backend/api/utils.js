/**
 * Wraps a function in a try catch with await
 * @param {function} fn - Function to wrap
 */
export const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    res.code(500).send({ error: err.message });
  }
};

/**
 * Checks if a given request has specific fields
 * @param {request} req - Request to check values from
 * @param {response} res - Response to return codes
 * @param {array} requiredFields - Fields to check for
 * @returns {boolean} - True if successful, false if not
 */
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

/**
 * Checks if a given user is deleted, and if it is
 * modifies it, giving it an anonymous name
 * @param {user} user - User to check
 * @returns {user} - Modified user
 */
export function anonymize(user) {
  if (!user.is_deleted) {
    delete user.is_deleted;
  } else {
    delete user.is_deleted;
    user.username = "anonymous";
    user.email = "anonymous@mail.com";
  }
  return user;
}

import {
  createUser,
  getUserByID,
  getUserByUsername,
  patchUser,
} from "./models/userModel.js";
import bcrypt from "bcryptjs";
import fastify from "./index.js";

/**
 * Logs the user
 * @param {payload} data - Payload to evaluate
 * @returns {object} - An object with the user and a JWT if successful,
 *                     false if the password is incorrect,
 *                     null if the user does not exist
 */
export async function loginUser(data) {
  const user = await getUserByUsername(data.username);
  if (!user) return null;
  const isAuthorized = await bcrypt.compare(data.password, user.password);
  if (!isAuthorized) return false;
  // if (user.is_2fa_enabled == true) 2faLogin(user);
  const token = fastify.jwt.sign({ user: user.id });
  const result = Object.assign({}, user, { token });
  delete result.password;
  await patchUser(user.id, { is_online: 1 });
  return result;
}

// TODO: Continue working on this 2FA
//       currently it works, but needs further integration with the login system
import qrcode from "qrcode";
import { authenticator } from "otplib";
export async function enable2fa(user) {
  const secret = authenticator.generateSecret();
  await patchUser(user.id, { pending_totp_secret: secret });
  const keyUri = authenticator.keyuri(user.username, "Transcendence", secret);
  const qr = await qrcode.toDataURL(keyUri);
  return { qr_code: qr };
}
export async function verify2fa(user, totpCode) {
  const totpVerified = authenticator.verify({
    token: totpCode,
    secret: user.pending_totp_secret,
  });
  return {
    totpVerified: totpVerified,
    totpCode: totpCode,
    pending_totp_secret: user.pending_totp_secret,
  };
}

/**
 * Registers a user, creating it and giving a JWT
 * @param {payload} data - Payload to evaluate
 * @returns {object} - An object with the full user information and a JWT
 */
export async function registerUser(data) {
  const user = await createUser(data);
  const token = fastify.jwt.sign({ user: user.id });
  const result = Object.assign({}, user, { token });
  return result;
}

import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { unlink } from "node:fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Saves a given image as the avatar of an user,
 * deleting the old one in the process
 * @param {int} user_id - ID of the user
 * @param {payload} data - Payload to add the image from
 * @returns {object} - Object with the ID and metadata of the avatar
 */
export async function saveAvatar(user_id, data) {
  const uploadDir = path.join(__dirname, "avatars");
  const filename = `${Date.now()}-${data.filename}`;
  const filepath = path.join(uploadDir, filename);
  await pipeline(data.file, createWriteStream(filepath));
  const user = await getUserByID(user_id);
  const old_avatar = user.avatar;
  const default_avatar = "/usr/transcendence/api/avatars/default.jpg";
  await patchUser(user_id, { avatar: filepath });
  if (old_avatar != default_avatar) {
    unlink(old_avatar, (err) => {
      if (err) return { error: err.message };
    });
  }
  return {
    message: "File uploaded successfully",
    id: user_id,
    fileDetails: {
      filename: filename,
      originalName: data.filename,
      mimetype: data.mimetype,
      size: data.file.bytesRead,
    },
  };
}
