// NOTE: See this documentation for properly generating dynamic class names
// https://tailwindcss.com/docs/content-configuration
type height =
  | 0
  | 50
  | 100
  | 150
  | 200
  | 250
  | 300
  | 350
  | 400
  | 450
  | 500
  | 550
  | 600
  | 650
  | 700
  | 750
  | 800
  | 850
  | 900
  | 950
  | 1000

interface SkeletonLoaderProps {
  heights?: height[]
  color?: string
  className?: string
}

const heightMap = {
  0: "h-0", // used for spacing
  50: "h-[50px]",
  100: "h-[100px]",
  150: "h-[150px]",
  200: "h-[200px]",
  250: "h-[250px]",
  300: "h-[300px]",
  350: "h-[350px]",
  400: "h-[400px]",
  450: "h-[450px]",
  500: "h-[500px]",
  550: "h-[550px]",
  600: "h-[600px]",
  650: "h-[650px]",
  700: "h-[700px]",
  750: "h-[750px]",
  800: "h-[800px]",
  850: "h-[850px]",
  900: "h-[900px]",
  950: "h-[950px]",
  1000: "h-[1000px]"
}

// Heights must be a valid tailwind height
export default function SkeletonLoader({
  heights = [],
  className = ""
}: SkeletonLoaderProps) {
  if (heights.length === 1 || heights.length === 0) {
    return <div>DEFAULT</div>
  }

  const itemsToRender = heights.map((item, index) => {
    return (
      <div
        key={index}
        className={`w-full ${heightMap[item]} bg-[#bcbcbc] rounded-sm relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#bcbcbc] via-[#d3d3d3] to-[#bcbcbc] animate-skeleton" />
      </div>
    )
  })

  return (
    <div className="flex flex-col w-full h-svh gap-4 overflow-hidden">
      {itemsToRender}
    </div>
  )
}
