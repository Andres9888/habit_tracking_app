import { colors } from '../../theme/colors';

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
      className='flex min-h-screen items-center justify-center p-4'
      style={{ backgroundColor: colors.background }}
      role='alert'
    >
      <div className='max-w-md text-center'>
        <div className='mb-4 text-5xl'>😕</div>
        <h2 className='mb-2 text-2xl font-semibold' style={{ color: colors.text.primary }}>
          {FALLBACK_HEADING}
        </h2>
        <p className='mb-2 font-semibold' style={{ color: colors.text.primary }}>
          {FALLBACK_SECONDARY_TEXT}
        </p>
        <p className='mb-6 text-sm leading-relaxed' style={{ color: colors.text.secondary }}>
          {FALLBACK_DESCRIPTION}
        </p>
        {__DEV__ ? (
          <pre className='mb-4 rounded-lg border p-3 text-left text-xs' style={{ borderColor: colors.errorLight, backgroundColor: colors.errorLight, color: colors.error }}>
            {String(error)}
          </pre>
        ) : null}
        <button
          aria-label='Reload application'
          className='rounded-xl px-6 py-3 font-semibold text-white transition-colors'
          style={{ backgroundColor: colors.gray[900] }}
          type='button'
          onClick={onReload}
        >
          Reload App
        </button>
      </div>
    </div>
  );
}
