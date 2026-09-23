import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateEnquiry } from '@/hooks/useEnquiries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';

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
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-y-auto max-h-[95vh] bg-white">
        
        {/* HEADER */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-slate-900">Contact Seller</DialogTitle>
          <DialogDescription className="text-slate-500 text-base mt-1.5">
            Send a message to the seller of {listingTitle}
          </DialogDescription>
        </DialogHeader>

        {/* CONTEXT CARD */}
        <div className="px-6 mb-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4 w-full">
            <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="font-semibold text-slate-900 truncate">{sellerName}</h4>
              <p className="text-sm text-slate-500 truncate">Seller</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col">
            
            <div className="px-6 space-y-8 pb-6">
              
              {/* MESSAGE TEXT SECTION */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full space-y-3">
                    <FormLabel className="text-base font-semibold text-slate-900">Message</FormLabel>
                    <FormControl>
                      <div className="w-full">
                        <Textarea
                          placeholder="Hi, I'm interested in this business and would like to know more about..."
                          className="w-full min-h-[140px] resize-y rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white transition-colors max-w-full min-w-0 box-border [field-sizing:fixed]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-medium text-slate-400">Minimum 10 characters</span>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 w-full mt-auto">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto font-medium"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                className="w-full sm:w-auto font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Enquiry
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
