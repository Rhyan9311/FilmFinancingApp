"use strict";

const {
  db,
  models: { User, Investment },
} = require("../server/db");

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced!");

  // Creating Users
  const users = await Promise.all([
    User.create({ username: "cody", password: "123" }),
    User.create({ username: "murphy", password: "123" }),
  ]);

  // Creating Investments
  const investments = await Promise.all([
    Investment.create({
      name: "Stock A",
      symbol: "STK-A",
      price: 50.0,
      quantity: 10,
      userId: users[0].id,
    }),
    Investment.create({
      name: "Stock B",
      symbol: "STK-B",
      price: 75.0,
      quantity: 5,
      userId: users[0].id,
    }),
    Investment.create({
      name: "Stock C",
      symbol: "STK-C",
      price: 100.0,
      quantity: 20,
      userId: users[1].id,
    }),
  ]);

  console.log(
    `seeded ${users.length} users and ${investments.length} investments`
  );
  console.log(`seeded successfully`);
  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
    investments: {
      a: investments[0],
      b: investments[1],
      c: investments[2],
    },
  };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
