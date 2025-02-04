import {
  createUser,
  getUserByID,
  getUsers,
  putUser,
  deleteUser,
} from "../models/userModel.js";

const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    res.code(500).send({ error: err.message });
  }
};

const validateUserInput = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.code(400).send({ error: "username, email and password are required" });
    return false;
  }
  return true;
};

const routes = [
  {
    method: "GET",
    url: "/users",
    handler: asyncHandler(async (req, res) => {
      const users = await getUsers();
      res.code(200).send(users);
    }),
  },
  {
    method: "POST",
    url: "/users",
    handler: asyncHandler(async (req, res) => {
      if (!validateUserInput(req, res)) return;
      const { username, email, password } = req.body;
      const user = await createUser(username, email, password);
      res.code(201).send(user);
    }),
  },
  {
    method: "GET",
    url: "/users/:id",
    handler: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const user = await getUserByID(id);
      if (!user) {
        return res.code(404).send({ error: "User with ID not found." });
      }
      res.code(200).send(user);
    }),
  },
  {
    method: "PUT",
    url: "/users/:id",
    handler: asyncHandler(async (req, res) => {
      if (!validateUserInput(req, res)) return;
      const { id } = req.params;
      const { username, email, password } = req.body;
      const user = await putUser(id, username, email, password);
      res.code(200).send(user);
    }),
  },
  {
    method: "DELETE",
    url: "/users/:id",
    handler: asyncHandler(async (req, res) => {
      const { id } = req.params;
      await deleteUser(id);
      res.code(204);
    }),
  },
];

export default routes;
