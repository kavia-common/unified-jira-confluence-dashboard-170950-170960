import DashboardLayout from '@/components/DashboardLayout';
import MainContent from '@/components/MainContent';
import { Notifications } from '@/components/Notifications';

// PUBLIC_INTERFACE
export default function Home() {
  return (
    <>
      <DashboardLayout>
        <MainContent />
      </DashboardLayout>
      <Notifications />
    </>
  );
}
