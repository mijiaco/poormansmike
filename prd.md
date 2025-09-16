# Poor Man’s Covered Call (PMCC) Web App — PRD

## 1. Overview
A Next.js web app for tracking and discovering **Poor Man’s Covered Call** (PMCC) opportunities.  
The app helps users compare long-dated call purchases (LEAPS) with short-term call sales to evaluate monthly yield and annualized returns.  

- **Target users**: Retail options traders exploring PMCC.  
- **Data source**: Yahoo Finance API (via RapidAPI).  
- **Database**: Supabase (Postgres + Auth).  
- **Auth**: Multi-user (email/password).  
- **No order placement** (tracking and discovery only).  

---

## 2. Core Features

### 2.1 Authentication
- Email/password sign-up and login via Supabase Auth.  
- Each user has isolated data (row-level security).  

---

### 2.2 Dashboard
Tabs:  
1. **Positions**  
   - User-entered trades (long LEAP + short call).  
   - Show metrics: monthly yield, annualized simple, annualized compounded.  
2. **Ideas**  
   - Ranked candidates (top 2000 tickers).  
   - Pulled from Yahoo Finance API → filtered → stored in Supabase.  
   - Ranked by **monthly yield** (descending).  

---

### 2.3 Trade Discovery
- Filters applied:  
  - Underlying ticker  
  - Long-call delta ≥ 0.75  
  - Long-call expiry ≥ 1 year  
  - Short-call delta ≤ 0.30  
  - Short-call expiry ≈ 1 month  
  - LEAP max price (user-defined)  
  - Monthly yield threshold (user-defined)  
- Ranking formula: **score = monthly_yield**  

---

### 2.4 Trade Entry
- Manual entry form: ticker, expiries, strikes, prices, contracts.  
- Autofill option chain data from Yahoo Finance API.  
- Store in `trades` table.  

---

### 2.5 Metrics & Formulas
- **Monthly Yield** = `short_call_price / long_call_price`  
- **Annualized Simple** = `monthly_yield * 12`  
- **Annualized Compounded** = `(1 + monthly_yield) ^ 12 - 1`  
- **Probability of Assignment** = derived from option delta (short call).  
- **Expected Monthly Return** = `monthly_yield * (1 - prob_assign)`  
- Display both **per-contract ($)** and **per-share ($/100)** values.  

---

## 3. Database Schema (Supabase)

### `trades`
```sql
id uuid primary key default uuid_generate_v4(),
user_id uuid references auth.users(id),
ticker text,
long_call_expiry date,
long_call_strike numeric,
long_call_price numeric,
short_call_expiry date,
short_call_strike numeric,
short_call_price numeric,
contracts integer,
created_at timestamp default now()

##Candidates

id uuid primary key default uuid_generate_v4(),
ticker text,
underlying_price numeric,
long_call_expiry date,
long_call_strike numeric,
long_call_price numeric,
short_call_expiry date,
short_call_strike numeric,
short_call_price numeric,
monthly_yield numeric,
annual_simple numeric,
annual_compound numeric,
score numeric,
last_updated timestamp default now()


4. Market Data Integration
Source

Yahoo Finance API via RapidAPI

Endpoints

GET /options/{ticker} → option chain by expiry.

GET /quote/{ticker} → underlying stock price.

Data Flow

Cron job / scheduled serverless function fetches option chains (daily).

Apply filters and compute metrics.

Save ranked results into Supabase candidates.

Dashboard queries cached candidates (fast, cheap).

On-demand (user clicks details) → fetch live option chain for 1 ticker.

5. UX Notes

Simple, data-table–driven interface.

Dashboard: top row = positions, bottom row = ideas.

No alerts, push notifications, or complex analytics in MVP.

6. Security & Compliance

No broker integration.

No order placement.

“Not financial advice” disclaimer displayed in footer.

API key stored server-side (Next.js environment variable).

7. Tech Stack

Frontend: Next.js (React, Tailwind for UI).

Backend: Next.js API routes (serverless functions).

Database/Auth: Supabase.

Market Data: Yahoo Finance API (RapidAPI).

Deployment: Vercel.

8. Developer Notes
8.1 API Rate Limits & Caching

Yahoo Finance RapidAPI free tier has strict rate limits.

Strategy:

Run a daily batch update (cron job in Vercel or Supabase scheduled function).

Store results in Supabase candidates.

Dashboard always queries cached data.

Only make live API calls when user requests details for a single ticker.

8.2 Error Handling

Wrap API calls with retries + exponential backoff.

Mark stale candidates (last_updated > 24h) so UI can warn user.

8.3 Performance

Limit discovery scope to ~S&P 500 or user watchlist at first.

Store computed metrics in Supabase (not computed client-side each time).

8.4 Security

API key stored in Next.js serverless functions (process.env.RAPIDAPI_KEY).

Supabase row-level security ensures each user only sees their own trades.

8.5 Extensibility

Future: add alerts (assignment risk, expiry, earnings).

Future: allow import of trades from CSV.

Future: expand candidate scoring beyond yield (include IV rank, liquidity).