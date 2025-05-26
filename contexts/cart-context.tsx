"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type {
  Cart,
  CartItem,
  Product,
  CartTotals,
  CartSustainabilityMetrics,
  Coupon,
  ShippingMethod,
} from "@/types/cart"

interface CartState {
  cart: Cart
  isOpen: boolean
  totals: CartTotals
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { itemId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "APPLY_COUPON"; payload: { coupon: Coupon } }
  | { type: "REMOVE_COUPON"; payload: { couponId: string } }
  | { type: "SET_SHIPPING"; payload: { shippingMethod: ShippingMethod } }
  | { type: "LOAD_CART"; payload: { cart: Cart } }

const initialCart: Cart = {
  id: "default",
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  appliedCoupons: [],
  sustainabilityMetrics: {
    totalCarbonFootprint: 0,
    organicPercentage: 0,
    localProductsCount: 0,
    sustainabilityScore: 0,
    certificationCounts: {},
  },
}

const initialState: CartState = {
  cart: initialCart,
  isOpen: false,
  totals: {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    savings: 0,
  },
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: (couponId: string) => void
  setShipping: (shippingMethod: ShippingMethod) => void
  getItemCount: () => number
  getCartWeight: () => number
} | null>(null)

function calculateSustainabilityMetrics(items: CartItem[]): CartSustainabilityMetrics {
  if (items.length === 0) {
    return {
      totalCarbonFootprint: 0,
      organicPercentage: 0,
      localProductsCount: 0,
      sustainabilityScore: 0,
      certificationCounts: {},
    }
  }

  const totalCarbonFootprint = items.reduce((sum, item) => sum + (item.product.carbonFootprint || 0) * item.quantity, 0)

  const organicItems = items.filter((item) => item.product.isOrganic)
  const organicPercentage = (organicItems.length / items.length) * 100

  const localProductsCount = items.filter((item) => item.product.isLocal).length

  const avgSustainabilityScore =
    items.reduce((sum, item) => sum + item.product.sustainabilityScore * item.quantity, 0) /
    items.reduce((sum, item) => sum + item.quantity, 0)

  const certificationCounts: Record<string, number> = {}
  items.forEach((item) => {
    item.product.certifications.forEach((cert) => {
      certificationCounts[cert] = (certificationCounts[cert] || 0) + item.quantity
    })
  })

  return {
    totalCarbonFootprint: Math.round(totalCarbonFootprint * 100) / 100,
    organicPercentage: Math.round(organicPercentage),
    localProductsCount,
    sustainabilityScore: Math.round(avgSustainabilityScore * 10) / 10,
    certificationCounts,
  }
}

function calculateTotals(cart: Cart): CartTotals {
  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.selectedVariant?.price || item.product.price
    return sum + price * item.quantity
  }, 0)

  const discount = cart.appliedCoupons.reduce((sum, coupon) => {
    if (coupon.type === "percentage") {
      return sum + (subtotal * coupon.value) / 100
    } else if (coupon.type === "fixed") {
      return sum + coupon.value
    }
    return sum
  }, 0)

  const shipping = cart.shippingMethod?.price || 0
  const freeShippingCoupon = cart.appliedCoupons.find((c) => c.type === "free_shipping")
  const finalShipping = freeShippingCoupon ? 0 : shipping

  const taxableAmount = subtotal - discount
  const tax = taxableAmount * 0.08 // 8% tax rate

  const total = Math.max(0, subtotal - discount + finalShipping + tax)

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(finalShipping * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    savings: Math.round(discount * 100) / 100,
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload
      const existingItemIndex = state.cart.items.findIndex((item) => item.product.id === product.id)

      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        newItems = state.cart.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          addedAt: new Date(),
        }
        newItems = [...state.cart.items, newItem]
      }

      const updatedCart = {
        ...state.cart,
        items: newItems,
        updatedAt: new Date(),
        sustainabilityMetrics: calculateSustainabilityMetrics(newItems),
      }

      return {
        ...state,
        cart: updatedCart,
        totals: calculateTotals(updatedCart),
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.cart.items.filter((item) => item.id !== action.payload.itemId)
      const updatedCart = {
        ...state.cart,
        items: newItems,
        updatedAt: new Date(),
        sustainabilityMetrics: calculateSustainabilityMetrics(newItems),
      }

      return {
        ...state,
        cart: updatedCart,
        totals: calculateTotals(updatedCart),
      }
    }

    case "UPDATE_QUANTITY": {
      const { itemId, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { itemId } })
      }

      const newItems = state.cart.items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      const updatedCart = {
        ...state.cart,
        items: newItems,
        updatedAt: new Date(),
        sustainabilityMetrics: calculateSustainabilityMetrics(newItems),
      }

      return {
        ...state,
        cart: updatedCart,
        totals: calculateTotals(updatedCart),
      }
    }

    case "CLEAR_CART": {
      const clearedCart = {
        ...initialCart,
        id: state.cart.id,
        createdAt: state.cart.createdAt,
        updatedAt: new Date(),
      }

      return {
        ...state,
        cart: clearedCart,
        totals: calculateTotals(clearedCart),
      }
    }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case "APPLY_COUPON": {
      const updatedCart = {
        ...state.cart,
        appliedCoupons: [...state.cart.appliedCoupons, action.payload.coupon],
        updatedAt: new Date(),
      }

      return {
        ...state,
        cart: updatedCart,
        totals: calculateTotals(updatedCart),
      }
    }

    case "REMOVE_COUPON": {
      const updatedCart = {
        ...state.cart,
        appliedCoupons: state.cart.appliedCoupons.filter((coupon) => coupon.id !== action.payload.couponId),
        updatedAt: new Date(),
      }

      return {
        ...state,
        cart: updatedCart,
        totals: calculateTotals(updatedCart),
      }
    }

    case "SET_SHIPPING": {
      const updatedCart = {
        ...state.cart,
        shippingMethod: action.payload.shippingMethod,
        updatedAt: new Date(),
      }

      return {
        ...state,
        cart: updatedCart,
        totals: calculateTotals(updatedCart),
      }
    }

    case "LOAD_CART": {
      const loadedCart = action.payload.cart
      return {
        ...state,
        cart: loadedCart,
        totals: calculateTotals(loadedCart),
      }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("runash-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: { cart: parsedCart } })
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("runash-cart", JSON.stringify(state.cart))
  }, [state.cart])

  const addToCart = (product: Product, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } })
  }

  const removeFromCart = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { itemId } })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const applyCoupon = (coupon: Coupon) => {
    dispatch({ type: "APPLY_COUPON", payload: { coupon } })
  }

  const removeCoupon = (couponId: string) => {
    dispatch({ type: "REMOVE_COUPON", payload: { couponId } })
  }

  const setShipping = (shippingMethod: ShippingMethod) => {
    dispatch({ type: "SET_SHIPPING", payload: { shippingMethod } })
  }

  const getItemCount = () => {
    return state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getCartWeight = () => {
    // Estimate weight based on product categories
    return state.cart.items.reduce((sum, item) => {
      const estimatedWeight = item.product.category === "fruits-vegetables" ? 0.5 : 0.3 // kg per item
      return sum + estimatedWeight * item.quantity
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        applyCoupon,
        removeCoupon,
        setShipping,
        getItemCount,
        getCartWeight,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
