import express from 'express';
import cors from "cors";
import Settings from "./settings/index.js";

const port = Settings.port;
const app = express();
app.use(cors());

app.listen(port, () => {
    if(Settings.inDevMode){
        console.info(`app listening on port: ${port}`);
    }
});
