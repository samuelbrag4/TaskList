import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // Carrega as tarefas salvas ao abrir o app
  useEffect(() => {
    async function loadTasks() {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    }
    loadTasks();
  }, []);

  // Salva as tarefas no AsyncStorage
  const saveTasks = async (newTasks) => {
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  // Adiciona uma nova tarefa
  const addTask = () => {
    if (task.trim() === '') {
      Alert.alert('Erro', 'Digite uma tarefa antes de adicionar!');
      return;
    }
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    saveTasks(newTasks);
    setTask('');
  };

  // Remove uma tarefa específica
  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Limpa todas as tarefas
  const clearAllTasks = () => {
    Alert.alert('Confirmação', 'Deseja realmente apagar todas as tarefas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        onPress: async () => {
          setTasks([]);
          await AsyncStorage.removeItem('tasks');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite uma nova tarefa"
        value={task}
        onChangeText={setTask}
      />
      <Button title="Adicionar Tarefa" onPress={addTask} />
      {tasks.length === 0 ? (
        <Text style={styles.noTasks}>Nenhuma tarefa adicionada.</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>{item}</Text>
              <TouchableOpacity onPress={() => removeTask(index)}>
                <Text style={styles.deleteButton}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <Button title="Limpar Tudo" color="red" onPress={clearAllTasks} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  noTasks: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskText: {
    fontSize: 16,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});