// Shim: bridges the legacy shadcn `useToast()` API to react-hot-toast,
// which is what the ported app already uses.
import toast from "react-hot-toast";

type ToastInput = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | string;
};

export function useToast() {
  return {
    toast: ({ title, description, variant }: ToastInput) => {
      const message = [title, description].filter(Boolean).join(" — ") || "";
      if (variant === "destructive") {
        toast.error(message);
      } else {
        toast.success(message);
      }
    },
    dismiss: (id?: string) => toast.dismiss(id),
  };
}

export { toast };
