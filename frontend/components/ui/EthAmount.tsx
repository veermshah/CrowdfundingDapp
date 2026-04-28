'use client'

import { useState } from 'react'
import { fmtEth, fmtUsd } from '@/lib/format'

type Props = {
  wei: bigint
  ethPrice: number | null
  className?: string
  usdClassName?: string
  prefix?: string
}

export function EthAmount({
  wei,
  ethPrice,
  className = '',
  usdClassName = 'text-emerald-400',
  prefix = '',
}: Props) {
  const [hovered, setHovered] = useState(false)
  const eth = `${prefix}${fmtEth(wei)} ETH`
  const usd = fmtUsd(wei, ethPrice)

  if (!usd) return <span className={className}>{eth}</span>

  return (
    <span
      className={`relative inline-flex h-[1.25em] min-w-max overflow-hidden align-middle cursor-default ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span aria-hidden="true" className="invisible whitespace-nowrap">
        {eth}
      </span>
      <span
        className={`absolute inset-0 flex items-center transition-transform duration-300 ease-in-out ${
          hovered ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {eth}
      </span>
      <span
        className={`absolute inset-0 flex items-center transition-transform duration-300 ease-in-out ${
          hovered ? 'translate-y-0' : 'translate-y-full'
        } ${usdClassName}`}
      >
        {usd}
      </span>
    </span>
  )
}
