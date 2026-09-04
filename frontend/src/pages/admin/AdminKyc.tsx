import { useAdminKyc } from '@/hooks/useAdminKyc';
import { useNavigate } from 'react-router';
import { ShieldCheck, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminKyc() {
  const { applications, isLoading, error } = useAdminKyc();
  const navigate = useNavigate();

  if (isLoading) return <div className="p-8">Loading KYC Applications...</div>;
  if (error) return <div className="p-8 text-red-600">Error loading KYC data</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          KYC Applications
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Seller</th>
                <th className="px-6 py-4 font-medium">Business / Legal Name</th>
                <th className="px-6 py-4 font-medium">Submitted At</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No KYC applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{app.user?.name}</p>
                      <p className="text-gray-500">{app.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{app.legalName || app.businessName}</p>
                      <p className="text-gray-500 text-xs">No: {app.companyNumber || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {app.kycSubmittedAt ? new Date(app.kycSubmittedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {app.kycStatus === 'PENDING' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3"/> Pending</span>}
                      {app.kycStatus === 'APPROVED' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3"/> Approved</span>}
                      {app.kycStatus === 'REJECTED' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/admin/kyc/${app.id}`)}
                        className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium"
                      >
                        <Eye className="w-4 h-4" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
