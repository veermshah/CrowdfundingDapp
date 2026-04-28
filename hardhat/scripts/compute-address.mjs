import { getContractAddress } from 'viem'

const address = getContractAddress({
  from: '0xe01597dd65cafa998d79db62999bfb0d8a79d2fb',
  nonce: 21n,
})

console.log(address)
