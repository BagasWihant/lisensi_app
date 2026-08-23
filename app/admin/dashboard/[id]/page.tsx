import db from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { removeEnvironment } from './actions';
import AddEnvForm from './components/AddEnvForm';

export default async function LicenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.execute('SELECT * FROM licenses WHERE id = ?', [id]) as Record<string, unknown>[];
  const license = rows?.[0];

  if (!license) {
    notFound();
  }

  // Parse environments safely
  let environments = {};
  if (license.environments) {
    try {
      environments = typeof license.environments === 'string' ? JSON.parse(license.environments) : license.environments;
    } catch (e) {
      console.error('Failed to parse environments JSON', e);
    }
  }

  const envEntries = Object.entries(environments);

  return (
    <div className="min-h-screen bg-canvas-parchment pb-20">
      <header className="bg-surface-tile-1 h-[44px] flex items-center px-6">
        <Link href="/admin/dashboard" className="text-white text-[12px] opacity-80 hover:opacity-100 transition-opacity flex items-center gap-2">
          &larr; Back to Dashboard
        </Link>
      </header>

      <main className="max-w-[1024px] mx-auto pt-[40px] px-6">
        <div className="mb-10">
          <h1 className="text-[40px] font-semibold tracking-tight">{(license.name as string) || 'Unknown'}</h1>
          <p className="text-[17px] text-ink-muted-48 mb-3">{license.license_id as string}</p>
          {license.machine_id ? (
             <div className="inline-flex items-center gap-2 bg-[#f5f5f7] px-3 py-1.5 rounded-md border border-hairline">
               <span className="text-[13px] font-medium text-ink-muted-80 uppercase tracking-wider">Device Bound</span>
               <span className="text-[14px] font-mono text-ink">{license.machine_id as string}</span>
             </div>
          ) : (
             <div className="inline-flex items-center gap-2 bg-canvas px-3 py-1.5 rounded-md border border-hairline border-dashed">
               <span className="text-[13px] font-medium text-ink-muted-48 uppercase tracking-wider">Unbound</span>
               <span className="text-[14px] text-ink-muted-48 italic">Ready to be used on a device</span>
             </div>
          )}
        </div>

        <div className="bg-canvas border border-hairline rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[20px] font-semibold tracking-tight">Environments</h2>
          </div>

          <div className="mb-8">
            <AddEnvForm licenseId={license.id as number} />
          </div>

          {envEntries.length > 0 ? (
            <div className="overflow-hidden border border-hairline rounded-md">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-[#f5f5f7] border-b border-hairline text-ink-muted-48 font-medium">
                  <tr>
                    <th className="px-4 py-3 w-1/3">Key</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3 w-20 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {envEntries.map(([key, value]) => (
                    <tr key={key} className="hover:bg-[#fafafa]">
                      <td className="px-4 py-3 font-mono text-ink">{key}</td>
                      <td className="px-4 py-3 font-mono text-ink">{String(value)}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={removeEnvironment.bind(null, license.id as number, key)}>
                          <button type="submit" className="text-red-500 hover:underline">
                            Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-ink-muted-48 border border-hairline rounded-md border-dashed bg-[#fafafa]">
              No environments configured yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
