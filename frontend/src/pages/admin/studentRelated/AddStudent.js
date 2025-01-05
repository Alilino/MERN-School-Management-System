import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector((state) => state.user);
    const { status, currentUser, response } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [formData, setFormData] = useState({
        name: "",
        rollNum: "",
        password: "",
        sclassName: "",
        dateOfBirth: "",
        fatherName: "",
        fatherPhone: "",
        fatherEmail: "",
        motherName: "",
        motherPhone: "",
        motherEmail: "",
        emergencyPhone: "",
        active: true,
    });

    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const adminID = currentUser?._id;

    useEffect(() => {
        if (situation === "Class") {
            setFormData((prev) => ({ ...prev, sclassName: params.id }));
        }
    }, [params.id, situation]);

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClassChange = (e) => {
        console.log(e)
        const selectedClass = sclassesList.find(
            (classItem) => classItem.sclassName === e.target.value
        );
    
        setFormData((prev) => ({
            ...prev,
            sclassName: selectedClass ? selectedClass._id : "",
            className : e.target.value
        }));
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.sclassName) {
            setMessage("Please select a classname");
            setShowPopup(true);
            return;
        }
        setLoader(true);
        const fields = {
            ...formData,
            adminID,
            role: "Student",
            attendance: [],
        };
        dispatch(registerUser(fields, "Student"));
    };

    useEffect(() => {
        if (status === "added") {
            dispatch(underControl());
            navigate(-1);
        } else if (status === "failed" || status === "error") {
            setMessage(response || "Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, response, dispatch]);

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", padding: 3, border: "1px solid #ccc", borderRadius: 2, mt: 4 }}>
            <Typography variant="h5" mb={2} align="center">
                Add Student
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    {situation === "Student" && (
                        <Grid item xs={12}>
                            <Select
                                value={formData.className || ""}
                                onChange={handleClassChange}
                                fullWidth
                                displayEmpty
                                required
                            >
                                <MenuItem value="" disabled>
                                    Select Class
                                </MenuItem>
                                {sclassesList.map((classItem) => (
                                    <MenuItem key={classItem._id} value={classItem.sclassName}>
                                        {classItem.sclassName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    )}

                    <Grid item xs={6}>
                        <TextField
                            label="Roll Number"
                            name="rollNum"
                            type="number"
                            value={formData.rollNum}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Father Name"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Father Phone"
                            name="fatherPhone"
                            value={formData.fatherPhone}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Father Email"
                            name="fatherEmail"
                            type="email"
                            value={formData.fatherEmail}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Mother Name"
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Mother Phone"
                            name="motherPhone"
                            value={formData.motherPhone}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Mother Email"
                            name="motherEmail"
                            type="email"
                            value={formData.motherEmail}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Emergency Phone"
                            name="emergencyPhone"
                            value={formData.emergencyPhone}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Select
                            name="active"
                            value={formData.active ? "true" : "false"}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, active: e.target.value === "true" }))
                            }
                            fullWidth
                        >
                            <MenuItem value="true">Active</MenuItem>
                            <MenuItem value="false">Inactive</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <Box mt={3} textAlign="center">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loader}
                        startIcon={loader && <CircularProgress size={20} color="inherit" />}
                    >
                        Add Student
                    </Button>
                </Box>
            </form>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};



export default AddStudent