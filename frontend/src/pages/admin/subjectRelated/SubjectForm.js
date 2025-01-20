import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../../../components/Popup";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const AddSubject = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, response, error, currentUser } = useSelector((state) => state.user);

  const [subjects, setSubjects] = useState([{ subName: "", beginTime: "", endTime: "" }]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const sclassName = params.id;
  const adminID = currentUser?._id;

  const handleChange = (index, field) => (e) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = e.target.value;
    setSubjects(newSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subName: "", beginTime: "", endTime: "" }]);
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    const fields = {
      sclassName,
      adminID,
      subjects: subjects.map((subject) => ({
        subName: subject.subName,
        beginTime: subject.beginTime,
        endTime: subject.endTime,
      })),
    };

    dispatch(addStuff(fields, "Subject"));
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate("/Admin/subjects");
    } else if (status === "failed") {
      setMessage(response || "Failed to add subjects");
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, response, dispatch]);

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        mt: 4,
      }}
    >
      <Typography variant="h5" mb={2} align="center">
        Add Subjects
      </Typography>

      <form onSubmit={handleSubmit}>
        {subjects.map((subject, index) => (
          <Box key={index} mb={3} p={2} sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="subtitle1" mb={1}>
              Subject {index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Subject Name"
                  value={subject.subName}
                  onChange={handleChange(index, "subName")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Begin Time"
                  type="time"
                  value={subject.beginTime}
                  onChange={handleChange(index, "beginTime")}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="End Time"
                  type="time"
                  value={subject.endTime}
                  onChange={handleChange(index, "endTime")}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              {index > 0 && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveSubject(index)}
                    fullWidth
                  >
                    Remove
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
        ))}

        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddSubject}
            fullWidth
          >
            Add Another Subject
          </Button>
        </Box>
        <Box mt={3} textAlign="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loader}
            startIcon={loader && <CircularProgress size={20} color="inherit" />}
          >
            Save
          </Button>
        </Box>
      </form>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default AddSubject;
