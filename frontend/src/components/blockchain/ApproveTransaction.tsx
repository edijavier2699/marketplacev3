import { ethers } from 'ethers';
import usdcAbi from "../../contracts/usdc_abi.json";  // ABI de USDC
import utilityTokenAbi from "../../contracts/utilityTokenAbi.json";  // ABI del Utility Token

interface Props {
    tokenAmount: number;
    toApproveAddress: string;
    tokenType: "USDC" | "UTILITY";  // Define qué token se usará
}

// Función para verificar la red
const checkNetwork = async (provider: ethers.BrowserProvider) => {
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== 421614) {  // Arbitrum Sepolia Testnet ID
        throw new Error("Por favor, cambia a la red Arbitrum Sepolia Testnet.");
    }
};

export const ApproveTransactionHook = async ({ tokenAmount, toApproveAddress, tokenType }: Props) => {  
    // Direcciones de los tokens
    const tokenAddresses: Record<string, string> = {
        USDC: "0xBb9FfBB3698422EEF326c7680b817D741e6A7a54",
        UTILITY: "0xcB005405C5E27596FD29291Df51cB0b3875Dfde5",
    };

    // ABIs de los tokens
    const tokenAbis: Record<string, any> = {
        USDC: usdcAbi,
        UTILITY: utilityTokenAbi,
    };

    try {
        // Verificar si MetaMask está disponible
        if (!window.ethereum) {
            throw new Error("MetaMask no está instalado. Por favor, instálalo para continuar.");
        }

        // Crear el proveedor y el firmante
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Solicitar acceso a las cuentas
        const signer = await provider.getSigner(); // Obtener el firmante conectado

        // Verificar la red
        await checkNetwork(provider);

        // Obtener dirección y ABI según el tipo de token
        const tokenAddress = tokenAddresses[tokenType]; 
        const tokenAbi = tokenAbis[tokenType];

        // Validar la dirección del token
        if (!ethers.isAddress(tokenAddress)) {
            throw new Error(`La dirección de ${tokenType} no es válida.`);
        }

        // Crear la instancia del contrato del token seleccionado
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

        // Aprobar el contrato para gastar la cantidad especificada de tokens
        const transaction = await tokenContract.approve(toApproveAddress, tokenAmount);

        console.log(`Esperando confirmación de la aprobación de ${tokenType}...`);
        await transaction.wait();

        console.log(`Aprobación exitosa para ${tokenType}.`);
    } catch (err) {
        console.error(`Error en la aprobación de ${tokenType}:`, err);
        throw new Error(`Error al aprobar ${tokenType}.`);
    }
};
