import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import AppleHealthKit, {
    HealthValue, 
    HealthKitPermissions,
} from 'react-native-health'
import { useEffect, useState } from 'react'

const permissions: HealthKitPermissions = {
    permissions: {
        read: [AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
            AppleHealthKit.Constants.Permissions.ActivitySummary,
            AppleHealthKit.Constants.Permissions.AllergyRecord,
            AppleHealthKit.Constants.Permissions.AppleExerciseTime,
            AppleHealthKit.Constants.Permissions.AppleStandTime,
            AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
            AppleHealthKit.Constants.Permissions.BiologicalSex,
            AppleHealthKit.Constants.Permissions.BloodType,
            AppleHealthKit.Constants.Permissions.BloodAlcoholContent,
            AppleHealthKit.Constants.Permissions.BloodGlucose,
            AppleHealthKit.Constants.Permissions.BloodPressureDiastolic,
            AppleHealthKit.Constants.Permissions.BloodPressureSystolic,
            AppleHealthKit.Constants.Permissions.BodyFatPercentage,
            AppleHealthKit.Constants.Permissions.BodyMass,
            AppleHealthKit.Constants.Permissions.BodyMassIndex,
            AppleHealthKit.Constants.Permissions.BodyTemperature,
            AppleHealthKit.Constants.Permissions.DateOfBirth,
            AppleHealthKit.Constants.Permissions.Biotin,
            AppleHealthKit.Constants.Permissions.Caffeine,
            AppleHealthKit.Constants.Permissions.Calcium,
            AppleHealthKit.Constants.Permissions.Carbohydrates,
            AppleHealthKit.Constants.Permissions.Chloride,
            AppleHealthKit.Constants.Permissions.Cholesterol,
            AppleHealthKit.Constants.Permissions.ConditionRecord,
            AppleHealthKit.Constants.Permissions.Copper,
            AppleHealthKit.Constants.Permissions.CoverageRecord,
            AppleHealthKit.Constants.Permissions.Electrocardiogram,
            AppleHealthKit.Constants.Permissions.EnergyConsumed,
            AppleHealthKit.Constants.Permissions.EnvironmentalAudioExposure,
            AppleHealthKit.Constants.Permissions.FatMonounsaturated,
            AppleHealthKit.Constants.Permissions.FatPolyunsaturated,
            AppleHealthKit.Constants.Permissions.FatSaturated,
            AppleHealthKit.Constants.Permissions.FatTotal,
            AppleHealthKit.Constants.Permissions.Fiber,
            AppleHealthKit.Constants.Permissions.Folate,
            AppleHealthKit.Constants.Permissions.HeadphoneAudioExposure,
            AppleHealthKit.Constants.Permissions.ImmunizationRecord,
            AppleHealthKit.Constants.Permissions.Iodine,
            AppleHealthKit.Constants.Permissions.Iron,
            AppleHealthKit.Constants.Permissions.LabResultRecord,
            AppleHealthKit.Constants.Permissions.Magnesium,
            AppleHealthKit.Constants.Permissions.Manganese,
            AppleHealthKit.Constants.Permissions.MedicationRecord,
            AppleHealthKit.Constants.Permissions.Molybdenum,
            AppleHealthKit.Constants.Permissions.Niacin,
            AppleHealthKit.Constants.Permissions.PantothenicAcid,
            AppleHealthKit.Constants.Permissions.Phosphorus,
            AppleHealthKit.Constants.Permissions.Potassium,
            AppleHealthKit.Constants.Permissions.ProcedureRecord,
            AppleHealthKit.Constants.Permissions.Protein,
            AppleHealthKit.Constants.Permissions.Riboflavin,
            AppleHealthKit.Constants.Permissions.Selenium,
            AppleHealthKit.Constants.Permissions.Sodium,
            AppleHealthKit.Constants.Permissions.Sugar,
            AppleHealthKit.Constants.Permissions.Thiamin,
            AppleHealthKit.Constants.Permissions.VitaminA,
            AppleHealthKit.Constants.Permissions.VitaminB12,
            AppleHealthKit.Constants.Permissions.VitaminB6,
            AppleHealthKit.Constants.Permissions.VitaminC,
            AppleHealthKit.Constants.Permissions.VitaminD,
            AppleHealthKit.Constants.Permissions.VitaminE,
            AppleHealthKit.Constants.Permissions.VitaminK,
            AppleHealthKit.Constants.Permissions.Zinc,
            AppleHealthKit.Constants.Permissions.Water,
            AppleHealthKit.Constants.Permissions.DistanceCycling,
            AppleHealthKit.Constants.Permissions.DistanceSwimming,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
            AppleHealthKit.Constants.Permissions.FlightsClimbed,
            AppleHealthKit.Constants.Permissions.HeartbeatSeries,
            AppleHealthKit.Constants.Permissions.HeartRate,
            AppleHealthKit.Constants.Permissions.RestingHeartRate,
            AppleHealthKit.Constants.Permissions.HeartRateVariability,
            AppleHealthKit.Constants.Permissions.Height,
            AppleHealthKit.Constants.Permissions.LeanBodyMass,
            AppleHealthKit.Constants.Permissions.MindfulSession,
            AppleHealthKit.Constants.Permissions.NikeFuel,
            AppleHealthKit.Constants.Permissions.RespiratoryRate,
            AppleHealthKit.Constants.Permissions.SleepAnalysis,
            AppleHealthKit.Constants.Permissions.StepCount,
            AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.VitalSignRecord,
            AppleHealthKit.Constants.Permissions.Vo2Max,
            AppleHealthKit.Constants.Permissions.WalkingHeartRateAverage,
            AppleHealthKit.Constants.Permissions.Weight,
            AppleHealthKit.Constants.Permissions.Workout,
            AppleHealthKit.Constants.Permissions.PeakFlow
            ],
      //blank not writing to healthkit
        write: [],
    },
};


export default function TabThreeScreen() {
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
          if (error) {
              console.log('[ERROR] Cannot grant permissions:', error);
          } else {
              // Successfully initialized HealthKit
              fetchStepCount();
          }
      });
  }, []);

  const fetchStepCount = () => {
      AppleHealthKit.getStepCount({}, (err, results) => {
          if (!err && results) {
              setStepCount(results.value); // Assuming `value` contains the step count
          } else {
              console.log('[ERROR] Failed to fetch step count:', err);
          }
      });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
