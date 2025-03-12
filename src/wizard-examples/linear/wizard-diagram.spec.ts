import test from 'ava'
import { saveNomnomlDiagramAsSvg } from '../../core/nomnoml/save-as-svg.js'
import { generateWizardDiagram } from '../../wizard-config/generate-diagram.js'
import { Wizard } from './wizard.js'

test(`should generate diagram given wizard state`, async (t) => {
  const input = generateWizardDiagram({
    wizard: Wizard,
    diagramName: 'Linear Wizard Example'
  })

  await saveNomnomlDiagramAsSvg({ input, path: __filename })

  t.pass('should save nomnoml diagram to disk')
})
