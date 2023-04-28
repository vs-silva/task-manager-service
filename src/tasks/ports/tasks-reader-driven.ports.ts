import type {TaskEntity} from "../core/entities/task.entity.js";

export interface TasksReaderDrivenPorts {
    getAll(): Promise<TaskEntity[]>;
}
