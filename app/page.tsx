import { db } from "@/server"
import ProductTags from "./product/_components/products/product-tags"
import Products from "./product/_components/products/products"
import shuffleList from "@/lib/suffle-list"

// revalidate cache on each 2
export const revalidate = 3600 // 60*5

export default async function Home() {
  const productVariantsData = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      products: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  })

  // suffle list on each rendered
  const suffledList = shuffleList(productVariantsData)

  return (
    <>
      <ProductTags />
      <Products variants={suffledList} />
    </>
  )
}
