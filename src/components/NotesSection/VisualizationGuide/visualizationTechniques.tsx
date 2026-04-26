/**
 * Visualization techniques data based on Andrew Huberman's research
 */

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '@/theme/colors';
import type { VisualizationTechnique } from './VisualizationGuide.types';

const errorColor = colors.error;

export const VISUALIZATION_TECHNIQUES: VisualizationTechnique[] = [
  {
    bad: {
      description:
        'Fantasizing only about the end goal (e.g., seeing yourself fit and successful)',
      example:
        '"I imagine myself having already achieved my goal, feeling amazing and confident."',
      icon: <XCircle color={errorColor} size={iconSizes.medium} />,
      title: 'Outcome-Only Fantasy',
      why: 'Reduces dopamine drive and tricks brain into feeling satisfied before taking action',
    },
    good: {
      description: 'Visualize the specific steps and actions you need to take',
      example:
        '"I see myself putting on my running shoes, stepping outside, and taking the first steps."',
      icon: <CheckCircle2 color='#059669' size={iconSizes.medium} />,
      title: 'Process Visualization',
      why: 'Activates motor planning regions and creates neural pathways for action',
    },
    id: 'process',
  },
  {
    bad: {
      description:
        'Ignoring potential obstacles and assuming everything will go smoothly',
      example: '"I just stay positive and trust that it will all work out."',
      icon: <XCircle color={errorColor} size={iconSizes.medium} />,
      title: 'Blind Optimism',
      why: 'Leaves you unprepared and more likely to quit when challenges arise',
    },
    good: {
      description: 'Anticipate obstacles and mentally rehearse overcoming them',
      example:
        '"When I feel tired after work, I will put on my workout clothes immediately before sitting down."',
      icon: <CheckCircle2 color='#059669' size={iconSizes.medium} />,
      title: 'Obstacle Anticipation',
      why: 'Prepares your brain with pre-planned responses (implementation intentions)',
    },
    id: 'obstacles',
  },
  {
    bad: {
      description:
        'Dwelling on past failures or current struggles without direction',
      example: '"I keep thinking about all the times I\'ve failed before."',
      icon: <XCircle color={errorColor} size={iconSizes.medium} />,
      title: 'Ruminating on Failure',
      why: 'Creates learned helplessness and strengthens negative neural patterns',
    },
    good: {
      description:
        'Compare current state with desired state to create productive tension',
      example:
        '"Right now I skip workouts, but I want to be someone who never misses. What\'s different?"',
      icon: <CheckCircle2 color='#059669' size={iconSizes.medium} />,
      title: 'Mental Contrasting',
      why: 'Creates motivational gap that drives action without demotivating',
    },
    id: 'contrast',
  },
  {
    bad: {
      description: 'Focusing only on distant, abstract goals',
      example: '"Someday I\'ll be healthy and have great habits."',
      icon: <XCircle color={errorColor} size={iconSizes.medium} />,
      title: 'Vague Future Focus',
      why: 'Too abstract for brain to create actionable plans',
    },
    good: {
      description: 'Focus on the very next action you need to take',
      example:
        '"Tomorrow at 7am, I will drink a glass of water before checking my phone."',
      icon: <CheckCircle2 color='#059669' size={iconSizes.medium} />,
      title: 'Next Action Focus',
      why: 'Concrete, specific actions activate prefrontal cortex planning',
    },
    id: 'next-action',
  },
];
