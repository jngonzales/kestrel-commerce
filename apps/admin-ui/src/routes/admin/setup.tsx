import { createFileRoute } from '@tanstack/react-router'
import { KestrelBrand } from '@/components/admin/kestrel-logo'
import { SetupForm } from '@/screens/setup/setup-form'

export const Route = createFileRoute('/admin/setup')({
  staticData: { standalone: true },
  component: () => (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <KestrelBrand />
        <SetupForm />
      </div>
    </div>
  ),
})
