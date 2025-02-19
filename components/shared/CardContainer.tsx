import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { theme } from '../../theme/colors';

interface CardContainerProps extends ViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const CardContainer: React.FC<CardContainerProps> = ({ children, style, noPadding, ...props }) => (
  <View style={[styles.container, !noPadding && styles.padding, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.divider,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  padding: {
    padding: 16,
  },
});

export default CardContainer;
