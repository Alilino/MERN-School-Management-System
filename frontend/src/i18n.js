// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Common
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      login: "Login",
      register: "Register",
      dashboard: "Dashboard",

      // Homepage
      welcome: "Welcome to School Management System",
      chooseUser: "Choose User Type",

      // User Types
      admin: "Administrator",
      student: "Student",
      teacher: "Teacher",

      // Login/Register
      name: "Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      submit: "Submit",

      // Navigation
      home: "Home",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      classes: "Classes",
      subjects: "Subjects",
      teachers: "Teachers",
      students: "Students",
      notices: "Notices",
      complains: "Complains",

      totalStudents: "Total Students",
      totalClasses: "Total Classes",
      totalTeachers: "Total Teachers",
      feesCollection: "Fees Collection",

      // Class Details Section
      className: "Class Name",
      schedule: "Schedule",
      numberOfSubjects: "Number of Subjects",
      numberOfStudents: "Number of Students",
      classDetails: "Class Details",
      studentsList: "Students List",
      addStudents: "Add Students",
      addSubjects: "Add Subjects",
      subjectName: "Subject Name",
      subjectCode: "Subject Code",
      view: "View",
      deleteSubject: "Delete Subject",
      deleteAllSubjects: "Delete All Subjects",
      deleteStudent: "Delete Student",
      deleteAllStudents: "Delete All Students",
      attendance: "Attendance",
      addNewSubject: "Add New Subject",
      addNewStudent: "Add New Student",
      classAttendance: "Class Attendance",
    },
  },
  de: {
    translation: {
      // Common
      darkMode: "Dunkelmodus",
      lightMode: "Hellmodus",
      login: "Anmelden",
      register: "Registrieren",
      dashboard: "Armaturenbrett",

      // Homepage
      welcome: "Willkommen beim Schulverwaltungssystem",
      chooseUser: "Wählen Sie den Benutzertyp",

      // User Types
      admin: "Administrator",
      student: "Schüler",
      teacher: "Lehrer",

      // Login/Register
      name: "Name",
      email: "E-Mail",
      password: "Passwort",
      confirmPassword: "Passwort bestätigen",
      submit: "Einreichen",

      // Navigation
      home: "Startseite",
      profile: "Profil",
      settings: "Einstellungen",
      logout: "Abmelden",
      classes: "Klassen",
      subjects: "Fächer",
      teachers: "Lehrer",
      students: "Schüler",
      notices: "Mitteilungen",
      complains: "Beschwerden",

      totalStudents: "Gesamtzahl der Schüler",
      totalClasses: "Gesamtzahl der Klassen",
      totalTeachers: "Gesamtzahl der Lehrer",
      feesCollection: "Gebührensammlung",

      // Class Details Section
      className: "Klassenname",
      schedule: "Schulplan",
      numberOfSubjects: "Anzahl der Fächer",
      numberOfStudents: "Anzahl der Schüler",
      classDetails: "Klassendetails",
      studentsList: "Liste der Studenten",
      addStudents: "Schüler hinzufügen",
      addSubjects: "Fächer hinzufügen",
      subjectName: "Fachname",
      subjectCode: "Fachcode",
      view: "Ansehen",
      deleteSubject: "Fach löschen",
      deleteAllSubjects: "Alle Fächer löschen",
      deleteStudent: "Schüler löschen",
      deleteAllStudents: "Alle Schüler löschen",
      attendance: "Anwesenheit",
      addNewSubject: "Neues Fach hinzufügen",
      addNewStudent: "Neuen Schüler hinzufügen",
      classAttendance: "Klassenzusatz",
    },
  },
  ar: {
    translation: {
      // Common
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      login: "تسجيل الدخول",
      register: "تسجيل",
      dashboard: "لوحة التحكم",

      // Homepage
      welcome: "مرحباً بكم في نظام إدارة المدرسة",
      chooseUser: "اختر نوع المستخدم",

      // User Types
      admin: "مدير",
      student: "طالب",
      teacher: "مدرس",

      // Login/Register
      name: "اسم",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      submit: "إرسال",

      // Navigation
      home: "الرئيسية",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      classes: "الفصول الدراسية",
      subjects: "المواد الدراسية",
      teachers: "المعلمين",
      students: "الطلاب",
      notices: "الإعلانات",
      complains: "الشكاوى",

      totalStudents: "إجمالي الطلاب",
      totalClasses: "إجمالي الفصول الدراسية",
      totalTeachers: "إجمالي المعلمين",
      feesCollection: "جمع الرسوم",

      // Class Details Section
      className: "اسم الفصل",
      schedule: "الجَدْوَلُ الدِّراسِيُّ",
      numberOfSubjects: "عدد المواد",
      numberOfStudents: "عدد الطلاب",
      classDetails: "تفاصيل الفصل",
      studentsList: "",
      addStudents: "إضافة طلاب",
      addSubjects: "إضافة مواد",
      subjectName: "اسم المادة",
      subjectCode: "رمز المادة",
      view: "عرض",
      deleteSubject: "حذف المادة",
      deleteAllSubjects: "حذف جميع المواد",
      deleteStudent: "حذف الطالب",
      deleteAllStudents: "حذف جميع الطلاب",
      attendance: "الحضور",
      addNewSubject: "إضافة مادة جديدة",
      addNewStudent: "إضافة طالب جديد",
      classAttendance: "حضور الفصل",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en", // default language
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

window.t = (key) => i18n.t(key);

export default i18n;
