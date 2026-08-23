import db from '@/lib/db';
import Link from 'next/link';
import { deleteLicense, logout, unbindDevice } from './actions';
import GenerateModal from './components/GenerateModal';
import ToggleSwitch from './components/ToggleSwitch';

export default async function DashboardPage() {
  const rows = await db.execute('SELECT * FROM licenses ORDER BY created_at DESC') as Record<string, unknown>[];
  const licenses = Array.isArray(rows) ? rows : [];

  return (
    <div className="min-h-screen bg-canvas-parchment pb-20">
      {/* Global Nav-like header */}
      <header className="bg-surface-tile-1 h-[44px] flex items-center justify-between px-6">
        <span className="text-white text-[12px] tracking-[-0.12px]">Admin Dashboard</span>
        <form action={logout}>
          <button type="submit" className="text-white text-[12px] opacity-80 hover:opacity-100 transition-opacity">
            Sign out
          </button>
        </form>
      </header>

      <main className="max-w-[1024px] mx-auto pt-[80px] px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-[40px] font-semibold tracking-tight">Licenses</h1>
          <GenerateModal />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {licenses.map((license: Record<string, unknown>) => (
            <div key={license.id as number} className="bg-canvas border border-hairline rounded-lg p-6 flex flex-col justify-between h-48 shadow-sm group">
              <Link href={`/admin/dashboard/${license.id}`} className="block hover:bg-surface-tile-1 transition-colors -m-6 p-6 pb-2 rounded-t-lg">
                <p className="text-[14px] font-medium text-ink-muted-48 uppercase tracking-wide mb-1">
                  {(license.name as string) || 'Unknown'}
                </p>
                <p className="text-[17px] font-semibold text-ink tracking-tight break-all group-hover:text-primary transition-colors">
                  {license.license_id as string}
                </p>
                {license.machine_id ? (
                  <p className="text-[12px] mt-1 text-ink-muted-80 font-mono truncate" title={license.machine_id as string}>
                    Device: {license.machine_id as string}
                  </p>
                ) : (
                  <p className="text-[12px] mt-1 text-ink-muted-48 italic">
                    Not bound to any device
                  </p>
                )}
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[12px] font-medium ${license.status === 'on' ? 'bg-[#e3f2fd] text-primary' : 'bg-[#f5f5f7] text-ink-muted-48'}`}>
                    {license.status === 'on' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </Link>
              
              <div className="flex justify-between items-center mt-4 border-t border-divider-soft pt-4">
                <div className="flex items-center gap-3">
                  <ToggleSwitch id={license.id as number} initialStatus={license.status as 'on' | 'off'} />
                  <span className="text-[14px] text-ink-muted-80">
                    {license.status === 'on' ? 'On' : 'Off'}
                  </span>
                </div>
                
                <div className="flex gap-4">
                  {!!license.machine_id && (
                    <form action={unbindDevice.bind(null, license.id as number)}>
                      <button type="submit" className="text-amber-600 text-[14px] hover:underline">
                        Unbind
                      </button>
                    </form>
                  )}
                  <form action={deleteLicense.bind(null, license.id as number)}>
                    <button type="submit" className="text-red-500 text-[14px] hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {licenses.length === 0 && (
             <div className="col-span-full py-20 text-center text-ink-muted-48 text-[17px]">
                No licenses generated yet.
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
