// frontend/src/components/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const PrimaryButton = ({ 
  onPress, 
  label, 
  disabled = false,
  loading = false,
  style 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.primary,
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={styles.primaryText}>
        {loading ? '처리 중...' : label}
      </Text>
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({ 
  onPress, 
  label, 
  disabled = false,
  style 
}) => {
  return (
    <TouchableOpacity
      style={[styles.secondary, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.secondaryText}>{label}</Text>
    </TouchableOpacity>
  );
};

export const DangerButton = ({ 
  onPress, 
  label, 
  disabled = false,
  style 
}) => {
  return (
    <TouchableOpacity
      style={[styles.danger, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.dangerText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    alignItems: 'center'
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  secondary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center'
  },
  secondaryText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600'
  },
  danger: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center'
  },
  dangerText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600'
  },
  disabled: {
    opacity: 0.5
  }
});
