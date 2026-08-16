import React from 'react';
import { Sparkles, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../primitives/Badge';
import './AI.css';

export type RecommendationType =
  | 'MANUAL_INVESTIGATION'
  | 'FAST_TRACK_APPROVAL'
  | 'ESCALATE_SIU'
  | 'REQUEST_MORE_EVIDENCE';

export interface AIRecommendationProps {
  recommendation: RecommendationType;
  customTitle?: string;
  rationale?: string;
  anomalyTags?: string[];
  className?: string;
}

const REC_CONFIG: Record<
  RecommendationType,
  { title: string; badgeLabel: string; icon: React.ReactNode; color: string }
> = {
  MANUAL_INVESTIGATION: {
    title: 'Manual Investigation Recommended',
    badgeLabel: 'Requires Review',
    icon: <AlertCircle size={18} />,
    color: 'var(--cs-warning-text)',
  },
  FAST_TRACK_APPROVAL: {
    title: 'Fast-Track Processing Eligible',
    badgeLabel: 'Low Anomaly',
    icon: <CheckCircle size={18} />,
    color: 'var(--cs-success-text)',
  },
  ESCALATE_SIU: {
    title: 'Escalate to Special Investigations Unit (SIU)',
    badgeLabel: 'High Priority Flag',
    icon: <ShieldAlert size={18} />,
    color: 'var(--cs-danger-text)',
  },
  REQUEST_MORE_EVIDENCE: {
    title: 'Additional Evidence Required',
    badgeLabel: 'Incomplete Documentation',
    icon: <AlertCircle size={18} />,
    color: 'var(--cs-info-text)',
  },
};

export const AIRecommendation: React.FC<AIRecommendationProps> = ({
  recommendation,
  customTitle,
  rationale,
  anomalyTags = [],
  className = '',
}) => {
  const config = REC_CONFIG[recommendation];

  return (
    <div className={`cs-ai-recommendation ${className}`.trim()}>
      <div className="cs-ai-rec-header">
        <span className="cs-ai-rec-badge">
          <Sparkles size={14} />
          <span>AI Recommendation</span>
        </span>
        <Badge variant="neutral" size="sm">
          {config.badgeLabel}
        </Badge>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: config.color, display: 'flex' }}>{config.icon}</span>
        <h3 className="cs-ai-rec-title">{customTitle || config.title}</h3>
      </div>

      {rationale && (
        <p style={{ fontSize: 'var(--cs-text-size-body)', color: 'var(--cs-slate-300)' }}>
          {rationale}
        </p>
      )}

      {anomalyTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
          {anomalyTags.map((tag, i) => (
            <Badge key={i} variant="warning" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="cs-ai-rec-disclaimer">
        * System provides decision support analytics for human investigator review. Final adjudication is determined by authorized personnel.
      </div>
    </div>
  );
};
