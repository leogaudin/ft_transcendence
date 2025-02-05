(async () => {
  console.log("Creating users...");
  let res = await fetch("http://localhost:9000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "foo",
      email: "foo@gmail.com",
      password: "foopassword",
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "bar",
      email: "bar@gmail.com",
      password: "barpassword",
    }),
  });
  console.log(res.status);
  res = await fetch("http://localhost:9000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "baz",
      email: "baz@gmail.com",
      password: "bazpassword",
    }),
  });
  console.log(res.status);
})();
