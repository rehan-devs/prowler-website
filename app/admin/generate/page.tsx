import { GenerateKeyForm } from "@/components/admin/generate-key-form";

export default function GeneratePage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Generate License Key
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Manually create a license key. The raw key is shown once only.
        </p>
      </div>
      <GenerateKeyForm />
    </div>
  );
}