import { Box, Modal, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Login from "../page/Login";

export default function ApplyModal(props) {
  const { user } = useSelector((store) => store.user);
  const [apiLoading, setAPILoading] = useState(false);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  let style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  async function confirmApply() {
    try {
      setAPILoading(true);
      const access_token = localStorage.getItem("access_token");
      let data = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/applicant`,
        { job: props.clickedjob._id },
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );
      setAPILoading(false);
      props.handleClose();
      console.log({ data });
    } catch (error) {
      // console.log(error);
      setAPILoading(false);
      if (error.response.status === 400) {
        setIsAlreadyApplied(true);
      }
    }
  }

  if (apiLoading) {
    return (
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button className="btn btn-success" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span className="sr-only">inprogress...</span>
          </button>
        </Box>
      </Modal>
    );
  }

  //   default
  let myJSX = (
    <>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        mucho grasias
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        suuuuuiii...
      </Typography>
    </>
  );

  //   if no login then display login form as modal
  if (Object.keys(user).length === 0) {
    myJSX = (
      <>
        <h1 className="text-capitalize">login first</h1>
        <Login />
      </>
    );
    style = { ...style, width: "90%", height: "90vh" };
  }

  //   if login but not jobseeker then warning
  else if (user.role !== "jobseeker") {
    myJSX = (
      <Typography
        id="modal-modal-title"
        variant="h6"
        component="h2"
        className="text-danger text-capitalize"
      >
        only jobseeker can apply !!!
      </Typography>
    );
  }
  //   both pass then display user credential
  else {
    if (isAlreadyApplied) {
      myJSX = <h1>already applied</h1>;
    } else {
      myJSX = (
        <>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div>user: {user.name}</div>
            <div>email : {user.email}</div>
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            component="div"
          >
            <div>if every thing ok ?</div>
            <button className="btn btn-success" onClick={confirmApply}>
              confirm
            </button>
          </Typography>
        </>
      );
    }
  }

  return (
    <Modal
      open={props.open}
      onClose={() => {
        props.handleClose();
        setIsAlreadyApplied(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger p-0 rounded-circle"
            onClick={() => {
              props.handleClose();
              setIsAlreadyApplied(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
        </div>
        {myJSX}
      </Box>
    </Modal>
  );
}
