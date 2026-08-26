import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { CategoryCards } from '@/features/public/CategoryCards';

export default function Categories() {
  return (
    <>
      <Seo
        title="All Categories"
        description="Browse all business categories available for sale on InfyBuys."
      />
      <PageHeader
        title="All Categories"
        description="Find the exact niche you're looking for across our entire marketplace."
        breadcrumbs={[{ label: 'Categories' }]}
      />
      <div className="py-8">
        <CategoryCards />
      </div>
    </>
  );
}
