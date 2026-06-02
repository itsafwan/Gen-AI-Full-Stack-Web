import app from "./src/app.js";
import ConnectionDB from "./src/config/config.db.js";
import envConfig from "./src/config/dotenv.config.js";


ConnectionDB().then(() => {
  app.listen(envConfig.PORT, () => {
    console.log(`Server is running on port ${envConfig.PORT}`);
  });
})
.catch((error) => {
    console.error("Database connection failed completely!", error);
    process.exit(1); 
  });