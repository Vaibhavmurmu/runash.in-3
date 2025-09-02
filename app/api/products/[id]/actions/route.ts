import { type NextRequest, NextResponse } from "next/server"
import { productManager } from "@/lib/product-manager"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    const body = await request.json()
    const { action, ...actionData } = body

    switch (action) {
      case "add_to_cart":
        await productManager.trackAddToCart(productId)
        break

      case "purchase":
        const { quantity, revenue } = actionData
        if (!quantity || !revenue) {
          return NextResponse.json({ error: "quantity and revenue required for purchase action" }, { status: 400 })
        }
        await productManager.trackPurchase(productId, quantity, revenue)
        break

      case "feature_in_stream":
        const { streamId } = actionData
        if (!streamId) {
          return NextResponse.json({ error: "streamId required for feature_in_stream action" }, { status: 400 })
        }
        await productManager.featureInStream(productId, streamId)
        break

      case "reserve_stock":
        const { reserveQuantity } = actionData
        if (!reserveQuantity) {
          return NextResponse.json({ error: "reserveQuantity required for reserve_stock action" }, { status: 400 })
        }
        const reserved = await productManager.reserveStock(productId, reserveQuantity)
        if (!reserved) {
          return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
        }
        break

      case "release_stock":
        const { releaseQuantity } = actionData
        if (!releaseQuantity) {
          return NextResponse.json({ error: "releaseQuantity required for release_stock action" }, { status: 400 })
        }
        await productManager.releaseStock(productId, releaseQuantity)
        break

      case "update_inventory":
        const { stockQuantity, lowStockThreshold, reorderPoint } = actionData
        await productManager.updateInventory(productId, {
          stockQuantity,
          lowStockThreshold,
          reorderPoint,
        })
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const updatedProduct = productManager.getProduct(productId)
    return NextResponse.json({
      success: true,
      product: updatedProduct,
    })
  } catch (error) {
    console.error("Error performing product action:", error)
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 })
  }
}
