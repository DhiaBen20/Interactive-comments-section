import AddComment from "./components/AddComment";
import CommentsList from "./components/CommentsList";
import { useComments, useUser } from "./data-fetching";

function App() {
    // I've decided to fetch the user's data at the top level and not render the components tree until the data is ready.
    // Doing this ensures that the 'data' property on 'userResponse' is never undefined at any point in the components tree.
    // Because of this, I won't check if the 'data' property is defined before rendering the user's data.
    // However, because I'm using TypeScript, it will keep warning me that the 'data' property is probably undefined, which it really isn't.
    // Using the '!' operator to tell TypeScript not to worry about it or constantly checking for 'undefined' just to satisfy TypeScript is annoying.
    // A solution for this is to use context, but calling the 'useUser' hook later in the tree will make it look as if I am using context.
    const userResponse = useUser();
    const commentsResponse = useComments();

    return (
        <main className="mx-auto md:max-w-3xl py-10 px-4 md:px-0 space-y-6">
            {userResponse.isLoading || commentsResponse.isLoading ? (
                "Loading..."
            ) : (
                <>
                    <CommentsList comments={commentsResponse.data!} />
                    <AddComment />
                </>
            )}
        </main>
    );
}

export default App;
