import React, { useState, useContext, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AppContext } from "../App";

const MyJobs = ({ navigation }) => {
	const { userId, isRecruiter } = useContext(AppContext);
	const [jobs, setJobs] = useState([]);

	useFocusEffect(
		useCallback(() => {
			if (!isRecruiter) {
				fetch('http://localhost:3000/getJobs')
					.then((response) => response.json())
					.then((data) => {
						const jobsArray = data.jobs.filter((job) =>
							job.appliedBy.includes(userId)
						);
						setJobs(jobsArray);
					})
					.catch((error) =>
						console.error('Error fetching jobs:', error)
					);
			} else {
				fetch('http://localhost:3000/getJobs')
					.then((response) => response.json())
					.then((data) => {
						const jobsArray = data.jobs.filter(
							(job) => job.postedBy == userId
						);
						setJobs(jobsArray);
					})
					.catch((error) =>
						console.error('Error fetching jobs:', error)
					);
			}
		}, [])
	);

	const renderItem = ({ item }) => (
		<Pressable
			onPress={() => navigation.navigate('Job', { jobId: item._id })}>
			<View style={styles.jobCard}>
				<Text style={styles.jobTitle}>{item.role}</Text>
				<Text style={styles.company}>{item.company}</Text>
				<Text style={styles.experience}>
					Experience: {item.experience}
				</Text>
				<Text style={styles.skills}>
					Skills: {item.skills.join(', ')}
				</Text>
				<Pressable
					style={styles.applyButton}
					onPress={() =>
						isRecruiter
							? handleDelete(item._id)
							: handleInactive(item._id)
					}>
					<Text>Set Inactive</Text>
				</Pressable>
			</View>
		</Pressable>
	);

	const handleInactive = (jobId) => {
		const formData = new URLSearchParams();
		formData.append('jobId', jobId);
		formData.append('employeeId', userId);
		console.log(`set inactive job ${jobId}`);
		fetch('http://localhost:3000/setJobInactive', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData.toString(),
		})
			.then(() => {
				setJobs((jobs) => jobs.filter((job) => job._id != jobId));
			})
			.catch((err) => console.log(err));
	};

	const handleDelete = (jobId) => {
		const formData = new URLSearchParams();
		formData.append('jobId', jobId);
		formData.append('employeeId', userId);
		console.log(`set inactive job ${jobId}`);
		fetch('http://localhost:3000/deleteJob', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData.toString(),
		})
			.then(() => {
				setJobs((jobs) => jobs.filter((job) => job._id != jobId));
			})
			.catch((err) => console.log(err));
	};

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  jobCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    marginVertical: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  company: {
    fontSize: 16,
    marginBottom: 8,
  },
  experience: {
    fontSize: 14,
    marginBottom: 8,
  },
  skills: {
    fontSize: 14,
    marginBottom: 8,
  },
  applyButton: {
    backgroundColor: "#e6e600",
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
  },
});

export default MyJobs;
