"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, MessageCircle, Package } from "lucide-react"
import api from "@/lib/axios"
import { MerchandiseCardSkeleton } from "./skeleton-loaders"
import { ProfessionalEmptyState } from "./empty-state"
import { Button } from "./ui/button"

interface Merchandise {
  id: number
  name: string
  category: string
  price: string | number
  size: string
  image: string
  description: string
}

export default function ProductsGrid() {
  const [products, setProducts] = useState<Merchandise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/merchandise/all")
      if (response.data.status === "success" || response.data.statusCode === 200) {
        setProducts(response.data.data)
      } else {
        setProducts(response.data.data || [])
      }
    } catch (err) {
      console.error(err)
      setError("Failed to load merchandise.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const categories = ["All", "Apparel", "Accessories", "Promotional"]

  const handleWhatsAppOrder = (product: Merchandise) => {
    const formattedPrice = typeof product.price === 'number' ? `KES ${product.price.toLocaleString()}` : product.price;
    const message = `Hi! I'm interested in ordering: ${product.name} - ${formattedPrice}`
    const whatsappNumber = "254738030398"
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <section className="w-full py-8 md:py-12 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-balance">
            Party Merchandise
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <MerchandiseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <ProfessionalEmptyState
            icon={Package}
            title="Unable to Load Merchandise"
            description={error}
            action={
              <Button onClick={fetchProducts} variant="outline">
                Try Again
              </Button>
            }
          />
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length === 0 ? (
              <div className="col-span-full">
                <ProfessionalEmptyState
                  icon={Package}
                  title="No Merchandise Found"
                  description="We don't have any merchandise available at the moment. Please check back later for updates."
                />
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Category & Price */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold bg-secondary text-white px-3 py-1 rounded-full text-nowrap">
                        {product.category}
                      </span>
                      <span className="text-lg font-bold text-secondary">
                        {typeof product.price === 'number' ? `KES ${product.price.toLocaleString()}` : product.price}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Size */}
                    <div className="mb-6 text-sm text-foreground/70">
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-secondary" />
                        <span>Available Sizes: {
                          (() => {
                            try {
                              const sizes = typeof product.size === 'string' ? JSON.parse(product.size) : product.size;
                              return Array.isArray(sizes) ? sizes.join(', ') : product.size;
                            } catch {
                              return product.size;
                            }
                          })()
                        }</span>
                      </div>
                    </div>

                    {/* Order Button */}
                    <div className="mt-auto">
                      <button
                        onClick={() => handleWhatsAppOrder(product)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold
                                bg-secondary text-white rounded-md
                                hover:bg-secondary/90 transition-colors"
                      >
                        <MessageCircle size={18} />
                        Order via WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}