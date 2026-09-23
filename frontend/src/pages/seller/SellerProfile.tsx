import { Seo } from '@/components/shared/Seo';
import { useSellerProfile } from '@/hooks/useSellerProfile';
import { SellerProfileHeader } from '@/components/seller/profile/SellerProfileHeader';
import { SellerProfileCompletion } from '@/components/seller/profile/SellerProfileCompletion';
import { SellerContactInformationCard } from '@/components/seller/profile/SellerContactInformationCard';
import { SellerBusinessInformationCard } from '@/components/seller/profile/SellerBusinessInformationCard';
import { SellerSocialLinksCard } from '@/components/seller/profile/SellerSocialLinksCard';
import { useEffect, useState } from 'react';
import { apiClient } from '@/services/apiClient';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function SellerProfile() {
  const { data: profile, isLoading, error } = useSellerProfile();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.id) {
      apiClient.get<any[]>(`/reviews/seller/${profile.id}`)
        .then(data => setReviews(data))
        .catch(console.error);
    }
  }, [profile?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-xl font-semibold mb-2">Failed to load profile</h2>
        <p className="text-muted-foreground">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <>
      <Seo title="My Profile - Seller Portal | InfyBuys" />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-12">
        <SellerProfileHeader profile={profile} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <SellerBusinessInformationCard profile={profile} />

            {reviews.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Reviews</h2>
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
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <SellerProfileCompletion profile={profile} />
            <SellerContactInformationCard profile={profile} />
            <SellerSocialLinksCard profile={profile} />
          </div>
        </div>
      </div>
    </>
  );
}
