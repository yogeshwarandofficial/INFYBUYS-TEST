import { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import type { AdminNotificationType } from '../../../store/useAdminStore';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Label } from '../../ui/label';
import { Send, Plus } from 'lucide-react';

export function AdminNotificationCompose() {
  const { createAdminNotification } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AdminNotificationType>('announcement');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    createAdminNotification({
      type,
      title: title.trim(),
      message: message.trim(),
      link: link.trim() || undefined
    });

    setOpen(false);

    // Reset form
    setType('announcement');
    setTitle('');
    setMessage('');
    setLink('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 text-xs gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all w-full lg:w-auto">
          <Plus className="h-3.5 w-3.5" />
          Create 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compose Notification</DialogTitle>
          <DialogDescription>
            Create a new notification or announcement to broadcast to users.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="notif-type">Notification Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as AdminNotificationType)}>
              <SelectTrigger id="notif-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="system">System Alert</SelectItem>
                <SelectItem value="security">Security Alert</SelectItem>
                <SelectItem value="user">User Notification</SelectItem>
                <SelectItem value="seller">Seller Notification</SelectItem>
                <SelectItem value="buyer">Buyer Notification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder="e.g. Scheduled Maintenance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
            <Textarea
              id="message"
              placeholder="Enter the notification content..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Action Link (Optional)</Label>
            <Input
              id="link"
              placeholder="e.g. /admin/users/usr_1"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={!title.trim() || !message.trim()}>
              <Send className="h-4 w-4 mr-2" /> Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
