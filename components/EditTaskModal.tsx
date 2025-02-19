import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, StyleSheet, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../theme/colors';
import CustomDatePicker from './CustomDatePicker';

interface EditTaskModalProps {
  visible: boolean;
  task: string;
  description: string;
  importance: string;
  deadline: Date;
  onClose: () => void;
  onSave: (newTask: string, newDescription: string, newImportance: string, newDeadline: Date) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ visible, task, description, importance, deadline, onClose, onSave }) => {
  const [newTask, setNewTask] = useState(task);
  const [newDescription, setNewDescription] = useState(description);
  const [newImportance, setNewImportance] = useState(importance);
  const [newDeadline, setNewDeadline] = useState(deadline);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
          newImportance === level && styles.importanceButtonActive,
          { backgroundColor: color }
        ]}
        onPress={() => setNewImportance(level)}
      >
        <Text style={styles.importanceButtonText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const handleSave = () => {
    onSave(newTask, newDescription, newImportance, newDeadline);
    onClose();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier la tâche</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tâche</Text>
              <TextInput
                style={styles.input}
                value={newTask}
                onChangeText={setNewTask}
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={newDescription}
                onChangeText={setNewDescription}
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priorité</Text>
              <View style={styles.importanceButtons}>
                <ImportanceButton level="Faible" />
                <ImportanceButton level="Moyenne" />
                <ImportanceButton level="Haute" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Échéance</Text>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.dateContent}>
                  <Text style={styles.dateLabel}>Date sélectionnée :</Text>
                  <Text style={styles.dateText}>{formatDate(newDeadline)}</Text>
                  <Text style={styles.dateHint}>Appuyez pour modifier</Text>
                </View>
              </TouchableOpacity>
            </View>

            <CustomDatePicker 
              visible={showDatePicker}
              selectedDate={newDeadline}
              onClose={() => setShowDatePicker(false)}
              onDateChange={(date) => {
                setNewDeadline(date);
                setShowDatePicker(false);
              }}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    width: '85%', // Réduit de 90% à 85% pour plus d'espace sur les côtés
    maxWidth: 400,
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 28, // Augmenté de 24 à 28
    gap: 24, // Augmenté de 20 à 24
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 4,
  },
  input: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: theme.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  importanceButtons: {
    flexDirection: 'row',
    gap: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  saveButton: {
    backgroundColor: theme.primary,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.error,
  },
  cancelButtonText: {
    color: theme.error,
  },
});

export default EditTaskModal;
