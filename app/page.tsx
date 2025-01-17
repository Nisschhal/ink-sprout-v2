import { db } from "@/server"
import ProductTags from "./products/_components/products/product-tags"
import Products from "./products/_components/products/products"
import AlgoliaSearch from "./products/_components/products/algolia"

// revalidate cache on each 2
export const revalidate = 60 * 60

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
    <main>
      <AlgoliaSearch />
      <ProductTags />
      <Products variants={productVariantsData} />
    </main>
  )
}
