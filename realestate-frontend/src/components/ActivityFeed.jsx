import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Check, Home, Heart, TrendingUp } from 'lucide-react';
import { cn } from '../shared/utils/helpers';

/**
 * ActivityFeed - Shows recent activities/insights
 * Displays timeline of user actions and platform events
 */
const ActivityFeed = ({ activities = [], className = '' }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <Check className="h-4 w-4" />;
      case 'listing':
        return <Home className="h-4 w-4" />;
      case 'favorite':
        return <Heart className="h-4 w-4" />;
      case 'sold':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Check className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'purchase':
        return 'from-emerald-500/20 to-emerald-600/10 border-emerald-400/20';
      case 'listing':
        return 'from-blue-500/20 to-blue-600/10 border-blue-400/20';
      case 'favorite':
        return 'from-pink-500/20 to-pink-600/10 border-pink-400/20';
      case 'sold':
        return 'from-purple-500/20 to-purple-600/10 border-purple-400/20';
      default:
        return 'from-emerald-500/20 to-emerald-600/10 border-emerald-400/20';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-6 text-center', className)}>
        <p className="page-copy text-emerald-100/50">No recent activity</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {activities.map((activity, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            'flex gap-3 rounded-xl border bg-gradient-to-r p-4',
            getActivityColor(activity.type)
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-emerald-300 flex-shrink-0">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="headline-font page-heading text-sm font-medium">
              {activity.title}
            </p>
            <p className="page-copy mt-1 text-xs text-emerald-100/60">
              {activity.description}
            </p>
          </div>
          {activity.time && (
            <p className="page-copy whitespace-nowrap text-xs text-emerald-100/50 flex-shrink-0">
              {activity.time}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityFeed;
