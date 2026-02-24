const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";

const database = "library_db";
const client=new MongoClient(url)
const dbConnection = async () => {
  try {
    await client.connect();
    console.log("mongodbconnected");
    return client.db(database);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { dbConnection };
