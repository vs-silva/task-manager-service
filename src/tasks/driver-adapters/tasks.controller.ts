import {Express, Router, Request, Response} from "express";
import {TasksResourcePathConstants} from "../core/constants/tasks-resource-path.constants.js";
import Tasks from "../index.js";

export function TasksController(app: Express, router: Router) :void {

    router
        .get(TasksResourcePathConstants.ROOT, async (req: Request, res: Response): Promise<void> => {
            res.json(await Tasks.getAll());
        })

        .get(TasksResourcePathConstants.PARAM_ID, async (req: Request, res: Response): Promise<void> => {

            //TODO: Add validation. Use Joi package
            const {id} = req.params;

            const response = await Tasks.getById(id);

            if(!response) {
                res.status(404);
            }

            res.json(response);

        })

        .post(TasksResourcePathConstants.ROOT, async (req: Request, res: Response): Promise<void> => {

            //TODO: Add validation. Use Joi package
            const response = await Tasks.createTask(req.body);

            res
                .status(201)
                .json(response);
        });


    app.use(TasksResourcePathConstants.RESOURCE, router);
}
