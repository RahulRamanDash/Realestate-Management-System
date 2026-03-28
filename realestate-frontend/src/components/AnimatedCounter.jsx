import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * AnimatedCounter - Animates numbers from 0 to target value
 * Triggers when component comes into view
 */
const AnimatedCounter = ({
  end = 100,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
  format = 'default',
}) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (!inView) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      if (format === 'number') {
        setCount(Math.floor(progress * end));
      } else if (format === 'decimal') {
        setCount((progress * end).toFixed(1));
      } else {
        setCount(Math.floor(progress * end));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, end, duration, format]);

  return (
    <div ref={ref} className={className}>
      <span className="inline-block">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </span>
    </div>
  );
};

export default AnimatedCounter;
