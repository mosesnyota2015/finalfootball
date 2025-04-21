import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search players...',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <Search size={18} color={colors.textSecondary} />
      </View>
      
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
      />
      
      {value.length > 0 && (
        <Pressable 
          style={styles.clearButton}
          onPress={() => onChangeText('')}
        >
          <X size={18} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
});