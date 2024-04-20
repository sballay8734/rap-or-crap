interface Suggestion {
  number: number
  label: string
  type: "rule" | "suggestion" | "objective" | "list"
  color: string
  description?: string
  elements?: { label: string; description: string }[]
}

export const suggestions: Suggestion[] = [
  {
    number: 1,
    label: "Objective",
    type: "objective",
    color: "#028a00", // green TEMP
    description:
      "Decide whether the lyric is real rap or made up. Answer the most questions correctly to win."
  },
  {
    number: 2,
    label: "Players",
    type: "rule",
    color: "#028a00", // green TEMP
    description: "2-10"
  },
  {
    number: 3,
    label: "Suggestions",
    type: "list",
    color: "#028a00",
    elements: [{ label: "", description: "" }]
  },
  {
    number: 98,
    label: "Discretion advised",
    type: "suggestion",
    color: "#ff0000", // red
    description:
      "Naturally, some players may already be familiar with certain lyrics. To maintain the spirit of the game and prevent giving away answers, it's best to refrain from openly acknowledging or discussing your prior knowledge of any lyrics. The element of surprise and suspense is part of the fun!"
  },
  {
    number: 99,
    label: "Embrace the rhythm",
    type: "suggestion",
    color: "#028a00", // green TEMP
    description:
      "Take turns reading or performing the lyrics aloud. If you're feeling freaky, try rapping them with your own flair and cadence! Unleash your inner wordsmith and bring the lyrics to life!"
  }
]
