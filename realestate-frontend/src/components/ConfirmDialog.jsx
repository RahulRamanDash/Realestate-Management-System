import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import Button from './Button/Button';
import { BUTTON_VARIANTS } from '../shared/utils/constants';

/**
 * ConfirmDialog - Modal confirmation dialog without window.confirm
 * Better UX than native browser confirm
 */
const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8">
              {title && (
                <h3 className="headline-font page-heading text-lg font-semibold">
                  {title}
                </h3>
              )}

              {message && (
                <p className="page-copy mt-3 text-sm leading-relaxed text-emerald-100/70">
                  {message}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
                <Button
                  variant={danger ? BUTTON_VARIANTS.DANGER : BUTTON_VARIANTS.PRIMARY}
                  onClick={onConfirm}
                  loading={loading}
                  disabled={loading}
                  className="flex-1"
                >
                  {confirmText}
                </Button>
                <Button
                  variant={BUTTON_VARIANTS.SECONDARY}
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  {cancelText}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
