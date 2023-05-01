import type {TasksWriterDrivenPorts} from "../ports/tasks-writer-driven.ports.js";
import type {TaskEntity} from "../core/entities/task.entity.js";
import MockInMemoryDb from "../../data-provider/mock-in-memory.db.js";

export function TasksWriterAdapter(): TasksWriterDrivenPorts {

    async function save(entity: TaskEntity): Promise<void> {

        const task: TaskEntity | undefined = MockInMemoryDb.tasks.find( (task:TaskEntity ) => task.id === entity.id);

        if(!task) {
            (MockInMemoryDb.tasks as TaskEntity[]).push(entity);
            return;
        }

        Object.assign(task,  entity);
        return;
    }

    async function erase(id: string): Promise<void> {

        const index = MockInMemoryDb.tasks.findIndex((task: TaskEntity ) => task.id.trim() === id);
        MockInMemoryDb.tasks.splice(index, 1);
        return;
    }

    return {
        save,
        erase
    };
}
