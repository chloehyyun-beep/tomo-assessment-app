// Firebase SDK에서 필요한 함수들을 가져옵니다.
// 이 URL은 브라우저에서 직접 Firebase 모듈을 사용할 수 있게 해줍니다.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// TODO: Firebase 콘솔에서 복사한 내 웹 앱의 Firebase 설정 코드를 아래에 붙여넣으세요.
// 중요: 아래의 값들은 예시이며, 실제 값으로 반드시 교체해야 합니다.
const firebaseConfig = {
  apiKey: "AIzaSyA5TMVa5PURf6XfQhjW9-3SdPdggLItM8E",
  authDomain: "tomo-assessment.firebaseapp.com",
  projectId: "tomo-assessment",
  storageBucket: "tomo-assessment.firebasestorage.app",
  messagingSenderId: "488986463619",
  appId: "1:488986463619:web:b1214d729c6199e91efab6",
  measurementId: "G-X0TF467HKF"
};

// Firebase 앱을 초기화합니다.
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스 인스턴스를 가져와서 다른 파일에서 사용할 수 있도록 내보냅니다.
export const db = getFirestore(app);
