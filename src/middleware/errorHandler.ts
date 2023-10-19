import { Request, Response } from "express";
import { errorLogger } from "../utils/logger";

type err = {
  code: string;
  message: string;
  status: number;
  response: { text: string };
};

const errorHandler = (err: err | any, req: Request, res: Response) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "Invalid JSON" });
  }
  if (err.code === "ENOTFOUND") {
    return res?.status(500).json({
      message: "Service not available at the moment. Please try again later",
      error: err.message,
    });
  }
  if (/^5/.test(String(err.status)) || !err.status) {
    const message = err.message || "Unexpected Error!!. We will fix it";
    return res?.status(500).json({ message });
  }
  if (err.response) {
    const errorText = JSON.parse(err.response.text);

    if (errorText) {
      return res?.status(400).json({
        message: errorText.message || errorText.error,
      });
    }
  }
  if (err) {
    return res?.status(err.status).json({ message: err.message });
  }

  res?.status(404).json({ message: "Not Found" });
};

export default errorHandler;
