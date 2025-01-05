import React, { useEffect, useState } from "react";
import {
  getClassDetails,
  getClassStudents,
} from "../../../redux/sclassRelated/sclassHandle";

import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import { postClassAttendance } from "../../../redux/sclassRelated/sclassHandle";
import { useDispatch } from "react-redux";
import { updateStudentFields } from "../../../redux/studentRelated/studentHandle";

const ClassAttendanceSection = ({ classID, classDetails, students }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [newDate, setNewDate] = useState("");
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [studentId]: status,
    }));
    setHasChanges(true);
  };

  useEffect(() => {
    if (
      classDetails &&
      classDetails.attendanceDates &&
      JSON.stringify(classDetails.attendanceDates) !==
        JSON.stringify(attendanceDates)
    ) {
      setAttendanceDates(classDetails.attendanceDates);
      console.log(
        "Attendance dates initialized:",
        classDetails.attendanceDates
      );
    }
  }, [classDetails]);

  const handleAddNewDate = async () => {
    if (!newDate) return setMessage("Please select a date.");
    setIsSaving(true);

    try {
      await dispatch(postClassAttendance(classID, newDate));

      setAttendanceDates((prevDates) => {
        if (prevDates.includes(newDate)) return prevDates;
        return [...prevDates, newDate];
      });

      await dispatch(getClassDetails(classID, "Sclass"));

      setMessage("Date added successfully!");
      setNewDate(""); // Clear the input field
    } catch (error) {
      console.error("Error adding date:", error);
      setMessage("Failed to add date.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDateSelect = (dateObject) => {
    setSelectedDate(dateObject);

    const updatedAttendance = {};
    students.forEach((student) => {
      const attendanceRecord = student.attendance.find(
        (record) => record.attendanceDate === dateObject._id
      );
      updatedAttendance[student._id] = attendanceRecord
        ? attendanceRecord.status
        : "No Data";
    });

    setAttendance(updatedAttendance);
  };

  useEffect(() => {
    console.log("AttendanceDates updated:", attendanceDates);
  }, [attendanceDates]);

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      for (const [studentId, status] of Object.entries(attendance)) {
        const fields = {
          subName: "",
          status,
          attendanceDate: selectedDate._id,
        };

        await dispatch(
          updateStudentFields(studentId, fields, "StudentAttendance")
        );
      }

      setHasChanges(false);
      await dispatch(getClassStudents(classID));
      console.log("Attendance saved successfully for all students!");
    } catch (error) {
      console.error("Error saving attendance:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 3,
        bgcolor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Attendance for Class:{" "}
        {classDetails ? classDetails.sclassName : "Loading..."}
      </Typography>

      {/* Add New Date Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add New Attendance Date
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Select Date"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ bgcolor: "white" }}
          />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNewDate}
          disabled={isSaving}
          sx={{ px: 4, py: 1 }}
        >
          {isSaving ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add Date"
          )}
        </Button>
        {message && (
          <Typography variant="body2" sx={{ mt: 2, color: "green" }}>
            {message}
          </Typography>
        )}
      </Paper>

      {/* Attendance Dates List */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Attendance Dates
        </Typography>
        <List
          sx={{
            maxHeight: 200,
            overflowY: "auto",
            bgcolor: "white",
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          {attendanceDates.length > 0 ? (
            attendanceDates.map((dateObject) => (
              <ListItem
                key={dateObject.date}
                button
                onClick={() => handleDateSelect(dateObject)}
                sx={{ "&:hover": { bgcolor: "#f0f0f0" }, mb: 1 }}
              >
                <ListItemText
                  primary={new Date(dateObject.date).toLocaleDateString()}
                />
                <Divider />
              </ListItem>
            ))
          ) : (
            <Typography sx={{ p: 2, textAlign: "center", color: "#666" }}>
              No dates found
            </Typography>
          )}
        </List>
      </Paper>

      {/* Selected Date Attendance */}
      {selectedDate && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Attendance for {new Date(selectedDate.date).toLocaleDateString()}
          </Typography>
          <Box>
            {students.map((student) => (
              <Box
                key={student._id}
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Typography sx={{ flex: 1 }}>{student.name}</Typography>
                <Select
                  value={attendance[student._id]}
                  onChange={(e) =>
                    handleAttendanceChange(student._id, e.target.value)
                  }
                  sx={{ width: 150 }}
                >
                  <MenuItem value="Present">Present</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                  <MenuItem value="Sick">Sick</MenuItem>
                  <MenuItem value="No Data" disabled>
                    No Data
                  </MenuItem>
                </Select>
              </Box>
            ))}
          </Box>

          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAttendance}
            disabled={!hasChanges || isSaving}
            sx={{ mt: 3 }}
          >
            {isSaving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Attendance"
            )}
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ClassAttendanceSection;
