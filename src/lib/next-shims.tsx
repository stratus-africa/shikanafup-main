// Shim translating Next.js APIs used by ported pages to TanStack Start equivalents.
import * as React from "react";
import {
  Link as TSLink,
  useNavigate,
  useLocation,
  useParams as useTSParams,
} from "@tanstack/react-router";

type LinkProps = {
  href?: string;
  to?: string;
  children?: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
  // allow extra Tailwind/aria props
  [key: string]: any;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      to,
      children,
      prefetch: _prefetch,
      scroll: _scroll,
      shallow: _shallow,
      passHref: _passHref,
      legacyBehavior: _legacyBehavior,
      ...rest
    },
    ref,
  ) => {
    const target = (to ?? href ?? "/") as string;
    // External / hash / mailto / tel — render plain <a>
    if (/^(https?:|mailto:|tel:|#)/.test(target)) {
      return (
        <a ref={ref} href={target} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <TSLink ref={ref} to={target} {...rest}>
        {children}
      </TSLink>
    );
  },
);
Link.displayName = "NextShimLink";

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (path: string) =>
      navigate({ to: path as never }).catch(() => {
        window.location.href = path;
      }),
    replace: (path: string) =>
      navigate({ to: path as never, replace: true }).catch(() => {
        window.location.replace(path);
      }),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => window.location.reload(),
    prefetch: (_path: string) => {},
  };
}

export function usePathname(): string {
  return useLocation({ select: (l) => l.pathname });
}

export function useSearchParams(): URLSearchParams {
  const search = useLocation({ select: (l) => l.search }) as unknown as Record<string, unknown>;
  const params = new URLSearchParams();
  if (search && typeof search === "object") {
    for (const [k, v] of Object.entries(search)) {
      if (v != null) params.set(k, String(v));
    }
  }
  return params;
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  // @ts-expect-error — generic shim across all routes
  return useTSParams({ strict: false }) as T;
}

export function redirect(path: string): never {
  if (typeof window !== "undefined") window.location.href = path;
  throw new Error("REDIRECT:" + path);
}

export function notFound(): never {
  throw new Error("NOT_FOUND");
}

// next/image
type ImageProps = {
  src: string | { src: string };
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  loading?: "lazy" | "eager";
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  [key: string]: any;
};

export function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority: _priority,
  sizes: _sizes,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  unoptimized: _unoptimized,
  className,
  style,
  loading,
  ...rest
}: ImageProps) {
  const resolvedSrc = typeof src === "string" ? src : src?.src;
  const finalStyle: React.CSSProperties = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        ...style,
      }
    : style ?? {};
  return (
    <img
      src={resolvedSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={finalStyle}
      loading={loading ?? (_priority ? "eager" : "lazy")}
      {...rest}
    />
  );
}

// next/font/google — return a dummy className/variable so destructuring works.
type FontResult = {
  className: string;
  variable: string;
  style: { fontFamily: string };
};
function makeFont(): FontResult {
  return { className: "", variable: "", style: { fontFamily: "inherit" } };
}
export const Geist = (_opts?: unknown): FontResult => makeFont();
export const Geist_Mono = (_opts?: unknown): FontResult => makeFont();
export const Inter = (_opts?: unknown): FontResult => makeFont();
export const Roboto = (_opts?: unknown): FontResult => makeFont();
export const Poppins = (_opts?: unknown): FontResult => makeFont();

// next/headers stub
export function cookies() {
  return {
    get: (_name: string) => undefined as { value: string } | undefined,
    getAll: () => [] as Array<{ name: string; value: string }>,
    has: (_name: string) => false,
    set: (_name: string, _value: string) => {},
    delete: (_name: string) => {},
  };
}
export function headers() {
  return new Headers();
}

// next/dynamic — render the dynamic component lazily.
type DynamicOptions = { ssr?: boolean; loading?: () => React.ReactNode };
export function dynamic<T = unknown>(
  loader: () => Promise<{ default: React.ComponentType<T> } | React.ComponentType<T>>,
  opts?: DynamicOptions,
): React.ComponentType<T> {
  const Lazy = React.lazy(async () => {
    const mod = await loader();
    return "default" in (mod as object) ? (mod as { default: React.ComponentType<T> }) : { default: mod as React.ComponentType<T> };
  });
  const fallback = opts?.loading ? opts.loading() : null;
  return ((props: T) => (
    <React.Suspense fallback={fallback as React.ReactNode}>
      {/* @ts-expect-error pass-through props */}
      <Lazy {...props} />
    </React.Suspense>
  )) as React.ComponentType<T>;
}
