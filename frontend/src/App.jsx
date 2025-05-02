import React from 'react';
import WalletSetup from './WalletSetup';

function App() {
  return (
    <div className="App">
      <h1>Welcome to HathorChat!</h1>
      <p className="text-center mb-4">
        Your one-stop Mini App for community tokens, tipping, and rewards—no crypto headaches.
      </p>
      <WalletSetup />
      <footer>
        HathorChat &copy; {new Date().getFullYear()}. Built with ❤️ by our dev team.
      </footer>
    </div>
  );
}

export default App;


// export default function App() {
//   return (
//     <div style={{ padding: "2rem", textAlign: "center" }}>
//       <h1>Hello from HathorChat 🎉</h1>
//     </div>
//   );
// }