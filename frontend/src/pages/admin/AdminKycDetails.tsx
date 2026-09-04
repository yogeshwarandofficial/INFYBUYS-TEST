import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAdminKycDetails } from '@/hooks/useAdminKyc';
import { ArrowLeft, CheckCircle2, XCircle, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

export default function AdminKycDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { details, isLoading, error, approveKyc, rejectKyc } = useAdminKycDetails(id!);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error || !details) return <div className="p-8 text-red-600">Error loading KYC details</div>;

  const handleApprove = async () => {
    if (confirm('Are you sure you want to approve this KYC application?')) {
      try {
        await approveKyc();
        alert('KYC Approved');
        navigate('/admin/kyc');
      } catch (err) {
        alert('Failed to approve KYC');
      }
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return alert('Reason required');
    try {
      await rejectKyc(rejectReason);
      alert('KYC Rejected');
      setShowRejectModal(false);
      navigate('/admin/kyc');
    } catch (err) {
      alert('Failed to reject KYC');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <button 
        onClick={() => navigate('/admin/kyc')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to KYC Applications
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            KYC Review: {details.businessName}
          </h1>
          <p className="text-gray-500 mt-1">Submitted on {details.kycSubmittedAt ? new Date(details.kycSubmittedAt).toLocaleString() : 'N/A'}</p>
        </div>
        <div className="flex gap-3">
          {details.kycStatus === 'PENDING' && (
            <>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Business Information</h2>
          <div>
            <p className="text-sm text-gray-500">Legal Name</p>
            <p className="font-medium">{details.legalName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Company Number</p>
            <p className="font-medium">{details.companyNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Business Address</p>
            <p className="font-medium">{details.businessAddress || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{details.phone || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Seller Information</h2>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{details.user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{details.user?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold border-b pb-4 mb-4">Uploaded Documents</h2>
        {details.kycDocuments?.length === 0 ? (
          <p className="text-gray-500 text-sm">No documents uploaded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {details.kycDocuments?.map((doc: any) => (
              <div key={doc.id} className="border rounded-lg p-4 flex items-start gap-3 bg-gray-50">
                <FileText className="w-8 h-8 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-gray-900">{doc.documentType}</p>
                  <p className="text-xs text-gray-500 truncate" title={doc.originalFileName}>{doc.originalFileName}</p>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary hover:underline"
                  >
                    View Document <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Reject KYC Application</h3>
            <textarea
              className="w-full border rounded-lg p-3 text-sm focus:ring-primary focus:border-primary"
              rows={4}
              placeholder="Provide a reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
