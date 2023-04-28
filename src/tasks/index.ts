import {TasksService} from "./tasks.service.js";
import {TasksReaderAdapter} from "./driven-adapters/tasks-reader.adapter.js";

export default TasksService(TasksReaderAdapter());
