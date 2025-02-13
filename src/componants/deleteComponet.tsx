import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  blackColor,
  darkRedColor,
  lightGrayColor,
  whiteBackgeoundColor,
} from '../assets/colors';
import {SPACING} from '../constants/styles';

interface DeleteComponentProps {
  visible: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteComponent: React.FC<DeleteComponentProps> = ({
  visible,
  onCancel,
  onDelete,
}) => {
  return (
    <Modal animationType="none" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Are you sure you want to delete ?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={[styles.buttonText, {color: blackColor}]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={[styles.buttonText, {color: whiteBackgeoundColor}]}>
                Delete
              </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 350,
    padding: SPACING.md,
    backgroundColor: whiteBackgeoundColor,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: blackColor,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    gap: SPACING.sm,
  },
  cancelButton: {
    backgroundColor: whiteBackgeoundColor,
    padding: SPACING.sm,
    borderRadius: SPACING.xs,
    width: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lightGrayColor,
  },
  deleteButton: {
    backgroundColor: darkRedColor,
    padding: SPACING.sm,
    borderRadius: SPACING.xs,
    width: 100,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
  },
});

export default DeleteComponent;
