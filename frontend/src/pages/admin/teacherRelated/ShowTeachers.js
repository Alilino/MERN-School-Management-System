import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import {
    Paper, Table, TableBody, TableContainer,
    TableHead, TablePagination, Button, Box, IconButton,
    Stack, Chip, Collapse, Typography
} from '@mui/material';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const deleteHandler = (deleteID, address) => {
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    // Function to remove duplicates from classSubjects array
    const getUniqueClassSubjects = (classSubjects) => {
        if (!classSubjects) return [];

        // Create a Map to store unique classes with their subjects
        const classMap = new Map();

        classSubjects.forEach(classData => {
            const classId = classData.class._id;

            if (!classMap.has(classId)) {
                classMap.set(classId, {
                    ...classData,
                    subjects: new Map() 
                });
            }

            const classEntry = classMap.get(classId);
            classData.subjects?.forEach(subject => {
                if (!classEntry.subjects.has(subject.subName)) {
                    classEntry.subjects.set(subject.subName, subject);
                }
            });
        });

        return Array.from(classMap.values()).map(classData => ({
            ...classData,
            subjects: Array.from(classData.subjects.values())
        }));
    };

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'classSubjects', label: 'Classes & Subjects', minWidth: 250 },
    ];

    const rows = teachersList.map((teacher) => ({
        name: teacher.name,
        classSubjects: getUniqueClassSubjects(teacher.classSubjects || []),
        id: teacher._id,
    }));

    const ClassSubjectsCell = ({ classSubjects, teacherId }) => {
        const [expandedClass, setExpandedClass] = useState(null);

        return (
            <Stack spacing={1}>
                {classSubjects.map((classData, index) => (
                    <Box key={classData.class._id || index} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            onClick={() => setExpandedClass(expandedClass === index ? null : index)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <IconButton size="small">
                                {expandedClass === index ?
                                    <KeyboardArrowUpIcon /> :
                                    <KeyboardArrowDownIcon />}
                            </IconButton>
                            <Typography variant="subtitle2">
                                {classData.class.sclassName}
                            </Typography>
                        </Stack>

                        <Collapse in={expandedClass === index}>
                            <Box sx={{ pl: 4, pt: 1 }}>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {classData.subjects.map((subject, sIndex) => (
                                        <Chip
                                            key={`${subject.subName}-${sIndex}`}
                                            label={subject.subName}
                                            size="small"
                                            sx={{ m: 0.5 }}
                                        />
                                    ))}
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => navigate(`/Admin/teachers/choosesubject/${classData.class._id}/${teacherId}`)}
                                    >
                                        <AddCircleOutlineIcon />
                                    </IconButton>
                                </Stack>
                            </Box>
                        </Collapse>
                    </Box>
                ))}
                <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    size="small"
                    onClick={() => navigate(`/Admin/teachers/chooseclass/${teacherId}`)}
                    sx={{ alignSelf: 'flex-start' }}
                >
                    Add New Class
                </Button>
            </Stack>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    } else if (response) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <GreenButton variant="contained" onClick={() => navigate("/Admin/teachers/chooseclass")}>
                    Add Teacher
                </GreenButton>
            </Box>
        );
    } else if (error) {
        console.log(error);
    }

    const paginationProps = {
        rowsPerPageOptions: [5, 10, 25, 100],
        component: "div",
        count: rows.length,
        rowsPerPage,
        page,
        onPageChange: (event, newPage) => setPage(newPage),
        onRowsPerPageChange: (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <StyledTableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                            <StyledTableCell align="center">
                                Actions
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <StyledTableRow hover tabIndex={-1} key={row.id}>
                                    <StyledTableCell>{row.name}</StyledTableCell>
                                    <StyledTableCell>
                                        <ClassSubjectsCell
                                            classSubjects={row.classSubjects}
                                            teacherId={row.id}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton onClick={() => deleteHandler(row.id, "Teacher")}>
                                            <PersonRemoveIcon color="error" />
                                        </IconButton>
                                        <BlueButton
                                            variant="contained"
                                            onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}
                                        >
                                            View
                                        </BlueButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination {...paginationProps} />

            <SpeedDialTemplate
                actions={[
                    {
                        icon: <PersonAddAlt1Icon color="primary" />,
                        name: 'Add New Teacher',
                        action: () => navigate("/Admin/teachers/chooseclass")
                    },
                    {
                        icon: <PersonRemoveIcon color="error" />,
                        name: 'Delete All Teachers',
                        action: () => deleteHandler(currentUser._id, "Teachers")
                    }
                ]}
            />
            <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
            />
        </Paper>
    );
};

export default ShowTeachers;