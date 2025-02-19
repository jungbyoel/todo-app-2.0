import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/colors';

interface BottomNavBarProps {
  currentPage: 'tasks' | 'archives';
  onPageChange: (page: 'tasks' | 'archives') => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, onPageChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, currentPage === 'tasks' && styles.activeTab]}
        onPress={() => onPageChange('tasks')}
      >
        <Text style={[styles.tabText, currentPage === 'tasks' && styles.activeTabText]}>
          Tâches
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, currentPage === 'archives' && styles.activeTab]}
        onPress={() => onPageChange('archives')}
      >
        <Text style={[styles.tabText, currentPage === 'archives' && styles.activeTabText]}>
          Archives
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: theme.primary,
  },
  tabText: {
    color: theme.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: theme.textPrimary,
  },
});

export default BottomNavBar;
