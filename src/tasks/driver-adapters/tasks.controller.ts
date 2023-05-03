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
         * @openapi
         * /tasks:
         *   get:
         *     summary: Get all tasks
         *     description: Returns a list of all tasks.
         *     responses:
         *       '200':
         *         description: A list of tasks.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Task'
         *       '500':
         *         description: Internal server error.
         */
        .get(TasksResourcePathConstants.ROOT, async (req: Request, res: Response): Promise<void> => {
            res.json(await Tasks.getAll());
        })

        /**
         * @openapi
         * /tasks/{id}:
         *   get:
         *     summary: Get a task by ID
         *     description: Returns a single task by ID.
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: The ID of the task to retrieve.
         *         schema:
         *           type: string
         *     responses:
         *       '200':
         *         description: A single task.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Task'
         *       '400':
         *         description: Bad request.
         *         content:
         *           application/json:
         *             schema:
         *               type: string
         *       '404':
         *         description: Task not found.
         *       '500':
         *         description: Internal server error.
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
         * @openapi
         * /tasks:
         *   post:
         *     summary: Create a new task
         *     description: Creates a new task with the specified title, description, priority and completion status
         *     requestBody:
         *       description: Task object that needs to be created
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/NewTask'
         *     responses:
         *       201:
         *         description: The newly created task
         *       400:
         *         description: Bad request. Invalid input provided
         *         content:
         *           application/json:
         *             schema:
         *               type: string
         *       500:
         *         description: Internal server error. Something went wrong on the server
         *         content:
         *           application/json:
         *             schema:
         *               type: string
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
         * @openapi
         * /tasks/{id}:
         *   put:
         *     summary: Update a task by ID
         *     description: Updates a task by ID and returns the updated task
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: The ID of the task to update
         *         schema:
         *           type: string
         *           format: uuid
         *       - in: body
         *         name: body
         *         required: true
         *         description: The task object to update
         *         schema:
         *           $ref: '#/components/schemas/Task'
         *     responses:
         *       200:
         *         description: The updated task object
         *       400:
         *         description: Bad request, validation failed
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
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
         * @openapi
         * /tasks/{id}:
         *   delete:
         *     summary: Delete a task by ID
         *     description: Deletes a single task by ID
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: The ID of the task to delete
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: The task with the specified ID has been deleted
         *       400:
         *         description: Bad Request. The ID provided is not in the UUID format
         *       404:
         *         description: Task not found
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
