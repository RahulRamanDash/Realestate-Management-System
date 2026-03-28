import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import Button from './Button/Button';
import { BUTTON_VARIANTS } from '../shared/utils/constants';
import { cn } from '../shared/utils/helpers';

/**
 * CTASection - Call-to-action section with heading, description, and buttons
 * Creates an engaging section that encourages user action
 */
const CTASection = ({
  headline,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  backgroundImage,
  dark = false,
  centered = true,
  className = '',
  onPrimaryClick,
  onSecondaryClick,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className={cn(
        'relative overflow-hidden rounded-3xl px-6 py-12 md:py-16 lg:py-20',
        'bg-gradient-to-br',
        dark
          ? 'from-black/40 to-emerald-600/20 border border-emerald-500/30'
          : 'from-emerald-500/10 to-emerald-600/5 border border-emerald-400/20',
        className
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {}
      }
    >
      {/* Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-10',
          centered ? 'mx-auto max-w-3xl text-center' : 'max-w-4xl'
        )}
      >
        {headline && (
          <motion.h2
            variants={itemVariants}
            className="headline-font page-heading mb-4 text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            {headline}
          </motion.h2>
        )}

        {description && (
          <motion.p
            variants={itemVariants}
            className="page-copy mb-8 text-base leading-relaxed sm:text-lg md:text-xl"
          >
            {description}
          </motion.p>
        )}

        {(primaryButtonText || secondaryButtonText) && (
          <motion.div
            variants={itemVariants}
            className={cn(
              'flex flex-col gap-3',
              centered ? 'items-center sm:flex-row sm:justify-center' : 'sm:flex-row'
            )}
          >
            {primaryButtonText && (
              <Button
                variant={BUTTON_VARIANTS.PRIMARY}
                onClick={onPrimaryClick}
                href={primaryButtonLink}
                className="w-full sm:w-auto"
              >
                {primaryButtonText}
              </Button>
            )}
            {secondaryButtonText && (
              <Button
                variant={BUTTON_VARIANTS.SECONDARY}
                onClick={onSecondaryClick}
                href={secondaryButtonLink}
                className="w-full sm:w-auto"
              >
                {secondaryButtonText}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default CTASection;
