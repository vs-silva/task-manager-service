import type {TaskDTO} from "../core/dtos/task.dto.js";

export interface TasksDriverPorts {
    getAll(): Promise<TaskDTO[]>;
    getById(id: string): Promise<TaskDTO | null>;
    createTask(dto: TaskDTO): Promise<void>;
    removeTask(id: string): Promise<void>;
    updateTask(id: string, dto: TaskDTO): Promise<void>;
}
