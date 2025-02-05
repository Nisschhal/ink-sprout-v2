"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Backbutton } from "@/components/BackButton"
// import { Header } from "Header"
import { Social } from "./Socials"

// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocials?: boolean
}

function CardWrapper({
  children,
  headerLabel,
  backButtonHref,
  backButtonLabel,
  showSocials,
}: CardWrapperProps) {
  return (
    <Card className="mx-auto w-[400px] shadow-md">
      <CardHeader>
        <CardTitle className="text-center">{headerLabel}</CardTitle>
      </CardHeader>

      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <Backbutton label={backButtonLabel} href={backButtonHref}></Backbutton>
      </CardFooter>
    </Card>
  )
}

export default CardWrapper
