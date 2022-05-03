import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
const STORAGE_KEY = "@todos";

export default function App() {
  const [category, setCategory] = useState("work");
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState({});

  const travel = () => setCategory("travel");
  const work = () => setCategory("work");
  const onChangeText = (payload) => setTodo(payload);
  const saveTodos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  }
  const loadTodos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (s === null)
        setTodo({});
      else
        setTodos(JSON.parse(s));
    } catch (e) {
      console.log(e);
    }
  }
  const addTodo = async () => {
    if (todo === "") {
      return
    }
    // const newTodos = Object.assign(
    //   {},
    //   todos,
    //   { [Date.now()]: { todo, category: category } }
    // );

    //ES6 방식
    const newTodos = {
      ...todos,
      [Date.now()]: { todo, category },
    }
    setTodos(newTodos);
    await saveTodos(newTodos);
    setTodo("");
  };
  const deleteTodo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      {
        text: "Ok", onPress: () => {
          try {
            const newTodos = { ...todos };
            delete newTodos[key];
            setTodos(newTodos);
            saveTodos(newTodos);
          } catch (e) {
            console.log(e);
          }
        }
      },
      { text: "Cancel", style: "cancel" },
    ]);
    return;

  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View style={styles.container}>

      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable
          onPress={work}
        >
          <Text style={{
            ...styles.btnText,
            color: category === "work" ? theme.text : theme.gray
          }}>
            Work
          </Text>
        </Pressable>
        <Pressable
          onPress={travel}
        >
          <Text style={{
            ...styles.btnText,
            color: category === "travel" ? theme.text : theme.gray
          }}>
            Travel
          </Text>
        </Pressable>
      </View>
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={addTodo}
        returnKeyType="done"
        value={todo}
        placeholder="Add a TODO" style={styles.input}
      />
      <ScrollView>
        {
          Object.keys(todos).map(key =>
            todos[key].category === category ? (
              <View key={key} style={styles.todo}>
                <Text style={styles.todoText}>{todos[key].todo}</Text>
                <Pressable
                  hitSlop={10}
                  onPress={() => deleteTodo(key)}>
                  <Text><Fontisto name="trash" size={24} color="gray" /></Text>
                </Pressable>
              </View>
            ) : null
          )
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-around",
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
  todo: {
    backgroundColor: theme.todoBackground,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    opacity: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todoText: {
    color: theme.text,
    fontSize: 18,
    fontWeight: "500",
    opacity: 1
  }
});
