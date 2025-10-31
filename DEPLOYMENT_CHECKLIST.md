# InsuSafe Deployment Checklist

## Pre-Deployment

### Backend Setup
- [ ] Environment variables configured in Vercel
  - [ ] `NEXT_PUBLIC_API_URL` set correctly
  - [ ] Hedera credentials configured
  - [ ] Database connection string set
- [ ] Database schema created and migrated
- [ ] API endpoints tested locally
- [ ] Error handling implemented

### Frontend Setup
- [ ] All components tested
- [ ] Mobile responsiveness verified
- [ ] Hedera integration tested
- [ ] Device data fetching working
- [ ] Emergency alert system functional

### Hardware Setup
- [ ] ESP32 firmware uploaded
- [ ] All sensors tested and calibrated
- [ ] WiFi connectivity verified
- [ ] API communication working
- [ ] Peltier control functional

## Deployment Steps

### 1. Deploy Backend to Vercel
\`\`\`bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Deploy via Vercel dashboard or CLI
vercel deploy --prod
\`\`\`

### 2. Configure Environment Variables
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all required variables
3. Redeploy to apply changes

### 3. Update ESP32 Firmware
1. Update API endpoint in firmware:
   \`\`\`cpp
   const char* apiEndpoint = "https://your-production-url.vercel.app/api/device-data";
   \`\`\`
2. Upload new firmware to all devices

### 4. Test Production Environment
- [ ] Device connects to production API
- [ ] Data is being received and stored
- [ ] Mobile app displays real device data
- [ ] Hedera integration working
- [ ] Emergency alerts functional

## Post-Deployment

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor API response times
- [ ] Track device connectivity
- [ ] Monitor database performance
- [ ] Set up alerts for critical errors

### Maintenance
- [ ] Regular database backups
- [ ] Monitor Hedera transaction costs
- [ ] Update dependencies monthly
- [ ] Review and optimize API queries
- [ ] Collect user feedback

## Rollback Plan

If issues occur:
1. Revert to previous Vercel deployment
2. Update ESP32 firmware to use backup API
3. Restore database from backup
4. Notify users of the issue
5. Investigate root cause
