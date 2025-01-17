"use client"

import { VariantsWithProduct } from "@/lib/infer-type"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import formatPrice from "@/lib/format-price"
import { useSearchParams } from "next/navigation"
import { useMemo, useState, useEffect } from "react"

type ProductTypes = {
  variants: VariantsWithProduct[] | null
}

export default function Products({ variants }: ProductTypes) {
  const searchParams = useSearchParams()
  const paramTag = searchParams.get("tag")

  const [isLoading, setIsLoading] = useState(true)

  // Simulating loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Replace with actual loading logic
    return () => clearTimeout(timeout)
  }, [])

  const filteredVariants = useMemo(() => {
    if (paramTag && variants) {
      return variants.filter((variant) =>
        variant.variantTags.some((t) => t.tag === paramTag)
      )
    }
    return variants
  }, [paramTag, variants])

  if (isLoading || !variants) {
    // Render skeleton while loading
    return (
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3 mt-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse space-y-4">
            <div className="bg-muted-foreground/30 rounded-md h-48 w-full"></div>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="bg-muted-foreground/30 rounded h-4 w-32"></div>
                <div className="bg-muted-foreground/30 rounded h-4 w-20"></div>
              </div>
              <div className="bg-muted-foreground/30 rounded h-6 w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!filteredVariants || filteredVariants.length === 0) {
    // Render message when no products are available
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No product listed yet</p>
      </div>
    )
  }
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3 drop-shadow-lg-lg">
      {filteredVariants?.map((variant) => (
        <Link
          className="py-2"
          href={`/product/${variant.id}?id=${variant.id}&productId=${variant.productId}&price=${variant.products.price}&title=${variant.products.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
          key={variant.id}
        >
          <Image
            src={variant.variantImages[0].url}
            alt={variant.products.title}
            className="rounded-md"
            width={720}
            height={480}
            loading="lazy"
          />
          <div className="flex justify-between mt-2">
            <div className="font-medium">
              <h2>{variant.products.title}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>

            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {formatPrice(variant.products.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
