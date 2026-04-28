'use client'

import { useState, useEffect } from 'react'

export function useEthPrice(): number | null {
  const [price, setPrice] = useState<number | null>(null)

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then((r) => r.json())
      .then((data) => setPrice(data.ethereum.usd))
      .catch(() => {})
  }, [])

  return price
}
