import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Função para mostrar as tarefas salvas ao abrir o app
  useEffect(() => {
    async function loadTasks() {
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    }
    loadTasks();
  }, []);

  // Variável para salvar as tarefas no AsyncStorage
  const saveTasks = async (newTasks) => {
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  // Variável que adicona uma nova tarefa
  const addTask = () => {
    if (task.trim() === "") {
      Alert.alert("Erro", "Digite uma tarefa antes de adicionar!");
      return;
    }
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    saveTasks(newTasks);
    setTask("");
  };

  // Variável para remover as tarefs --- arrumar depois
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

  // Variável para remover uma tarefa específica
  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    saveTasks(newTasks);
  };
}
