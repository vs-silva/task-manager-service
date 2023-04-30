import express from 'express';
import cors from "cors";
import Settings from "./settings/index.js";
import {TasksController} from "./tasks/driver-adapters/tasks.controller.js";
import helmet from "helmet";

const port = Settings.port;
const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.disable('x-powered-by');

TasksController(app, router);

app.listen(port, () => {
    if(Settings.inDevMode){
        console.info(`app listening on port: ${port}`);
    }
});
