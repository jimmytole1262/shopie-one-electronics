import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// This is a server-side API route for cart operations
// In a real application, this would likely interact with a database

export async function GET() {
  try {
    // Get cart from cookies or return empty array
    const cartCookie = cookies().get("cart")?.value
    const cart = cartCookie ? JSON.parse(cartCookie) : []

    return NextResponse.json({ items: cart })
  } catch (error) {
    console.error("[CART_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { item } = body

    if (!item) {
      return new NextResponse("Item is required", { status: 400 })
    }

    // Get existing cart
    const cartCookie = cookies().get("cart")?.value
    const existingCart = cartCookie ? JSON.parse(cartCookie) : []

    // Check if item already exists
    const existingItemIndex = existingCart.findIndex((cartItem: any) => cartItem.id === item.id)

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += 1
    } else {
      // Add new item with quantity 1
      existingCart.push({ ...item, quantity: 1 })
    }

    // Save updated cart to cookies
    cookies().set("cart", JSON.stringify(existingCart))

    return NextResponse.json({ items: existingCart })
  } catch (error) {
    console.error("[CART_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get("itemId")

    // If itemId is provided, remove specific item
    // If not, clear entire cart
    if (itemId) {
      const cartCookie = cookies().get("cart")?.value
      const existingCart = cartCookie ? JSON.parse(cartCookie) : []

      const updatedCart = existingCart.filter((item: any) => item.id !== itemId)

      cookies().set("cart", JSON.stringify(updatedCart))
      return NextResponse.json({ items: updatedCart })
    } else {
      // Clear entire cart
      cookies().set("cart", "[]")
      return NextResponse.json({ items: [] })
    }
  } catch (error) {
    console.error("[CART_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { itemId, quantity } = body

    if (!itemId || typeof quantity !== "number") {
      return new NextResponse("Item ID and quantity are required", { status: 400 })
    }

    const cartCookie = cookies().get("cart")?.value
    const existingCart = cartCookie ? JSON.parse(cartCookie) : []

    const updatedCart = existingCart.map((item: any) => {
      if (item.id === itemId) {
        return { ...item, quantity }
      }
      return item
    })

    cookies().set("cart", JSON.stringify(updatedCart))

    return NextResponse.json({ items: updatedCart })
  } catch (error) {
    console.error("[CART_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

