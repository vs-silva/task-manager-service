import {Express, Request, Response} from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";
import TaskSchema from "../tasks/driver-adapters/documentation/task.schema.js";
import CreateTaskSchema from "../tasks/driver-adapters/documentation/create-task.schema.js";

export function ApiDocumentation(app: Express): void {

    const apiRoute: string = '/api/v1';

    const swaggerDocument: swaggerJSDoc.Options = {
        definition: {
            openapi: '3.0.3',
            info: {
                title: 'Task Manager Services - REST API Docs',
                version: '1.0.0',
                description: 'REST API schemas for Task Manager Services.',
            },
            components: {
                schemas: {
                    Task: TaskSchema,
                    NewTask: CreateTaskSchema
                }
            }
        },
        apis: ['./**/*.controller.js']
    };

    const swaggerSpec = swaggerJSDoc(swaggerDocument);
    app.use(apiRoute, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {explorer: true}));

    app.get('/', async (req: Request, res: Response): Promise<void> => {
        res.redirect(apiRoute);
    });
}
