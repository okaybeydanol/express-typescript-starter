import { DB_HOST, DB_PORT, DB_DATABASE, DB_LOCATION, DB_CLOUD_NAME, DB_CLOUD_PASSWORD, DB_CLOUD_CLUSTER } from '@config';

export const dbConnection = {
  url:
    DB_LOCATION === 'local'
      ? `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
      : `mongodb+srv://${DB_CLOUD_NAME}:${DB_CLOUD_PASSWORD}@${DB_CLOUD_CLUSTER}/?retryWrites=true&w=majority`,
};
