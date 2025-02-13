import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  blackColor,
  lightGrayColor,
  whiteBackgeoundColor,
} from '../assets/colors';
import CelebritieJson from '../assets/jsonFiles/celebrities.json';

interface Celebrity {
  id: number;
  first: string;
  last: string;
  dob: string;
  gender: string;
  email: string;
  picture: string;
  country: string;
  description: string;
}

const CelebrityList = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>(CelebritieJson);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');

  //Calulate age of celebrity if is an adult
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const renderItem = ({item}: {item: Celebrity}) => {
    const isExpanded = expandedId === item.id;
    const isEditing = editingId === item.id;
    const age = calculateAge(item.dob);
    const isAdult = age >= 18;
    return (
      <View style={styles.bodyContainer}>
        <TouchableOpacity
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
          activeOpacity={0.7}
          style={styles.headerContainer}>
          <View style={{flexDirection: 'row'}}>
            <Image source={{uri: item.picture}} style={styles.imageContainer} />
            <Text style={styles.headerText}>
              {item.first} {item.last}
            </Text>
          </View>
          <View>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={25}
              color="gray"
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={{marginTop: 15}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'column'}}>
                <Text>Age</Text>
                <Text>{calculateAge(item.dob)}</Text>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text>Gendere</Text>
                <Text>{item.gender}</Text>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text>Country</Text>
                <Text>{item.country}</Text>
              </View>
            </View>
            <View>
              <Text>Description</Text>
              <Text>{item.description}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar with Icon */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search user"
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="gray"
        />
      </View>
      <FlatList
        data={celebrities}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={{marginBottom: 20, marginTop: 20}}
        contentContainerStyle={{alignItems: 'center'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteBackgeoundColor,
    padding: 10,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: whiteBackgeoundColor,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: lightGrayColor,
  },
  icon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: blackColor,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  bodyContainer: {
    padding: 10,
    backgroundColor: whiteBackgeoundColor,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: lightGrayColor,
    width: '96%',
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: lightGrayColor,
  },
});

export default CelebrityList;
