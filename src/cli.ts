import { execTask } from './tasks/tasks.js'

let input = process.cwd()
for (const key of process.argv) {
  if (key === '--input') {
    input = process.argv[process.argv.indexOf(key) + 1]
  }
}

const emptyDirs = await execTask('get-empty-dirs', { input })
console.log({ emptyDirs })

if (emptyDirs.length > 0) {
  const removedDirs = await execTask('remove-empty-dirs', { input: JSON.stringify(emptyDirs) })
  console.log({ removedDirs })
}
