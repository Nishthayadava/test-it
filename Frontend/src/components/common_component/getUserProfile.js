import axios from 'axios';

export const getUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem('token'); // Get token from localStorage
    console.log('Token from LocalStorage:', token); // Log token to make sure it exists

    if (!token) {
      throw new Error('No token found');
    }

    // API call to fetch the user profile
    const response = await axios.get(`http://localhost:5000/api/getuserprofile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('User Profile Response:', response.data); // Log response to check if it's correct
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
