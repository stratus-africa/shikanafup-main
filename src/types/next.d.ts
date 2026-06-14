declare module "next/link" {
  export { Link as default } from "@/lib/next-shims";
  export { Link } from "@/lib/next-shims";
}
declare module "next/image" {
  export { Image as default } from "@/lib/next-shims";
  export { Image } from "@/lib/next-shims";
}
declare module "next/navigation" {
  export * from "@/lib/next-shims";
}
declare module "next/headers" {
  export * from "@/lib/next-shims";
}
declare module "next/dynamic" {
  const dynamic: any;
  export default dynamic;
}
declare module "next/font/google" {
  const fn: any;
  export const Inter: any;
  export const Roboto: any;
  export default fn;
}
