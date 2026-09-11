import { useEffect, useState } from 'react';
import type { HealthResponse } from '@openplm/shared';

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data: HealthResponse) => setHealth(data))
      .catch(() => setHealth({ status: 'error' }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo / Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Open<span className="text-primary-400">PLM</span>
          </h1>
          <p className="mt-3 text-lg text-gray-400 font-light">
            Engineering Product Lifecycle & Change Intelligence Platform
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-md mx-auto shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm font-medium">Backend Status</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  health?.status === 'ok'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : health?.status === 'error'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    health?.status === 'ok'
                      ? 'bg-emerald-400'
                      : health?.status === 'error'
                        ? 'bg-red-400'
                        : 'bg-yellow-400 animate-pulse'
                  }`}
                />
                {health?.status === 'ok' ? 'Connected' : health?.status === 'error' ? 'Disconnected' : 'Checking...'}
              </span>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-500 text-xs">
                M4 — Repository & Engineering Foundation
              </p>
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {['Products', 'BOMs', 'Requirements', 'Dependencies', 'Impact Analysis', 'Workflows'].map(
            (feature) => (
              <span
                key={feature}
                className="px-3 py-1 bg-gray-800/30 border border-gray-700/50 rounded-full text-xs text-gray-500"
              >
                {feature}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
