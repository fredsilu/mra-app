// app/(app)/activities/new.tsx

import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { createElement, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { FormHeader, FormPage } from "@/components/forms";

import { AppInput } from "@/components/ui/AppInput";
import { AppSelect, type AppSelectOption } from "@/components/ui/AppSelect";
import { COLORS } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import {
  ACTIVITY_TYPE_LABELS,
  createActivity,
  type ActivityType,
} from "@/features/activities";
import { getActiveCounselors } from "@/features/users/user.service";

const activityTypeOptions: AppSelectOption<ActivityType>[] = Object.entries(
  ACTIVITY_TYPE_LABELS,
).map(([value, label]) => ({
  label,
  value: value as ActivityType,
}));

function formatWebDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatWebTime(value: Date): string {
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function showMessage(title: string, message: string): void {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

export default function NewActivityScreen() {
  const { user, profile } = useAuth();

  const { personId, personName, caseId, activityType, lockActivityType } =
    useLocalSearchParams<{
      personId?: string;
      personName?: string;
      caseId?: string;
      activityType?: ActivityType;
      lockActivityType?: string;
    }>();

  const isActivityTypeLocked = lockActivityType === "true";

  const [counselorId, setCounselorId] = useState<string>();

  const [counselorOptions, setCounselorOptions] = useState<
    AppSelectOption<string>[]
  >([]);

  const initialType: ActivityType | undefined =
    activityType &&
    Object.prototype.hasOwnProperty.call(ACTIVITY_TYPE_LABELS, activityType)
      ? activityType
      : undefined;

  const [type, setType] = useState<ActivityType | undefined>(initialType);

  const [title, setTitle] = useState(
    initialType ? ACTIVITY_TYPE_LABELS[initialType] : "",
  );
  const [description, setDescription] = useState("");

  const [scheduledAt, setScheduledAt] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showTimePicker, setShowTimePicker] = useState(false);

  const [isLoadingCounselors, setIsLoadingCounselors] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const counselorName = useMemo(
    () =>
      counselorOptions.find((option) => option.value === counselorId)?.label,
    [counselorId, counselorOptions],
  );

  useEffect(() => {
    async function loadCounselors() {
      try {
        const counselors = await getActiveCounselors();

        setCounselorOptions(
          counselors.map((counselor) => ({
            label: counselor.displayName,
            value: counselor.uid,
          })),
        );
      } catch (error) {
        console.error("Erreur lors du chargement des conseillers :", error);

        showMessage("Erreur", "Impossible de charger les conseillers.");
      } finally {
        setIsLoadingCounselors(false);
      }
    }

    void loadCounselors();
  }, []);

  function handleTypeChange(value: ActivityType) {
    setType(value);

    if (!title.trim()) {
      setTitle(ACTIVITY_TYPE_LABELS[value]);
    }
  }

  function handleDateChange(event: DateTimePickerEvent, selectedDate?: Date) {
    setShowDatePicker(false);

    if (event.type === "dismissed" || !selectedDate) {
      return;
    }

    const nextDate = new Date(scheduledAt);

    nextDate.setFullYear(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );

    setScheduledAt(nextDate);
  }

  function handleTimeChange(event: DateTimePickerEvent, selectedTime?: Date) {
    setShowTimePicker(false);

    if (event.type === "dismissed" || !selectedTime) {
      return;
    }

    const nextDate = new Date(scheduledAt);

    nextDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);

    setScheduledAt(nextDate);
  }

  function handleWebDateChange(value: string) {
    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) {
      return;
    }

    const nextDate = new Date(scheduledAt);

    nextDate.setFullYear(year, month - 1, day);

    setScheduledAt(nextDate);
  }

  function handleWebTimeChange(value: string) {
    const [hours, minutes] = value.split(":").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return;
    }

    const nextDate = new Date(scheduledAt);

    nextDate.setHours(hours, minutes, 0, 0);

    setScheduledAt(nextDate);
  }

  async function handleSave() {
    if (isSaving) {
      return;
    }

    if (!personId || !personName) {
      showMessage(
        "Champ obligatoire",
        "La personne concernée est obligatoire.",
      );
      return;
    }

    if (!counselorId || !counselorName) {
      showMessage("Champ obligatoire", "Veuillez sélectionner un conseiller.");
      return;
    }

    if (!type) {
      showMessage(
        "Champ obligatoire",
        "Veuillez sélectionner un type d’activité.",
      );
      return;
    }

    if (!title.trim()) {
      showMessage(
        "Champ obligatoire",
        "Veuillez renseigner le titre de l’activité.",
      );
      return;
    }

    const createdBy = profile?.uid ?? user?.uid;

    if (!createdBy) {
      showMessage(
        "Session invalide",
        "Impossible d’identifier l’utilisateur connecté.",
      );
      return;
    }

    try {
      setIsSaving(true);

      await createActivity({
        personId,
        personName,
        caseId: caseId ?? null,
        counselorId,
        counselorName,
        type,
        status: "planned",
        scheduledAt,
        title: title.trim(),
        description: description.trim(),
        createdBy,
      });

      showMessage(
        "Activité créée",
        "L’activité a été enregistrée avec succès.",
      );

      router.replace({
        pathname: "/people/[id]",
        params: {
          id: personId,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la création de l’activité :", error);

      if (
        error instanceof Error &&
        error.message === "PLANNED_FIRST_INTERVIEW_ALREADY_EXISTS"
      ) {
        showMessage(
          "Entretien déjà planifié",
          "Un premier entretien est déjà planifié pour cette personne.",
        );

        router.replace({
          pathname: "/people/[id]",
          params: {
            id: personId,
          },
        });

        return;
      }

      showMessage("Erreur", "Impossible d’enregistrer l’activité.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <FormPage>
      <FormHeader
        title="Nouvelle activité"
        description="Planifiez un entretien, une visite, un appel ou toute autre activité d'accompagnement."
      />

      <View style={styles.group}>
        <Text style={styles.label}>Personne *</Text>

        <AppInput
          value={personName ?? ""}
          editable={false}
          placeholder="Aucune personne sélectionnée"
        />
      </View>

      <AppSelect<string>
        label="Conseiller"
        placeholder={
          isLoadingCounselors ? "Chargement..." : "Sélectionner un conseiller"
        }
        value={counselorId}
        options={counselorOptions}
        onValueChange={setCounselorId}
        required
      />
      {isActivityTypeLocked ? (
        <View style={styles.group}>
          <Text style={styles.label}>Type d’activité</Text>

          <AppInput
            value={type ? ACTIVITY_TYPE_LABELS[type] : "Premier entretien"}
            editable={false}
          />
        </View>
      ) : (
        <AppSelect<ActivityType>
          label="Type d’activité"
          placeholder="Sélectionner un type"
          value={type}
          options={activityTypeOptions}
          onValueChange={handleTypeChange}
          required
        />
      )}

      <View style={styles.group}>
        <Text style={styles.label}>Titre *</Text>

        <AppInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex. Premier entretien"
          editable={!isSaving}
        />
      </View>

      <View style={styles.dateRow}>
        <View style={styles.dateField}>
          <Text style={styles.label}>Date *</Text>

          {Platform.OS === "web" ? (
            createElement("input", {
              type: "date",
              value: formatWebDate(scheduledAt),
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleWebDateChange(event.target.value),
              style: webInputStyle,
            })
          ) : (
            <Pressable
              style={styles.pickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerText}>
                {scheduledAt.toLocaleDateString("fr-FR")}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.timeField}>
          <Text style={styles.label}>Heure *</Text>

          {Platform.OS === "web" ? (
            createElement("input", {
              type: "time",
              value: formatWebTime(scheduledAt),
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleWebTimeChange(event.target.value),
              style: webInputStyle,
            })
          ) : (
            <Pressable
              style={styles.pickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.pickerText}>
                {scheduledAt.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {Platform.OS !== "web" && showDatePicker ? (
        <DateTimePicker
          value={scheduledAt}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      ) : null}

      {Platform.OS !== "web" && showTimePicker ? (
        <DateTimePicker
          value={scheduledAt}
          mode="time"
          display="default"
          is24Hour
          onChange={handleTimeChange}
        />
      ) : null}

      <View style={styles.group}>
        <Text style={styles.label}>Description</Text>

        <AppInput
          value={description}
          onChangeText={setDescription}
          placeholder="Informations utiles sur l’activité..."
          multiline
          editable={!isSaving}
        />
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && !isSaving && styles.buttonPressed,
            isSaving && styles.buttonDisabled,
          ]}
          disabled={isSaving}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && !isSaving && styles.buttonPressed,
            isSaving && styles.buttonDisabled,
          ]}
          disabled={isSaving}
          onPress={() => {
            void handleSave();
          }}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Enregistrement..." : "Enregistrer l’activité"}
          </Text>
        </Pressable>
      </View>
    </FormPage>
  );
}

const webInputStyle = {
  width: "100%",
  minHeight: 50,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 12,
  padding: "0 14px",
  backgroundColor: COLORS.white,
  color: COLORS.text,
  fontSize: 16,
  boxSizing: "border-box" as const,
};

const styles = StyleSheet.create({
  group: {
    gap: 6,
  },

  label: {
    color: COLORS.text,
    fontWeight: "600",
  },

  dateRow: {
    flexDirection: "row",
    gap: 12,
  },

  dateField: {
    flex: 2,
    gap: 6,
  },

  timeField: {
    flex: 1,
    gap: 6,
  },

  pickerButton: {
    minHeight: 50,
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  pickerText: {
    color: COLORS.text,
    fontSize: 16,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 8,
  },

  cancelButton: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 22,
  },

  cancelButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },

  saveButton: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    flexGrow: 1,
    justifyContent: "center",
    maxWidth: 320,
    minHeight: 52,
    paddingHorizontal: 24,
  },

  saveButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.55,
  },
});
