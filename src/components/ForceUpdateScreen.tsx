import React from 'react';
import CalCreditLogo from './CalCreditLogo';
import { Download, AlertTriangle, Wrench, RefreshCw } from 'lucide-react';
import type { AppVersionConfig } from '../versionUtils';

interface ForceUpdateScreenProps {
  currentVersion: string;
  config: AppVersionConfig;
  onRetry?: () => void;
}

export const ForceUpdateScreen: React.FC<ForceUpdateScreenProps> = ({
  currentVersion,
  config,
  onRetry,
}) => {
  const isMaintenance = Boolean(config.maintenanceMode);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="version-gate-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-6 sm:p-7 shadow-2xl text-center">
        {/* CalCredit Brand Header */}
        <div className="flex justify-center mb-5">
          <CalCreditLogo markSize={38} wordHeight={22} gap={8} />
        </div>

        {/* Icon Badge */}
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-xs ${
            isMaintenance
              ? 'bg-amber-100 text-amber-800'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          {isMaintenance ? (
            <Wrench className="h-7 w-7" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          )}
        </div>

        {/* Title */}
        <h1 id="version-gate-title" className="text-xl sm:text-2xl font-black text-[#172554]">
          {isMaintenance ? 'Under Maintenance' : 'Update Required'}
        </h1>

        {/* Description / Release Notes */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          {isMaintenance
            ? config.maintenanceMessage ||
              'CalCredit is currently undergoing scheduled maintenance. Please check back shortly.'
            : config.releaseNotes ||
              'A newer version of CalCredit is required to continue. Older versions are no longer supported to ensure calculation accuracy with Anna University regulations.'}
        </p>

        {/* Version metadata badge */}
        {!isMaintenance && (
          <div className="my-5 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-500 flex items-center justify-between">
            <span className="font-medium">
              Installed: <strong className="font-mono text-slate-700 font-bold">v{currentVersion}</strong>
            </span>
            <span className="h-4 w-px bg-slate-200" aria-hidden="true" />
            <span className="font-medium">
              Required: <strong className="font-mono text-blue-900 font-bold">v{config.minimumVersion}</strong>
            </span>
          </div>
        )}

        {/* Action Button */}
        {isMaintenance ? (
          onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-[#172554] hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span>Check Again</span>
            </button>
          )
        ) : (
          <div className="mt-5 space-y-2">
            <a
              href={config.updateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-xs font-bold text-white hover:bg-[#1e3a8a] transition-colors shadow-xs cursor-pointer"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download &amp; Install Latest Version</span>
            </a>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" aria-hidden="true" />
                <span>Re-check version</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

