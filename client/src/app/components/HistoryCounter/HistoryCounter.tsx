import { FaCheckCircle } from "react-icons/fa"
import { IoMdCloseCircle } from "react-icons/io"

interface HistoryCounterProps {
  result: boolean
}

export default function HistoryCounter({ result }: HistoryCounterProps) {
  if (result === false) {
    return <IoMdCloseCircle className="text-red-500 rounded-full h-[0.7rem]" />
  } else {
    return <FaCheckCircle className="text-green-500 rounded-full h-[0.6rem]" />
  }
}
