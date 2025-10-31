# Environment Variables Configuration

## Required Variables

### API Configuration
\`\`\`
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
\`\`\`

### Hedera Configuration
\`\`\`
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_PRIVATE_KEY=YOUR_PRIVATE_KEY
\`\`\`

### Database Configuration (if using Supabase)
\`\`\`
DATABASE_URL=postgresql://user:password@host:port/database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

## Optional Variables

### Monitoring
\`\`\`
SENTRY_DSN=https://your-sentry-dsn
\`\`\`

### Analytics
\`\`\`
NEXT_PUBLIC_GA_ID=your_google_analytics_id
\`\`\`

## Setting Up Variables in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - Name: Variable name
   - Value: Variable value
   - Environments: Select which environments (Production, Preview, Development)
4. Click "Save"
5. Redeploy for changes to take effect

## Local Development

Create a `.env.local` file in the project root:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3000
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_PRIVATE_KEY=YOUR_PRIVATE_KEY
\`\`\`

Note: Never commit `.env.local` to version control!
