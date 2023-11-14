import * as process from 'process';

export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        mongoUri: process.env.MONGO_URI,
        mongoDbName: process.env.MONGO_DB_NAME,
    },
  };
};