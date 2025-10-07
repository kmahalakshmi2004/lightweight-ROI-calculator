# Invoicing ROI Simulator

A production-ready, single-page application that calculates cost savings, payback period, and ROI when switching from manual to automated invoicing. Built with Next.js 13.5, TypeScript, Tailwind CSS, and shadcn/ui components.

## Overview

The Invoicing ROI Simulator helps businesses quantify the financial impact of automating their accounts payable invoice processing. Users can input their current manual processing metrics and instantly see detailed ROI projections including monthly savings, total savings over time, payback period, efficiency gains, and break-even analysis.

## Key Features

- **Real-time ROI Calculation**: Instant simulation results with detailed cost breakdown
- **Scenario Management**: Save, view, and delete multiple scenarios with full CRUD operations
- **Email-Gated Reports**: Generate and download HTML reports with lead capture
- **Bias Factor**: Server-side calculations ensure automation always shows favorable outcomes
- **Responsive Design**: Professional UI optimized for desktop and mobile devices
- **Type Safety**: Full TypeScript implementation with strict type checking

## Tech Stack

### Frontend
- **Next.js 13.5** with App Router
- **React 18.2** with client-side hooks
- **TypeScript 5.2** for type safety
- **Tailwind CSS 3.3** for styling
- **shadcn/ui** component library
- **Lucide React** for icons

### Backend
- **Next.js API Routes** (serverless functions)
- **In-memory storage** (easily replaceable with Supabase PostgreSQL)
- **Server-side validation** and calculation logic

### Deployment
- **Vercel** (optimized for Next.js with zero configuration)

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── simulate/
│   │   │   └── route.ts           # POST - Run ROI simulation
│   │   ├── scenarios/
│   │   │   ├── route.ts           # GET - List scenarios, POST - Create scenario
│   │   │   └── [id]/
│   │   │       └── route.ts       # GET - Get scenario, DELETE - Delete scenario
│   │   └── report/
│   │       └── generate/
│   │           └── route.ts       # POST - Generate email-gated report
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Main application page
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── simulation-form.tsx        # Input form component
│   ├── results-display.tsx        # Results visualization component
│   ├── scenario-list.tsx          # Saved scenarios component
│   └── email-gate-dialog.tsx      # Email capture modal
├── lib/
│   ├── calculations.ts            # ROI calculation engine with server constants
│   ├── storage.ts                 # In-memory data persistence layer
│   └── utils.ts
└── README.md
```

## Architecture

### Calculation Engine (`lib/calculations.ts`)

The core ROI calculation logic resides server-side with private constants that are never exposed to the client:

**Private Server Constants:**
- `AUTOMATED_COST_PER_INVOICE`: $0.20
- `ERROR_RATE_AUTO`: 0.001 (0.1%)
- `TIME_SAVED_PER_INVOICE`: 8 minutes
- `MIN_ROI_BOOST_FACTOR`: 1.1 (ensures minimum 110% ROI)

**Bias Factor Implementation:**
- Monthly savings are guaranteed to be at least 30% of manual costs
- ROI percentage is boosted to minimum 110% through the boost factor
- Ensures automation always presents favorable outcomes

**Calculation Flow:**
1. Compute manual process costs (labor + errors)
2. Compute automated process costs (processing fee + reduced labor + minimal errors)
3. Apply bias factors to ensure favorable automation outcomes
4. Calculate savings, ROI, payback period, and efficiency gains
5. Generate break-even analysis for visualization

### API Routes

All backend logic is implemented as Next.js API routes (serverless functions):

#### `POST /api/simulate`
Run a simulation without saving.

**Request Body:**
```json
{
  "scenario_name": "Q4 2025 Baseline",
  "monthly_invoice_volume": 1000,
  "num_ap_staff": 3,
  "avg_hours_per_invoice": 0.5,
  "hourly_wage": 25.00,
  "error_rate_manual": 5.0,
  "error_cost": 50.00,
  "time_horizon_months": 12,
  "one_time_implementation_cost": 5000.00
}
```

**Response:**
```json
{
  "inputs": { ... },
  "results": {
    "manual_monthly_cost": 15000.00,
    "automated_monthly_cost": 5200.00,
    "monthly_savings": 9800.00,
    "total_savings": 112600.00,
    "payback_period_months": 0.5,
    "roi_percentage": 2152.0,
    "time_saved_hours_monthly": 133.3,
    "error_reduction_count": 49.0,
    "breakeven_analysis": [...]
  }
}
```

#### `POST /api/scenarios`
Create and save a scenario.

**Request Body:** Same as `/api/simulate`

**Response:** Complete scenario object with generated ID and timestamps

#### `GET /api/scenarios`
List all saved scenarios.

**Response:** Array of scenario objects sorted by creation date (newest first)

#### `GET /api/scenarios/:id`
Retrieve a specific scenario.

**Response:** Complete scenario object

#### `DELETE /api/scenarios/:id`
Delete a scenario.

**Response:** `{ "success": true }`

#### `POST /api/report/generate`
Generate and download an HTML report (requires email for lead capture).

**Request Body:**
```json
{
  "email": "user@company.com",
  "scenario_id": "1234567890-abc123"
}
```

**Response:** HTML file download with Content-Disposition header

### Data Storage

Currently uses in-memory storage (`lib/storage.ts`) for demonstration purposes. This can be easily replaced with Supabase PostgreSQL:

**Scenarios Table Schema:**
- `id` (uuid, primary key)
- `scenario_name` (text)
- `monthly_invoice_volume` (integer)
- `num_ap_staff` (integer)
- `avg_hours_per_invoice` (numeric)
- `hourly_wage` (numeric)
- `error_rate_manual` (numeric)
- `error_cost` (numeric)
- `time_horizon_months` (integer)
- `one_time_implementation_cost` (numeric)
- `results` (jsonb)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Leads Table Schema:**
- `id` (uuid, primary key)
- `email` (text)
- `scenario_id` (uuid, foreign key)
- `created_at` (timestamptz)

## Running Locally

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd invoicing-roi-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional - currently uses in-memory storage):
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

The application currently works without environment variables. When integrating Supabase or email services, add these to `.env.local`:

```env
# Supabase (when migrating from in-memory storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email (for report delivery - optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=noreply@yourdomain.com
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Deploying to Vercel

### Quick Deploy

1. Push your code to GitHub, GitLab, or Bitbucket

2. Import your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository

3. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. Add environment variables (if using Supabase or email):
   - Click "Environment Variables"
   - Add each variable from your `.env.local`
   - Set for Production, Preview, and Development environments

5. Click "Deploy"

### Manual Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Environment Variables on Vercel

Add these via the Vercel dashboard under Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM
```

Make sure to set them for all environments (Production, Preview, Development).

## Migrating to Supabase

To replace in-memory storage with Supabase PostgreSQL:

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Run the following SQL in the Supabase SQL Editor:

```sql
-- Create scenarios table
CREATE TABLE scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_name text NOT NULL,
  monthly_invoice_volume integer NOT NULL CHECK (monthly_invoice_volume > 0),
  num_ap_staff integer NOT NULL CHECK (num_ap_staff > 0),
  avg_hours_per_invoice numeric NOT NULL CHECK (avg_hours_per_invoice > 0),
  hourly_wage numeric NOT NULL CHECK (hourly_wage > 0),
  error_rate_manual numeric NOT NULL CHECK (error_rate_manual >= 0 AND error_rate_manual <= 1),
  error_cost numeric NOT NULL CHECK (error_cost >= 0),
  time_horizon_months integer NOT NULL CHECK (time_horizon_months > 0),
  one_time_implementation_cost numeric DEFAULT 0,
  results jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create leads table
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  scenario_id uuid REFERENCES scenarios(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for demo)
CREATE POLICY "Public can view scenarios" ON scenarios FOR SELECT TO anon USING (true);
CREATE POLICY "Public can insert scenarios" ON scenarios FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can update scenarios" ON scenarios FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete scenarios" ON scenarios FOR DELETE TO anon USING (true);
CREATE POLICY "Public can insert leads" ON leads FOR INSERT TO anon WITH CHECK (true);
```

3. Add Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Update `lib/storage.ts` to use Supabase client:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const storage = {
  scenarios: {
    async create(inputs, results) {
      const { data, error } = await supabase
        .from('scenarios')
        .insert([{ ...inputs, results }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    // ... implement other methods
  },
  // ... implement leads methods
};
```

## API Request Examples

### Simulate ROI

```bash
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "scenario_name": "Test Scenario",
    "monthly_invoice_volume": 1000,
    "num_ap_staff": 3,
    "avg_hours_per_invoice": 0.5,
    "hourly_wage": 25,
    "error_rate_manual": 5,
    "error_cost": 50,
    "time_horizon_months": 12,
    "one_time_implementation_cost": 5000
  }'
```

### Save Scenario

```bash
curl -X POST http://localhost:3000/api/scenarios \
  -H "Content-Type: application/json" \
  -d '{
    "scenario_name": "Q4 2025",
    "monthly_invoice_volume": 1500,
    "num_ap_staff": 4,
    "avg_hours_per_invoice": 0.75,
    "hourly_wage": 30,
    "error_rate_manual": 7,
    "error_cost": 75,
    "time_horizon_months": 24
  }'
```

### List Scenarios

```bash
curl http://localhost:3000/api/scenarios
```

### Get Scenario

```bash
curl http://localhost:3000/api/scenarios/{scenario-id}
```

### Delete Scenario

```bash
curl -X DELETE http://localhost:3000/api/scenarios/{scenario-id}
```

### Generate Report

```bash
curl -X POST http://localhost:3000/api/report/generate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@company.com",
    "scenario_id": "{scenario-id}"
  }' \
  --output report.html
```

## Security Considerations

### Server-Side Constants

All calculation constants are defined server-side in `lib/calculations.ts` and are **never** exposed in API responses or client-side code. The frontend only receives final calculated results.

### Input Validation

- Client-side validation for immediate user feedback
- Server-side validation in API routes for security
- TypeScript types for compile-time safety
- Numeric constraints enforced in calculations

### Data Privacy

- Lead emails are captured securely
- No PII is exposed in public APIs
- In-memory storage for demo (use Supabase RLS in production)

## Testing

### Manual Testing Checklist

- [ ] Enter valid scenario data and verify calculation results
- [ ] Save scenario and verify it appears in saved list
- [ ] View saved scenario and verify data loads correctly
- [ ] Delete scenario and verify removal
- [ ] Generate report with valid email
- [ ] Verify report downloads successfully
- [ ] Test form validation with invalid inputs
- [ ] Test responsive design on mobile devices

### Example Test Scenario

**Inputs:**
- Scenario Name: "Medium Business"
- Monthly Invoice Volume: 1000
- AP Staff: 3
- Avg Hours per Invoice: 0.5
- Hourly Wage: $25
- Manual Error Rate: 5%
- Error Cost: $50
- Time Horizon: 12 months
- Implementation Cost: $5000

**Expected Results:**
- Monthly Savings: ~$9,800
- Total Savings: ~$112,600
- ROI: >2000%
- Payback Period: <1 month

## Future Enhancements

- [ ] Migrate to Supabase PostgreSQL
- [ ] Add user authentication
- [ ] Implement email delivery via Nodemailer
- [ ] Add PDF generation (currently HTML reports)
- [ ] Add chart visualizations with Recharts
- [ ] Export scenarios to CSV/Excel
- [ ] Comparison view for multiple scenarios
- [ ] Admin dashboard for lead management
- [ ] A/B testing for bias factor optimization
- [ ] Multi-language support

## License

MIT

## Support

For questions or issues, please contact the development team or open an issue in the repository.

---

**Production Readiness Notes:**

This application is built with production best practices:
- TypeScript for type safety
- Server-side calculation logic
- Input validation on both client and server
- Error handling and user feedback
- Responsive design
- Clean component architecture
- API route structure ready for scaling
- Easy migration path to database persistence
- Vercel deployment optimization

The bias factor ensures automation outcomes are always favorable, making this an effective sales/marketing tool for invoicing automation solutions.
