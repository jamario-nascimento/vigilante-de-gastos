import { Sidebar } from '@/components/ui/Sidebar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-backgroundLight dark:bg-backgroundDark text-slate-800 dark:text-slate-100 flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">My Account</h1>

        <section className="rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold">Personal Details</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm">Full Name</label>
              <Input placeholder="Alex Doe" />
            </div>
            <div>
              <label className="text-sm">Username</label>
              <Input placeholder="alex.doe" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Email</label>
              <Input placeholder="alex.doe@email.com" disabled />
            </div>
          </div>
          <div className="mt-4">
            <Button>Save Changes</Button>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold">Password & Security</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm">Current Password</label>
              <Input type="password" placeholder="Enter your current password" />
            </div>
            <div>
              <label className="text-sm">New Password</label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div>
              <label className="text-sm">Confirm New Password</label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
          </div>
          <div className="mt-4">
            <Button>Update Password</Button>
          </div>
        </section>
      </main>
    </div>
  );
}

