import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import sudo from 'sudo-prompt'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const execTask = (task, env): Promise<string[]> =>
  new Promise((resolve, reject) => {
    const options = {
      name: 'Magic Systems Clean',
      env
      // icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
    }
    console.time(task)
    sudo.exec(`node ${join(__dirname, `tasks/${task}.js`)}`, options, function (error, stdout, stderr) {
      console.log({ error })

      if (error) reject(error)

      const string = stdout.toString()
      const result = string
        .slice(
          string.indexOf(`ms-${task} start`) + `ms-${task} start`.length + 1,

          string.length - `ms-${task} end`.length - 1
        )
        .trim()

      console.timeEnd(task)
      resolve(JSON.parse(result))
    })
  })
