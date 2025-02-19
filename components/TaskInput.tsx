import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Animated, LayoutAnimation, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../theme/colors';
import CustomDatePicker from './CustomDatePicker';

interface TaskInputProps {
  onAddTask: (task: string, description: string, importance: string, deadline: Date) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState('Low');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleAddTask = () => {
    if (task.trim()) {
      onAddTask(task, description, importance, deadline);
      setTask('');
      setDescription('');
      setImportance('Low');
      setDeadline(new Date());
      setIsExpanded(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const getImportanceData = (level: string) => {
    switch (level) {
      case 'Haute':
        return { color: theme.error, text: 'Haute' };
      case 'Moyenne':
        return { color: theme.warning, text: 'Moyenne' };
      default:
        return { color: theme.success, text: 'Faible' };
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const ImportanceButton = ({ level }: { level: string }) => {
    const { color, text } = getImportanceData(level);
    return (
      <TouchableOpacity
        style={[
          styles.importanceButton,
          importance === level && styles.importanceButtonActive,
          { backgroundColor: color }
        ]}
        onPress={() => setImportance(level)}
      >
        <Text style={styles.importanceButtonText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.mainInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ajouter une nouvelle tâche"
            placeholderTextColor={theme.textSecondary}
            value={task}
            onChangeText={setTask}
            onFocus={() => !isExpanded && toggleExpand()}
          />
          <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
            <Text style={styles.expandButtonText}>
              {isExpanded ? '−' : '+'}
            </Text>
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Ajouter une description"
              placeholderTextColor={theme.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={styles.optionsContainer}>
              <View style={styles.importanceContainer}>
                <Text style={styles.sectionTitle}>Priorité :</Text>
                <View style={styles.importanceButtons}>
                  <ImportanceButton level="Faible" />
                  <ImportanceButton level="Moyenne" />
                  <ImportanceButton level="Haute" />
                </View>
              </View>

              <View style={styles.dateContainer}>
                <Text style={styles.sectionTitle}>Échéance :</Text>
                <TouchableOpacity 
                  style={styles.dateButton} 
                  onPress={() => setShowDatePicker(true)}
                >
                  <View style={styles.dateContent}>
                    <Text style={styles.dateLabel}>Date sélectionnée :</Text>
                    <Text style={styles.dateText}>{formatDate(deadline)}</Text>
                    <Text style={styles.dateHint}>Appuyez pour modifier</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.addButton} 
                onPress={handleAddTask}
              >
                <Text style={styles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>

            <CustomDatePicker 
              visible={showDatePicker}
              selectedDate={deadline}
              onClose={() => setShowDatePicker(false)}
              onDateChange={(date) => {
                setDeadline(date);
                setShowDatePicker(false);
              }}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  mainInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
    color: theme.textPrimary,
    fontFamily: 'System',
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandButtonText: {
    color: theme.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    gap: 16,
  },
  descriptionInput: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: theme.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    gap: 16,
  },
  importanceContainer: {
    gap: 8,
  },
  sectionTitle: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  importanceButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  importanceButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    opacity: 0.7,
  },
  importanceButtonActive: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  importanceButtonText: {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  dateContainer: {
    gap: 8,
    marginVertical: 16,
  },
  dateButton: {
    backgroundColor: theme.cardBackgroundHover,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.primary,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateContent: {
    alignItems: 'center',
    gap: 4,
  },
  dateLabel: {
    color: theme.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 4,
  },
  dateHint: {
    color: theme.primary,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  addButton: {
    backgroundColor: theme.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default TaskInput;
