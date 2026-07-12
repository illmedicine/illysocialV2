// YouTube & Instagram validation with scraping (Phase 2.1)

export const validateYouTubeHandle = async (handle) => {
  if (!handle || handle.trim().length === 0) {
    return { valid: false, error: 'YouTube handle is required' };
  }

  const cleanHandle = handle.trim().replace(/^@/, '');

  try {
    // Fetch the channel page and check if it contains channel metadata
    const url = `https://www.youtube.com/@${encodeURIComponent(cleanHandle)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.status === 404) {
      return { valid: false, error: 'YouTube channel not found' };
    }

    // Check if we got a valid HTML response
    if (response.ok) {
      const html = await response.text();
      // YouTube loads channel name in the title tag or initial data
      if (html.includes('yt-formatted-string') || html.includes('ytInitialData')) {
        return { valid: true, handle: cleanHandle };
      }
      // Also accept if we just got a successful response (no 404)
      return { valid: true, handle: cleanHandle };
    }

    return { valid: false, error: 'Could not verify YouTube channel. Please check the handle and try again.' };
  } catch (err) {
    console.error('YouTube validation error:', err);
    return { valid: false, error: 'Network error. Please check the handle and try again.' };
  }
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

    // Validate handle format
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(handle)) {
      return { valid: false, error: 'Invalid Instagram handle format' };
    }

    // Fetch the Instagram profile page
    const profileUrl = `https://www.instagram.com/${encodeURIComponent(handle)}/`;
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Instagram returns 404 for non-existent profiles
    if (response.status === 404) {
      return { valid: false, error: 'Instagram profile not found' };
    }

    // Check if we got a valid response
    if (response.ok) {
      const html = await response.text();
      // Check for profile indicators in the response
      if (html.includes('profile') || html.includes('instagram')) {
        return { valid: true, handle, url: profileUrl };
      }
      // Accept successful response even if we can't verify content
      return { valid: true, handle, url: profileUrl };
    }

    return { valid: false, error: 'Could not verify Instagram profile. Please check the URL.' };
  } catch (err) {
    console.error('Instagram validation error:', err);
    return { valid: false, error: 'Network error. Please check the URL and try again.' };
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
