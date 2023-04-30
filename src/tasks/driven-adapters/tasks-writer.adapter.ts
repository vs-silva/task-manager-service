import type {TasksWriterDrivenPorts} from "../ports/tasks-writer-driven.ports.js";
import type {TaskEntity} from "../core/entities/task.entity.js";
import MockInMemoryDb from "../../data-provider/mock-in-memory.db.js";

export function TasksWriterAdapter(): TasksWriterDrivenPorts {

    async function save(entity: TaskEntity): Promise<void> {

        const task = MockInMemoryDb.tasks.find(task => task.id === entity.id);

        if(!task) {
            MockInMemoryDb.tasks.push(entity);
            return;
        }

        Object.assign(task,  entity);
        return;
    }

    return {
        save
    };
}
