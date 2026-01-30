import { DEFAULT_ICON_COLOR } from './TemplateCard.constants';
import type { TemplateCardProps } from './TemplateCard.types';

export function getTemplateCardState(props: TemplateCardProps) {
  const {
    isPremium = false,
    hasAccess = true,
    iconColor: iconColorProp,
  } = props;
  const isLocked = isPremium && !hasAccess;
  const iconColor =
    typeof iconColorProp === 'string' && iconColorProp.trim()
      ? iconColorProp.trim()
      : DEFAULT_ICON_COLOR;

  return { iconColor, isLocked };
}
