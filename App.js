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
    Alert.alert("Confirmação", "Deseja realmente apagar todas as tarefas?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        onPress: async () => {
          setTasks([]);
          await AsyncStorage.removeItem("tasks");
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

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.title}>LISTA DE TAREFAS</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite uma nova tarefa"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>Adicionar Tarefa</Text>
        </TouchableOpacity>{" "}
        {tasks.length === 0 ? (
          <Text style={styles.noTasks}>Nenhuma tarefa adicionada.</Text>
        ) : (
          <FlatList
          style={styles.list}
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
        <TouchableOpacity style={styles.button} onPress={clearAllTasks}>
          <Text style={styles.buttonText}>Remover Todas as Tasks</Text>
        </TouchableOpacity>{" "}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#ED4A2B",
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#2E2E2E",
    width: "90%",
    height: "95%",
    borderRadius: 50,
    padding: 20,
    boxShadow: "0 16px 64px rgba(0, 0, 0, 0.32)",
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFFFFF",
    textAlign: "center",
  },
  input: {
    borderColor: "#ED4A2B",
    borderWidth: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    width: "90%",
    height: 50,
  },
  button: {
    backgroundColor: "#ED4A2B",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    width: "90%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  noTasks: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  list: {
    backgroundColor: "#ED4A2B",
    width: "90%",
    borderRadius: 25,
    padding: 20,
    margin: 10,
  },
  taskItem: {
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#2E2E2E",
    borderWidth: 4,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
  },
});
