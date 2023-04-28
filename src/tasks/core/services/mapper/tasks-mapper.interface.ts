import type {TaskDTO} from "../../dtos/task.dto.js";
import type {TaskEntity} from "../../entities/task.entity.js";

export interface TasksMapperInterface {
    mapToTasksDTOCollection(entities: TaskEntity[]): Promise<TaskDTO[]>;
}
