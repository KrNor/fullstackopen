const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { listOfUsers, usersInDb } = require("./test_helper");
const User = require("../models/user");
// const { compareSync } = require("bcrypt"); // prob for later

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const userObjects = listOfUsers.map((user) => new User(user));
  const userPromiseArray = userObjects.map((user) => user.save());
  await Promise.all(userPromiseArray);
  //   console.log("data is prepped");
});

describe("User Api testing", () => {
  // test if valid user is added and an invalid user is NOT added
  // --- 1: valid user is added
  // --- 2: user with no username is NOT added
  // --- 3: user with no password is NOT added
  // --- 4: user with a username with shorter than 3 chars is NOT added
  // --- 5: user with a password that is shorter than 3 is NOT added
  // --- 6: user without a name is added
  // --- 7: user with an already taken username is NOT added
  test("valid user is added", async () => {
    const usersAtStart = await usersInDb();

    newUser = {
      username: "MrUnique",
      name: "Jhon",
      password: "sdxrehbtugbrnduklign",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const usersAtEnd = await usersInDb();
    // console.log(result.body);
    assert.deepStrictEqual(usersAtStart.length + 1, usersAtEnd.length);
    assert.deepStrictEqual(newUser.username, result.body.username);
    assert.deepStrictEqual(newUser.name, result.body.name);
  });
  test("user with no username is NOT added", async () => {
    const usersAtStart = await usersInDb();

    newUser = {
      name: "Jhon",
      password: "sdxrehbtugbrnduklign",
    };
    const result = await api.post("/api/users").send(newUser).expect(400);
    const usersAtEnd = await usersInDb();
    // console.log(result.body);
    assert(result.body.error.includes("username: Path `username` is required"));
    assert.deepStrictEqual(usersAtStart.length, usersAtEnd.length);
  });
  test("user with no password is NOT added", async () => {
    const usersAtStart = await usersInDb();

    newUser = {
      username: "MrUnique2",
      name: "Jhon",
    };
    const result = await api.post("/api/users").send(newUser).expect(400);
    const usersAtEnd = await usersInDb();
    // console.log(result.body);
    assert(
      result.body.error.includes(
        "please write a password that is at least 3 letters long"
      )
    );
    assert.deepStrictEqual(usersAtStart.length, usersAtEnd.length);
  });
  test("user with a username with shorter than 3 chars is NOT added", async () => {
    const usersAtStart = await usersInDb();

    newUser = {
      username: "Mr",
      name: "Jhon",
      password: "sdxrehbtugbrnduklign",
    };

    const result = await api.post("/api/users").send(newUser).expect(400);
    const usersAtEnd = await usersInDb();
    // console.log(result.body);
    assert(result.body.error.includes("User validation failed"));
    assert.deepStrictEqual(usersAtStart.length, usersAtEnd.length);
  });
  test("user with a password with shorter than 3 chars is NOT added", async () => {
    const usersAtStart = await usersInDb();

    newUser = {
      username: "MrFamous",
      name: "Jhon",
      password: "sd",
    };

    const result = await api.post("/api/users").send(newUser).expect(400);
    const usersAtEnd = await usersInDb();
    // console.log(result.body);
    // console.log(
    //   result.body.error.includes(
    //     "please write a password that is at least 3 letters long"
    //   )
    // );
    assert(
      result.body.error.includes("te a password that is at least 3 letters")
    );
    assert.deepStrictEqual(usersAtStart.length, usersAtEnd.length);
  });

  test("user without a name is added", async () => {
    const usersAtStart = await usersInDb();

    newUser = {
      username: "MrUnique45",
      password: "sdxrehbtugbrnduklign",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const usersAtEnd = await usersInDb();
    // console.log(result.body);
    assert.deepStrictEqual(usersAtStart.length + 1, usersAtEnd.length);
    assert.deepStrictEqual(newUser.username, result.body.username);
    assert.deepStrictEqual(newUser.name, result.body.name);
  });

  test("user with an already taken username is NOT added", async () => {
    const usersAtStart = await usersInDb();

    newUser = {
      username: "MrMonday",
      name: "Albert",
      password: "sdxreeehbtugbrnduklign",
    };

    const result = await api.post("/api/users").send(newUser).expect(400);
    const usersAtEnd = await usersInDb();
    // console.log(result.body);
    assert(
      result.body.error.includes(
        "The username is already taken, please pick another one"
      )
    );
    assert.deepStrictEqual(usersAtStart.length, usersAtEnd.length);
  });
});
after(async () => {
  await mongoose.connection.close();
});
