import { ethers } from 'ethers';
import contractABI from '../contractABI.json' assert { type: 'json' };

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

export async function storeReportOnBlockchain(patientAddr, cid) {
  const tx = await contract.uploadRecord(patientAddr, cid);
  await tx.wait();
  console.log('Report stored on blockchain ✅');
}

export async function grantDoctorAccess(patientAddr, doctorAddr) {
  const tx = await contract.grantAccess(doctorAddr);
  await tx.wait();
  console.log('Access granted ✅');
}
