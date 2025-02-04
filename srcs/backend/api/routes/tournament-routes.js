const tournament_routes = [
  // {
  //   method: "GET",
  //   url: "/tournaments",
  //   handler: asyncHandler(async (req, res) => {
  //     const users = await getUsers();
  //     res.code(200).send(users);
  //   }),
  // },
  // {
  //   method: "POST",
  //   url: "/tournaments",
  //   handler: asyncHandler(async (req, res) => {
  //     if (!validateUserInput(req, res)) return;
  //     const { username, email, password } = req.body;
  //     const user = await createUser(username, email, password);
  //     res.code(201).send(user);
  //   }),
  // },
  // {
  //   method: "GET",
  //   url: "/tournaments/:id",
  //   handler: asyncHandler(async (req, res) => {
  //     const { id } = req.params;
  //     const user = await getUserByID(id);
  //     if (!user) {
  //       return res.code(404).send({ error: "User with ID not found." });
  //     }
  //     res.code(200).send(user);
  //   }),
  // },
  // {
  //   method: "PUT",
  //   url: "/tournaments/:id",
  //   handler: asyncHandler(async (req, res) => {
  //     if (!validateUserInput(req, res)) return;
  //     const { id } = req.params;
  //     const { username, email, password } = req.body;
  //     const user = await putUser(id, username, email, password);
  //     res.code(200).send(user);
  //   }),
  // },
  // {
  //   method: "DELETE",
  //   url: "/tournaments/:id",
  //   handler: asyncHandler(async (req, res) => {
  //     const { id } = req.params;
  //     await deleteUser(id);
  //     res.code(204);
  //   }),
  // },
];

export default tournament_routes;
