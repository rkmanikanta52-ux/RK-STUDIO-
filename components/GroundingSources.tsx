import React from 'react';
import { GroundingChunk } from '../types';
import { ExternalLinkIcon } from './Icons';

interface GroundingSourcesProps {
  chunks?: GroundingChunk[];
}

export const GroundingSources: React.FC<GroundingSourcesProps> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;

  // Deduplicate sources based on URI
  const uniqueMap = new Map<string, GroundingChunk>();
  chunks.forEach((chunk) => {
    if (chunk.web?.uri) {
      uniqueMap.set(chunk.web.uri, chunk);
    }
  });
  const uniqueChunks = Array.from(uniqueMap.values());

  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Sources Verified by Google Search
      </h3>
      <div className="flex flex-wrap gap-2">
        {uniqueChunks.map((chunk, idx) => (
          chunk.web && (
            <a
              key={idx}
              href={chunk.web.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-orange-600 hover:border-orange-200 hover:shadow-sm transition-colors"
            >
              <span className="truncate max-w-[150px]">{chunk.web.title || new URL(chunk.web.uri).hostname}</span>
              <ExternalLinkIcon className="w-3 h-3 flex-shrink-0" />
            </a>
          )
        ))}
      </div>
    </div>
  );
};