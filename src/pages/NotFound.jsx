import ErrorPage, { ERROR_CONFIG } from "./ErrorPage";

export default function NotFound() {
    return <ErrorPage {...ERROR_CONFIG[404]} />;
}
