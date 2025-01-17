"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"

export default function ProductTags() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tag = searchParams.get("tag")

  const setFilter = (tag: string) => {
    if (tag) {
      router.push(`?tag=${tag}`)
    }
    if (!tag) router.push("/")
  }
  return (
    <div className=" flex gap-4 z-10 items-center justify-center pt-3">
      <Badge
        className={cn(
          "cursor-pointer bg-black hover:bg-black/75  hover:opacity-100 my-2",
          !tag ? "bg-black" : "bg-black/50"
        )}
        onClick={() => setFilter("")}
      >
        All
      </Badge>
      <Badge
        className={cn(
          "cursor-pointer bg-blue-500 hover:bg-blue-500/75  hover:opacity-100 my-2",
          tag === "blue" ? "bg-blue-500" : "bg-blue-500/50"
        )}
        onClick={() => setFilter("blue")}
      >
        Blue
      </Badge>
      <Badge
        className={cn(
          "cursor-pointer bg-pink-500 hover:bg-pink-500/75  hover:opacity-100 my-2",
          tag === "pink" ? "bg-pink-500" : "bg-pink-500/50"
        )}
        onClick={() => setFilter("pink")}
      >
        Pink
      </Badge>
      <Badge
        className={cn(
          "cursor-pointer bg-orange-500 hover:bg-orange-500/75  hover:opacity-100 my-2",
          tag === "orange" ? "bg-orange-500" : "bg-orange-500/50"
        )}
        onClick={() => setFilter("orange")}
      >
        Orange
      </Badge>
      <Badge
        className={cn(
          "cursor-pointer bg-purple-500 hover:bg-purple-500/75  hover:opacity-100 my-2",
          tag === "purple" ? "bg-purple-500" : "bg-purple-500/50"
        )}
        onClick={() => setFilter("purple")}
      >
        Purple
      </Badge>
      <Badge
        className={cn(
          "cursor-pointer bg-green-500 hover:bg-green-500/75  hover:opacity-100 my-2",
          tag === "green" ? "bg-green-500" : "bg-green-500/50"
        )}
        onClick={() => setFilter("green")}
      >
        Green
      </Badge>
    </div>
  )
}
