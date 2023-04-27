import type {TaskDTO} from "../core/dtos/task.dto.js";

export interface TasksDriverPorts {
    getAll(): Promise<TaskDTO[]>;
}
