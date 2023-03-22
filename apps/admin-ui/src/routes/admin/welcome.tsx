import { createFileRoute } from '@tanstack/react-router'
import { KestrelBrand } from '@/components/admin/kestrel-logo'
import { WelcomeWizard } from '@/screens/setup/welcome-wizard'

// Onboarding after a new owner account and shop exist (/admin/setup, sign-up, or creating a shop)
export const Route = createFileRoute('/admin/welcome')({
  staticData: { standalone: true },
  component: () => (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <KestrelBrand />
        <WelcomeWizard />
      </div>
    </div>
  ),
})
