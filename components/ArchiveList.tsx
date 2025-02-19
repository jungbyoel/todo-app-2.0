import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../theme/colors';

interface ArchiveListProps {
  tasks: { id: string; text: string; description: string; importance: string; deadline: Date | string; archived: boolean }[];
  onRemoveTask: (taskId: string) => void;
  onUnarchiveTask: (taskId: string) => void;
}

const ArchiveList: React.FC<ArchiveListProps> = ({ tasks, onRemoveTask, onUnarchiveTask }) => {
  const getDateColor = (deadline: Date | string) => {
    const date = new Date(deadline);
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = date.getTime() - now.getTime();
    
    if (diffTime < 0) { // Date passée
      return theme.error;
    } else if (diffTime <= oneDay) { // Jour J ou J-1
      return theme.warning;
    } else { // J+2 ou plus
      return theme.success;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'High':
        return theme.error;
      case 'Medium':
        return theme.warning;
      default:
        return theme.success;
    }
  };

  const handleUnarchive = (taskId: string) => {
    onUnarchiveTask(taskId);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <View style={styles.taskHeader}>
              <View style={[
                styles.importanceBadge,
                { backgroundColor: getImportanceColor(item.importance) }
              ]}>
                <Text style={styles.importanceText}>{item.importance}</Text>
              </View>
              <Text style={styles.archivedDate}>Archivée le {new Date().toLocaleDateString('fr-FR')}</Text>
            </View>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{item.text}</Text>
              {item.description ? (
                <Text style={styles.descriptionText}>{item.description}</Text>
              ) : null}
            </View>
            <View style={styles.taskFooter}>
              <Text style={[styles.dateText, { color: getDateColor(item.deadline) }]}>
                Échéance : {new Date(item.deadline).toLocaleDateString('fr-FR')}
              </Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={styles.unarchiveButton} 
                  onPress={() => handleUnarchive(item.id)}
                >
                  <Text style={styles.unarchiveText}>Restaurer</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => onRemoveTask(item.id)}
                >
                  <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  taskContainer: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  archivedDate: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  taskContent: {
    padding: 16,
    gap: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
    opacity: 0.9,
  },
  importanceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  importanceText: {
    color: theme.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    color: theme.textSecondary,
    opacity: 0.8,
    lineHeight: 20,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  unarchiveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.primary,
    borderRadius: 8,
  },
  unarchiveText: {
    color: theme.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  removeButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(240, 71, 71, 0.15)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: theme.error,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ArchiveList;
