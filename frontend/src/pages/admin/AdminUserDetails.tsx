import { useParams, useNavigate } from 'react-router';
import { useAdminStore } from '../../store/useAdminStore';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Mail, Phone, MapPin, Building2, Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminUserRoleBadge } from '../../components/admin/users/AdminUserRoleBadge';
import { AdminUserStatusBadge } from '../../components/admin/users/AdminUserStatusBadge';
import { AdminUserActions } from '../../components/admin/users/AdminUserActions';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { format } from 'date-fns';

export default function AdminUserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAdminStore((state) => state.users.find(u => u.id === id));

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <p className="text-muted-foreground">The user you are looking for does not exist or has been deleted.</p>
        <Button onClick={() => navigate('/admin/users')}>Back to Users</Button>
      </div>
    );
  }

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to users</span>
        </Button>
        <PageHeader title="User Details" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users', href: '/admin/users' }, { label: 'Details' }]} className="mb-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Summary */}
        <Card className="md:col-span-1 border-t-4 border-t-primary shadow-sm h-fit">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24 border-2">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <AdminUserRoleBadge role={user.role} />
              <AdminUserStatusBadge status={user.status} />
            </div>

            <div className="w-full pt-4 border-t flex justify-center">
              <AdminUserActions user={user} />
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <span className="text-xs text-emerald-600 font-medium">
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone Number</p>
                  <p className="text-sm text-muted-foreground">{user.phone || 'Not provided'}</p>
                  <span className="text-xs text-emerald-600 font-medium">
                    {user.phoneVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{user.location || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">{user.company || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col p-4 bg-muted/50 rounded-lg text-center">
                <span className="text-2xl font-bold">{user.listingCount}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Listings</span>
              </div>
              <div className="flex flex-col p-4 bg-muted/50 rounded-lg text-center">
                <span className="text-2xl font-bold">{user.enquiryCount}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Enquiries</span>
              </div>
              <div className="flex flex-col p-4 bg-muted/50 rounded-lg text-center">
                <span className="text-2xl font-bold">{user.messageCount}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Messages</span>
              </div>
              <div className="flex flex-col p-4 bg-muted/50 rounded-lg text-center">
                <span className="text-2xl font-bold">
                  {user.lastLoginAt ? format(new Date(user.lastLoginAt), 'MMM d') : '-'}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Last Login</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.activities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity found for this user.</p>
              ) : (
                <div className="space-y-4">
                  {user.activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4 relative">
                      {/* Timeline line */}
                      {index !== user.activities.length - 1 && (
                        <div className="absolute left-2 top-6 bottom-[-1rem] w-px bg-border"></div>
                      )}

                      <div className="mt-1 h-4 w-4 rounded-full bg-primary/20 border border-primary shrink-0 relative z-10"></div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">{activity.action}</p>
                        {activity.details && <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>}
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(activity.date), 'MMM d, yyyy h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
