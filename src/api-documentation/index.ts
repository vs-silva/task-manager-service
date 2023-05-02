import {Express} from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";

export function ApiDocumentation(app: Express): void {

    const swaggerDocument: swaggerJSDoc.Options = {
        definition: {
            info: {
                title: 'Task Manager Services - REST API Docs',
                version: '1.0.0',
                description: 'REST API documentation for Task Manager Services.',
            },
        },
        apis: ['./**/*.controller.js']
    };

    const swaggerSpec = swaggerJSDoc(swaggerDocument);
    app.use('/api/v1', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {explorer: true}));
}
