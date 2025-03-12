/* eslint-disable no-console */

import select from '@inquirer/select'
import { Wizard, type WizardState, inferNewRoundStep } from './wizard.js'

const ask = async (): Promise<'hit' | 'stand' | 'quit'> => {
  const action = await select<'hit' | 'stand' | 'quit'>({
    message: 'What is your decision?',
    default: 'hit',
    choices: [
      {
        value: 'hit',
        name: 'Hit'
      },
      {
        value: 'stand',
        name: 'Stand'
      },
      {
        value: 'quit',
        name: 'Quit'
      }
    ]
  })

  return action
}

const printCards = ({
  dealerCards,
  playerCards
}: Extract<WizardState, { step: 'tally' } | { step: 'player_decision' }>) => {
  console.log(`Dealer's cards: ${dealerCards.join(' ')}`)
  console.log(`Your cards: ${playerCards.join(' ')}`)
}

const run = async () => {
  let running = true
  let state: WizardState = Wizard.makeInitialState(inferNewRoundStep())

  console.log('Welcome!')

  while (running) {
    try {
      if (state.step === 'new_round') {
        console.log('===================')
        console.log('Starting new round!')

        state = Wizard.allSteps[state.step].inferNextState(state, null)
        continue
      }

      if (state.step === 'player_decision') {
        printCards(state)

        const action = await ask()

        if (action === 'quit') {
          console.log('Bye!')
          running = false
          continue
        }

        state = Wizard.allSteps[state.step].inferNextState(state, { action })
        continue
      }

      if (state.step === 'dealer_decision') {
        console.log('Dealer is making a decision...')
        state = Wizard.allSteps[state.step].inferNextState(state, null)
        continue
      }

      if (state.step === 'tally') {
        console.log('Tallying the results...')
        printCards(state)
        state = Wizard.allSteps[state.step].inferNextState(state, null)
        continue
      }

      if (state.step === 'dealer_busts') {
        console.log('Dealer busts! YOU WIN!')
        state = Wizard.allSteps[state.step].inferPrevState(state)
        continue
      }

      if (state.step === 'player_busts') {
        console.log('You bust! Dealer wins!')
        state = Wizard.allSteps[state.step].inferPrevState(state)
        continue
      }

      if (state.step === 'higher_hand') {
        if (state.winner === 'player') {
          console.log('You have the higher hand! YOU WIN!')
        } else {
          console.log('Dealer has the higher hand! Dealer wins!')
        }
        state = Wizard.allSteps[state.step].inferPrevState(state)
        continue
      }

      state.step satisfies 'tie'

      console.log("It's a tie! Playing another round...")
      state = Wizard.allSteps[state.step].inferNextState(state, null)
      continue
    } catch (err: unknown) {
      console.log('Something went wrong...')
      throw err
    }
  }
}

run().catch((err: unknown) => {
  throw err
})
