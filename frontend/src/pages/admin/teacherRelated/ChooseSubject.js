import React, { useEffect, useState } from 'react'
import {
    Box,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography,
    Paper,
    Button,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Tooltip
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacherFreeClassSubjects, getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateTeachSubject } from '../../../redux/teacherRelated/teacherHandle';
import { GreenButton, PurpleButton } from '../../../components/buttonStyles';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockIcon from '@mui/icons-material/Lock';

const ChooseSubject = ({ situation }) => {
    const params = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [classID, setClassID] = useState("");
    const [teacherID, setTeacherID] = useState("");
    const [loader, setLoader] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { teacherDetails } = useSelector((state) => state.teacher);

    useEffect(() => {
        console.log(params)
        if (situation === "Norm") {
            setClassID(params.id);
            const classID = params.id;
            dispatch(getSubjectList(classID, "ClassSubjects"));
        }
        else if (situation === "Teacher") {
            const { classID, teacherID } = params;
            setClassID(classID);
            setTeacherID(teacherID);
            dispatch(getSubjectList(classID, "ClassSubjects"));
        }
    }, [situation, params, dispatch]);

    const isTeacherAssignedToSubject = (subject) => {
        if (!teacherDetails?.classSubjects) return false;

        return teacherDetails.classSubjects.some(classData =>
            classData.subjects.some(sub => sub._id === subject._id)
        );
    };

    const handleSubjectAction = (subject) => {
        setSelectedSubject(subject);
        setErrorMessage("");

        // Check if this teacher is already assigned to this subject
        if (isTeacherAssignedToSubject(subject)) {
            setErrorMessage("You are already assigned to this subject");
            return;
        }

        if (subject.teacherName) {
            // If subject has a teacher, show confirmation
            setOpenConfirmDialog(true);
        } else {
            // If no teacher, directly proceed with assignment
            updateSubjectHandler(teacherID, subject._id);
        }
    };

    const handleConfirmAction = () => {
        updateSubjectHandler(teacherID, selectedSubject._id);
        setOpenConfirmDialog(false);
    };

    const updateSubjectHandler = (teacherId, subjectId) => {
        setLoader(true);
        dispatch(updateTeachSubject(teacherId, subjectId))
            .then(() => {
                navigate("/Admin/teachers");
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setLoader(false);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" component="div">
                        Subjects List - {subjectsList?.[0]?.className || 'Loading...'}
                    </Typography>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
                    )}
                    <PurpleButton
                        variant="contained"
                        onClick={() => navigate("/Admin/addsubject/" + classID)}
                    >
                        Add New Subject
                    </PurpleButton>
                </Stack>

                <TableContainer>
                    <Table aria-label="subjects table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>No.</StyledTableCell>
                                <StyledTableCell align="center">Subject Name</StyledTableCell>
                                <StyledTableCell align="center">Subject Code</StyledTableCell>
                                <StyledTableCell align="center">Current Teacher</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(subjectsList) && subjectsList.length > 0 ? (
                                subjectsList.map((subject, index) => {
                                    const isAlreadyAssigned = isTeacherAssignedToSubject(subject);
                                    return (
                                        <StyledTableRow key={subject._id}>
                                            <StyledTableCell>{index + 1}</StyledTableCell>
                                            <StyledTableCell align="center">{subject.subName}</StyledTableCell>
                                            <StyledTableCell align="center">{subject.subCode}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                {subject.teacherName || 'Not Assigned'}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title={isAlreadyAssigned ? "Already assigned to this subject" : ""}>
                                                        <span>
                                                            <Button
                                                                variant="contained"
                                                                color={subject.teacherName ? "primary" : "success"}
                                                                startIcon={isAlreadyAssigned ? <LockIcon /> :
                                                                    subject.teacherName ? <EditIcon /> : <PersonAddIcon />}
                                                                onClick={() => handleSubjectAction(subject)}
                                                                disabled={loader || isAlreadyAssigned}
                                                            >
                                                                {loader ? (
                                                                    <div className="load"></div>
                                                                ) : isAlreadyAssigned ?
                                                                    'Already Assigned' :
                                                                    subject.teacherName ?
                                                                        'Change Teacher' :
                                                                        'Assign Teacher'
                                                                }
                                                            </Button>
                                                        </span>
                                                    </Tooltip>
                                                </Stack>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })
                            ) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={5} align="center">
                                        <Typography variant="subtitle1" color="textSecondary">
                                            No subjects found for this class
                                        </Typography>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Confirmation Dialog only when subject has existing teacher */}
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            >
                <DialogTitle>
                    Confirm Teacher Change
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        This subject ({selectedSubject?.subName}) is currently assigned to {selectedSubject?.teacherName}.
                        Are you sure you want to reassign it?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
                    <Button onClick={handleConfirmAction} color="primary" variant="contained">
                        Confirm Change
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ChooseSubject;