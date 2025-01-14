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

  const [formData, setFormData] = useState({
    institutes: "",
    studentName: "",
    courseName: "",
    batchNo: "",
    email: "",
    address: "",
    CNIC: "",
    totalFee: "",
    feeRecieved: "",
    pendingFee: "",
    recoveryDate: "",
    paymentMethod: "",
    studentImage: null,
  });

  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const adminID = currentUser?._id || "";
  const role = "Student";
  const attendance = [];

  // Ensure Sclass is initialized to match param or set other context
  const sclassNameParam = situation === "Class" ? params.id : "";

  useEffect(() => {
    if (situation === "Class") {
      setFormData({ ...formData, sclassName: sclassNameParam });
    }
  }, [params.id, situation]);

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const changeHandler = (event) => {
    if (event.target.value === "Select Class") {
      setFormData({ ...formData, className: "Select Class", sclassName: "" });
    } else {
      const selectedClass = sclassesList.find(
        (classItem) => classItem.sclassName === event.target.value
      );
      setFormData({
        ...formData,
        className: selectedClass.sclassName,
        sclassName: selectedClass._id,
      });
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!formData.sclassName) {
      setMessage("Please select a classname");
      setShowPopup(true);
    } else {
      setLoader(true);
      // Add remaining fields to formData based on your form structure
      dispatch(registerUser({ ...formData, adminID, role, attendance }, role));
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

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      setShowPopup(true);
      return;
    }
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("adminID", adminID);
    setLoader(true);
    dispatch(uploadFile(uploadFormData));
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
      <div
        className="register"
        style={{
          padding: "40px",
          display: "flex",
          flexDirection: "column",  // To align the elements vertically
          justifyContent: "flex-start", // Ensures content is aligned at the top
          maxHeight: "80vh",
          overflowY: "auto",  // Allows scrolling if content overflows
          gap: "20px",  // Adds space between elements to prevent overlap
          width: "100%",
          alignItems: "flex-start", // Ensures left alignment of form fields
        }}
      >
        <form
          className="registerForm"
          onSubmit={submitHandler}
          style={{
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "flex-start",
          }}
        >
          <h2
            className="formTitle"
            style={{
              textAlign: "center",
              marginBottom: "10px",
              fontSize: "24px",
            }}
          >
            Add Student
          </h2>

          <div>
            <label>Name</label>
            <input
              className="registerInput"
              type="text"
              name="studentName"
              placeholder="Enter student's name"
              value={formData.studentName}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          {situation === "Student" && (
            <div>
              <label>Class</label>
              <select
                className="registerInput"
                name="className"
                value={formData.className}
                onChange={changeHandler}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "8px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              >
                <option value="Select Class">Select Class</option>
                {sclassesList.map((classItem, index) => (
                  <option key={index} value={classItem.sclassName}>
                    {classItem.sclassName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label>Email</label>
            <input
              className="registerInput"
              type="email"
              name="email"
              placeholder="Enter student's email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              className="registerInput"
              type="password"
              name="password"
              placeholder="Enter student's password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <div>
            <label>Address</label>
            <input
              className="registerInput"
              type="text"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <div>
            <label>CNIC</label>
            <input
              className="registerInput"
              type="text"
              name="CNIC"
              placeholder="Enter CNIC"
              value={formData.CNIC}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <div>
            <label>Total Fee</label>
            <input
              className="registerInput"
              type="number"
              name="totalFee"
              placeholder="Enter total fee"
              value={formData.totalFee}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <div>
            <label>Fee Received</label>
            <input
              className="registerInput"
              type="number"
              name="feeRecieved"
              placeholder="Enter fee received"
              value={formData.feeRecieved}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <div>
            <label>Pending Fee</label>
            <input
              className="registerInput"
              type="number"
              name="pendingFee"
              placeholder="Enter pending fee"
              value={formData.pendingFee}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <div>
            <label>Recovery Date</label>
            <input
              className="registerInput"
              type="date"
              name="recoveryDate"
              value={formData.recoveryDate}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <div>
            <label>Payment Method</label>
            <select
              className="registerInput"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div>
            <label>Student Image</label>
            <input
              type="file"
              name="studentImage"
              onChange={(e) =>
                setFormData({ ...formData, studentImage: e.target.files[0] })
              }
              className="registerInput"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <button
            className="registerButton"
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "#4caf50",
              color: "#fff",
              cursor: "pointer",
              border: "none",
              borderRadius: "5px",
              width: "100%",
              marginTop: "20px",
            }}
            disabled={loader}
          >
            {loader ? <CircularProgress size={24} color="inherit" /> : "Add Student"}
          </button>
        </form>
      </div>

      <h1 style={{ textAlign: "center", marginTop: "30px" }}>Or</h1>

      {/* File Upload Section */}
      <div
        style={{
          padding: "40px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <h2>Upload Students</h2>
          <form
            onSubmit={handleFileSubmit}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              alignItems: "flex-start",
            }}
          >
            <label
              style={{
                width: "100%",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Upload Excel File:
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  width: "100%",
                }}
              />
            </label>

            <button
              type="submit"
              disabled={loader}
              style={{
                padding: "12px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              {loader ? <CircularProgress size={24} color="inherit" /> : "Upload Students"}
            </button>
          </form>
        </div>
      </div>

      {showPopup && (
        <Popup
          message={message}
          setMessage={setMessage}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
        />
      )}
    </>
  );
};

export default AddStudent;
