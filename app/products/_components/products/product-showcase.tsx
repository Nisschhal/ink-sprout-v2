"use client"
import { VariantsWithImagesTags } from "@/lib/infer-type"

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function ProductShowcase({
  variants,
}: {
  variants: VariantsWithImagesTags[]
}) {
  // get the carousel api to get index
  const [api, setApi] = useState<CarouselApi>()

  // state is list because api on 'slideInView' event gives the list of index of image
  const [activeThumbnail, setActiveThumbnail] = useState([0])
  const searchParams = useSearchParams()
  const selectedColor = searchParams.get("type") || variants[0].productType

  //
  useEffect(() => {
    if (!api) return
    // listen for slidesInView event to track index
    api.on("slidesInView", (e) => {
      // console.log(e.slidesInView(), "slices") // view the active index
      setActiveThumbnail(e.slidesInView())
    })
  }, [api])

  // update the preveiw image based on index
  const updatePreview = (index: number) => {
    api?.scrollTo(index)
  }

  return (
    // loop carousel
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {/* // only select the variant which has productType, aka selected product color */}
        {variants.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((image, index) => (
              <CarouselItem key={index}>
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.name}
                    priority
                    width={1280}
                    height={720}
                  />
                ) : null}
              </CarouselItem>
            ))
        )}
      </CarouselContent>
      {/* List of all images */}
      <div className="flex overflow-clip gap-4 py-2">
        {variants.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((image, index) => (
              <div key={index}>
                {image.url ? (
                  <Image
                    onClick={() => updatePreview(index)}
                    src={image.url}
                    alt={image.name}
                    priority
                    width={72}
                    height={48}
                    className={cn(
                      index === activeThumbnail[0]
                        ? "opacity-100"
                        : "opacity-55",
                      "rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75"
                    )}
                  />
                ) : null}
              </div>
            ))
        )}
      </div>
    </Carousel>
  )
}
