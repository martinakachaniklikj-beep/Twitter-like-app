import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor() {
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (projectId && clientEmail && rawPrivateKey) {
        try {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId,
              clientEmail,
              privateKey: rawPrivateKey.replace(/\\n/g, '\n'),
            }),
          });
        } catch (error) {
          console.error('Failed to initialize Firebase Admin SDK', error);
        }
      } else {
        console.warn(
          'Firebase Admin SDK not initialized: missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY environment variables.',
        );
      }
    }
  }

  async verifyToken(token: string) {
    return admin.auth().verifyIdToken(token);
  }
}
