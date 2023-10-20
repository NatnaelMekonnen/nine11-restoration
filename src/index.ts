import express, { Application, NextFunction, Request, Response } from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import envConfig from "./config/env.config";
import { infoLogger } from "./utils/logger";
import errorHandler from "./middleware/errorHandler";
import { connection } from "./config/db.config";
import router from "./routers";
import { multerParser } from "./middleware/multer";

const { PORT, NODE_ENV, ORIGIN } = envConfig;

class App {
  private app: Application;
  private server: http.Server;
  private corsOrigin: string | string[] | undefined;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.corsOrigin = NODE_ENV !== "production" ? "*" : ORIGIN?.split(",");
    this.configureMiddleware();
    this.configureRoutes();
    this.connectDB().then(() => {
      this.startServer();
    });
  }

  private configureMiddleware() {
    infoLogger.log(`Environment - ${NODE_ENV}`);
    infoLogger.log(`Origins - ${this.corsOrigin}`);
    this.app.use(cors({ origin: this.corsOrigin }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(multerParser);
    this.app.use(morgan("dev"));
    this.app.set("trust proxy", 0);
    const limiter = rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 150,
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);
  }

  private configureRoutes() {
    this.app.use("/api/v1", router);
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      infoLogger.log({
        body: req.body,
        params: req.params,
        query: req.query,
        url: req.url,
        method: req.method,
      });
      next();
    });
    this.app.get("/", (_req: Request, res: Response) => {
      res.send("911 Restoration API Running");
    });
    this.app.all("*", (_req: Request, res: Response) =>
      res.status(404).json({ message: "Requested route not found" }),
    );
    this.app.use(errorHandler);
  }

  private async connectDB() {
    await connection();
  }

  private startServer() {
    this.server.listen(PORT, () => {
      infoLogger.log(`Server is now running on http://localhost:${PORT}`);
    });
  }
}

new App();
