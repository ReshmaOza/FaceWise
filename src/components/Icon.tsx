import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface IconProps {
  type: 'AntDesign' | 'Ionicons' | 'MaterialIcons';
  name: string;
  size: number;
  color: string;
  style?: any;
}

const Icon = ({type, name, size, color, style}: IconProps) => {
  switch (type) {
    case 'AntDesign':
      return <AntDesign name={name} size={size} color={color} style={style} />;
    case 'Ionicons':
      return <Ionicons name={name} size={size} color={color} style={style} />;
    case 'MaterialIcons':
      return (
        <MaterialIcons name={name} size={size} color={color} style={style} />
      );
    default:
      return null;
  }
};

export default Icon;
