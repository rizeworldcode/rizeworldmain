import {
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
  startAuthentication,
  startRegistration
} from '@simplewebauthn/browser';

/**
 * Returns the staff API base URL matching local or production deployment.
 */
export const getStaffApiBase = () => {
  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    if (
      h === 'localhost' ||
      h === '127.0.0.1' ||
      h.startsWith('192.168.') ||
      h.startsWith('10.') ||
      h.endsWith('.local')
    ) {
      return `http://${h}:45000/api/staff`;
    }
  }
  return 'https://rizeworldmain.onrender.com/api/staff';
};

/**
 * Safe JSON parser that provides helpful error messages instead of raw SyntaxError when HTML is returned.
 */
const safeParseJson = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    if (res.status === 404) {
      throw new Error('Biometric endpoint not found (404). Please ensure the backend server has been restarted with the latest routes.');
    }
    if (res.status === 401) {
      throw new Error('Your session has expired. Please log in again.');
    }
    throw new Error(`Server returned status ${res.status}: ${text.slice(0, 100)}`);
  }
};

/**
 * Detect friendly platform name and biometric label (Touch ID, Face ID, Android Biometrics).
 */
export const getDeviceBiometricLabel = () => {
  if (typeof navigator === 'undefined') return 'Fingerprint / Face ID';
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua)) {
    return 'Face ID / Touch ID';
  }
  if (/Macintosh|Mac OS X/.test(ua)) {
    return 'Touch ID';
  }
  if (/Android/.test(ua)) {
    return 'Fingerprint / Face Unlock';
  }
  if (/Windows/.test(ua)) {
    return 'Windows Hello';
  }
  return 'Fingerprint / Touch ID';
};

/**
 * Checks if browser and hardware support platform biometric authentication.
 */
export const isBiometricSupported = async () => {
  try {
    if (!browserSupportsWebAuthn()) return false;
    if (typeof platformAuthenticatorIsAvailable === 'function') {
      const isAvailable = await platformAuthenticatorIsAvailable();
      return Boolean(isAvailable);
    }
    return true;
  } catch (err) {
    console.warn('Biometric support check error:', err);
    return false;
  }
};

/**
 * Starts 1-tap biometric authentication login.
 * @param {string} [employeeId] Optional employee ID if entered.
 */
export const loginWithBiometrics = async (employeeId = '') => {
  const base = getStaffApiBase();

  // Step 1: Request authentication challenge options
  const challengeRes = await fetch(`${base}/biometric/login-challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId: employeeId?.trim() || undefined })
  });

  const challengeData = await safeParseJson(challengeRes);
  if (!challengeData.success || !challengeData.options) {
    throw new Error(challengeData.message || 'Failed to initiate biometric login');
  }

  // Step 2: Invoke native OS biometric prompt (Touch ID / Face ID / Android Biometric)
  let authResponse;
  try {
    authResponse = await startAuthentication({ optionsJSON: challengeData.options });
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      throw new Error('Biometric scan was cancelled or timed out.');
    }
    throw new Error(err.message || 'Biometric authentication was cancelled.');
  }

  // Step 3: Verify with backend and receive staff token
  const verifyRes = await fetch(`${base}/biometric/login-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      response: authResponse,
      employeeId: employeeId?.trim() || undefined
    })
  });

  const verifyData = await safeParseJson(verifyRes);
  if (!verifyData.success) {
    throw new Error(verifyData.message || 'Biometric verification failed.');
  }

  return verifyData;
};

/**
 * Registers this device's Touch ID / Face ID / Fingerprint for the logged-in staff.
 * @param {string} token Staff JWT auth token.
 * @param {string} [customDeviceName] Custom label for this device.
 */
export const registerCurrentDeviceBiometrics = async (token, customDeviceName = '') => {
  const base = getStaffApiBase();
  const authToken = token || localStorage.getItem('staffToken');
  if (!authToken) {
    throw new Error('Please log in before registering biometric authentication.');
  }

  // Step 1: Request registration challenge options
  const challengeRes = await fetch(`${base}/biometric/register-challenge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    }
  });

  const challengeData = await safeParseJson(challengeRes);
  if (!challengeData.success || !challengeData.options) {
    throw new Error(challengeData.message || 'Failed to initiate biometric registration');
  }

  // Step 2: Trigger platform registration prompt (Touch ID / Face ID / Android)
  let regResponse;
  try {
    regResponse = await startRegistration({ optionsJSON: challengeData.options });
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      throw new Error('Registration was cancelled.');
    }
    throw new Error(err.message || 'Biometric setup cancelled.');
  }

  // Generate a friendly name if none provided
  const deviceName = customDeviceName || getDeviceBiometricLabel() + ' (' + new Date().toLocaleDateString() + ')';

  // Step 3: Send verification to backend
  const verifyRes = await fetch(`${base}/biometric/register-verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify({
      response: regResponse,
      deviceName
    })
  });

  const verifyData = await safeParseJson(verifyRes);
  if (!verifyData.success) {
    throw new Error(verifyData.message || 'Failed to register biometric credential.');
  }

  return verifyData;
};

/**
 * Fetches list of registered biometric devices.
 */
export const getRegisteredBiometrics = async (token) => {
  const base = getStaffApiBase();
  const authToken = token || localStorage.getItem('staffToken');
  if (!authToken) return [];

  try {
    const res = await fetch(`${base}/biometric/credentials`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const data = await safeParseJson(res);
    return data.success ? (data.credentials || []) : [];
  } catch (err) {
    console.warn('Failed to load registered biometrics:', err.message);
    return [];
  }
};

/**
 * Removes a registered biometric credential.
 */
export const deleteRegisteredBiometric = async (credentialId, token) => {
  const base = getStaffApiBase();
  const authToken = token || localStorage.getItem('staffToken');
  if (!authToken) return false;

  try {
    const res = await fetch(`${base}/biometric/credentials/${credentialId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const data = await safeParseJson(res);
    return Boolean(data.success);
  } catch (err) {
    console.warn('Failed to delete biometric:', err.message);
    return false;
  }
};
