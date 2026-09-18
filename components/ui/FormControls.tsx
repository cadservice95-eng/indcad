import { cn } from "@/lib/utils";

const fieldBase =
  "w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-neutral-400 transition-colors focus:border-copper-500 focus:outline-none focus:ring-1 focus:ring-copper-500";

export function Field({
  label,
  htmlFor,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label}
        {required ? <span className="text-copper-500"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldBase, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldBase, "resize-y", props.className)} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldBase, "bg-white", props.className)} />;
}
