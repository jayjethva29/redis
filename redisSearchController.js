const { createClient, SchemaFieldTypes } = require("redis");
const User = require("./userModel");

const client = createClient({
  // url: "",
});
const DEFAULT_EXP_TIME = 3600;

(async function () {
  await client.connect();
  console.log("client created");
  await client.flushDb();
  // Create an index.
  try {
    await client.ft.create(
      "idx:users",
      {
        "$.name": {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: "UNF",
        },
        "$.age": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "age",
        },
        "$.coins": {
          type: SchemaFieldTypes.NUMERIC,
          AS: "coins",
        },
        "$.email": {
          type: SchemaFieldTypes.TAG,
          AS: "email",
        },
      },
      {
        ON: "JSON",
        // PREFIX: "noderedis:users",
      }
    );

    // Add some users.
    await Promise.all([
      // client.json.set("noderedis:users:1", "$", {
      client.json.set("users:1", "$", {
        name: "Bob",
        age: 32,
        coins: 100,
        email: "alice@nonexist.com",
      }),
      client.json.set("users:2", "$", {
        name: "Bob",
        age: 23,
        coins: 15,
        email: "bob@somewhere.gov",
      }),
    ]);

    // Search all users
    console.log("Users under 30 years old:");
    console.log(
      // https://oss.redis.com/redisearch/Commands/#ftsearch
      JSON.stringify(await client.ft.search("idx:users", "*"), null, 2)
    );

    console.log('Users with email "bob@somewhere.gov":');
    const emailAddress = "bob@somewhere.gov".replace(/[.@]/g, "\\$&");
    console.log(
      JSON.stringify(
        await client.ft.search("idx:users", `@email:{${emailAddress}}`),
        null,
        2
      )
    );
  } catch (e) {
    if (e.message === "Index already exists") {
      console.log("Index exists already, skipped creation.");
    } else {
      // Something went wrong, perhaps RediSearch isn't installed...
      console.error(e);
      process.exit(1);
    }
  }
})();
