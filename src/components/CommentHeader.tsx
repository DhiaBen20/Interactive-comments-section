import { relativeDate } from "../helpers";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import ReplyButton from "./ReplyButton";

type CommentHeaderProps = {
    avatarURL: string;
    username: string;
    createdAt: number;
    isOwnedByCurrentUser: boolean;
    onReplyClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
};

export default function CommentHeader({
    avatarURL,
    username,
    createdAt,
    isOwnedByCurrentUser,
    onReplyClick,
    onEditClick,
    onDeleteClick,
}: CommentHeaderProps) {
    return (
        <div className="md:flex md:justify-between md:items-center">
            <div className="flex items-center space-x-4">
                <div className="w-9">
                    <img src={avatarURL} alt="" className="w-full" />
                </div>
                <h4 className="text-[#324152] font-bold">{username}</h4>
                {isOwnedByCurrentUser && (
                    <span className="rounded-sm text-sm text-white bg-[#5457b6] px-1 xpy-1 inline-block">
                        you
                    </span>
                )}
                <p className="text-[#67727e]">{relativeDate(createdAt)}</p>
            </div>
            <div className="hidden md:block ml-auto space-x-6">
                {isOwnedByCurrentUser ? (
                    <>
                        <DeleteButton onClick={onDeleteClick} />
                        <EditButton onClick={onEditClick} />
                    </>
                ) : (
                    <ReplyButton onClick={onReplyClick} />
                )}
            </div>
        </div>
    );
}
