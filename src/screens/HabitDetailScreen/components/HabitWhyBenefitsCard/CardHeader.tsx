import { ChevronDown, ChevronRight, Edit3 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography, fontWeights } from '../../../../theme/typography';

interface CardHeaderProps {
  isExpanded: boolean;
  summaryText: string;
  onToggle: () => void;
  onEdit: () => void;
}

export function CardHeader({ isExpanded, summaryText, onToggle, onEdit }: CardHeaderProps) {
  const showSummary = !isExpanded && summaryText.length > 0;

  return (
    <View className='flex-row items-center'>
      <Pressable
        accessibilityHint={isExpanded ? 'Collapse section' : 'Expand section'}
        accessibilityRole='button'
        className='flex-1 flex-row items-center gap-2 pr-2'
        onPress={onToggle}
      >
        <Text style={{ fontSize: 18 }}>💭</Text>
        <View className='flex-1'>
          <Text
            style={{
              ...typography.caption,
              color: colors.parchment.text,
              fontWeight: fontWeights.bold,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            }}
          >
            Why &amp; Benefits
          </Text>
          {showSummary ? (
            <Text
              className='mt-0.5'
              style={{
                ...typography.caption,
                color: colors.parchment.textStrong,
                lineHeight: 16,
              }}
            >
              {summaryText}
            </Text>
          ) : null}
        </View>
        {isExpanded ? (
          <ChevronDown color={colors.parchment.text} size={18} />
        ) : (
          <ChevronRight color={colors.parchment.text} size={18} />
        )}
      </Pressable>
      <Pressable
        accessibilityLabel='Edit why and benefits'
        accessibilityRole='button'
        className='ml-1 h-8 w-8 items-center justify-center rounded-lg'
        hitSlop={6}
        onPress={onEdit}
      >
        <Edit3 color={colors.parchment.text} size={16} />
      </Pressable>
    </View>
  );
}
