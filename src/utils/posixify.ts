import { win32 } from 'path'

export const posixify = (path: string) => path.replaceAll(/\\|\\\\/g, '/')
