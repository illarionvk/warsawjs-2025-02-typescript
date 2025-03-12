import { z } from 'zod'

export const _Deck = z.enum([
  '2♠',
  '2♣',
  '2♥',
  '2♦',
  '3♠',
  '3♣',
  '3♥',
  '3♦',
  '4♠',
  '4♣',
  '4♥',
  '4♦',
  '5♠',
  '5♣',
  '5♥',
  '5♦',
  '6♠',
  '6♣',
  '6♥',
  '6♦',
  '7♠',
  '7♣',
  '7♥',
  '7♦',
  '8♠',
  '8♣',
  '8♥',
  '8♦',
  '9♠',
  '9♣',
  '9♥',
  '9♦',
  '10♠',
  '10♣',
  '10♥',
  '10♦',
  'A♠',
  'A♣',
  'A♥',
  'A♦',
  'J♠',
  'J♣',
  'J♥',
  'J♦',
  'K♠',
  'K♣',
  'K♥',
  'K♦',
  'Q♠',
  'Q♣',
  'Q♥',
  'Q♦'
])

export const Deck = _Deck.options
export type Deck = string[]

export type Card = string

export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export const inferCardValue = (card: string): CardValue => {
  if (card.startsWith('A')) {
    return 11
  }

  if (
    card.startsWith('K') ||
    card.startsWith('Q') ||
    card.startsWith('J') ||
    card.startsWith('10')
  ) {
    return 10
  }

  return card.startsWith('2')
    ? 2
    : card.startsWith('3')
      ? 3
      : card.startsWith('4')
        ? 4
        : card.startsWith('5')
          ? 5
          : card.startsWith('6')
            ? 6
            : card.startsWith('7')
              ? 7
              : card.startsWith('8')
                ? 8
                : 9
}

export const inferHandValue = (cards: string[]): number => {
  return cards.reduce<number>((acc, card) => {
    return acc + inferCardValue(card)
  }, 0)
}

export const takeCardFromDeck = (
  deck: Card[]
): { card: Card; deck: Card[] } => {
  if (deck.length === 0) {
    throw new Error('Cannot take a card from empty deck')
  }

  const randomIndex = Math.floor(Math.random() * deck.length)

  const card = deck[randomIndex]

  if (card == null) {
    throw new Error('Card is invalid')
  }

  // Create a new deck without the selected card (no mutation)
  const newDeck = [
    ...deck.slice(0, randomIndex),
    ...deck.slice(randomIndex + 1)
  ]

  return { card, deck: newDeck }
}
