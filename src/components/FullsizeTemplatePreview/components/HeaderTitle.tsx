/**
 * Centered modal-header title — a "Habit science" kicker over the template name.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { modalHeaderStyles as s } from '../styles/modalHeader.styles';

export function HeaderTitle({ name }: { name: string }) {
  return (
    <View style={s.titleWrap}>
      <Text style={s.kicker}>Habit science</Text>
      <Text numberOfLines={1} style={s.name}>
        {name}
      </Text>
    </View>
  );
}
