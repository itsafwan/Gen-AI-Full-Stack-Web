import app from "./src/app.js";
import ConnectionDB from "./src/config/config.db.js";
import envConfig from "./src/config/dotenv.config.js";

/**
   * @name Server Initialization
   * @description Connects to the database and starts the Express server on the specified port. If the database connection fails, it logs the error and exits the process to prevent the server from running without a database connection.
   * @access Public
*/


ConnectionDB().then(() => {
  app.listen(envConfig.PORT, () => {
    console.log(`Server is running on http://localhost:${envConfig.PORT}`);
  });
})
.catch((error) => {
    console.error("Database connection failed completely!", error);
    process.exit(1); 
  });