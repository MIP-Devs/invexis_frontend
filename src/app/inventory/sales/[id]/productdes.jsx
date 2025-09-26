import Image from "next/image"
const ProductDes = ({productDescription}) =>{
    return(
        <>
        <section>
           <div className="py-4 rounded-2xl flex space-x-22 border-2 mt-10 border-gray-300 w-full px-4">
                <div className="relative w-72 h-72 rounded-2xl border">
                <Image
                    src={productDescription?.productimage || "/images/placeholder.png"}
                    alt="Sold product Image"
                    fill
                    className="object-cover border-2 rounded-2xl border-gray-600"
                />
                </div>

                <div className="grid grid-cols-2 font-bold">
                    <p>Name</p><p className="text-gray-600">{productDescription.name}</p>
                    <p>Category</p><p className="text-gray-600">{productDescription.category}</p>
                    <p>Price</p><p className="text-gray-600">{productDescription.price}</p>
                    <p>Buyer</p><p className="text-gray-600">{productDescription.buyer}</p>
                    <p>description</p><p className="text-gray-600">{productDescription.description}</p>
                </div>
            </div> 

            <h1></h1>
        </section>
        </>
    )
}


export default ProductDes