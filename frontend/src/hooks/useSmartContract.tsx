import { ethers } from 'ethers';

// Suponiendo que MetaMask está disponible en el navegador
const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;

// La función para verificar la red
const checkNetwork = async () => {
  if (provider) {
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== 421614) { // Arbitrum Sepolia Testnet ID
      throw new Error("Por favor, cambia a la red Arbitrum Sepolia Testnet.");
    }
  } else {
    console.error("Provider is not available.");
    throw new Error("No se pudo conectar al proveedor. Asegúrate de que MetaMask esté instalado.");
  }
};


// La función getContractInstance que ahora incluye la verificación de red
const useSmartContract = async (contractAddress: string, contractAbi: any) => {
  try {
    // Verificar si MetaMask está disponible
    if (!window.ethereum) {
      throw new Error("MetaMask no está instalado. Por favor, instálalo para continuar.");
    }

    // Validar la dirección del contrato
    if (!ethers.isAddress(contractAddress)) {
      throw new Error("Dirección del contrato inválida. Por favor, verifica y vuelve a intentar.");
    }

    // Validar si la ABI está presente
    if (!contractAbi || typeof contractAbi !== "object") {
      throw new Error("El ABI proporcionado no es válido. Asegúrate de que esté correctamente configurado.");
    }

    // Verificar la red antes de proceder
    await checkNetwork();

    // Configurar el proveedor y el firmante
    const provider = new ethers.BrowserProvider(window.ethereum); // ethers v6
    await provider.send("eth_requestAccounts", []); // Solicitar acceso a las cuentas
    const signer = await provider.getSigner(); // Obtener el firmante conectado

    // Crear la instancia del contrato
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    return contractInstance;
  } catch (error) {
    console.error("Error al obtener la instancia del contrato:", error);
    throw error; // Lanzar el error para manejarlo en donde se llame la función
  }
};

export default useSmartContract;
