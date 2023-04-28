import {Express, Router, Request, Response} from "express";
import {TasksResourcePath} from "../core/constants/tasks-resource.path.js";
import Tasks from "../index.js";

export function TasksController(app: Express, router: Router) :void {

    router
        .get(TasksResourcePath.ROOT, async (req: Request, res: Response): Promise<void> => {
            res.json(await Tasks.getAll());
        })

        .get(TasksResourcePath.PARAM_ID, async (req: Request, res: Response): Promise<void> => {

            const {id} = req.params;
            //TODO: Add validation. Use Joi package

            const response = await Tasks.getById(id);

            if(!response) {
                res.status(404);
            }

            res.json(response);

        });


    app.use(TasksResourcePath.RESOURCE, router);
}
