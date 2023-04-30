import {describe, expect, it} from "vitest";
import express from "express";
import request from "supertest";
import {TasksResourcePathConstants} from "../core/constants/tasks-resource-path.constants.js";
import type {TaskDTO} from "../core/dtos/task.dto.js";
import {TasksController} from "../driver-adapters/tasks.controller.js";
import {faker} from "@faker-js/faker";
import {TaskPriorityConstants} from "../core/constants/task-priority.constants.js";


describe('Tasks driver adapter tests', () => {

    const app = express();
    const router = express.Router();

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const priorityOptionsRegex = /high|medium|low/i;

    app.use(express.json());
    TasksController(app, router);

    describe('Tasks driver adapter - get', () => {

        it('get /tasks route should return a collection of TaskDTO', async () => {

            const response = await request(app)
                .get(TasksResourcePathConstants.RESOURCE)
                .set('Accept', 'application/json');

            expect(response.headers["Content-Type"]).contain(/json/);
            expect(response.status).toEqual(200);

            expect(response.body).toStrictEqual(expect.arrayContaining(<TaskDTO[]>[
                expect.objectContaining(<TaskDTO>{
                    id: expect.any(String),
                    title: expect.any(String),
                    description: expect.any(String),
                    priority: expect.any(String),
                    complete: expect.any(Boolean)
                })
            ]));

            for (const dto of (response.body as TaskDTO[])) {
                expect(dto.id).toMatch(uuidRegex);
                expect(dto.title.trim()).toBeTruthy();
                expect(dto.priority).toMatch(priorityOptionsRegex);
            }
        });

        it.todo('get /tasks route should return an empty collection TaskDTO if nothing exists on the data provider');

        it('get /tasks/:id route should return a TaskDTO', async () => {

            const allTasksResponse = await request(app)
                .get(TasksResourcePathConstants.RESOURCE)
                .set('Accept', 'application/json');

            const id = allTasksResponse.body[0].id;

            const response = await request(app)
                .get(`${TasksResourcePathConstants.RESOURCE}/${id}`)
                .set('Accept', 'application/json');

            expect(response.headers["Content-Type"]).contain(/json/);
            expect(response.status).toEqual(200);

            expect(response.body).toStrictEqual(expect.objectContaining(<TaskDTO> {
                id: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                priority: expect.any(String),
                complete: expect.any(Boolean)
            }));

            expect(response.body.id).toMatch(uuidRegex);
            expect(response.body.title.trim()).toBeTruthy();
            expect(response.body.priority).toMatch(priorityOptionsRegex);

        });


        it('get /tasks/:id route should return null if nothing exists TaskDTO', async () => {

            const response = await request(app)
                .get(`${TasksResourcePathConstants.RESOURCE}/${faker.datatype.uuid()}`)
                .set('Accept', 'application/json');

            expect(response.headers["Content-Type"]).contain(/json/);
            expect(response.status).toEqual(404);
            expect(response.body).toBeNull();

        });

        it('get /tasks/:id route should return bad request if invalid id provided', async () => {

            const response = await request(app)
                .get(`${TasksResourcePathConstants.RESOURCE}/${faker.datatype.uuid()}q`)
                .set('Accept', 'application/json');

            expect(response.headers["Content-Type"]).toBeUndefined();
            expect(response.status).toEqual(400);
            expect((response.body as string).trim()).toBeTruthy();

        });

    });

    describe('Tasks driver adapter - post', async () => {

        it('post /tasks route should create/add a new Task to the data provider and return void after the process is complete', async () => {

            const fakeTaskDTO = <TaskDTO> {
              title: faker.random.words(2),
              description: faker.random.words(10),
              priority: TaskPriorityConstants.LOW,
              complete: false
            };

            const response = await request(app)
                .post(TasksResourcePathConstants.RESOURCE)
                .send(fakeTaskDTO)
                .set('Accept', 'application/json');

            expect(response.headers["Content-Type"]).toBeUndefined();
            expect(response.status).toEqual(201);
            expect(response.body).toBeFalsy();

            const allTasksResponse = await request(app)
                .get(TasksResourcePathConstants.RESOURCE)
                .set('Accept', 'application/json');

            const createdTask = (allTasksResponse.body as Array<TaskDTO>).find(task => task.title.trim() === fakeTaskDTO.title.trim());
            expect(createdTask).toBeTruthy();

        });

        it('post /tasks route should return an error if the request DTO is not correct', async () => {

            const fakeTaskDTO = <TaskDTO> {
                title: '',
                description: faker.random.words(5),
                priority: TaskPriorityConstants.MEDIUM,
                complete: false
            };

            const response = await request(app)
                .post(TasksResourcePathConstants.RESOURCE)
                .send(fakeTaskDTO)
                .set('Accept', 'application/json');

            expect(response.headers["Content-Type"]).toBeUndefined();
            expect(response.status).toEqual(400);
            expect((response.body as string).trim()).toBeTruthy();

        });

    });

    describe('Tasks driver adapter - delete', async () => {

        it('delete /tasks/:id route should remove an Task of the data provider if it exists', async () => {

            const fakeTaskDTO = <TaskDTO> {
                title: faker.random.words(2),
                description: faker.random.words(10),
                priority: TaskPriorityConstants.LOW,
                complete: false
            };

            await request(app)
                .post(TasksResourcePathConstants.RESOURCE)
                .send(fakeTaskDTO)
                .set('Accept', 'application/json');

            const response = await request(app)
                .get(TasksResourcePathConstants.RESOURCE)
                .set('Accept', 'application/json');

            const createdTask = (response.body as Array<TaskDTO>).find(task => task.title.trim() === fakeTaskDTO.title.trim());

            expect(createdTask?.id).toBeTruthy();
            expect(createdTask?.id).toMatch(uuidRegex);

            const deleteResponse = await request(app)
                .delete(`${TasksResourcePathConstants.RESOURCE}/${createdTask?.id}`)
                .set('Accept', 'application/json');

            expect(deleteResponse.headers["Content-Type"]).toBeUndefined();
            expect(deleteResponse.status).toEqual(200);
            expect(deleteResponse.body).toBeFalsy();

            const reFetchedAllResponse = await request(app)
                .get(TasksResourcePathConstants.RESOURCE)
                .set('Accept', 'application/json');

            const removedTask = (reFetchedAllResponse.body as Array<TaskDTO>).find(task => task.id?.trim() === createdTask?.id?.trim());

            expect(removedTask).toBeUndefined();

        });

        it('delete /tasks/:id route should not remove an Task if it not existent on the data provider', async () => {

            const fakeRandomId = faker.datatype.uuid();

            const fetchedAll = await request(app)
                .get(TasksResourcePathConstants.RESOURCE)
                .set('Accept', 'application/json');

            const deleteResponse = await request(app)
                .delete(`${TasksResourcePathConstants.RESOURCE}/${fakeRandomId}`)
                .set('Accept', 'application/json');

            expect(deleteResponse.headers["Content-Type"]).toBeUndefined();
            expect(deleteResponse.status).toEqual(200);
            expect(deleteResponse.body).toBeFalsy();

            const reFetchedAll = await request(app)
                .get(TasksResourcePathConstants.RESOURCE)
                .set('Accept', 'application/json');

            expect(fetchedAll.body.length).toEqual(reFetchedAll.body.length);

        });

        it('delete /tasks/:id route should not remove an Task if provided task id is invalid', async () => {

            const deleteResponse = await request(app)
                .delete(`${TasksResourcePathConstants.RESOURCE}/${faker.datatype.uuid()}r`)
                .set('Accept', 'application/json');

            expect(deleteResponse.headers["Content-Type"]).toBeUndefined();
            expect(deleteResponse.status).toEqual(400);
            expect(deleteResponse.body).toBeTruthy();

        });

    });





    it.todo('put /tasks/:id route should update an existent Task on the data provider');
    it.todo('put /tasks/:id route should return an error if the request DTO is not correct');


});
