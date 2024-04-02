import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import  AppleHealthKit, { HealthKitPermissions, HealthDateOfBirth, HealthValue }  from 'react-native-health';
import { useEffect, useState } from 'react'

const permissions: HealthKitPermissions = {
  permissions: {
      read: [AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          AppleHealthKit.Constants.Permissions.ActivitySummary,
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
          AppleHealthKit.Constants.Permissions.Copper,
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
          AppleHealthKit.Constants.Permissions.Iodine,
          AppleHealthKit.Constants.Permissions.Iron,
          AppleHealthKit.Constants.Permissions.Magnesium,
          AppleHealthKit.Constants.Permissions.Manganese,
          AppleHealthKit.Constants.Permissions.Molybdenum,
          AppleHealthKit.Constants.Permissions.Niacin,
          AppleHealthKit.Constants.Permissions.PantothenicAcid,
          AppleHealthKit.Constants.Permissions.Phosphorus,
          AppleHealthKit.Constants.Permissions.Potassium,
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

const options = {
  date: new Date().toISOString(), // optional; default now
  includeManuallyAdded: false, // optional: default true
};

const sleepGraph = {
  Labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  datasets: [
    {
      data: [AppleHealthKit.getSleepSamples(options, (err: Object, results: Array<HealthValue>) => {
        if (err) {
          return;
        }
        console.log("Sleep on given date(s): " + JSON.stringify(results))
      },
      )],
    },
  ],
};

const heartRateGraph = {
  Labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  datasets: [
    {
      data: [AppleHealthKit.getHeartRateSamples((options), 
        (err: Object, results: HealthValue[]) => {
        if (err) {
          return
        }
        console.log("Heart rate on given date(s): " + JSON.stringify(results))
      }, 
      )],
    },
  ],
};

const stepsGraph = {
  Labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  datasets: [
    {
      data: [AppleHealthKit.getStepCount(
        (options),
        (err: Object, results: HealthValue) => {
          if (err) {
            return
          }
          console.log("Steps on given date(s): " + JSON.stringify(results))
        },
      )],
    },
  ],
};


export default function App() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [gender, setGender] = useState("")
  const [dob, setDob] = useState("")
  const [age, setAge] = useState(0)
  useEffect(() => {
    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log('Error getting permissions')
        return;
      }
      setHasPermissions(true)
    })
    
  }, []);

  useEffect(() => {

    AppleHealthKit.getBiologicalSex(null, (err: Object, results: Object) => {
      if (err) {
        return
      }
      const resultGender = results.value;
      setGender(resultGender);
      console.log("Gender: " + resultGender)
    })

    AppleHealthKit.getDateOfBirth(
      null,
      (err: Object, results: HealthDateOfBirth) => {
        if (err) {
          return
        }
        const resultAge = results.age;
        const resultDob = results.value;
        console.log("Age: " + resultAge);
        console.log("Date of Birth: " + resultDob);
      },
    )

    AppleHealthKit.getStepCount(
      (options),
      (err: Object, results: HealthValue) => {
        if (err) {
          return
        }
        console.log("Steps on given date(s): " + JSON.stringify(results))
      },
    )





  }, [hasPermissions]) 

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
