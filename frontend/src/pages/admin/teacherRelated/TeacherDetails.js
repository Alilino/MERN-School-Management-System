import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Container, Typography, Card, CardContent,
  Box, CircularProgress, Stack, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TeacherDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

  useEffect(() => {
    dispatch(getTeacherDetails(params.id));
  }, [dispatch, params.id]);

  if (error) {
    console.log(error);
  }

  const handleAddSubject = (classId) => {
    navigate(`/Admin/teachers/choosesubject/${classId}/${teacherDetails?._id}`);
  };

  const handleAddClass = () => {
    navigate(`/Admin/teachers/chooseclass/${teacherDetails?._id}`);
  };

  const getUniqueClassSubjects = (classSubjects) => {
    if (!classSubjects) return [];

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

  const uniqueClassSubjects = getUniqueClassSubjects(teacherDetails?.classSubjects);

  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Container sx={{ py: 4 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, padding: 2 }}>
            <CardContent>
              <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
                Teacher Details
              </Typography>

              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="h6">
                  <strong>Teacher Name:</strong> {teacherDetails?.name || "N/A"}
                </Typography>

                {uniqueClassSubjects.length > 0 ? (
                  <Stack spacing={3}>
                    {uniqueClassSubjects.map((classData, index) => (
                      <Card
                        key={classData.class._id || index}
                        sx={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: 2,
                          boxShadow: 1
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" color="primary">
                            {classData.class.sclassName}
                          </Typography>
                          <Divider sx={{ my: 2 }} />

                          <Box sx={{ ml: 4 }}>
                            {classData.subjects?.length > 0 ? (
                              <Stack spacing={1.5}>
                                {classData.subjects.map((subject, sIndex) => (
                                  <Box
                                    key={sIndex}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      position: 'relative',
                                      pl: 3,
                                      '&:before': {
                                        content: '""',
                                        position: 'absolute',
                                        left: 0,
                                        top: '50%',
                                        width: '20px',
                                        height: '1px',
                                        backgroundColor: '#1976d2'
                                      }
                                    }}
                                  >
                                    <Typography>
                                      {subject.subName}
                                      {subject.sessions && ` (${subject.sessions} sessions)`}
                                    </Typography>
                                  </Box>
                                ))}
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() => handleAddSubject(classData.class._id)}
                                  startIcon={<AddIcon />}
                                  sx={{ ml: 3, width: 'fit-content', mt: 1 }}
                                >
                                  Add Another Subject
                                </Button>
                              </Stack>
                            ) : (
                              <Box>
                                <Typography color="text.secondary" gutterBottom>
                                  No subjects assigned
                                </Typography>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleAddSubject(classData.class._id)}
                                  startIcon={<AddIcon />}
                                >
                                  Add Subject
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: "center", py: 3 }}>
                    <Typography color="text.secondary" gutterBottom>
                      No classes assigned yet
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddClass}
                    startIcon={<AddIcon />}
                  >
                    Assign Teacher to a Class
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      )}
    </>
  );
};

export default TeacherDetails;