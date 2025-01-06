// src/providers/GoogleAuthProvider.jsx
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

export const GoogleAuthProvider = ({ children }) => {
  const googleClientId =
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    '444678457305-mbij74rt55bl4ljup26d212buhfv5ha7.apps.googleusercontent.com';

  console.log('Environment Check:', {
    fromEnv: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    usingId: googleClientId,
    nodeEnv: process.env.NODE_ENV,
  });

  if (!googleClientId) {
    console.error('Google Client ID is missing!');
    return null;
  }

  return <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>;
};

// // src/providers/GoogleAuthProvider.jsx
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import React from 'react';

// export const GoogleAuthProvider = ({ children }) => {
//   const googleClientId =
//     process.env.REACT_APP_GOOGLE_CLIENT_ID ||
//     '444678457305-mbij74rt55bl4ljup26d212buhfv5ha7.apps.googleusercontent.com';

//   console.log('Environment Check:', {
//     fromEnv: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//     usingId: googleClientId,
//     nodeEnv: process.env.NODE_ENV,
//   });

//   if (!googleClientId) {
//     console.error('Google Client ID is missing!');
//     return null;
//   }

//   return <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>;
// };
