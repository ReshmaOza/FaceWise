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
  darkBlueColor,
  darkGrayColor,
  darkGreenColor,
  darkRedColor,
  lightGrayColor,
  whiteBackgeoundColor,
} from '../assets/colors';
import CelebritieJson from '../assets/jsonFiles/celebrities.json';
import DeleteComponent from '../componants/deleteComponet';
import ValidationAlert from '../componants/ValidationAlert';
import Icon from '../components/Icon';
import {GENDER_OPTIONS, SPACING} from '../constants/styles';
import {calculateAge} from '../utils/helper';

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
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [editableData, setEditableData] = useState<{
    [key: number]: Partial<Celebrity>;
  }>({});
  const [validationVisible, setValidationVisible] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const handleEditChange = (
    id: number,
    field: keyof Celebrity,
    value: string,
  ) => {
    setEditableData(prev => {
      // Find the original celebrity data
      const originalItem = celebrities.find(c => c.id === id);
      if (!originalItem) return prev;

      return {
        ...prev,
        [id]: {
          ...originalItem, // Use originalItem instead of item
          ...prev[id],
          [field]: value,
        },
      };
    });
  };

  const validateField = (field: keyof Celebrity, value: string | undefined) => {
    if (!value?.trim()) return false;

    switch (field) {
      case 'first':
      case 'last':
        return value.trim().length >= 2;
      case 'country':
        return /^[a-zA-Z\s]*$/.test(value);
      case 'gender':
        return GENDER_OPTIONS.map(opt => opt.toLowerCase()).includes(
          value.toLowerCase(),
        );
      case 'dob':
        const date = new Date(value);
        const today = new Date();
        return !isNaN(date.getTime()) && date <= today;
      case 'description':
        return value.trim().length >= 10;
      default:
        return true;
    }
  };

  const saveEdit = (id: number) => {
    const newData = editableData[id];
    if (!newData) return;

    const changedFields = Object.keys(newData).filter(key => {
      const field = key as keyof Celebrity;
      return newData[field] !== celebrities.find(c => c.id === id)?.[field];
    });

    const invalid = changedFields.filter(
      field =>
        !validateField(
          field as keyof Celebrity,
          newData[field as keyof Celebrity],
        ),
    );

    if (invalid.length > 0) {
      setInvalidFields(invalid);
      setValidationVisible(true);
      return;
    }

    setCelebrities(prevData =>
      prevData.map(item => (item.id === id ? {...item, ...newData} : item)),
    );
    setEditingId(null);
  };

  const openDeleteModal = (celebrity: Celebrity) => {
    setSelectedCelebrity(celebrity);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedCelebrity) {
      setCelebrities(prev => prev.filter(c => c.id !== selectedCelebrity.id));
    }
    setModalVisible(false);
  };

  const renderItem = ({item}: {item: Celebrity}) => {
    const isExpanded = expandedId === item.id;
    const isEditing = editingId === item.id;
    const age = calculateAge(item.dob);
    const isAdult = age >= 18;
    const editData = editableData[item.id] || {...item};

    const isChanged = Object.keys(editData).some(key => {
      const field = key as keyof Celebrity;
      return editData[field] !== item[field];
    });

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
          <View style={{marginTop: 15, width: '100%'}}>
            <View style={styles.infoRow}>
              <View style={styles.infoColumn}>
                <Text style={styles.label}>Age</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editData.dob}
                    placeholder="YYYY-MM-DD"
                    onChangeText={text => {
                      handleEditChange(item.id, 'dob', text);
                    }}
                    keyboardType="numbers-and-punctuation"
                  />
                ) : (
                  <Text style={styles.value}>{age}</Text>
                )}
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.label}>Gender</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editData.gender}
                    onChangeText={text =>
                      handleEditChange(item.id, 'gender', text)
                    }
                  />
                ) : (
                  <Text style={styles.value}>{item.gender}</Text>
                )}
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.label}>Country</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editData.country}
                    onChangeText={text =>
                      handleEditChange(item.id, 'country', text)
                    }
                  />
                ) : (
                  <Text style={styles.value}>{item.country}</Text>
                )}
              </View>
            </View>

            <View style={styles.description}>
              <Text style={styles.label}>Description</Text>
              {isEditing ? (
                <TextInput
                  style={styles.descriptionInput}
                  value={editData.description}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  onChangeText={text =>
                    handleEditChange(item.id, 'description', text)
                  }
                />
              ) : (
                <Text style={styles.value}>{item.description}</Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              {!isEditing && (
                <TouchableOpacity onPress={() => openDeleteModal(item)}>
                  <Icon
                    type="AntDesign"
                    name="delete"
                    size={20}
                    color={darkRedColor}
                  />
                </TouchableOpacity>
              )}

              {isEditing ? (
                <>
                  <TouchableOpacity
                    disabled={!isChanged}
                    onPress={() => saveEdit(item.id)}>
                    <Icon
                      type="AntDesign"
                      name="checkcircleo"
                      size={20}
                      color={isChanged ? darkBlueColor : 'gray'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingId(null)}>
                    <Icon
                      type="AntDesign"
                      name="closecircleo"
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                </>
              ) : (
                isAdult && (
                  <TouchableOpacity onPress={() => setEditingId(item.id)}>
                    <Icon
                      type="AntDesign"
                      name="edit"
                      size={20}
                      color={darkGreenColor}
                    />
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const filteredCelebrities = celebrities.filter(celebrity => {
    const fullName = `${celebrity.first} ${celebrity.last}`.toLowerCase();
    return fullName.includes(searchText.toLowerCase());
  });

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
        data={filteredCelebrities}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={{marginBottom: 20, marginTop: 20}}
        contentContainerStyle={{alignItems: 'center'}}
      />
      <ValidationAlert
        visible={validationVisible}
        onClose={() => setValidationVisible(false)}
        invalidFields={invalidFields}
      />
      <DeleteComponent
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onDelete={confirmDelete}
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
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: lightGrayColor,
    width: '90%',
    marginVertical: SPACING.sm,
  },
  icon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: blackColor,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.sm,
    width: '100%',
  },
  infoColumn: {
    width: '30%',
  },
  input: {
    borderWidth: 1,
    borderRadius: SPACING.xs,
    borderColor: darkGrayColor,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    maxHeight: 40,
    textAlign: 'center',
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: SPACING.xs,
    borderColor: darkGrayColor,
    alignItems: 'flex-start',
    padding: 10,
    width: '96%',
    maxWidth: '96%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: blackColor,
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: 14,
    color: blackColor,
    textAlign: 'center',
  },
  description: {
    marginTop: SPACING.md,
    //width: '100%',
    alignItems: 'center',
  },
});

export default CelebrityList;
