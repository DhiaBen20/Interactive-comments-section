import { ComponentPropsWithoutRef } from "react";

export default function Textarea({
    rows = 3,
    ...props
}: { rows?: number } & ComponentPropsWithoutRef<"textarea">) {
    return (
        <textarea
            {...props}
            className="w-full border-2 border-[#eaecf1] rounded py-3 px-5 focus:outline-none focus:border-[#5457b6]"
            rows={rows}
        ></textarea>
    );
}
