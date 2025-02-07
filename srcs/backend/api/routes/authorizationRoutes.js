import { asyncHandler, validateInput, loginUser } from "../utils.js";

const auth_routes = [
  {
    method: "POST",
    url: "/login",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, ["username", "password"])) return;
      // TODO: Return a JWT on success
      if (await loginUser(req.body)) {
        res.code(200).send({ "auth:": "success" });
      }
      res.code(403).send({ "auth:": "failure" });
    }),
  },
];
export default auth_routes;
