import { ipcMain } from 'electron'
import { execTask } from './tasks/tasks.js'

ipcMain.handle('execTask', (ev, args) => execTask(args.task, { input: JSON.stringify(args.input) }))
