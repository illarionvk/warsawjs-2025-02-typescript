// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const makeWizardConfig = <WizardState extends { step: string }>() => {
  type WizardSteps = WizardState['step']

  return {
    /**
     * A wizard can have only one starting point (head)
     *
     * So first we have to specify which state is going to the head of the wizard.
     */
    selectInitialStep: <HeadStep extends WizardSteps>(headStep: HeadStep) => {
      const makeStep = <CurrentStep extends WizardSteps>(step: CurrentStep) => {
        type CurrentState = Extract<WizardState, { step: CurrentStep }>

        /**
         * For brevity, we limit the number of target the developer can specify to 4
         * But this type can be extended to support more targets
         */
        type Targets =
          | [Exclude<WizardSteps, CurrentStep>]
          | [
              Exclude<WizardSteps, CurrentStep>,
              Exclude<WizardSteps, CurrentStep>
            ]
          | [
              Exclude<WizardSteps, CurrentStep>,
              Exclude<WizardSteps, CurrentStep>,
              Exclude<WizardSteps, CurrentStep>
            ]
          | [
              Exclude<WizardSteps, CurrentStep>,
              Exclude<WizardSteps, CurrentStep>,
              Exclude<WizardSteps, CurrentStep>,
              Exclude<WizardSteps, CurrentStep>
            ]

        type PrevNavTarget = { targets: Targets }
        type NextNavTarget = { targets: Targets }

        type HeadNavState = {
          type: 'head'
          next: NextNavTarget
          previous: null
        }

        type NodeNavState =
          | {
              type: 'tail'
              next: null
              previous: PrevNavTarget
            }
          | {
              type: 'node'
              next: NextNavTarget
              previous: PrevNavTarget
            }

        /**
         * This ensures the developer cannot set wrong type of `tail`/`node`
         * for the step they chose as head in `selectInitialStep`
         */
        type NavState = CurrentStep extends HeadStep
          ? HeadNavState
          : NodeNavState

        return {
          defineNavigation: <Nav extends NavState>(nav: Nav) => {
            type NextTargets = Nav['next'] extends NextNavTarget
              ? Nav['next']['targets'][number]
              : null

            type NextState = NextTargets extends WizardSteps
              ? Extract<WizardState, { step: NextTargets }>
              : CurrentState

            type PrevTargets = Nav['previous'] extends PrevNavTarget
              ? Nav['previous']['targets'][number]
              : null

            type PrevState = PrevTargets extends WizardSteps
              ? Extract<WizardState, { step: PrevTargets }>
              : CurrentState

            return {
              defineLogic: <UserInput extends Record<string, unknown> | null>({
                inferNextState,
                inferPrevState
              }: {
                inferNextState: (
                  state: CurrentState,
                  userInput: UserInput
                ) => NextState
                inferPrevState: (state: CurrentState) => PrevState
              }) => {
                return {
                  step,
                  nav,
                  inferNextState,
                  inferPrevState
                }
              }
            }
          }
        }
      }

      type InitialState = Extract<WizardState, { step: HeadStep }>
      type BaseWizard = { [Step in WizardSteps]: { step: Step } }

      return {
        defineSteps: <FinalWizard extends BaseWizard>(
          makeAllSteps: (helpers: {
            makeStep: typeof makeStep
          }) => FinalWizard
        ) => {
          return {
            compile: () => {
              const allSteps = makeAllSteps({ makeStep })

              const head = allSteps[headStep]

              const parseInitialState = (
                initialState: InitialState
              ): InitialState => {
                return initialState
              }

              return {
                allSteps,
                head,
                makeInitialState: parseInitialState
              }
            }
          }
        }
      }
    }
  }
}
