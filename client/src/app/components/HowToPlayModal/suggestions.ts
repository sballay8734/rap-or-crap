interface Suggestion {
  number: number
  label: string
  type: "rule" | "suggestion" | "objective" | "list"
  bgColor: string
  textColor: string
  description?: string
  elements?: {
    label: string
    description: string
    textColor: string
    showIcon: boolean
  }[]
}

export const suggestions: Suggestion[] = [
  {
    number: 1,
    label: "Main Objective",
    type: "objective",
    bgColor: "bg-primaryInactive",
    textColor: "text-primary",
    description:
      "Decide whether the lyric is real rap or made up. Answer the most questions correctly to win."
  },
  {
    number: 2,
    label: "Players",
    type: "rule",
    bgColor: "bg-primaryInactive",
    textColor: "text-primary",
    description: "2-10"
  },
  {
    number: 3,
    label: "Suggestions",
    type: "list",
    bgColor: "bg-[#FF6B35]",
    textColor: "text-[#FF6B35]",
    elements: [
      {
        label: "Discretion advised",
        description:
          "Naturally, some players may already be familiar with certain lyrics. To maintain the spirit of the game and prevent giving away answers, it's best to refrain from openly acknowledging or discussing your prior knowledge of any lyrics. The element of surprise and suspense is part of the fun!",
        textColor: "text-[#db4444]",
        showIcon: false
      },
      {
        label: "Embrace the rhythm",
        description:
          "Take turns reading or performing the lyrics aloud. If you're feeling freaky, try rapping them with your own flair and cadence! Unleash your inner wordsmith and bring the lyrics to life!",
        textColor: "text-[#db4444]",
        showIcon: false
      },
      {
        label: "Trigger warning",
        description:
          "Some lyrics may seem unconventional, controversial, or even inappropriate. But their purpose is to obscure the line between real and fake. Approach them with an open mind, recognizing the intent is not to offend, but to test your ability to discern authentic rap lyrics.",
        textColor: "text-[#db4444]",
        showIcon: true
      }
    ]
  }
]
