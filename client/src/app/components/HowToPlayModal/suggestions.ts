interface Suggestion {
  number: number
  label: string
  type: "rule" | "suggestion"
  color: string
  description: string
}

export const suggestions: Suggestion[] = [
  {
    number: 1,
    label: "The ONLY rule",
    type: "rule",
    color: "#4f5eff", // blue
    description: "Each game can only contain a maximum of 10 players."
  },
  {
    number: 2,
    label: "Discretion advised",
    type: "suggestion",
    color: "#ff0000", // red
    description:
      "Naturally, some players may already be familiar with certain lyrics. To maintain the spirit of the game and prevent giving away answers, it's best to refrain from openly acknowledging or discussing your prior knowledge of any lyrics. The element of surprise and suspense is part of the fun!"
  },
  {
    number: 3,
    label: "Embrace the rhythm",
    type: "suggestion",
    color: "#028a00", // green TEMP
    description:
      "Take turns reading or performing the lyrics aloud. If you're feeling freaky, try rapping them with your own flair and cadence! Unleash your inner wordsmith and bring the lyrics to life!"
  }
]
