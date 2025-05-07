export const createWalletFromBackend = async () => {
  console.log('⚡ Creating wallet via backend...');
  const res = await fetch('http://localhost:5000/api/createWallet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('❌ Wallet creation failed:', errText);
    throw new Error('Wallet creation failed');
  }

  const data = await res.json();
  console.log('✅ Wallet created:', data);
  return data;
};



// import { createWallet } from '@hathor/wallet-lib';
// import * as bip39 from 'bip39';
// import { Buffer } from 'buffer'; 

// getting from backend
// export const createWalletFromBackend = async () => {
//   const res = await fetch('http://localhost:5000/api/createWallet', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' }
//   });

//   if (!res.ok) throw new Error('Wallet creation failed');

//   const data = await res.json();
//   return data; // { address, encryptedSeed }
// };





// //------------------------------------------------------------------------------------------------------------
// // import * as bip39 from 'bip39';
// // import { Buffer } from 'buffer'; 

// // // Utility to handle wallet generation using the bip39 library (for seed generation) 
// // // and the @hathor/wallet-lib library to create the wallet.

// // // Make Buffer globally available (for bip39)
// // if (!window.Buffer) window.Buffer = Buffer;

// // // Generate a wallet using Hathor Web Wallet
// // export const generateWallet = () => {
// //   const seedPhrase = bip39.generateMnemonic();
// //   const words = seedPhrase.split(' ');

// //   if (!window.hathorLib || !window.hathorLib.HathorWallet) {
// //     alert("Hathor library is not ready yet. Please wait a moment and try again.");
// //     throw new Error("HathorWallet not found on window.hathorLib");
// //   }
// //   // Instantiate HathorWallet
// //   const wallet = new window.hathorLib.HathorWallet({
// //     words,
// //     network: 'testnet', // Change to 'testnet' if you're testing
// //     password: '',       // Optional password for seed encryption
// //   });

// //   console.log("Generated wallet:", wallet);

// //   return {
// //     seedPhrase,
// //     wallet,
// //   };
// // };


// // // export const generateWallet = () => {
// // //   // Generate a 12-word seed phrase
// // //   const seedPhrase = bip39.generateMnemonic();
  
// // //   // Create the wallet using the seed phrase
// // //   const wallet = createWallet(seedPhrase);

// // //   return {
// // //     seedPhrase,  // Returning seed phrase
// // //     wallet       // Returning the full wallet object (private key, public key, etc.)
// // //   };
// // // };

