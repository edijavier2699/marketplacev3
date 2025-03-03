import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TokenFormProps {
  propertyId: number;
  onNext: () => void;
  onBack: () => void;
}

interface FormData {
  token_code: string;
  total_tokens: number | string;
  token_price: number | string;
  goal: number | string;
}

export const CreatePropertySmartContracts: React.FC<TokenFormProps> = ({ onBack }) => {
  
  const [formData, setFormData] = useState<FormData>({
    token_code: '',
    total_tokens: '',
    token_price: '',
    goal: '',
  });


  // Maneja los cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // try {
    //   // Verificar si se tiene una conexión con Ethereum (MetaMask)
    //   if (window.ethereum) {
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const signer = await provider.getSigner();

    //     // Crear una instancia del contrato PropertyFactory
    //     const propertyFactory = new ethers.Contract(propertyFactoryAddress, propertyFactoryABI, signer);

    //     // Convertir valores de formulario a tipos requeridos por el contrato
    //     const initialSupply = ethers.BigNumber.from(total_tokens);
    //     const price = ethers.BigNumber.from(token_price.toString()); // Usar el valor crudo, tal como lo escribes

    //     // Para el goal, usar el valor directamente como BigNumber sin convertirlo a unidades
    //     const goalAmount = ethers.BigNumber.from(goal.toString());

    //     // Escuchar el evento PropertyCreated para obtener las direcciones de los contratos creados
    //     propertyFactory.on("PropertyCreated", (propertyToken, propertyInvestment) => {
    //       console.log("PropertyToken Address:", propertyToken);
    //       console.log("PropertyInvestment Address:", propertyInvestment);

    //       // Actualizar el estado con las direcciones de los contratos
    //       setPropertyTokenAddress(propertyToken);
    //       setPropertyInvestmentAddress(propertyInvestment);
    //     });

    //     // Llamar a la función createProperty para crear los contratos
    //     const tx = await propertyFactory.createProperty(
    //       initialSupply,
    //       price,
    //       "0xdC48A996F3073d4ADAB7f77B42162c284801A6d9",  // Dirección del contrato USDC
    //       "0x188cf47a68f7fba8461249d0ce726f5a073a8a99",  // Dirección del propietario
    //       goalAmount  // Usar el valor bruto del goal
    //     );

    //     // Esperar que la transacción sea confirmada
    //     await tx.wait();
    //     console.log("Transaction successful", tx);

    //     // Resetear formulario después de la transacción exitosa
    //     handleReset();
    //   } else {
    //     console.error("Ethereum provider is not available");
    //   }
    // } catch (error) {
    //   console.error("Error creating property:", error);
    // }
  };

  return (
    <section className="p-6">
      <h1 className="text-xl font-bold mb-4">Create Property Token </h1>
      <form onSubmit={handleSubmit}>
        {/* Token Code */}
        <div className="mb-4">
          <Label htmlFor="token_code" className="block mb-2">Token Code</Label>
          <Input
            type="text"
            name="token_code"
            value={formData.token_code}
            onChange={handleChange}
            id="token_code"
            placeholder="Enter token code"
            className="w-full"
          />
        </div>

        {/* Total Tokens */}
        <div className="mb-4">
          <Label htmlFor="total_tokens" className="block mb-2">Total Tokens</Label>
          <Input
            type="number"
            name="total_tokens"
            value={formData.total_tokens}
            onChange={handleChange}
            id="total_tokens"
            placeholder="Enter total tokens"
            className="w-full"
          />
        </div>

        {/* Goal */}
        <div className="mb-4">
          <Label htmlFor="goal" className="block mb-2">Goal for the smart contract</Label>
          <Input
            type="number"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            id="goal"
            placeholder="Enter goal value"
            className="w-full"
          />
        </div>

        {/* Token Price */}
        <div className="mb-4">
          <Label htmlFor="token_price" className="block mb-2">Single Token Price</Label>
          <Input
            type="number"
            name="token_price"
            value={formData.token_price}
            onChange={handleChange}
            id="token_price"
            placeholder="Enter the price for a single property"
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-between mt-4">
          <Button type="submit" className="w-full mr-2">
            Create Token
          </Button>
          <Button type="button" onClick={onBack}>Back</Button>
        </div>
      </form>

      {/* Mostrar las direcciones de los contratos creados */}
     
    </section>
  );
};

// 0xeAD0A4aaa0C70A57413aD61fEc6FcaBa824725d8 address of the smart contract manager to create both smart contracts



// const PropertyTokenAddress= "0x662EC8652cD2ba8ADDc1854C4B84B85F87092b7f"

// const  PropertyInvestmentAddress= "0x1921d3c917763085cb17EE8acf58d565f087E0F9"

