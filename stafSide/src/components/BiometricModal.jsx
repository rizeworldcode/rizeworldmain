import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, CheckCircle2, Trash2, Smartphone, ShieldCheck, X, Loader2, AlertCircle } from 'lucide-react';
import { 
  getDeviceBiometricLabel, 
  isBiometricSupported, 
  registerCurrentDeviceBiometrics, 
  getRegisteredBiometrics, 
  deleteRegisteredBiometric 
} from '../biometricAuth';

const BiometricModal = ({ isOpen, onClose }) => {
  const [deviceLabel, setDeviceLabel] = useState('Fingerprint / Face ID');
  const [supported, setSupported] = useState(true);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('staffToken');

  useEffect(() => {
    if (!isOpen) return;

    setDeviceLabel(getDeviceBiometricLabel());
    setError('');
    setSuccess('');

    (async () => {
      const isSupp = await isBiometricSupported();
      setSupported(isSupp);
      loadCredentials();
    })();
  }, [isOpen]);

  const loadCredentials = async () => {
    setLoading(true);
    try {
      const creds = await getRegisteredBiometrics(token);
      setCredentials(creds);
    } catch (err) {
      console.error('Failed to load biometric credentials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    setError('');
    setSuccess('');

    try {
      const deviceName = `${getDeviceBiometricLabel()} (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
      const result = await registerCurrentDeviceBiometrics(token, deviceName);
      setSuccess('Biometric authentication registered successfully! You can now log in with 1-tap.');
      await loadCredentials();
    } catch (err) {
      setError(err.message || 'Failed to register biometric authentication.');
    } finally {
      setRegistering(false);
    }
  };

  const handleDelete = async (credentialId) => {
    if (!window.confirm('Are you sure you want to remove this biometric device?')) return;
    try {
      await deleteRegisteredBiometric(credentialId, token);
      setCredentials(prev => prev.filter(c => c.credentialID !== credentialId));
      setSuccess('Device removed.');
    } catch (err) {
      setError('Failed to remove biometric device.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#121217] text-gray-900 dark:text-white rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 overflow-hidden"
        >
          {/* Decorative ambient gradient */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Fingerprint size={26} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black">Biometric Access</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Touch ID, Face ID & Android Biometrics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-5 space-y-5 relative z-10">
            {/* Device Support Alert */}
            {!supported ? (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-600 dark:text-amber-400 text-xs">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Biometrics not detected on this browser</p>
                  <p className="mt-0.5 text-gray-600 dark:text-gray-400">
                    Make sure you are using Safari, Chrome, Edge, or Samsung Internet with Touch ID, Face ID, or Fingerprint enabled.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 rounded-2xl flex items-start gap-3">
                <ShieldCheck size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  <p className="font-bold text-blue-700 dark:text-blue-300">Fast 1-Tap Passwordless Login</p>
                  <p className="mt-0.5 leading-relaxed">
                    Register your <strong>{deviceLabel}</strong> on this device. Your biometric scan stays securely inside your device's secure enclave (Apple Secure Enclave / Android Titan/Keystore).
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </motion.div>
            )}

            {/* Register Current Device Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              disabled={registering}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {registering ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Scanning Biometrics...</span>
                </>
              ) : (
                <>
                  <Fingerprint size={20} />
                  <span>Register {deviceLabel}</span>
                </>
              )}
            </motion.button>

            {/* Registered Devices List */}
            <div className="pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-between">
                <span>Registered Devices</span>
                <span className="text-[10px] bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full font-bold">
                  {credentials.length} Active
                </span>
              </h4>

              {loading ? (
                <div className="flex items-center justify-center py-6 text-gray-400 text-xs">
                  <Loader2 size={18} className="animate-spin mr-2" />
                  <span>Loading devices...</span>
                </div>
              ) : credentials.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                  <Smartphone className="w-8 h-8 mx-auto text-gray-400 mb-2 opacity-50" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    No biometric device registered yet.
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Click the button above to register this device now.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {credentials.map((cred) => (
                    <div
                      key={cred.credentialID}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/5 hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Fingerprint size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">
                            {cred.deviceName || 'Registered Device'}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            Registered {cred.createdAt ? new Date(cred.createdAt).toLocaleDateString() : 'Active'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(cred.credentialID)}
                        className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove device"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BiometricModal;
