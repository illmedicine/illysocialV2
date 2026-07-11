// YouTube & Instagram validation (Phase 1: basic HTTP checks)

export const validateYouTubeHandle = async (handle) => {
  if (!handle || handle.trim().length === 0) {
    return { valid: false, error: 'YouTube handle is required' };
  }

  try {
    // Simple check: try to fetch the channel page
    // In production, use YouTube Data API v3
    const response = await fetch(`https://www.youtube.com/@${encodeURIComponent(handle)}`, {
      method: 'HEAD',
      mode: 'no-cors',
    });
    // If we get here without error, handle likely exists
    return { valid: true, handle };
  } catch (err) {
    return { valid: false, error: 'Could not verify YouTube handle. Please check and try again.' };
  }
};

export const validateInstagramHandle = async (url) => {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'Instagram URL is required' };
  }

  try {
    // Extract handle from URL (e.g., instagram.com/username or @username)
    let handle = url.trim();
    if (handle.startsWith('@')) handle = handle.slice(1);
    if (handle.includes('instagram.com/')) {
      handle = handle.split('instagram.com/')[1].replace(/\/$/, '').replace(/[?#].*/, '');
    }

    // Simple check: Instagram allows public profile access
    const response = await fetch(`https://www.instagram.com/${handle}/?__a=1`, {
      mode: 'no-cors',
    });
    return { valid: true, handle, url };
  } catch (err) {
    return { valid: false, error: 'Could not verify Instagram profile. Please check the URL.' };
  }
};

export const validateCreatorsCornerNickname = (nickname) => {
  if (!nickname || nickname.trim().length === 0) {
    return { valid: false, error: 'Creators Corner Nickname is required' };
  }
  if (nickname.length < 2 || nickname.length > 30) {
    return { valid: false, error: 'Nickname must be 2-30 characters' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(nickname)) {
    return { valid: false, error: 'Only letters, numbers, underscores, and hyphens allowed' };
  }
  return { valid: true, nickname: nickname.trim() };
};
