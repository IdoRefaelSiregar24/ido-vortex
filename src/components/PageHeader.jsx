import { useEffect } from "react";

export default function PageHeader({ title, breadcrumb, children }) {
    useEffect(() => {
        if (title) {
            document.title = `${title} | Apotek Sehat Pekanbaru`;
        }
    }, [title]);

    const breadcrumbItems = Array.isArray(breadcrumb)
        ? breadcrumb
        : breadcrumb
            ? [breadcrumb]
            : [];

    return (
        <div id="pageheader-container" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 text-left">
            <div id="pageheader-left" className="flex flex-col">
                <h1 id="page-title" className="text-2xl md:text-3xl font-semibold text-gray-900">
                    {title}
                </h1>
                {breadcrumbItems.length > 0 && (
                    <div className="flex items-center font-medium space-x-2 mt-2">
                        {breadcrumbItems.map((item, index) => (
                            <span key={index} className="flex items-center space-x-2">
                                {index > 0 && <span className="text-gray-400">/</span>}
                                <span className={
                                    index === breadcrumbItems.length - 1
                                        ? "text-gray-800 font-bold"
                                        : "text-gray-400"
                                }>
                                    {item}
                                </span>
                            </span>
                        ))}
                    </div>
                )}
            </div>
            {children && (
                <div id="action-button" className="flex items-center">
                    {children}
                </div>
            )}
        </div>
    );
}
