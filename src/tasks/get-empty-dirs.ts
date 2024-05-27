import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { posixify } from '../utils/posixify.js'
import { arrayify } from '../utils/arrayify.js'

let input = process.env.input ? JSON.parse(process.env.input) : [process.cwd()]

const output = []

const exclude = file =>
  file.endsWith('Application Data') ||
  file.endsWith("Programma's") ||
  file.endsWith('Programs') ||
  file.endsWith('Windows') ||
  file.endsWith('Temporary Internet Files') ||
  file.endsWith('Geschiedenis') ||
  file.endsWith('history') ||
  file.endsWith('Documents and Settings') ||
  file.endsWith('Default User') ||
  file.endsWith('Cookies') ||
  file.endsWith('Local Settings') ||
  file.endsWith('Menu Start') ||
  file.endsWith('Mijn documenten') ||
  file.endsWith('My documents') ||
  file.endsWith('NetHood') ||
  file.endsWith('Netwerkprinteromgeving') ||
  file.endsWith('Networkprinterspace') ||
  file.endsWith('Recent') ||
  file.endsWith('SendTo') ||
  file.endsWith('Sjablonen') ||
  file.endsWith('Templates') ||
  file.endsWith('Mijn afbeeldingen') ||
  file.endsWith('My pictures') ||
  file.endsWith('Mijn muziek') ||
  file.endsWith('My music') ||
  file.endsWith("Mijn video's") ||
  file.endsWith('My videos') ||
  file.endsWith('System Volume Information') ||
  file.endsWith('Bureaublad') ||
  file.endsWith('Desktop') ||
  file.endsWith('Documenten') ||
  file.endsWith('Documents') ||
  file.includes('Windows Defender Advanced Threat Protection') ||
  file.includes('Windows Defender') ||
  file.includes('ProgramData/Microsoft') ||
  file.includes('cygwin64/dev/fd')
const excludes = file => {
  file = posixify(file)
  return exclude(file)
}
const goTroughDirs = async path => {
  const promises = []
  let directoryContent = await readdir(path)
  if (directoryContent.length === 0) output.push(path)
  else {
    directoryContent = directoryContent.filter(file => !excludes(posixify(join(path, file))))
    const task = async dir => {
      if ((await stat(dir)).isDirectory()) {
        await goTroughDirs(dir)
      }
    }

    for (const dir of directoryContent) {
      promises.push(task(posixify(join(path, dir))))
    }

    await Promise.allSettled(promises)
  }
}

for (const _input of arrayify(input)) {
  await goTroughDirs(posixify(_input))
}

console.log(`ms-get-empty-dirs start
${JSON.stringify(output)}
ms-get-empty-dirs end`)
