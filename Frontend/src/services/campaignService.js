import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export const CAMPAIGN_BUDGET_MIN = 5;
export const CAMPAIGN_BUDGET_MAX = 50;

export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
};

// Empty platform field shape for a brand-new campaign.
export const emptyPlatforms = () => ({
  coindrop: { youtubeHandle: '' },
  facebook: { profileUrl: '', groupUrl: '', referralCode: '' },
  kick: { profileUrl: '' },
  twitch: { profileUrl: '' },
  instagram: { profileUrl: '' },
});

export const isValidBudget = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= CAMPAIGN_BUDGET_MIN && n <= CAMPAIGN_BUDGET_MAX;
};

const campaignsRef = (userId) => collection(db, 'creators', userId, 'campaigns');

// Live subscription to a creator's campaigns, newest first.
export const subscribeCampaigns = (userId, onChange, onError) => {
  const q = query(campaignsRef(userId), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error('Failed to subscribe to campaigns:', err);
      if (onError) onError(err);
    }
  );
};

export const createCampaign = async (userId, { name, budget, platforms }) => {
  const ref = await addDoc(campaignsRef(userId), {
    name: name.trim(),
    budget: Number(budget),
    platforms,
    status: CAMPAIGN_STATUS.DRAFT,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateCampaign = async (userId, campaignId, { name, budget, platforms }) => {
  await updateDoc(doc(campaignsRef(userId), campaignId), {
    name: name.trim(),
    budget: Number(budget),
    platforms,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCampaign = async (userId, campaignId) => {
  await deleteDoc(doc(campaignsRef(userId), campaignId));
};

// Marks a campaign active after a successful payment.
export const activateCampaign = async (userId, campaignId, paymentInfo) => {
  await updateDoc(doc(campaignsRef(userId), campaignId), {
    status: CAMPAIGN_STATUS.ACTIVE,
    activatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    paymentMethod: paymentInfo.paymentMethod,
    paymentOrderId: paymentInfo.orderId,
    paymentDetails: paymentInfo.paymentDetails || null,
  });
};
