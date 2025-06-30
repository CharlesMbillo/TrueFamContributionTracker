A React Native app that automates reading transaction messages (SMS/Email), parsing the transaction details, uploading them to Google Sheets, and sending WhatsApp messages to groups with reminders.
     

Key Features:

   ** Complete App Structure:** Proper navigation between Setup and Dashboard screens
   ** Context Management:** Global state management for transactions, settings, and selections
    Mock Data: Since we're in a web environment, I've included mock transaction data for demonstration
    Service Layer: Complete services for SMS processing, Google Sheets integration, WhatsApp messaging, and background tasks
    Type Safety: Full TypeScript support with proper interfaces
    Material Design: Using React Native Paper for consistent UI components

App Flow:

    Splash Screen: Shows for 2 seconds during initialization
    Setup Screen: First-time configuration (if not configured)
    Dashboard Screen: Main interface showing all components working together

The Metro bundler should start and you can see the app in action with the SplashScreen, followed by the main dashboard containing the StatusIndicator, TransactionList, and WhatsAppReminderSetup components.
