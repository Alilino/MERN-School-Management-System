import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Importing useTranslation for i18n support

import {
  getClassDetails,
  getClassStudents,
  getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import {
  Box,
  Container,
  Typography,
  Tab,
  IconButton,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import {
  BlueButton,
  GreenButton,
  PurpleButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ClassAttendanceSection from "./classAttendance";
import SchoolIcon from "@mui/icons-material/School"; // Example Icon
import PeopleIcon from "@mui/icons-material/People"; // Example Icon
import SubjectIcon from "@mui/icons-material/Subject"; // Example Icon
import classScheduleImage from "../../../assets/schedule.jpg";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";

const ClassDetails = () => {
  const { t } = useTranslation(); // Hook for translations
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    subjectsList,
    sclassStudents,
    sclassDetails,
    loading,
    error,
    response,
    getresponse,
  } = useSelector((state) => state.sclass);

  const { teachersList } = useSelector((state) => state.teacher);

  const classID = params.id;

  useEffect(() => {
    dispatch(getClassDetails(classID, "Sclass"));
    dispatch(getSubjectList(classID, "ClassSubjects"));
    dispatch(getClassStudents(classID));
    dispatch(getAllTeachers("677495828aa83cca0211697b"));
  }, [dispatch, classID]);

  if (error) {
    console.log(error);
  }

  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    setMessage(t("deleteDisabled")); // Use translation for disabled delete message
    setShowPopup(true);
  };

  const subjectColumns = [
    { id: "name", label: t("subjectName"), minWidth: 170 },
    { id: "code", label: t("subjectCode"), minWidth: 100 },
  ];

  const subjectRows =
    subjectsList &&
    subjectsList.length > 0 &&
    subjectsList.map((subject) => {
      return {
        name: subject.subName,
        code: subject.subCode,
        id: subject._id,
      };
    });

  const SubjectsButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => {
            navigate(`/Admin/class/subject/${classID}/${row.id}`);
          }}
        >
          {t("view")}
        </BlueButton>
      </>
    );
  };

  const subjectActions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: t("addNewSubject"),
      action: () => navigate("/Admin/addsubject/" + classID),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: t("deleteAllSubjects"),
      action: () => deleteHandler(classID, "SubjectsClass"),
    },
  ];

  const ClassSubjectsSection = () => {
    return (
      <>
        {response ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
            }}
          >
            <GreenButton
              variant="contained"
              onClick={() => navigate("/Admin/addsubject/" + classID)}
            >
              {t("addSubjects")}
            </GreenButton>
          </Box>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              {t("subjectsList")}:
            </Typography>

            <TableTemplate
              buttonHaver={SubjectsButtonHaver}
              columns={subjectColumns}
              rows={subjectRows}
            />
            <SpeedDialTemplate actions={subjectActions} />
          </>
        )}
      </>
    );
  };

  const studentColumns = [
    { id: "name", label: t("name"), minWidth: 170 },
    { id: "rollNum", label: t("rollNumber"), minWidth: 100 },
  ];

  const studentRows = sclassStudents.map((student) => {
    return {
      name: student.name,
      rollNum: student.rollNum,
      id: student._id,
    };
  });

  const StudentsButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Student")}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          {t("view")}
        </BlueButton>
      </>
    );
  };

  const studentActions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: t("addNewStudent"),
      action: () => navigate("/Admin/class/addstudents/" + classID),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: t("deleteAllStudents"),
      action: () => deleteHandler(classID, "StudentsClass"),
    },
  ];

  const ClassStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
            }}
          >
            <GreenButton
              variant="contained"
              onClick={() => navigate("/Admin/class/addstudents/" + classID)}
            >
              {t("addStudents")}
            </GreenButton>
          </Box>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              {t("studentsList")}:
            </Typography>

            <TableTemplate
              buttonHaver={StudentsButtonHaver}
              columns={studentColumns}
              rows={studentRows}
            />
            <SpeedDialTemplate actions={studentActions} />
          </>
        )}
      </>
    );
  };

  const teacherColumns = [{ id: "name", label: t("name"), minWidth: 170 }];

  const teacherRows = teachersList
    .filter((teacher) => teacher.teachSclass?._id === classID)
    .map((teacher) => ({
      name: teacher.name,
      id: teacher._id,
    }));

  const TeachersButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Teacher")}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/teachers/teacher/" + row.id)}
        >
          {t("view")}
        </BlueButton>
      </>
    );
  };

  const teacherActions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: t("addNewTeacher"),
      action: () => navigate("/Admin/class/addteacher/" + classID),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: t("deleteAllTeachers"),
      action: () => deleteHandler(classID, "TeachersClass"),
    },
  ];

  const ClassTeachersSection = () => {
    return (
      <>
        {getresponse ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
            }}
          >
            <GreenButton
              variant="contained"
              onClick={() => navigate("/Admin/class/addteacher/")}
            >
              {t("addTeachers")}
            </GreenButton>
          </Box>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              {t("teachersList")}:
            </Typography>

            <TableTemplate
              buttonHaver={TeachersButtonHaver}
              columns={teacherColumns}
              rows={teacherRows}
            />
            <SpeedDialTemplate actions={teacherActions} />
          </>
        )}
      </>
    );
  };

  const ClassDetailsSection = () => {
    const numberOfSubjects = subjectsList.length;
    const numberOfStudents = sclassStudents.length;

    return (
      <Box sx={{ padding: 3 }}>
        <Paper sx={{ padding: 4, boxShadow: 3, backgroundColor: "#fafafa" }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            {t("classDetails")}
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {/* Class Name Section */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                sx={{ fontStyle: "italic" }}
              >
                {t("thisIsClass")} {sclassDetails && sclassDetails.sclassName}
              </Typography>
            </Grid>

            {/* Number of Subjects */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" align="center" gutterBottom>
                <SchoolIcon sx={{ verticalAlign: "middle", marginRight: 1 }} />
                {t("numberOfSubjects")}: {numberOfSubjects}
              </Typography>
            </Grid>

            {/* Number of Students */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" align="center" gutterBottom>
                <PeopleIcon sx={{ verticalAlign: "middle", marginRight: 1 }} />
                {t("numberOfStudents")}: {numberOfStudents}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", marginTop: 3 }}>
            {getresponse && (
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                sx={{
                  marginRight: 2,
                  backgroundColor: "#388e3c",
                  "&:hover": { backgroundColor: "#2c6f29" },
                }}
              >
                <PeopleIcon sx={{ marginRight: 1 }} />
                {t("addStudents")}
              </GreenButton>
            )}

            {response && (
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/addsubject/" + classID)}
                sx={{
                  backgroundColor: "#388e3c",
                  "&:hover": { backgroundColor: "#2c6f29" },
                }}
              >
                <SubjectIcon sx={{ marginRight: 1 }} />
                {t("addSubjects")}
              </GreenButton>
            )}
          </Box>
        </Paper>
      </Box>
    );
  };

  const schedules = [
    {
      className: "Jahre / Klasse 3 13 - 11",
      schedule: [
        {
          time: "11:00 bis 11:40",
          subject: "Religion / دين",
          teacher: "Teacher A",
        },
        {
          time: "11:45 bis 12:25",
          subject: "Qur'an / قرآن",
          teacher: "Teacher B",
        },
        {
          time: "12:50 bis 13:30",
          subject: "Arabisch / عربي",
          teacher: "Teacher C",
        },
      ],
    },
    {
      className: "Ab 14 Jahre / Klasse 5",
      schedule: [
        {
          time: "11:00 bis 11:40",
          subject: "Religion / دين",
          teacher: "Teacher D",
        },
        {
          time: "11:45 bis 12:25",
          subject: "Arabisch / عربي",
          teacher: "Teacher E",
        },
        {
          time: "12:50 bis 13:30",
          subject: "Qur'an / قرآن",
          teacher: "Teacher F",
        },
      ],
    },
    // Add more classes as needed
  ];

  const ClassScheduleSection = () => {
    return (
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Class Schedules
        </Typography>
        {schedules.map((classSchedule, index) => (
          <Box key={index} sx={{ marginBottom: 4 }}>
            <Typography variant="h5" gutterBottom>
              {classSchedule.className}
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Time (Uhrzeit)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Subject (Fach)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Teacher (Lehrer)</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classSchedule.schedule.map((entry, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{entry.time}</TableCell>
                    <TableCell>{entry.subject}</TableCell>
                    <TableCell>{entry.teacher}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ))}
      </Container>
    );
  };

  return (
    <>
      {loading ? (
        <div>{t("loading")}</div>
      ) : (
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  sx={{
                    position: "fixed",
                    width: "100%",
                    bgcolor: "background.paper",
                    zIndex: 1,
                  }}
                >
                  <Tab label={t("details")} value="1" />
                  <Tab label={t("subjects")} value="2" />
                  <Tab label={t("students")} value="3" />
                  <Tab label={t("teachers")} value="4" />
                  <Tab label={t("schedule")} value="5" />
                  <Tab label={t("attendance")} value="6" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <ClassDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <ClassSubjectsSection />
                </TabPanel>
                <TabPanel value="3">
                  <ClassStudentsSection />
                </TabPanel>
                <TabPanel value="4">
                  <ClassTeachersSection />
                </TabPanel>
                <TabPanel value="5">
                  <ClassScheduleSection />
                </TabPanel>
                <TabPanel value="6">
                  <ClassAttendanceSection
                    classID={classID}
                    classDetails={sclassDetails}
                    students={sclassStudents}
                  />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ClassDetails;
