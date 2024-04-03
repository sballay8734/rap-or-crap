interface CBtnProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  color: string
}

export default function CBtn({
  children,
  onClick,
  className = "",
  color
}: CBtnProps) {
  // FIXME: You should not generate tailwind classes like this (See source)
  // https://tailwindcss.com/docs/content-configuration
  const bgClass = `bg-[${color}]`

  const baseClasses = `text-white py-2 px-4 rounded-sm transition duration-150 ease-in-out opacity-100 hover:opacity-90 active:opacity-80 ${bgClass}`

  const buttonClasses = `${baseClasses} ${className}`

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  )
}
