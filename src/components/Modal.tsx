import { useEffect } from "react";
import Button from "./Button";

type ModalProps = {
    isOpen?: boolean;
    close: () => void;
    confirm: () => void;
    header: string;
    message: string;
};

export default function Modal({
    isOpen,
    close,
    header,
    message,
    confirm,
}: ModalProps) {
    useEffect(() => {
        function closeModalOnEscape(e: KeyboardEvent) {
            if (e.code == "Escape") {
                close();
            }
        }

        function closeModalOnOverlayClick(e: MouseEvent) {
            if (
                e.target instanceof HTMLElement &&
                !e.target.closest("[data-dialog]")
            ) {
                close();
            }
        }

        if (isOpen) {
            const scrollBarWidth =
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
    }, [close, isOpen]);

    return isOpen ? (
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
                        onClick={() => {
                            // The Modal is rendered inisde each comment component,
                            // When i delete a comment its component also gets deleted,
                            // which will also delete the modal component.
                            // which means, there is no need to hide the modal after deleting the comment

                            confirm();
                        }}
                    >
                        Yes, Detete
                    </Button>
                </div>
            </div>
        </div>
    ) : null;
}
