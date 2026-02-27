import { getApps, initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const DATABASE_CONFIG = {
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

let app
if (!getApps().length) {
  app = initializeApp(DATABASE_CONFIG)
} else {
  app = getApps()[0]
}

const database = getDatabase(app)

export { database }
