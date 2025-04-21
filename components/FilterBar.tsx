import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { colors } from '@/constants/colors';
import { Position } from '@/types';
import { SlidersHorizontal, X, Check } from 'lucide-react-native';

interface FilterBarProps {
  positionFilter: Position | 'ALL';
  onPositionChange: (position: Position | 'ALL') => void;
  teamFilter: string;
  onTeamChange: (team: string) => void;
  sortBy: 'price' | 'points' | 'name';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'price' | 'points' | 'name', sortOrder: 'asc' | 'desc') => void;
  onReset: () => void;
  teams: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  positionFilter,
  onPositionChange,
  teamFilter,
  onTeamChange,
  sortBy,
  sortOrder,
  onSortChange,
  onReset,
  teams,
}) => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const positions: (Position | 'ALL')[] = ['ALL', 'GK', 'DEF', 'MID', 'FWD'];

  const handleSortChange = (newSortBy: 'price' | 'points' | 'name') => {
    // If clicking the same sort option, toggle order
    if (newSortBy === sortBy) {
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for points and price, ascending for name
      const newOrder = newSortBy === 'name' ? 'asc' : 'desc';
      onSortChange(newSortBy, newOrder);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {positions.map((position) => (
            <Pressable
              key={position}
              style={[
                styles.positionButton,
                positionFilter === position && styles.activePositionButton,
              ]}
              onPress={() => onPositionChange(position)}
            >
              <Text
                style={[
                  styles.positionText,
                  positionFilter === position && styles.activePositionText,
                ]}
              >
                {position}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        
        <Pressable 
          style={styles.filterButton}
          onPress={() => setShowFiltersModal(true)}
        >
          <SlidersHorizontal size={18} color={colors.primary} />
        </Pressable>
      </View>

      <Modal
        visible={showFiltersModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFiltersModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <Pressable onPress={() => setShowFiltersModal(false)}>
                <X size={24} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.sortOptions}>
                {[
                  { key: 'points', label: 'Points' },
                  { key: 'price', label: 'Price' },
                  { key: 'name', label: 'Name' },
                ].map((option) => (
                  <Pressable
                    key={option.key}
                    style={[
                      styles.sortOption,
                      sortBy === option.key && styles.activeSortOption,
                    ]}
                    onPress={() => handleSortChange(option.key as 'price' | 'points' | 'name')}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        sortBy === option.key && styles.activeSortOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {sortBy === option.key && (
                      <Text style={styles.sortOrderText}>
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Team</Text>
              <ScrollView style={styles.teamsList}>
                <Pressable
                  style={[
                    styles.teamOption,
                    teamFilter === '' && styles.activeTeamOption,
                  ]}
                  onPress={() => onTeamChange('')}
                >
                  <Text
                    style={[
                      styles.teamOptionText,
                      teamFilter === '' && styles.activeTeamOptionText,
                    ]}
                  >
                    All Teams
                  </Text>
                  {teamFilter === '' && (
                    <Check size={16} color={colors.primary} />
                  )}
                </Pressable>
                
                {teams.map((team) => (
                  <Pressable
                    key={team}
                    style={[
                      styles.teamOption,
                      teamFilter === team && styles.activeTeamOption,
                    ]}
                    onPress={() => onTeamChange(team)}
                  >
                    <Text
                      style={[
                        styles.teamOptionText,
                        teamFilter === team && styles.activeTeamOptionText,
                      ]}
                    >
                      {team}
                    </Text>
                    {teamFilter === team && (
                      <Check size={16} color={colors.primary} />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalFooter}>
              <Pressable
                style={styles.resetButton}
                onPress={() => {
                  onReset();
                  setShowFiltersModal(false);
                }}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </Pressable>
              
              <Pressable
                style={styles.applyButton}
                onPress={() => setShowFiltersModal(false)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    paddingRight: 8,
    flexGrow: 1,
  },
  positionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
  },
  activePositionButton: {
    backgroundColor: colors.primary,
  },
  positionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activePositionText: {
    color: 'white',
  },
  filterButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
    marginBottom: 8,
  },
  activeSortOption: {
    backgroundColor: colors.primary,
  },
  sortOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  activeSortOptionText: {
    color: 'white',
  },
  sortOrderText: {
    marginLeft: 4,
    fontSize: 14,
    color: 'white',
  },
  teamsList: {
    maxHeight: 200,
  },
  teamOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activeTeamOption: {
    backgroundColor: colors.highlight,
  },
  teamOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  activeTeamOptionText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});