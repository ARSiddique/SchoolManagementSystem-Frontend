import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper, Box, Checkbox
} from '@mui/material';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate';

const SeeComplains = () => {

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }; const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const complainColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'complaint', label: 'Complaint', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
  ];
  console.log("Complains List:", complainsList);
  // const complainRows = complainsList && complainsList.length > 0 && complainsList.map((complain) => {
  //   const date = new Date(complain.date);
  //   const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
  //   return {
  //     user: complain?.user?.name || "Unknown User",
  //     complaint: complain.complaint,
  //     date: dateString,
  //     id: complain._id,
  //   };
  // });

  const complainRows = complainsList && complainsList.length > 0 && complainsList.map((complain) => {
    console.log("Complain object:", complain); // Debugging

    const date = new Date(complain.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";

    return {
      user: complain.user && complain.user.studentName ? complain.user.studentName : "Unknown User",
      complaint: complain.complaint || "No complaint",
      date: dateString,
      id: complain._id,
    };
  });
  const ComplainButtonHaver = ({ row }) => {
    return (
      <>
        <Checkbox {...label} />
      </>
    );
  };

  return (
    <>
      {loading ?
        <div>Loading...</div>
        :
        <>
          {response ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              No Complains Right Now
            </Box>
            :
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {Array.isArray(complainsList) && complainsList.length > 0 &&
                <TableTemplate buttonHaver={ComplainButtonHaver} columns={complainColumns} rows={complainRows} />
              }
            </Paper>
          }
        </>
      }
    </>
  );
};

export default SeeComplains;