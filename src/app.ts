import express, { type Application } from "express";
import authRouter from "./routes/auth.routes.js";

const app: Application = express();

app.use(express.json());
// using auth routes for authentication related endpoints
app.use('/api/v1/auth',authRouter);

export default app;