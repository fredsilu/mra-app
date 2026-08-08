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

import { FormCard, FormHeader, FormPage } from "@/components/forms";
import { AppInput } from "@/components/ui/AppInput";
import { AppSelect, type AppSelectOption } from "@/components/ui/AppSelect";
import { COLORS } from "@/constants/theme";
import {
  getActivityById,
  updatePlannedActivity,
  type Activity,
} from "@/features/activities";
import { getActiveCounselors } from "@/features/users/user.service";

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

export default function EditActivityScreen() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const [activity, setActivity] = useState<Activity | null>(null);

  const [counselorId, setCounselorId] = useState<string>();

  const [counselorOptions, setCounselorOptions] = useState<
    AppSelectOption<string>[]
  >([]);

  const [scheduledAt, setScheduledAt] = useState(new Date());

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showTimePicker, setShowTimePicker] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const counselorName = useMemo(
    () =>
      counselorOptions.find((option) => option.value === counselorId)?.label,
    [counselorId, counselorOptions],
  );

  useEffect(() => {
    async function load(): Promise<void> {
      if (!id) {
        showMessage("Erreur", "Identifiant de l’activité manquant.");
        router.back();
        return;
      }

      try {
        setIsLoading(true);

        const [loadedActivity, counselors] = await Promise.all([
          getActivityById(id),
          getActiveCounselors(),
        ]);

        if (!loadedActivity) {
          showMessage("Erreur", "Activité introuvable.");
          router.back();
          return;
        }

        if (loadedActivity.status !== "planned") {
          showMessage(
            "Modification impossible",
            "Seules les activités planifiées peuvent être modifiées.",
          );
          router.back();
          return;
        }

        setActivity(loadedActivity);

        setCounselorOptions(
          counselors.map((counselor) => ({
            label: counselor.displayName,
            value: counselor.uid,
          })),
        );

        setCounselorId(loadedActivity.counselorId);

        setTitle(loadedActivity.title);

        setDescription(loadedActivity.description ?? "");

        if (loadedActivity.scheduledAt) {
          setScheduledAt(loadedActivity.scheduledAt.toDate());
        }
      } catch (error) {
        console.error("Erreur chargement activité :", error);

        showMessage("Erreur", "Impossible de charger cette activité.");
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [id]);

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

  async function handleSave(): Promise<void> {
    if (!activity || !id || isSaving) {
      return;
    }

    if (!counselorId || !counselorName) {
      showMessage("Champ obligatoire", "Veuillez sélectionner un conseiller.");
      return;
    }

    if (!title.trim()) {
      showMessage("Champ obligatoire", "Veuillez renseigner le titre.");
      return;
    }

    try {
      setIsSaving(true);

      await updatePlannedActivity(activity.id, {
        counselorId,
        counselorName,
        scheduledAt,
        title,
        description,
      });

      showMessage(
        "Rendez-vous modifié",
        "Les modifications ont été enregistrées.",
      );

      router.replace({
        pathname: "/activities/[id]",
        params: {
          id: activity.id,
        },
      });
    } catch (error) {
      console.error("Erreur modification activité :", error);

      showMessage(
        "Erreur",
        error instanceof Error &&
          error.message === "ONLY_PLANNED_ACTIVITY_CAN_BE_EDITED"
          ? "Cette activité ne peut plus être modifiée."
          : "Impossible de modifier cette activité.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <FormPage>
        <Text style={styles.loading}>Chargement...</Text>
      </FormPage>
    );
  }

  if (!activity) {
    return null;
  }

  return (
    <FormPage>
      <FormHeader
        title="Modifier le rendez-vous"
        description={`Rendez-vous avec ${activity.personName}`}
      />

      <FormCard
        title="Affectation"
        description="Vous pouvez réaffecter cette activité à un autre conseiller."
      >
        <AppSelect<string>
          label="Conseiller"
          placeholder="Sélectionner un conseiller"
          value={counselorId}
          options={counselorOptions}
          onValueChange={setCounselorId}
          required
        />
      </FormCard>

      <FormCard
        title="Planification"
        description="Modifiez la date, l’heure ou les informations du rendez-vous."
      >
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
          <Text style={styles.label}>Titre *</Text>

          <AppInput
            value={title}
            onChangeText={setTitle}
            editable={!isSaving}
          />
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Description</Text>

          <AppInput
            value={description}
            onChangeText={setDescription}
            multiline
            editable={!isSaving}
          />
        </View>
      </FormCard>

      <View style={styles.actions}>
        <Pressable
          disabled={isSaving}
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </Pressable>

        <Pressable
          disabled={isSaving}
          onPress={() => {
            void handleSave();
          }}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.buttonPressed,
            isSaving && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
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
  loading: {
    color: COLORS.muted,
    padding: 24,
    textAlign: "center",
  },

  group: {
    gap: 6,
  },

  label: {
    color: COLORS.text,
    fontWeight: "700",
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
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 50,
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
  },

  cancelButton: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 20,
  },

  cancelButtonText: {
    color: COLORS.text,
    fontWeight: "700",
  },

  saveButton: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 22,
  },

  saveButtonText: {
    color: COLORS.white,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.55,
  },
});
