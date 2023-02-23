require('dotenv').config();
import app from './app';
import config from 'config';
import log from './utils/logger';
import { connectToDb } from './utils/connectToDb';

const port = config.get('port');
connectToDb();
app.listen(port, () => {
  log.info(`Application started at http://localhost:${port}`);
});
