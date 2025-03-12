import Path from 'path'
import fs from 'fs/promises'
import * as nomnoml from 'nomnoml'
import { optimize } from 'svgo'

export const saveNomnomlDiagramAsSvg = async ({
  input,
  path
}: { input: string; path: string }): Promise<void> => {
  const _output: string = nomnoml.renderSvg(input)
  const { data: output } = optimize(_output, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            removeDesc: { removeAny: true }
          }
        }
      }
    ]
  })

  const filepath = path
    .replace('test-out', 'src')
    .replace(Path.extname(path), '.svg')

  await fs.writeFile(filepath, output, { encoding: 'utf-8' })
}
