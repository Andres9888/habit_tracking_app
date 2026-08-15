import React from 'react';
import { Linking } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { LegalFooter } from '../LegalFooter';
import { EXTERNAL_URLS } from '@/constants/urls';

jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);

describe('LegalFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders Terms and Privacy links', () => {
      const { getByText } = render(<LegalFooter />);

      expect(getByText('Terms')).toBeTruthy();
      expect(getByText('Privacy')).toBeTruthy();
    });

    it('renders separator between links', () => {
      const { getByText } = render(<LegalFooter />);
      expect(getByText('·')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible Terms link with label and role', () => {
      const { getByLabelText } = render(<LegalFooter />);
      const termsLink = getByLabelText('Terms of Service');

      expect(termsLink).toBeTruthy();
      expect(termsLink.props.accessibilityRole).toBe('link');
    });

    it('has accessible Privacy link with label and role', () => {
      const { getByLabelText } = render(<LegalFooter />);
      const privacyLink = getByLabelText('Privacy Policy');

      expect(privacyLink).toBeTruthy();
      expect(privacyLink.props.accessibilityRole).toBe('link');
    });
  });

  describe('Navigation', () => {
    it('opens Terms URL when Terms link is pressed', () => {
      const { getByLabelText } = render(<LegalFooter />);

      fireEvent.press(getByLabelText('Terms of Service'));

      expect(Linking.openURL).toHaveBeenCalledWith(EXTERNAL_URLS.TERMS);
    });

    it('opens Privacy URL when Privacy link is pressed', () => {
      const { getByLabelText } = render(<LegalFooter />);

      fireEvent.press(getByLabelText('Privacy Policy'));

      expect(Linking.openURL).toHaveBeenCalledWith(EXTERNAL_URLS.PRIVACY);
    });
  });
});
