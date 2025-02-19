import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import ArchiveList from './components/ArchiveList';
import BottomNavBar from './components/BottomNavBar';
import { theme } from './theme/colors';

export default function App() {
  const [tasks, setTasks] = useState<{ 
    id: string;
    text: string; 
    description: string; 
    importance: string; 
    deadline: Date; 
    archived: boolean 
  }[]>([]);
  const [showArchives, setShowArchives] = useState(false);

  const removeTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const editTask = (taskId: string, newTask: string, newDescription: string, newImportance: string, newDeadline: Date) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId 
        ? { ...task, text: newTask, description: newDescription, importance: newImportance, deadline: newDeadline }
        : task
    ));
  };

  const archiveTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        // Force l'état archived à son opposé et assure qu'il est bien un booléen
        const newArchivedState = !task.archived;
        return {
          ...task,
          archived: newArchivedState
        };
      }
      return task;
    }));
  };

  const addTask = (task: string, description: string, importance: string, deadline: Date) => {
    const newTask = {
      id: Date.now().toString(),
      text: task,
      description,
      importance,
      deadline,
      archived: false
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const archivedTasks = tasks.filter(task => task.archived);
  const activeTasks = tasks.filter(task => !task.archived);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          {showArchives ? 'Tâches archivées' : 'Mes tâches'}
        </Text>
        <View style={styles.content}>
          {showArchives ? (
            <ArchiveList 
              tasks={archivedTasks}
              onRemoveTask={removeTask} 
              onUnarchiveTask={archiveTask}
            />
          ) : (
            <View style={styles.activeContent}>
              <TaskInput onAddTask={addTask} />
              <TaskList 
                tasks={activeTasks}
                onRemoveTask={removeTask}
                onEditTask={editTask}
                onArchiveTask={archiveTask}
              />
            </View>
          )}
        </View>
        <BottomNavBar
          currentPage={showArchives ? 'archives' : 'tasks'}
          onPageChange={(page) => setShowArchives(page === 'archives')}
        />
        <StatusBar style="light" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: theme.textPrimary,
    marginTop: 60,
    marginBottom: 30,
    paddingHorizontal: 30,
    letterSpacing: 0.5,
    // Amélioré le text shadow
    textShadowColor: 'rgba(114, 137, 218, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    fontFamily: 'System',
  },
  activeContent: {
    flex: 1,
    width: '100%',
    gap: 20,
  },
});
