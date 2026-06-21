import { MdClose } from "react-icons/md";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        "2xl": "max-w-6xl",
    };

    const maxW = sizeClasses[size] || "max-w-lg";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black/50 backdrop-blur-sm">
            <div className={`relative w-full ${maxW} mx-auto my-6 px-4`}>
                <div className="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-2xl outline-none focus:outline-none">
                    {/* Header */}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-2xl font-bold text-gray-900">
                            {title}
                        </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-600 transition-colors float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={onClose}
                        >
                            <MdClose />
                        </button>
                    </div>
                    {/* Body */}
                    <div className="relative p-6 flex-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
