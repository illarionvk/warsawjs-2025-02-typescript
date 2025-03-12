import { z } from 'zod'
import { makeWizardConfig } from '../../wizard-config/index.js'

const BicycleType = z.enum(['road', 'trekking'])
type BicycleType = z.infer<typeof BicycleType>

const TrekkingAccessory = z.enum(['none', 'panniers', 'trailer'])
type TrekkingAccessory = z.infer<typeof TrekkingAccessory>

const WizardState = z.discriminatedUnion('step', [
  z.object({
    step: z.literal('select-bicycle-type'),
    bicycleType: BicycleType.nullable()
  }),
  z.object({
    step: z.literal('select-free-trekking-accessory'),
    bicycleType: z.literal(BicycleType.enum.trekking),
    freeAccessory: TrekkingAccessory.nullable()
  }),
  z.object({
    step: z.literal('summary'),
    bicycleType: BicycleType,
    freeAccessory: TrekkingAccessory
  })
])
type WizardState = z.infer<typeof WizardState>

export const Wizard = makeWizardConfig<WizardState>()
  .selectInitialStep('select-bicycle-type')
  .defineSteps(({ makeStep }) => {
    return {
      'select-bicycle-type': makeStep('select-bicycle-type')
        .defineNavigation({
          type: 'head',
          next: {
            targets: ['select-free-trekking-accessory', 'summary']
          },
          previous: null
        })
        .defineLogic({
          inferNextState: (
            _,
            { bicycleType }: { bicycleType: BicycleType }
          ) => {
            if (bicycleType === 'road') {
              return { step: 'summary', bicycleType, freeAccessory: 'none' }
            }

            bicycleType satisfies 'trekking'

            return {
              step: 'select-free-trekking-accessory',
              bicycleType,
              freeAccessory: null
            }
          },
          inferPrevState: (state) => state
        }),
      'select-free-trekking-accessory': makeStep(
        'select-free-trekking-accessory'
      )
        .defineNavigation({
          type: 'node',
          next: {
            targets: ['summary']
          },
          previous: {
            targets: ['select-bicycle-type']
          }
        })
        .defineLogic({
          inferNextState: (
            { bicycleType },
            { freeAccessory }: { freeAccessory: TrekkingAccessory }
          ) => {
            return { step: 'summary', bicycleType, freeAccessory }
          },
          inferPrevState: ({ bicycleType }) => {
            return { step: 'select-bicycle-type', bicycleType }
          }
        }),
      summary: makeStep('summary')
        .defineNavigation({
          type: 'tail',
          next: null,
          previous: {
            targets: ['select-bicycle-type', 'select-free-trekking-accessory']
          }
        })
        .defineLogic({
          inferNextState: (state) => state,
          inferPrevState: ({ bicycleType, freeAccessory }) => {
            if (bicycleType === 'road') {
              return { step: 'select-bicycle-type', bicycleType }
            }

            bicycleType satisfies 'trekking'

            return {
              step: 'select-free-trekking-accessory',
              bicycleType,
              freeAccessory
            }
          }
        })
    }
  })
  .compile()
