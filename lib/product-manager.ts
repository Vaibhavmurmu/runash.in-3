import { EventEmitter } from "events"

export interface ProductFilter {
  category?: string
  subcategory?: string
  organic?: boolean
  locallySourced?: boolean
  inStock?: boolean
  priceRange?: { min: number; max: number }
  sustainabilityScore?: { min: number; max: number }
  certifications?: string[]
  tags?: string[]
  search?: string
}

export interface ProductSort {
  field: "name" | "price" | "rating" | "sustainabilityScore" | "createdAt"
  order: "asc" | "desc"
}

export interface ProductInventory {
  productId: string
  stockQuantity: number
  reservedQuantity: number
  availableQuantity: number
  lowStockThreshold: number
  reorderPoint: number
  lastRestocked: Date
  supplier?: string
  cost: number
  margin: number
}

export interface ProductAnalytics {
  productId: string
  views: number
  addToCartCount: number
  purchaseCount: number
  conversionRate: number
  revenue: number
  averageRating: number
  reviewCount: number
  wishlistCount: number
  streamFeaturedCount: number
  lastUpdated: Date
}

class ProductManager extends EventEmitter {
  private products: Map<string, any> = new Map()
  private inventory: Map<string, ProductInventory> = new Map()
  private analytics: Map<string, ProductAnalytics> = new Map()
  private categories: Map<string, any> = new Map()

  constructor() {
    super()
    this.initializeCategories()
  }

  // Product CRUD Operations
  async createProduct(productData: any): Promise<any> {
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const product = {
      id: productId,
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
    }

    this.products.set(productId, product)

    // Initialize inventory
    const inventory: ProductInventory = {
      productId,
      stockQuantity: productData.stockQuantity || 0,
      reservedQuantity: 0,
      availableQuantity: productData.stockQuantity || 0,
      lowStockThreshold: productData.lowStockThreshold || 10,
      reorderPoint: productData.reorderPoint || 5,
      lastRestocked: new Date(),
      supplier: productData.supplier,
      cost: productData.cost || 0,
      margin: productData.margin || 0.3,
    }
    this.inventory.set(productId, inventory)

    // Initialize analytics
    const analytics: ProductAnalytics = {
      productId,
      views: 0,
      addToCartCount: 0,
      purchaseCount: 0,
      conversionRate: 0,
      revenue: 0,
      averageRating: 0,
      reviewCount: 0,
      wishlistCount: 0,
      streamFeaturedCount: 0,
      lastUpdated: new Date(),
    }
    this.analytics.set(productId, analytics)

    this.emit("product_created", { product, inventory, analytics })
    return product
  }

  async updateProduct(productId: string, updates: Partial<any>): Promise<any> {
    const product = this.products.get(productId)
    if (!product) throw new Error("Product not found")

    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: new Date(),
    }

    this.products.set(productId, updatedProduct)
    this.emit("product_updated", { productId, updates, product: updatedProduct })
    return updatedProduct
  }

  async deleteProduct(productId: string): Promise<void> {
    const product = this.products.get(productId)
    if (!product) throw new Error("Product not found")

    // Soft delete - mark as inactive
    const updatedProduct = {
      ...product,
      status: "inactive",
      updatedAt: new Date(),
    }

    this.products.set(productId, updatedProduct)
    this.emit("product_deleted", { productId, product: updatedProduct })
  }

  // Product Search and Filtering
  async searchProducts(
    filter: ProductFilter = {},
    sort: ProductSort = { field: "name", order: "asc" },
    page = 1,
    limit = 20,
  ): Promise<{
    products: any[]
    total: number
    page: number
    totalPages: number
    hasMore: boolean
  }> {
    let filteredProducts = Array.from(this.products.values()).filter((product) => product.status === "active")

    // Apply filters
    if (filter.category) {
      filteredProducts = filteredProducts.filter((p) => p.category === filter.category)
    }

    if (filter.subcategory) {
      filteredProducts = filteredProducts.filter((p) => p.subcategory === filter.subcategory)
    }

    if (filter.organic !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.organic === filter.organic)
    }

    if (filter.locallySourced !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.locallySourced === filter.locallySourced)
    }

    if (filter.inStock !== undefined) {
      filteredProducts = filteredProducts.filter((p) => {
        const inventory = this.inventory.get(p.id)
        return inventory ? inventory.availableQuantity > 0 : false
      })
    }

    if (filter.priceRange) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= filter.priceRange!.min && p.price <= filter.priceRange!.max,
      )
    }

    if (filter.sustainabilityScore) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.sustainabilityScore >= filter.sustainabilityScore!.min &&
          p.sustainabilityScore <= filter.sustainabilityScore!.max,
      )
    }

    if (filter.certifications && filter.certifications.length > 0) {
      filteredProducts = filteredProducts.filter((p) =>
        filter.certifications!.some((cert) => p.certifications?.includes(cert)),
      )
    }

    if (filter.tags && filter.tags.length > 0) {
      filteredProducts = filteredProducts.filter((p) => filter.tags!.some((tag) => p.tags?.includes(tag)))
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue = a[sort.field]
      let bValue = b[sort.field]

      if (sort.field === "createdAt" || sort.field === "updatedAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sort.order === "desc") {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }
    })

    // Apply pagination
    const total = filteredProducts.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    // Enrich with inventory and analytics data
    const enrichedProducts = paginatedProducts.map((product) => ({
      ...product,
      inventory: this.inventory.get(product.id),
      analytics: this.analytics.get(product.id),
    }))

    return {
      products: enrichedProducts,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    }
  }

  // Inventory Management
  async updateInventory(productId: string, updates: Partial<ProductInventory>): Promise<ProductInventory> {
    const inventory = this.inventory.get(productId)
    if (!inventory) throw new Error("Product inventory not found")

    const updatedInventory = {
      ...inventory,
      ...updates,
      availableQuantity: (updates.stockQuantity || inventory.stockQuantity) - inventory.reservedQuantity,
    }

    this.inventory.set(productId, updatedInventory)

    // Check for low stock
    if (updatedInventory.availableQuantity <= updatedInventory.lowStockThreshold) {
      this.emit("low_stock_alert", { productId, inventory: updatedInventory })
    }

    this.emit("inventory_updated", { productId, inventory: updatedInventory })
    return updatedInventory
  }

  async reserveStock(productId: string, quantity: number): Promise<boolean> {
    const inventory = this.inventory.get(productId)
    if (!inventory) throw new Error("Product inventory not found")

    if (inventory.availableQuantity < quantity) {
      return false // Insufficient stock
    }

    const updatedInventory = {
      ...inventory,
      reservedQuantity: inventory.reservedQuantity + quantity,
      availableQuantity: inventory.availableQuantity - quantity,
    }

    this.inventory.set(productId, updatedInventory)
    this.emit("stock_reserved", { productId, quantity, inventory: updatedInventory })
    return true
  }

  async releaseStock(productId: string, quantity: number): Promise<void> {
    const inventory = this.inventory.get(productId)
    if (!inventory) throw new Error("Product inventory not found")

    const updatedInventory = {
      ...inventory,
      reservedQuantity: Math.max(0, inventory.reservedQuantity - quantity),
      availableQuantity: inventory.availableQuantity + quantity,
    }

    this.inventory.set(productId, updatedInventory)
    this.emit("stock_released", { productId, quantity, inventory: updatedInventory })
  }

  // Analytics Tracking
  async trackProductView(productId: string): Promise<void> {
    const analytics = this.analytics.get(productId)
    if (!analytics) return

    const updatedAnalytics = {
      ...analytics,
      views: analytics.views + 1,
      lastUpdated: new Date(),
    }

    this.analytics.set(productId, updatedAnalytics)
    this.emit("product_viewed", { productId, analytics: updatedAnalytics })
  }

  async trackAddToCart(productId: string): Promise<void> {
    const analytics = this.analytics.get(productId)
    if (!analytics) return

    const updatedAnalytics = {
      ...analytics,
      addToCartCount: analytics.addToCartCount + 1,
      conversionRate: analytics.views > 0 ? (analytics.addToCartCount + 1) / analytics.views : 0,
      lastUpdated: new Date(),
    }

    this.analytics.set(productId, updatedAnalytics)
    this.emit("product_added_to_cart", { productId, analytics: updatedAnalytics })
  }

  async trackPurchase(productId: string, quantity: number, revenue: number): Promise<void> {
    const analytics = this.analytics.get(productId)
    if (!analytics) return

    const updatedAnalytics = {
      ...analytics,
      purchaseCount: analytics.purchaseCount + quantity,
      revenue: analytics.revenue + revenue,
      conversionRate: analytics.views > 0 ? analytics.purchaseCount / analytics.views : 0,
      lastUpdated: new Date(),
    }

    this.analytics.set(productId, updatedAnalytics)
    this.emit("product_purchased", { productId, quantity, revenue, analytics: updatedAnalytics })
  }

  // Live Stream Integration
  async featureInStream(productId: string, streamId: string): Promise<void> {
    const analytics = this.analytics.get(productId)
    if (!analytics) return

    const updatedAnalytics = {
      ...analytics,
      streamFeaturedCount: analytics.streamFeaturedCount + 1,
      lastUpdated: new Date(),
    }

    this.analytics.set(productId, updatedAnalytics)
    this.emit("product_featured_in_stream", { productId, streamId, analytics: updatedAnalytics })
  }

  // Category Management
  private initializeCategories(): void {
    const categories = [
      { id: "fruits", name: "Fruits", description: "Fresh organic fruits" },
      { id: "vegetables", name: "Vegetables", description: "Fresh organic vegetables" },
      { id: "grains-cereals", name: "Grains & Cereals", description: "Organic grains and cereals" },
      { id: "dairy", name: "Dairy", description: "Organic dairy products" },
      { id: "meat-poultry", name: "Meat & Poultry", description: "Organic meat and poultry" },
      { id: "pantry", name: "Pantry", description: "Organic pantry essentials" },
      { id: "beverages", name: "Beverages", description: "Organic beverages" },
      { id: "snacks", name: "Snacks", description: "Organic snacks and treats" },
    ]

    categories.forEach((category) => {
      this.categories.set(category.id, category)
    })
  }

  getCategories(): any[] {
    return Array.from(this.categories.values())
  }

  getProduct(productId: string): any | undefined {
    const product = this.products.get(productId)
    if (!product) return undefined

    return {
      ...product,
      inventory: this.inventory.get(productId),
      analytics: this.analytics.get(productId),
    }
  }

  getProductAnalytics(productId: string): ProductAnalytics | undefined {
    return this.analytics.get(productId)
  }

  getProductInventory(productId: string): ProductInventory | undefined {
    return this.inventory.get(productId)
  }

  // Bulk Operations
  async bulkUpdatePrices(updates: { productId: string; price: number }[]): Promise<void> {
    for (const update of updates) {
      await this.updateProduct(update.productId, { price: update.price })
    }
    this.emit("bulk_price_update", { updates })
  }

  async bulkUpdateInventory(updates: { productId: string; stockQuantity: number }[]): Promise<void> {
    for (const update of updates) {
      await this.updateInventory(update.productId, { stockQuantity: update.stockQuantity })
    }
    this.emit("bulk_inventory_update", { updates })
  }
}

export const productManager = new ProductManager()
