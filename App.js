import React, { createContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PaperProvider } from "react-native-paper";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import Jobs from "./screens/Jobs";
import MyJobs from "./screens/MyJobs";
import Profile from "./screens/Profile";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CreateJob from "./screens/CreateJob";

export const AppContext = createContext();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [token, setToken] = useState(null);

  const HomeTabs = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name={isRecruiter ? "MyPostings" : "MyJobs"}
          component={MyJobs}
          options={{
            tabBarIcon: () => <Icon name="clipboard-check-outline" size={25} />,
          }}
        />
        {isRecruiter ? (
          <Tab.Screen
            name="CreateJob"
            component={CreateJob}
            options={{
              tabBarIcon: () => <Icon name="plus-circle" size={25} />,
            }}
          />
        ) : (
          <Tab.Screen
            name="Jobs"
            component={Jobs}
            options={{
              tabBarIcon: () => <Icon name="briefcase" size={25} />,
            }}
          />
        )}
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: () => <Icon name="account-circle" size={25} />,
          }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        userData,
        setUserData,
        isRecruiter,
        setIsRecruiter,
        token,
        setToken,
      }}
    >
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignUp">
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Dashboard" component={HomeTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AppContext.Provider>
  );
};

Login.navigationOptions = {
  headerLeft: null,
};

export default App;
