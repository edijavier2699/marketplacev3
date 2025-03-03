
import verifycation_progress from "../../assets/verify-ongoing.svg"

export const VerificationProgress: React.FC = () =>{
  return(
    <article>
        <h4 className="font-bold text-2xl mb-3">Verify your identity</h4>
        <p className="text-gray-500 text-sm mb-[40px]">This helps us keep the platform safe.</p>
        <img alt="verifycation-progress" src={verifycation_progress}  className="mb-[40px] mx-auto "/>
        <p  className="mb-[40px] font-bold text-medium ">
          Our identity verification check is almost complete!
          We are manually reviewing your identification check. 
          This typically takes us less than 24 hours. 
          There is no additional action needed from you at this time.
          If you have questions, please contact us at <span className="text-[#C8E870]"> mohamed.omar@tokunize.com</span>
        </p>
    </article>
  )
}
