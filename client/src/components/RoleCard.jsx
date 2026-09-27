import React from 'react';
import Badge from './Badge';

/**
 * Lean RoleCard component displaying role definition and boundary rules.
 */
export const RoleCard = ({ title, badgeText, badgeVariant, description, boundary }) => {
  return (
    <div className="role-card" data-testid={`role-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="role-card-header">
        <h3>{title}</h3>
        <Badge variant={badgeVariant}>{badgeText}</Badge>
      </div>
      <p className="role-desc">{description}</p>
      {boundary && (
        <div className="role-boundary">
          <strong>Boundary:</strong> {boundary}
        </div>
      )}
    </div>
  );
};

export default RoleCard;
