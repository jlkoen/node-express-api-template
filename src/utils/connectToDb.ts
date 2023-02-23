import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

async function connectToDb() {
  const dbUri = config.get<string>('dbUri');

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(dbUri);
    log.info('Connected to DB');
  } catch (e) {
    process.exit(1);
  }
}

async function closeDbConnection() {
  try {
    await mongoose.disconnect();
  } catch (e) {
    process.exit(1);
  }
}
export { connectToDb, closeDbConnection };
