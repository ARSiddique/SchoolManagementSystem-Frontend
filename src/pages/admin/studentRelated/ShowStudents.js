import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllStudents } from "../../../redux/studentRelated/studentHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { Paper, Box, IconButton } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { BlackButton, BlueButton, GreenButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popup from "../../../components/Popup";
import { formatDate } from "../../../utils/formatDate";

const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentsList, loading, error, response } = useSelector((state) => state.student);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllStudents(currentUser._id));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllStudents(currentUser._id));
    });
  };

  const studentColumns = [
    { id: "studentImage", label: "Image", minWidth: 100 },
    { id: "studentName", label: "Name", minWidth: 170 },
    { id: "email", label: "Email address", minWidth: 170 },
    { id: "address", label: "Address", minWidth: 170 },
    { id: "CNIC", label: "CNIC", minWidth: 170 },
    { id: "courseName", label: "Course", minWidth: 170 },
    { id: "batchNo", label: "Batch no", minWidth: 170 },
    { id: "enrollmentDate", label: "Enrollment date", minWidth: 170 },
    { id: "totalFee", label: "Total fee", minWidth: 170 },
    { id: "feeRecieved", label: "Fee received", minWidth: 170 },
    { id: "pendingFee", label: "Pending fee", minWidth: 170 },
    { id: "recoveryDate", label: "Recovery date", minWidth: 170 },
    { id: "csrName", label: "CSR", minWidth: 170 },
    { id: "admissionOfficer", label: "Admission officer", minWidth: 170 },
    { id: "institutes", label: "Institute", minWidth: 170 },
    { id: "branch", label: "Branch", minWidth: 170 },
    { id: "paymentMethod", label: "Payment method", minWidth: 170 },
    { id: "paymentId", label: "Payment ID", minWidth: 170 },
  ];

  const studentRows =
    studentsList &&
    studentsList.length > 0 &&
    studentsList.map((student) => {
      return {
        studentImage: student?.studentImage ? (
          <img src={student.studentImage} alt="Student" width="50" height="50" />

        ) : (
          <span>No Image</span>
        ),
        studentName: student?.studentName,
        email: student?.email,
        address: student?.address,
        CNIC: student?.CNIC,
        courseName: student?.courseName,
        batchNo: student?.batchNo,
        enrollmentDate: student?.enrollmentDate && formatDate(student?.enrollmentDate),
        totalFee: student?.totalFee,
        feeRecieved: student?.feeRecieved,
        pendingFee: student?.pendingFee,
        recoveryDate: student?.recoveryDate && formatDate(student?.recoveryDate),
        csrName: student?.csrName,
        admissionOfficer: student?.admissionOfficer,
        institutes: student?.institutes,
        branch: student?.branch,
        paymentMethod: student?.paymentMethod,
        paymentId: student?.paymentId,
        id: student?._id,
      };
    });

  const StudentButtonHaver = ({ row }) => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };

    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Student")}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
      </>
    );
  };

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Add New Student",
      action: () => navigate("/Admin/addstudents"),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Delete All Students",
      action: () => deleteHandler(currentUser._id, "Students"),
    },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {response ? (
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/addstudents")}
              >
                Add Students
              </GreenButton>
            </Box>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              {Array.isArray(studentsList) && studentsList.length > 0 && (
                <TableTemplate
                  buttonHaver={StudentButtonHaver}
                  columns={studentColumns}
                  rows={studentRows}
                />
              )}
              <SpeedDialTemplate actions={actions} />
            </Paper>
          )}
        </>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};
export default ShowStudents