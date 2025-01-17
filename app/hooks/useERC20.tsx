import { ethers } from 'ethers';
import { useMoralis } from 'react-moralis';
import ERC20 from '../contracts/mumbai/erc20.json';
import { useGlobal } from '../context/globalContext';

export default function useERC20() {
  const {
    state: { registry },
  } = useGlobal();
  const { user } = useMoralis();

  function isCurrency(address: string) {
    return address === '0x0';
  }

  function getERC20Contract(address: string) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return new ethers.Contract(address, ERC20.abi, provider.getSigner());
  }

  async function approve(chainId: string, erc20Address: string) {
    const contract = getERC20Contract(erc20Address);

    const tx = await contract.approve(
      registry[chainId].distributorAddress,
      ethers.constants.MaxInt256
    );
    return tx.wait();
  }

  async function isApproved(
    erc20Address: string,
    spenderAddress: string,
    value: number,
    ethAddress: string
  ) {
    if (isCurrency(erc20Address)) {
      return true;
    }
    const contract = getERC20Contract(erc20Address);

    const allowance = await contract.allowance(ethAddress, spenderAddress);
    return parseFloat(ethers.utils.formatEther(allowance)) >= value;
  }

  return {
    approve,
    isApproved,
    isCurrency,
  };
}
