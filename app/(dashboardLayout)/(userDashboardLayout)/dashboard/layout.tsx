
import PublicNavbar from '@/components/shared/publicNavbar';
import PublicFooter from './../../../../components/shared/publicFooter';
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}