import { mutate } from "swr";

// I don't want to use the API retuned values to populate the cache after a mutation,
// but instead i will use optimisticData option to modify the cache to reflect the new data on the server.
// Also, the mutator function's only job is to send the request, its return value is unnecessary.

export default function useTrigger<KeyData, TriggerArgument>(
    key: string,
    mutator: (arg: TriggerArgument) => undefined,
    optimisticFn: (value: KeyData | undefined, arg: TriggerArgument) => KeyData
) {
    return function trigger(arg: TriggerArgument) {
        mutate<KeyData>(
            key,
            () => {
                mutator(arg);

                return undefined;
            },
            {
                populateCache: false,
                rollbackOnError: true,
                optimisticData: (data?: KeyData) => {
                    return optimisticFn(data, arg);
                },
            }
        );
    };
}
