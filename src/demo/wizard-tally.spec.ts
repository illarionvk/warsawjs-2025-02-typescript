import test from 'ava'
import { Deck, _Deck } from './deck.js'
import { type PlayerCards, Wizard } from './wizard.js'

type Expected =
  | 'dealer_busts'
  | 'player_busts'
  | 'tie'
  | 'higher_hand:dealer'
  | 'higher_hand:player'

const macro = test.macro<
  [
    actual: { dealerCards: PlayerCards; playerCards: PlayerCards },
    expected: Expected
  ]
>({
  exec: (t, input, expected) => {
    const state = Wizard.allSteps.tally.inferNextState(
      {
        step: 'tally',
        deck: Deck,
        ...input
      },
      null
    )

    const actual: Expected =
      state.step === 'higher_hand' ? `higher_hand:${state.winner}` : state.step

    t.is(actual, expected)
  },
  title: (providedTitle = '', input, expected) => {
    return `given dealer's ${input.dealerCards.join(' ')} vs player's ${input.playerCards.join(' ')} => ${expected} ${providedTitle}`.trim()
  }
})

test(
  macro,
  {
    dealerCards: [_Deck.enum['10♥'], _Deck.enum['A♦']],
    playerCards: [_Deck.enum['10♠'], _Deck.enum['2♣'], _Deck.enum['A♠']]
  },
  'player_busts'
)

test(
  macro,
  {
    dealerCards: [_Deck.enum['10♠'], _Deck.enum['2♣'], _Deck.enum['A♠']],
    playerCards: [_Deck.enum['10♥'], _Deck.enum['A♦']]
  },
  'dealer_busts'
)

test(
  macro,
  {
    dealerCards: [_Deck.enum['10♠'], _Deck.enum['2♣'], _Deck.enum['2♦']],
    playerCards: [_Deck.enum['10♥'], _Deck.enum['4♦']]
  },
  'tie'
)

test(
  macro,
  {
    dealerCards: [_Deck.enum['10♠'], _Deck.enum['5♣']],
    playerCards: [_Deck.enum['10♥'], _Deck.enum['4♦']]
  },
  'higher_hand:dealer'
)

test(
  macro,
  {
    dealerCards: [_Deck.enum['10♠'], _Deck.enum['5♣']],
    playerCards: [_Deck.enum['10♥'], _Deck.enum['8♦']]
  },
  'higher_hand:player'
)
