import { createUser, getUserByUsername } from "./models/userModel.js";
import bcrypt from "bcryptjs";
import fastify from "./index.js";

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
  return await bcrypt.compare(data.password, user.password);
}

//TODO: Test this and test JWT
export async function registerUser(data) {
  const user = await createUser(data);
  const token = fastify.jwt.sign(user);
  return { user, token };
}
