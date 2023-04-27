import {Express, Router, Request, Response} from "express";
import {TasksResourcePath} from "../core/constants/tasks-resource.path.js";
import Tasks from "../index.js";

export function TasksController(app: Express, router: Router) :void {

    router
        .get(TasksResourcePath.ROOT, async (req: Request, res: Response): Promise<void> => {
            res.json(await Tasks.getAll());
        });


    app.use(TasksResourcePath.RESOURCE, router);
}
