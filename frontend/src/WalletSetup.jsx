import React, { useState } from 'react';
import { createWalletFromBackend } from './walletUtils';

export default function WalletSetup() {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSeedSaved, setIsSeedSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle wallet creation request when the user clicks "Generate Wallet"
const handleCreateWallet = async () => {
    setLoading(true);
    try {
      // Request wallet data (address and encrypted seed) from the backend
      const { encryptedSeed, address } = await createWalletFromBackend();
      // Save the wallet address and encrypted seed in state (for UI display)
      setWalletAddress(address);
      setSeedPhrase(encryptedSeed);  // Optionally store the encrypted seed securely

      // You can save the encrypted seed in a secure place, like localStorage or the backend
    } catch (err) {
      alert('❌ Failed to create wallet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mark the seed phrase as saved (for UI display)
  const handleSeedSaved = () => {
    setIsSeedSaved(true);  // User has confirmed they saved the seed phrase
  };

  return (
    <div className="card shadow-sm p-4 mt-4">
      <h2>Create Your Wallet</h2>

      {/* Display instructions and button to create a wallet */}
      {!seedPhrase && !isSeedSaved && (
        <>
          <p>Click the button below to generate your wallet:</p>
          <button className="btn btn-primary" onClick={handleCreateWallet} disabled={loading}>
            {loading ? 'Creating...' : 'Generate Wallet'}
          </button>
        </>
      )}

      {/* Display the generated seed phrase and prompt to save it */}
      {seedPhrase && !isSeedSaved && (
        <>
          <div className="alert alert-warning mt-3">
            <strong>IMPORTANT:</strong> Save your seed phrase securely.
          </div>
          <textarea className="form-control mb-3" readOnly rows="3" value={seedPhrase} />
          <button className="btn btn-success" onClick={handleSeedSaved}>
            I have saved my seed phrase
          </button>
        </>
      )}

      {/* Display confirmation after saving the seed phrase */}
      {isSeedSaved && (
        <div className="alert alert-success mt-3">
          Yoo Your Wallet is created!
          <br />
          <strong>Address:</strong> <code>{walletAddress}</code>
        </div>
      )}
    </div>
  );
}





// No longer using hathor lib in frontend!
//---------------------------------------------------------------------------------------------
// import React, { useState, useEffect } from 'react';
// import { generateWallet } from './walletUtils'; // We'll use this utility to generate wallet and seed

// // here we will generate and display the seed phrase to the user.

// export default function WalletSetup() {
//   const [isHathorReady, setIsHathorReady] = useState(false);
//   const [seedPhrase, setSeedPhrase] = useState('');
//   const [isSeedSaved, setIsSeedSaved] = useState(false);

//   // Check if Hathor Wallet Library is loaded
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (window.hathorLib && window.hathorLib.HathorWallet) {
//         console.log('✅ Hathor library loaded');
//         setIsHathorReady(true);
//         clearInterval(interval);
//       } else {
//         console.log('⏳ Waiting for Hathor library...');
//       }
//     }, 300);
//     return () => clearInterval(interval);
//   }, []);

//   // Function to generate the wallet and seed phrase
//   const handleCreateWallet = () => {
//     const wallet = generateWallet();  // Call the function we created in walletUtils
//     setSeedPhrase(wallet.seedPhrase); // Set the seed phrase to display
//   };

//   // Confirm that the user has saved the seed phrase
//   const handleSeedSaved = async () => {
//     setIsSeedSaved(true);
//     await wallet.start();
//     const address = wallet.getCurrentAddress();
//     console.log("Wallet address:", address);
//     // Here, you'd store the encrypted wallet in localStorage or IndexedDB
//     // Encrypt the private key using a password and store it securely
//   };

//   if (!isHathorReady) {
//     return (
//       <div className="text-center mt-5">
//         <div className="spinner-border text-primary" role="status" />
//         <p className="mt-3">⏳ Loading Hathor Wallet library…</p>
//       </div>
//     );
//   }

//   return (
//     <div className="card shadow-sm p-4">
//         <h2 className="card-title">Create Your Wallet</h2>

//         {!seedPhrase && !isSeedSaved && (
//             <>
//             <p className="card-text">
//                 Click the button below to generate your unique Hathor wallet seed phrase.
//             </p>
//             <button className="btn btn-primary" onClick={handleCreateWallet}>
//                 Generate Wallet
//             </button>
//             </>
//         )}

//         {seedPhrase && !isSeedSaved && (
//             <>
//             <div className="alert alert-warning mt-3">
//                 <strong>IMPORTANT:</strong> Please copy this seed phrase and store it securely.
//             </div>
//             <textarea
//                 className="form-control my-3"
//                 rows="3"
//                 readOnly
//                 value={seedPhrase}
//             />
//             <button className="btn btn-success" onClick={handleSeedSaved}>
//                 I have saved my seed phrase
//             </button>
//             </>
//         )}

//         {isSeedSaved && (
//             <div className="alert alert-success mt-3">
//             ✅ Your wallet is ready! You can now use it to tip, mint tokens, and more.
//             <br />
//             <strong>Wallet Address:</strong> <br />
//             <code>{wallet.getCurrentAddress()}</code> 
//             {/* Note: wallet.getCurrentAddress() only works after wallet.start() is called. */}

//             </div>
//         )}
//         </div>
//     );
//     }
    