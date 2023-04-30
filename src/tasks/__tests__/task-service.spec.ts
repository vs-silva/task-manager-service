import {describe, expect, it, vi} from "vitest";
import Tasks from "../index.js";
import type {TaskDTO} from "../core/dtos/task.dto.js";
import {faker} from "@faker-js/faker";
import {TaskPriorityConstants} from "../core/constants/task-priority.constants.js";

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

            const taskDTOS = await Tasks.getAll();
            const id = taskDTOS[0].id;

            const spy = vi.spyOn(Tasks, 'getById');
            const result = await Tasks.getById((id as string));

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

        it('Task.createTask should add new Task to the data provider', async () => {

            const fakeTask: TaskDTO = {
              id: faker.datatype.uuid(),
              title: faker.random.words(2),
              description: faker.random.words(10),
              priority: TaskPriorityConstants.LOW,
              complete: faker.datatype.boolean()
            };

            const spy = vi.spyOn(Tasks, 'createTask');
            await Tasks.createTask(fakeTask);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTask);

            const taskDTOS = await Tasks.getAll();
            const created = taskDTOS.find(taskDTO => taskDTO.title.trim() === fakeTask.title.trim());

            expect(created).toBeTruthy();
            expect(created?.id).toMatch(uuidRegex);
            expect(created?.title.trim()).toBeTruthy();
            expect(created?.priority).toMatch(priorityOptionsRegex);

            expect(created?.title).toEqual(fakeTask.title);
            expect(created?.description).toEqual(fakeTask.description);
            expect(created?.priority).toEqual(fakeTask.priority);
            expect(created?.complete).toEqual(fakeTask.complete);

        });

        it.todo('Tasks.removeTask should remove a existent Task entity from the data provider');

    });

});
