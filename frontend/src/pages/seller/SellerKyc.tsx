import React, { useState } from 'react';
import { useSellerKyc } from '@/hooks/useSellerKyc';
import { Building2, UploadCloud, CheckCircle2, AlertCircle, Trash2, ShieldCheck, MapPin, Phone, Hash } from 'lucide-react';

export default function SellerKyc() {
  const { data, isLoading, submitKyc, uploadDocument, deleteDocument, lookupCompany } = useSellerKyc();
  
  const [legalName, setLegalName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [companyNumber, setCompanyNumber] = useState('');
  
  const [lookupLoading, setLookupLoading] = useState(false);
  
  const [uploading, setUploading] = useState<string | null>(null);

  React.useEffect(() => {
    if (data && (data.status === 'PENDING' || data.status === 'APPROVED' || data.status === 'REJECTED')) {
      if (data.legalName) setLegalName(data.legalName);
      if (data.businessAddress) setBusinessAddress(data.businessAddress);
      if (data.phone) setPhone(data.phone);
      if (data.companyNumber) setCompanyNumber(data.companyNumber);
    }
  }, [data]);

  const handleLookup = async () => {
    if (!companyNumber) return;
    try {
      setLookupLoading(true);
      const res = await lookupCompany(companyNumber);
      setLegalName(res.company_name || '');
      setBusinessAddress(`${res.registered_office_address?.address_line_1 || ''} ${res.registered_office_address?.locality || ''} ${res.registered_office_address?.postal_code || ''}`);
    } catch (err) {
      alert('Company lookup failed');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(type);
      await uploadDocument(file, type);
    } catch (err: any) {
      alert('Failed to upload document: ' + (err?.response?.data?.message || err.message));
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitKyc({ legalName, businessAddress, phone, companyNumber });
      alert('KYC Submitted Successfully');
    } catch (err: any) {
      alert('Submission failed: ' + (err?.response?.data?.message || err.message));
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  const isPending = data?.status === 'PENDING' && !!data?.submittedAt;
  const isReadOnly = isPending || data?.status === 'APPROVED';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          Business Verification
        </h1>
        <p className="mt-1 text-gray-500">
          Complete your KYC to submit listings on INFYBUYS.
        </p>
      </div>

      {isPending && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-yellow-800 font-medium">Verification Pending</h3>
            <p className="text-yellow-700 text-sm mt-1">Our team is reviewing your business information. You cannot make changes at this time.</p>
          </div>
        </div>
      )}

      {data?.status === 'APPROVED' && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 flex items-start">
          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
          <div>
            <h3 className="text-green-800 font-medium">KYC Verified</h3>
            <p className="text-green-700 text-sm mt-1">Your business has been verified. You can now submit listings.</p>
          </div>
        </div>
      )}

      {data?.status === 'REJECTED' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Verification Rejected</h3>
            <p className="text-red-700 text-sm mt-1">Reason: {data.rejectionReason}</p>
            <p className="text-red-700 text-sm mt-2">Please update your information and resubmit.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Hash className="w-4 h-4" /> Company Number (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={companyNumber}
                  onChange={(e) => setCompanyNumber(e.target.value)}
                  disabled={isReadOnly}
                  className="flex-1 rounded-lg border-gray-300 text-gray-900 bg-white focus:border-primary focus:ring-primary disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="e.g. 12345678"
                />
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={handleLookup}
                    disabled={lookupLoading || !companyNumber}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 font-medium"
                  >
                    {lookupLoading ? 'Looking up...' : 'Lookup'}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Legal Name
              </label>
              <input
                type="text"
                required
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                disabled={isReadOnly}
                className="w-full rounded-lg border-gray-300 text-gray-900 bg-white focus:border-primary focus:ring-primary disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Business Address
              </label>
              <input
                type="text"
                required
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                disabled={isReadOnly}
                className="w-full rounded-lg border-gray-300 text-gray-900 bg-white focus:border-primary focus:ring-primary disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isReadOnly}
                className="w-full rounded-lg border-gray-300 text-gray-900 bg-white focus:border-primary focus:ring-primary disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Document Uploader Builder */}
              {[
                { type: 'IDENTITY', label: 'Identity Proof', desc: 'Passport or ID' },
                { type: 'BUSINESS_PROOF', label: 'Business Proof', desc: 'Certificate of Incorporation' },
                { type: 'ADDRESS_PROOF', label: 'Address Proof', desc: 'Utility Bill / Bank Statement' }
              ].map((docType) => {
                const uploadedDoc = data?.documents?.find(d => d.documentType === docType.type);
                
                return (
                  <div key={docType.type} className="border rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3 bg-gray-50">
                    {uploadedDoc ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900">{docType.label}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]" title={uploadedDoc.originalFileName}>
                            {uploadedDoc.originalFileName}
                          </p>
                        </div>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => deleteDocument(uploadedDoc.id)}
                            className="text-red-600 text-sm hover:text-red-700 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{docType.label}</p>
                          <p className="text-xs text-gray-500">{docType.desc}</p>
                        </div>
                        {!isReadOnly && (
                          <label className="mt-2 cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                            {uploading === docType.type ? 'Uploading...' : 'Upload File'}
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleUpload(e, docType.type)}
                              disabled={uploading !== null}
                            />
                          </label>
                        )}
                      </>
                    )}
                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {!isReadOnly && (
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Submit for Verification
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
