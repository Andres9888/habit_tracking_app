/**
 * VisualizationGuide Component
 * Based on Andrew Huberman's research on effective goal visualization
 *
 * Key principles:
 * - Process visualization (visualize steps, not just outcomes)
 * - Obstacle/fear visualization (anticipate challenges)
 * - Contrast visualization (current vs desired state)
 * - Action-focused imagery (next small step)
 *
 * References:
 * - Huberman Lab Podcast: Goal Setting & Neural Mechanisms
 * - Research on mental contrasting (Oettingen, 2014)
 * - Implementation intentions (Gollwitzer, 1999)
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeIn, SlideInRight } from 'react-native-reanimated';
import {
  Brain,
  Eye,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Zap,
  Mountain,
  ArrowRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface VisualizationTechnique {
  bad: {
    description: string;
    example: string;
    icon: React.ReactNode;
    title: string;
    why: string;
  };
  good: {
    description: string;
    example: string;
    icon: React.ReactNode;
    title: string;
    why: string;
  };
  id: string;
}

const VISUALIZATION_TECHNIQUES: VisualizationTechnique[] = [
  {
    bad: {
      description: 'Fantasizing only about the end goal (e.g., seeing yourself fit and successful)',
      example: '"I imagine myself having already achieved my goal, feeling amazing and confident."',
      icon: <XCircle className="text-rose-500" size={18} />,
      title: 'Outcome-Only Fantasy',
      why: 'Reduces dopamine drive and tricks brain into feeling satisfied before taking action',
    },
    good: {
      description: 'Visualize the specific steps and actions you need to take',
      example: '"I see myself putting on my running shoes, stepping outside, and taking the first steps."',
      icon: <CheckCircle2 className="text-emerald-500" size={18} />,
      title: 'Process Visualization',
      why: 'Activates motor planning regions and creates neural pathways for action',
    },
    id: 'process',
  },
  {
    bad: {
      description: 'Ignoring potential obstacles and assuming everything will go smoothly',
      example: '"I just stay positive and trust that it will all work out."',
      icon: <XCircle className="text-rose-500" size={18} />,
      title: 'Blind Optimism',
      why: 'Leaves you unprepared and more likely to quit when challenges arise',
    },
    good: {
      description: 'Anticipate obstacles and mentally rehearse overcoming them',
      example: '"When I feel tired after work, I will put on my workout clothes immediately before sitting down."',
      icon: <CheckCircle2 className="text-emerald-500" size={18} />,
      title: 'Obstacle Anticipation',
      why: 'Prepares your brain with pre-planned responses (implementation intentions)',
    },
    id: 'obstacles',
  },
  {
    bad: {
      description: 'Dwelling on past failures or current struggles without direction',
      example: '"I keep thinking about all the times I\'ve failed before."',
      icon: <XCircle className="text-rose-500" size={18} />,
      title: 'Ruminating on Failure',
      why: 'Creates learned helplessness and strengthens negative neural patterns',
    },
    good: {
      description: 'Compare current state with desired state to create productive tension',
      example: '"Right now I skip workouts, but I want to be someone who never misses. What\'s different?"',
      icon: <CheckCircle2 className="text-emerald-500" size={18} />,
      title: 'Mental Contrasting',
      why: 'Creates motivational gap that drives action without demotivating',
    },
    id: 'contrast',
  },
  {
    bad: {
      description: 'Focusing only on distant, abstract goals',
      example: '"Someday I\'ll be healthy and have great habits."',
      icon: <XCircle className="text-rose-500" size={18} />,
      title: 'Vague Future Focus',
      why: 'Too abstract for brain to create actionable plans',
    },
    good: {
      description: 'Focus on the very next action you need to take',
      example: '"Tomorrow at 7am, I will drink a glass of water before checking my phone."',
      icon: <CheckCircle2 className="text-emerald-500" size={18} />,
      title: 'Next Action Focus',
      why: 'Concrete, specific actions activate prefrontal cortex planning',
    },
    id: 'next-action',
  },
];

interface VisualizationCardProps {
  technique: VisualizationTechnique;
}

function VisualizationCard({ technique }: VisualizationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(!expanded);
  };

  return (
    <Animated.View
      className="overflow-hidden rounded-2xl border border-stone-100"
      entering={FadeInDown.delay(100).springify()}
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Header */}
      <Pressable
        accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} ${technique.good.title} technique`}
        accessibilityRole="button"
        className="flex-row items-center gap-3 p-4 active:bg-stone-50"
        onPress={handleToggle}
      >
        <View
          className="h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: '#ede9fe' }}
        >
          <Brain color="#7c3aed" size={20} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-stone-800">
            {technique.good.title}
          </Text>
          <Text className="text-xs text-stone-500">
            vs. {technique.bad.title}
          </Text>
        </View>
        {expanded ? (
          <ChevronUp color="#a8a29e" size={20} />
        ) : (
          <ChevronDown color="#a8a29e" size={20} />
        )}
      </Pressable>

      {/* Expanded Content */}
      {expanded && (
        <Animated.View
          className="border-t border-stone-100 px-4 pb-4"
          entering={FadeIn.duration(200)}
          style={{ backgroundColor: '#fafaf9' }}
        >
          {/* Good Visualization */}
          <View className="mt-4">
            <View className="mb-2 flex-row items-center gap-2">
              {technique.good.icon}
              <Text className="text-sm font-semibold text-emerald-700">
                ✓ Effective Approach
              </Text>
            </View>
            <View className="rounded-xl p-3" style={{ backgroundColor: '#ecfdf5' }}>
              <Text className="text-sm leading-relaxed text-stone-700">
                {technique.good.description}
              </Text>
              <View
                className="mt-3 rounded-lg p-2.5"
                style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
              >
                <Text className="text-xs italic text-stone-600">
                  {technique.good.example}
                </Text>
              </View>
              <View className="mt-2 flex-row items-start gap-2">
                <Lightbulb color="#f59e0b" size={14} style={{ marginTop: 2 }} />
                <Text className="flex-1 text-xs text-stone-600">
                  <Text className="font-medium">Why it works: </Text>
                  {technique.good.why}
                </Text>
              </View>
            </View>
          </View>

          {/* Bad Visualization */}
          <View className="mt-4">
            <View className="mb-2 flex-row items-center gap-2">
              {technique.bad.icon}
              <Text className="text-sm font-semibold text-rose-700">
                ✗ Common Mistake
              </Text>
            </View>
            <View className="rounded-xl p-3" style={{ backgroundColor: '#fff1f2' }}>
              <Text className="text-sm leading-relaxed text-stone-700">
                {technique.bad.description}
              </Text>
              <View
                className="mt-3 rounded-lg p-2.5"
                style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
              >
                <Text className="text-xs italic text-stone-600">
                  {technique.bad.example}
                </Text>
              </View>
              <View className="mt-2 flex-row items-start gap-2">
                <AlertTriangle color="#f43f5e" size={14} style={{ marginTop: 2 }} />
                <Text className="flex-1 text-xs text-stone-600">
                  <Text className="font-medium">Why to avoid: </Text>
                  {technique.bad.why}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

interface QuickTipProps {
  description: string;
  icon: React.ReactNode;
  title: string;
}

function QuickTip({ description, icon, title }: QuickTipProps) {
  return (
    <View
      className="flex-row items-start gap-3 rounded-xl p-3"
      style={{ backgroundColor: '#fffbeb' }}
    >
      <View
        className="h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: '#fef3c7' }}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-stone-800">{title}</Text>
        <Text className="mt-0.5 text-xs leading-relaxed text-stone-600">
          {description}
        </Text>
      </View>
    </View>
  );
}

export interface VisualizationGuideProps {
  habitName?: string;
  onClose?: () => void;
}

export function VisualizationGuide({ habitName, onClose }: VisualizationGuideProps) {
  const [showAllTechniques, setShowAllTechniques] = useState(false);

  const displayedTechniques = showAllTechniques
    ? VISUALIZATION_TECHNIQUES
    : VISUALIZATION_TECHNIQUES.slice(0, 2);

  const handleShowMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAllTechniques(!showAllTechniques);
  };

  return (
    <View className="gap-5">
      {/* Header with Huberman branding */}
      <Animated.View
        className="overflow-hidden rounded-2xl p-5"
        entering={FadeInDown.delay(50).springify()}
        style={{ backgroundColor: '#6d28d9' }}
      >
        <View className="flex-row items-start gap-3">
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Eye color="#ffffff" size={24} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-white">
              Goal Visualization
            </Text>
            <Text className="mt-0.5 text-sm text-violet-100">
              Science-backed techniques from neuroscience research
            </Text>
          </View>
        </View>

        <View
          className="mt-4 flex-row items-center gap-2 rounded-xl p-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <Sparkles color="#fcd34d" size={16} />
          <Text style={{ color: 'rgba(255,255,255,0.9)' }} className="flex-1 text-xs leading-relaxed">
            <Text className="font-semibold">Based on Andrew Huberman's research: </Text>
            How you visualize goals dramatically affects whether you achieve them.
          </Text>
        </View>

        {habitName && (
          <View className="mt-3 flex-row items-center gap-2">
            <Target color="#ddd6fe" size={14} />
            <Text style={{ color: '#ddd6fe' }} className="text-xs">
              Apply these techniques to: <Text className="font-medium text-white">{habitName}</Text>
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Key Insight Box */}
      <Animated.View
        className="flex-row items-start gap-3 rounded-2xl border p-4"
        entering={FadeInDown.delay(100).springify()}
        style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
      >
        <View
          className="h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: '#fef3c7' }}
        >
          <Zap color="#d97706" size={20} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-amber-900">
            🧠 The Key Insight
          </Text>
          <Text className="mt-1 text-sm leading-relaxed text-amber-800">
            Visualizing <Text className="font-semibold">the process</Text> activates goal-pursuit 
            neural circuits. Visualizing <Text className="font-semibold">only the outcome</Text> can 
            actually <Text className="italic">reduce</Text> your motivation.
          </Text>
        </View>
      </Animated.View>

      {/* Visualization Techniques */}
      <View className="gap-3">
        <Text className="text-sm font-semibold uppercase tracking-widest text-stone-500">
          Techniques to Apply
        </Text>
        {displayedTechniques.map((technique, index) => (
          <VisualizationCard key={technique.id} technique={technique} />
        ))}

        {VISUALIZATION_TECHNIQUES.length > 2 && (
          <Pressable
            accessibilityLabel={showAllTechniques ? 'Show less techniques' : 'Show more techniques'}
            accessibilityRole="button"
            className="flex-row items-center justify-center gap-2 rounded-xl border py-3 active:opacity-70"
            style={{ backgroundColor: '#f5f3ff', borderColor: '#c4b5fd', borderStyle: 'dashed' }}
            onPress={handleShowMore}
          >
            <Text style={{ color: '#6d28d9' }} className="text-sm font-medium">
              {showAllTechniques ? 'Show Less' : `Show ${VISUALIZATION_TECHNIQUES.length - 2} More Techniques`}
            </Text>
            {showAllTechniques ? (
              <ChevronUp color="#7c3aed" size={16} />
            ) : (
              <ChevronDown color="#7c3aed" size={16} />
            )}
          </Pressable>
        )}
      </View>

      {/* Quick Practice Tips */}
      <Animated.View
        className="gap-3"
        entering={FadeInDown.delay(200).springify()}
      >
        <Text className="text-sm font-semibold uppercase tracking-widest text-stone-500">
          Quick Practice
        </Text>
        <View className="gap-2">
          <QuickTip
            description="Spend 30 seconds visualizing yourself doing the habit, not having done it"
            icon={<Eye color="#d97706" size={16} />}
            title="Morning Visualization"
          />
          <QuickTip
            description='Identify your biggest obstacle and create an "if-then" plan'
            icon={<Mountain color="#d97706" size={16} />}
            title="Obstacle Planning"
          />
          <QuickTip
            description="See yourself taking the first small step of your habit"
            icon={<ArrowRight color="#d97706" size={16} />}
            title="Next Action Preview"
          />
        </View>
      </Animated.View>

      {/* Scientific Citation */}
      <View
        className="items-center rounded-xl px-4 py-3"
        style={{ backgroundColor: '#f5f5f4' }}
      >
        <Text className="text-center text-xs text-stone-500">
          Based on research by Gabriele Oettingen (Mental Contrasting), 
          Peter Gollwitzer (Implementation Intentions), and 
          discussed in the Huberman Lab Podcast.
        </Text>
      </View>
    </View>
  );
}

export default VisualizationGuide;
