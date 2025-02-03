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
    paymentId: "",
    csrName: "",
    admissionOfficer: "",
    branch: "",
    password: "",
    sclassName: "",
    enrollmentDate: "",
  });

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const adminID = currentUser?._id || "";
  const role = "Student";
  const attendance = [];

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
    const file = e.target.files[0];
    setFile(file);
    setFormData({ ...formData, studentImage: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
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
          flexDirection: "column",
          justifyContent: "flex-start",
          maxHeight: "80vh",
          overflowY: "auto",
          gap: "20px",
          width: "100%",
          alignItems: "flex-start",
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

          {/* Institutes Input */}
          <div>
            <label>Institute</label>
            <input
              className="registerInput"
              type="text"
              name="institutes"
              placeholder="Enter institute"
              value={formData.institutes}
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

          {/* Student Name Input */}
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

          {/* Course Name Input */}
          <div>
            <label>Course</label>
            <input
              className="registerInput"
              type="text"
              name="courseName"
              placeholder="Enter course name"
              value={formData.courseName}
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

          {/* Batch Number Input */}
          <div>
            <label>Batch No</label>
            <input
              className="registerInput"
              type="text"
              name="batchNo"
              placeholder="Enter batch number"
              value={formData.batchNo}
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

          {/* Email Input */}
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

          {/* Address Input */}
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

          {/* CNIC Input */}
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

          {/* Total Fee Input */}
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

          {/* Fee Received Input */}
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

          {/* Pending Fee Input */}
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

          {/* Recovery Date Input */}
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
          {/* Enrollment Date Input */}
          <div>
            <label>Enrollment Date</label>
            <input
              className="registerInput"
              type="date"
              name="enrollmentDate"
              value={formData.enrollmentDate}
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

          {/* Payment Method Input */}
          <div>
            <label>Payment Method</label>
            <input
              className="registerInput"
              type="text"
              name="paymentMethod"
              placeholder="Enter payment method"
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
            />
          </div>

          {/* Payment ID Input */}
          <div>
            <label>Payment ID</label>
            <input
              className="registerInput"
              type="text"
              name="paymentId"
              placeholder="Enter payment ID"
              value={formData.paymentId}
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

          {/* CSR Name Input */}
          <div>
            <label>CSR Name</label>
            <input
              className="registerInput"
              type="text"
              name="csrName"
              placeholder="Enter CSR name"
              value={formData.csrName}
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

          {/* Admission Officer Input */}
          <div>
            <label>Admission Officer</label>
            <input
              className="registerInput"
              type="text"
              name="admissionOfficer"
              placeholder="Enter admission officer name"
              value={formData.admissionOfficer}
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

          {/* Branch Input */}
          <div>
            <label>Branch</label>
            <input
              className="registerInput"
              type="text"
              name="branch"
              placeholder="Enter branch name"
              value={formData.branch}
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

          {/* Password Input */}
          <div>
            <label>Password</label>
            <input
              className="registerInput"
              type="password"
              name="password"
              placeholder="Enter password"
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

          {/* Class Selection Dropdown */}
          <div>
            <label>Select Class</label>
            <select
              className="registerInput"
              value={formData.sclassName}
              onChange={changeHandler}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <option value="">Select Class</option>
              {sclassesList?.map((sclass) => (
                <option key={sclass._id} value={sclass.sclassName}>
                  {sclass.sclassName}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "150px",
                  marginTop: "10px",
                  borderRadius: "10px",
                }}
              />
            )}
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: "20px" }}>
            <button
              type="submit"
              className="registerButton"
              disabled={loader}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "5px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loader ? (
                <CircularProgress size={24} style={{ color: "#fff" }} />
              ) : (
                "Add Student"
              )}
            </button>
          </div>
        </form>
      </div>

      <h1 style={{ textAlign: "center", marginTop: "30px" }}>Or</h1>

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
