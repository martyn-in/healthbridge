import React from 'react';
import { convex } from '@/lib/convex';
import { api } from '@convex/_generated/api';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { ShieldCheck, Calendar, Hash, User, Activity } from 'lucide-react';

export default async function AdminAuditPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login/admin');

  const logs = await convex.query(api.admin.getAuditLogs, { actorId: session.googleSub });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Append-only security and operational history</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Actor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Target</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(log.timestamp).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wide">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <User className="w-4 h-4 text-slate-400" />
                       <div>
                         <div className="text-xs font-bold text-slate-900">{log.actorRole}</div>
                         <div className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">{log.actorId}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-slate-600 uppercase">{log.targetType}</div>
                    <div className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">{log.targetId || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {log.metadata && (
                      <pre className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 max-w-xs overflow-x-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {logs.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <ShieldCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No audit logs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
