import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import type { FunctionReference } from 'convex/server';
import { useClientNotification } from './useClientNotification';

type UseSafeMutationOptions = {
  errorMessage?: string;
  successMessage?: string;
};

type MutationArgs<TMutation> = TMutation extends (args: infer TArgs) => any ? TArgs : never;
type MutationReturn<TMutation> = TMutation extends (...args: any[]) => infer TReturn
  ? TReturn
  : never;

export const useSafeMutation = <TDefinition extends FunctionReference<any>>(
  mutationDefinition: TDefinition,
  options: UseSafeMutationOptions = {},
) => {
  const { errorMessage, successMessage } = options;
  const mutate = useMutation(mutationDefinition);
  const { notifyError, notifySuccess } = useClientNotification();

  const wrappedMutation = useCallback(
    async (args: MutationArgs<TDefinition>) => {
      try {
        const result = (await mutate(args)) as MutationReturn<TDefinition>;
        if (successMessage) {
          notifySuccess(successMessage);
        }
        return result;
      } catch (error) {
        console.error('Convex mutation failed', {
          mutation: mutationDefinition.name,
          error,
        });
        notifyError(errorMessage ?? 'Something went wrong. Please try again.');
        throw error;
      }
    },
    [errorMessage, mutate, mutationDefinition.name, notifyError, notifySuccess, successMessage],
  );

  return wrappedMutation;
};

export default useSafeMutation;
