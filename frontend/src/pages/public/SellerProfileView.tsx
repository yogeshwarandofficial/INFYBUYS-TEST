import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { apiClient } from '@/services/apiClient';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Building2, ShieldCheck } from 'lucide-react';
import { ListingCard } from '@/components/shared/ListingCard';

export default function SellerProfileView() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch seller basic info (requires subscription? handled by backend or we just fetch listings)
        // Since we don't have a public GET /users/:id/profile, we can fetch reviews and their listings.
        
        const [reviewsData, listingsData] = await Promise.all([
          apiClient.get<any[]>(`/reviews/seller/${id}`).catch(() => []),
          apiClient.get<{data: any[]}>(`/listings?sellerId=${id}`).catch(() => ({ data: [] }))
        ]);

        setReviews(reviewsData);
        setListings(listingsData.data);
        
        // Infer seller info from listings
        if (listingsData.data.length > 0) {
          setProfile(listingsData.data[0].seller);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (isLoading) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;

  return (
    <>
      <Seo title={`Seller Profile`} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardContent className="p-8 flex items-center gap-6">
              <img 
                src={profile?.sellerProfile?.avatarKey?.startsWith('http') ? profile.sellerProfile.avatarKey : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'Seller')}&size=128`} 
                alt="Seller Logo" 
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  {profile?.sellerProfile?.businessName && profile.sellerProfile.businessName !== 'Pending KYC' 
                    ? profile.sellerProfile.businessName 
                    : profile?.name || 'Seller Profile'}
                  {profile?.verified && <ShieldCheck className="w-6 h-6 text-success" />}
                </h1>
                <div className="flex gap-4 mt-2 text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {profile?.sellerProfile?.location || 'Unknown Location'}</span>
                  <span className="flex items-center gap-1"><Building2 className="w-4 h-4"/> {profile?.sellerProfile?.sellerType || 'Business Broker'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {reviews.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Seller Reviews</h2>
              <div className="grid gap-4">
                {reviews.map(review => (
                  <Card key={review.id}>
                    <CardContent className="p-6 flex gap-4">
                      <img 
                        src={review.buyer?.buyerProfile?.avatarKey || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.buyer?.name || 'Buyer')}`} 
                        alt="Buyer" 
                        className="w-12 h-12 rounded-full object-cover bg-muted"
                      />
                      <div>
                        <div className="font-semibold mb-1">{review.buyer?.name || 'Anonymous Buyer'}</div>
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? 'fill-orange-400 text-orange-400' : 'text-muted-foreground/30'}`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {listings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Active Listings by this Seller</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {listings.map(l => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
