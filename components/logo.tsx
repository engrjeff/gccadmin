import Image from "next/image"

function Logo({ size = 48 }: { size?: number }) {
  return (
    <Image
      src="/gcc-logo.svg"
      alt="gcc system"
      className="object-cover"
      width={size}
      height={size}
    />
  )
}

export default Logo
