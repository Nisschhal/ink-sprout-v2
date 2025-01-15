// "use client"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Backbutton } from "@/components/BackButton"
// // import { Header } from "Header"
// import { Social } from "@/components/Socials"

// // import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

// interface CardWrapperProps {
//   children: React.ReactNode
//   headerLabel: string
//   backButtonLabel: string
//   backButtonHref: string
//   showSocials?: boolean
// }

// function CardWrapper({
//   children,
//   headerLabel,
//   backButtonHref,
//   backButtonLabel,
//   showSocials,
// }: CardWrapperProps) {
//   return (
//     <Card className="w-[400px] shadow-md">
//       <CardHeader>
//         <CardTitle>{headerLabel}</CardTitle>
//       </CardHeader>

//       <CardContent>{children}</CardContent>
//       {showSocials && (
//         <CardFooter>
//           <Social />
//         </CardFooter>
//       )}
//       <CardFooter>
//         <Backbutton label={backButtonLabel} href={backButtonHref}></Backbutton>
//       </CardFooter>
//     </Card>
//   )
// }

// export default CardWrapper
