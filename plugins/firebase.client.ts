import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
    measurementId: config.public.measurementId,
  };

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);

  // オフライン永続化 (ブラウザのみ)
  if (process.client) {
    enableIndexedDbPersistence(firestore).catch((err) => {
      if (err.code == 'failed-precondition') {
        console.warn('Persistence failed to enable: Multiple tabs open');
      } else if (err.code == 'unimplemented') {
        console.warn('Persistence is not available in this browser');
      }
    });
  }

  return {
    provide: {
      firestore,
      auth,
    },
  };
});