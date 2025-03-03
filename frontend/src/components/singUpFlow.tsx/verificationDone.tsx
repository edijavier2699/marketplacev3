import verify_done from "../../assets/verify-done.svg"

export const VerificationDone: React.FC = () =>{
  return(
      <article className="w-full">
        <h4 className="font-bold text-2xl mb-3">Verify your identity</h4>
        <p className="text-gray-500 text-sm mb-[40px]">This helps us keep the platform safe.</p>
        <img alt="verifycation-progress" src={verify_done}  className="mb-[40px] mx-auto "/>
        <p  className="mb-[40px] font-bold text-medium text-center">
          You're all set! 
          You've successfully verified your identity, nothing else to do here!
        </p>
      </article>
  )
}

