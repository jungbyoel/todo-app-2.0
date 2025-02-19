import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme/colors';

interface CustomDatePickerProps {
  visible: boolean;
  onClose: () => void;
  onDateChange: (date: Date) => void;
  selectedDate: Date;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ visible, onClose, onDateChange, selectedDate }) => {
  const [tempDate, setTempDate] = React.useState(selectedDate);

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return date.toLocaleString('fr-FR', { month: 'long' });
  });
  const days = Array.from(
    { length: new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate() },
    (_, i) => i + 1
  );

  const handleSave = () => {
    onDateChange(tempDate);
    onClose();
  };

  const updateDate = (type: 'day' | 'month' | 'year', value: number) => {
    const newDate = new Date(tempDate);
    switch (type) {
      case 'day':
        newDate.setDate(value);
        break;
      case 'month':
        newDate.setMonth(value);
        break;
      case 'year':
        newDate.setFullYear(value);
        break;
    }
    setTempDate(newDate);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Sélectionner une date</Text>
          <View style={styles.datePickerContainer}>
            {/* Jours */}
            <View style={styles.columnContainer}>
              <Text style={styles.columnTitle}>Jour</Text>
              <ScrollView style={styles.scrollColumn} showsVerticalScrollIndicator={false}>
                {days.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dateOption,
                      tempDate.getDate() === day && styles.selectedOption
                    ]}
                    onPress={() => updateDate('day', day)}
                  >
                    <Text style={[
                      styles.dateText,
                      tempDate.getDate() === day && styles.selectedText
                    ]}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Mois */}
            <View style={styles.columnContainer}>
              <Text style={styles.columnTitle}>Mois</Text>
              <ScrollView style={styles.scrollColumn} showsVerticalScrollIndicator={false}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.dateOption,
                      tempDate.getMonth() === index && styles.selectedOption
                    ]}
                    onPress={() => updateDate('month', index)}
                  >
                    <Text style={[
                      styles.dateText,
                      tempDate.getMonth() === index && styles.selectedText
                    ]}>{month}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Années */}
            <View style={styles.columnContainer}>
              <Text style={styles.columnTitle}>Année</Text>
              <ScrollView style={styles.scrollColumn} showsVerticalScrollIndicator={false}>
                {years.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.dateOption,
                      tempDate.getFullYear() === year && styles.selectedOption
                    ]}
                    onPress={() => updateDate('year', year)}
                  >
                    <Text style={[
                      styles.dateText,
                      tempDate.getFullYear() === year && styles.selectedText
                    ]}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelText]}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  content: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  columnContainer: {
    flex: 1,
  },
  columnTitle: {
    color: theme.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  scrollColumn: {
    height: 200,
  },
  dateOption: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: theme.primary,
  },
  dateText: {
    color: theme.textPrimary,
    fontSize: 16,
  },
  selectedText: {
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
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
  cancelText: {
    color: theme.error,
  },
});

export default CustomDatePicker;
