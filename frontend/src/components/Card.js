// frontend/src/components/Card.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

export const Card = ({ 
  children, 
  style,
  onPress,
  elevation = true
}) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component 
      style={[
        styles.card,
        elevation && styles.elevated,
        style
      ]}
      onPress={onPress}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }
});
