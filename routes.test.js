// Import necessary libraries
const request = require('supertest');
const app = require('../app'); // Adjust the path to where your Express app is defined
process.env.NODE_ENV = "test";

describe("GET /users", () => {
  test("It should respond with an array of users", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("users");
  });

  test("Accessing without authentication should fail", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(401); // Assuming your app returns 401 for unauthorized access
  });
});

describe("POST /login", () => {
  test("It should authenticate the user and return a token", async () => {
    const response = await request(app).post("/login").send({
      username: "testuser",
      password: "password"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("Login with wrong password should fail", async () => {
    const response = await request(app).post("/login").send({
      username: "testuser",
      password: "wrongpassword"
    });
    expect(response.statusCode).toBe(400); // Or whichever status code your app uses for login failure
  });

  test("Attempt SQL injection on login should not succeed", async () => {
    const response = await request(app).post("/login").send({
      username: "'; DROP TABLE users; --",
      password: "notarealpassword",
    });
    expect(response.statusCode).not.toBe(200); // Expect anything but success
  });
});


module.exports = { /* If needed */ };
