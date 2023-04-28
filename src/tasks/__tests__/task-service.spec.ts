import {describe, expect, it, vi} from "vitest";
import Tasks from "../index.js";
import type {TaskDTO} from "../core/dtos/task.dto.js";

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

        it.todo('Task.getById should return a TaskDTO if the provided task id exists');
        it.todo('Task.getById should return null if the provided task id does not exists');

    });

});
