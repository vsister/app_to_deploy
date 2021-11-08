import { MongoDatabase } from 'config/database/MongoDatabase';

const { DB_HOSTNAME, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

const connectionURL = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}:27017`;

export const primaryDB = new MongoDatabase({ connectionURL });
