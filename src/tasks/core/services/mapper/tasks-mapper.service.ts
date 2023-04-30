import type {TasksMapperInterface} from "./tasks-mapper.interface.js";
import type {TaskEntity} from "../../entities/task.entity.js";
import type {TaskDTO} from "../../dtos/task.dto.js";
import {v4 as uuidV4 } from "uuid";
import moment from "moment";


async function mapToTasksDTOCollection(entities: TaskEntity[]): Promise<TaskDTO[]> {

    return entities.map( (entity) => (<TaskDTO>{
        id: entity.id,
        title: entity.title,
        description: entity.description,
        priority: entity.priority,
        complete: entity.complete
    }));
}

async function mapToTaskEntity(dto: TaskDTO): Promise<TaskEntity> {
    return <TaskEntity>{
        id: dto.id || uuidV4(),
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        complete: dto.complete,
        creationDate: moment().format('L')
    };
}

export const TasksMapperService: TasksMapperInterface = {
    mapToTasksDTOCollection,
    mapToTaskEntity
} as const;
