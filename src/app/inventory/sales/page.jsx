'use client'
import { Button  } from "@mui/material"
import { useRouter } from "next/navigation";
import NavBar from '@/components/layouts/NavBar'
import SideBar from "@/components/layouts/SideBar";
import { Trash ,DownloadCloud } from "lucide-react";
import TopCards from "./cards";
import { Jost } from "next/font/google";
import DataTable from "./table";

const jost = Jost({
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-jost",
});



const SalesPage = () =>{
 
  
    const myfilter = [
        {id:1,name:"Delete",icon:<Trash size={18} />},
        {id:2,name:"Export",icon:<DownloadCloud size={18} />},
    ]

    const navigation = useRouter()
    return(
        <>
        <NavBar />
        <SideBar />
         <section className={`${jost.className}  items-center justify-center`}>
           
             <TopCards jostFont={jost} />
           <div className="w-full pt-5 border-3 border-gray-300 shadow-lg shadow-gray-100 mt-10 rounded-3xl">

              <div className="space-y-3 sm:text-center md:text-left">
              <h1 className="text-2xl font-bold">Stock Status analysis</h1>
              <p className="font-light text-md ">Overview of today’s inventory and stock levels per product</p>
           </div>

            <div className="w-ful">
               <div className="border-b justify-end flex w-full  bg-amber-600">
                  <ul className="space-x-2">
                    {
                        myfilter.map((content , index)=>(
                           <Button key={index}  sx={{textTransform:"none",color:"white",borderRadius:10,":focus":{color:"white"}}} variant="text" className="space-x-3 bg-orange-600" ><i>{content.icon}</i><span> {content.name}</span></Button>
                        ))
                    }
                </ul>
               </div>
                <DataTable />  
                </div>
           </div>
         </section>
        </>
    )
}
export default SalesPage