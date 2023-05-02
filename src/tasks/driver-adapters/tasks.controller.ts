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
         *  get:
         *      summary: Get all tasks
         *      responses:
         *          200:
         *              description: Ok
         *              content:
         *                  application/json:
         *                      schema:
         *                          type: array
         *                          items:
         *                              type: object
         *                              properties:
         *                                  id:
         *                                      type: string
         *                                      required: true
         *                                      example: fe56df6e-0626-4bae-99ab-16094f747a42
         *                                  title:
         *                                      type: string
         *                                      required: true
         *                                      example: lorem ipsum
         *                                  description:
         *                                      type: string
         *                                      required: false
         *                                      example: Lorem Ipsum has been the industry's standard
         *                                  priority:
         *                                      type: string
         *                                      required: true
         *                                      example: low
         *                                  complete:
         *                                      type: boolean
         *                                      required: true
         *                                      example: false
         *
         *          500:
         *              description: Internal Server Error
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
         *         description: Ok.
         *         content:
         *          application/json:
         *              schema:
         *                  type: object
         *                  properties:
         *                                  id:
         *                                      type: string
         *                                      required: true
         *                                      example: fe56df6e-0626-4bae-99ab-16094f747a42
         *                                  title:
         *                                      type: string
         *                                      required: true
         *                                      example: lorem ipsum
         *                                  description:
         *                                      type: string
         *                                      required: false
         *                                      example: Lorem Ipsum has been the industry's standard
         *                                  priority:
         *                                      type: string
         *                                      required: true
         *                                      example: low
         *                                  complete:
         *                                      type: boolean
         *                                      required: true
         *                                      example: false
         *
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
