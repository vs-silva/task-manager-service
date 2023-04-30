import type {TaskEntity} from "../core/entities/task.entity.js";

export interface TasksWriterDrivenPorts {
    save(entity: TaskEntity): Promise<void>;
    erase(id: string): Promise<void>;
}
