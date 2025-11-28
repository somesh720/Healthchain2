import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export async function uploadToIPFS(filePath) {
  const data = new FormData();
  data.append('file', fs.createReadStream(filePath));

  const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
    maxBodyLength: 'Infinity',
    headers: {
      'pinata_api_key': process.env.PINATA_API_KEY,
      'pinata_secret_api_key': process.env.PINATA_SECRET_KEY,
      ...data.getHeaders(),
    }
  });

  return res.data.IpfsHash; // CID returned
}
v