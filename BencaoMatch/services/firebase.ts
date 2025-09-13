import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase para produção
// IMPORTANTE: Substituir pelas suas credenciais reais antes de publicar
const firebaseConfig = {
  apiKey: "AIzaSyBCgI4jQfBqJRo8_demo_key_replace_with_real",
  authDomain: "bencaomatch-demo.firebaseapp.com", 
  projectId: "bencaomatch-demo",
  storageBucket: "bencaomatch-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:demo_app_id_replace_with_real",
  measurementId: "G-DEMO_MEASUREMENT_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;