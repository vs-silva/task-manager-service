import {Express, Router, Request, Response} from "express";
import {TasksResourcePathConstants} from "../core/constants/tasks-resource-path.constants.js";
import Tasks from "../index.js";
import Joi, {ValidationError} from "joi";

export function TasksController(app: Express, router: Router) :void {

    const priorityOptionsRegex = /high|medium|low/i;

    const taskIdValidationSchema = Joi.object().keys({
       id: Joi.string().not().empty().guid({ version: ['uuidv4']})
    });

    const taskCreateValidationSchema = Joi.object().keys({
        title: Joi.string().not().empty(),
        description: Joi.string(),
        priority: Joi.string().pattern(priorityOptionsRegex),
        complete: Joi.boolean()
    });

    router
        .get(TasksResourcePathConstants.ROOT, async (req: Request, res: Response): Promise<void> => {
            res.json(await Tasks.getAll());
        })

        .get(TasksResourcePathConstants.PARAM_ID, async (req: Request, res: Response): Promise<void> => {

            try {
                await taskIdValidationSchema.validateAsync(req.params);
                const {id} = req.params;

                const response = await Tasks.getById(id);

                if(!response) {
                    res.status(404);
                }

                res.json(response);

            } catch ( error ) {
                res
                    .status(400)
                    .json((error as ValidationError).details[0].message);
            }
        })

        .post(TasksResourcePathConstants.ROOT, async (req: Request, res: Response): Promise<void> => {

            try {
                await taskCreateValidationSchema.validateAsync(req.body);

                res
                    .status(201)
                    .json(await Tasks.createTask(req.body));

            } catch (error) {

                res
                    .status(400)
                    .json((error as ValidationError).details[0].message);

            }
        });


    app.use(TasksResourcePathConstants.RESOURCE, router);
}
