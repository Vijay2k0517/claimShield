import React from 'react';
import { Check, Loader2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../primitives/Button';
import './AI.css';

export type PipelineStageStatus = 'pending' | 'active' | 'done' | 'failed';

export interface PipelineStage {
  id: string;
  label: string;
  status: PipelineStageStatus;
  durationMs?: number;
}

export type ProcessingStateMode = 'READY' | 'PROCESSING' | 'SUCCESS' | 'FAILURE' | 'EMPTY';

export interface AIProcessingStateProps {
  mode: ProcessingStateMode;
  stages?: PipelineStage[];
  onRetry?: () => void;
  onStartAnalysis?: () => void;
  errorMessage?: string;
  emptyMessage?: string;
  className?: string;
}

const DEFAULT_STAGES: PipelineStage[] = [
  { id: '1', label: 'Receiving and validating evidence media', status: 'done', durationMs: 140 },
  { id: '2', label: 'Extracting EXIF timestamps and camera metadata', status: 'done', durationMs: 220 },
  { id: '3', label: 'Running multi-modal damage vision classification', status: 'active' },
  { id: '4', label: 'Searching historical vector claim embeddings', status: 'pending' },
  { id: '5', label: 'Synthesizing Explainable AI (XAI) risk assessment', status: 'pending' },
];

export const AIProcessingState: React.FC<AIProcessingStateProps> = ({
  mode,
  stages = DEFAULT_STAGES,
  onRetry,
  onStartAnalysis,
  errorMessage = 'The AI analysis engine timed out while generating the visual damage heatmap.',
  emptyMessage = 'No vehicle damage evidence submitted for AI processing.',
  className = '',
}) => {
  if (mode === 'READY') {
    return (
      <div className={`cs-processing-pipeline ${className}`.trim()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 'var(--cs-font-weight-semibold)', color: 'var(--cs-text-primary)' }}>
              Ready for AI Assessment
            </div>
            <div style={{ fontSize: 'var(--cs-text-size-caption)', color: 'var(--cs-slate-400)' }}>
              Claim media & vehicle details validated. Ready to trigger neural vision models.
            </div>
          </div>
          {onStartAnalysis && (
            <Button variant="primary" size="sm" onClick={onStartAnalysis}>
              Run AI Analysis
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'EMPTY') {
    return (
      <div className={`cs-processing-pipeline ${className}`.trim()}>
        <div style={{ textAlign: 'center', padding: 'var(--cs-space-4)', color: 'var(--cs-slate-400)' }}>
          {emptyMessage}
        </div>
      </div>
    );
  }

  if (mode === 'FAILURE') {
    return (
      <div className={`cs-processing-pipeline ${className}`.trim()} style={{ borderColor: 'var(--cs-danger-border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--cs-danger-subtle)',
              color: 'var(--cs-danger-text)',
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'var(--cs-font-weight-semibold)', color: 'var(--cs-danger-text)' }}>
              AI Analysis Failed
            </div>
            <div style={{ fontSize: 'var(--cs-text-size-body-sm)', color: 'var(--cs-slate-300)', marginTop: '2px' }}>
              {errorMessage}
            </div>
            {onRetry && (
              <div style={{ marginTop: '8px' }}>
                <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<RefreshCw size={12} />}>
                  Retry Analysis
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`cs-processing-pipeline ${className}`.trim()}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--cs-space-2)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--cs-text-size-caption)',
            fontWeight: 'var(--cs-font-weight-semibold)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--cs-tracking-wider)',
            color: 'var(--cs-primary-text)',
          }}
        >
          {mode === 'SUCCESS' ? 'AI Pipeline Execution Complete' : 'AI Analysis in Progress...'}
        </span>
        {mode === 'PROCESSING' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cs-primary-text)', fontSize: 'var(--cs-text-size-caption)' }}>
            <Loader2 size={12} className="cs-btn-spinner" />
            <span>Processing</span>
          </span>
        )}
      </div>

      {stages.map((stage) => {
        const isDone = stage.status === 'done' || mode === 'SUCCESS';
        const isActive = stage.status === 'active' && mode === 'PROCESSING';

        return (
          <div key={stage.id} className="cs-pipeline-step">
            <div
              className={`cs-pipeline-step-icon ${
                isDone ? 'cs-step-done' : isActive ? 'cs-step-active' : 'cs-step-pending'
              }`}
            >
              {isDone ? (
                <Check size={13} />
              ) : isActive ? (
                <Loader2 size={13} className="cs-btn-spinner" />
              ) : (
                <Clock size={12} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0, color: isDone || isActive ? 'var(--cs-text-primary)' : 'var(--cs-slate-400)' }}>
              {stage.label}
            </div>

            {stage.durationMs && isDone && (
              <span className="cs-tabular-nums" style={{ fontSize: '10px', color: 'var(--cs-slate-500)' }}>
                {stage.durationMs}ms
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
