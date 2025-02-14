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
  getUserByUsername,
  patchUser,
} from "./models/userModel.js";
import bcrypt from "bcryptjs";
import fastify from "./index.js";

export async function loginUser(data) {
  const user = await getUserByUsername(data.username);
  if (!user) return null;
  const isAuthorized = await bcrypt.compare(data.password, user.password);
  if (!isAuthorized) return false;
  const token = fastify.jwt.sign({ user: user.id });
  const result = Object.assign({}, user, { token });
  delete result.password;
  await patchUser(user.id, { is_online: 1 });
  return result;
}

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
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function saveFile(data) {
  const uploadDir = path.join(__dirname, "uploads");
  const filename = `${Date.now()}-${data.filename}`;
  const filepath = path.join(uploadDir, filename);
  await pipeline(data.file, createWriteStream(filepath));
  return {
    message: "File uploaded successfully",
    fileDetails: {
      filename: filename,
      originalName: data.filename,
      mimetype: data.mimetype,
      size: data.file.bytesRead,
    },
  };
}
