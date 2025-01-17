"use client";

import { useCartStore } from "@/lib/client-store";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import orderedPackage from "@/public/order-package.json";
import Lottie from "react-lottie";
export default function OrderConfirmed() {
  const { setCheckoutProgress, setCartOpen } = useCartStore();
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Lottie Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35 }}
      >
        <Lottie
          options={{ animationData: orderedPackage }}
          height={320}
          width={320}
        />
      </motion.div>
      <h2 className="text-2xl font-medium">Thank your for your purchase!</h2>
      <Link href={"/dashboard/orders"} className="">
        <Button
          variant={"secondary"}
          onClick={() => {
            // Get the Drawer back to cart page
            setCheckoutProgress("cart-page");
            setCartOpen(false);
          }}
        >
          View your order
        </Button>
      </Link>
    </div>
  );
}
