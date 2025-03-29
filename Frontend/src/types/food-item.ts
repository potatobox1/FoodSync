export interface FoodItem {
    id: number
    name: string
    category: string
    subCategory: string
    image: string
    expiresIn: string
    restaurant: string
    quantity: number
    location: {
      latitude: number
      longitude: number
    }
  }
  
  