import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApplyModal from "../components/ApplyModal";
const parse = require("html-react-parser");

export default function JobPage() {
  const { id } = useParams();
  const [data, setData] = useState({});
  // modal state and function
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function getItem() {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/jobs/${id}`
      );
      console.log(data);
      setData(data[0]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getItem();
    // eslint-disable-next-line
  }, []);

  // loading
  if (Object.keys(data).length === 0) {
    return (
      <h1>
        loading...<span className="spinner-border"></span>
      </h1>
    );
  }

  return (
    <>
      <div className="container">
        <div className="row m-2 justify-content-center">
          <div className="col-md-2 p-0">
            <img
              src={`${process.env.REACT_APP_SERVER_URL}/job_img/${data.image}`}
              alt="job_img"
              style={{ width: "100%", height: "200px" }}
            />
          </div>
          <div
            className="col-md-6 text-capitalize"
            style={{ backgroundColor: "#c0c0c0aa" }}
          >
            <h1>{data.title}</h1>
            <h2>by : {data.employer[0].name}</h2>
            <button
              className="btn btn-success"
              type="button"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={() => {
                // console.log(el);
                handleOpen();
              }}
            >
              apply
            </button>
          </div>
          {data.description && (
            <div className="col-md-8">
              <h3 className="text-capitalize">description : </h3>
              <div className="w-50" style={{ wordWrap: "break-word" }}>
                {parse(data.description)}
              </div>
            </div>
          )}
        </div>
      </div>
      <ApplyModal open={open} handleClose={handleClose} clickedjob={data} />
    </>
  );
}
