import { useUserStore } from '@/store/useUserStore';
import { ContactSellerDialog } from './ContactSellerDialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

interface ContactSellerActionProps {
  listingId: string;
  listingTitle: string;
  sellerName: string;
}

export function ContactSellerAction({ listingId, listingTitle, sellerName }: ContactSellerActionProps) {
  const { user } = useUserStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button onClick={() => navigate('/login')} className="flex-1 sm:flex-none">
        Contact Seller
      </Button>
    );
  }

  if (!user.roles?.some(r => r.toLowerCase() === 'buyer')) {
    return (
      <Button onClick={() => navigate('/unauthorized')} className="flex-1 sm:flex-none">
        Contact Seller
      </Button>
    );
  }

  return (
    <ContactSellerDialog
      listingId={listingId}
      listingTitle={listingTitle}
      sellerName={sellerName}
      trigger={<Button className="flex-1 sm:flex-none">Contact Seller</Button>}
    />
  );
}
