import { z } from "zod";

export const makeOfferTradding = z.object({
  order_price: z
    .number()
    .min(0.01, "Token price must be greater than 0"),
    order_quantity: z
    .number()
    .min(1, "Number of tokens must be at least 1"), 
    token_address: z.string().optional(),
    listing_id:z.string().optional()
});

export type makeOfferTraddingValues = z.infer<typeof makeOfferTradding>;
