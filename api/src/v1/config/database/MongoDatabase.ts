import mongoose from 'mongoose';
import { IDatabase } from './IDatabase';

interface MongoConfig {
  connectionURL: string;
}

export class MongoDatabase implements IDatabase {
  public constructor(private readonly config: MongoConfig) {}

  public async connect(): Promise<void> {
    await mongoose.connect(this.config.connectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
