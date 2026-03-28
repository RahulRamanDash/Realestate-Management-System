import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { cn } from '../shared/utils/helpers';

/**
 * FAQ - Accordion-style FAQ component
 * Displays frequently asked questions with smooth expand/collapse
 */
const FAQ = ({ items = [], className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleItem = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="glass-panel overflow-hidden rounded-2xl border border-white/10 transition-all duration-300"
        >
          <button
            onClick={() => toggleItem(index)}
            className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
          >
            <h3 className="headline-font page-heading font-semibold pr-4">
              {item.question}
            </h3>
            <ChevronDown
              className={cn(
                'h-5 w-5 flex-shrink-0 transition-transform duration-300',
                activeIndex === index ? 'rotate-180' : ''
              )}
            />
          </button>

          <AnimatePresence>
            {activeIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/10 px-6 py-4">
                  <p className="page-copy text-sm leading-relaxed text-emerald-100/70">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </section>
  );
};

export default FAQ;
