import {describe, expect, it} from "vitest";
import express from "express";
import request from "supertest";

describe('Tasks driver adapter tests', () => {

    const app = express();
    const contentType = "Content-Type";
    const jsonFormat = /json/;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const priorityOptionsRegex = /high|medium|low/i;

    describe('Tasks driver adapter - get', () => {

        it('get /tasks route should return a collection of TaskDTO', async () => {

            const response = await request(app)
                .get(TasksResourcePath.ROOT)
                .expect(contentType, jsonFormat)
                .expect(expect.arrayContaining(<TaskDTO[]>[
                    expect.objectContaining(<TaskDTO>{
                       id: expect.any(String),
                       title: expect.any(String),
                       description: expect.any(String),
                       priority: expect.any(String),
                       complete: expect.any(Boolean),
                    })
                ]))
                .expect(200);

            for (const task of response['body']) {

                expect(task.id).toMatch(uuidRegex);
                expect(task.priority).toMatch(priorityOptionsRegex);

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
