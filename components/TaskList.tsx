import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Switch } from 'react-native';
import { theme } from '../theme/colors';
import EditTaskModal from './EditTaskModal';

interface TaskListProps {
  tasks: { id: string; text: string; description: string; importance: string; deadline: Date | string; archived: boolean }[];
  onRemoveTask: (taskId: string) => void;
  onEditTask: (taskId: string, newTask: string, newDescription: string, newImportance: string, newDeadline: Date) => void;
  onArchiveTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onRemoveTask, onEditTask, onArchiveTask }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ text: string; description: string; importance: string; deadline: Date; index: string } | null>(null);

  const handleEdit = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask({ ...task, deadline: new Date(task.deadline), index: taskId });
      setModalVisible(true);
    }
  };

  const handleSave = (newTask: string, newDescription: string, newImportance: string, newDeadline: Date) => {
    if (selectedTask) {
      onEditTask(selectedTask.index, newTask, newDescription, newImportance, newDeadline);
      setSelectedTask(null);
    }
  };

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

  const getTaskStyle = (deadline: Date) => {
    return {}; // On ne met plus de style sur le texte de la tâche
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

  const EmptyListMessage = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Aucune tâche</Text>
      <Text style={styles.emptySubtitle}>Ajoutez votre première tâche ci-dessus</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        ListEmptyComponent={EmptyListMessage}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <View style={styles.taskLeftSection}>
              <Switch
                value={item.archived}
                onValueChange={() => onArchiveTask(item.id)}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: theme.primary }}
                thumbColor={item.archived ? theme.primaryLight : '#f4f3f4'}
              />
            </View>
            <View style={styles.taskContent}>
              <View style={styles.taskHeader}>
                <Text style={[styles.taskTitle, item.archived && styles.archivedTask]}>
                  {item.text}
                </Text>
                <View style={[
                  styles.importanceBadge,
                  { backgroundColor: getImportanceColor(item.importance) }
                ]}>
                  <Text style={styles.importanceText}>{item.importance}</Text>
                </View>
              </View>
              {item.description ? (
                <Text style={styles.descriptionText} numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
              <View style={styles.taskFooter}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateLabel}>Échéance :</Text>
                  <Text style={[styles.dateText, { color: getDateColor(item.deadline) }]}>
                    {new Date(item.deadline).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </Text>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity 
                    style={styles.editButton} 
                    onPress={() => handleEdit(item.id)}
                  >
                    <Text style={styles.editText}>Modifier</Text>
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
          </View>
        )}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          tasks.length === 0 && styles.emptyListContent
        ]}
      />
      {selectedTask && (
        <EditTaskModal
          visible={modalVisible}
          task={selectedTask.text}
          description={selectedTask.description}
          importance={selectedTask.importance}
          deadline={selectedTask.deadline}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 8,
    paddingBottom: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.divider,
    overflow: 'hidden',
  },
  taskLeftSection: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: theme.divider,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  taskContent: {
    flex: 1,
    padding: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    letterSpacing: 0.3,
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
    marginBottom: 12,
    lineHeight: 20,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.divider,
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 16,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.primary,
    borderRadius: 8,
  },
  editText: {
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
  archivedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
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
  emptyListContent: {
    flex: 1,
  },
});

export default TaskList;
