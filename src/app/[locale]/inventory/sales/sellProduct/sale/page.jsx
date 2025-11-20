"use client"
import CurrentInventory from "./stockProducts"
import { useRouter } from "next/navigation"
import { ArrowBack } from "@mui/icons-material"
import { useLocale } from "next-intl"
import { useTranslations } from "next-intl"


const SaleProduct = () =>{
    const router = useRouter()
    const t = useTranslations('sales')
    const locale = useLocale()
    
    
    return(
        <>
        <div className="mb-5">
            <button onClick={() => router.back()} className="border  px-4 py-2 flex items-center space-x-2 cursor-pointer rounded-xl  mb-3">
            <ArrowBack /><span>{t('back')}</span>
            </button>
            <h1 className="text-2xl font-medium">{t('saleProducts')}</h1>
            <p>{t('saleSubTitile')}</p>
        </div>
        <section>
            <CurrentInventory />
        </section>
        </>
    )
}

export default SaleProduct