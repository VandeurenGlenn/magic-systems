export const arrayify = (input) => {
  console.log({ input })

  if (typeof input === 'string' && input.startsWith('[') && input.endsWith(']')) input = JSON.parse(input)
  if (!Array.isArray(input)) input = [input]
  return input
}
