import type {TasksDriverPorts} from "./ports/tasks-driver.ports.js";
import type {TaskDTO} from "./core/dtos/task.dto.js";
import type {TasksReaderDrivenPorts} from "./ports/tasks-reader-driven.ports.js";
import type {TasksWriterDrivenPorts} from "./ports/tasks-writer-driven.ports.js";
import {TasksMapperService} from "./core/services/mapper/tasks-mapper.service.js";

export function TasksService(reader: TasksReaderDrivenPorts, writer: TasksWriterDrivenPorts): TasksDriverPorts {

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

    async function createTask(dto: TaskDTO): Promise<void> {
        const entity = await TasksMapperService.mapToTaskEntity(dto);
        return await writer.save(entity);
    }

    async function removeTask(id: string): Promise<void> {

        const entity = await reader.getById(id);

        if(!entity) {
            return;
        }

        return await writer.erase(id);
    }

    async function updateTask(id: string, dto: TaskDTO): Promise<void> {

        const entity = await reader.getById(id);

        if(!entity) {
            return;
        }

        const mappedEntity = await TasksMapperService.mapToTaskEntity(dto);
        return await writer.save(Object.assign(entity, mappedEntity));
    }

    return {
        getAll,
        getById,
        createTask,
        removeTask,
        updateTask
    };
}
