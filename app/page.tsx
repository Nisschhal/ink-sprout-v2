import { db } from "@/server"
import ProductTags from "./products/_components/products/product-tags"
import Products from "./products/_components/products/products"

export default async function Home() {
  const productVariantsData = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      products: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  })
  return (
    <div>
      <ProductTags />
      <Products variants={productVariantsData} />
    </div>
  )
}
