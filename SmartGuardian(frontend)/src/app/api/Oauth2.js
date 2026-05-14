// import axios from 'axios';
// // Base URL from environment variables
// const OAUTH2_URL = process.env.NEXT_PUBLIC_OAUTH2_URL;

// // OAuth2 login API call
// export const oauth2Login = async (provider) => {
//     try {
//       const response = await axios.get(`${OAUTH2_URL}/oauth2/code/${provider}`);
//       return response.data;  // Return the response from OAuth2 provider
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'OAuth2 login failed');
//       console.log(response.data)
//     }
//   };