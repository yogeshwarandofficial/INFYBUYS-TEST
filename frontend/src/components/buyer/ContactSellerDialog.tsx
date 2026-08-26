import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateEnquiry } from '@/hooks/useEnquiries';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router';

const formSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactSellerDialogProps {
  listingId: string;
  listingTitle: string;
  sellerName: string;
  trigger?: React.ReactNode;
}

export function ContactSellerDialog({ listingId, listingTitle, sellerName, trigger }: ContactSellerDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createEnquiry } = useCreateEnquiry();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await createEnquiry({
        listingId,
        messageText: data.message,
      });
      setOpen(false);
      form.reset();
      navigate(`/buyer/enquiries/${response.id}`);
    } catch (e: any) {
      if (e.status === 403) {
        alert(e.message || 'Action requires NDA or Subscription.');
        setOpen(false);
      } else {
        alert(e.message || 'Failed to send enquiry.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Contact Seller</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message to the seller of {listingTitle}.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-3 flex items-center gap-3 rounded-lg my-2 border">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">{sellerName}</p>
            <p className="text-xs text-muted-foreground">Seller</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Hi, I'm interested in this business and would like to know more about..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Submit Enquiry
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
