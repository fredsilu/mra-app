//src/components/ui/AppSelect.tsx
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/constants/theme';

export type AppSelectOption<T extends string> = {
  label: string;
  value: T;
};

type AppSelectProps<T extends string> = {
  label?: string;
  placeholder: string;
  value?: T;
  options: AppSelectOption<T>[];
  onValueChange: (value: T) => void;
  required?: boolean;
  error?: string;
};

export function AppSelect<T extends string>({
  label,
  placeholder,
  value,
  options,
  onValueChange,
  required = false,
  error,
}: AppSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  function handleSelect(selectedValue: T) {
    onValueChange(selectedValue);
    setIsOpen(false);
  }

  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text
          style={{
            color: COLORS.text,
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          {label}
          {required ? ' *' : ''}
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsOpen(true)}
        style={{
          minHeight: 52,
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: error ? '#C62828' : COLORS.border,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 14,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: selectedOption
              ? COLORS.text
              : COLORS.muted,
            fontSize: 16,
          }}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
      </TouchableOpacity>

      {error ? (
  <Text
    style={{
      color: '#C62828',
      fontSize: 13,
    }}
  >
    {error}
  </Text>
) : null}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          onPress={() => setIsOpen(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 520,
              maxHeight: '75%',
              alignSelf: 'center',
              backgroundColor: COLORS.white,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                paddingHorizontal: 18,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
              }}
            >
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 18,
                  fontWeight: '700',
                }}
              >
                {label ?? placeholder}
              </Text>
            </View>

            <ScrollView>
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    activeOpacity={0.7}
                    onPress={() => handleSelect(option.value)}
                    style={{
                      paddingHorizontal: 18,
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.border,
                      backgroundColor: isSelected
                        ? COLORS.light
                        : COLORS.white,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.text,
                        fontSize: 16,
                        fontWeight: isSelected ? '700' : '400',
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsOpen(false)}
              style={{
                padding: 16,
                alignItems: 'center',
                borderTopWidth: 1,
                borderTopColor: COLORS.border,
              }}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                Annuler
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}