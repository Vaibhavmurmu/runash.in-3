import { type NextRequest, NextResponse } from "next/server"
import { productManager } from "@/lib/product-manager"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse filters
    const filter = {
      category: searchParams.get("category") || undefined,
      subcategory: searchParams.get("subcategory") || undefined,
      organic:
        searchParams.get("organic") === "true" ? true : searchParams.get("organic") === "false" ? false : undefined,
      locallySourced:
        searchParams.get("locallySourced") === "true"
          ? true
          : searchParams.get("locallySourced") === "false"
            ? false
            : undefined,
      inStock:
        searchParams.get("inStock") === "true" ? true : searchParams.get("inStock") === "false" ? false : undefined,
      search: searchParams.get("search") || undefined,
      priceRange:
        searchParams.get("minPrice") && searchParams.get("maxPrice")
          ? { min: Number(searchParams.get("minPrice")), max: Number(searchParams.get("maxPrice")) }
          : undefined,
      sustainabilityScore:
        searchParams.get("minSustainability") && searchParams.get("maxSustainability")
          ? { min: Number(searchParams.get("minSustainability")), max: Number(searchParams.get("maxSustainability")) }
          : undefined,
      certifications: searchParams.get("certifications")?.split(",") || undefined,
      tags: searchParams.get("tags")?.split(",") || undefined,
    }

    // Parse sorting
    const sort = {
      field: (searchParams.get("sortBy") as any) || "name",
      order: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    }

    // Parse pagination
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 20

    const result = await productManager.searchProducts(filter, sort, page, limit)

    return NextResponse.json({
      success: true,
      ...result,
      categories: productManager.getCategories(),
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      category,
      subcategory,
      organic = false,
      locallySourced = false,
      sustainabilityScore = 5,
      certifications = [],
      tags = [],
      stockQuantity = 0,
      lowStockThreshold = 10,
      reorderPoint = 5,
      supplier,
      cost = 0,
      margin = 0.3,
      image,
      nutritionalInfo,
      variants = [],
    } = body

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price, category" },
        { status: 400 },
      )
    }

    const product = await productManager.createProduct({
      name,
      description,
      price,
      category,
      subcategory,
      organic,
      locallySourced,
      sustainabilityScore,
      certifications,
      tags,
      stockQuantity,
      lowStockThreshold,
      reorderPoint,
      supplier,
      cost,
      margin,
      image,
      nutritionalInfo,
      variants,
    })

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
