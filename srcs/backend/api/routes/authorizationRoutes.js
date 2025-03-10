import { asyncHandler, validateInput } from "../utils.js";
import { loginUser, registerUser, enable2fa, verify2fa } from "../authUtils.js";
import { resetUserPassword, verifyUserResetToken } from "../passwordReset.js";
import {
  getUserByID,
  getUserByEmail,
  getUserByUsername,
} from "../models/userModel.js";

export default function createAuthRoutes(fastify) {
  return [
    {
      method: "POST",
      url: "/login",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["username", "password"])) return;
        const user = await getUserByUsername(req.body.username);
        if (!user) return res.code(404).send({ error: "User not found" });
        if (!req.body.totp && user.is_2fa_enabled)
          return res
            .code(202)
            .send({ message: "2FA is enabled, TOTP code required" });
        const result = await loginUser(user, req.body.password, req.body.totp);
        if (result == false)
          return res.code(401).send({ authorization: "failed" });
        return res.code(200).send(result);
      }),
    },
    {
      method: "POST",
      url: "/register",
      handler: asyncHandler(async (req, res) => {
        if (
          !validateInput(req, res, [
            "username",
            "email",
            "password",
            "confirm_password",
          ])
        )
          return;
        if (req.body.password != req.body.confirm_password)
          return res.code(400).send({ error: "passwords don't match" });
        const result = await registerUser(req.body);
        return res.code(201).send(result);
      }),
    },
    {
      method: "POST",
      url: "/reset",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["email"])) return;
        const user = await getUserByEmail(req.body.email);
        if (!user) return res.code(404).send({ error: "user not found" });
        const result = await resetUserPassword(user);
        if (result == null)
          return res.code(404).send({ error: "user not found" });
        return res.code(200).send(result);
      }),
    },
    {
      method: "POST",
      url: "/resetToken",
      handler: asyncHandler(async (req, res) => {
        if (
          !validateInput(req, res, [
            "token",
            "id",
            "password",
            "confirm_password",
          ])
        )
          return;
        if (req.body.password != req.body.confirm_password)
          return res.code(400).send({ error: "passwords don't match" });
        const user = await getUserByID(req.body.id);
        if (!user) return res.code(404).send({ error: "user not found" });
        const result = await verifyUserResetToken(
          user,
          req.body.token,
          req.body.password,
        );
        if (result == false)
          return res.code(403).send({ authorization: "failed" });
        return res.code(200).send(result);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/2fa/enable",
      handler: asyncHandler(async (req, res) => {
        const user = await getUserByID(req.userId);
        if (user.is_2fa_enabled === 1)
          return res.code(400).send({ error: "2FA already enabled" });
        const qr = await enable2fa(user);
        return res.code(200).send(qr);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "POST",
      url: "/2fa/verify",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["totp_code"])) return;
        const user = await getUserByID(req.userId);
        const result = await verify2fa(user, req.body.totp_code);
        if (result === false)
          return res.code(400).send({ error: "Unable to verify TOTP code" });
        return res.code(200).send(result);
      }),
    },
  ];
}
