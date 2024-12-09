import "dotenv/config";
import App from "./app";

const main = async () => {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

  const DB_URI_TEMPLATE = process.env.MONGODB_URI || '';
  const DB_PASSWORD = process.env.MONGODB_PASSWORD || ''; // Password for database
  const DB_CONNECTION_STRING = DB_URI_TEMPLATE.replace('<password>', DB_PASSWORD); // Final connection string

  const app = new App();
  await app.initializeMongoDB(DB_CONNECTION_STRING);
  app.listen(PORT);
}

main().catch(console.error);