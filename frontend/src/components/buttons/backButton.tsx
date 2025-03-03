import { useNavigate } from "react-router-dom"
import { FaArrowLeft } from 'react-icons/fa';

export const BackButton  = () =>{
    const navigate = useNavigate()
    return(
        <div className="flex items-center space-x-2">
          <span className="bg-[#A0CC29] rounded-full p-1 cursor-pointer" onClick={()=>{
            navigate(-1)
          }}>
            <FaArrowLeft className="text-white" />
          </span>
          <span className="text-normal cursor-pointer">Back to Marketplace</span>
        </div>
    )
}