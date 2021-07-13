import {
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createStackNavigator
} from 'react-navigation';
import Main from "./screens/Main";
import CreateDocument from "./screens/CreateDocument";
import ImportDocument from "./screens/ImportDocument";
import TextScanner from "./screens/TextScanner";
import Usage from "./screens/Usage";
import RateUs from "./screens/RateUs";
import AboutUs from "./screens/AboutUs";
import Library from "./screens/Library";


const AppDrawerNavigator = createDrawerNavigator({
  Main: {
    screen: Main,
    navigationOptions: ({ navigation }) => {
      return {
        header: null
      };
    },
  },
  textScanner: {
    screen: TextScanner,
    navigationOptions: ({ navigation }) => {
      return {
        header: null
      };
    },
  },
  createDocument: {
    screen: CreateDocument,
    navigationOptions: ({ navigation }) => {
      return {
        header: null
      };
    },
  },
  ImportDocument: {
    screen: ImportDocument,
    navigationOptions: ({ navigation }) => {
      return {
        header: null
      };
    },
  },
  Usage: {
    screen: Usage,
    navigationOptions: ({ navigation }) => {
      return {
        header: null
      };
    },
  },
  RateUs: {
    screen: RateUs,
    navigationOptions: ({ navigation }) => {
      return {
        header: null
      };
    },
  },
  AboutUs: {
    screen: AboutUs,
    navigationOptions: ({ navigation }) => {
      return {
        header: null
      };
    },
  },
  Library: {
    screen: Library,
    navigationOptions: ({ navigation }) => {
      return {
        header: null
      };
    },
  },
})

const AppSwitchNavigator = createSwitchNavigator({
  Dashboard: { screen: AppDrawerNavigator }

});

const AppContainer = createAppContainer(AppSwitchNavigator);
export default AppContainer;
