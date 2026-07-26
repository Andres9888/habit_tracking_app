import type { TemplateAddedToastProps, TemplateToastData } from './types';

type ToastVariant = NonNullable<TemplateAddedToastProps['variant']>;

export function getToastCopy(
  templateData: TemplateToastData,
  variant: ToastVariant,
  sessionImportCount: number
) {
  return {
    encouragement:
      variant === 'success' && sessionImportCount > 1
        ? `Nice — you've added ${sessionImportCount} today`
        : variant === 'success'
          ? 'Nice start — keep the momentum going'
          : 'You can open it to review or track progress',
    primaryLabel:
      variant === 'already_exists'
        ? 'Open existing habit'
        : 'View my habit',
    title:
      variant === 'already_exists'
        ? `'${templateData.name}' is already in your habits`
        : `Added '${templateData.name}' to your habits`,
  };
}
