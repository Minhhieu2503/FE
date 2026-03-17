import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

let serviceAccount: any;

try {
  const serviceAccountPath = path.resolve(__dirname, './firebase-service-account.json');
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = require(serviceAccountPath);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    console.warn('Firebase service account not found. Please provide FIREBASE_SERVICE_ACCOUNT env var or src/config/firebase-service-account.json');
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
}

export default admin;
