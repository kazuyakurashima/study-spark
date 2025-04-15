import Image from "next/image"

interface SparkIconProps {
  className?: string
  size?: number
}

export function SparkIcon({ className = "", size = 24 }: SparkIconProps) {
  return <Image src="/icons/spark-icon.svg" width={size} height={size} alt="Spark Icon" className={className} />
}
