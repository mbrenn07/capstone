import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Modal, Button } from 'react-native';

import  AppleHealthKit, { HealthKitPermissions, HealthDateOfBirth, HealthValue, HealthUnitOptions}  from 'react-native-health';
import { useEffect, useState } from 'react'
import { LineChart , ProgressChart, BarChart} from 'react-native-chart-kit';
import React from 'react';


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
interface ChartData {
  labels: string[];
  data: number[];
}

const options = {
  includeManuallyAdded: false, // optional: default true
};


export default function App() {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(0);
  const [stepsData, setStepsData] = useState(0.0);
  const [totalSteps, setTotalSteps] = useState(0);

  const [currentDate, setCurrentDate] = useState("");
  const [heartRateData, setHeartRateData] = useState<number[]>([]);
  const [sleepData, setSleepData] = useState<number[]>([]);

  const [selectedChart, setSelectedChart] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);


  useEffect(() => {
    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log('Error getting permissions')
        return;
      }
      setHasPermissions(true)

      // Call the function to fetch step count periodically
      fetchStepCount();
      const intervalId = setInterval(fetchStepCount, 60000); // Fetch every minute
      
      return () => clearInterval(intervalId); 
    })
    setCurrentDate(getCurrentDate());
  }, []);

  const handleChartSelection = (chartType) => {
    setSelectedChart(chartType);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedChart(null);
  };

  const getCurrentDate = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
  };

  const fetchStepCount = () => {
    AppleHealthKit.getStepCount(null, (err: Object, results: HealthValue) => {
      if (err) {
        console.log('Error fetching step count:', err);
        return;
      }
      const stepsResult = results.value;
      setTotalSteps(stepsResult)
      const stepsFraction = stepsResult / 10000.0;
      setStepsData(stepsFraction);
      console.log('Steps on given date(s):', stepsFraction);
    });
  };

  useEffect(() => {

    AppleHealthKit.getBiologicalSex(null, (err, results) => {
      if (err) {
        return
      }
      const resultGender = results.value;
      setGender(resultGender);
      console.log("Gender: " + resultGender)
    })

    AppleHealthKit.getDateOfBirth(null, (err, results) => {
      if (!err) {
        const resultAge = results.age;
        const resultDob = results.value;
        setAge(resultAge);
        setDob(resultDob);
        console.log("Age: " + resultAge);
        console.log("Date of Birth: " + resultDob);
      }
    });

    AppleHealthKit.getSleepSamples(options, (err: Object, results: Array<HealthValue>) => {
      if (err) {
        return;
      }
      const sleepRateResult = results.map((sample) => sample.value);
      setSleepData(sleepRateResult);
      // const dataOutput = [{ 
      //   data: [sleepRateResult], // Store the step fraction in 'data'
      //   labels: ["Sleep"] // Provide a label for the data
      // }];
      console.log("Sleep on given date(s): " + JSON.stringify(results))
    },
    )

    AppleHealthKit.getHeartRateSamples(
      options,
      (err: Object, results: HealthValue[]) => {
        if (err) {
          return;
        }
        const heartRateResult = results.map((sample) => sample.value);
        setHeartRateData(heartRateResult);
        // const dataOutput = [{ 
        //   data: [heartRateResult], // Store the step fraction in 'data'
        //   labels: ["Heart"] // Provide a label for the data
        // }];
        console.log("Heartrate on given date(s): " + JSON.stringify(results));
      },
    );

  }, [hasPermissions]) 

  return (
    <View style={styles.container}>
      {hasPermissions ? (
        <View>
          <Text style={styles.chartLabel}>
            Steps Taken on {currentDate}
          </Text>
          {/* Buttons for selecting chart */}
          <TouchableOpacity onPress={() => handleChartSelection('progress')}>
            <Text style={styles.button}>Progress Chart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleChartSelection('line')}>
            <Text style={styles.button}>Line Chart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleChartSelection('bar')}>
            <Text style={styles.button}>Bar Chart</Text>
          </TouchableOpacity>

          {/* Modal for displaying chart */}
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Render selected chart */}
                {selectedChart === 'progress' && (
                  <ProgressChart
                    data={{
                      labels: ["Steps"],
                      data: [stepsData], // Sample data, replace with your actual data
                    }}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={chartConfig}
                    hideLegend={false}
                  />
                )}
                {selectedChart === 'line' && (
                  <LineChart
                    // Line chart configuration
                  />
                )}
                {selectedChart === 'bar' && (
                  <BarChart
                    // Bar chart configuration
                  />
                )}
                <Button title="Back" onPress={closeModal} />
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff', // Background gradient color (from)
  backgroundGradientTo: '#fff', // Background gradient color (to)
  decimalPlaces: 0, // Number of decimal places for Y-axis values
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Function to determine color for data lines
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Function to determine color for labels
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6", // Dot size
    strokeWidth: "2",
    stroke: "#ffa726", // Dot color
  },
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartLabel: {
    // Styles for chart label
  },
  button: {
    // Styles for buttons
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
});
