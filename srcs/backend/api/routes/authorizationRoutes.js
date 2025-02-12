import {
  asyncHandler,
  validateInput,
  loginUser,
  registerUser,
  resetUserPassword,
} from "../utils.js";

export default function createAuthRoutes(fastify) {
  return [
    {
      method: "POST",
      url: "/login",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["username", "password"])) return;
        const result = await loginUser(req.body);
        if (result == false) res.code(403).send({ authorization: "failed" });
        if (result == null) res.code(404).send({ error: "user not found" });
        res.code(200).send(result);
      }),
    },
    {
      method: "POST",
      url: "/register",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["username", "email", "password"])) return;
        const result = await registerUser(req.body);
        res.code(201).send(result);
      }),
    },
    {
      method: "POST",
      url: "/reset",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["email"])) return;
        const result = await resetUserPassword(req.body);
      }),
    },
  ];
}
