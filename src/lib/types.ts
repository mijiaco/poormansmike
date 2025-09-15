import { z } from "zod";

export const TradeSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  ticker: z.string(),
  long_call_expiry: z.string().or(z.date()),
  long_call_strike: z.number(),
  long_call_price: z.number(),
  short_call_expiry: z.string().or(z.date()),
  short_call_strike: z.number(),
  short_call_price: z.number(),
  contracts: z.number().int().default(1),
  created_at: z.string().optional(),
});

export type Trade = z.infer<typeof TradeSchema>;

export const CandidateSchema = z.object({
  id: z.string().uuid().optional(),
  ticker: z.string(),
  underlying_price: z.number().optional(),
  long_call_expiry: z.string().or(z.date()).optional(),
  long_call_strike: z.number().optional(),
  long_call_price: z.number(),
  short_call_expiry: z.string().or(z.date()).optional(),
  short_call_strike: z.number().optional(),
  short_call_price: z.number(),
  monthly_yield: z.number(),
  annual_simple: z.number().optional(),
  annual_compound: z.number().optional(),
  score: z.number().default(0),
  last_updated: z.string().optional(),
});

export type Candidate = z.infer<typeof CandidateSchema>;


