import { readdir, rmdir } from 'fs/promises'
import { posixify } from '../utils/posixify.js'
import { arrayify } from '../utils/arrayify.js'

let dirsToClean = process.env.input ? JSON.parse(process.env.input) : [process.cwd()]
dirsToClean = arrayify(dirsToClean)
const dirsCleaned = []
try {
  const remove = async (actions = []) => {
    actions = await Promise.allSettled(
      dirsToClean.map(async (file) => {
        await rmdir(file)
        return file
      })
    )
    const promises = []

    for (const { status, value, reason } of actions) {
      if (status === 'fulfilled') {
        const task = async () => {
          dirsToClean.splice(dirsToClean.indexOf(value), 1)
          dirsCleaned.push(value)
          const parts = value.split('/')
          parts.pop()
          const path = parts.join('/')
          const dir = await readdir(path)
          if (!dir) console.log({ value })
          if (dir.length === 0) dirsToClean.push(path)
        }
        promises.push(task())
      } else {
        if (reason.code === 'ENOENT') {
          const task = async () => {
            dirsToClean.splice(dirsToClean.indexOf(posixify(reason.path)), 1)
            const parts = posixify(reason.path).split('/')
            parts.pop()
            const path = parts.join('/')
            const dir = await readdir(path)
            if (!dir) console.log({ value })
            if (dir.length === 0) dirsToClean.push(path)
          }
          promises.push(task())
        }
      }
    }
    await Promise.allSettled(promises)
    if (dirsToClean.length !== 0) return remove()
  }

  await remove()
} catch (error) {
  console.error(error)
}

console.log(`ms-remove-empty-dirs start
  ${JSON.stringify(dirsCleaned ?? [])}
  ms-remove-empty-dirs end`)
// spinner.stop()
