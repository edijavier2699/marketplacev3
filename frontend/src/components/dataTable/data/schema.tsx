import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const propertySchema = z.object({
  referenceNumber:z.string(), 
  id: z.string(),
  title: z.string(),
  image: z.string(),
  location: z.string(),
  status: z.string().optional(),
  // priority: z.string(),
  listingPrice : z.string(),
  ownershipPercentage: z.number(),
  listingDate: z.string().optional(),
  // capRate: z.string(),
  investmentCategory: z.string().optional(),
  propertyType: z.string().optional()
})

export type Properties = z.infer<typeof propertySchema>





// export const myAssetsSchema = z.object({
//   id: z.union([z.string(), z.number()]), // Permitir tanto string como number
//   image: z.string(), // Imagen de la propiedad
//   title: z.string(), // Título de la propiedad
//   user_tokens: z.number(), // Tokens asociados al usuario
//   price: z.string().default(""), // Valor de la propiedad (renombrado de 'net_asset_value')
//   priceChart: z.number().default(4.7), // Cambio de precio (renombrado de 'price_change')
//   yield: z.string().default("0"), // Rendimiento de alquiler proyectado (renombrado de 'projected_rental_yield')
//   capRate: z.number().default(3.5), // Tasa de capitalización (renombrado de 'cap_rate')
//   occupancyStatus: z.string().optional(), // Estado de ocupación, opcional (renombrado de 'ocupancy_status')
//   performanceStatus: z.string().optional(), // Estado de rendimiento, opcional (añadido según el código)
//   propertyType: z.string(), // Tipo de propiedad (añadido según el código)
//   availableTokens: z.number().default(0).optional(), // Tokens disponibles (renombrado de 'availableTokens')
//   totalTokens: z.number().default(0), // Tokens totales (renombrado de 'totalTokens')
//   location: z.string(), // Ubicación de la propiedad
//   projected_appreciation: z.string().default("1.2"), // Apreciación proyectada
//   total_rental_income: z.number().default(23343), // Ingreso total por alquiler
// });

export const myAssetsSchema = z.object({
  id: z.union([z.string(), z.number()]),
  image: z.string(),
  title: z.string(),
  location: z.string(),
  user_tokens: z.number(),
  price: z.number(),
  priceChart: z.number(),
  yield: z.number(),
  capRate: z.number(),
  occupancyStatus: z.string(),
  performanceStatus: z.string(),
  propertyType: z.string(),
  totalTokens: z.number(),
});

export type MyAssets = z.infer<typeof myAssetsSchema>




// TYPE FOR THE HOME MARKETPLACE VIEW ROWS
export const homePropertySchema = z.object({
  reference_number: z.string(), 
  title: z.string(),
  image: z.array(z.string()),
  location: z.string(),
  status: z.string().optional(),
  projected_annual_return: z.string(),
  projected_rental_yield:z.string(),
  property_type: z.string().optional(),
  created_at: z.string().optional(),
  cap_rate:z.string(),
  investment_category: z.string().optional(),
  price:z.string(),
  price_increase_percentage: z.string(),
  // ocupancy_status:z.string(),
  tokens: z.array(
    z.object({
      total_tokens: z.string(),
      tokens_available: z.string(),
      token_price: z.string()
    })
  )
});



export type HomeProperties = z.infer<typeof homePropertySchema>;