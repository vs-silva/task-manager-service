import {describe, expect, it} from "vitest";
import express from "express";
import request from "supertest";
import {TasksResourcePath} from "../core/constants/tasks-resource.path.js";
import type {TaskDTO} from "../core/dtos/task.dto.js";
import {TasksController} from "../driver-adapters/tasks.controller.js";
import tasks from "../index.js";


describe('Tasks driver adapter tests', () => {

    const app = express();
    const router = express.Router();

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const priorityOptionsRegex = /high|medium|low/i;

    app.use(express.json());
    TasksController(app, router);



    describe('Tasks driver adapter - get', () => {

        it('get /tasks route should return a collection of TaskDTO', async (done) => {

            const response = await request(app)
                .get(TasksResourcePath.RESOURCE)
                .set('Accept', 'application/json');

            expect(response.headers["Content-Type"]).contain(/json/);
            expect(response.status).toEqual(200);

            expect(response.body).toEqual(expect.arrayContaining(<TaskDTO[]>[
                expect.objectContaining(<TaskDTO>{
                    id: expect.any(String),
                    title: expect.any(String),
                    description: expect.any(String),
                    priority: expect.any(String),
                    complete: expect.any(Boolean),
                })
            ]));

            for (const dto of (response.body as TaskDTO[])) {
                expect(dto.id).toMatch(uuidRegex);
                expect(dto.title.trim()).toBeTruthy();
                expect(dto.priority).toMatch(priorityOptionsRegex);
            }
        });

        it.todo('get /tasks route should return an empty collection TaskDTO if nothing exists on the data provider');

    });

    it.todo('get /tasks/:id route should return a TaskDTO');
    it.todo('get /tasks/:id route should return null if nothing exists TaskDTO');
    it.todo('post /tasks route should create/add a new Task to the data provider and return void after the process is complete');
    it.todo('post /tasks route should return an error if the request DTO is not correct');
    it.todo('put /tasks/:id route should update an existent Task on the data provider');
    it.todo('put /tasks/:id route should return an error if the request DTO is not correct');
    it.todo('delete /tasks/:id route should remove an existent Task of the data provider');

});
