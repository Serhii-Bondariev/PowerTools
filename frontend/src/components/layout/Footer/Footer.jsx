import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Mail, CreditCard } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p className="text-gray-400">
              Professional hardware store providing quality tools and equipment.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="text-gray-400 hover:text-white">
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" className="text-gray-400 hover:text-white">
                  Cart
                </a>
              </li>
              <li>
                <a href="/contacts" className="text-gray-400 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                info@hardwarehub.com
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for updates and exclusive offers.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">© 2023 HardwareHub. All rights reserved.</div>
            <div className="flex items-center space-x-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                className="h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                alt="Visa"
                className="h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

// // src/components/layout/Footer/Footer.jsx
// import React from 'react';
// import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

// export function Footer() {
//   return (
//     <footer className="bg-gray-900 text-white py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div>
//             <h3 className="text-lg font-bold mb-4">About Us</h3>
//             <p className="text-gray-400">
//               Professional hardware store providing quality tools and equipment.
//             </p>
//           </div>
//           <div>
//             <h3 className="text-lg font-bold mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               <li>
//                 <a href="/products" className="text-gray-400 hover:text-white">
//                   Products
//                 </a>
//               </li>
//               <li>
//                 <a href="/cart" className="text-gray-400 hover:text-white">
//                   Cart
//                 </a>
//               </li>
//               <li>
//                 <a href="/contacts" className="text-gray-400 hover:text-white">
//                   Contact
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-lg font-bold mb-4">Contact</h3>
//             <ul className="space-y-2 text-gray-400">
//               <li className="flex items-center">
//                 <Mail className="h-5 w-5 mr-2" />
//                 info@hardwarehub.com
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-lg font-bold mb-4">Follow Us</h3>
//             <div className="flex space-x-4">
//               <a href="#" className="text-gray-400 hover:text-white">
//                 <Facebook className="h-6 w-6" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white">
//                 <Twitter className="h-6 w-6" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white">
//                 <Instagram className="h-6 w-6" />
//               </a>
//             </div>
//             Newsletter
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
//               <p className="text-gray-400 mb-4">
//                 Subscribe to our newsletter for updates and exclusive offers.
//               </p>
//               <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
//                 <div className="relative">
//                   <input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full bg-gray-800 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Subscribe
//                 </button>
//               </form>
//             </div>
//             {/* Footer Bottom */}
//             <div className="border-t border-gray-800 py-8">
//               <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//                 <div className="text-gray-400 text-sm">
//                   © 2023 HardwareHub. All rights reserved.
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <CreditCard className="h-8 w-8 text-gray-400" />
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
//                     alt="Mastercard"
//                     className="h-8"
//                   />
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
//                     alt="Visa"
//                     className="h-8"
//                   />
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
//                     alt="PayPal"
//                     className="h-8"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
//           <p>&copy; 2023 HardwareHub. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;
