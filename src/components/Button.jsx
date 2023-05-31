export default function Button({
    link,
    variant = "primary",
    loading,
    disabled,
    children,
    ...props
}) {
    if (loading && link) {
        throw new Error("loading property is not supported on link buttons");
    }

    if (!["primary", "danger", "secondary"].includes(variant)) {
        throw new Error(
            `Button variant '${variant}' is not supported. Only Support 'primary', 'secondary', and 'danger'`
        );
    }

    let defaultStyles = `relative disabled:cursor-not-allowed ${
        link ? "" : "text-white uppercase py-2.5 px-7 rounded-md"
    }`;

    let variantStyles = {
        primary: link
            ? "capitalize font-[500] text-[#5457b6] hover:text-[#c3c4ef]"
            : "bg-[#5457b6] hover:bg-[#c3c4ef]",
        secondary: link
            ? "capitalize font-[500] text-[#66727E] hover:text-[#eaecf1]"
            : "bg-[#66727E] hover:bg-[#eaecf1]",
        danger: link
            ? "capitalize font-[500] text-[#EF6364] hover:text-[#ffb8bb]"
            : "bg-[#EF6364] hover:bg-[#ffb8bb]",
    };

    return (
        <button
            {...props}
            className={`${defaultStyles} ${variantStyles[variant]}`}
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