// angular.module('proton.authentication')
//     .factory('cryptoUtils', (webcrypto) => {
//
//         const semiRandomString = (size) => {
//             let string = '';
//             let i = 0;
//             const chars = '0123456789ABCDEF';
//
//             while (i++ < size) {
//                 string += chars[Math.floor(Math.random() * 16)];
//             }
//
//             return string;
//         };
//
//         const randomString = (size = 1) => {
//             const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//             let i;
//             let result = '';
//             const isOpera = Object.prototype.toString.call(window.opera) === '[object Opera]';
//
//             // Opera's Math.random is secure, see http://lists.w3.org/Archives/Public/public-webcrypto/2013Jan/0063.html
//             if (isOpera) {
//                 for (i = 0; i < size; i++) {
//                     result += charset[Math.floor(Math.random() * charset.length)];
//                 }
//
//                 return result;
//             }
//
//             try {
//                 const values = new Uint32Array(size);
//                 webcrypto.getRandomValues(values);
//
//                 for (i = 0; i < size; i++) {
//                     result += charset[values[i] % charset.length];
//                 }
//
//                 return result;
//             } catch (e) {
//                 console.error(e);
//                 // crypto API does not exist
//                 return semiRandomString(size);
//             }
//         };
//
//         return { randomString };
//     });
