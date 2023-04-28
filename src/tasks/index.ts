import {TasksService} from "./tasks.service.js";
import {TasksReaderAdapter} from "./driven-adapters/tasks-reader.adapter.js";
import {TasksWriterAdapter} from "./driven-adapters/tasks-writer.adapter.js";

export default TasksService(TasksReaderAdapter(), TasksWriterAdapter());
