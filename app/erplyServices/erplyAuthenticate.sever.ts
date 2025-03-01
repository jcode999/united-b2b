import axios from "axios";


export const authenticateErply = async () => {
  const params = {
    'username':process.env.ERPLY_USERNAME || '',
    'password':process.env.ERPLY_PASSWORD || '',
    'clientCode':process.env.ERPLY_CLIENTCODE || '',
    'request':'verifyUser',
    'sendContentType':'1',
  }
  console.log("authenticating to erply: ",params)
    try {
      const response = await axios.post(
        `https://${process.env.ERPLY_CLIENTCODE}.erply.com/api/`,
        null,
        {
            params
        },
      );
      return response.data;
    } catch (error: any) {
      console.error('Error posting data:', error);
      throw new Error('Failed to post data');
    }
  };