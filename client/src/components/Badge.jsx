import React from 'react';

/**
 * Reusable Badge component for roles and statuses.
 */
export const Badge = ({ children, variant = 'neutral' }) => {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
};

export default Badge;
