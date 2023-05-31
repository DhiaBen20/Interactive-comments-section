export default function Card({ noPadding, ...props }) {
    return (
        <div
            {...props}
            className={`bg-white rounded-lg ${noPadding ? "" : "p-6"}`}
        />
    );
}
