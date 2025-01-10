import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { uploadFile, clearUploadState } from "../../../redux/studentRelated/uploadSlice";
import { CircularProgress } from "@mui/material";

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;
  const { sclassesList } = useSelector((state) => state.sclass);
  const uploadState = useSelector((state) => state.upload);
  const { status: uploadStatus, message: uploadMessage, error: uploadError } = uploadState;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");
  const [sclassName, setSclassName] = useState("");
  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const adminID = currentUser?._id || ""; // Handle potential undefined currentUser
  const role = "Student";
  const attendance = [];

  useEffect(() => {
    if (situation === "Class") {
      setSclassName(params.id);
    }
  }, [params.id, situation]);

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const changeHandler = (event) => {
    if (event.target.value === "Select Class") {
      setClassName("Select Class");
      setSclassName("");
    } else {
      const selectedClass = sclassesList.find(
        (classItem) => classItem.sclassName === event.target.value
      );
      setClassName(selectedClass.sclassName);
      setSclassName(selectedClass._id);
    }
  };

  const fields = {
    name,
    email,
    password,
    sclassName,
    adminID,
    role,
    attendance,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!sclassName) {
      setMessage("Please select a classname");
      setShowPopup(true);
    } else {
      setLoader(true);
      dispatch(registerUser(fields, role));
    }
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate(-1);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      setShowPopup(true);
      return;
    }
    const formData = new FormData();
    formData.append("file", file); // Append the file
    formData.append("adminID", adminID);
    setLoader(true);
    // console.log([...formData.entries()]);
    dispatch(uploadFile(formData));
  };

  useEffect(() => {
    if (uploadStatus === "succeeded") {
      setLoader(false);
      setMessage(uploadMessage);
      setShowPopup(true);
      dispatch(clearUploadState());
      navigate(-1);
    } else if (uploadStatus === "failed") {
      setLoader(false);
      setMessage(uploadError || "An error occurred during upload");
      setShowPopup(true);
      dispatch(clearUploadState());
    }
  }, [uploadStatus, uploadMessage, uploadError, navigate, dispatch]);

  return (
    <>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Student</span>
          <label>Name</label>
          <input
            className="registerInput"
            type="text"
            placeholder="Enter student's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />

          {situation === "Student" && (
            <>
              <label>Class</label>
              <select
                className="registerInput"
                value={className}
                onChange={changeHandler}
                required
              >
                <option value="Select Class">Select Class</option>
                {sclassesList.map((classItem, index) => (
                  <option key={index} value={classItem.sclassName}>
                    {classItem.sclassName}
                  </option>
                ))}
              </select>
            </>
          )}

          <label>Email</label>
          <input
            className="registerInput"
            type="email"
            placeholder="Enter student's email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>Password</label>
          <input
            className="registerInput"
            type="password"
            placeholder="Enter student's password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? <CircularProgress size={24} color="inherit" /> : "Add"}
          </button>
        </form>
      </div>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
      <h1 style={{ textAlign: "center" }}>Or</h1>

      <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
        <h1>Upload Students</h1>

        <form onSubmit={handleFileSubmit} style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Upload Excel File:
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>
          <button className="uploadButton" type="submit" disabled={loader}>
            {loader ? <CircularProgress size={24} color="inherit" /> : "Upload"}
          </button>
        </form>
        <Popup
          message={message}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      </div>
    </>
  );
};

export default AddStudent;