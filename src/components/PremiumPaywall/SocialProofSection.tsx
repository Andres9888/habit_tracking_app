/**
 * Social proof section shared across paywall variants
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, Quote } from 'lucide-react-native';

const TESTIMONIALS = [
  {
    text: '"The voice notes feature saved my streak during a rough week. Game changer."',
    author: 'Sarah K.',
    streak: '127-day streak',
  },
  {
    text: '"I\'ve tried 6 habit apps. This is the only one that made habits stick."',
    author: 'Marcus T.',
    streak: '89-day streak',
  },
];

export function SocialProofSection({ dark = false }: { dark?: boolean }) {
  const textColor = dark ? 'rgba(255,255,255,0.7)' : '#57534e';
  const subtleColor = dark ? 'rgba(255,255,255,0.4)' : '#a8a29e';
  const cardBg = dark ? 'rgba(255,255,255,0.08)' : '#f5f5f4';

  return (
    <View style={proofStyles.container}>
      {/* Star rating */}
      <View style={proofStyles.starsContainer}>
        <View style={proofStyles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} color='#fbbf24' fill='#fbbf24' size={16} />
          ))}
        </View>
        <Text style={[proofStyles.ratingText, { color: textColor }]}>
          4.8 average • 10,000+ happy users
        </Text>
      </View>

      {/* Testimonials */}
      {TESTIMONIALS.map((t, i) => (
        <View key={i} style={[proofStyles.testimonialCard, { backgroundColor: cardBg }]}>
          <Quote color={subtleColor} size={14} />
          <Text style={[proofStyles.testimonialText, { color: textColor }]}>{t.text}</Text>
          <View style={proofStyles.testimonialFooter}>
            <Text style={[proofStyles.testimonialAuthor, { color: textColor }]}>{t.author}</Text>
            <Text style={[proofStyles.testimonialStreak, { color: '#059669' }]}>🔥 {t.streak}</Text>
          </View>
        </View>
      ))}

      {/* Urgency nudge */}
      <View style={[proofStyles.urgencyBadge, { backgroundColor: dark ? 'rgba(5,150,105,0.15)' : '#ecfdf5' }]}>
        <Text style={proofStyles.urgencyText}>⚡ 2,400+ people started a free trial this week</Text>
      </View>
    </View>
  );
}

const proofStyles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 16,
  },
  starsContainer: {
    alignItems: 'center',
    gap: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  testimonialCard: {
    borderRadius: 12,
    gap: 8,
    padding: 16,
  },
  testimonialText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  testimonialFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  testimonialAuthor: {
    fontSize: 13,
    fontWeight: '600',
  },
  testimonialStreak: {
    fontSize: 12,
    fontWeight: '600',
  },
  urgencyBadge: {
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  urgencyText: {
    color: '#047857',
    fontSize: 13,
    fontWeight: '600',
  },
});
