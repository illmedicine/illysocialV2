import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PLATFORMS = ["instagram", "youtube", "tiktok", "twitter", "facebook"];

const CreatorsDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, updateSettings, signout } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Hydrate the settings form once the Firestore profile is available.
  useEffect(() => {
    if (userProfile?.settings) {
      setForm(userProfile.settings);
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSaved(false);
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(form);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signout();
    navigate("/signin", { replace: true });
  };

  if (!currentUser) return null;

  const name = currentUser.displayName || "Creator";
  const initial = (name[0] || "C").toUpperCase();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="dashboard-brand">
            <span className="logo-text">Illy</span>
            <span className="logo-text-accent">social</span>
            <span className="dashboard-tag">Creators Dashboard</span>
          </div>
          <button className="dashboard-signout" onClick={handleSignOut}>
            Sign Out
          </button>
        </header>

        <section className="dashboard-profile">
          {currentUser.photoURL ? (
            <img className="dashboard-avatar" src={currentUser.photoURL} alt={name} referrerPolicy="no-referrer" />
          ) : (
            <div className="dashboard-avatar dashboard-avatar-fallback">{initial}</div>
          )}
          <div>
            <h1 className="dashboard-name">Welcome, {name}</h1>
            <p className="dashboard-email">{currentUser.email}</p>
            <span className="dashboard-provider">Signed in with Google</span>
          </div>
        </section>

        <section className="dashboard-card">
          <h2 className="dashboard-card-title">Your IllySocial Settings</h2>
          <p className="dashboard-card-sub">
            These settings are tied to your Google account and follow you everywhere.
          </p>

          {form && (
            <form className="dashboard-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Display Handle</label>
                <input
                  type="text"
                  name="displayHandle"
                  value={form.displayHandle}
                  onChange={handleChange}
                  placeholder="@yourhandle"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell the community about yourself"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Primary Platform</label>
                <select name="primaryPlatform" value={form.primaryPlatform} onChange={handleChange}>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <label className="dashboard-toggle">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={form.emailNotifications}
                  onChange={handleChange}
                />
                Email me about engagement activity
              </label>

              <label className="dashboard-toggle">
                <input
                  type="checkbox"
                  name="publicProfile"
                  checked={form.publicProfile}
                  onChange={handleChange}
                />
                Make my creator profile public
              </label>

              <button type="submit" className="submit-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </button>
              {saved && <p className="dashboard-saved">✓ Settings saved</p>}
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default CreatorsDashboard;
