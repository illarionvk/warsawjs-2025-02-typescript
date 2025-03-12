import { makeWizardConfig } from '../wizard-config/index.js'
import { type Card, Deck, inferHandValue, takeCardFromDeck } from './deck.js'

export type InitialPlayerCards = [Card, Card]
export type PlayerCards = [Card, Card, ...Card[]]

export type NewRoundStep = {
  step: 'new_round'
  deck: Deck
  dealerCards: InitialPlayerCards
  playerCards: InitialPlayerCards
}

export type WizardState =
  | NewRoundStep
  | {
      step: 'player_decision'
      deck: Deck
      playerCards: PlayerCards
      dealerCards: PlayerCards
    }
  | {
      step: 'dealer_decision'
      deck: Deck
      playerCards: PlayerCards
      dealerCards: PlayerCards
    }
  | {
      step: 'tally'
      deck: Deck
      playerCards: PlayerCards
      dealerCards: PlayerCards
    }
  | {
      step: 'tie'
      deck: Deck
      playerCards: PlayerCards
      dealerCards: PlayerCards
    }
  | {
      step: 'dealer_busts'
    }
  | {
      step: 'player_busts'
    }
  | {
      step: 'higher_hand'
      winner: 'dealer' | 'player'
    }

export const inferNewRoundStep = (): NewRoundStep => {
  const { card: firstDealerCard, deck: ___deck } = takeCardFromDeck(Deck)
  const { card: secondDealerCard, deck: __deck } = takeCardFromDeck(___deck)
  const { card: firstPlayerCard, deck: _deck } = takeCardFromDeck(__deck)
  const { card: secondPlayerCard, deck } = takeCardFromDeck(_deck)

  return {
    step: 'new_round',
    deck: deck,
    dealerCards: [firstDealerCard, secondDealerCard],
    playerCards: [firstPlayerCard, secondPlayerCard]
  }
}

export const Wizard = makeWizardConfig<WizardState>()
  .selectInitialStep('new_round')
  .defineSteps(({ makeStep }) => {
    return {
      new_round: makeStep('new_round')
        .defineNavigation({
          type: 'head',
          previous: null,
          next: {
            targets: ['player_decision']
          }
        })
        .defineLogic<null>({
          inferNextState: (state) => {
            return {
              ...state,
              step: 'player_decision'
            }
          },
          inferPrevState: (state) => {
            return state
          }
        }),
      player_decision: makeStep('player_decision')
        .defineNavigation({
          type: 'node',
          previous: {
            targets: ['new_round']
          },
          next: {
            targets: ['dealer_decision']
          }
        })
        .defineLogic<{ action: 'hit' | 'stand' }>({
          inferNextState: (state, userInput: { action: 'hit' | 'stand' }) => {
            if (userInput.action === 'hit') {
              const { card, deck } = takeCardFromDeck(state.deck)

              return {
                ...state,
                deck,
                playerCards: [...state.playerCards, card],
                step: 'dealer_decision'
              }
            }

            return {
              ...state,
              step: 'dealer_decision'
            }
          },
          inferPrevState: inferNewRoundStep
        }),
      dealer_decision: makeStep('dealer_decision')
        .defineNavigation({
          type: 'node',
          previous: {
            targets: ['dealer_busts']
          },
          next: {
            targets: ['tally']
          }
        })
        .defineLogic({
          inferNextState: (state) => {
            const handValue = inferHandValue(state.dealerCards)

            // Dealer should stand if they have 17+ points
            if (handValue >= 17) {
              return {
                ...state,
                step: 'tally'
              }
            }

            // Dealer should hit if they have less than 17 points
            const { card, deck } = takeCardFromDeck(state.deck)

            return {
              ...state,
              deck,
              dealerCards: [...state.dealerCards, card],
              step: 'tally'
            }
          },
          inferPrevState: () => {
            return { step: 'dealer_busts' }
          }
        }),
      tally: makeStep('tally')
        .defineNavigation({
          type: 'node',
          previous: {
            targets: ['new_round']
          },
          next: {
            targets: ['dealer_busts', 'player_busts', 'higher_hand', 'tie']
          }
        })
        .defineLogic<null>({
          inferNextState: (state) => {
            const dealerHandValue = inferHandValue(state.dealerCards)
            const playerHandValue = inferHandValue(state.playerCards)

            if (playerHandValue > 21) {
              return { step: 'player_busts' }
            }

            if (dealerHandValue > 21) {
              return { step: 'dealer_busts' }
            }

            if (dealerHandValue === playerHandValue) {
              return { ...state, step: 'tie' }
            }

            return {
              step: 'higher_hand',
              winner: dealerHandValue > playerHandValue ? 'dealer' : 'player'
            }
          },
          inferPrevState: inferNewRoundStep
        }),
      dealer_busts: makeStep('dealer_busts')
        .defineNavigation({
          type: 'tail',
          previous: {
            targets: ['new_round']
          },
          next: null
        })
        .defineLogic({
          inferNextState: (state) => state,
          inferPrevState: inferNewRoundStep
        }),
      player_busts: makeStep('player_busts')
        .defineNavigation({
          type: 'tail',
          previous: {
            targets: ['new_round']
          },
          next: null
        })
        .defineLogic({
          inferNextState: (state) => state,
          inferPrevState: inferNewRoundStep
        }),
      higher_hand: makeStep('higher_hand')
        .defineNavigation({
          type: 'tail',
          previous: {
            targets: ['new_round']
          },
          next: null
        })
        .defineLogic<null>({
          inferNextState: (state) => state,
          inferPrevState: inferNewRoundStep
        }),
      tie: makeStep('tie')
        .defineNavigation({
          type: 'node',
          previous: {
            targets: ['new_round']
          },
          next: {
            targets: ['player_decision']
          }
        })
        .defineLogic<null>({
          inferNextState: (state) => {
            return {
              ...state,
              step: 'player_decision'
            }
          },
          inferPrevState: inferNewRoundStep
        })
    }
  })
  .compile()
