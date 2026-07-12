// YouTube & Instagram validation (Phase 2.1)
// Client-side format validation + basic checks (no CORS-blocked fetches)

export const validateYouTubeHandle = async (handle) => {
  if (!handle || handle.trim().length === 0) {
    return { valid: false, error: 'YouTube handle is required' };
  }

  const cleanHandle = handle.trim().replace(/^@/, '');

  // Validate YouTube handle format
  // YouTube handles can contain letters, numbers, underscores, hyphens, and periods
  if (!/^[a-zA-Z0-9._-]{3,30}$/.test(cleanHandle)) {
    return {
      valid: false,
      error: 'YouTube handle must be 3-30 characters (letters, numbers, _, -, .)'
    };
  }

  // For now, accept valid format as verification
  // In production, this should use a backend API to verify the channel actually exists
  return { valid: true, handle: cleanHandle };
};

export const validateInstagramHandle = async (url) => {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'Instagram URL is required' };
  }

  try {
    // Extract handle from various input formats
    let handle = url.trim();
    if (handle.startsWith('@')) handle = handle.slice(1);
    if (handle.includes('instagram.com/')) {
      handle = handle.split('instagram.com/')[1].replace(/\/$/, '').replace(/[?#].*/, '').split('/')[0];
    }

    // Validate Instagram handle format (usernames can be 1-30 chars)
    // Valid characters: letters, numbers, periods, underscores
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(handle)) {
      return { valid: false, error: 'Invalid Instagram handle format' };
    }

    // Check for common invalid patterns
    if (handle.startsWith('.') || handle.endsWith('.')) {
      return { valid: false, error: 'Username cannot start or end with a period' };
    }

    const profileUrl = `https://www.instagram.com/${handle}/`;

    // For now, accept valid format as verification
    // In production, this should use a backend API to verify the profile actually exists
    return { valid: true, handle, url: profileUrl };
  } catch (err) {
    console.error('Instagram validation error:', err);
    return { valid: false, error: 'Invalid Instagram URL format' };
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
