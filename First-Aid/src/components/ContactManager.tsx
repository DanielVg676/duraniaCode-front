import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Contacts from 'expo-contacts';
// Agregamos el icono X para el botón de cerrar
import { X, UserPlus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';

// Definimos la estructura de un contacto simple
export interface SavedContact {
  id: string;
  name: string;
  phone: string;
}

interface Props {
  onContactsChange: (contacts: string[]) => void;
}

export default function ContactManager({ onContactsChange }: Props) {
  const [savedContacts, setSavedContacts] = useState<SavedContact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneContacts, setPhoneContacts] = useState<Contacts.Contact[]>([]);

  // Nuevo estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStoredContacts();
  }, []);

  const loadStoredContacts = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@emergency_contacts');
      if (jsonValue != null) {
        const contacts = JSON.parse(jsonValue);
        setSavedContacts(contacts);
        updateParent(contacts);
      }
    } catch (e) {
      console.error("Error cargando contactos", e);
    }
  };

  const saveContacts = async (newContacts: SavedContact[]) => {
    try {
      await AsyncStorage.setItem('@emergency_contacts', JSON.stringify(newContacts));
      setSavedContacts(newContacts);
      updateParent(newContacts);
    } catch (e) {
      console.error("Error guardando", e);
    }
  };

  const updateParent = (contacts: SavedContact[]) => {
    const numbers = contacts
      .map(c => c.phone)
      .map(phone =>
        phone
          .replace(/[^\d+]/g, "")      // deja solo dígitos y +
          .replace(/^00/, "+")         // convierte 00xx a +xx si fuera el caso
      )
      .filter(p => p.length >= 8);      // filtra cosas demasiado cortas

    console.log("📞 Números normalizados para SOS:", numbers);
    onContactsChange(numbers);
  };



  const openContactPicker = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.PhoneNumbers
        ],
      });

      if (data.length > 0) {
        const validContacts = data.filter(c => c.phoneNumbers && c.phoneNumbers.length > 0);

        validContacts.sort((a, b) => {
          const nameA = (a.name || '').toString();
          const nameB = (b.name || '').toString();
          return nameA.localeCompare(nameB);
        });

        setPhoneContacts(validContacts);
        setSearchQuery('');
        setModalVisible(true);
      } else {
        Alert.alert("Sin contactos", "No se encontraron contactos en el teléfono.");
      }
    } else {
      Alert.alert("Permiso denegado", "Necesitamos acceso a tus contactos.");
    }
  };

  const selectContact = (contact: Contacts.Contact) => {
    if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) return;

    const phoneNumber = contact.phoneNumbers[0]?.number ?? '';
    const exists = savedContacts.some(c => c.phone === phoneNumber);
    if (exists) {
      Alert.alert("Ya agregado", "Este contacto ya está en tu lista de emergencia.");
      return;
    }

    const newContact: SavedContact = {
      id: Date.now().toString(),
      name: contact.name || 'Desconocido',
      phone: phoneNumber
    };

    const updatedList = [...savedContacts, newContact];
    saveContacts(updatedList);
    setModalVisible(false);
  };

  const removeContact = (id: string) => {
    const updatedList = savedContacts.filter(c => c.id !== id);
    saveContacts(updatedList);
  };

  const filteredContacts = phoneContacts.filter(contact => {
    const name = (contact.name || '').toString().toLowerCase();
    const phone = contact.phoneNumbers?.[0]?.number ?? '';
    const q = searchQuery.toLowerCase();
    return name.includes(q) || phone.includes(searchQuery);
  });

  return (
    <View style={styles.container}>


      {savedContacts.length === 0 && (
        <Text style={styles.emptyText}>No tienes contactos guardados aún.</Text>
      )}

      {savedContacts.map((contact) => (
        <View key={contact.id} style={styles.contactRow}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactPhone}>{contact.phone}</Text>
          </View>
          <TouchableOpacity
            onPress={() => removeContact(contact.id)}
            style={styles.deleteButton}
          >
            <X size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        onPress={openContactPicker}
        style={styles.addButton} // Estilo actualizado con #002e90
        activeOpacity={0.8}
      >
        <UserPlus size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.addButtonText}>Agregar Contacto</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
          <View style={styles.modalContainer}>

            {/* Header del Modal con Botón de Cerrar (X) */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeIconButton}
              >
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredContacts}
              keyExtractor={(item, index) => `${item.name ?? 'contact'}-${item.phoneNumbers?.[0]?.number ?? index}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => selectContact(item)}>
                  <View>
                    <Text style={styles.modalItemName}>{item.name ?? 'Desconocido'}</Text>
                    <Text style={styles.modalItemPhone}>{item.phoneNumbers?.[0]?.number}</Text>
                  </View>
                  <Text style={styles.selectArrow}>›</Text>
                </TouchableOpacity>
              )}
            />

            {/* Botón Inferior de Cancelar (Redundancia para mejor UX) */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 0,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1E293B',
    textAlign: 'center'
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginBottom: 12,
    fontStyle: 'italic'
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center'
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 2
  },
  contactPhone: {
    fontSize: 13,
    color: '#64748B'
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },

  // Botón Principal de Agregar (ACTUALIZADO)
  addButton: {
    backgroundColor: '#002e90', // TU NUEVO COLOR
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: "#002e90",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },

  // --- Estilos del Modal ---
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B'
  },
  closeIconButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 50,
  },
  searchInput: {
    height: 52,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#1E293B'
  },
  modalItem: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  modalItemName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1E293B'
  },
  modalItemPhone: {
    color: '#64748B',
    marginTop: 2,
    fontSize: 14
  },
  selectArrow: {
    fontSize: 20,
    color: '#CBD5E1',
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  cancelButtonText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 16
  }
});