import {Express, Router, Request, Response} from "express";
import {TasksResourcePathConstants} from "../core/constants/tasks-resource-path.constants.js";
import Tasks from "../index.js";
import Joi, {ValidationError} from "joi";

export function TasksController(app: Express, router: Router) :void {

    const priorityOptionsRegex = /high|medium|low/i;

    const taskIdValidationSchema = Joi.object().keys({
       id: Joi.string().not().empty().guid({ version: ['uuidv4']})
    });

    const taskCreateUpdateValidationSchema = Joi.object().keys({
        id: Joi.string().guid({ version: ['uuidv4']}).allow('').optional(),
        title: Joi.string().not().empty(),
        description: Joi.string(),
        priority: Joi.string().pattern(priorityOptionsRegex),
        complete: Joi.boolean()
    });

    router
        /**
         * @swagger
         * /tasks:
         *   get:
         *     summary: Get a list of tasks
         *     description: Returns a list of all tasks. List can be empty
         *     responses:
         *       200:
         *         description: A list of tasks. List can be empty
         *         content:
         *          application/json:
         *              schema:
         *                  type: array
         */
        .get(TasksResourcePathConstants.ROOT, async (req: Request, res: Response): Promise<void> => {
            res.json(await Tasks.getAll());
        })

        /**
         * @swagger
         * /tasks/{id}:
         *   get:
         *     summary: Get a task by id.
         *     description: Returns a task. If provided task id does not exist it will return null. If provided task id is invalid it will return error.
         *     parameters:
         *      - in: path
         *        name: id
         *        schema:
         *         type: string
         *        required: true
         *        description: The task id
         *     responses:
         *       200:
         *         description: Task response by id.
         *         content:
         *          application/json:
         *              schema:
         *                  type: object
         *       400:
         *         description: Bad Request.
         *         content:
         *          application/json:
         *              schema:
         *                  type: string
         *       404:
         *         description: Not found.
         *         content:
         *          application/json:
         *              schema:
         *                  type: null
         *
         */
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

        /**
         * @swagger
         * /tasks:
         *   post:
         *     summary: Create a new task. Documentation soon.
         *
         */
        .post(TasksResourcePathConstants.ROOT, async (req: Request, res: Response): Promise<void> => {

            try {
                await taskCreateUpdateValidationSchema.validateAsync(req.body);

                res
                    .status(201)
                    .json(await Tasks.createTask(req.body));

            } catch (error) {

                res
                    .status(400)
                    .json((error as ValidationError).details[0].message);

            }
        })

        /**
         * @swagger
         * /tasks{id}:
         *   put:
         *     summary: Updates a existent task. Documentation soon.
         *
         */
        .put(TasksResourcePathConstants.PARAM_ID, async (req: Request, res: Response): Promise<void> => {

            try {
                await taskIdValidationSchema.validateAsync(req.params);
                await taskCreateUpdateValidationSchema.validateAsync(req.body);

                res
                    .status(200)
                    .json(await Tasks.updateTask(req.params.id, req.body));

            } catch (error) {

                res
                    .status(400)
                    .json((error as ValidationError).details[0].message);

            }
        })

        /**
         * @swagger
         * /tasks{id}:
         *   delete:
         *     summary: Removes a existent task. Documentation soon.
         *
         */
        .delete(TasksResourcePathConstants.PARAM_ID, async (req: Request, res: Response): Promise<void> => {

            try {
                await taskIdValidationSchema.validateAsync(req.params);
                const {id} = req.params;

                res.json(await Tasks.removeTask(id));

            } catch (error) {

                res
                    .status(400)
                    .json((error as ValidationError).details[0].message);
            }

        });


    app.use(TasksResourcePathConstants.RESOURCE, router);
}
