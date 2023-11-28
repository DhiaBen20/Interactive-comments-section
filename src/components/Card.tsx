import { ReactNode } from "react";

export default function Card({
    noPadding,
    children,
}: {
    noPadding?: boolean;
    children: ReactNode;
}) {
    return (
        <div className={`bg-white rounded-lg ${noPadding ? "" : "p-6"}`}>
            {children}
        </div>
    );
}
