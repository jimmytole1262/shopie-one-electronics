"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SimpleCartClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
        <ShoppingCart className="h-8 w-8 text-slate-500" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">
        Your cart is being updated
      </h2>
      <p className="text-muted-foreground mb-6">
        We're working on improving your cart experience.
      </p>
      <Link href="/">
        <Button className="bg-orange-500 hover:bg-orange-600">
          Return to Shopping
        </Button>
      </Link>
    </div>
  );
}
