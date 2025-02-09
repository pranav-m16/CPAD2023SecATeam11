import React, { useContext, useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../App';

const ProfilePage = () => {
	const { userData, setUserData, isRecruiter, userId } =
		useContext(AppContext);
	const [editable, setEditable] = useState(false);
	// const [error, setError] = useState('');
	// const [isError, setIsError] = useState(false);
	const [fname, setFname] = useState(userData == null ? '' : userData.fname);
	const [lname, setLname] = useState(userData == null ? '' : userData.lname);
	const [company, setCompany] = useState(
		userData == null ? '' : userData.company
	);
	const [experience, setExperience] = useState(
		userData == null ? '' : userData.experience
	);
	const [skills, setSkills] = useState(
		userData == null ? [] : userData.skills
	);
  
	useFocusEffect(
		useCallback(() => {
			if (!isRecruiter) {
				fetch(`http://localhost:3000/employee/${userId}`)
					.then((response) => response.json())
					.then((data) => {
						if (data?.employee?.fname) {
							setFname(data?.employee?.fname);
						}
						if (data?.employee?.lname) {
							setLname(data?.employee?.lname);
						}
						if (data?.employee?.experience) {
							setExperience(data?.employee?.experience);
						}
						if (data?.employee?.skills) {
							setSkills(data?.employee?.skills);
						}
					})
					.catch((error) =>
						console.error('Error fetching employee: ', error)
					);
			} else {
				fetch(`http://localhost:3000/employer/${userId}`)
					.then((response) => response.json())
					.then((data) => {
						if (data?.employer?.fname) {
							setFname(data?.employer?.fname);
						}
						if (data?.employer?.lname) {
							setLname(data?.employer?.lname);
						}
						if (data?.employer?.company) {
							setCompany(data?.employer?.company);
						}
					})
					.catch((error) =>
						console.error('Error fetching employee: ', error)
					);
			}
		}, [])
	);

	const handleEdit = () => {
		setEditable(true);
	};

	const handleSave = () => {
		if (!isRecruiter) {
			const formData = new URLSearchParams();
			formData.append('id', userId);
			formData.append('fname', fname);
			formData.append('lname', lname);
			formData.append('experience', experience);
			formData.append('skills', skills);
			console.log('employee post call');
			fetch('http://localhost:3000/employee/saveProfile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: formData.toString(),
			});
		} else {
			const formData = new URLSearchParams();
			formData.append('id', userId);
			formData.append('fname', fname);
			formData.append('lname', lname);
			formData.append('company', company);
			fetch('http://localhost:3000/employer/saveProfile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: formData.toString(),
			});
		}
		setEditable(false);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Profile Page</Text>
			{/* {isError && <Text>{error}</Text>} */}
			<View style={styles.fieldContainer}>
				<Text>First Name:</Text>
				<TextInput
					style={styles.input}
					value={fname}
					onChangeText={(text) => setFname(text)}
					editable={editable}
				/>
			</View>
			<View style={styles.fieldContainer}>
				<Text>Last Name:</Text>
				<TextInput
					style={styles.input}
					value={lname}
					onChangeText={(text) => setLname(text)}
					editable={editable}
				/>
			</View>

      {isRecruiter && (
        <View style={styles.fieldContainer}>
          <Text>Company:</Text>
          <TextInput
            style={styles.input}
            value={company}
            onChangeText={(text) => setCompany(text)}
            editable={editable}
          />
        </View>
      )}

			{!isRecruiter && (
				<View style={styles.fieldContainer}>
					<Text>Experience:</Text>
					<TextInput
						style={styles.input}
						value={experience}
						onChangeText={(text) => setExperience(text)}
						editable={editable}
					/>
				</View>
			)}

			{!isRecruiter && (
				<View style={styles.fieldContainer}>
					<Text>Skills:</Text>
					<TextInput
						style={styles.input}
						value={skills}
						onChangeText={(text) => setSkills(text)}
						editable={editable}
					/>
				</View>
			)}

      <Button
        title={editable ? "Save" : "Edit"}
        onPress={editable ? handleSave : handleEdit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 8,
  },
});

export default ProfilePage;
