import { z } from 'zod'
import { makeWizardConfig } from '../../wizard-config/index.js'

const WizardState = z.discriminatedUnion('step', [
  z.object({
    step: z.literal('start'),
    name: z.string().min(1).nullable()
  }),
  z.object({
    step: z.literal('middle'),
    name: z.string().min(1),
    lastname: z.string().min(1).nullable()
  }),
  z.object({
    step: z.literal('end'),
    name: z.string().min(1),
    lastname: z.string().min(1)
  })
])
type WizardState = z.infer<typeof WizardState>

export const Wizard = makeWizardConfig<WizardState>()
  .selectInitialStep('start')
  .defineSteps(({ makeStep }) => {
    return {
      start: makeStep('start')
        .defineNavigation({
          type: 'head',
          next: {
            targets: ['middle']
          },
          previous: null
        })
        .defineLogic({
          inferNextState: (_, { name }: { name: string }) => {
            return { step: 'middle', name, lastname: null }
          },
          inferPrevState: (state) => state
        }),
      middle: makeStep('middle')
        .defineNavigation({
          type: 'node',
          next: {
            targets: ['end']
          },
          previous: {
            targets: ['start']
          }
        })
        .defineLogic({
          inferNextState: ({ name }, { lastname }: { lastname: string }) => {
            return { step: 'end', name, lastname }
          },
          inferPrevState: ({ name }) => {
            return { step: 'start', name }
          }
        }),
      end: makeStep('end')
        .defineNavigation({
          type: 'tail',
          next: null,
          previous: {
            targets: ['middle']
          }
        })
        .defineLogic({
          inferNextState: (state) => state,
          inferPrevState: ({ name, lastname }) => {
            return { step: 'middle', name, lastname }
          }
        })
    }
  })
  .compile()
