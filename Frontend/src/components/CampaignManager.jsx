import { useEffect, useState } from 'react';
import {
  CAMPAIGN_BUDGET_MIN,
  CAMPAIGN_BUDGET_MAX,
  CAMPAIGN_STATUS,
  emptyPlatforms,
  isValidBudget,
  subscribeCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from '../services/campaignService';
import CampaignPaymentModal from './CampaignPaymentModal';
import './CampaignManager.css';

const PLATFORM_SECTIONS = [
  {
    key: 'coindrop',
    label: 'CoinDrop',
    fields: [
      { name: 'youtubeHandle', label: 'YouTube Handle', placeholder: '@YourChannelName' },
    ],
  },
  {
    key: 'facebook',
    label: 'Facebook',
    fields: [
      { name: 'profileUrl', label: 'Facebook Profile Link', placeholder: 'https://facebook.com/yourprofile' },
      { name: 'groupUrl', label: 'Facebook Group Link', placeholder: 'https://facebook.com/groups/yourgroup' },
      { name: 'referralCode', label: 'Verification / Referral Code', placeholder: 'e.g. ILLY-1234' },
    ],
  },
  {
    key: 'kick',
    label: 'Kick',
    fields: [
      { name: 'profileUrl', label: 'Kick Profile URL', placeholder: 'https://kick.com/yourprofile' },
    ],
  },
  {
    key: 'twitch',
    label: 'Twitch',
    fields: [
      { name: 'profileUrl', label: 'Twitch Profile URL', placeholder: 'https://twitch.tv/yourprofile' },
    ],
  },
  {
    key: 'instagram',
    label: 'Instagram',
    fields: [
      { name: 'profileUrl', label: 'Public Profile URL', placeholder: 'https://instagram.com/yourprofile' },
    ],
  },
];

function CampaignEditor({ userId, campaign, onClose, onSaved }) {
  const isNew = !campaign;
  const [name, setName] = useState(campaign?.name || '');
  const [budget, setBudget] = useState(campaign?.budget ?? CAMPAIGN_BUDGET_MIN);
  const [platforms, setPlatforms] = useState(campaign?.platforms || emptyPlatforms());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handlePlatformChange = (platformKey, fieldName, value) => {
    setPlatforms((prev) => ({
      ...prev,
      [platformKey]: { ...prev[platformKey], [fieldName]: value },
    }));
  };

  const validate = () => {
    if (!name.trim()) return 'Campaign name is required.';
    if (!isValidBudget(budget)) {
      return `Budget must be between $${CAMPAIGN_BUDGET_MIN} and $${CAMPAIGN_BUDGET_MAX}.`;
    }
    return '';
  };

  const persist = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return null;
    }
    setError('');
    setSaving(true);
    try {
      const payload = { name, budget: Number(budget), platforms };
      let id = campaign?.id;
      if (isNew) {
        id = await createCampaign(userId, payload);
      } else {
        await updateCampaign(userId, campaign.id, payload);
      }
      return id;
    } catch (err) {
      console.error('Failed to save campaign:', err);
      setError('Failed to save campaign. Please try again.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    const id = await persist();
    if (id) onSaved(id, { publish: false });
  };

  const handleSaveAndPublish = async () => {
    const id = await persist();
    if (id) {
      // Pass the saved data along directly rather than relying solely on the
      // Firestore onSnapshot subscription, which may not have delivered the
      // new/updated doc yet by the time we need to open the payment modal.
      onSaved(id, {
        publish: true,
        campaignData: { id, name: name.trim(), budget: Number(budget), platforms },
      });
    }
  };

  return (
    <div className="campaign-modal-overlay" onClick={onClose}>
      <div className="campaign-modal campaign-editor" onClick={(e) => e.stopPropagation()}>
        <button className="campaign-modal-close" onClick={onClose} disabled={saving}>×</button>

        <h2>{isNew ? 'New Campaign' : 'Edit Campaign'}</h2>
        <p className="campaign-modal-sub">
          Configure your campaign budget and which platforms it runs across.
        </p>

        <div className="campaign-field">
          <label>Campaign Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Growth Push"
            disabled={saving}
          />
        </div>

        <div className="campaign-field">
          <label>Budget (${CAMPAIGN_BUDGET_MIN} – ${CAMPAIGN_BUDGET_MAX})</label>
          <div className="campaign-budget-row">
            <input
              type="range"
              min={CAMPAIGN_BUDGET_MIN}
              max={CAMPAIGN_BUDGET_MAX}
              step="1"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              disabled={saving}
            />
            <div className="campaign-budget-value">
              <span>$</span>
              <input
                type="number"
                min={CAMPAIGN_BUDGET_MIN}
                max={CAMPAIGN_BUDGET_MAX}
                value={budget}
                onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <div className="campaign-platforms">
          {PLATFORM_SECTIONS.map((section) => (
            <div className="campaign-platform-section" key={section.key}>
              <h3>{section.label}</h3>
              {section.fields.map((field) => (
                <div className="campaign-field" key={field.name}>
                  <label>{field.label}</label>
                  <input
                    type="text"
                    value={platforms[section.key]?.[field.name] || ''}
                    onChange={(e) => handlePlatformChange(section.key, field.name, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={saving}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {error && <p className="payment-error">{error}</p>}

        <div className="campaign-editor-nav">
          <button className="btn-prev" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn-prev" onClick={handleSaveDraft} disabled={saving}>
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button className="btn-complete" onClick={handleSaveAndPublish} disabled={saving}>
            {saving ? 'Saving…' : 'Save & Publish →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function statusLabel(status) {
  return status === CAMPAIGN_STATUS.ACTIVE ? 'Active' : 'Draft';
}

function configuredPlatformCount(platforms) {
  if (!platforms) return 0;
  return PLATFORM_SECTIONS.filter((section) =>
    section.fields.some((field) => (platforms[section.key]?.[field.name] || '').trim())
  ).length;
}

const CampaignManager = ({ userId }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState(undefined); // undefined = closed, null = new, object = editing
  const [payingCampaignId, setPayingCampaignId] = useState(null);
  const [payingCampaignFallback, setPayingCampaignFallback] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeCampaigns(
      userId,
      (docs) => { setCampaigns(docs); setLoading(false); },
      () => setLoading(false)
    );
    return unsub;
  }, [userId]);

  // Prefer the live subscription's copy once it arrives; fall back to the
  // just-saved data so the payment modal opens immediately after "Save &
  // Publish" without waiting on Firestore's onSnapshot round-trip.
  const payingCampaign =
    campaigns.find((c) => c.id === payingCampaignId) ||
    (payingCampaignFallback?.id === payingCampaignId ? payingCampaignFallback : null);

  const handleSaved = (id, { publish, campaignData }) => {
    setEditingCampaign(undefined);
    if (publish) {
      setPayingCampaignFallback(campaignData || null);
      setPayingCampaignId(id);
    }
  };

  const handleDelete = async (campaign) => {
    if (!window.confirm(`Delete campaign "${campaign.name}"? This cannot be undone.`)) return;
    setDeletingId(campaign.id);
    try {
      await deleteCampaign(userId, campaign.id);
    } catch (err) {
      console.error('Failed to delete campaign:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="dashboard-card campaign-manager">
      <div className="campaign-manager-header">
        <div>
          <h2 className="dashboard-card-title">Campaigns</h2>
          <p className="dashboard-card-sub">
            Create budgeted campaigns across CoinDrop, Facebook, Kick, Twitch, and Instagram.
          </p>
        </div>
        <button className="btn-complete campaign-new-btn" onClick={() => setEditingCampaign(null)}>
          + New Campaign
        </button>
      </div>

      {loading && <p className="hint">Loading campaigns…</p>}

      {!loading && campaigns.length === 0 && (
        <div className="campaign-empty">
          <p>No campaigns yet. Create your first budgeted campaign to get started.</p>
        </div>
      )}

      <div className="campaign-list">
        {campaigns.map((campaign) => (
          <div className="campaign-card" key={campaign.id}>
            <div className="campaign-card-main">
              <div className="campaign-card-title-row">
                <h3>{campaign.name}</h3>
                <span className={`campaign-status campaign-status-${campaign.status}`}>
                  {statusLabel(campaign.status)}
                </span>
              </div>
              <div className="campaign-card-meta">
                <span>${Number(campaign.budget).toFixed(2)} budget</span>
                <span>·</span>
                <span>{configuredPlatformCount(campaign.platforms)} of {PLATFORM_SECTIONS.length} platforms configured</span>
              </div>
            </div>
            <div className="campaign-card-actions">
              <button className="btn-prev" onClick={() => setEditingCampaign(campaign)}>Edit</button>
              {campaign.status === CAMPAIGN_STATUS.DRAFT && (
                <button className="btn-complete" onClick={() => setPayingCampaignId(campaign.id)}>
                  Publish & Pay
                </button>
              )}
              <button
                className="campaign-delete-btn"
                onClick={() => handleDelete(campaign)}
                disabled={deletingId === campaign.id}
              >
                {deletingId === campaign.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingCampaign !== undefined && (
        <CampaignEditor
          userId={userId}
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(undefined)}
          onSaved={handleSaved}
        />
      )}

      {payingCampaign && (
        <CampaignPaymentModal
          userId={userId}
          campaign={payingCampaign}
          onClose={() => setPayingCampaignId(null)}
          onActivated={() => setPayingCampaignId(null)}
        />
      )}
    </section>
  );
};

export default CampaignManager;
