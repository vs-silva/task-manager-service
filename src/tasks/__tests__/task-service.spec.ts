import {describe, expect, it, vi} from "vitest";
import Tasks from "../index.js";
import type {TaskDTO} from "../core/dtos/task.dto.js";
import {faker} from "@faker-js/faker";

describe('Task services tests', () => {

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const priorityOptionsRegex = /high|medium|low/i;

    describe('Task services driver ports tests', () => {

        it('Tasks.getAll should return a TaskDTO collection', async () => {

            const spy = vi.spyOn(Tasks, 'getAll');
            const result = await Tasks.getAll();

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(result.length).toBeGreaterThan(0);

            expect(result).toStrictEqual(expect.arrayContaining(<TaskDTO[]>[
                expect.objectContaining(<TaskDTO>{
                    id: expect.any(String),
                    title: expect.any(String),
                    description: expect.any(String),
                    priority: expect.any(String),
                    complete: expect.any(Boolean)
                })
            ]));

            for (const dto of result) {
                expect(dto.id).toMatch(uuidRegex);
                expect(dto.title.trim()).toBeTruthy();
                expect(dto.priority).toMatch(priorityOptionsRegex);
            }

        });

        it.todo('Tasks.getAll should return an empty TaskDTO collection if no data exists on provider');

        it('Task.getById should return a TaskDTO if the provided task id exists', async () => {

            const entities = await Tasks.getAll();
            const id = entities[0].id;

            const spy = vi.spyOn(Tasks, 'getById');
            const result = await Tasks.getById(id);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(id);
            expect(result).toBeTruthy();

            expect(result).toStrictEqual(expect.objectContaining(<TaskDTO>{
                id: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                priority: expect.any(String),
                complete: expect.any(Boolean)
            }));

            expect(result?.id).toMatch(uuidRegex);
            expect(result?.title.trim()).toBeTruthy();
            expect(result?.priority).toMatch(priorityOptionsRegex);

        });


        it('Task.getById should return null if the provided task id does not exists', async () => {

            const id = faker.datatype.uuid();

            const spy = vi.spyOn(Tasks, 'getById');
            const result = await Tasks.getById(id);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(id);
            expect(result).toBeNull();
        });

    });

});
