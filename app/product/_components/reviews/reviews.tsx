import { db } from "@/server"
import { ReviewsForm } from "./reviews-form"
import { desc, eq } from "drizzle-orm"
import Review from "./review"
import ReviewChart from "./reviews-chart"
import { reviews } from "@/server/db/schema"

export default async function Reviews({ productId }: { productId: number }) {
  const reviewsData = await db.query.reviews.findMany({
    where: eq(reviews.productId, productId),
    orderBy: [desc(reviews.created)],
    with: { users: true },
  })

  return (
    <section className="py-4">
      <div className="flex gap-2 lg:gap-12 justify-stretch flex-col lg:flex-row">
        {/* Left Side: User Review Section */}
        <div className="flex-1 ">
          <h2 className="text-2xl font-bold ">Product Reviews</h2>
          <Review reviews={reviewsData} />
          <ReviewsForm productId={productId} />
        </div>
        {/* Right Side: Review Form and Star List */}
        <div className="flex-1 flex flex-col gap-2">
          <ReviewChart reviews={reviewsData} />
        </div>
      </div>
    </section>
  )
}
