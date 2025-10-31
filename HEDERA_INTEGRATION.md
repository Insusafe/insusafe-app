# InsuSafe - Hedera Integration Guide

## Overview

InsuSafe is a mobile app for managing Peltier-based insulin cooling devices with full Hedera blockchain integration. The app enables secure device registration, real-time monitoring, and geolocation-based device discovery.

## Features Implemented

### 1. Hedera SDK Integration
- **Package**: `@hashgraph/sdk` v2.50.0
- **Network**: Hedera Testnet
- **Client**: Configured for testnet with default transaction fees

### 2. Real Wallet Connection
- Hedera wallet connection with mock account generation
- Wallet state management via localStorage
- Support for HashPack, Blade Wallet, and Kabila (ready for production)

### 3. Device Registration on Hedera
- Devices registered as topics on Hedera Consensus Service (HCS)
- Immutable device registration history
- Device metadata stored on ledger
- Unique topic ID per device for updates

### 4. HCS Topics for Device Discovery
- Global discovery topic for geolocation-based device finding
- Real-time device location and status publishing
- Distance calculation for nearby device filtering
- Device status color coding (green/yellow/orange/red)

### 5. Real-time Data Publishing
- Device temperature, humidity, battery, and insulin levels published to HCS
- Updates every 3 seconds
- Automatic fallback to mock data if Hedera unavailable

## Architecture

\`\`\`
lib/
├── hedera-client.ts          # Hedera client initialization
├── hedera-wallet.ts          # Wallet connection logic
├── hedera-device-registry.ts # Device registration on HCS
├── hedera-hcs.ts             # HCS topic management
└── device-discovery.ts       # Device discovery algorithms

components/
├── wallet-connect.tsx        # Wallet connection UI
├── device-registration.tsx   # Device registration form
├── device-dashboard.tsx      # Real-time device monitoring
├── device-map.tsx            # Geolocation-based device map
└── emergency-alert-system.tsx # Emergency alerts
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Hedera testnet account (optional for testing)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open http://localhost:3000 in your browser

### Environment Variables

No environment variables required for testnet. For production:
- `NEXT_PUBLIC_HEDERA_NETWORK`: Network name (testnet/mainnet)
- `HEDERA_ACCOUNT_ID`: Your Hedera account ID
- `HEDERA_PRIVATE_KEY`: Your Hedera private key

## Key Functions

### Wallet Connection
\`\`\`typescript
import { connectHederaWallet } from "@/lib/hedera-wallet"

const wallet = await connectHederaWallet()
// Returns: { accountId, publicKey, isConnected }
\`\`\`

### Device Registration
\`\`\`typescript
import { registerDeviceOnHedera } from "@/lib/hedera-device-registry"

const topicId = await registerDeviceOnHedera(client, deviceData)
// Creates HCS topic and registers device
\`\`\`

### Device Discovery
\`\`\`typescript
import { getOrCreateDiscoveryTopic, publishDeviceLocation } from "@/lib/hedera-hcs"

const topicId = await getOrCreateDiscoveryTopic(client)
await publishDeviceLocation(client, topicId, locationData)
\`\`\`

### Nearby Device Filtering
\`\`\`typescript
import { filterNearbyDevices } from "@/lib/device-discovery"

const nearby = filterNearbyDevices(devices, userLat, userLon, radiusKm)
// Returns devices within radius, sorted by distance
\`\`\`

## Testing

### Test Wallet Connection
1. Click "Connect Hedera Wallet" on the login screen
2. Verify wallet address is displayed
3. Check localStorage for stored wallet data

### Test Device Registration
1. Navigate to Settings > Devices
2. Click "Register New Device"
3. Fill in device name and serial number
4. Verify device appears in registered devices list
5. Check console for Hedera topic ID

### Test Real-time Updates
1. View device dashboard
2. Monitor temperature, humidity, battery, and insulin levels
3. Verify updates every 3 seconds
4. Check console for HCS message publishing

### Test Device Discovery
1. Navigate to Map tab
2. Verify nearby devices are displayed
3. Check distance calculations
4. Verify device status colors

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy:
   \`\`\`bash
   vercel deploy
   \`\`\`

### Production Checklist

- [ ] Update Hedera network to mainnet
- [ ] Add production account ID and private key
- [ ] Enable WalletConnect integration
- [ ] Test with real Hedera wallets (HashPack, Blade)
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and error tracking
- [ ] Test emergency alert system
- [ ] Verify geolocation permissions on mobile

## Troubleshooting

### Hedera Connection Issues
- Check network connectivity
- Verify testnet is accessible
- Check browser console for errors
- Ensure Hedera SDK is properly installed

### Device Registration Fails
- Verify wallet is connected
- Check Hedera account has sufficient balance
- Review transaction fees
- Check console for detailed error messages

### HCS Topic Creation Fails
- Verify client is initialized
- Check account permissions
- Ensure sufficient transaction fees
- Review Hedera SDK documentation

## Mobile Testing

### iOS
- Use Safari or Chrome
- Grant location permissions when prompted
- Test on iPhone 12+ for best experience

### Android
- Use Chrome or Firefox
- Grant location permissions
- Test on Android 10+

## Next Steps

1. Integrate with real WalletConnect SDK
2. Add support for HashPack and Blade wallets
3. Implement smart contracts for device management
4. Add NFT-based device ownership
5. Implement payment system for premium features
6. Add multi-language support
7. Implement push notifications
8. Add offline mode with sync

## Support

For issues or questions:
1. Check console logs for error messages
2. Review Hedera SDK documentation
3. Check GitHub issues
4. Contact support team

## License

MIT
