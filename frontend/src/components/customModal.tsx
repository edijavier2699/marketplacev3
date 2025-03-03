import { useModalContext } from "@/context/modalContext";
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { CgClose } from "react-icons/cg";

interface Props{
    children : React.ReactNode
}

export const GlobalModal = ({children}:Props) =>{
    const modalRef = useRef<HTMLDivElement>(null); // Cambié a HTMLDivElement para simplificar
    const {state,setState} = useModalContext()
    const closeModal = () => { setState(false)}
    const modalRoot = document.getElementById("modal")

    const handleContentClick = (e:React.MouseEvent<HTMLDivElement>)=>{
        e.stopPropagation()
    }

    useEffect(()=>{
        const handleScape = (e:KeyboardEvent) =>{
            if(e.key === "Escape"){
                setState(false)
            }
            if(state){
                document.addEventListener("keydown", handleScape)
            }
        }
        return () =>{
            document.removeEventListener("keydown", handleScape)
        }
    },[state,setState])

    if(!state || !modalRoot){
        return null;
    }
    
    return createPortal(
        <div className="overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
            <div
                className="w-auto min-w-[55%] max-w-3xl flex flex-col space-y-5 bg-white p-4 rounded-lg shadow-lg transform text-black transition-transform duration-300 scale-95"
                onClick={handleContentClick}
                ref={modalRef}
            >
                {/* Botón de cierre en la parte superior derecha */}
                <button
                className="absolute top-2 right-2 text-black "
                onClick={closeModal}
                >
                <CgClose className="w-6 h-6" />
                </button>
                <div>
                    {children}
                </div>
            </div>
        </div>,
        modalRoot
    ); 
}
