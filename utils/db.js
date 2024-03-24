const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

dotenv.config({ path: './config.env' });

class DBClient {
  constructor() {
    // CONNECTING WITH LOCAL
    // const DB = process.env.DATABASE_LOCAL;

    // CONNECTING WITH ATLAS
    const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

    this.mongooseConnection = mongoose.connect(DB);

    // Create mongoDB session store
    this.sessionStore = new MongoDBStore({
      uri: DB,
      collection: 'sessions',
    });
  }

  async isAlive() {
    try {
      await this.mongooseConnection;
      console.log('DB connection is successful.');
    } catch (error) {
      console.error(`MongoDB connection failed: ${error.message}`);
    }
  }
}

const dbClient = new DBClient();
module.exports = { dbClient, sessionStore: dbClient.sessionStore };
