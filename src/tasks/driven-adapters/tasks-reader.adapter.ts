import type {TasksReaderDrivenPorts} from "../ports/tasks-reader-driven.ports.js";
import type {TaskEntity} from "../core/entities/task.entity.js";
import MockInMemoryDb from "../../data-provider/mock-in-memory.db.js";

export function TasksReaderAdapter(): TasksReaderDrivenPorts {

    async function  getAll(): Promise<TaskEntity[]> {
        return Promise.resolve(MockInMemoryDb.tasks);
    }

    return {
        getAll
    };
}
