import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { sepolia } from 'wagmi/chains'
import { hardhatLocal } from './contract'

export const wagmiConfig = createConfig({
  chains: [sepolia, hardhatLocal],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
    [hardhatLocal.id]: http(hardhatLocal.rpcUrls.default.http[0]),
  },
})
