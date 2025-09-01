import winston from "winston";
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const logsPath = path.resolve(__dirname, "../logs");


const getCallerInfo = () => {
    const obj = {}
    Error.captureStackTrace(obj,getCallerInfo);
    const stackLine = obj.stack.split("\n")[2];
    const match = stackLine.match(/\((.*):(\d+):(\d+)\)/);
    if(match){
        const fullPath = match[1];
        return `${path.basename(fullPath)}:${match[2]}`;
    }
    return "Неизвестно,бля"
}

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "error" : "info",
    format : winston.format.combine(
        winston.format.timestamp({
            format : () => new Date().toLocaleString("ru-RU",{timeZone : "Europe/Moscow"})
        }),
        winston.format.printf(({ level , message , timestamp}) => {
            return `${timestamp} + "\n" [${level.toUpperCase()}] + "\n" (${getCallerInfo()}): ${message}`;
        })
    ),
    transports: [
    new winston.transports.File({ filename: path.join(logsPath, "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(logsPath, "combined.log") }),
  ],
})

if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
  }  

export default logger