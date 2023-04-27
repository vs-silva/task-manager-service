import type {TasksDriverPorts} from "./ports/tasks-driver.ports.js";
import type {TaskDTO} from "./core/dtos/task.dto.js";

export function TasksService(): TasksDriverPorts {

    async function getAll(): Promise<TaskDTO[]> {
        return Promise.resolve(<TaskDTO[]>[{
            id: 'dsads',
            title: 'some',
            description: 'dsome',
            priority: 'low',
            complete: false
        }]);
    }

    return {
        getAll
    };
}
