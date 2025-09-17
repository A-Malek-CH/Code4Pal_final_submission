import client from "./api.js";

export const getSellerDonations = (sellerId) => {
  return client.get(`/api/donations/seller/${sellerId}`);
};

export const getBuyerDonations = (buyerId) => {
  return client.get(`/api/donations/buyer/${buyerId}`);
};

export const getTotalDonations = () => {
  return client.get('/api/donations/total');
};

export const getTotalPendingDonations = () => {
  return client.get('/api/donations/total/pending');
};

export const markDonationAsTransferred = (donationId) => {
  return client.patch(`/api/donations/${donationId}/transfer`);
};

export const markDonationAsFailed = (donationId) => {
  return client.patch(`/api/donations/${donationId}/fail`);
};