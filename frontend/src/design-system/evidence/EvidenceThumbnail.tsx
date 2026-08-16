import React from 'react';
import { RiskBadge } from '../primitives/Badge';
import { RiskLevel } from '../tokens/colors';
import './Evidence.css';

export interface EvidenceThumbnailProps {
  id: string;
  imageUrl: string;
  label?: string;
  tag?: string;
  riskLevel?: RiskLevel;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const EvidenceThumbnail: React.FC<EvidenceThumbnailProps> = ({
  imageUrl,
  label,
  tag,
  riskLevel,
  isSelected = false,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`cs-evidence-thumb ${isSelected ? 'cs-thumb-selected' : ''} ${className}`.trim()}
      onClick={onClick}
    >
      <img src={imageUrl} alt={label || 'Damage photo thumbnail'} />
      {tag && <span className="cs-thumb-tag">{tag}</span>}
      {riskLevel && (
        <div style={{ position: 'absolute', top: 4, right: 4 }}>
          <RiskBadge level={riskLevel} size="sm" showLabel={false} />
        </div>
      )}
    </div>
  );
};

export interface EvidenceGalleryProps {
  items: Array<{
    id: string;
    imageUrl: string;
    label?: string;
    tag?: string;
    riskLevel?: RiskLevel;
  }>;
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  items,
  selectedId,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`cs-evidence-gallery ${className}`.trim()}>
      {items.map((item) => (
        <EvidenceThumbnail
          key={item.id}
          id={item.id}
          imageUrl={item.imageUrl}
          label={item.label}
          tag={item.tag}
          riskLevel={item.riskLevel}
          isSelected={item.id === selectedId}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
};
