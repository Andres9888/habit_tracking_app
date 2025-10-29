import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface TemplateListShadowsProps {
  showTop: boolean;
  showBottom: boolean;
}

export const TemplateListShadows = ({ showTop, showBottom }: TemplateListShadowsProps) => (
  <>
    {showTop && (
      <LinearGradient
        colors={['rgba(255,255,255,0.96)', 'rgba(255,255,255,0)']}
        pointerEvents='none'
        style={{ height: 32, left: 0, position: 'absolute', right: 0, top: 0 }}
      />
    )}
    {showBottom && (
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)']}
        pointerEvents='none'
        style={{
          alignItems: 'center',
          bottom: 0,
          height: 56,
          justifyContent: 'flex-end',
          left: 0,
          paddingBottom: 4,
          position: 'absolute',
          right: 0,
        }}
      >
        <View className='mb-1 flex-row items-center rounded-full bg-[rgba(26,26,26,0.08)] px-3 py-1.5'>
          <ChevronDown color='#1a1a1a' size={16} />
          <Text className='ml-1.5 text-xs font-semibold text-[#1a1a1a]'>Scroll for more templates</Text>
        </View>
      </LinearGradient>
    )}
  </>
);
