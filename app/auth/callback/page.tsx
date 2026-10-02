import AuthCallbackPage from "./callback-client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Connect TMDB Account", description: "Complete your TMDB account connection to Swiftz.", path: "/auth/callback", noIndex: true });

export default AuthCallbackPage;
