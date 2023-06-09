import {describe, expect, it, vi} from "vitest";
import Tasks from "../index.js";
import type {TaskDTO} from "../core/dtos/task.dto.js";
import {faker} from "@faker-js/faker";
import {TaskPriorityConstants} from "../core/constants/task-priority.constants.js";

describe('Task services tests', () => {

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const priorityOptionsRegex = /high|medium|low/i;

    const fakeTask: TaskDTO = {
        title: faker.random.words(3),
        description: faker.random.words(6),
        priority: TaskPriorityConstants.MEDIUM,
        complete: faker.datatype.boolean()
    };

    describe('Task services driver ports tests', () => {

        it('Tasks.getAll should return an empty TaskDTO collection if no data exists on provider', async () => {

            const spy = vi.spyOn(Tasks, 'getAll');
            const result = await Tasks.getAll();

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(result.length).toEqual(0);

        });

        it('Tasks.getAll should return a TaskDTO collection', async () => {

            await Tasks.createTask(fakeTask);

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

        it('Tasks.removeTask should remove a existent Task entity from the data provider', async () => {

            await Tasks.createTask(fakeTask);
            const fetchOFAllTasksDTOs = await Tasks.getAll();
            const created = fetchOFAllTasksDTOs.find(taskDTO => taskDTO.title.trim() === fakeTask.title.trim());

            expect(created).toBeTruthy();
            expect(created?.id).toMatch(uuidRegex);
            expect(created?.title.trim()).toBeTruthy();
            expect(created?.priority).toMatch(priorityOptionsRegex);

            const createdTaskId = (created as TaskDTO).id;

            const spy = vi.spyOn(Tasks, 'removeTask');
            await Tasks.removeTask(createdTaskId as string);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(createdTaskId);

            const reFetchOFAllTasksDTOs = await Tasks.getAll();
            const removedTask = reFetchOFAllTasksDTOs.find(taskDTO => taskDTO?.id?.trim() === createdTaskId?.trim());

            expect(removedTask).toBeUndefined();
        });

        it('Tasks.removeTask should not remove a existent Task entity from the data provider if provided id is invalid or non-existent', async () => {

            const fakeRandomId = faker.datatype.uuid();

            const fetchedTasks = await Tasks.getAll();

            const spy = vi.spyOn(Tasks, 'removeTask');
            await Tasks.removeTask(fakeRandomId);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeRandomId);

            const reFetchedTasks = await Tasks.getAll();

            expect(reFetchedTasks.length).toEqual(fetchedTasks.length);

        });

        it('Tasks.updateTask should update existent Task on the data provider', async () => {

            const fakeTask: TaskDTO = {
                title: faker.random.words(3),
                description: faker.random.words(6),
                priority: TaskPriorityConstants.MEDIUM,
                complete: faker.datatype.boolean()
            };

            await Tasks.createTask(fakeTask);
            const allTasks = await Tasks.getAll();
            const created = allTasks.find(taskDTO => taskDTO.title.trim() === fakeTask.title.trim());

            expect(created).toBeTruthy();
            expect(created?.id).toMatch(uuidRegex);

            const newTitle = faker.random.words(5);
            const newDescription = faker.random.words(20);

            expect(created?.title).not.toEqual(newTitle);
            expect(created?.description).not.toEqual(newDescription);

            (created as TaskDTO).title = newTitle;
            (created as TaskDTO).description = newDescription;
            (created as TaskDTO).priority = TaskPriorityConstants.LOW;

            const spy = vi.spyOn(Tasks, 'updateTask');
            await Tasks.updateTask((created as TaskDTO).id as string, (created as TaskDTO));

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith((created as TaskDTO).id, (created as TaskDTO));

            const updatedTask = await Tasks.getById((created as TaskDTO).id as string);

            expect(updatedTask).toBeTruthy();
            expect(updatedTask?.title).toEqual(newTitle);
            expect(updatedTask?.description).toEqual(newDescription);

        });


        it('Tasks.updateTask should return if provided taskDTO_Id is non-existent on the data provider', async () => {

            const allTasks = await Tasks.getAll();
            const task = allTasks[0];

            expect(task).toBeTruthy();
            expect(task?.id).toMatch(uuidRegex);
            expect(task?.title.trim()).toBeTruthy();
            expect(task?.priority).toMatch(priorityOptionsRegex);

            const newTitle = faker.random.words(2);
            const newDescription = faker.random.words(3);

            (task as TaskDTO).title = newTitle;
            (task as TaskDTO).description = newDescription;

            await Tasks.updateTask(`${task.id}3` as string, task);

            const reFetchedAllTasks = await Tasks.getAll();
            const nonUpdatedTask = reFetchedAllTasks[0];

            expect(nonUpdatedTask).toBeTruthy();
            expect((nonUpdatedTask as TaskDTO).id?.trim()).toEqual((task as TaskDTO).id?.trim());
            expect(nonUpdatedTask.title.trim()).not.toEqual(task.title.trim());
            expect(nonUpdatedTask.description.trim()).not.toEqual(task.description.trim());

        });

    });

});
