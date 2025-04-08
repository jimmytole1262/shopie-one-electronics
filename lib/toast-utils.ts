import type { Toast } from 'react-hot-toast';

type ToastFunctions = {
  success: (message: string | { message: string }) => void;
  error: (message: string | { message: string }) => void;
  loading: (message: string | { message: string }) => void;
};

export async function getToast(): Promise<ToastFunctions> {
  try {
    const mod = await import('react-hot-toast');
    return {
      success: mod.default.success,
      error: mod.default.error,
      loading: mod.default.loading
    };
  } catch {
    return {
      success: (msg: string | { message: string }) => console.log(`✅ ${typeof msg === 'string' ? msg : msg.message}`),
      error: (msg: string | { message: string }) => console.error(`❌ ${typeof msg === 'string' ? msg : msg.message}`),
      loading: (msg: string | { message: string }) => console.log(`⏳ ${typeof msg === 'string' ? msg : msg.message}`)
    };
  }
}
