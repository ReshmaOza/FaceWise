import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  blackColor,
  darkGreenColor,
  whiteBackgeoundColor,
} from '../assets/colors';
import {SPACING} from '../constants/styles';

interface ValidationAlertProps {
  visible: boolean;
  onClose: () => void;
  invalidFields: string[];
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({
  visible,
  onClose,
  invalidFields,
}) => {
  return (
    <Modal animationType="none" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Invalid Data</Text>
          <Text style={styles.modalText}>Please check these fields:</Text>
          {invalidFields.map((field, index) => (
            <Text key={index} style={styles.fieldText}>
              • {field}
            </Text>
          ))}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.okButton} onPress={onClose}>
              <Text style={[styles.buttonText, {color: whiteBackgeoundColor}]}>
                OK
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    color: blackColor,
  },
  modalText: {
    fontSize: 16,
    marginBottom: SPACING.sm,
    color: blackColor,
  },
  fieldText: {
    fontSize: 14,
    marginBottom: SPACING.xs,
    color: blackColor,
    alignSelf: 'flex-start',
    marginLeft: SPACING.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: SPACING.md,
  },
  okButton: {
    backgroundColor: darkGreenColor,
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

export default ValidationAlert;
