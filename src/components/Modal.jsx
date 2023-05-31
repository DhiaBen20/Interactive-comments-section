import { useEffect, useState } from "react";
import Button from "./Button";

export default function Modal({ isOpen, close, header, message, confirm }) {
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        function closeModalOnEscape(e) {
            if (e.code == "Escape") {
                close();
            }
        }

        function closeModalOnOverlayClick(e) {
            if (!e.target.closest("[data-dialog]")) {
                close();
            }
        }

        if (isOpen) {
            let scrollBarWidth =
                window.innerWidth - document.documentElement.offsetWidth;

            document.body.style.marginRight = `${scrollBarWidth}px`;
            document.body.style.overflow = "hidden";

            document.addEventListener("keyup", closeModalOnEscape);
            document.addEventListener("click", closeModalOnOverlayClick, {
                capture: true,
            });
        }

        return () => {
            if (isOpen) {
                document.body.style.overflow = "";
                document.body.style.marginRight = "";

                document.removeEventListener("keyup", closeModalOnEscape);
                document.removeEventListener(
                    "click",
                    closeModalOnOverlayClick,
                    { capture: true }
                );
            }
        };
    }, [isOpen]);

    return (
        isOpen && (
            <div className="bg-neutral-900/50 fixed z-10 w-full h-screen top-0 left-0 flex justify-center items-center">
                <div className="bg-white rounded-md max-w-sm p-7" data-dialog>
                    <h2 className="font-bold text-xl text-[#324152] mb-4">
                        {header}
                    </h2>
                    <p className="text-[#67727e]">{message}</p>
                    <div className="grid gap-4 grid-cols-2 mt-5">
                        <Button variant="secondary" onClick={close}>
                            No, Cancel
                        </Button>
                        <Button
                            variant="danger"
                            loading={loading}
                            onClick={() => {
                                setLoading(true);
                                confirm(() => {
                                    setLoading(false);
                                });
                            }}
                        >
                            Yes, Detete
                        </Button>
                    </div>
                </div>
            </div>
        )
    );
}
