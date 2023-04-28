import type {TasksDriverPorts} from "./ports/tasks-driver.ports.js";
import type {TaskDTO} from "./core/dtos/task.dto.js";
import type {TasksReaderDrivenPorts} from "./ports/tasks-reader-driven.ports.js";
import {TasksMapperService} from "./core/services/mapper/tasks-mapper.service.js";

export function TasksService(reader: TasksReaderDrivenPorts): TasksDriverPorts {

    async function getAll(): Promise<TaskDTO[]> {
        const entities = await reader.getAll();
        return await TasksMapperService.mapToTasksDTOCollection(entities);
    }

    async function getById(id: string): Promise<TaskDTO | null> {
        const entity = await reader.getById(id);

        if(!entity) {
            return null;
        }

        const result = await TasksMapperService.mapToTasksDTOCollection([entity]);
        return result[0];
    }

    return {
        getAll,
        getById
    };
}
