// import { useState } from 'react';
// import { ethers } from 'ethers';
// import contractAbi from "../../contracts/property_investment_abi.json";  // Asegúrate de que este ABI esté correctamente configurado
// import usdcAbi from "../../contracts/usdc_abi.json";  // Asegúrate de que este ABI esté correctamente configurado para USDC

// // Dirección del contrato de USDC en Sepolia Testnet
// const usdcAddress = "0xdC48A996F3073d4ADAB7f77B42162c284801A6d9"; // Aquí debes poner la dirección del contrato USDC en Sepolia Testnet

// // 0x15a6776EA0968F69303258B0698BAA9833d99Ea8 old contract-working

// const GetContract = () => {
//   const [contractAddress, setContractAddress] = useState<string>('0xD7a4b3e38B43453641F6e7e2b924F9937706E90B');
//   const [usdcAmount, setUsdcAmount] = useState<string>('');  // Monto de USDC a invertir
//   const [error, setError] = useState<string | null>(null);
//   const [contractData, setContractData] = useState<any>(null);

//   // Suponiendo que MetaMask está disponible en el navegador
//   const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null;
//   const signer = provider ? provider.getSigner() : null;

//   // Verificamos si MetaMask está conectado a la red correcta
//   const checkNetwork = async () => {
//     const network = await provider?.getNetwork();
//     if (network?.chainId !== 11155111) {  // Sepolia Testnet ID
//       throw new Error("Por favor, cambia a la red Sepolia Testnet.");
//     }
//   };

//   // Función para aprobar el uso de USDC
//   const approveUSDC = async () => {
//     try {
//       if (!signer) throw new Error('No se puede acceder al firmante de la transacción.');
//       if (!ethers.utils.isAddress(usdcAddress)) {
//         throw new Error('La dirección de USDC no es válida.');
//       }
  
//       // Convertimos 1 USDC a mUSDC (1 USDC = 10^6 mUSDC)
//       const usdcAmountInWei = ethers.utils.parseUnits("1", 6); // 6 decimales para USDC
  
//       const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, signer);
  
//       // Aprobamos el contrato para gastar solo 1 USDC
//       const transaction = await usdcContract.approve(contractAddress, usdcAmountInWei);
  
//       console.log('Esperando confirmación...');
//       await transaction.wait();
  
//       console.log('Aprobación exitosa para 1 USDC.');
//     } catch (err) {
//       console.error('Error en la aprobación:', err);
//       throw new Error('Error al aprobar USDC.');
//     }
//   };
  

//   // Función para interactuar con el contrato y hacer la inversión
//   const investInContract = async () => {
//     try {
//       if (!usdcAmount || isNaN(Number(usdcAmount)) || Number(usdcAmount) <= 0) {
//         throw new Error('Por favor ingresa una cantidad válida de USDC.');
//       }

//       if (!contractAddress) {
//         throw new Error('Por favor ingresa una dirección de contrato.');
//       }

//       if (!provider || !signer) {
//         throw new Error('No se puede acceder a MetaMask. Asegúrate de tenerlo instalado.');
//       }

//       // Verificamos la red de MetaMask
//       await checkNetwork();

//       // Crear una instancia del contrato de inversión (solo si el signer no es null)
//       const contract = new ethers.Contract(contractAddress, contractAbi, signer!);  // Usamos 'signer!' para asegurar que no es null

//       // Convertir el monto a un BigNumber (usando 18 decimales para USDC)
//       const usdcAmountInWei = usdcAmount; // Mantén el valor tal cual sin convertir

//       // Asegurarse de que el contrato esté listo para recibir la inversión
//       console.log('Llamando a la función invest con el monto:', usdcAmountInWei.toString());

//       // Aprobamos el uso de USDC antes de llamar a la función invest
//       await approveUSDC();

//       // Llamar a la función 'invest' en el contrato
//       const transaction = await contract.invest(usdcAmountInWei, {
//         gasLimit: 1000000,  // Ajusta el límite de gas según sea necesario
//       });

//       // Esperar a que la transacción sea confirmada
//       await transaction.wait();

//       // Actualizar los datos del contrato (puedes obtener más información si es necesario)
//       setContractData({ goal: (await contract.goal()).toString() });
//       setUsdcAmount('');  // Limpiar el campo de cantidad invertida
//       setError(null);

//       alert('Inversión realizada con éxito!');
//     } catch (err) {
//       setError(`Error al realizar la inversión: ${err instanceof Error ? err.message : 'Error desconocido'}`);
//       console.error(err);
//     }
//   };

//   return (
//     <div>      
//         <button type="button" onClick={investInContract}>
//           Invest
//         </button>
//     </div>
//   );
// };

// export default GetContract;
