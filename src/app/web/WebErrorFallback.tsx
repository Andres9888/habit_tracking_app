const FALLBACK_HEADING = 'We hit a bump';
const FALLBACK_SECONDARY_TEXT = 'Your data is safe.';
const FALLBACK_DESCRIPTION =
  'Something unexpected happened, but nothing was lost. Try reloading the app.';

interface WebErrorFallbackProps {
  error: Error | null;
  onReload: () => void;
}

export function WebErrorFallback({
  error,
  onReload,
}: WebErrorFallbackProps) {
  return (
    <div
      aria-label='An error occurred in the application'
      className='flex min-h-screen items-center justify-center bg-stone-50 p-4'
      role='alert'
    >
      <div className='max-w-md text-center'>
        <div className='mb-4 text-5xl'>😕</div>
        <h2 className='mb-2 text-2xl font-semibold text-stone-900'>
          {FALLBACK_HEADING}
        </h2>
        <p className='mb-2 font-semibold text-stone-900'>
          {FALLBACK_SECONDARY_TEXT}
        </p>
        <p className='mb-6 text-sm leading-relaxed text-stone-600'>
          {FALLBACK_DESCRIPTION}
        </p>
        {__DEV__ ? (
          <pre className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-left text-xs text-red-700'>
            {String(error)}
          </pre>
        ) : null}
        <button
          aria-label='Reload application'
          className='rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-stone-800'
          type='button'
          onClick={onReload}
        >
          Reload App
        </button>
      </div>
    </div>
  );
}
