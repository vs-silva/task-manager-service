import type {TasksMapperInterface} from "./tasks-mapper.interface.js";
import type {TaskEntity} from "../../entities/task.entity.js";
import type {TaskDTO} from "../../dtos/task.dto.js";

async function mapToTasksDTOCollection(entities: TaskEntity[]): Promise<TaskDTO[]> {

    return entities.map( (entity) => (<TaskDTO>{
        id: entity.id,
        title: entity.title,
        description: entity.description,
        priority: entity.priority,
        complete: entity.complete
    }));
}

export const TasksMapperService: TasksMapperInterface = {
     mapToTasksDTOCollection
} as const;
