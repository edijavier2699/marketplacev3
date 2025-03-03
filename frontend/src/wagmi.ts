
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, polygon,mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Tokunize',
  projectId: '12184fc228d5cf049f0dc62830574ffc',
  chains: [ polygon, arbitrum, mainnet],
});
