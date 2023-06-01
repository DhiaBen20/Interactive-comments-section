import AddComment from "./components/AddComment";
import CommentsList from "./components/CommentsList";
import { useComments, useUser } from "./hooks";

function App() {
    let userResponse = useUser();
    let commentsResponse = useComments();

    if (userResponse.isLoading || commentsResponse.isLoading) {
        return "Loading...";
    }

    return (
        <main className="mx-auto md:max-w-3xl py-10 px-4 md:px-0 space-y-6">
            <CommentsList />
            <AddComment />
        </main>
    );
}

export default App;
