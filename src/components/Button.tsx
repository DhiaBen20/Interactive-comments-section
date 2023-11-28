import { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "danger" | "secondary";

type ButtonProps = {
    variant?: Variant;
    children: ReactNode;
    link?: boolean;
    loading?: boolean;
    disabled?: boolean;
} & ComponentPropsWithoutRef<"button">;

const buttonClasses: Record<Variant, string> = {
    primary: "bg-[#5457b6] hover:bg-[#c3c4ef]",
    secondary: "bg-[#66727E] hover:bg-[#eaecf1]",
    danger: "bg-[#EF6364] hover:bg-[#ffb8bb]",
};

const buttonLinkClasses = {
    primary: "capitalize font-[500] text-[#5457b6] hover:text-[#c3c4ef]",
    secondary: "capitalize font-[500] text-[#66727E] hover:text-[#eaecf1]",
    danger: "capitalize font-[500] text-[#EF6364] hover:text-[#ffb8bb]",
};

export default function Button({
    link,
    variant = "primary",
    loading,
    disabled,
    children,
    ...props
}: ButtonProps) {
    if (loading && link) {
        throw new Error("loading property is not supported on link buttons");
    }

    const defaultClasses = `relative disabled:cursor-not-allowed ${
        link ? "" : "text-white uppercase py-2.5 px-7 rounded-md"
    }`;

    const variantClasses = link
        ? buttonLinkClasses[variant]
        : buttonClasses[variant];

    return (
        <button
            {...props}
            className={`${defaultClasses} ${variantClasses}`}
            disabled={loading || disabled}
        >
            {loading && (
                <span className="absolute left-1/2 -ml-2.5 w-5 h-5 animate-spin rounded-full border-2 border-t-transparent border-r-xtransparent border-white block"></span>
            )}
            <span
                className={`${
                    loading
                        ? "opacity-0"
                        : "inline-flex justify-center items-center"
                }`}
            >
                {children}
            </span>
        </button>
    );
}
